import Foundation
import HealthKit

final class HealthKitService {
    private let healthStore = HKHealthStore()
    private var hasRequestedAuthorization = false

    private var readTypes: Set<HKObjectType> {
        var types = Set<HKObjectType>()
        [
            HKQuantityTypeIdentifier.heartRate,
            .bodyMass,
            .stepCount,
            .activeEnergyBurned,
            .appleExerciseTime
        ].forEach { identifier in
            if let type = HKObjectType.quantityType(forIdentifier: identifier) {
                types.insert(type)
            }
        }
        return types
    }

    func readTodayJSON() async throws -> String {
        try await readSnapshotJSON(days: 1)
    }

    func readRecentJSON(days requestedDays: Int) async throws -> String {
        let days = min(max(requestedDays, 1), 30)
        return try await readSnapshotJSON(days: days)
    }

    func requestAuthorizationJSON() async throws -> String {
        try await requestAuthorizationIfNeeded(force: true)
        let payload = [
            "ok": true,
            "generatedAt": ISO8601DateFormatter().string(from: Date())
        ] as [String: Any]
        let data = try JSONSerialization.data(withJSONObject: payload, options: [.sortedKeys])
        guard let json = String(data: data, encoding: .utf8) else {
            throw NativeHealthError.encodingFailed
        }
        return json
    }

    private func readSnapshotJSON(days: Int) async throws -> String {
        try await requestAuthorizationIfNeeded()

        let calendar = Calendar.current
        let now = Date()
        let todayStart = calendar.startOfDay(for: now)
        let firstDayStart = calendar.date(byAdding: .day, value: -(days - 1), to: todayStart) ?? todayStart

        var summaries: [NativeHealthDaySummary] = []
        for offset in 0..<days {
            let start = calendar.date(byAdding: .day, value: offset, to: firstDayStart) ?? firstDayStart
            let end = calendar.date(byAdding: .day, value: 1, to: start) ?? now
            summaries.append(await daySummary(start: start, end: min(end, now)))
        }

        let snapshot = NativeHealthSnapshot(
            ok: true,
            generatedAt: ISO8601DateFormatter().string(from: now),
            range: NativeHealthRange(
                days: days,
                startDate: Self.dayKey(firstDayStart),
                endDate: Self.dayKey(now)
            ),
            today: summaries.last ?? .empty(date: Self.dayKey(now)),
            recent: summaries
        )

        let encoder = JSONEncoder()
        encoder.outputFormatting = [.sortedKeys]
        let data = try encoder.encode(snapshot)
        guard let json = String(data: data, encoding: .utf8) else {
            throw NativeHealthError.encodingFailed
        }
        return json
    }

    private func requestAuthorizationIfNeeded(force: Bool = false) async throws {
        guard HKHealthStore.isHealthDataAvailable() else {
            throw NativeHealthError.unavailable
        }
        guard force || !hasRequestedAuthorization else { return }
        try await healthStore.requestAuthorization(toShare: [], read: readTypes)
        hasRequestedAuthorization = true
    }

    private func daySummary(start: Date, end: Date) async -> NativeHealthDaySummary {
        async let heartRate = optionalHeartRateSummary(start: start, end: end)
        async let weight = optionalWeightSummary(start: start, end: end)
        async let steps = optionalCumulativeQuantity(.stepCount, unit: .count(), start: start, end: end)
        async let energy = optionalCumulativeQuantity(.activeEnergyBurned, unit: .kilocalorie(), start: start, end: end)
        async let exercise = optionalCumulativeQuantity(.appleExerciseTime, unit: .minute(), start: start, end: end)

        return await NativeHealthDaySummary(
            date: Self.dayKey(start),
            heartRate: heartRate,
            weight: weight,
            steps: steps,
            activeEnergyKcal: energy,
            exerciseMinutes: exercise
        )
    }

    private func optionalHeartRateSummary(start: Date, end: Date) async -> NativeHeartRateSummary {
        (try? await heartRateSummary(start: start, end: end)) ?? .empty
    }

    private func optionalWeightSummary(start: Date, end: Date) async -> NativeWeightSummary {
        (try? await weightSummary(start: start, end: end)) ?? .empty
    }

    private func optionalCumulativeQuantity(_ identifier: HKQuantityTypeIdentifier, unit: HKUnit, start: Date, end: Date) async -> Double? {
        try? await cumulativeQuantity(identifier, unit: unit, start: start, end: end)
    }

    private func heartRateSummary(start: Date, end: Date) async throws -> NativeHeartRateSummary {
        guard let type = HKObjectType.quantityType(forIdentifier: .heartRate) else {
            return .empty
        }
        let samples = try await quantitySamples(type: type, start: start, end: end)
        let unit = HKUnit.count().unitDivided(by: .minute())
        let values = samples.map { $0.quantity.doubleValue(for: unit) }
        return NativeHeartRateSummary(
            latest: samples.first.map { $0.quantity.doubleValue(for: unit) },
            min: values.min(),
            max: values.max(),
            avg: values.isEmpty ? nil : values.reduce(0, +) / Double(values.count),
            samples: values.count,
            unit: "bpm"
        )
    }

    private func weightSummary(start: Date, end: Date) async throws -> NativeWeightSummary {
        guard let type = HKObjectType.quantityType(forIdentifier: .bodyMass) else {
            return .empty
        }
        let samples = try await quantitySamples(type: type, start: start, end: end)
        let unit = HKUnit.gramUnit(with: .kilo)
        return NativeWeightSummary(
            latest: samples.first.map { $0.quantity.doubleValue(for: unit) },
            samples: samples.count,
            unit: "kg"
        )
    }

    private func quantitySamples(type: HKQuantityType, start: Date, end: Date) async throws -> [HKQuantitySample] {
        try await withCheckedThrowingContinuation { continuation in
            let predicate = HKQuery.predicateForSamples(withStart: start, end: end, options: .strictEndDate)
            let sort = NSSortDescriptor(key: HKSampleSortIdentifierEndDate, ascending: false)
            let query = HKSampleQuery(sampleType: type, predicate: predicate, limit: HKObjectQueryNoLimit, sortDescriptors: [sort]) { _, samples, error in
                if let error {
                    continuation.resume(throwing: error)
                    return
                }
                continuation.resume(returning: (samples ?? []).compactMap { $0 as? HKQuantitySample })
            }
            healthStore.execute(query)
        }
    }

    private func cumulativeQuantity(_ identifier: HKQuantityTypeIdentifier, unit: HKUnit, start: Date, end: Date) async throws -> Double? {
        guard let type = HKObjectType.quantityType(forIdentifier: identifier) else {
            return nil
        }
        return try await withCheckedThrowingContinuation { continuation in
            let predicate = HKQuery.predicateForSamples(withStart: start, end: end, options: .strictEndDate)
            let query = HKStatisticsQuery(quantityType: type, quantitySamplePredicate: predicate, options: .cumulativeSum) { _, statistics, error in
                if let error {
                    continuation.resume(throwing: error)
                    return
                }
                continuation.resume(returning: statistics?.sumQuantity()?.doubleValue(for: unit))
            }
            healthStore.execute(query)
        }
    }

    private static func dayKey(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.calendar = Calendar(identifier: .gregorian)
        formatter.locale = Locale(identifier: "en_US_POSIX")
        formatter.timeZone = .current
        formatter.dateFormat = "yyyy-MM-dd"
        return formatter.string(from: date)
    }
}

enum NativeHealthError: LocalizedError {
    case unavailable
    case encodingFailed

    var errorDescription: String? {
        switch self {
        case .unavailable:
            "当前设备不支持 HealthKit。"
        case .encodingFailed:
            "健康数据编码失败。"
        }
    }
}

struct NativeHealthSnapshot: Codable {
    let ok: Bool
    let generatedAt: String
    let range: NativeHealthRange
    let today: NativeHealthDaySummary
    let recent: [NativeHealthDaySummary]
}

struct NativeHealthRange: Codable {
    let days: Int
    let startDate: String
    let endDate: String
}

struct NativeHealthDaySummary: Codable {
    let date: String
    let heartRate: NativeHeartRateSummary
    let weight: NativeWeightSummary
    let steps: Double?
    let activeEnergyKcal: Double?
    let exerciseMinutes: Double?

    static func empty(date: String) -> NativeHealthDaySummary {
        NativeHealthDaySummary(
            date: date,
            heartRate: .empty,
            weight: .empty,
            steps: nil,
            activeEnergyKcal: nil,
            exerciseMinutes: nil
        )
    }
}

struct NativeHeartRateSummary: Codable {
    let latest: Double?
    let min: Double?
    let max: Double?
    let avg: Double?
    let samples: Int
    let unit: String

    static let empty = NativeHeartRateSummary(latest: nil, min: nil, max: nil, avg: nil, samples: 0, unit: "bpm")
}

struct NativeWeightSummary: Codable {
    let latest: Double?
    let samples: Int
    let unit: String

    static let empty = NativeWeightSummary(latest: nil, samples: 0, unit: "kg")
}

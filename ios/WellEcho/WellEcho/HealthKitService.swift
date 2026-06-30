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
        types.insert(HKObjectType.workoutType())
        if let sleepType = HKObjectType.categoryType(forIdentifier: .sleepAnalysis) {
            types.insert(sleepType)
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
        async let workouts = optionalWorkoutSummaries(start: start, end: end)
        async let sleep = optionalSleepSummaries(start: start, end: end)

        return await NativeHealthDaySummary(
            date: Self.dayKey(start),
            heartRate: heartRate,
            weight: weight,
            steps: steps,
            activeEnergyKcal: energy,
            exerciseMinutes: exercise,
            workouts: workouts,
            sleep: sleep
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

    private func optionalWorkoutSummaries(start: Date, end: Date) async -> [NativeWorkoutSummary] {
        (try? await workoutSummaries(start: start, end: end)) ?? []
    }

    private func optionalSleepSummaries(start: Date, end: Date) async -> [NativeSleepSummary] {
        (try? await sleepSummaries(start: start, end: end)) ?? []
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

    private func workoutSummaries(start: Date, end: Date) async throws -> [NativeWorkoutSummary] {
        let samples: [HKWorkout] = try await withCheckedThrowingContinuation { (continuation: CheckedContinuation<[HKWorkout], Error>) in
            let predicate = HKQuery.predicateForSamples(withStart: start, end: end, options: .strictEndDate)
            let sort = NSSortDescriptor(key: HKSampleSortIdentifierStartDate, ascending: true)
            let query = HKSampleQuery(sampleType: HKObjectType.workoutType(), predicate: predicate, limit: HKObjectQueryNoLimit, sortDescriptors: [sort]) { _, samples, error in
                if let error {
                    continuation.resume(throwing: error)
                    return
                }
                continuation.resume(returning: (samples ?? []).compactMap { $0 as? HKWorkout })
            }
            healthStore.execute(query)
        }

        return samples.map { workout in
            let energy = workout.totalEnergyBurned?.doubleValue(for: HKUnit.kilocalorie())
            let distance = workout.totalDistance?.doubleValue(for: HKUnit.meter())
            return NativeWorkoutSummary(
                id: workout.uuid.uuidString,
                activityType: workout.workoutActivityType.rawValue,
                activityName: Self.workoutActivityName(workout.workoutActivityType),
                startAt: Self.isoString(workout.startDate),
                endAt: Self.isoString(workout.endDate),
                durationMinutes: Self.roundDouble(workout.duration / 60, decimals: 1),
                activeEnergyKcal: energy.map { Self.roundDouble($0, decimals: 1) },
                distanceKm: distance.map { Self.roundDouble($0 / 1000, decimals: 2) },
                sourceName: workout.sourceRevision.source.name
            )
        }
    }

    private func sleepSummaries(start: Date, end: Date) async throws -> [NativeSleepSummary] {
        guard let type = HKObjectType.categoryType(forIdentifier: .sleepAnalysis) else {
            return []
        }
        let samples: [HKCategorySample] = try await withCheckedThrowingContinuation { (continuation: CheckedContinuation<[HKCategorySample], Error>) in
            let predicate = HKQuery.predicateForSamples(withStart: start, end: end, options: .strictEndDate)
            let sort = NSSortDescriptor(key: HKSampleSortIdentifierStartDate, ascending: true)
            let query = HKSampleQuery(sampleType: type, predicate: predicate, limit: HKObjectQueryNoLimit, sortDescriptors: [sort]) { _, samples, error in
                if let error {
                    continuation.resume(throwing: error)
                    return
                }
                continuation.resume(returning: (samples ?? []).compactMap { $0 as? HKCategorySample })
            }
            healthStore.execute(query)
        }

        var sessions: [[HKCategorySample]] = []
        let maxGap: TimeInterval = 90 * 60
        for sample in samples {
            guard sample.endDate > sample.startDate else { continue }
            if let last = sessions.indices.last,
               let previous = sessions[last].last,
               sample.startDate.timeIntervalSince(previous.endDate) <= maxGap {
                sessions[last].append(sample)
            } else {
                sessions.append([sample])
            }
        }

        return sessions.compactMap { session in
            guard !session.isEmpty else { return nil }
            let startAt = session.map(\.startDate).min() ?? start
            let endAt = session.map(\.endDate).max() ?? end
            var asleepMinutes = 0.0
            var inBedMinutes = 0.0
            for sample in session {
                let minutes = max(0, sample.endDate.timeIntervalSince(sample.startDate) / 60)
                if Self.isAsleepValue(sample.value) {
                    asleepMinutes += minutes
                }
                if sample.value == HKCategoryValueSleepAnalysis.inBed.rawValue {
                    inBedMinutes += minutes
                }
            }
            guard asleepMinutes > 0 || inBedMinutes > 0 else { return nil }
            let sourceName = session.first?.sourceRevision.source.name ?? ""
            return NativeSleepSummary(
                id: Self.stableIdentifier(["sleep", Self.isoString(startAt), Self.isoString(endAt), sourceName]),
                startAt: Self.isoString(startAt),
                endAt: Self.isoString(endAt),
                asleepMinutes: Self.roundDouble(asleepMinutes, decimals: 1),
                inBedMinutes: inBedMinutes > 0 ? Self.roundDouble(inBedMinutes, decimals: 1) : nil,
                sourceName: sourceName
            )
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

    private static func isoString(_ date: Date) -> String {
        let formatter = ISO8601DateFormatter()
        formatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        return formatter.string(from: date)
    }

    private static func roundDouble(_ value: Double, decimals: Int) -> Double {
        let factor = pow(10.0, Double(decimals))
        return (value * factor).rounded() / factor
    }

    private static func stableIdentifier(_ parts: [String]) -> String {
        let joined = parts.joined(separator: "|")
        return joined
            .replacingOccurrences(of: "[^A-Za-z0-9_-]+", with: "-", options: .regularExpression)
            .trimmingCharacters(in: CharacterSet(charactersIn: "-_"))
    }

    private static func isAsleepValue(_ value: Int) -> Bool {
        let legacyAsleepRawValue = 1
        if value == legacyAsleepRawValue {
            return true
        }
        if #available(iOS 16.0, *) {
            return [
                HKCategoryValueSleepAnalysis.asleepUnspecified.rawValue,
                HKCategoryValueSleepAnalysis.asleepCore.rawValue,
                HKCategoryValueSleepAnalysis.asleepDeep.rawValue,
                HKCategoryValueSleepAnalysis.asleepREM.rawValue
            ].contains(value)
        }
        return false
    }

    private static func workoutActivityName(_ type: HKWorkoutActivityType) -> String {
        switch type {
        case .running:
            return "跑步"
        case .walking:
            return "步行"
        case .cycling:
            return "骑行"
        case .swimming:
            return "游泳"
        case .traditionalStrengthTraining, .functionalStrengthTraining:
            return "力量训练"
        case .yoga:
            return "瑜伽"
        case .highIntensityIntervalTraining:
            return "高强度间歇训练"
        case .coreTraining:
            return "核心训练"
        case .dance:
            return "舞蹈"
        case .hiking:
            return "徒步"
        case .elliptical:
            return "椭圆机"
        case .rowing:
            return "划船"
        case .stairClimbing, .stairs:
            return "爬楼"
        case .basketball:
            return "篮球"
        case .soccer:
            return "足球"
        case .tennis:
            return "网球"
        case .badminton:
            return "羽毛球"
        case .mindAndBody:
            return "身心训练"
        default:
            return "健身"
        }
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
    let workouts: [NativeWorkoutSummary]
    let sleep: [NativeSleepSummary]

    static func empty(date: String) -> NativeHealthDaySummary {
        NativeHealthDaySummary(
            date: date,
            heartRate: .empty,
            weight: .empty,
            steps: nil,
            activeEnergyKcal: nil,
            exerciseMinutes: nil,
            workouts: [],
            sleep: []
        )
    }
}

struct NativeWorkoutSummary: Codable {
    let id: String
    let activityType: UInt
    let activityName: String
    let startAt: String
    let endAt: String
    let durationMinutes: Double
    let activeEnergyKcal: Double?
    let distanceKm: Double?
    let sourceName: String
}

struct NativeSleepSummary: Codable {
    let id: String
    let startAt: String
    let endAt: String
    let asleepMinutes: Double
    let inBedMinutes: Double?
    let sourceName: String
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

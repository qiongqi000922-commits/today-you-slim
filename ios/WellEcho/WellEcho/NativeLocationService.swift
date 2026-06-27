import CoreLocation
import Foundation

@MainActor
final class NativeLocationService: NSObject, CLLocationManagerDelegate {
    static let shared = NativeLocationService()

    private let manager = CLLocationManager()
    private var authorizationContinuation: CheckedContinuation<Bool, Never>?
    private var locationContinuation: CheckedContinuation<CLLocation, Error>?

    private override init() {
        super.init()
        manager.delegate = self
        manager.desiredAccuracy = kCLLocationAccuracyHundredMeters
        manager.distanceFilter = 100
    }

    func requestAuthorization() async -> Bool {
        guard CLLocationManager.locationServicesEnabled() else {
            return false
        }

        switch manager.authorizationStatus {
        case .authorizedAlways, .authorizedWhenInUse:
            return true
        case .notDetermined:
            return await withCheckedContinuation { continuation in
                authorizationContinuation = continuation
                manager.requestWhenInUseAuthorization()
            }
        case .denied, .restricted:
            return false
        @unknown default:
            return false
        }
    }

    func requestAuthorizationJSON() async throws -> String {
        let granted = await requestAuthorization()
        return try Self.jsonString([
            "ok": granted,
            "authorized": granted,
            "generatedAt": ISO8601DateFormatter().string(from: Date())
        ])
    }

    func currentLocationJSON() async throws -> String {
        guard await requestAuthorization() else {
            throw NativeLocationError.denied
        }

        let location = try await currentLocation()
        let altitude: Any = location.verticalAccuracy >= 0 ? location.altitude : NSNull()
        let altitudeAccuracy: Any = location.verticalAccuracy >= 0 ? location.verticalAccuracy : NSNull()
        let heading: Any = location.course >= 0 ? location.course : NSNull()
        let speed: Any = location.speed >= 0 ? location.speed : NSNull()

        return try Self.jsonString([
            "ok": true,
            "timestamp": Int(location.timestamp.timeIntervalSince1970 * 1000),
            "coords": [
                "latitude": location.coordinate.latitude,
                "longitude": location.coordinate.longitude,
                "accuracy": location.horizontalAccuracy,
                "altitude": altitude,
                "altitudeAccuracy": altitudeAccuracy,
                "heading": heading,
                "speed": speed
            ]
        ])
    }

    private func currentLocation() async throws -> CLLocation {
        if let location = manager.location,
           Date().timeIntervalSince(location.timestamp) < 300,
           location.horizontalAccuracy >= 0 {
            return location
        }

        return try await withCheckedThrowingContinuation { continuation in
            locationContinuation = continuation
            manager.requestLocation()
        }
    }

    func locationManagerDidChangeAuthorization(_ manager: CLLocationManager) {
        guard let continuation = authorizationContinuation else { return }
        switch manager.authorizationStatus {
        case .authorizedAlways, .authorizedWhenInUse:
            authorizationContinuation = nil
            continuation.resume(returning: true)
        case .denied, .restricted:
            authorizationContinuation = nil
            continuation.resume(returning: false)
        case .notDetermined:
            break
        @unknown default:
            authorizationContinuation = nil
            continuation.resume(returning: false)
        }
    }

    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        guard let continuation = locationContinuation else { return }
        locationContinuation = nil
        if let location = locations.last {
            continuation.resume(returning: location)
        } else {
            continuation.resume(throwing: NativeLocationError.unavailable)
        }
    }

    func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
        guard let continuation = locationContinuation else { return }
        locationContinuation = nil
        continuation.resume(throwing: error)
    }

    private static func jsonString(_ payload: [String: Any]) throws -> String {
        let data = try JSONSerialization.data(withJSONObject: payload, options: [.sortedKeys])
        guard let json = String(data: data, encoding: .utf8) else {
            throw NativeLocationError.encodingFailed
        }
        return json
    }
}

enum NativeLocationError: LocalizedError {
    case denied
    case unavailable
    case encodingFailed

    var errorDescription: String? {
        switch self {
        case .denied:
            "定位权限未开启。"
        case .unavailable:
            "暂时无法获取定位。"
        case .encodingFailed:
            "定位数据编码失败。"
        }
    }
}

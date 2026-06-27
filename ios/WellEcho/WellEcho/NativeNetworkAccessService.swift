import Foundation

enum NativeNetworkAccessService {
    static let maxAuthorizationRetries = 10

    static func isRecoverableNetworkAuthorizationError(_ error: Error) -> Bool {
        let nsError = error as NSError
        guard nsError.domain == NSURLErrorDomain else {
            return false
        }

        let code = URLError.Code(rawValue: nsError.code)
        switch code {
        case .notConnectedToInternet,
             .networkConnectionLost,
             .cannotConnectToHost,
             .cannotFindHost,
             .timedOut,
             .internationalRoamingOff,
             .dataNotAllowed:
            return true
        default:
            return false
        }
    }

    static func sleepBeforeRetry(attempt: Int) async throws {
        let delays: [UInt64] = [
            600_000_000,
            900_000_000,
            1_300_000_000,
            1_900_000_000,
            2_600_000_000,
            3_400_000_000,
            4_200_000_000,
            5_000_000_000,
            6_000_000_000,
            7_000_000_000
        ]
        let index = max(0, min(attempt - 1, delays.count - 1))
        try await Task.sleep(nanoseconds: delays[index])
    }
}

import Foundation

enum AppConfig {
    static let productionBaseURL = URL(string: "https://furby.top/")!
    static let testBaseURL = URL(string: "https://furby.top/test")!

    // Flip this while developing native-only features against the isolated test environment.
    static let useTestEnvironment = false

    static var webBaseURL: URL {
        useTestEnvironment ? testBaseURL : productionBaseURL
    }

    static let allowedWebHosts: Set<String> = [
        "furby.top",
        "www.furby.top"
    ]

    static let nativeCallbackScheme = "furby"
    static let nativeCallbackHost = "qq-auth"
    static let sessionCookieName = "jf_session"

    static func apiURL(_ path: String, queryItems: [URLQueryItem] = []) -> URL {
        var components = URLComponents(url: webBaseURL, resolvingAgainstBaseURL: false)!
        let basePath = components.path.trimmingCharacters(in: CharacterSet(charactersIn: "/"))
        let cleanPath = path.trimmingCharacters(in: CharacterSet(charactersIn: "/"))
        components.path = basePath.isEmpty ? "/\(cleanPath)" : "/\(basePath)/\(cleanPath)"
        components.queryItems = queryItems.isEmpty ? nil : queryItems
        return components.url!
    }

    static var qqNativeStartURL: URL {
        apiURL(
            "/api/auth/qq/start",
            queryItems: [
                URLQueryItem(name: "native", value: "1"),
                URLQueryItem(name: "mobile", value: "1")
            ]
        )
    }

    static func qqNativeCompletionURL(token: String) -> URL {
        apiURL(
            "/api/auth/qq/native-complete",
            queryItems: [
                URLQueryItem(name: "token", value: token)
            ]
        )
    }
}

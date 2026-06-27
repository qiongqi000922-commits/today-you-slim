import AuthenticationServices
import Foundation
import UIKit
import WebKit

enum NativeAuthError: LocalizedError {
    case cancelled
    case invalidAppleCredential
    case server(String)
    case invalidPasskeyOptions

    var errorDescription: String? {
        switch self {
        case .cancelled:
            NativeStrings.cancelled
        case .invalidAppleCredential:
            NativeStrings.invalidAppleCredential
        case .server(let message):
            message
        case .invalidPasskeyOptions:
            NativeStrings.invalidPasskeyOptions
        }
    }
}

@MainActor
final class NativeAuthService {
    private let urlSession: URLSession

    init() {
        let configuration = URLSessionConfiguration.default
        configuration.httpShouldSetCookies = true
        configuration.httpCookieAcceptPolicy = .always
        configuration.httpCookieStorage = .shared
        urlSession = URLSession(configuration: configuration)
    }

    func hasSessionCookie() async -> Bool {
        let webCookies = await webViewCookies()
        if webCookies.contains(where: isSessionCookie) {
            return true
        }
        return HTTPCookieStorage.shared.cookies?.contains(where: isSessionCookie) == true
    }

    func completeAppleSignIn(_ result: Result<ASAuthorization, Error>) async throws {
        let authorization: ASAuthorization
        do {
            authorization = try result.get()
        } catch {
            throw Self.isCancellation(error) ? NativeAuthError.cancelled : error
        }

        guard let credential = authorization.credential as? ASAuthorizationAppleIDCredential,
              let tokenData = credential.identityToken,
              let identityToken = String(data: tokenData, encoding: .utf8),
              !identityToken.isEmpty else {
            throw NativeAuthError.invalidAppleCredential
        }

        let fullName = [
            credential.fullName?.givenName,
            credential.fullName?.middleName,
            credential.fullName?.familyName
        ]
            .compactMap { $0?.trimmingCharacters(in: .whitespacesAndNewlines) }
            .filter { !$0.isEmpty }
            .joined(separator: " ")

        _ = try await postJSON(
            path: "/api/auth/apple/native",
            body: [
                "identityToken": identityToken,
                "fullName": fullName,
                "email": credential.email ?? ""
            ]
        )
        await syncCookiesToWebView()
    }

    func loginWithPasskey() async throws {
        await syncCookiesFromWebView()
        let options: NativePasskeyOptionsEnvelope = try await postJSONDecoded(
            path: "/api/passkeys/login/options",
            body: [:]
        )
        guard let rpId = options.publicKey.rpId,
              let challenge = Data(base64URLEncoded: options.publicKey.challenge) else {
            throw NativeAuthError.invalidPasskeyOptions
        }

        let provider = ASAuthorizationPlatformPublicKeyCredentialProvider(relyingPartyIdentifier: rpId)
        let request = provider.createCredentialAssertionRequest(challenge: challenge)
        request.userVerificationPreference = .required
        request.allowedCredentials = descriptorList(from: options.publicKey.allowCredentials)

        let authorization = try await NativePasskeyAuthorizationOperation(requests: [request]).perform()
        guard let credential = authorization.credential as? ASAuthorizationPlatformPublicKeyCredentialAssertion else {
            throw NativeAuthError.invalidPasskeyOptions
        }

        _ = try await postJSON(
            path: "/api/passkeys/login/verify",
            body: [
                "credential": passkeyAssertionPayload(credential)
            ]
        )
        await syncCookiesToWebView()
    }

    func registerUserPasskey(label: String?) async throws -> Data {
        await syncCookiesFromWebView()
        let cleanLabel = label?.trimmingCharacters(in: .whitespacesAndNewlines)
        let options: NativePasskeyOptionsEnvelope = try await postJSONDecoded(
            path: "/api/passkeys/register/options",
            body: [
                "label": cleanLabel?.isEmpty == false ? cleanLabel! : NativeStrings.defaultPasskeyLabel
            ]
        )
        guard let rpId = options.publicKey.rp?.id,
              let user = options.publicKey.user,
              let challenge = Data(base64URLEncoded: options.publicKey.challenge),
              let userID = Data(base64URLEncoded: user.id) else {
            throw NativeAuthError.invalidPasskeyOptions
        }

        let provider = ASAuthorizationPlatformPublicKeyCredentialProvider(relyingPartyIdentifier: rpId)
        let request = provider.createCredentialRegistrationRequest(
            challenge: challenge,
            name: user.name,
            userID: userID
        )
        request.displayName = user.displayName
        request.userVerificationPreference = .required
        request.attestationPreference = .none
        if #available(iOS 17.4, *) {
            request.excludedCredentials = descriptorList(from: options.publicKey.excludeCredentials)
        }

        let authorization = try await NativePasskeyAuthorizationOperation(requests: [request]).perform()
        guard let credential = authorization.credential as? ASAuthorizationPlatformPublicKeyCredentialRegistration else {
            throw NativeAuthError.invalidPasskeyOptions
        }

        let data = try await postJSON(
            path: "/api/passkeys/register/verify",
            body: [
                "credential": passkeyRegistrationPayload(credential)
            ]
        )
        await syncCookiesToWebView()
        return data
    }

    func clearSession() async {
        let httpCookies = HTTPCookieStorage.shared.cookies ?? []
        for cookie in httpCookies where isAllowedHostCookie(cookie) {
            HTTPCookieStorage.shared.deleteCookie(cookie)
        }

        let store = WKWebsiteDataStore.default().httpCookieStore
        let webCookies = await webViewCookies()
        for cookie in webCookies where isAllowedHostCookie(cookie) {
            await withCheckedContinuation { continuation in
                store.delete(cookie) {
                    continuation.resume()
                }
            }
        }
    }

    static func displayMessage(for error: Error) -> String {
        if isCancellation(error) {
            return "操作已取消。"
        }
        if NativeNetworkAccessService.isRecoverableNetworkAuthorizationError(error) {
            return NativeStrings.networkPermissionRequired
        }
        if let localized = (error as? LocalizedError)?.errorDescription, !localized.isEmpty {
            return localized
        }
        return error.localizedDescription
    }

    private func postJSON(path: String, body: [String: Any]) async throws -> Data {
        let data = try JSONSerialization.data(withJSONObject: body, options: [])
        var request = URLRequest(url: AppConfig.apiURL(path))
        request.httpMethod = "POST"
        request.httpShouldHandleCookies = true
        request.setValue("application/json; charset=utf-8", forHTTPHeaderField: "Content-Type")
        request.setValue("application/json", forHTTPHeaderField: "Accept")
        request.httpBody = data

        let (responseData, response) = try await dataWithNetworkAuthorizationRetry(for: request)
        storeCookies(from: response)
        try validate(response: response, data: responseData)
        return responseData
    }

    private func dataWithNetworkAuthorizationRetry(for request: URLRequest) async throws -> (Data, URLResponse) {
        var attempt = 0
        while true {
            do {
                return try await urlSession.data(for: request)
            } catch {
                guard NativeNetworkAccessService.isRecoverableNetworkAuthorizationError(error),
                      attempt < NativeNetworkAccessService.maxAuthorizationRetries else {
                    throw error
                }
                attempt += 1
                try await NativeNetworkAccessService.sleepBeforeRetry(attempt: attempt)
            }
        }
    }

    private func postJSONDecoded<T: Decodable>(path: String, body: [String: Any]) async throws -> T {
        let data = try await postJSON(path: path, body: body)
        return try JSONDecoder().decode(T.self, from: data)
    }

    private func validate(response: URLResponse, data: Data) throws {
        guard let http = response as? HTTPURLResponse else { return }
        guard (200..<400).contains(http.statusCode) else {
            if let message = try? JSONDecoder().decode(ServerErrorResponse.self, from: data).error, !message.isEmpty {
                throw NativeAuthError.server(message)
            }
            throw NativeAuthError.server(NativeStrings.loginFailed)
        }
    }

    private func storeCookies(from response: URLResponse) {
        guard let http = response as? HTTPURLResponse, let url = http.url else { return }
        let headers = http.allHeaderFields.reduce(into: [String: String]()) { result, entry in
            guard let key = entry.key as? String else { return }
            result[key] = String(describing: entry.value)
        }
        let cookies = HTTPCookie.cookies(withResponseHeaderFields: headers, for: url)
        HTTPCookieStorage.shared.setCookies(cookies, for: AppConfig.webBaseURL, mainDocumentURL: nil)
    }

    private func syncCookiesToWebView() async {
        let cookies = HTTPCookieStorage.shared.cookies ?? []
        let store = WKWebsiteDataStore.default().httpCookieStore
        for cookie in cookies where isAllowedHostCookie(cookie) {
            await withCheckedContinuation { continuation in
                store.setCookie(cookie) {
                    continuation.resume()
                }
            }
        }
    }

    private func syncCookiesFromWebView() async {
        let cookies = await webViewCookies()
        for cookie in cookies where isAllowedHostCookie(cookie) {
            HTTPCookieStorage.shared.setCookie(cookie)
        }
    }

    private func webViewCookies() async -> [HTTPCookie] {
        await withCheckedContinuation { continuation in
            WKWebsiteDataStore.default().httpCookieStore.getAllCookies { cookies in
                continuation.resume(returning: cookies)
            }
        }
    }

    private func isSessionCookie(_ cookie: HTTPCookie) -> Bool {
        cookie.name == AppConfig.sessionCookieName
            && isAllowedHostCookie(cookie)
            && (cookie.expiresDate ?? Date.distantFuture) > Date()
    }

    private func isAllowedHostCookie(_ cookie: HTTPCookie) -> Bool {
        AppConfig.allowedWebHosts.contains(cookie.domain.trimmingCharacters(in: CharacterSet(charactersIn: ".")).lowercased())
    }

    private static func isCancellation(_ error: Error) -> Bool {
        let nsError = error as NSError
        return nsError.domain == ASAuthorizationError.errorDomain
            && nsError.code == ASAuthorizationError.canceled.rawValue
    }

    private func descriptorList(from items: [NativePasskeyCredentialDescriptor]?) -> [ASAuthorizationPlatformPublicKeyCredentialDescriptor] {
        (items ?? []).compactMap { item in
            guard let id = Data(base64URLEncoded: item.id) else { return nil }
            return ASAuthorizationPlatformPublicKeyCredentialDescriptor(credentialID: id)
        }
    }

    private func passkeyRegistrationPayload(_ credential: ASAuthorizationPlatformPublicKeyCredentialRegistration) -> [String: Any] {
        var response: [String: Any] = [
            "clientDataJSON": credential.rawClientDataJSON.base64URLEncodedString()
        ]
        if let attestationObject = credential.rawAttestationObject {
            response["attestationObject"] = attestationObject.base64URLEncodedString()
        }
        return [
            "id": credential.credentialID.base64URLEncodedString(),
            "rawId": credential.credentialID.base64URLEncodedString(),
            "type": "public-key",
            "response": response
        ]
    }

    private func passkeyAssertionPayload(_ credential: ASAuthorizationPlatformPublicKeyCredentialAssertion) -> [String: Any] {
        var response: [String: Any] = [
            "clientDataJSON": credential.rawClientDataJSON.base64URLEncodedString(),
            "authenticatorData": credential.rawAuthenticatorData.base64URLEncodedString(),
            "signature": credential.signature.base64URLEncodedString()
        ]
        if !credential.userID.isEmpty {
            response["userHandle"] = credential.userID.base64URLEncodedString()
        }
        return [
            "id": credential.credentialID.base64URLEncodedString(),
            "rawId": credential.credentialID.base64URLEncodedString(),
            "type": "public-key",
            "response": response
        ]
    }
}

struct ServerErrorResponse: Decodable {
    let error: String
}

struct NativePasskeyOptionsEnvelope: Decodable {
    let ok: Bool
    let publicKey: NativePasskeyPublicKeyOptions
}

struct NativePasskeyPublicKeyOptions: Decodable {
    let challenge: String
    let rp: NativePasskeyRelyingParty?
    let user: NativePasskeyUser?
    let rpId: String?
    let allowCredentials: [NativePasskeyCredentialDescriptor]?
    let excludeCredentials: [NativePasskeyCredentialDescriptor]?
}

struct NativePasskeyRelyingParty: Decodable {
    let id: String
    let name: String?
}

struct NativePasskeyUser: Decodable {
    let id: String
    let name: String
    let displayName: String?
}

struct NativePasskeyCredentialDescriptor: Decodable {
    let type: String?
    let id: String
    let transports: [String]?
}

extension Data {
    init?(base64URLEncoded value: String) {
        var base64 = value
            .replacingOccurrences(of: "-", with: "+")
            .replacingOccurrences(of: "_", with: "/")
        let padding = (4 - base64.count % 4) % 4
        if padding > 0 {
            base64 += String(repeating: "=", count: padding)
        }
        guard let data = Data(base64Encoded: base64) else { return nil }
        self = data
    }

    func base64URLEncodedString() -> String {
        base64EncodedString()
            .replacingOccurrences(of: "+", with: "-")
            .replacingOccurrences(of: "/", with: "_")
            .replacingOccurrences(of: "=", with: "")
    }
}

@MainActor
final class NativePasskeyAuthorizationOperation: NSObject, ASAuthorizationControllerDelegate, ASAuthorizationControllerPresentationContextProviding {
    private let requests: [ASAuthorizationRequest]
    private var continuation: CheckedContinuation<ASAuthorization, Error>?
    private var controller: ASAuthorizationController?

    init(requests: [ASAuthorizationRequest]) {
        self.requests = requests
    }

    func perform() async throws -> ASAuthorization {
        try await withCheckedThrowingContinuation { continuation in
            self.continuation = continuation
            let controller = ASAuthorizationController(authorizationRequests: requests)
            self.controller = controller
            controller.delegate = self
            controller.presentationContextProvider = self
            controller.performRequests()
        }
    }

    func authorizationController(controller: ASAuthorizationController, didCompleteWithAuthorization authorization: ASAuthorization) {
        continuation?.resume(returning: authorization)
        finish()
    }

    func authorizationController(controller: ASAuthorizationController, didCompleteWithError error: Error) {
        continuation?.resume(throwing: NativeAuthService.displayMessage(for: error).isEmpty ? error : error)
        finish()
    }

    func presentationAnchor(for controller: ASAuthorizationController) -> ASPresentationAnchor {
        UIApplication.shared.connectedScenes
            .compactMap { $0 as? UIWindowScene }
            .flatMap(\.windows)
            .first { $0.isKeyWindow } ?? ASPresentationAnchor()
    }

    private func finish() {
        continuation = nil
        controller = nil
    }
}

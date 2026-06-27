import AVFoundation
import SwiftUI
import UIKit
import WebKit

struct WebShellView: UIViewRepresentable {
    @EnvironmentObject private var routeCoordinator: NativeRouteCoordinator

    let initialURL: URL
    let onNativeSessionEnded: () -> Void

    init(initialURL: URL, onNativeSessionEnded: @escaping () -> Void = {}) {
        self.initialURL = initialURL
        self.onNativeSessionEnded = onNativeSessionEnded
    }

    func makeCoordinator() -> Coordinator {
        Coordinator(initialURL: initialURL, onNativeSessionEnded: onNativeSessionEnded)
    }

    func makeUIView(context: Context) -> WKWebView {
        let userContentController = WKUserContentController()
        userContentController.add(context.coordinator, name: "furbyNativeHealth")
        userContentController.add(context.coordinator, name: "furbyNativeSession")
        userContentController.add(context.coordinator, name: "furbyNativePasskey")
        userContentController.add(context.coordinator, name: "furbyNativeLocation")
        userContentController.addUserScript(
            WKUserScript(
                source: NativeHealthBridge.script,
                injectionTime: .atDocumentStart,
                forMainFrameOnly: false
            )
        )
        userContentController.addUserScript(
            WKUserScript(
                source: NativePasskeyBridge.script,
                injectionTime: .atDocumentStart,
                forMainFrameOnly: false
            )
        )
        userContentController.addUserScript(
            WKUserScript(
                source: NativeLocationBridge.script,
                injectionTime: .atDocumentStart,
                forMainFrameOnly: false
            )
        )
        userContentController.addUserScript(
            WKUserScript(
                source: NativeViewportLock.script,
                injectionTime: .atDocumentEnd,
                forMainFrameOnly: false
            )
        )

        let configuration = WKWebViewConfiguration()
        configuration.userContentController = userContentController
        configuration.websiteDataStore = .default()
        configuration.allowsInlineMediaPlayback = true
        configuration.defaultWebpagePreferences.allowsContentJavaScript = true
        configuration.applicationNameForUserAgent = "WellEcho"

        let webView = WKWebView(frame: .zero, configuration: configuration)
        webView.navigationDelegate = context.coordinator
        webView.uiDelegate = context.coordinator
        webView.isOpaque = false
        webView.backgroundColor = .clear
        webView.allowsBackForwardNavigationGestures = true
        webView.scrollView.backgroundColor = .clear
        webView.scrollView.contentInsetAdjustmentBehavior = .never
        webView.scrollView.delegate = context.coordinator
        webView.scrollView.minimumZoomScale = 1
        webView.scrollView.maximumZoomScale = 1
        webView.scrollView.zoomScale = 1
        webView.scrollView.bouncesZoom = false

        context.coordinator.attach(webView)
        webView.load(URLRequest(url: initialURL))
        return webView
    }

    static func dismantleUIView(_ webView: WKWebView, coordinator: Coordinator) {
        webView.configuration.userContentController.removeScriptMessageHandler(forName: "furbyNativeHealth")
        webView.configuration.userContentController.removeScriptMessageHandler(forName: "furbyNativeSession")
        webView.configuration.userContentController.removeScriptMessageHandler(forName: "furbyNativePasskey")
        webView.configuration.userContentController.removeScriptMessageHandler(forName: "furbyNativeLocation")
        webView.scrollView.delegate = nil
    }

    func updateUIView(_ webView: WKWebView, context: Context) {
        guard let url = routeCoordinator.pendingURL else { return }
        context.coordinator.handleIncomingURL(url, in: webView)
        DispatchQueue.main.async {
            routeCoordinator.consume(url)
        }
    }

    final class Coordinator: NSObject, WKNavigationDelegate, WKUIDelegate, WKScriptMessageHandler, UIScrollViewDelegate {
        private let healthService = HealthKitService()
        private let authService = NativeAuthService()
        private let locationService = NativeLocationService.shared
        private let initialURL: URL
        private let onNativeSessionEnded: () -> Void
        private weak var webView: WKWebView?
        private var networkRecoveryAttempts = 0

        init(initialURL: URL, onNativeSessionEnded: @escaping () -> Void) {
            self.initialURL = initialURL
            self.onNativeSessionEnded = onNativeSessionEnded
        }

        func attach(_ webView: WKWebView) {
            self.webView = webView
        }

        func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
            networkRecoveryAttempts = 0
        }

        func viewForZooming(in scrollView: UIScrollView) -> UIView? {
            nil
        }

        func scrollViewDidZoom(_ scrollView: UIScrollView) {
            if scrollView.zoomScale != 1 {
                scrollView.setZoomScale(1, animated: false)
            }
        }

        func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
            if message.name == "furbyNativeSession" {
                handleNativeSessionMessage(message)
                return
            }

            if message.name == "furbyNativePasskey" {
                handleNativePasskeyMessage(message)
                return
            }

            if message.name == "furbyNativeLocation" {
                handleNativeLocationMessage(message)
                return
            }

            guard message.name == "furbyNativeHealth",
                  let body = message.body as? [String: Any],
                  let id = body["id"] as? String,
                  let action = body["action"] as? String else {
                return
            }

            let payload = body["payload"] as? [String: Any] ?? [:]
            Task {
                do {
                    let json: String
                    switch action {
                    case "readToday":
                        json = try await healthService.readTodayJSON()
                    case "readRecent":
                        let days = payload["days"] as? Int ?? Int(payload["days"] as? Double ?? 30)
                        json = try await healthService.readRecentJSON(days: days)
                    case "requestAuthorization":
                        json = try await healthService.requestAuthorizationJSON()
                    default:
                        throw WebShellError.unsupportedAction(action)
                    }
                    await MainActor.run {
                        resolve(messageId: id, ok: true, json: json)
                    }
                } catch {
                    await MainActor.run {
                        resolve(messageId: id, ok: false, json: errorJSON(error))
                    }
                }
            }
        }

        private func handleNativePasskeyMessage(_ message: WKScriptMessage) {
            guard let body = message.body as? [String: Any],
                  let id = body["id"] as? String,
                  let action = body["action"] as? String else {
                return
            }
            let payload = body["payload"] as? [String: Any] ?? [:]
            Task {
                do {
                    let data: Data
                    switch action {
                    case "register":
                        let label = payload["label"] as? String
                        data = try await authService.registerUserPasskey(label: label)
                    default:
                        throw WebShellError.unsupportedAction(action)
                    }
                    let json = String(data: data, encoding: .utf8) ?? #"{"ok":true}"#
                    await MainActor.run {
                        resolvePasskey(messageId: id, ok: true, json: json)
                    }
                } catch {
                    await MainActor.run {
                        resolvePasskey(messageId: id, ok: false, json: errorJSON(error))
                    }
                }
            }
        }

        private func handleNativeLocationMessage(_ message: WKScriptMessage) {
            guard let body = message.body as? [String: Any],
                  let id = body["id"] as? String,
                  let action = body["action"] as? String else {
                return
            }
            Task {
                do {
                    let json: String
                    switch action {
                    case "requestAuthorization":
                        json = try await locationService.requestAuthorizationJSON()
                    case "getCurrentPosition":
                        json = try await locationService.currentLocationJSON()
                    default:
                        throw WebShellError.unsupportedAction(action)
                    }
                    await MainActor.run {
                        resolveLocation(messageId: id, ok: true, json: json)
                    }
                } catch {
                    await MainActor.run {
                        resolveLocation(messageId: id, ok: false, json: errorJSON(error))
                    }
                }
            }
        }

        private func handleNativeSessionMessage(_ message: WKScriptMessage) {
            guard let body = message.body as? [String: Any],
                  let action = body["action"] as? String,
                  ["logout", "authRequired"].contains(action) else {
                return
            }
            DispatchQueue.main.async {
                self.onNativeSessionEnded()
            }
        }

        func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
            guard let url = navigationAction.request.url else {
                decisionHandler(.allow)
                return
            }

            if handleNativeCallbackURL(url, in: webView) {
                decisionHandler(.cancel)
                return
            }

            if let rewritten = nativeQqLoginURL(from: url) {
                webView.load(URLRequest(url: rewritten))
                decisionHandler(.cancel)
                return
            }

            if shouldOpenExternally(url) {
                UIApplication.shared.open(url)
                decisionHandler(.cancel)
                return
            }

            decisionHandler(.allow)
        }

        func webView(_ webView: WKWebView, createWebViewWith configuration: WKWebViewConfiguration, for navigationAction: WKNavigationAction, windowFeatures: WKWindowFeatures) -> WKWebView? {
            if navigationAction.targetFrame == nil {
                webView.load(navigationAction.request)
            }
            return nil
        }

        func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
            scheduleNetworkRecoveryReloadIfNeeded(webView, error: error)
        }

        func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
            scheduleNetworkRecoveryReloadIfNeeded(webView, error: error)
        }

        func webView(
            _ webView: WKWebView,
            requestMediaCapturePermissionFor origin: WKSecurityOrigin,
            initiatedByFrame frame: WKFrameInfo,
            type: WKMediaCaptureType,
            decisionHandler: @escaping (WKPermissionDecision) -> Void
        ) {
            guard type == .camera else {
                decisionHandler(.deny)
                return
            }

            switch AVCaptureDevice.authorizationStatus(for: .video) {
            case .authorized:
                decisionHandler(.grant)
            case .notDetermined:
                AVCaptureDevice.requestAccess(for: .video) { granted in
                    DispatchQueue.main.async {
                        decisionHandler(granted ? .grant : .deny)
                    }
                }
            case .denied, .restricted:
                decisionHandler(.deny)
            @unknown default:
                decisionHandler(.prompt)
            }
        }

        func handleIncomingURL(_ url: URL, in webView: WKWebView) {
            _ = handleNativeCallbackURL(url, in: webView)
        }

        private func handleNativeCallbackURL(_ url: URL, in webView: WKWebView) -> Bool {
            guard url.scheme == AppConfig.nativeCallbackScheme,
                  url.host == AppConfig.nativeCallbackHost,
                  let components = URLComponents(url: url, resolvingAgainstBaseURL: false),
                  let token = components.queryItems?.first(where: { $0.name == "token" })?.value,
                  !token.isEmpty else {
                return false
            }

            guard let completeURL = nativeCompletionURL(token: token) else {
                return false
            }

            webView.load(URLRequest(url: completeURL))
            return true
        }

        private func nativeCompletionURL(token: String) -> URL? {
            AppConfig.qqNativeCompletionURL(token: token)
        }

        private func nativeQqLoginURL(from url: URL) -> URL? {
            guard let host = url.host,
                  AppConfig.allowedWebHosts.contains(host),
                  url.path.hasSuffix("/api/auth/qq/start"),
                  var components = URLComponents(url: url, resolvingAgainstBaseURL: false) else {
                return nil
            }

            var queryItems = components.queryItems ?? []
            if queryItems.contains(where: { $0.name == "native" && $0.value == "1" }) {
                return nil
            }
            queryItems.removeAll { $0.name == "native" || $0.name == "mobile" }
            queryItems.append(URLQueryItem(name: "native", value: "1"))
            queryItems.append(URLQueryItem(name: "mobile", value: "1"))
            components.queryItems = queryItems
            return components.url
        }

        private func shouldOpenExternally(_ url: URL) -> Bool {
            guard let scheme = url.scheme?.lowercased() else { return false }
            if scheme == "http" || scheme == "https" {
                return false
            }
            if scheme == AppConfig.nativeCallbackScheme {
                return false
            }
            return true
        }

        private func scheduleNetworkRecoveryReloadIfNeeded(_ webView: WKWebView, error: Error) {
            guard NativeNetworkAccessService.isRecoverableNetworkAuthorizationError(error),
                  networkRecoveryAttempts < 4 else {
                return
            }
            networkRecoveryAttempts += 1
            let attempt = networkRecoveryAttempts
            Task { @MainActor in
                try? await NativeNetworkAccessService.sleepBeforeRetry(attempt: attempt)
                guard !webView.isLoading else { return }
                webView.load(URLRequest(url: webView.url ?? initialURL))
            }
        }

        private func resolve(messageId: String, ok: Bool, json: String) {
            guard let webView else { return }
            let script = "window.__furbyNativeHealthResolve(\(Self.jsonString(messageId)), \(ok ? "true" : "false"), \(json));"
            webView.evaluateJavaScript(script)
        }

        private func resolvePasskey(messageId: String, ok: Bool, json: String) {
            guard let webView else { return }
            let script = "window.__furbyNativePasskeyResolve(\(Self.jsonString(messageId)), \(ok ? "true" : "false"), \(json));"
            webView.evaluateJavaScript(script)
        }

        private func resolveLocation(messageId: String, ok: Bool, json: String) {
            guard let webView else { return }
            let script = "window.__furbyNativeLocationResolve(\(Self.jsonString(messageId)), \(ok ? "true" : "false"), \(json));"
            webView.evaluateJavaScript(script)
        }

        private func errorJSON(_ error: Error) -> String {
            let message = (error as? LocalizedError)?.errorDescription ?? error.localizedDescription
            let payload = [
                "ok": false,
                "error": message,
                "generatedAt": ISO8601DateFormatter().string(from: Date())
            ] as [String: Any]
            guard let data = try? JSONSerialization.data(withJSONObject: payload, options: [.sortedKeys]),
                  let json = String(data: data, encoding: .utf8) else {
                return #"{"ok":false,"error":"读取失败。"}"#
            }
            return json
        }

        private static func jsonString(_ value: String) -> String {
            guard let data = try? JSONEncoder().encode(value),
                  let encoded = String(data: data, encoding: .utf8) else {
                return #""""#
            }
            return encoded
        }
    }
}

private enum NativeViewportLock {
    static let script = """
    (() => {
      const content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover';
      function applyViewportLock() {
        let viewport = document.querySelector('meta[name="viewport"]');
        if (!viewport) {
          viewport = document.createElement('meta');
          viewport.setAttribute('name', 'viewport');
          document.head.appendChild(viewport);
        }
        if (viewport.getAttribute('content') !== content) {
          viewport.setAttribute('content', content);
        }
      }
      applyViewportLock();
      new MutationObserver(applyViewportLock).observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['content']
      });
      document.addEventListener('gesturestart', event => event.preventDefault(), { passive: false });
      document.addEventListener('gesturechange', event => event.preventDefault(), { passive: false });
      document.addEventListener('gestureend', event => event.preventDefault(), { passive: false });
    })();
    """
}

enum WebShellError: LocalizedError {
    case unsupportedAction(String)

    var errorDescription: String? {
        switch self {
        case .unsupportedAction(let action):
            "暂不支持的原生操作：\(action)"
        }
    }
}

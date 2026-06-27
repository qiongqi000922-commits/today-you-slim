import AuthenticationServices
import Combine
import SwiftUI

enum NativeAuthPhase {
    case checking
    case login
    case authenticated
}

enum NativeLoginMethod: Equatable {
    case apple
    case passkey

    var loadingText: String {
        switch self {
        case .apple:
            NativeStrings.validatingAppleID
        case .passkey:
            NativeStrings.validatingPasskey
        }
    }
}

@MainActor
final class NativeAuthStore: ObservableObject {
    @Published var phase: NativeAuthPhase = .checking
    @Published var activeMethod: NativeLoginMethod?
    @Published var message: String?

    let service = NativeAuthService()
    var webViewIdentity = UUID()

    private var didBootstrap = false

    var isWorking: Bool {
        activeMethod != nil
    }

    func bootstrap() async {
        guard !didBootstrap else { return }
        didBootstrap = true
        if await service.hasSessionCookie() {
            phase = .authenticated
        } else {
            phase = .login
        }
    }

    func completeAppleSignIn(_ result: Result<ASAuthorization, Error>) {
        Task {
            await run(.apple) {
                try await self.service.completeAppleSignIn(result)
            }
        }
    }

    func loginWithPasskey() {
        Task {
            await run(.passkey) {
                try await self.service.loginWithPasskey()
            }
        }
    }

    func returnToNativeLogin() {
        Task {
            await service.clearSession()
            webViewIdentity = UUID()
            phase = .login
            activeMethod = nil
            message = nil
        }
    }

    private func run(_ method: NativeLoginMethod, operation: @escaping () async throws -> Void) async {
        guard activeMethod == nil else { return }
        activeMethod = method
        message = nil
        do {
            try await operation()
            webViewIdentity = UUID()
            phase = .authenticated
        } catch {
            message = NativeAuthService.displayMessage(for: error)
            phase = .login
        }
        activeMethod = nil
    }
}

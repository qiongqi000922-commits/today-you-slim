import SwiftUI

struct ContentView: View {
    @StateObject private var authStore = NativeAuthStore()

    var body: some View {
        Group {
            switch authStore.phase {
            case .checking:
                NativeLaunchView()
            case .login:
                NativeLoginView(store: authStore)
            case .authenticated:
                WebShellView(
                    initialURL: AppConfig.webBaseURL,
                    onNativeSessionEnded: {
                        authStore.returnToNativeLogin()
                    }
                )
                    .id(authStore.webViewIdentity)
                    .ignoresSafeArea()
                    .background(Color(.systemBackground))
            }
        }
        .task {
            await authStore.bootstrap()
        }
    }
}

#Preview {
    ContentView()
        .environmentObject(NativeRouteCoordinator())
}

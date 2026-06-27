import Combine
import SwiftUI

@main
struct WellEchoApp: App {
    @StateObject private var routeCoordinator = NativeRouteCoordinator()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(routeCoordinator)
                .onOpenURL { url in
                    routeCoordinator.handle(url)
                }
        }
    }
}

final class NativeRouteCoordinator: ObservableObject {
    @Published private(set) var pendingURL: URL?

    func handle(_ url: URL) {
        pendingURL = url
    }

    func consume(_ url: URL) {
        if pendingURL == url {
            pendingURL = nil
        }
    }
}

import AuthenticationServices
import SwiftUI

struct NativeLaunchView: View {
    var body: some View {
        ZStack {
            NativeLoginBackground()
            VStack(spacing: 16) {
                NativeLoadingMark()
                VStack(spacing: 5) {
                    Text(NativeStrings.preparing)
                        .font(.system(size: 18, weight: .bold, design: .rounded))
                    Text(NativeStrings.preparingDetail)
                        .font(.system(size: 13, weight: .semibold))
                        .foregroundStyle(.secondary)
                }
            }
            .padding(28)
        }
    }
}

struct NativeLoadingMark: View {
    @Environment(\.colorScheme) private var colorScheme
    @State private var rotate = false
    @State private var breathe = false

    var body: some View {
        ZStack {
            Circle()
                .stroke(
                    AngularGradient(
                        colors: [
                            Color(red: 0.85, green: 0.46, blue: 0.68).opacity(0.08),
                            Color(red: 0.39, green: 0.74, blue: 0.84).opacity(0.72),
                            Color(red: 0.85, green: 0.46, blue: 0.68).opacity(0.62),
                            Color(red: 0.39, green: 0.74, blue: 0.84).opacity(0.08)
                        ],
                        center: .center
                    ),
                    style: StrokeStyle(lineWidth: 4, lineCap: .round)
                )
                .frame(width: 92, height: 92)
                .rotationEffect(.degrees(rotate ? 360 : 0))

            Circle()
                .fill(Color.white.opacity(colorScheme == .dark ? 0.04 : 0.16))
                .frame(width: 72, height: 72)
                .scaleEffect(breathe ? 1.06 : 0.96)
                .blur(radius: 0.2)

            ScaleGlyph()
                .stroke(
                    LinearGradient(
                        colors: [
                            Color(red: 0.39, green: 0.74, blue: 0.84),
                            Color(red: 0.86, green: 0.52, blue: 0.70)
                        ],
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    ),
                    style: StrokeStyle(lineWidth: 4.5, lineCap: .round, lineJoin: .round)
                )
                .frame(width: 52, height: 52)
                .shadow(color: Color(red: 0.39, green: 0.74, blue: 0.84).opacity(0.22), radius: 12, x: 0, y: 8)
                .scaleEffect(breathe ? 1.02 : 0.98)
        }
        .frame(width: 104, height: 104)
        .onAppear {
            withAnimation(.linear(duration: 1.35).repeatForever(autoreverses: false)) {
                rotate = true
            }
            withAnimation(.easeInOut(duration: 1.1).repeatForever(autoreverses: true)) {
                breathe = true
            }
        }
    }
}

struct ScaleGlyph: Shape {
    func path(in rect: CGRect) -> Path {
        var path = Path()
        let w = rect.width
        let h = rect.height

        path.move(to: CGPoint(x: w * 0.18, y: h * 0.47))
        path.addCurve(
            to: CGPoint(x: w * 0.82, y: h * 0.47),
            control1: CGPoint(x: w * 0.30, y: h * 0.18),
            control2: CGPoint(x: w * 0.70, y: h * 0.18)
        )
        path.addCurve(
            to: CGPoint(x: w * 0.66, y: h * 0.85),
            control1: CGPoint(x: w * 0.78, y: h * 0.72),
            control2: CGPoint(x: w * 0.73, y: h * 0.84)
        )
        path.addCurve(
            to: CGPoint(x: w * 0.34, y: h * 0.85),
            control1: CGPoint(x: w * 0.58, y: h * 0.90),
            control2: CGPoint(x: w * 0.42, y: h * 0.90)
        )
        path.addCurve(
            to: CGPoint(x: w * 0.18, y: h * 0.47),
            control1: CGPoint(x: w * 0.27, y: h * 0.84),
            control2: CGPoint(x: w * 0.22, y: h * 0.72)
        )

        path.move(to: CGPoint(x: w * 0.50, y: h * 0.35))
        path.addLine(to: CGPoint(x: w * 0.47, y: h * 0.56))

        return path
    }
}

struct NativeLoginView: View {
    @Environment(\.colorScheme) private var colorScheme
    @ObservedObject var store: NativeAuthStore

    private var passkeyForeground: Color {
        colorScheme == .dark
            ? Color(red: 0.90, green: 0.97, blue: 1.0)
            : Color(red: 0.11, green: 0.18, blue: 0.23)
    }

    private var passkeyTint: Color {
        colorScheme == .dark
            ? Color(red: 0.73, green: 0.94, blue: 0.98)
            : Color(red: 0.20, green: 0.47, blue: 0.54)
    }

    private var passkeyBackground: LinearGradient {
        if colorScheme == .dark {
            return LinearGradient(
                colors: [
                    Color.white.opacity(0.16),
                    Color(red: 0.20, green: 0.35, blue: 0.42).opacity(0.34)
                ],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
        }

        return LinearGradient(
            colors: [
                Color.white.opacity(0.88),
                Color(red: 0.78, green: 0.93, blue: 0.98).opacity(0.62)
            ],
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )
    }

    private var passkeyStroke: Color {
        colorScheme == .dark
            ? Color.white.opacity(0.28)
            : Color.white.opacity(0.58)
    }

    private var loginPanelStroke: Color {
        colorScheme == .dark
            ? Color.white.opacity(0.20)
            : Color.white.opacity(0.46)
    }

    private var loginPanelShadow: Color {
        Color.black.opacity(colorScheme == .dark ? 0.28 : 0.08)
    }

    var body: some View {
        ZStack {
            NativeLoginBackground()
            VStack(spacing: 28) {
                Spacer(minLength: 24)

                VStack(spacing: 16) {
                    Image("LaunchIcon")
                        .resizable()
                        .scaledToFit()
                        .frame(width: 86, height: 86)
                        .shadow(color: Color.cyan.opacity(0.22), radius: 24, x: 0, y: 16)

                    VStack(spacing: 8) {
                        Text(NativeStrings.brand)
                            .font(.system(size: 38, weight: .black, design: .rounded))
                            .foregroundStyle(.primary)
                        Text(NativeStrings.subtitle)
                            .font(.system(size: 15, weight: .semibold))
                            .foregroundStyle(.secondary)
                            .multilineTextAlignment(.center)
                    }
                }

                VStack(spacing: 12) {
                    SignInWithAppleButton(.signIn) { request in
                        request.requestedScopes = [.fullName, .email]
                    } onCompletion: { result in
                        store.completeAppleSignIn(result)
                    }
                    .signInWithAppleButtonStyle(colorScheme == .dark ? .white : .black)
                    .frame(height: 54)
                    .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))
                    .disabled(store.isWorking)

                    Button {
                        store.loginWithPasskey()
                    } label: {
                        HStack(spacing: 10) {
                            Image(systemName: "person.badge.key.fill")
                                .font(.system(size: 18, weight: .semibold))
                                .foregroundStyle(passkeyTint)
                            Text(NativeStrings.passkeyLoginTitle)
                                .font(.system(size: 17, weight: .bold, design: .rounded))
                                .lineLimit(1)
                                .minimumScaleFactor(0.78)
                        }
                        .frame(maxWidth: .infinity)
                        .frame(height: 54)
                        .foregroundStyle(passkeyForeground)
                        .background(passkeyBackground, in: RoundedRectangle(cornerRadius: 18, style: .continuous))
                        .overlay {
                            RoundedRectangle(cornerRadius: 18, style: .continuous)
                                .stroke(passkeyStroke, lineWidth: 1)
                        }
                    }
                    .buttonStyle(.plain)
                    .disabled(store.isWorking)
                }
                .padding(18)
                .background(.ultraThinMaterial, in: RoundedRectangle(cornerRadius: 28, style: .continuous))
                .overlay {
                    RoundedRectangle(cornerRadius: 28, style: .continuous)
                        .stroke(loginPanelStroke, lineWidth: 1)
                }
                .shadow(color: loginPanelShadow, radius: 30, x: 0, y: 18)

                VStack(spacing: 8) {
                    if let active = store.activeMethod {
                        HStack(spacing: 8) {
                            ProgressView()
                                .controlSize(.small)
                            Text(active.loadingText)
                        }
                        .font(.system(size: 13, weight: .semibold))
                        .foregroundStyle(.secondary)
                    } else if let message = store.message {
                        Text(message)
                            .font(.system(size: 13, weight: .semibold))
                            .foregroundStyle(Color(red: 0.72, green: 0.22, blue: 0.32))
                            .multilineTextAlignment(.center)
                    } else {
                        Text(NativeStrings.appleLoginHint)
                            .font(.system(size: 13, weight: .semibold))
                            .foregroundStyle(.secondary)
                    }
                }
                .frame(minHeight: 26)
                .padding(.horizontal, 22)

                Spacer(minLength: 30)
            }
            .padding(.horizontal, 28)
            .padding(.vertical, 22)
        }
    }
}

struct NativeLoginBackground: View {
    @Environment(\.colorScheme) private var colorScheme

    var body: some View {
        LinearGradient(
            colors: backgroundColors,
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )
        .ignoresSafeArea()
        .overlay(alignment: .topLeading) {
            Circle()
                .fill(Color(red: 0.96, green: 0.25, blue: 0.58).opacity(colorScheme == .dark ? 0.28 : 0.16))
                .frame(width: 260, height: 260)
                .blur(radius: 48)
                .offset(x: -95, y: -80)
        }
        .overlay(alignment: .bottomTrailing) {
            Circle()
                .fill(Color(red: 0.18, green: 0.72, blue: 0.92).opacity(colorScheme == .dark ? 0.24 : 0.16))
                .frame(width: 300, height: 300)
                .blur(radius: 56)
                .offset(x: 110, y: 80)
        }
    }

    private var backgroundColors: [Color] {
        if colorScheme == .dark {
            return [
                Color(red: 0.08, green: 0.09, blue: 0.13),
                Color(red: 0.11, green: 0.16, blue: 0.22),
                Color(red: 0.08, green: 0.10, blue: 0.16)
            ]
        }
        return [
            Color(red: 1.0, green: 0.91, blue: 0.98),
            Color(red: 0.88, green: 0.98, blue: 1.0),
            Color(red: 0.96, green: 0.97, blue: 1.0)
        ]
    }
}

#Preview {
    NativeLoginView(store: NativeAuthStore())
}

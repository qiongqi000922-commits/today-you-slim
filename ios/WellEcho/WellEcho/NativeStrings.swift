import Foundation

enum NativeStrings {
    static var isChinese: Bool {
        let language = Locale.preferredLanguages.first ?? Locale.current.identifier
        return language.lowercased().hasPrefix("zh")
    }

    static func text(_ chinese: String, _ english: String) -> String {
        isChinese ? chinese : english
    }

    static var brand: String {
        text("今天你瘦了吗", "WellEcho")
    }

    static var subtitle: String {
        text("记录你的健康。回放你的变化。", "Record your health. Replay your change.")
    }

    static var appleLoginHint: String {
        text("使用 Apple ID 或 Passkey 进入你的减肥记录", "Use Apple ID or Passkey to continue.")
    }

    static var preparing: String {
        text("正在准备", "Preparing")
    }

    static var preparingDetail: String {
        text("正在准备登录状态", "Preparing your session")
    }

    static var validatingAppleID: String {
        text("正在验证 Apple ID", "Verifying Apple ID")
    }

    static var validatingPasskey: String {
        text("正在验证 Passkey", "Verifying Passkey")
    }

    static var cancelled: String {
        text("操作已取消。", "The operation was canceled.")
    }

    static var invalidAppleCredential: String {
        text("Apple ID 授权信息不完整。", "The Apple ID authorization is incomplete.")
    }

    static var invalidPasskeyOptions: String {
        text("Passkey 参数不完整，请稍后再试。", "Passkey setup is incomplete. Please try again.")
    }

    static var loginFailed: String {
        text("登录失败，请稍后再试。", "Sign-in failed. Please try again later.")
    }

    static var networkPermissionRequired: String {
        text("网络权限未开启，请允许无线数据后重试。", "Network access is disabled. Allow network access and try again.")
    }

    static var passkeyLoginTitle: String {
        text("使用 Passkey 登录", "Sign in with Passkey")
    }

    static var defaultPasskeyLabel: String {
        text("手机 Passkey", "Phone Passkey")
    }
}

# WellEcho iOS 重构说明

## 现有 Web 项目总结

“今天你瘦了吗?”目前是一个轻量的健康记录与社区 Web 应用，核心由 Node.js 原生服务、静态 HTML/CSS/JavaScript 前端和 JSON 文件存储组成。它已经包含 QQ 登录、Passkey、体重与照片记录、食物识别、AI 建议、社区共享、点赞评论、排行榜、管理台、接口额度监控和基础安全治理。

前端主要入口在 `public/app.js`，核心页面包括：

- 我的：体重高低图、涨跌日历、拍照记录、食物记录、AI 总结、回放。
- 社区：共享开关、大家的变化、人气榜、详情页、留言和点赞。
- 设置：账户资料、隐私协议、Passkey、注销、反馈举报、iOS 健康数据桥接测试。
- 管理台：账户治理、记录查看、服务器状态、接口用量、审计与风控。

后端入口为 `server.mjs`，负责会话、OAuth、上传、记录、社区、AI、审核、管理台和安全限流。数据默认保存在 `data/`，生产环境通过 systemd 和反向代理部署。

## iOS 重构策略

这次新建的 iOS 工程采用第一阶段的稳妥重构路线：

1. 保留 Web 业务主线，避免一次性重写全部产品逻辑。
2. 使用 `WKWebView` 加载 `https://furby.top`，继续复用线上登录、记录、社区、AI 和管理台外的用户功能。
3. 在 iOS 侧提供原生桥接层，将 HealthKit 数据暴露给网页中的 `window.furbyNativeHealth`。
4. 将 QQ 登录改为 native 回流模式，点击 QQ 登录时自动附加 `native=1`，服务端返回 `furby://qq-auth` 后由 App 接住并回到 WebView。
5. 后续如果要逐步原生化，可以优先抽出“我的首页图表”“拍照记录”“食物记录”“设置账户”这些高频模块。

## 新工程结构

```text
ios/WellEcho/
├── WellEcho.xcodeproj
└── WellEcho/
    ├── AppConfig.swift              # 环境与站点配置
    ├── WellEchoApp.swift            # App 入口与 URL 回流协调
    ├── ContentView.swift            # SwiftUI 根视图
    ├── WebShellView.swift           # WKWebView、QQ 回流、JS 消息桥
    ├── NativeHealthBridge.swift     # 注入到网页的 JS Bridge
    ├── HealthKitService.swift       # HealthKit 读取与 JSON 输出
    ├── Info.plist                   # URL Scheme 与启动配置
    ├── WellEcho.entitlements        # HealthKit 权限
    └── Assets.xcassets              # App 图标与主题色
```

## 当前已经具备的原生能力

- 加载线上主站 `https://furby.top/`。
- 可通过 `AppConfig.useTestEnvironment` 切换到 `https://furby.top/test`。
- 支持 HealthKit 授权读取：
  - 当天和近 90 天心率
  - 体重
  - 步数
  - 活动消耗
  - 运动时间
- 网页可调用：
  - `window.furbyNativeHealth.readToday()`
  - `window.furbyNativeHealth.readRecent(days)`
- 支持原生 Apple 登录、原生 Passkey 登录，并通过 `WKWebView` 复用网页端主业务。
- 已补充 iOS 隐私清单、权限说明本地化和 App Store 上架资料，详见 `APP_STORE_SUBMISSION.md`。

## 下一阶段建议

- 增加原生相机页，逐步替换 Web `getUserMedia`，提升稳定性和横竖屏体验。
- 为 QQ 登录配置 Universal Link，长期替代自定义 URL Scheme。
- 把 AI 建议接入 HealthKit 数据，让心率、步数、运动时间参与总结。

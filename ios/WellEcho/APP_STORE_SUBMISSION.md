# 今天你瘦了吗 App Store 上架资料

更新时间：2026-06-26

这份资料按 App Store Connect 提交流程整理，适用于当前 iOS App：`ios/WellEcho/WellEcho.xcodeproj`。

## 1. 当前工程状态

- App 名称：今天你瘦了吗
- 英文名称：WellEcho
- Bundle ID：`top.furby.wellecho`
- Team ID：`A82X46N3WS`
- 版本号：`1.0.1`
- Build：`5`
- 目标设备：iPhone、iPad
- 最低系统：iOS 17.0
- 登录方式：原生 Apple 登录、原生 Passkey 登录
- Web 容器：`WKWebView` 加载 `https://furby.top/`
- Associated Domains：`webcredentials:furby.top`
- HealthKit：只读，读取近 30 天体重、心率、步数、活动消耗、运动时间
- 加密合规：仅使用系统 HTTPS/TLS 和 Apple/Auth 服务，已设置 `ITSAppUsesNonExemptEncryption=false`
- 隐私清单：已添加 `WellEcho/PrivacyInfo.xcprivacy`

## 2. App Store Connect 基本信息

### App 信息

- 名称：`今天你瘦了吗`
- 副标题：`Record your health. Replay your change.`
- 类别：`Health & Fitness`
- 次类别：`Lifestyle` 或不填
- SKU：`WELLECHO-IOS-2026`
- Bundle ID：`top.furby.wellecho`
- 价格：免费
- 版权：`Copyright © 2026 furby.com. All Rights Reserved.`

### 中文本地化

- 名称：`今天你瘦了吗`
- 副标题：`记录健康，回放变化`
- 关键词：
  `减肥,体重,饮食,健康记录,热量,心率,回放,AI建议,身材变化,社区`
- 促销文本：
  `用照片、体重、饮食和心情记录身体变化，回放每一步进展。`
- 简介：
  `今天你瘦了吗是一款面向个人减重过程的健康记录应用。你可以拍照记录体重变化，识别饮食热量，查看体重高低图与涨跌日历，并用回放观察长期变化。应用支持 Apple 健康数据同步、AI 总结建议和可选社区共享，帮助你以更轻松、连续的方式复盘自己的状态。`

### 英文本地化

- Name：`WellEcho`
- Subtitle：`Record your health. Replay your change.`
- Keywords：
  `weight loss,weight tracker,food calories,health journal,progress photos,heart rate,AI coach,body progress`
- Promotional Text：
  `Track weight, meals, mood, and progress photos. Replay your change over time.`
- Description：
  `WellEcho is a personal health and weight-change journal. Record progress photos, weight, meals, calories, and mood in one place, then review trends with charts, calendars, and visual replay. With your permission, WellEcho can read recent Apple Health data such as weight, heart rate, steps, active energy, and exercise minutes to enrich your summaries. AI suggestions are designed for reflection and habit tracking, not medical diagnosis or treatment.`

## 3. 隐私政策、支持和联系信息

- 隐私政策 URL：`https://furby.top/privacy.html`
- 用户协议 URL：`https://furby.top/terms.html`
- 支持 URL：`https://furby.top/`
- 营销 URL：可不填，或填 `https://furby.top/`
- 隐私联系邮箱：`privacy@furby.top`
- 支持邮箱：建议新建 `support@furby.top`

你还需要在 App Store Connect 里填写：

- 审核联系人姓名
- 审核联系人电话
- 审核联系人邮箱
- 版权归属主体
- 是否可在中国大陆外地区发布

## 4. 截图素材

建议准备中文和英文两套。当前 app 支持 iPhone 和 iPad，因此至少准备：

- iPhone 6.9 英寸截图：建议 `1320 x 2868` 或 Apple 接受的同组尺寸
- iPad 13 英寸截图：建议 `2064 x 2752`
- 每套 5 张截图即可，最多 10 张

截图建议顺序：

1. 我的：体重高低图、头像标题、拍照/食物记录入口
2. 记录：体重记录和食物热量记录
3. 回放：照片和体重变化同步回放
4. 社区：共享变化、点赞评论
5. 设置：Apple 登录、Passkey、健康数据同步和隐私管理

截图文案建议：

- `记录每天的变化`
- `饮食和体重放在一起`
- `回放你的长期进展`
- `只在你愿意时共享`
- `Apple 健康数据可控同步`

## 5. App 隐私详情填写建议

不要选择“用于追踪”。当前产品不做跨 App 或跨网站广告追踪。

建议声明以下数据类型：

- Contact Info：Name、Email Address
- Health & Fitness：Health、Fitness
- Location：Precise Location
- User Content：Photos or Videos、Other User Content、Customer Support
- Identifiers：User ID
- Usage Data：Product Interaction
- Diagnostics：Other Diagnostic Data
- Other Data：Other Data Types

用途建议：

- App Functionality：全部上述数据
- Product Personalization：健康、健身、位置、照片、心情、饮食、AI 建议相关数据

不建议选择：

- Third-Party Advertising
- Developer Advertising or Marketing
- Tracking
- Data Broker sharing

## 6. 年龄分级建议

建议按 `12+` 准备。理由：

- 存在用户生成内容和社区评论，但有举报、审核、删除和账号治理。
- 涉及体重、饮食、健康数据和 AI 建议，但不提供医疗诊断、处方或治疗。
- 不面向 14 周岁以下儿童。

年龄分级问卷建议口径：

- Medical/Treatment Information：无医疗诊断或治疗，仅健康记录和参考建议。
- User Generated Content：有，已提供审核、举报、屏蔽/删除和账号治理。
- Unrestricted Web Access：无，WebView 仅加载自有站点 `furby.top` 及必要登录/服务页面。
- Contests/Gambling/Violence/Adult Content：无。

## 7. 审核备注

可直接粘贴：

```text
WellEcho is a personal health and weight-change journal. The iOS app uses a native Sign in with Apple entry and a WKWebView for the main product experience at https://furby.top/.

Review steps:
1. Launch the app.
2. Sign in with Apple. No paid account is required.
3. Read and accept the in-app privacy agreement to enter full mode.
4. Add a body record or a food record, or browse the community tab.
5. Optional: grant Health access to test recent weight, heart rate, steps, active energy, and exercise minutes sync. Health data is read-only and used for charts and summaries.

Important notes:
- The app is for personal journaling and progress review only. It does not provide medical diagnosis, treatment, prescriptions, or professional nutrition advice.
- Community sharing is optional and off by default. User comments and uploaded content are moderated, reportable, and removable.
- Users can delete records, remove Passkeys, change privacy mode, revoke consent, and delete their account from Settings.
- If the review device has no Health data, the app will show empty Health sync results, which is expected.
```

## 8. TestFlight 和提交前检查

提交前建议完成：

- 真机安装 Release/TestFlight 包。
- Apple 登录能进入主页。
- 退出账号后回到原生登录页。
- Passkey 登录和添加 Passkey 可用。
- 首次启动权限弹窗文案清晰。
- 拒绝相机、定位、健康权限时不崩溃。
- 相机拍照可保存体重记录和食物记录。
- HealthKit 授权后只同步最近 30 天。
- 社区内容可举报，自己数据可删除，账户可注销。
- 英文系统下首页、登录页、按钮不溢出。
- iPad 横竖屏没有明显布局跳动。

## 9. 需要你补充的资料

下面这些无法从项目里推断，需要你自己填写或确认：

- 审核联系人手机号
- 审核联系人邮箱
- 支持邮箱是否使用 `support@furby.top`
- 是否要开启中国大陆以外市场
- App Store 截图素材
- 是否上传 App Preview 视频
- Apple Developer 账户里的付费协议、税务和银行信息是否已完成
- App Store Connect 中的隐私问卷是否按本文件填写完成

## 10. 官方参考

- App Review Guidelines: https://developer.apple.com/app-store/review/guidelines/
- App Privacy Details: https://developer.apple.com/app-store/app-privacy-details/
- Screenshot Specifications: https://developer.apple.com/help/app-store-connect/reference/app-information/screenshot-specifications/
- Privacy Manifest Files: https://developer.apple.com/documentation/bundleresources/privacy-manifest-files

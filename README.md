# 今天你瘦了吗?

一个轻量的个人减重记录与社区分享 Web 应用。核心能力包括 QQ/Passkey 登录、体重与照片记录、饮食照片识别、AI 总结建议、社区动态、评论点赞、管理台和基础安全防护。

> 本仓库只包含项目源码和示例配置，不包含生产数据、用户照片、API 密钥、证书或服务器私有配置。

## 功能概览

- **我的记录**：拍照记录体重、心情和照片，支持 3:4 展示、回放、体重高低图和涨跌日历。
- **饮食记录**：拍摄食物照片，通过视觉模型识别食物并估算热量、蛋白质、脂肪和碳水。
- **AI 建议**：结合体重、心情、饮食和环境信息生成简洁分析。
- **社区**：用户可选择共享变化记录，支持详情页、评论、点赞、排行榜和举报反馈。
- **账户与隐私**：支持完整模式/基础模式、隐私协议签署、撤销授权、注销账户、QQ 资料同步和 Passkey。
- **管理台**：账户治理、记录查看、接口额度、服务器状态、登录审计和安全事件查看。
- **安全防护**：请求限流、上传大小限制、同源校验、文本安全审核、管理台 CSRF 和审计日志。

## 技术栈

- Node.js 原生 HTTP/HTTPS 服务，入口为 `server.mjs`
- 原生 HTML/CSS/JavaScript 前端，无构建步骤
- JSON 文件存储，默认目录为 `data/`
- 端侧 MediaPipe Face Landmarker 人脸点位辅助裁切
- 可选外部服务：QQ OAuth、阿里云千问、DeepSeek、腾讯文本安全

## 目录结构

```text
.
├── public/                 # 前端页面、样式、脚本和静态资源
│   ├── app.js              # 主站逻辑
│   ├── admin.js            # 管理台逻辑
│   ├── replay.js           # 回放逻辑
│   └── models/             # 端侧模型文件
├── docs/                   # 架构和安全说明
├── deploy/                 # systemd 与安全冒烟测试示例
├── scripts/verify.mjs      # 基础检查脚本
├── server.mjs              # 后端服务
├── .env.example            # 环境变量示例
└── data/                   # 运行时数据，已被 .gitignore 排除
```

## 本地运行

需要 Node.js 18 或更新版本。

```bash
npm install
cp .env.example .env
npm run check
npm start
```

默认访问：

```text
http://localhost:3000
```

本地如果不配置 QQ、AI 或文本安全密钥，对应功能会显示未配置或降级提示。

## 环境变量

复制 `.env.example` 后按需填写。不要把 `.env`、证书、真实密钥或生产数据提交到 GitHub。

常用变量：

```bash
HOST=0.0.0.0
PORT=3000
DATA_DIR=./data
ALLOWED_HOSTS=localhost,127.0.0.1

QQ_APP_ID=
QQ_APP_KEY=
QQ_CALLBACK_URL=http://localhost:3000/api/auth/qq/callback

ALIYUN_QWEN_API_KEY=
DEEPSEEK_API_KEY=
TENCENT_TMS_SECRET_ID=
TENCENT_TMS_SECRET_KEY=
TENCENT_TMS_BIZ_TYPE=
```

管理台生产环境建议使用 Passkey，并将初始化用的密码或密码哈希放在服务器私有环境变量中。

## 数据与隐私

项目默认使用 JSON 文件和本地照片目录保存数据：

- `data/records.json`
- `data/qq-accounts.json`
- `data/community*.json`
- `data/privacy-consents.json`
- `data/photos/`

这些文件包含用户资料、照片、体重、评论、登录审计等敏感信息，仓库已默认忽略 `data/`。公开部署前请使用独立数据目录，并做好备份、权限和访问控制。

## 部署说明

`deploy/` 中提供 systemd 服务和限流冒烟测试示例。生产环境建议：

- 使用 HTTPS，或放在 Nginx/CDN/WAF 后面。
- 将 Node 服务绑定到内网或 `127.0.0.1`，由反向代理处理 TLS。
- 通过服务器私有环境文件注入密钥，不在源码中写入真实密钥。
- 对 `DATA_DIR` 设置最小可写权限，定期备份。

更多说明见：

- [架构与维护说明](docs/architecture-notes.md)
- [安全加固说明](docs/security-hardening.md)

## 开源边界

本项目适合公开源码、学习和二次开发，但请在发布前确认：

- 已移除所有真实 API Key、证书和服务器密码。
- 未提交 `data/`、日志、备份、用户照片或管理台审计文件。
- 第三方模型、图标和服务的使用符合各自许可与平台规则。

## License

MIT

# 安全加固说明

## 当前防护边界

本项目部署在单台服务器上，无法抵御大规模流量型 DDoS。当前策略侧重在代码和运行配置层面降低风险：

- 早拒畸形请求：限制 Host、URL、Cookie、Header 和 Content-Length。
- 限流：按 IP、接口类别和登录用户分别限制请求频率，异常超限会触发短时封禁。
- 写操作同源校验：带 `Origin` 的写请求必须来自当前站点。
- 上传防护：照片和缩略图只接受 JPG，并校验魔数、大小和账户维度上传频率。
- 输入防护：JSON 请求只接受对象；心情、评论、QQ 昵称、Passkey 标签、资源 ID 都做长度和字符校验。
- 管理台：独立 Cookie、CSRF、Passkey、登录失败锁定和认证事件审计。
- 内容安全：文本安全审核接入心情和评论；审核失败按保守策略拒绝。
- 运行隔离：systemd 限制写入路径、能力、设备访问、临时目录和资源上限。
- 网络韧性：部署 `deploy/99-jf-network-hardening.conf` 中的保守 TCP 参数。

## 关键环境变量

可根据服务器压力调整：

```bash
ALLOWED_HOSTS=your-domain.example,www.your-domain.example,127.0.0.1
TRUSTED_PROXY_IPS=127.0.0.1,::1
RATE_LIMIT_GLOBAL_PER_MINUTE=260
RATE_LIMIT_API_PER_MINUTE=140
RATE_LIMIT_STATIC_PER_MINUTE=420
RATE_LIMIT_AUTH_PER_10_MINUTES=36
RATE_LIMIT_ADMIN_AUTH_PER_15_MINUTES=20
RATE_LIMIT_UPLOAD_PER_10_MINUTES=28
RATE_LIMIT_USER_UPLOAD_PER_10_MINUTES=18
RATE_LIMIT_USER_TEXT_PER_MINUTE=20
RATE_LIMIT_CLIENT_LOG_PER_MINUTE=20
```

## 本地限流冒烟测试

在本机启动一个隔离数据目录：

```bash
DATA_DIR=/tmp/jf-security-data HOST=127.0.0.1 PORT=3200 node server.mjs
```

另一个终端运行：

```bash
TARGET_URL=http://127.0.0.1:3200 HIT_COUNT=30 node deploy/security-smoke-test.mjs
```

预期结果：前一部分请求返回 `202`，超过 `RATE_LIMIT_CLIENT_LOG_PER_MINUTE` 后开始返回 `429`。

## 运营建议

- 当前 Node 直接承载 HTTPS，代码限流能保护应用逻辑，但不能吸收大规模带宽攻击。
- 如果后续流量变大，建议把 TLS 和第一层限流迁到 Nginx/CDN/WAF，再让 Node 只监听 `127.0.0.1`。
- 服务器日志中若持续出现 `[security] temporary ip throttle`，说明有来源触发了高频限制，应考虑临时提高云防火墙规则或接入 CDN。

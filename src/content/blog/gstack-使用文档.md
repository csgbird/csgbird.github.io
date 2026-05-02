---
title: "GStack 使用文档"
date: "2026-05-02"
tags: ["工具", "gstack"]
---

> **版本**: 1.24.0 | **作者**: Garry Tan (Y Combinator CEO) | **安装路径**: `~/.claude/skills/gstack/`

GStack 是一套 Claude Code 技能集合，提供 23+ 个斜杠命令，覆盖从产品思考到 QA 测试、代码审查到部署发布的完整开发工作流。核心能力是**无头 Chromium 浏览器**（`$B` 命令），可以截图、点击、填表、断言页面状态。

---

## 安装

```bash
git clone --single-branch --depth 1 https://github.com/garrytan/gstack.git ~/.claude/skills/gstack
cd ~/.claude/skills/gstack && ./setup
```

> 前置依赖：`bun`（setup 脚本会提示安装方式，或提前运行 `curl -fsSL https://bun.sh/install | bash`）

---

## 核心命令速查

### 开发工作流（按阶段）

| 阶段 | 命令 | 用途 |
|------|------|------|
| **想法** | `/office-hours` | 头脑风暴、产品想法、"这值得做吗" |
| **规划** | `/plan-ceo-review` | 策略/范围/抱负审查 |
| | `/plan-eng-review` | 架构/技术设计审查 |
| | `/plan-design-review` | 设计方案审查 |
| | `/autoplan` | 自动运行所有审查 |
| **设计** | `/design-consultation` | 设计系统/品牌/视觉风格 |
| | `/design-html` | 生成 HTML 设计稿 |
| | `/design-shotgun` | 快速多方案设计 |
| **调试** | `/investigate` | 报告 Bug、错误、"为什么坏了" |
| **测试** | `/qa` | QA 测试 + 自动修复 Bug |
| | `/qa-only` | 仅报告 Bug，不修复 |
| **审查** | `/review` | 合并前代码 Review（diff 审查）|
| | `/design-review` | 线上页面视觉审查 |
| | `/cso` | 安全漏洞审计（OWASP）|
| **发布** | `/ship` | 创建 PR、推送代码 |
| | `/land-and-deploy` | 合并 + 部署 + 验证一键完成 |
| | `/canary` | 发布后监控生产环境 |
| **文档** | `/document-release` | 自动更新 CHANGELOG/README |
| **回顾** | `/retro` | 周回顾，梳理本周上线内容 |

### 安全与控制

| 命令 | 用途 |
|------|------|
| `/careful` | 进入谨慎模式，每步确认 |
| `/guard` | 保护关键文件/目录 |
| `/freeze` | 锁定某目录禁止编辑 |
| `/unfreeze` | 解锁 |

### 上下文管理

| 命令 | 用途 |
|------|------|
| `/context-save` | 保存当前进度 |
| `/context-restore` | 恢复上次进度，"我上次做到哪了" |

### 其他实用命令

| 命令 | 用途 |
|------|------|
| `/codex` | 调用 OpenAI Codex 二次审查 |
| `/benchmark` | 页面性能基准测试 |
| `/make-pdf` | 将页面导出为 PDF |
| `/open-gstack-browser` | 打开真实浏览器界面做 QA |
| `/health` | 代码质量仪表盘 |
| `/learn` | 查看 gstack 积累的项目经验 |
| `/gstack-upgrade` | 升级 gstack |

---

## 浏览器 QA 工具（`$B` 命令）

gstack 内置持久化无头 Chromium，第一次调用启动约 3 秒，之后每条命令约 100-200ms。Session 结束 30 分钟后自动关闭。

### 初始化变量（每次使用前）

```bash
B="$HOME/.claude/skills/gstack/browse/dist/browse"
```

### 常用操作

```bash
# 导航
$B goto https://yoursite.com
$B back / $B forward / $B reload
$B url                          # 打印当前 URL

# 读取页面
$B text                         # 清洁文本内容
$B snapshot -i                  # 交互元素树（带 @e1 @e2 引用）
$B screenshot /tmp/page.png     # 截图
$B console                      # 控制台日志
$B console --errors             # 仅显示错误
$B network                      # 网络请求列表

# 交互（用 @e 引用替代 CSS 选择器）
$B click @e3
$B fill @e2 "用户输入内容"
$B select @e4 "选项值"
$B upload @e5 /path/to/file.pdf
$B press Enter

# 断言
$B is visible ".modal"
$B is enabled "#submit-btn"
$B is checked "#agree-checkbox"
$B js "document.title"          # 执行 JS

# 多步骤链式操作（高效）
echo '[
  ["goto","https://yourapp.com/login"],
  ["snapshot","-i"],
  ["fill","@e2","test@example.com"],
  ["fill","@e3","password123"],
  ["click","@e4"],
  ["screenshot","/tmp/after-login.png"]
]' | $B chain
```

### Snapshot 系统（核心工具）

`$B snapshot` 是理解页面结构的主要工具，返回带引用 ID 的无障碍树。

```bash
$B snapshot -i          # 仅交互元素（按钮/链接/输入框）
$B snapshot -D          # 与上次对比差异（验证操作结果）
$B snapshot -a -o /tmp/annotated.png   # 生成带红框标注的截图
$B snapshot -C          # 包含可点击 div（下拉/弹出层）
$B snapshot -s "#main"  # 只看 #main 区域
$B snapshot -d 2        # 限制树深度
```

### 响应式测试

```bash
$B goto https://yoursite.com
$B responsive /tmp/layout     # 同时生成 mobile/tablet/desktop 三张截图
```

### 页面环境差异比对

```bash
$B diff https://staging.app.com https://prod.app.com
```

### 已认证页面测试（导入 Cookie）

```bash
$B cookie-import-browser              # 从本地浏览器导入 Cookie（交互选择）
$B goto https://yourapp.com/dashboard # 测试登录后页面
```

---

## 典型使用场景

### 场景 1：新功能上线前完整流程

```
/office-hours       → 确认功能值得做
/plan-eng-review    → 审查技术方案
/qa                 → 测试并修复 Bug
/review             → 代码 diff 审查
/ship               → 创建 PR 推代码
/canary             → 上线后监控
```

### 场景 2：线上 Bug 快速定位

```
/investigate        → 输入报错信息，自动四阶段调试
                     （调查 → 分析 → 假设 → 修复）
```

### 场景 3：QA 一键测试修复

```
/qa                 → 自动测试站点 → 发现 Bug → 修复并提交
```

> QA 分三档：Quick（严重/高级）、Standard（+中级）、Exhaustive（+外观）

### 场景 4：发布前安全扫描

```
/cso                → OWASP Top 10 漏洞审查 + 修复建议
```

---

## 技巧

1. **先 `snapshot -i` 再操作**：看所有交互元素的 `@e` 引用，避免猜 CSS 选择器。
2. **用 `snapshot -D` 验证**：操作前后对比，确认页面真的发生变化。
3. **用 `chain` 跑长流程**：单条命令完成多步骤，节省 CLI 开销。
4. **`console` 检查副作用**：点击后看控制台，捕捉不显示在界面上的 JS 错误。
5. **`snapshot -a` 生成 Bug 证据**：带红框标注的截图直接贴到 Issue 里。

---

## 卸载 / 更新

```bash
# 更新
/gstack-upgrade

# 手动更新
cd ~/.claude/skills/gstack && git pull && ./setup

# 卸载
rm -rf ~/.claude/skills/gstack
```

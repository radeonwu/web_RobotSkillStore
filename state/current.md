# 苹果风格改造进度

## 已完成
- [x] lifecycle.html (中英) - 2024-01-20
- [x] platform.html (中英) - 2024-01-20
- [x] skills.html (中英) - 2024-01-20
- [x] deployment.html (中英) - 2024-01-20
- [x] concepts.html (中英) - 2024-01-20
- [x] contact.html (中英) - 2024-01-20
- [x] docs/index.html (中英) - 2024-01-20
- [x] agents.html (中英) - 2024-01-20
- [x] architecture.html (中英) - 2024-01-20
- [x] demo.html (中英) - 2024-01-20
- [x] concept-*.html (中英 4个) - 2024-01-20
- [x] developers.html (中英) - 2024-01-20
- [x] faq.html (中英) - 2024-01-20
- [x] safety.html (中英) - 2024-01-20

## 当前状态
**最后更新**: 2024-01-20
**当前版本**: v6.77.65

### 已改造页面
| 页面 | 英文 | 中文 | 状态 |
|------|------|------|------|
| Lifecycle | en/lifecycle.html | zh/lifecycle.html | ✅ 完成 v6.77.51 |
| Platform | en/platform.html | zh/platform.html | ✅ 完成 v6.77.53 |
| Skills | en/skills.html | zh/skills.html | ✅ 完成 v6.77.52 |
| Deployment | en/deployment.html | zh/deployment.html | ✅ 完成 v6.77.54 |
| Concepts | en/concepts.html | zh/concepts.html | ✅ 完成 v6.77.55 |
| Contact | en/contact.html | zh/contact.html | ✅ 完成 v6.77.55 |
| Docs | en/docs/index.html | zh/docs/index.html | ✅ 完成 v6.77.56 |
| Agents | en/agents.html | zh/agents.html | ✅ 完成 v6.77.57 |
| Architecture | en/architecture.html | zh/architecture.html | ✅ 完成 v6.77.58 |
| Demo | en/demo.html | zh/demo.html | ✅ 完成 v6.77.63 |
| Concept: What is Skill | en/concept-what-is-robot-skill.html | zh/concept-what-is-robot-skill.html | ✅ 完成 v6.77.59 |
| Concept: Skill vs Task vs Program | en/concept-skill-task-program.html | zh/concept-skill-task-program.html | ✅ 完成 v6.77.60 |
| Concept: Determinism | en/concept-why-determinism-matters.html | zh/concept-why-determinism-matters.html | ✅ 完成 v6.77.61 |
| Concept: Robot vs LLM | en/concept-robot-skill-vs-llm-skill.html | zh/concept-robot-skill-vs-llm-skill.html | ✅ 完成 v6.77.62 |
| Developers | en/developers.html | zh/developers.html | ✅ 完成 v6.77.64 |
| FAQ | en/faq.html | zh/faq.html | ✅ 完成 v6.77.64 |
| Safety | en/safety.html | zh/safety.html | ✅ 完成 v6.77.65 |

### 待改造页面 (P0)
| 页面 | 英文 | 中文 | 状态 |
|------|------|------|------|
| (全部完成) | - | - | ✅ |

### 待改造页面 (P1)
| 页面 | 英文 | 中文 | 状态 |
|------|------|------|------|
| (全部完成) | - | - | ✅ |

### 待改造页面 (P2)
| 页面 | 状态 |
|------|------|
| (全部完成) | ✅ |

## 改造记录

### safety.html 改造详情
**完成时间**: 2024-01-20
**版本**: v6.77.65

**主要改动**:
- ✅ 添加移动端汉堡菜单按钮
- ✅ 将 `<div class="layout">` 改为 `<main class="apple-main">`
- ✅ 移除 `<aside class="toc">` 侧边目录
- ✅ 首屏改为 `<section class="apple-hero">` 英雄区
- ✅ "Position" 区使用蓝色渐变卡片展示 RSS 安全立场
- ✅ "Why Skill-Level Safety" 区使用浅灰卡片展示 "The Gap"
- ✅ "Boundaries" 区使用三卡片网格展示（🚫 Reject、🔄 Adapt、🧠 Reason）
- ✅ "Policies" 区使用流程卡片展示安全强制机制
- ✅ "Sim2Real Safety" 区使用绿色渐变卡片展示一致性
- ✅ "Safety as Enabler" 区使用火箭图标卡片
- ✅ 添加 `animate-on-scroll` 滚动动画

**页面结构**:
1. Hero 区 - "Safety" 标题 + "Skill-Level Safety as a First-Class Concept" 副标题
2. Position 区 - 左文右图（蓝色渐变卡片展示 "Safety First"）
3. Why Skill-Level Safety 区 - 右图左文（浅灰卡片展示 "The Gap"）
4. Boundaries 区 - 左文右图（三卡片网格：🚫 Reject、🔄 Adapt、🧠 Reason）
5. Policies 区 - 左文右图（白色卡片展示安全强制流程：Constraints → Policies → Verification）
6. Sim2Real Safety 区 - 右图左文（绿色渐变卡片展示 "Same Constraints"）
7. Safety as Enabler 区 - 左文右图（浅灰卡片展示 "Foundation for Scale"）
8. Closing 区 - 深色渐变背景，展示 "A Missing Layer" 结论

### faq.html 改造详情
**完成时间**: 2024-01-20
**版本**: v6.77.64

**主要改动**:
- ✅ 添加移动端汉堡菜单按钮
- ✅ 将 `<div class="layout">` 改为 `<main class="apple-main">`
- ✅ 移除 `<aside class="toc">` 侧边目录
- ✅ 首屏改为 `<section class="apple-hero">` 英雄区
- ✅ 创建 FAQ 手风琴交互（`.faq-container`，点击展开/收起）
- ✅ 活跃问题使用蓝色渐变背景，图标旋转动画
- ✅ 保留对比表格，使用苹果风格样式（渐变表头、绿色高亮列）
- ✅ 添加 `animate-on-scroll` 滚动动画
- ✅ 内联 JavaScript 实现手风琴功能

**页面结构**:
1. Hero 区 - "Frequently Asked Questions" 标题 + "Robot Skill vs LLM Skill" 副标题
2. Purpose 区 - 绿色渐变卡片说明页面目的
3. FAQ 区 - 8 个问答手风琴（Q1-Q8，包含对比表格）
4. Quote 区 - 深色渐变背景，展示 RSS 理念

### lifecycle.html 改造详情
**完成时间**: 2024-01-20
**版本**: v6.77.51

**主要改动**:
- ✅ 添加移动端汉堡菜单按钮
- ✅ 将 `<div class="layout">` 改为 `<main class="apple-main">`
- ✅ 移除 `<aside class="toc">` 侧边目录
- ✅ 首屏改为 `<section class="apple-hero">` 英雄区
- ✅ 内容区块改为 `<section class="section-hero">` 左右布局
- ✅ 四个生命周期阶段使用渐变色数字卡片展示
- ✅ 添加 `animate-on-scroll` 滚动动画

**页面结构**:
1. Hero 区 - 标题 + 副标题 + CTA 按钮
2. Overview 区 - 左图右文
3. Register 区 - 右图左文（蓝色渐变卡片）
4. Validate 区 - 左图右文（蓝色渐变卡片）
5. Certify 区 - 右图左文（蓝色渐变卡片）
6. Deploy 区 - 左图右文（蓝色渐变卡片）
7. CTA 区 - 浅灰背景，居中按钮

### skills.html 改造详情
**完成时间**: 2024-01-20
**版本**: v6.77.52

**主要改动**:
- ✅ 添加移动端汉堡菜单按钮
- ✅ 将 `<div class="layout">` 改为 `<main class="apple-main">`
- ✅ 移除 `<aside class="toc">` 侧边目录
- ✅ 首屏改为 `<section class="apple-hero">` 英雄区
- ✅ 技能卡片使用 `apple-card` + `apple-grid` 展示
- ✅ 新增 Evidence Levels 说明区块
- ✅ 添加 `animate-on-scroll` 滚动动画
- ✅ 底部 CTA 使用深色渐变背景

**页面结构**:
1. Hero 区 - 标题 + 副标题 + CTA 按钮
2. Skills 区 - 技能卡片网格（4个技能：tighten_screw, connector_insert, pick_place, inspect_aoi）
3. Evidence Levels 区 - 证据等级说明卡片（E2/E1/E0）
4. CTA 区 - 深色渐变背景，"Ready to Deploy?"

### concepts.html 改造详情
**完成时间**: 2024-01-20
**版本**: v6.77.53

**主要改动**:
- ✅ 添加移动端汉堡菜单按钮
- ✅ 将 `<div class="layout">` 改为 `<main class="apple-main">`
- ✅ 移除 `<aside class="toc">` 侧边目录
- ✅ 首屏改为 `<section class="apple-hero">` 英雄区
- ✅ 保留原有 tab 切换功能，使用苹果风格样式（圆角按钮）
- ✅ 添加"核心原则"三卡片区块（可迁移、可治理、可认证）
- ✅ 内联 CSS 处理 tab 样式和响应式布局
- ✅ 添加 `animate-on-scroll` 滚动动画

**页面结构**:
1. Hero 区 - "Concepts & Boundaries" 标题 + 副标题
2. What is RSS 区 - 左文右图（蓝色渐变卡片展示 RSS 平台）
3. Explore Core Concepts 区 - Tab 切换面板（4个概念页面通过 iframe 加载）
4. Key Principles 区 - 三卡片网格（Portable、Governable、Certifiable）
5. CTA 区 - 深色渐变背景，"Ready to Dive Deeper?"

### contact.html 改造详情
**完成时间**: 2024-01-20
**版本**: v6.77.55

**主要改动**:
- ✅ 添加移动端汉堡菜单按钮
- ✅ 将 `<div class="layout">` 改为 `<main class="apple-main">`
- ✅ 移除 `<aside class="toc">` 侧边目录
- ✅ 首屏改为 `<section class="apple-hero">` 英雄区
- ✅ 表单使用苹果风格卡片设计，带阴影和圆角
- ✅ 输入框 focus 状态使用蓝色高亮效果
- ✅ 保留留言板功能和证据导出功能
- ✅ 添加 `animate-on-scroll` 滚动动画
- ✅ 证据包使用三卡片网格展示

**页面结构**:
1. Hero 区 - "Contact" 标题 + 副标题
2. Get in Touch 区 - 左文右图（蓝色渐变卡片，邮箱图标）
3. Send a Message 区 - 苹果风格表单卡片（浅灰背景）
4. Latest Messages 区 - 留言板卡片，带收起/清空按钮
5. Evidence Bundles 区 - 证据包三卡片网格（message.json, outcome.json, execution_context.json）

### agents.html 改造详情
**完成时间**: 2024-01-20
**版本**: v6.77.57

**主要改动**:
- ✅ 添加移动端汉堡菜单按钮
- ✅ 将 `<div class="layout">` 改为 `<main class="apple-main">`
- ✅ 移除 `<aside class="toc">` 侧边目录
- ✅ 首屏改为 `<section class="apple-hero">` 英雄区
- ✅ Agent 能力使用卡片网格展示
- ✅ 添加 `animate-on-scroll` 滚动动画

**页面结构**:
1. Hero 区 - "Agents" 标题 + 副标题
2. Agent Capabilities 区 - 能力卡片网格
3. Key Features 区 - 特性展示

### architecture.html 改造详情
**完成时间**: 2024-01-20
**版本**: v6.77.58

**主要改动**:
- ✅ 添加移动端汉堡菜单按钮
- ✅ 将 `<div class="layout">` 改为 `<main class="apple-main">`
- ✅ 移除 `<aside class="toc">` 侧边目录
- ✅ 首屏改为 `<section class="apple-hero">` 英雄区
- ✅ 保留大型 SVG 架构图，集成到苹果风格卡片中
- ✅ 使用卡片网格展示架构原则（RSP Backbone、Decoupling、Sim2Real、Safety）
- ✅ 添加 `animate-on-scroll` 滚动动画

**页面结构**:
1. Hero 区 - "Architecture" 标题 + 副标题
2. Platform-Centered Design 区 - 左文右图（RSS 平台中心卡片）
3. Architecture Diagram 区 - 完整 SVG 架构图（浅灰背景）
4. RSP Backbone 区 - 左文右图（RSP 协议说明）
5. Decoupling 区 - 左图右文（四卡片展示：What/How/Where/Decoupled）
6. Sim2Real 区 - 闭环展示（蓝色渐变卡片）
7. Safety & Extensible 区 - 双卡片网格（安全内置 + 为扩展而生）

### demo.html 改造详情
**完成时间**: 2024-01-20
**版本**: v6.77.63

**主要改动**:
- ✅ 添加移动端汉堡菜单按钮
- ✅ 将 `<div class="layout">` 改为 `<main class="apple-main">`
- ✅ 移除 `<aside class="toc">` 侧边目录
- ✅ 首屏改为 `<section class="apple-hero">` 英雄区
- ✅ 保留视频播放器，使用 `.demo-video-card` 样式容器
- ✅ 保留大型 SVG 泳道图，集成到苹果风格卡片中
- ✅ 创建交互式 Demo 控制区（运行按钮、下载按钮）
- ✅ 创建 "Is / Is Not" 对比网格（`.is-not-grid`，桌面端2列，移动端1列）
- ✅ 添加深色代码块用于 API 端点展示
- ✅ 添加 `animate-on-scroll` 滚动动画

**页面结构**:
1. Hero 区 - "技能应用示例" 标题 + "UR5 参考执行模型" 副标题
2. Video 区 - 视频播放器（.demo-video-card 容器）
3. Reference Model 区 - 左文右图（蓝色渐变卡片展示规格优先执行）
4. Swimlane Diagram 区 - SVG 泳道图（浅灰背景，展示 Agent/Runtime/Robot 流程）
5. Key Features 区 - 四卡片网格（规格优先、快速失败、可审计、可比较）
6. Interactive Demo 区 - 交互式演示控制（运行按钮、下载按钮、时间轴、证据包）
7. Is / Is Not 区 - 双卡片网格（绿色"这是"，黄色"不是"）
8. Future Interface 区 - 左文右图（深色代码块展示 API 端点）

### developers.html 改造详情
**完成时间**: 2024-01-20
**版本**: v6.77.64

**主要改动**:
- ✅ 添加移动端汉堡菜单按钮
- ✅ 将 `<div class="layout">` 改为 `<main class="apple-main">`
- ✅ 移除 `<aside class="toc">` 侧边目录
- ✅ 首屏改为 `<section class="apple-hero">` 英雄区
- ✅ "What You Need" 区使用三卡片网格展示（Robot、Runtime、Skill Definition）
- ✅ "Minimal Workflow" 区使用四卡片网格展示 1-2-3-4 步骤
- ✅ "Next Steps" 区使用可点击链接卡片
- ✅ 添加 `animate-on-scroll` 滚动动画

**页面结构**:
1. Hero 区 - "Developers" 标题 + "Get started with Robot Skill Store incrementally" 副标题
2. Quick Start 区 - 左文右图（蓝色渐变卡片展示 Incremental Adoption）
3. What You Need 区 - 左文右图（三卡片网格：Robot、Runtime、Skill Definition）
4. Minimal Workflow 区 - 全宽四卡片网格（1️⃣ Define、2️⃣ Register、3️⃣ Select、4️⃣ Execute）
5. Defining a Skill 区 - 左文右图（浅灰卡片展示 Skill Specification）
6. Register and Discover 区 - 右图左文（蓝色渐变卡片展示 Registry）
7. Execution and Feedback 区 - 左文右图（浅灰卡片展示 Continuous Loop）
8. Next Steps 区 - 三卡片链接网格（Demo、Lifecycle、Safety）

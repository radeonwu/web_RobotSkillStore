# 苹果风格页面改造计划

## 背景
主页面 (index.html) 已经更新为苹果风格设计，需要将其他导航页面统一改造为相同的设计风格。

## 苹果风格设计规范

### 页面结构
```html
<header class="topbar">
  <div class="topbar-inner">
    <a class="brand">Logo + 品牌名</a>
    <button class="mobile-menu-btn">汉堡菜单</button>
    <nav class="topnav">导航链接</nav>
    <div class="top-actions">语言切换 + 主题切换</div>
  </div>
</header>

<main class="apple-main">
  <section class="apple-hero">英雄区</section>
  <section class="section-hero">内容区（左图右文/右图左文）</section>
</main>
```

### 核心CSS类
| 类名 | 用途 |
|------|------|
| `apple-main` | 主内容容器 |
| `apple-hero` | 全宽英雄区 |
| `section-hero` | 内容区块（支持左右布局） |
| `apple-card` | 卡片样式 |
| `apple-grid` / `apple-grid-4` | 网格布局 |
| `btn-apple` | 苹果风格按钮 |
| `animate-on-scroll` | 滚动动画 |
| `delay-1` ~ `delay-5` | 动画延迟 |

### 移除的旧类
- `<div class="layout">` → `<main class="apple-main">`
- `<main class="content">` → 合并到 `apple-main`
- `<aside class="toc">` → 苹果风格不使用侧边目录
- `<section class="section-plain">` → `<section class="section-hero">`

## 需要改造的页面

### 导航页面（中英文）
| 英文页面 | 中文页面 | 优先级 | 状态 |
|---------|---------|-------|------|
| en/lifecycle.html | zh/lifecycle.html | P0 | ✅ 完成 |
| en/platform.html | zh/platform.html | P0 | ✅ 完成 |
| en/skills.html | zh/skills.html | P0 | ✅ 完成 |
| en/deployment.html | zh/deployment.html | P0 | ✅ 完成 |
| en/concepts.html | zh/concepts.html | P1 | ✅ 完成 |
| en/contact.html | zh/contact.html | P1 | ✅ 完成 |

### 文档页面
| 页面 | 优先级 | 状态 |
|------|-------|------|
| en/docs/index.html | P1 | ✅ 完成 |
| zh/docs/index.html | P1 | ✅ 完成 |

### 概念页面
| 页面 | 优先级 | 状态 |
|------|-------|------|
| en/concept-*.html (4个) | P2 | ✅ 完成 |
| zh/concept-*.html (4个) | P2 | ✅ 完成 |

### 其他页面
| 页面 | 优先级 | 状态 |
|------|-------|------|
| en/agents.html, zh/agents.html | P2 | ✅ 完成 |
| en/architecture.html, zh/architecture.html | P2 | ✅ 完成 |
| en/demo.html, zh/demo.html | P2 | ✅ 完成 |
| en/developers.html, zh/developers.html | P2 | ✅ 完成 |
| en/faq.html, zh/faq.html | P2 | ✅ 完成 |
| en/safety.html, zh/safety.html | P2 | ✅ 完成 |

## 改造步骤

### 单页面改造流程
1. 读取旧页面内容
2. 保留页面核心内容（标题、段落、图片）
3. 替换HTML结构：
   - header 保持不变
   - layout → apple-main
   - section-plain/section → section-hero
   - 移除 toc 侧边栏
4. 应用苹果风格CSS类
5. 添加 animate-on-scroll 动画
6. 更新 CSS 版本号 `?v=6.77.52`
7. 测试页面显示

### 改造顺序
1. **P0 页面**（导航核心页面）：
   - ✅ lifecycle
   - ✅ platform
   - ✅ skills
   - ✅ deployment
2. **P1 页面**（次要页面）：
   - ✅ concepts
   - ✅ contact
   - ✅ docs
3. **P2 页面**（其他页面）：
   - ✅ agents
   - ✅ architecture
   - ✅ demo
   - ✅ concept-*.html (4个)
   - ✅ developers
   - ✅ faq
   - ✅ safety

## 注意事项
- 保持内容完整性，只改结构不改内容
- 双语页面同步改造
- 移动端汉堡菜单功能保留
- 生命周期进度条组件保留（如页面需要）
- 更新 CSS 版本号确保缓存刷新

## 当前版本
- **CSS 版本**: v6.77.65
- **最后更新**: 2024-01-20
- **已完成**: 17/17 页面 (P0: 4/4 ✅, P1: 3/3 ✅, P2: 10/10 ✅)
- **状态**: 🎉 所有页面改造完成！

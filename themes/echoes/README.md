# Echoes — Outer Wilds 主题

> 衍生自 [hexo-theme-cactus](https://github.com/probberechts/hexo-theme-cactus) (MIT)，深度魔改的 Outer Wilds 风格 Hexo 主题。

用于 [EchoesFromShell](https://echoesfromshell.netlify.app/) 博客。

## 魔改内容一览

### 星空系统 (`source/js/starfield.js`)
- Three.js 3D 粒子星空（替代原版静态头像）
- 加权光谱色系统（蓝/白/黄/橙/红），含 40 颗特殊色星
- 物理闪烁模型（steady / shimmer / blink）
- 自行（Proper Motion）运动 + 双轴自转 + 呼吸缩放
- 视差惯性跟随滚动
- **流星系统**：5 种样式随机穿越
- **彗星系统**：双尾结构（尘埃尾 + 离子尾），5 种稀有样式
- 星云 Sprite 系统（7 片，含暖色云）
- 所有参数 `CONFIG` 统一管理

### 配色系统 (`source/css/_colors/`, `source/css/_partial/`, `source/css/_highlight/`)
- 全新 `outer-wilds` 配色方案
- 挪麦铜 × 哈斯蓝撞色体系
- 量子色系（periwinkle hue ~245°）
- 自定义语法高亮主题
- `color-mix()` 替代硬编码 rgba
- blockquote 铜边框、代码全息底、焦点指示器等视觉增强

### 跨页过渡 (`source/js/page-transitions.js`)
- Chrome/Edge：CSS `@view-transition` 原生跨页淡入淡出
- Firefox/Safari：JS 遮罩 fallback

### 其他
- 本地 Three.js r128（规避 CDN 墙）
- `astro_nomai.png` 透明背景头像
- `theme_config` 配置外野风配色开关

## 保留的原版功能

- 响应式布局
- 多级导航菜单
- 本地搜索
- Disqus / Utterances 评论
- Google Analytics / Baidu Tongji / Umami
- Font Awesome 图标
- i18n 多语言支持
- Projects 列表
- RSS 订阅

## 许可证

MIT — 详见 [LICENSE](LICENSE)。原版 Cactus 主题的所有权利归 Pieter Robberechts 等原作者所有。

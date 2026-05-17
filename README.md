# EchoesFromShell

> *De la paix, à la lisière de la vie* 。

🌐 **[echoesfromshell.netlify.app](https://echoesfromshell.netlify.app/)**

---

## 关于本博客

EchoesFromShell 是一个自托管的个人博客，使用 [Hexo](https://hexo.io/) 构建，部署于 [Netlify](https://www.netlify.com/)。

内容方向：技术随笔、音乐、开源、独立网络精神。

特色：
- 📡 **完整 RSS** — 双格式输出（Atom 1.0 + RSS 2.0），全文内容，多个订阅入口

---

## 技术栈

| 层 | 选型 |
|---|------|
| 构建 | Hexo |
| 主题 | Echoes（forked from [hexo-theme-cactus](https://github.com/probberechts/hexo-theme-cactus)，MIT） |
| 3D 渲染 | Three.js r128 |
| 托管 | Netlify（纯静态托管，本地构建后 push） |
| 字体 | Font Awesome 6 + Meslo LG + Vazir |
| RSS | hexo-generator-feed（Atom 1.0 + RSS 2.0 双格式） |

---

## Echoes 主题

本博客搭载的主题 **Echoes** 衍生自 hexo-theme-cactus (MIT)，保留原版响应式布局、多语言支持、评论系统，并进行了大量魔改。

详见 [themes/echoes/README.md](themes/echoes/README.md)。

---

## RSS 订阅

| 格式 | 地址 |
|------|------|
| Atom 1.0 | `/atom.xml` |
| RSS 2.0 | `/rss2.xml` |

全文输出，Newsboat / Miniflux / Feedly 均可使用。

---

## 本地运行

```bash
git clone git@github.com:mellvie/EchoesFromShell.git
cd EchoesFromShell
npm install
hexo server
```

> 注意：主题 Three.js 已内嵌于 `themes/echoes/source/js/lib/`，无需网络加载。

---

## 许可证

博客内容 © Mellvie，保留所有权利。

Echoes 主题基于 [hexo-theme-cactus](https://github.com/probberechts/hexo-theme-cactus) (MIT)，详见 [themes/echoes/LICENSE](themes/echoes/LICENSE)。

---

## 致谢

- 博客头像（挪麦人）图像资源来自 Bilibili @彼得喵君 (UID:1893449)
- Outer Wilds 世界观归属于 Mobius Digital / Annapurna Interactive

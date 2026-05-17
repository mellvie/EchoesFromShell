---
title: 为什么我会推荐使用 RSS
abbrlink: 20260516
date: 2026-05-16 12:20:00
tags:
  - rss
  - indieweb
  - self-hosting
  - technology
---

> 这个博客有 RSS 订阅了。

---

# 一段简短的历史

## 前传：1997

RSS 的故事可以追溯到 Web 1.0 时代的几个实验性格式。1997 年，微软提出了 **Channel Definition Format (CDF)**，Netscape 贡献了 **Meta Content Framework (MCF)**，Dave Winer 则在 UserLand 发布了 **scriptingNews** 格式。这些都是在思考同一个问题：**机器如何自动发现网站有更新？**

## Netscape 时代：RSS 的诞生

**1999 年 3 月 15 日**，Netscape 发布了 **RSS 0.90**，全称 **RDF Site Summary**，由 Ramanathan Guha 编写。它基于 W3C 的 RDF（资源描述框架），用于在 My.Netscape.com 门户上聚合新闻。

仅四个月后，**1999 年 7 月 10 日**，Netscape 的 Dan Libby 简化了规范，发布了 **RSS 0.91**，去掉了 RDF 依赖，变得更薄、更实用。

## 分叉时代：三派分立

2000 年，RSS 进入了著名的**分叉之战**：

- **UserLand 路线**（Dave Winer）：2000 年 6 月 9 日发布 UserLand 版的 RSS 0.91，随后 **2000 年 12 月 25 日**推出 RSS 0.92，最终在 **2002 年 8 月 19 日**发布 **RSS 2.0**——此时 RSS 的含义变为了 **Really Simple Syndication**。2003 年 7 月 15 日，RSS 2.0 的维护权移交至哈佛大学伯克曼互联网与社会中心，Dave Winer 仍是主要作者。

- **RSS-DEV 工作组**：这是一群独立开发者，坚持 RDF 的根基，在 **2000 年 12 月 6 日**发布了 **RSS 1.0**，全称仍为 **RDF Site Summary**。他们设计了模块化扩展机制（Dublin Core、Syndication、Content 等模块），至今仍被广泛使用。

- **Atom**：2003 年起，因对 RSS 2.0 标准化进程的不满（规范模糊、缺少正式的标准组织背书），一批社区成员在 IETF 成立了 Atom Publishing Protocol 工作组。**2005 年 12 月**，**Atom 1.0** 作为 IETF **RFC 4287**（Proposed Standard）正式发布。它解决了 RSS 2.0 中日期格式不统一、类型定义模糊等问题。

这就是为什么今天你会看到 **`atom.xml`** 和 **`rss2.xml`** 并存的局面。

## 日落与重生

2005 年 10 月，Google Reader 上线，RSS 开始进入大众视野。巅峰时期，它是很多人获取信息的主要方式。

**2013 年 3 月 13 日**，Google 宣布将于同年 **7 月 1 日**关闭 Google Reader。消息一出，互联网哀鸿遍野。数百万用户被迫寻找替代品，Feedly 在三天内新增了 50 万用户。但更大的影响是：**很多人开始相信 RSS "死"了。**

社交媒体崛起，算法推荐取代了手动订阅。但 RSS 从未消失——它只是回到了它最擅长的领域：**独立博客、自托管网站、技术社区的底层基建**。

今天，NewsBlur、Miniflux、NetNewsWire、FreshRSS 等阅读器依然活跃，2024 年甚至出现了新入局者如 ReadKit。这条协议在默默运转，每天同步着数以亿计的信息。

---

# RSS 的价值从未消失

如果你经历过推送算法的喂养，再回到 RSS，你会发现它提供的是截然不同的东西：

### 1. 控制阅读流

没有算法替你排序，没有"你可能也喜欢"。RSS 的输出就是输入——你订阅了什么，就看到什么。时间线就是你订阅源的**联合时间线**，不是平台的时间线。

### 2. 隐私

RSS 是纯拉取形式的（pull）。没有追踪像素，没有行为分析，不需要登录。你的阅读器知道你读了什么，但平台不知道。这在 2026 年的互联网上是稀缺品。

### 3. 对抗信息孤岛

博客在减少，内容在向封闭平台集中。但每多一个 RSS 订阅源，就是多一根通向独立网站的线。RSS 可能是目前唯一一种**跨平台的、去中心化的订阅协议**——不依附于任何一家公司、不被任何算法左右。

### 4. 深度阅读

RSS 阅读器鼓励**扫标题 -> 选读**的模式，而不是短视频式的无限刷新。Newsboat、Miniflux、NetNewsWire 这些阅读器没有"上瘾设计"，你读到的东西是你真正想读的。

---

# 如何订阅 EchoesFromShell

这个博客现在提供两种格式的完整内容 RSS Feed：

| 格式 | 地址 | 特点 |
|------|------|------|
| **Atom 1.0** | `/atom.xml` | IETF RFC 4287 标准，包含更新时间和分类元数据 |
| **RSS 2.0.11** | `/rss2.xml` | 最广泛兼容，几乎所有阅读器都支持 |

两条 Feed 都包含**全文内容**（不是摘要），所以在阅读器里可以直接读完文章，不必点回网页。
> 当然如果想来参观我的博客，欣赏我博客的新装修，随时欢迎~

### Newsboat（终端党）

```bash
# 在 urls 文件中添加
https://echoesfromshell.netlify.app/rss2.xml
```

### Miniflux / FreshRSS（自托管）

添加源时输入上面的 URL 即可，Feed 自动发现会工作。

### Feedly / Inoreader 等云阅读器

搜索 `EchoesFromShell` 或直接添加 `https://echoesfromshell.netlify.app/atom.xml`。

### 浏览器

点击首页的 **RSS 图标**，或直接访问 `/rss2.xml`，浏览器如果有 RSS 扩展会自动识别。

### 我的阅读器

我自己在手机上阅读 RSS 使用的是 **Read You**，一个开源的 Material You 风格的 RSS 阅读器。在 **F-Droid** 上就能直接下载，使用体验还算不错。

---

# 最后

 RSS-并不是新技术。它甚至不出彩。但它可能是在这个封闭趋同的互联网上，最接近"你真正拥有自己的信息流"的东西。

**此博客有一根 RSS 线，随时可以连上。**

---

*关于此博客的 RSS 设置：同时输出 Atom 1.0 和 RSS 2.0，全文内容，20 条上限，由 hexo-generator-feed 生成。如果你发现任何 Feed 异常，欢迎在 GitHub 提 issue，或者 mail me。*


----
End

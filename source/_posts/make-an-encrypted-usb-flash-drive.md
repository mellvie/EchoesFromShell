---
title: 在U盘建立一个加密存储库
abbrlink: 5738
date: 2026-07-06 16:29:32
tags:
    - privacy
    - encryption
    - tools
---

# 前言

有段时间闲来无事，我开始整理文件，作为计科人，我对数据还是较为敏感的。整理数据未免要和存储打交道，于是整个工作就是把不重要的数据清理或者组织存放，重要的数据集合起来并且备份。然而在数据备份时，我意识到，重要数据除了照片视频之外，总的数据量并不大，正好手头有一个U盘，仅**16GB**，但存放文本类和少量音频、图像内容是充足的。并且这个U盘也偶尔随身携带，有时候装着 `PPT` , `Excel` , `PDF` 之类的小文件较为方便。

> 除了公开可见的为了便捷而存放进去的文件，我如果将我的重要文件也存放其中，必然要保证数据安全，即使我意外丢失，也不会数据泄漏，于是这篇文章就是我对我的重要数据存放在U盘中使用的安全措施。

# 加密软件

看来看去，最后选择使用的加密软件是 `Cryptomator`。

## 选择

在确定使用 `Cryptomator` 之前，我是考虑过把U盘本身直接加密成一个加密驱动器的，然而这种方式损失了U盘的易用性，一般文件放进去单纯为了转移和使用的时候，并不需要我输入密码才能操作，作为一个普通U盘是它应有的身份。
于是加密全盘的方案被舍弃。

选择 `Cryptomator`正是看上了其开源的特性，透明的加密方法，和强大的功能,以及其跨平台能力。


因此这个方式更为合适，U盘存储一般文件就正常存放，我的重要文件存储在其中的时候就需要加密存放。即用`Cryptomator`建立一个加密仓库，放到U盘中，只有需要处理加密文件的时候使用`Cryptomator`来解密那个仓库并挂载，在一般情况使用的时候，直接访问U盘就行。在操作加密仓库的时候，只要挂载了，就能像普通的驱动器一样使用，创建文件夹，复制粘贴等，加密仓库是具有普通的文件结构的。


# 展示

这是我的U盘：

```bash
❯ lsblk -o NAME,SIZE,TYPE,MOUNTPOINT,FSTYPE,LABEL /dev/sdb
NAME    SIZE TYPE MOUNTPOINT             FSTYPE LABEL
sdb    15.2G disk
└─sdb1 15.2G part /media/jiesi/nomai_doc vfat   nomai_doc

❯ df -h /media/jiesi/nomai_doc
文件系统        大小  已用  可用 已用% 挂载点
/dev/sdb1        16G  303M   15G    2% /media/jiesi/nomai_doc
```

其根目录的内容如下：

```bash
❯ ls -la /media/jiesi/nomai_doc
总计 60
drwxr-xr-x  5 jiesi jiesi 8192  1月  1  1970 .
drwxr-x---+ 3 root  root  4096  7月  6 16:29 ..
-rw-r--r--  1 jiesi jiesi  203  6月 15 22:50 请阅读.txt
drwxr-xr-x  2 jiesi jiesi 8192  6月 13 13:42 cryptomator
drwxr-xr-x  3 jiesi jiesi 8192  6月 12 23:51 encrypted_data
-rw-r--r--  1 jiesi jiesi  445  6月 15 22:53 readme.md
-rw-r--r--  1 jiesi jiesi  242  6月 15 22:52 README.txt
```

## 基本内容

可以看到，U盘下有一些裸文件，如`TXT`,`markdown`，这些文件可以直接打开。
我放了一些文本文件，当我意外丢失了这个U盘，捡到者查看这些文件便可获取到我的联系方式。
大概内容如下：

```markdown
❯ cat README.txt
# This USB Flash Drive Is Not Discarded. Please Return It to Me.

This USB flash drive is lost. Contact me if you get it unexpectedly.
Significant files are encrypted. No need to try to crack.
Email: mellviese@163.com
Phone: ***
```

并且由于重要文件加密放在仓库里，恶意持有者无法从中获取到任何信息。

## 加密客户端

`cryptomator` 文件夹内放的是多个平台的客户端，目的并不是给捡到者提供访问我加密数据的工具，而是在不同机器上便利我使用。

```bash
/media/jiesi/nomai_doc                                                                                                                                                               17:44:10
❯ ls -lah cryptomator
总计 303M
drwxr-xr-x 2 jiesi jiesi 8.0K  6月 13 13:42 .
drwxr-xr-x 4 jiesi jiesi 8.0K  1月  1  1970 ..
-rw-r--r-- 1 jiesi jiesi  27M  6月 12 23:28 Cryptomator-1.12.3.apk
-rw-r--r-- 1 jiesi jiesi  59M  6月 12 23:43 cryptomator-1.19.2-aarch64.AppImage
-rw-r--r-- 1 jiesi jiesi  59M  6月 13 13:13 Cryptomator-1.19.2-arm64.dmg
-rwxr-xr-x 1 jiesi jiesi  55M  6月 12 23:35 Cryptomator-1.19.2-x64.exe
-rw-r--r-- 1 jiesi jiesi  59M  6月 12 23:47 cryptomator-1.19.2-x86_64.AppImage
-rwxr-xr-x 1 jiesi jiesi  46M  6月 13 13:41 cryptomator-portable-win64-1.15.2-15-setup.exe
```

可以看到，在`Windows`，`Mac OS`, `Linux`, `Android`上皆有相应客户端，虽然不一定用的上，但有备无患。

## 加密仓库

`encrypted_data` 文件夹便是我的加密仓库所在。直接查看的时候显示的如下内容。

```bash
❯ tree encrypted_data -L 3
encrypted_data
└── nomai_secret_data
    ├── 重要.rtf
    ├── d
    │   ├── 2B
    │   ├── 3K
    │   ├── 5M
    │   ├── 6I
    │   ├── BZ
    │   └── ...省略多行
    ├── masterkey.cryptomator
    ├── masterkey.cryptomator.8B90D483.bkup
    ├── vault.cryptomator
    └── vault.cryptomator.E0F34DEC.bkup
```

在这里我们无法获取有用数据。
`重要.rtf`中写的是这个：
```txt
⚠️ 保险库文件 ⚠️
这是您的保险库的存储路径。

请勿
        • 更改此目录内的任何文件或者
        • 将任何文件粘贴到此目录内以进行加密

如果你想要加密文件并查看保险库的内容，请执行以下操作：
        1.    将此保险库添加到Cryptomator；
        2.    在Cryptomator中解锁保险库；
        3.    通过点击“显示”按钮打开访问路径。

如果您需要帮助，请阅读文档：http://docs.cryptomator.org
```

## 解密
解密之后，能够挂载上我真正存放文件明文的仓库。

```bash
~/.local/share/Cryptomator/mnt/nomai_secret_data                                     17:57:49
❯ ls
欢迎.rtf  documents  super_diaries
```

# 制作方法

制作方法十分简单，我们只需要准备一个干净（不干净也行）存储介质。

使用`Cryptomator`创建一个加密仓库，在软件内有详细的引导。
通常是新建->命名->设置一个强密码即可。然后妥善保管密码和恢复密钥。

建立后的仓库可以复制拷贝到别的地方，使用客户端依旧能打开，这使得拷贝非常容易。

使用的时候，我们只需要在客户端内选择加密库的路径，输入密码，即可挂载。日常需要时临时挂载，用完之后便锁定，毫不费力。

---

End


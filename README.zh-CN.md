# Kiwi Apps

[English](README.md)

面向 [Kiwi](https://github.com/MAPS-research/kiwi) 应用的社区目录。应用作者自行维护源代码、托管、版本发布、文档和用户支持。本仓库保存公开的目录元数据，并提供贡献工具。

收录内容来自社区投稿，不代表认证。自动检查只验证元数据结构，不会运行应用，也不会验证其安全性、隐私保护、可用性或兼容性。兼容性描述由应用作者提供。

## 应用目录

| 应用 | 简介 | 分类 | 源代码 | 演示 | 配置指南 |
| --- | --- | --- | --- | --- | --- |
| [Explorable Explanations](catalog/explorable-explanations.yaml) | 通过精选可视化或 AI 生成的页面，提供可交互的概念讲解。 | `simulations` | [源代码](https://github.com/WangZhewei1027/kiwi-app-demo) | [演示](https://kiwi-app-demo.vercel.app/explorable-app/) | [配置指南](https://github.com/WangZhewei1027/kiwi-app-demo/blob/main/explorable-app/README.md) |
| [Kiwi Flashcard](catalog/kiwi-flashcard.yaml) | 创建和学习个人闪卡及教师发布的班级卡组，支持根据 Kiwi 学习上下文和课程材料通过 AI 生成闪卡。 | `exercises` | [源代码](https://github.com/Kenny-Su/kiwi-flashcard) | — | [配置指南](https://github.com/Kenny-Su/kiwi-flashcard#development) |
| [Kiwi Podcast](catalog/kiwi-podcast.yaml) | 根据 Kiwi 课程材料创建和收听班级及个性化播客，支持同步文稿和向 Ask Kiwi 分享上下文。 | utilities | [源代码](https://github.com/ym3116/kiwi-podcast) | [演示](https://podcast.apps.kiwiai.org/) | [配置指南](https://github.com/ym3116/kiwi-podcast#recommended-dev-setup) |

分类：`exercises`（练习）、`simulations`（模拟）、`collaboration`（协作）、`analytics`（分析）和 `utilities`（工具）。

## 查找与使用应用

每条目录记录都提供源代码和配置文档链接，演示链接为可选项。部署前，请阅读应用文档、许可证、数据处理说明和作者声明的兼容性。应用本身的缺陷与功能需求应提交到应用的源代码仓库；目录信息错误请在本仓库反馈。

收录不会安装应用，也不会授予应用在某个 Kiwi 部署中的使用权限。管理员白名单、应用注册和班级启用仍需单独完成，具体参见 [Kiwi 应用开发指南](https://github.com/MAPS-research/kiwi/blob/development/kiwi-app-developer-guide-example/KIWI_APP_DEVELOPER_GUIDE.md)。[Kiwi 应用 SDK](https://github.com/MAPS-research/kiwi/tree/development/kiwi-app-sdk) 提供框架集成工具。

## 添加或维护条目

1. 将[虚构示例](examples/study-coach.yaml)复制到 `catalog/<slug>.yaml`，把所有示例值替换为应用的真实公开信息。也接受 `.yml` 扩展名。
2. 在两份 README 的目录表中各添加一行：应用名称链接到目录 YAML 文件，源代码链接到应用仓库，演示链接到演示页面（没有则填 `—`），配置指南链接到应用文档。两种语言中的分类标识符保持一致。
3. 运行下方检查并提交拉取请求。字段说明以及更正、移除和维护权转移规则见 [CONTRIBUTING.md](CONTRIBUTING.md)。

每个应用对应一个 YAML 文件。YAML 是目录信息的权威来源；贡献者需在同一个拉取请求中同步维护 README 表格。目前不提供索引生成器、网页前端、自动同步或运行时安装器。作者可以为应用仓库添加 `kiwi-app` 主题标签，方便他人发现。

[目录 Schema](schemas/catalog.schema.json)仅定义目录元数据，既不是 Kiwi 的注册请求格式，也不是统一的应用清单格式。可选字段 `manifestPath` 指向作者源代码仓库中已有的元数据文件，不要求采用新的清单格式或 SDK 功能。

## 本地检查

推荐使用 Node.js 24；支持 Node.js 20.14 及以上版本。

```sh
npm ci --ignore-scripts
npm run validate
npm test
```

`npm run validate` 检查正式目录和虚构示例，`npm test` 检查验证器行为。`npm run check` 依次运行两者，CI 也使用此命令。检查只读取目录数据，不会下载或执行投稿的应用。

## 社区与许可证

请遵守[行为准则](CODE_OF_CONDUCT.md)。本仓库自身的内容采用 [MIT 许可证](LICENSE)；各应用保留其自身许可证。收录不会改变应用的许可方式。

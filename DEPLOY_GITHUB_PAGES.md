# GitHub Pages 发布说明

本项目已配置 GitHub Actions 自动发布到 GitHub Pages。

## 1. 建议仓库名

```text
fanxi-lowcarbon-prototype
```

对应 Pages 地址通常为：

```text
https://你的GitHub用户名.github.io/fanxi-lowcarbon-prototype/
```

项目在 GitHub Pages 模式下会自动使用：

```text
/fanxi-lowcarbon-prototype/
```

作为 Vite 静态资源 base，并使用 hash 路由，例如：

```text
https://你的GitHub用户名.github.io/fanxi-lowcarbon-prototype/#/dashboard
```

## 2. GitHub 仓库设置

仓库推送后，进入：

```text
Settings -> Pages
```

将 Source 设置为：

```text
GitHub Actions
```

之后每次推送 `main` 分支，GitHub 会自动执行：

```bash
npm ci
npm run build -- --mode github-pages
```

并把 `dist` 发布到 GitHub Pages。

## 3. 本地验证

常规开发：

```bash
npm install
npm run dev
```

GitHub Pages 模式构建：

```bash
npm run build -- --mode github-pages
```

测试：

```bash
npm test
```

## 4. 当前机器上传方式

这台机器暂未检测到 GitHub CLI `gh`。要让我继续自动创建仓库并推送，有两种方式：

1. 安装并登录 GitHub CLI：

```bash
gh auth login
```

2. 或者你在 GitHub 网页上新建空仓库，然后把仓库地址发过来，例如：

```text
https://github.com/你的用户名/fanxi-lowcarbon-prototype.git
```

拿到仓库地址后，可以执行：

```bash
git init
git branch -M main
git add .
git commit -m "Initial GitHub Pages prototype"
git remote add origin https://github.com/你的用户名/fanxi-lowcarbon-prototype.git
git push -u origin main
```

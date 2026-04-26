# TE Vlog Player

一个面向英语 vlog 精听的前端练习平台原型，支持：

- 视频链接或本地视频载入
- 自动分段练习
- 单句模式 / 连续模式
- A-B 点循环
- 收藏难句
- 练习流程和本轮总结

## 本地打开

直接打开 `index.html` 即可。

## 部署到 GitHub Pages

这个项目已经包含 GitHub Pages 工作流。

### 1. 推送到 GitHub 仓库

把当前目录推送到你的 GitHub 仓库，例如：

```bash
git add .
git commit -m "Prepare GitHub Pages deployment"
git branch -M main
git remote add origin <你的仓库地址>
git push -u origin main
```

### 2. 在 GitHub 打开 Pages

仓库上传后：

1. 打开 GitHub 仓库
2. 进入 `Settings`
3. 进入 `Pages`
4. 在 `Build and deployment` 里选择 `Source: GitHub Actions`

### 3. 等待自动发布

仓库里已经有 `.github/workflows/deploy-pages.yml`。

推送后 GitHub 会自动发布，完成后地址通常是：

`https://<你的用户名>.github.io/<你的仓库名>/`

## 自定义域名

如果你后面想做成更正式的平台，可以在 GitHub Pages 里继续绑定你自己的域名。

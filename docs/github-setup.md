# EventPay Manager - GitHub環境構築ガイド

## GitHub CLI (gh) セットアップ

### インストール
```bash
# macOS (Homebrew)
brew install gh

# Ubuntu/Debian
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update
sudo apt install gh

# Windows (Scoop)
scoop install gh
```

### 認証設定
```bash
# GitHub認証
gh auth login

# 設定確認
gh auth status

# トークン確認
gh auth refresh
```

## 設定関連

### 基本設定
```bash
# 現在の設定確認
gh config list

# エディタ設定
gh config set editor vim

# デフォルトブラウザ設定
gh config set browser firefox

# プロトコル設定（SSH/HTTPS）
gh config set git_protocol ssh
```

## トラブルシューティング

### よくある問題と解決方法

#### 1. 認証エラー
```bash
# 認証状態確認
gh auth status

# 再認証
gh auth login --with-token < mytoken.txt
gh auth refresh
```

#### 2. PR作成時のエラー
```bash
# リモートブランチが存在しない場合
git push -u origin feature-branch

# upstream設定が必要な場合
git remote add upstream https://github.com/original-owner/repo.git
```

#### 3. 権限エラー
```bash
# トークンのスコープ確認
gh auth status

# 必要に応じて権限を再設定
gh auth login --scopes repo,read:org
```

## 関連ドキュメント
- **[GitHubワークフロー](github-workflow.md)**: Issue、PR、マージの基本フロー
- **[Claude Code自動ワークフロー](claude-code-workflow.md)**: AI開発自動化手順
- **[開発ルール](development-rules.md)**: コーディング規約、命名規則

## 参考リンク
- [GitHub CLI 公式ドキュメント](https://cli.github.com/manual/)
- [GitHub CLI チートシート](https://github.com/github/gh-cli-cheatsheet)
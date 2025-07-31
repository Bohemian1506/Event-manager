# EventPay Manager - トラブルシューティングガイド

## 🚨 自動PR作成に関する問題

### ❌ GitHub Actions権限エラー
**エラーメッセージ**: `GitHub Actions is not permitted to create or approve pull requests (createPullRequest)`

**原因**: GitHubリポジトリの設定で、GitHub Actionsにプルリクエスト作成権限が付与されていない

**解決手順**:
1. GitHubリポジトリページに移動
2. **Settings** タブをクリック
3. 左サイドバーから **Actions** → **General** を選択
4. **Workflow permissions** セクションで以下を設定:
   - ✅ **"Read and write permissions"** を選択
   - ✅ **"Allow GitHub Actions to create and approve pull requests"** をチェック
5. **Save** をクリック

### ❌ PR自動作成が実行されない
**症状**: プッシュしてもGitHub Actionsワークフローが実行されない

**確認手順**:
```bash
# 1. ワークフローファイルの存在確認
ls -la .github/workflows/auto-pr.yml

# 2. ブランチ名の確認（mainブランチ以外である必要）
git branch

# 3. コミットメッセージに[skip-pr]が含まれていないか確認
git log -1 --pretty=%B

# 4. 最近のワークフロー実行状況確認
gh run list --limit 5
```

**解決方法**:
- ワークフローファイルが存在しない場合: 自動化ブランチからコピー
- mainブランチにいる場合: 新しいfeatureブランチを作成
- [skip-pr]が含まれている場合: 新しいコミットを作成

### ❌ PRが重複作成される
**症状**: 同じブランチで複数のPRが作成される

**原因**: PR存在チェックロジックの問題

**確認方法**:
```bash
# 既存PR確認
gh pr list --head feature/your-branch-name
```

**解決方法**: 既存のPRを閉じてから新しいプッシュを実行

## 🔧 品質チェック関連の問題

### ❌ pre-pushフックでプッシュが阻止される
**エラーパターン**:

#### RuboCop エラー
```bash
❌ RuboCop checks failed
```
**解決方法**:
```bash
# エラー確認
docker-compose exec web bundle exec rubocop

# 自動修正
docker-compose exec web bundle exec rubocop -a

# 手動修正後再プッシュ
git add .
git commit -m "style: RuboCop違反を修正"
git push
```

#### RSpec テストエラー
```bash
❌ Tests failed
```
**解決方法**:
```bash
# 詳細確認
docker-compose exec web bundle exec rspec

# 特定テスト実行
docker-compose exec web bundle exec rspec spec/models/user_spec.rb

# テスト修正後再プッシュ
git add .
git commit -m "test: テストエラーを修正"
git push
```

#### Brakeman セキュリティエラー
```bash
⚠️ Security issues detected
```
**解決方法**:
```bash
# セキュリティ問題確認
docker-compose exec web bundle exec brakeman --no-pager

# 緊急時回避（推奨しない）
git commit -m "fix: セキュリティ問題対応 [skip-security]"
```

### ❌ Dockerコンテナが起動しない
**解決方法**:
```bash
# コンテナ状況確認
docker-compose ps

# コンテナ再起動
docker-compose down
docker-compose up -d

# ログ確認
docker-compose logs web
```

## 📁 ファイル・権限関連の問題

### ❌ Git フックが動作しない
**症状**: pre-push, post-commitフックが実行されない

**解決方法**:
```bash
# フック権限確認
ls -la .git/hooks/pre-push
ls -la .git/hooks/post-commit

# 権限付与
chmod +x .git/hooks/pre-push
chmod +x .git/hooks/post-commit

# または一括修正
npm run hooks:install
```

### ❌ スクリプトファイルが見つからない
**エラー**: `scripts/create-branch.js not found`

**解決方法**:
```bash
# スクリプトディレクトリ確認
ls -la scripts/

# 権限確認
ls -la scripts/*.js

# 権限付与
chmod +x scripts/*.js
```

## 🔍 診断コマンド

### 自動化システム全体チェック
```bash
# 1. 必要ファイル存在確認
echo "=== ワークフローファイル ==="
ls -la .github/workflows/

echo "=== Gitフック ==="
ls -la .git/hooks/pre-push .git/hooks/post-commit

echo "=== スクリプト ==="
ls -la scripts/

echo "=== Claude設定 ==="
ls -la .claude/

# 2. 権限確認
echo "=== 権限確認 ==="
ls -la .git/hooks/pre-push .git/hooks/post-commit scripts/*.js

# 3. 最近のワークフロー実行状況
echo "=== 最近のワークフロー ==="
gh run list --limit 10

# 4. 開いているPR確認
echo "=== 開いているPR ==="
gh pr list
```

### 環境情報確認
```bash
# Git情報
git --version
git config --get remote.origin.url

# GitHub CLI
gh --version
gh auth status

# Docker情報
docker --version
docker-compose --version
docker-compose ps

# Node.js情報
node --version
npm --version
```

## 🆘 緊急時対応

### 完全リセット手順
```bash
# 1. 現在の作業を安全にコミット
git add .
git commit -m "wip: 作業途中をセーブ"

# 2. メインブランチに移動
git checkout main
git pull origin main

# 3. 問題のあるブランチを削除
git branch -D feature/problem-branch
git push origin --delete feature/problem-branch

# 4. 新しいブランチで再開
git checkout -b feature/new-branch

# 5. 必要に応じて自動化ファイルを再設定
npm run hooks:install
```

### サポート情報
- **GitHub Issues**: プロジェクトの Issues タブでバグ報告
- **ワークフロー履歴**: Actions タブで詳細なログ確認
- **ローカルテスト**: `npm run quality:check` で事前確認

## ✅ 予防策

### 開発開始前チェックリスト
- [ ] GitHubリポジトリ設定が正しく設定されている
- [ ] `.github/workflows/auto-pr.yml` が存在する
- [ ] Git フックが実行可能権限を持っている
- [ ] Docker環境が正常に動作している
- [ ] GitHub CLI認証が有効である

### プッシュ前チェックリスト
- [ ] ローカルで品質チェックを実行済み
- [ ] コミットメッセージが規約に従っている
- [ ] セキュリティ問題がないことを確認済み
- [ ] テストが通ることを確認済み

この手順に従うことで、ほとんどの問題は解決できます。解決しない場合は、GitHub Issuesで詳細な情報と共に報告してください。
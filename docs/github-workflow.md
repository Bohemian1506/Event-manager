# EventPay Manager - GitHub ワークフロー

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

## 開発の基本原則

**🚨 重要: すべての作業は必ず別ブランチで行う**
- **作業開始前に必ずmainブランチを最新状態にする**
- **mainブランチで直接作業することは禁止**
- **指示されていなくても、新しい作業開始時は必ずブランチを作成**
- **Claude Codeも含め、すべての開発者がこのルールに従う**
- 例外は一切認めない（緊急時も含む）

## 開発ワークフロー

### 0. ブランチ作成（すべての作業の開始）
```bash
# 1. まずmainブランチに移動
git checkout main

# 2. 最新の変更を取得（重要！）
git pull origin main

# 3. 現在のブランチ確認（mainであることを確認）
git branch

# 4. 新しいブランチ作成
git checkout -b feature/your-feature-name

# 5. ブランチが正しく作成されたことを確認
git branch
```

### 1. Issue作成（機能開発開始時）
```bash
# Issue作成
gh issue create --title "参加者登録機能の実装" --body "参加者が共有URLから登録できる機能を実装する"

# Issue一覧確認
gh issue list

# 特定Issue確認
gh issue view 123
```

### 2. ブランチ作成・開発
```bash
# 新しいブランチ作成（ローカル）
git checkout -b feature/participant-registration

# 開発作業
# ... コード実装 ...

# コミット
git add .
git commit -m "feat: 参加者登録機能を追加"

# リモートにプッシュ
git push -u origin feature/participant-registration
```

### 3. プルリクエスト作成
```bash
# PR作成（基本）
gh pr create --title "参加者登録機能を追加" --body "参加者が共有URLから登録できる機能を実装しました。"

# PR作成（テンプレート使用）
gh pr create --template

# PR作成（レビュワー指定）
gh pr create --reviewer @username --assignee @username

# PR作成（ドラフト）
gh pr create --draft

# PR作成（Issue紐付け）
gh pr create --title "参加者登録機能を追加" --body "Closes #123"
```

### 4. プルリクエスト管理
```bash
# PR一覧確認
gh pr list

# 自分のPR確認
gh pr list --author @me

# PR詳細確認
gh pr view 456

# PRをブラウザで開く
gh pr view 456 --web

# PRをローカルでチェックアウト
gh pr checkout 456

# PR状態確認
gh pr status
```

### 5. レビュー・マージ
```bash
# レビュー依頼
gh pr review 456 --request-changes --body "コメント修正をお願いします"
gh pr review 456 --approve --body "LGTM!"

# PR更新（追加コミット後）
git push

# PRマージ
gh pr merge 456 --merge
gh pr merge 456 --squash
gh pr merge 456 --rebase

# PRクローズ
gh pr close 456
```

## プロジェクト固有の運用ルール

### ブランチ命名規則
```bash
# 機能開発
feature/feature-name
feature/participant-registration
feature/payment-management

# バグ修正
fix/bug-description
fix/email-validation-error
fix/database-connection-issue

# ホットフィックス
hotfix/critical-bug-description

# リファクタリング
refactor/code-improvement-description
```

### コミットメッセージ規約
```bash
# 形式: <type>: <description>

# 機能追加
feat: 参加者登録機能を追加
feat: QRコード生成機能を実装

# バグ修正
fix: メール送信時のエラーを修正
fix: 支払い状況更新のバグを解決

# リファクタリング
refactor: コントローラーの重複コードを整理
refactor: ViewComponentの構造を改善

# スタイル修正
style: RuboCopの警告を修正
style: CSSの命名規則を統一

# テスト
test: 参加者登録のテストを追加
test: 統合テストのカバレッジを向上

# ドキュメント
docs: READMEを更新
docs: APIドキュメントを追加

# その他
chore: gemを更新
chore: 開発環境の設定を変更
```

### PRテンプレート
PRを作成する際は以下の形式を使用：

```markdown
## 概要
この変更の概要を記述

## 変更内容
- [ ] 機能A
- [ ] 機能B
- [ ] テストケース追加

## テスト
- [ ] 単体テスト実行
- [ ] 統合テスト実行  
- [ ] 手動テスト完了

## チェックリスト
- [ ] RuboCop警告なし
- [ ] テストが通る
- [ ] 機能が正常に動作する
- [ ] ドキュメントを更新（必要に応じて）

## 関連Issue
Closes #123
```

### レビュープロセス
1. **PR作成者**
   - 完全な機能実装後にPR作成
   - セルフレビューを実施
   - テスト実行・動作確認完了

2. **レビュワー**
   - コード品質の確認
   - 機能要件の確認
   - テストの妥当性確認
   - 必要に応じて修正依頼

3. **マージ条件**
   - 最低1名の承認
   - 全テストパス
   - 機能の動作確認完了

## よく使用するghコマンド集

### Issue関連
```bash
# Issue作成
gh issue create --title "タイトル" --body "説明"

# Issue一覧（オープン）
gh issue list

# Issue一覧（クローズ済み）
gh issue list --state closed

# Issue確認
gh issue view 123

# Issueクローズ
gh issue close 123

# Issue再オープン
gh issue reopen 123
```

### PR関連
```bash
# PR作成（インタラクティブ）
gh pr create

# PR作成（コマンドライン）
gh pr create --title "タイトル" --body "説明"

# 自分のPR一覧
gh pr list --author @me

# PR詳細をJSON形式で表示
gh pr view 456 --json

# PRのファイル変更確認
gh pr diff 456

# PRのチェック状況確認
gh pr checks 456
```

### リポジトリ関連
```bash
# リポジトリ情報確認
gh repo view

# リポジトリをブラウザで開く
gh repo view --web

# リポジトリクローン
gh repo clone owner/repo

# Fork作成
gh repo fork

# リリース一覧
gh release list

# リリース作成
gh release create v1.0.0
```

### 設定関連
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

## Claude Code作業時の特別ルール

### 自動ブランチ作成
- **新しい機能実装やバグ修正を依頼された場合、Claude Codeは自動的に適切なブランチを作成する**
- **ブランチ名は作業内容に応じて自動で命名する**
- **作業完了後は必ずコミット・プッシュ・PR作成まで実行する**

### Claude Codeへの指示例
```
❌ 悪い例: "ユーザー認証機能を実装してください"
✅ 良い例: "feature/user-authenticationブランチを作成して、ユーザー認証機能を実装し、PR作成までお願いします"

ただし、Claude Codeは指示されていなくても自動的にブランチを作成するため、
シンプルに "ユーザー認証機能を実装してください" でも適切に処理される
```

### 作業フロー（Claude Code）
1. **mainブランチ最新化**: git pull origin main で最新状態を確保
2. **自動ブランチ作成**: 作業内容に基づいて適切な名前のブランチを作成
3. **機能実装**: 必要なファイルの作成・編集
4. **テスト作成**: 実装した機能のテスト追加
5. **コミット作成**: 適切なコミットメッセージでコミット
6. **プッシュ実行**: リモートブランチにプッシュ
7. **PR作成**: 適切なタイトル・説明でプルリクエスト作成
8. **作業サマリー作成**: 作業完了時に自動でサマリーファイルを生成

## 参考リンク
- [GitHub CLI 公式ドキュメント](https://cli.github.com/manual/)
- [GitHub CLI チートシート](https://github.com/github/gh-cli-cheatsheet)
- [Git ブランチ戦略](https://nvie.com/posts/a-successful-git-branching-model/)
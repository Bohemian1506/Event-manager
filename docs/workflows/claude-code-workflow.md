# EventPay Manager - Claude Code自動ワークフロー

## 🚨 作業開始時の自動実行手順（必須）

### 🎯 NEW! 完全自動化ワークフロー
**最推奨**: `npm run work:start` でワンコマンド作業開始⭐
- ✅ Git状態の安全性チェック
- ✅ mainブランチ自動最新化  
- ✅ 対話式ブランチ作成
- ✅ 初期コミット・プッシュ
- ✅ 次のステップ案内

### 自動化システムの概要
EventPay Managerでは以下の自動化が設定されています：

1. **作業開始の完全自動化** - work-start.js で実行（NEW!）
2. **プッシュ時の自動PR作成** - GitHubワークフローで実行
3. **品質チェック** - Git pre-pushフックで実行  
4. **zen-mcp-server自動提案** - post-commitフックで実行
5. **開発支援スクリプト** - package.jsonで定義

## 🔄 自動化の仕組み

### A. 作業開始の完全自動化（NEW! 🎯）
```bash
# 方法1: 完全自動化ワークフロー（最推奨 ⭐）
npm run work:start
# → 安全性チェック + main最新化 + ブランチ作成 + 初期設定

# 方法2: Git状態確認のみ
npm run work:check

# 方法3: 従来のブランチ作成（改良版）
npm run dev:branch

# 方法4: GitHub Actions経由
# リポジトリのActionsタブから「Auto Branch Management」を実行

# 方法5: 手動（従来通り）
git checkout main
git pull origin main
git checkout -b feature/task-name
```

### B. コミット・プッシュの自動化
```bash
# 方法1: 自動コミットスクリプト（推奨）
npm run dev:commit

# 方法2: 手動コミット + 自動プッシュタグ
git add .
git commit -m "feat: 実装内容 [auto-push]"
# → post-commitフックが自動プッシュを実行

# 方法3: 完全手動
git add .
git commit -m "feat: 実装内容"
git push -u origin branch-name
```

### C. プルリクエストの自動作成
```bash
# 自動実行される条件:
# 1. mainブランチ以外にプッシュした時
# 2. コミットメッセージに[skip-pr]が含まれていない時

# 手動でPR作成する場合:
npm run dev:pr
```

## 📋 実際の作業フロー

### 1. 新機能開発フロー（完全自動化 - NEW! 🎯）
```bash
# 1. 作業開始（完全自動化）⭐
npm run work:start
# → 安全性チェック実行
# → mainブランチ自動最新化
# → 対話式ブランチ作成
# → 初期コミット・プッシュ
# → 次のステップ案内

# 2. 実装作業
# ファイル編集・コード実装

# 3. コミット（対話形式）
npm run dev:commit
# → 自動ステージング・コミット・プッシュ
# → GitHubでPR自動作成

# 4. zen-mcp-server提案（自動表示）
# 「新機能実装では複数AIによる設計検討が効果的です。
#  /consensusで設計合意を形成しませんか？」
```

### 1-1. 従来フロー（改良版）
```bash
# 1. ブランチ作成（安全性チェック付き）
npm run dev:branch
# → 安全性チェック + ブランチ作成・プッシュ

# 2-4. 以下は同じ
```

### 2. バグ修正フロー（半自動化）
```bash
# 1. 緊急ブランチ作成
npm run work:start  # または npm run dev:branch

# 2. 修正作業
# バグ修正コード

# 3. 自動コミット
npm run dev:commit
# → タイプ選択: fix → メッセージ入力

# 4. 自動品質チェック（pre-pushフック）
# → RuboCop, RSpec, Brakeman実行
# → 問題があれば自動的にプッシュ阻止

# 5. zen-mcp-server提案（自動表示）  
# 「複雑な問題の根本原因分析が必要です。
#  /debugで詳細分析を実行しませんか？」
```

### 3. 品質チェック統合フロー
```bash
# コミット前のローカルチェック
npm run quality:check
npm run security:scan

# プッシュ時の自動チェック（pre-pushフック）
git push
# → 自動実行: RuboCop + RSpec + Brakeman
# → 失敗時はプッシュ阻止

# zen-mcp-server統合チェック
# 「コミット前の品質チェックを実行します。
#  /precommitで包括的なチェックを行いませんか？」
```

## ⚙️ 設定ファイル説明

### `.github/workflows/auto-pr.yml`
- プッシュ時に自動でドラフトPRを作成
- ブランチ名からPRタイトルを自動生成
- 既存PR確認機能付き

### `.github/workflows/auto-branch.yml` 
- 手動トリガーでブランチ作成
- Actionsタブから実行可能

### `.git/hooks/pre-push`
- メインブランチ直接プッシュ防止
- RuboCop, RSpec, Brakemanの自動実行
- 品質チェック失敗時のプッシュ阻止

### `.git/hooks/post-commit`
- [auto-push]タグでの自動プッシュ
- zen-mcp-server自動提案表示

### `.claude/settings.json`
- Claude Code統合設定
- 自動化機能のON/OFF制御

### `.claude/hooks.json`
- ファイル変更時の自動提案ルール
- セキュリティコード検知時の自動提案

## 🛠️ 利用可能なコマンド

### 作業開始コマンド（NEW! 🎯）
```bash
npm run work:start      # 完全自動化ワークフロー（最推奨⭐）
npm run work:check      # Git状態確認のみ
```

### 開発支援コマンド
```bash
npm run dev:branch      # 対話式ブランチ作成（改良版）
npm run dev:commit      # 対話式コミット
npm run dev:push        # 安全なプッシュ
npm run dev:pr          # 手動PR作成
npm run dev:setup       # ブランチ作成→コミット
```

### Git管理コマンド
```bash
npm run git:update      # main最新化
npm run git:clean       # マージ済みブランチ削除
npm run hooks:install   # フック再インストール
```

### 品質チェックコマンド
```bash
npm run quality:check   # RuboCop + RSpec
npm run security:scan   # Brakeman実行
```

## 🤖 zen-mcp-server自動提案

### 自動提案される条件

#### 必須提案（強制表示）
- **新機能実装**: `feat:`または`新機能`でコミット → `/consensus`提案
- **バグ修正**: `fix:`または`バグ`でコミット → `/debug`提案
- **セキュリティコード**: 認証・決済関連ファイル変更 → `/secaudit`提案
- **コミット前**: プッシュ時 → `/precommit`提案

#### 推奨提案（選択可能）
- **実装完了**: 複数ファイル変更後 → `/codereview`提案
- **アーキテクチャ変更**: 設定ファイル変更 → `/analyze`提案
- **リファクタリング**: `refactor:`でコミット → `/refactor`提案
- **テスト作成**: テストファイル作成 → `/testgen`提案

### 提案の応答方法
```bash
# 提案を受け入れる場合
y

# 提案を拒否する場合  
n

# 後で実行する場合
later
```

## 🔧 トラブルシューティング

### よくある問題と解決方法

#### 1. プッシュが阻止される
```bash
❌ RuboCop checks failed
→ npm run quality:check で修正してから再プッシュ

❌ Tests failed  
→ docker-compose exec web bundle exec rspec で詳細確認

❌ Security issues detected
→ [skip-security]タグをコミットメッセージに追加で回避可能
```

#### 2. PR自動作成が動作しない
```bash
# 原因確認
git log -1 --pretty=%B  # [skip-pr]タグがないか確認
git branch -r           # リモートブランチ存在確認

# 手動PR作成
npm run dev:pr
```

#### 3. フックが動作しない
```bash
# フック権限確認・修正
npm run hooks:install

# フック有効化確認
ls -la .git/hooks/pre-push
ls -la .git/hooks/post-commit
```

#### 4. zen-mcp-server提案が表示されない
```bash
# 設定確認
cat .claude/hooks.json

# 手動でzen-mcp-server実行
/consensus "提案内容を直接入力"
```

## 📚 関連ドキュメント

- **[GitHub環境構築](github-setup.md)**: GitHub CLI認証設定
- **[GitHubワークフロー](github-workflow.md)**: Issue・PR作成手順
- **[開発ルール](../setup/development-rules.md)**: コーディング規約
- **[AI開発ルール](../ai-development/ai-development-rules.md)**: zen-mcp-server運用
- **[セットアップガイド](../setup/setup.md)**: 環境構築手順

## 🎯 ベストプラクティス

### 推奨フロー（NEW! 🎯）
1. **作業開始**: `npm run work:start`で完全自動化ワークフロー実行⭐
2. **実装作業**: コード作成・編集
3. **コミット**: `npm run dev:commit`で対話式コミット
4. **品質確認**: 自動フックで品質チェック実行
5. **AI協調**: zen-mcp-server提案に従って複数AI活用
6. **PR確認**: 自動作成されたPRをレビュー・マージ

### 従来フロー（改良版）
1. **作業開始**: `npm run dev:branch`でブランチ作成（安全性チェック付き）
2-6. **以下同じ**

### 注意事項
- メインブランチへの直接作業は自動的に防止されます
- 品質チェック失敗時は自動的にプッシュが阻止されます
- セキュリティ関連コードは必ずzen-mcp-serverでの監査を実行してください
- 大きな実装完了時は複数AIでのコードレビューを推奨します

この自動化システムにより、手動での作業ミスが減り、高品質なコード開発が実現されます。
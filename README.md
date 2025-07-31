# EventPay Manager

## 🎉 概要
飲み会の幹事負担を軽減する、参加者登録不要の出欠・精算管理アプリ

## ✨ 主な特徴
- **参加者登録不要**: トークンベース認証で簡単参加
- **複数回対応**: 1次会、2次会など複数ラウンドの管理
- **リアルタイム更新**: 参加状況・支払い状況をリアルタイム表示
- **幹事支援**: 未払い者への自動リマインダー機能
- **QRコード対応**: 参加用URLのQRコード生成

## 🚀 クイックスタート

### 🆕 新規参加者向け最短セットアップ
```bash
# 1. リポジトリクローンと環境構築
git clone <repository-url>
cd eventpay_manager
docker-compose up -d

# 2. データベースセットアップ
docker-compose exec web rails db:create
docker-compose exec web rails db:migrate

# 3. 動作確認
open http://localhost:3000

# 4. 開発環境準備
npm install                    # Node.js依存関係インストール
npm run hooks:install          # Gitフック設定
gh auth login                  # GitHub CLI認証（初回のみ）

# 5. すぐに開発開始可能！
npm run git:update
npm run dev:branch
# → ここからコーディング開始
```

### 📋 前提条件
- **必須**: Docker & Docker Compose
- **推奨**: Node.js 18+, GitHub CLI
- **オプション**: zen-mcp-server（AI協調開発を活用する場合）

## 🛠️ 開発

### 実践的な開発フロー

#### 典型的な1日の開発フロー
```bash
# 1. 作業開始準備
npm run git:update          # main最新化
npm run dev:branch          # 新ブランチ作成（対話式）
docker-compose up -d        # 開発環境起動

# 2. 実装作業
# ファイル編集・コード作成...
docker-compose logs -f web  # ログ監視（必要に応じて）

# 3. 中間チェック
npm run quality:check       # 品質チェック実行
npm run security:scan       # セキュリティスキャン

# 4. 作業完了・自動化
npm run dev:commit          # 自動ステージング・コミット・プッシュ・PR作成

# 5. 後片付け（マージ後）
npm run git:clean           # マージ済みブランチ削除
```

#### 自動化システムの特徴
- **自動PR作成**: プッシュ時にGitHub Actionsが自動でPR作成
- **品質チェック自動実行**: RuboCop + RSpec + Brakeman
- **対話式ブランチ作成**: 適切な命名規則でブランチ自動生成
- **pre-pushフック**: コミット前に自動品質チェック実行

### 開発支援コマンド

#### 🚀 作業開始前コマンド
```bash
# main最新化（必須）
npm run git:update

# 現在状況確認
git status
git branch

# 対話式ブランチ作成
npm run dev:branch

# Docker環境起動
docker-compose up -d
```

#### 💻 作業中コマンド
```bash
# リアルタイムログ監視
docker-compose logs -f web

# 品質チェック（コミット前推奨）
npm run quality:check   # RuboCop + RSpec

# セキュリティスキャン
npm run security:scan   # Brakeman

# 手動テスト実行
docker-compose exec web bundle exec rspec
docker-compose exec web bundle exec rubocop

# Rails console起動
docker-compose exec web rails console
```

#### ✅ 作業完了コマンド
```bash
# 自動コミット・プッシュ・PR作成（推奨）
npm run dev:commit

# または手動でのステップ実行
git add .
git commit -m "feat: 実装内容の説明"
git push

# PR状況確認
gh pr list
gh pr view [PR番号]

# マージ後のブランチクリーンアップ
npm run git:clean
```

#### 🔧 メンテナンスコマンド
```bash
# Git フック再インストール
npm run hooks:install

# Docker環境リセット
docker-compose down && docker-compose up -d

# データベースリセット（危険）
docker-compose exec web rails db:drop db:create db:migrate
```

## 🤖 AI協調開発

### zen-mcp-server活用例

EventPay Managerでは複数AI協調開発を積極的に活用：

#### 自動提案されるケース
```bash
# 新機能実装時
"複数AI協調開発の提案: 新機能実装では設計検討が効果的です。/consensusで設計合意を形成しませんか？"

# コミット前
"コミット前の品質チェックを実行します。/precommitで包括的なチェックを行いませんか？"

# セキュリティ関連コード
"セキュリティに関わるコードです。/secauditでセキュリティ監査を実行しませんか？"

# 複雑なバグ・エラー
"複雑な問題の根本原因分析が必要です。/debugで詳細分析を実行しませんか？"
```

#### 利用可能なツール
- **新機能設計**: `/consensus` - 複数AIでの設計合意形成
- **バグ修正**: `/debug` - 根本原因の詳細分析
- **セキュリティ**: `/secaudit` - 包括的セキュリティ監査
- **品質チェック**: `/precommit` - コミット前総合チェック
- **コードレビュー**: `/codereview` - 詳細なコード分析
- **リファクタリング**: `/refactor` - 改善提案と実装

詳細は [AI開発ルール](docs/ai-development/ai-development-rules.md) を参照

## 🏗️ アーキテクチャ

### 技術スタック
- **Backend**: Ruby 3.3.6 + Rails 8.0.2
- **Database**: PostgreSQL 15
- **Frontend**: Bootstrap 5.3 + Stimulus + jQuery
- **CSS**: Sass + CSS Bundling
- **Components**: ViewComponent
- **Email**: SendGrid
- **Queue**: Solid Queue (Rails 8標準)
- **Cache**: Solid Cache (Rails 8標準)
- **Deployment**: Kamal + Thruster
- **Asset Pipeline**: Propshaft + Importmap

### 認証システム
- **幹事**: Rails 8標準認証（メール+パスワード）
- **参加者**: トークンベース認証（登録不要、7日間有効）

### データベース構造
```
users (幹事)
├── events (イベント)
│   ├── rounds (各回: 1次会、2次会等)
│   └── participants (参加者)
│       └── participations (参加状況)
```

## 📂 プロジェクト構造
```
eventpay_manager/
├── app/
│   ├── controllers/           # コントローラー
│   ├── models/               # モデル
│   ├── views/                # ビュー
│   ├── components/           # ViewComponent
│   └── assets/               # アセット
├── config/                   # 設定ファイル
├── db/                      # データベース
├── docs/                    # ドキュメント
│   ├── setup/               # セットアップガイド
│   ├── workflows/           # ワークフロー
│   ├── ai-development/      # AI開発ルール
│   └── specifications/      # 仕様書
├── .github/workflows/       # GitHub Actions
├── .claude/                 # Claude Code設定
├── scripts/                 # 開発支援スクリプト
└── spec/                   # テスト
```

## 🔧 設定

### 環境変数
```bash
# .env.local
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxx
APP_DOMAIN=eventpay.example.com
DATABASE_URL=postgresql://user:pass@localhost/eventpay_manager_development
```

### GitHub環境設定
1. [GitHub CLI設定](docs/workflows/github-setup.md)
2. [GitHub Actions設定](docs/workflows/github-workflow.md)
3. [Claude Code統合](docs/workflows/claude-code-workflow.md)

## 🧪 テスト

```bash
# 全テスト実行
docker-compose exec web bundle exec rspec

# システムテスト実行
docker-compose exec web bundle exec rspec spec/system

# 特定テスト実行
docker-compose exec web bundle exec rspec spec/models/user_spec.rb
```

## 🛡️ セキュリティ

```bash
# セキュリティスキャン
docker-compose exec web bundle exec brakeman

# 依存関係チェック  
docker-compose exec web bundle audit

# JavaScript依存関係チェック
bin/importmap audit
```

## 📋 主要機能

### 1. イベント管理
- 複数回（1次会、2次会等）の一括管理
- イベント詳細・日時・場所の設定
- 参加者共有URL・QRコード生成

### 2. 参加者管理  
- 登録不要のトークンベース参加
- リアルタイム参加状況更新
- 各回ごとの参加・不参加選択

### 3. 支払い管理
- 各回ごとの料金設定・支払い管理
- 支払い状況のリアルタイム表示
- 未払い者の自動抽出

### 4. 通知機能
- 未払い者への自動リマインダー
- イベント更新通知
- 参加者への各種通知

## 🗺️ ドキュメント

### 🛠️ セットアップ・開発
- [開発ルール](docs/setup/development-rules.md) - コーディング規約・ファイル構成
- [セットアップガイド](docs/setup/setup.md) - 環境構築・日常コマンド

### 🔄 ワークフロー
- [GitHub環境構築](docs/workflows/github-setup.md) - GitHub CLI設定・認証
- [GitHubワークフロー](docs/workflows/github-workflow.md) - Issue・PR・マージ管理
- [Claude Code自動ワークフロー](docs/workflows/claude-code-workflow.md) - 自動化手順・PRサマリー
- [トラブルシューティング](docs/workflows/troubleshooting.md) - よくある問題と解決法
- [Issueテンプレート](docs/workflows/issue-templates.md) - GitHub Issue作成ガイド

### 🤖 AI開発
- [AI開発ルール](docs/ai-development/ai-development-rules.md) - 複数AI協調開発ガイド
- [zen-mcp-setup](docs/ai-development/zen-mcp-setup.md) - zen-mcp-serverセットアップ
- [zen-mcp-workflow](docs/ai-development/zen-mcp-workflow.md) - 実践的使用例・ベストプラクティス

### 📊 仕様・設計
- [画面遷移図](docs/specifications/screen-flow.md) - 全画面遷移とユーザーフロー

## 🤝 コントリビューション

1. **Issue作成**: [GitHub Issues](../../issues) でバグ報告・機能要望
2. **開発参加**: フォーク→ブランチ作成→実装→PR作成
3. **ドキュメント改善**: ドキュメントの修正・追加

### 開発フロー
```bash
# 1. ブランチ作成
npm run dev:branch

# 2. 実装
# コード作成・編集

# 3. テスト作成・実行
# テストコード作成・実行

# 4. コミット・PR作成
npm run dev:commit
# → 自動PR作成・品質チェック実行
```

## 📄 ライセンス

このプロジェクトは [MIT License](LICENSE) の下で公開されています。

## 🔗 関連リンク

- **メイン**: [GitHub Repository](../../)
- **Issues**: [GitHub Issues](../../issues) - バグ報告・機能要望
- **Discussions**: [GitHub Discussions](../../discussions) - 質問・相談
- **Actions**: [GitHub Actions](../../actions) - CI/CD状況
- **Wiki**: [GitHub Wiki](../../wiki) - 詳細ドキュメント

## 📞 サポート

- **Issues**: [GitHub Issues](../../issues)
- **Discussions**: [GitHub Discussions](../../discussions)
- **Wiki**: [GitHub Wiki](../../wiki)

---

**EventPay Manager** - 幹事の負担を軽減し、みんなが楽しめる飲み会を 🍻

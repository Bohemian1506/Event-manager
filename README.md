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

### 前提条件
- Docker & Docker Compose
- Node.js 18+
- Git

### セットアップ
```bash
# リポジトリクローン
git clone <repository-url>
cd eventpay_manager

# 自動セットアップ実行
./setup.sh

# サーバー起動
docker-compose up -d

# ブラウザでアクセス
open http://localhost:3000
```

## 🛠️ 開発

### 自動化開発フロー
EventPay Managerでは開発の自動化が設定されています：

```bash
# ブランチ作成（対話式）
npm run dev:branch

# 実装作業
# ファイル編集・コード作成

# コミット（対話式）  
npm run dev:commit
# → 自動ステージング・コミット・プッシュ・PR作成

# 品質チェック（自動実行）
# → RuboCop + RSpec + Brakeman
```

### 利用可能なコマンド
```bash
# 開発支援
npm run dev:branch      # ブランチ作成
npm run dev:commit      # コミット
npm run dev:push        # プッシュ
npm run dev:pr          # PR作成

# 品質チェック
npm run quality:check   # RuboCop + RSpec
npm run security:scan   # Brakeman

# Git管理
npm run git:update      # main最新化
npm run git:clean       # マージ済みブランチ削除
```

## 🤖 AI協調開発

zen-mcp-serverを使用した複数AI協調開発をサポート：

- **新機能実装時**: `/consensus`で設計合意形成
- **バグ修正時**: `/debug`で根本原因分析  
- **セキュリティコード**: `/secaudit`で監査
- **コミット前**: `/precommit`で品質チェック

詳細は [AI開発ルール](docs/ai-development/ai-development-rules.md) を参照

## 🏗️ アーキテクチャ

### 技術スタック
- **Backend**: Ruby 3.3.6 + Rails 8.0.0
- **Database**: PostgreSQL 15
- **Frontend**: Bootstrap 5.3 + Stimulus
- **CSS**: Sass
- **Components**: ViewComponent
- **Email**: SendGrid
- **Queue**: Solid Queue (Rails 8標準)
- **Cache**: Solid Cache (Rails 8標準)

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

## 📚 ドキュメント

### セットアップ・開発
- [開発ルール](docs/setup/development-rules.md) - コーディング規約
- [セットアップガイド](docs/setup/setup.md) - 環境構築手順

### ワークフロー
- [GitHub環境構築](docs/workflows/github-setup.md) - GitHub CLI設定
- [GitHubワークフロー](docs/workflows/github-workflow.md) - Issue・PR管理
- [Claude Code自動ワークフロー](docs/workflows/claude-code-workflow.md) - 自動化手順

### AI開発
- [AI開発ルール](docs/ai-development/ai-development-rules.md) - 複数AI協調開発
- [zen-mcp-setup](docs/ai-development/zen-mcp-setup.md) - zen-mcp-server設定
- [zen-mcp-workflow](docs/ai-development/zen-mcp-workflow.md) - 実践的使用方法

### 仕様
- [画面遷移図](docs/specifications/screen-flow.md) - 全画面遷移とフロー

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

## 📞 サポート

- **Issues**: [GitHub Issues](../../issues)
- **Discussions**: [GitHub Discussions](../../discussions)
- **Wiki**: [GitHub Wiki](../../wiki)

---

**EventPay Manager** - 幹事の負担を軽減し、みんなが楽しめる飲み会を 🍻

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

## 🏗️ 技術情報

### 技術スタック
- **Backend**: Ruby 3.3.6 + Rails 8.0.2
- **Database**: PostgreSQL 15
- **Frontend**: Bootstrap 5.3 + Stimulus
- **Components**: ViewComponent
- **Email**: SendGrid

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

## 🛠️ 開発

### 基本的な開発フロー
```bash
# 1. 作業開始
npm run work:start:cli <type> <task-name>

# 2. 実装・テスト
# ファイル編集、動作確認...

# 3. コミット・PR作成
npm run dev:commit
```

詳細な開発コマンドは [クイックリファレンス](docs/development/quick-reference.md) を参照してください。

## 🤖 AI協調開発

zen-mcp-serverを活用した複数AI協調開発をサポート：
- **設計検討**: `/consensus` - 複数AIでの合意形成
- **品質チェック**: `/precommit` - コミット前総合チェック  
- **セキュリティ監査**: `/secaudit` - 包括的セキュリティ分析
- **バグ分析**: `/debug` - 根本原因の詳細分析

詳細は [AI開発ルール](docs/ai-development/ai-development-rules.md) を参照してください。

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

環境変数の設定やGitHub環境構築は [セットアップガイド](docs/setup/setup.md) を参照してください。

## 🧪 テスト・セキュリティ

```bash
# 品質チェック（テスト+セキュリティ）
npm run quality:check
npm run security:scan
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
2. **開発参加**: `npm run work:start:cli <type> <task-name>` で開始
3. **PR作成**: `npm run dev:commit` で自動作成

## 📞 サポート・リンク

- **Issues**: [GitHub Issues](../../issues) - バグ報告・機能要望
- **Discussions**: [GitHub Discussions](../../discussions) - 質問・相談
- **License**: [MIT License](LICENSE)

---

**EventPay Manager** - 幹事の負担を軽減し、みんなが楽しめる飲み会を 🍻

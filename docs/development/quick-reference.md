# EventPay Manager - 開発クイックリファレンス

開発時によく使うコマンドと情報をまとめています。

## 🚀 作業開始・完了コマンド

### 作業開始
```bash
# 対話式（ブランチタイプとタスク名を入力）
npm run work:start

# 非対話式（Claude Code推奨）
npm run work:start:cli <type> <task-name>

# 例
npm run work:start:cli feature add-user-authentication
npm run work:start:cli fix resolve-payment-issue
npm run work:start:cli docs update-readme
```

### 作業完了
```bash
# 対話式コミット・プッシュ
npm run dev:commit
```

## 🎯 ブランチタイプ
- `feature`: 新機能開発
- `fix`: バグ修正
- `refactor`: リファクタリング
- `docs`: ドキュメント更新
- `test`: テスト追加・修正
- `chore`: その他の作業

## 📋 よく使うコマンド

### 開発環境
```bash
# Docker起動
docker-compose up -d

# DB作成・マイグレーション
docker-compose exec web rails db:create
docker-compose exec web rails db:migrate

# アプリ確認
# http://localhost:3000
```

### Git操作
```bash
# mainブランチ最新化
npm run git:update

# マージ済みブランチ削除
npm run git:clean

# ブランチ作成のみ
npm run dev:branch:cli <type> <task-name>
```

### 品質チェック
```bash
# コード品質・テスト実行
npm run quality:check

# セキュリティスキャン
npm run security:scan
```

### PR・アーカイブ
```bash
# PR作成（Claude Code活用）
npm run pr:create

# PR本文更新（Claude Code活用）
npm run pr:update

# アーカイブ作成
npm run archive:create
```

## 🛠️ 技術スタック

### 基本構成
- **Ruby**: 3.3.6
- **Rails**: 8.0.0 (標準認証)
- **Database**: PostgreSQL 15
- **CSS**: Bootstrap 5.3
- **JS**: Stimulus
- **Mail**: SendGrid

### 主要Gem
- **view_component**: コンポーネント管理
- **rails-i18n** + **enum_help**: 日本語化
- **rqrcode**: QRコード生成
- **solid_queue** + **solid_cache**: Rails 8標準
- **rspec-rails** + **factory_bot_rails**: テスト

## 🏗️ アーキテクチャ

### 認証システム
- **幹事**: Rails 8標準認証（メール+パスワード）
- **参加者**: トークンベース（7日間有効、登録不要）

### データベース構造
- **users**: 幹事（Rails 8標準認証）
- **events**: イベント（share_token含む）
- **rounds**: 各回（1次会、2次会等）
- **participants**: 参加者（edit_token含む）
- **participations**: 参加状況（参加/支払い管理）

### ViewComponent
- **ParticipantCardComponent**: 参加者カード
- **PaymentStatusComponent**: 支払い状況バッジ
- **RoundCardComponent**: n次会カード
- **EventHeaderComponent**: イベントヘッダー

## 🤖 AI協調開発

### zen-mcp-server連携
```bash
# 新機能設計検討
/consensus

# コミット前品質チェック
/precommit

# セキュリティ監査
/secaudit

# バグ分析
/debug

# コードレビュー
/codereview

# リファクタリング提案
/refactor
```

### Claude Code活用
- PR作成・更新: `@claude` メンション
- 高品質PR本文自動生成
- 技術的質問・実装相談

## 📚 ドキュメントショートカット

### セットアップ・開発ルール
- [開発ルール](../setup/development-rules.md) - コーディング規約、命名規則
- [セットアップガイド](../setup/setup.md) - 環境構築、トラブルシューティング

### ワークフロー
- [GitHub環境構築](../workflows/github-setup.md) - GitHub CLI設定
- [GitHubワークフロー](../workflows/github-workflow.md) - Issue、PR、マージフロー
- [Claude Code自動ワークフロー](../workflows/claude-code-workflow.md) - 自動化手順

### AI開発
- [AI開発ルール](../ai-development/ai-development-rules.md) - 複数AI協調開発
- [zen-mcp-setup](../ai-development/zen-mcp-setup.md) - セットアップガイド
- [zen-mcp-workflow](../ai-development/zen-mcp-workflow.md) - 実践例

### 仕様
- [画面遷移図](../specifications/screen-flow.md) - 全画面の遷移とフロー
- [Issueテンプレート](../workflows/issue-templates.md) - GitHub Issue作成

## 🔧 トラブルシューティング

### よくある問題
```bash
# Docker関連
docker-compose down && docker-compose up -d

# DB関連
docker-compose exec web rails db:drop db:create db:migrate

# 依存関係
docker-compose exec web bundle install
npm install
```

### ログ確認
```bash
# アプリケーションログ
docker-compose logs web

# データベースログ
docker-compose logs db
```

## 🎯 開発フロー

1. **作業開始**: `npm run work:start:cli <type> <task-name>`
2. **実装・テスト**: コード編集、動作確認
3. **品質チェック**: `npm run quality:check`
4. **コミット**: `npm run dev:commit`
5. **PR確認**: GitHub Actions自動作成
6. **レビュー**: `@claude` メンションで依頼
7. **マージ**: レビュー完了後、mainへマージ

---

💡 **Tips**: 
- 開発時は常にこのドキュメントを参照
- 新しいコマンドを追加したらここにも記載
- 不明点は`@claude`に質問
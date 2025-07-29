# EventPay Manager

飲み会の幹事負担を軽減する、参加者登録不要の出欠・精算管理アプリ

## 📋 プロジェクト概要

### 解決する課題
- 1次会→2次会→3次会と続く飲み会で、各回の参加者管理が煩雑
- 誰が参加費を払ったか/払ってないかの把握が大変
- 特に2次会以降は突発的に決まるため、その場での管理が困難

### 特徴
- **参加者登録不要**: 共有URLからアクセス、名前とメールのみで参加
- **二重認証システム**: 幹事（Rails認証）+ 参加者（トークンベース）
- **n次会対応**: 1次会、2次会、3次会...を柔軟に管理
- **リアルタイム支払い管理**: 各回ごとの支払い状況を即座に更新

## 🛠️ 技術スタック

- **Ruby**: 3.3.6
- **Rails**: 8.0.0 (標準認証使用)
- **Database**: PostgreSQL 15
- **CSS**: Bootstrap 5.3 + ViewComponent
- **JavaScript**: Stimulus
- **Mail**: SendGrid
- **Development**: Docker Compose
- **Background Jobs**: solid_queue (Rails 8標準)
- **Cache**: solid_cache (Rails 8標準)

## 🔐 認証システム

### 幹事認証
- Rails 8標準認証（`has_secure_password`）
- メール + パスワードでログイン
- 複数イベントの作成・管理が可能

### 参加者認証
- トークンベース認証（登録不要）
- 共有URLから名前・メールで参加登録
- 編集用URLをメール送信（7日間有効）

```ruby
# 参加者トークン有効期限
PARTICIPANT_TOKEN_EXPIRES_IN = 7.days
```

## 🚀 クイックスタート

### 1. 必要な環境
- Docker & Docker Compose
- Git

### 2. セットアップ
```bash
# リポジトリクローン
git clone [repository-url]
cd eventpay_manager

# 環境変数設定
cp .env.example .env.local
# .env.localにSendGridのAPIキーを設定

# Docker環境起動
docker-compose up -d

# データベース作成・マイグレーション
docker-compose exec web rails db:create
docker-compose exec web rails db:migrate

# ブラウザでアクセス
# http://localhost:3000
```

### 3. 環境変数
```bash
# .env.local
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxx
APP_DOMAIN=localhost:3000
```

## 💾 データベース構造

- **users**: 幹事（Rails 8標準認証）
- **events**: イベント（share_token含む）
- **rounds**: 各回（1次会、2次会等）
- **participants**: 参加者（edit_token含む）
- **participations**: 参加状況（参加/支払い管理）

## 📱 主要機能

### 1. イベント管理
- 幹事がn次会を含むイベントを作成・管理
- 基本情報（名前、日付、説明）+ 各回の詳細設定
- QRコード付き共有URL生成

### 2. 参加者登録
- 共有URLから登録（ユーザー登録不要）
- 名前とメールアドレスのみ必要
- 各回への参加を個別に選択可能
- 編集用URLをメール自動送信

### 3. 支払い管理
- 幹事が参加者の支払い状況を管理
- 各回ごとに独立して管理
- チェックボックスで簡単更新

### 4. リマインダー機能
- 未払い参加者への一括メール送信
- SendGrid経由での配信
- 送信履歴の記録

## 🧩 ViewComponent

UIコンポーネントはViewComponentで管理：

- **ParticipantCardComponent**: 参加者カード表示
- **PaymentStatusComponent**: 支払い状況バッジ
- **RoundCardComponent**: n次会カード表示
- **EventHeaderComponent**: イベントヘッダー

## 💻 開発コマンド

### 基本操作
```bash
# 起動
docker-compose up -d

# 停止
docker-compose down

# ログ確認
docker-compose logs -f web

# コンソール起動
docker-compose exec web rails console
```

### データベース
```bash
# マイグレーション
docker-compose exec web rails db:migrate

# リセット（開発環境）
docker-compose exec web rails db:drop db:create db:migrate
```

### テスト・品質チェック
```bash
# 全テスト実行
docker-compose exec web bundle exec rspec

# RuboCop実行
docker-compose exec web bundle exec rubocop

# 自動修正
docker-compose exec web bundle exec rubocop -A
```

## 📁 プロジェクト構造

```
eventpay_manager/
├── app/
│   ├── components/              # ViewComponent
│   ├── controllers/
│   ├── models/
│   ├── views/
│   └── assets/
│       └── stylesheets/
│           ├── base/            # 基本設定
│           ├── components/      # ViewComponent用
│           ├── pages/           # ページ固有
│           └── utilities/       # ユーティリティ
├── config/
├── db/
├── docs/                        # 開発ドキュメント
│   ├── development-rules.md     # 開発ルール
│   ├── setup.md                # 詳細セットアップ
│   ├── github-workflow.md      # Git運用ルール
│   └── ai-development-rules.md # AI協調開発
├── spec/                        # テスト
├── docker-compose.yml
├── Dockerfile
└── CLAUDE.md                    # プロジェクト詳細仕様
```

## 📖 開発ドキュメント

詳細な開発情報は以下を参照：

- **[CLAUDE.md](CLAUDE.md)** - プロジェクト詳細仕様・技術スタック
- **[開発ルール](docs/development-rules.md)** - コーディング規約・実装ガイド
- **[セットアップガイド](docs/setup.md)** - 詳細な環境構築手順
- **[GitHubワークフロー](docs/github-workflow.md)** - Git運用・PR管理
- **[AI開発ルール](docs/ai-development-rules.md)** - AI協調開発ガイド

## 🔧 開発ルール

### コーディング規約
- **Ruby**: RuboCop準拠
- **CSS**: BEM記法 + Bootstrapユーティリティ
- **JavaScript**: Stimulusコントローラー
- **テスト**: RSpec（単体・統合テスト）

### Git運用
- **mainブランチでの直接作業禁止**
- **機能開発**: `feature/feature-name`
- **バグ修正**: `fix/bug-description`
- **GitHub CLI**: `gh`コマンドでPR管理

### ViewComponent
```ruby
# app/components/participant_card_component.rb
class ParticipantCardComponent < ViewComponent::Base
  def initialize(participant:, show_edit_link: false)
    @participant = participant
    @show_edit_link = show_edit_link
  end
  # ...
end
```

## 🧪 テスト

```bash
# 全テスト実行
docker-compose exec web bundle exec rspec

# 特定のテスト
docker-compose exec web bundle exec rspec spec/models/event_spec.rb

# カバレッジ付き実行
docker-compose exec web COVERAGE=true bundle exec rspec
```

## 🚨 重要ポイント

- **セキュリティ**: トークン暗号化、CSRF保護
- **パフォーマンス**: N+1対策、適切なインデックス
- **メール送信**: 開発環境はletter_opener、本番はSendGrid
- **認証**: 幹事は永続ログイン、参加者は7日間限定アクセス

## 📞 サポート

- Issue報告: [GitHub Issues](link-to-issues)
- 開発相談: docsディレクトリ内の各種ガイドを参照

---

*EventPay Manager - 飲み会をもっとスマートに*
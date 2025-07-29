# EventPay Manager

## プロジェクト概要
飲み会の幹事負担を軽減する、参加者登録不要の出欠・精算管理アプリ

## 技術スタック
- **Ruby**: 3.3.6
- **Rails**: 8.0.0 (標準認証使用)
- **Database**: PostgreSQL 15
- **CSS**: Bootstrap 5.3
- **JS**: Stimulus
- **Components**: ViewComponent
- **Mail**: SendGrid
- **Development**: Docker Compose
- **GitHub CLI**: gh コマンド（PR作成・管理用）

## 認証システム
- **幹事**: Rails 8標準認証（メール+パスワード）
- **参加者**: トークンベース認証（登録不要、7日間有効）

```ruby
# 参加者トークン有効期限
PARTICIPANT_TOKEN_EXPIRES_IN = 7.days
```

## データベース構造
- **users**: 幹事（Rails 8標準認証）
- **events**: イベント（share_token含む）
- **rounds**: 各回（1次会、2次会等）
- **participants**: 参加者（edit_token含む）
- **participations**: 参加状況（参加/支払い管理）

## 主要Gem
- **bootstrap** + **jquery-rails** + **bootstrap-icons-helper**: UI
- **view_component**: コンポーネント管理
- **rails-i18n** + **enum_help**: 日本語化
- **sendgrid-ruby**: メール送信
- **rqrcode**: QRコード生成
- **solid_queue** + **solid_cache**: Rails 8標準
- **rspec-rails** + **factory_bot_rails** + **faker**: テスト

## クイックスタート
```bash
# 起動
docker-compose up -d

# DB作成・マイグレーション
docker-compose exec web rails db:create
docker-compose exec web rails db:migrate

# ブラウザでアクセス
# http://localhost:3000
```

## CSSファイル構成
```
app/assets/stylesheets/
├── application.scss        # メイン
├── base/                   # 基本設定
├── components/             # ViewComponent用
├── pages/                  # ページ固有
└── utilities/              # ユーティリティ
```

## ViewComponent
- **ParticipantCardComponent**: 参加者カード
- **PaymentStatusComponent**: 支払い状況バッジ
- **RoundCardComponent**: n次会カード
- **EventHeaderComponent**: イベントヘッダー

## 主要機能
1. **イベント管理**: 幹事がn次会を含むイベントを作成・管理
2. **参加者登録**: 共有URLから登録（登録不要）
3. **支払い管理**: 各回ごとの支払い状況管理
4. **リマインダー**: 未払い者へのメール送信

## 環境変数
```bash
# .env.local
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxx
APP_DOMAIN=eventpay.example.com
```


## 開発について
詳細な開発ルールとセットアップ手順は以下を参照：
- **[開発ルール](docs/development-rules.md)** - コーディング規約、命名規則、実装ガイド
- **[セットアップガイド](docs/setup.md)** - 環境構築、開発コマンド、トラブルシューティング
- **[GitHubワークフロー](docs/github-workflow.md)** - ghコマンド運用、PR作成・管理方法
- **[AI開発ルール](docs/ai-development-rules.md)** - 複数AI協調開発、zen-mcp-server運用ガイド

## 重要ポイント
- **幹事認証**: Rails 8標準認証（has_secure_password）
- **参加者認証**: トークンベース（7日間有効、登録不要）
- **セキュリティ**: トークン暗号化、CSRF保護
- **パフォーマンス**: N+1対策、適切なインデックス設定
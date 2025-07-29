# EventPay Manager - 統一仕様書

## 📋 プロジェクト概要

### 🎯 コンセプト
飲み会の幹事負担を軽減する、参加者登録不要の出欠・精算管理アプリ

### 解決する課題
- 1次会→2次会→3次会と続く飲み会で、各回の参加者管理が煩雑
- 誰が参加費を払ったか/払ってないかの把握が大変
- 特に2次会以降は突発的に決まるため、その場での管理が困難

## 🛠️ 技術スタック

### 基本構成
```yaml
プロジェクト名: eventpay_manager
Rubyバージョン: 3.3.6
Railsバージョン: 8.0.0
データベース: PostgreSQL 15
開発環境: Docker Compose
CSSフレームワーク: Bootstrap 5.3
UIコンポーネント: ViewComponent
JavaScriptフレームワーク: Stimulus
メール送信: SendGrid
```

### プロジェクト作成コマンド
```bash
rails new eventpay_manager \
  --database=postgresql \
  --authentication \
  --css=bootstrap \
  --skip-jbuilder=false
```

## 🔐 認証・アクセス管理

### 認証方式
| ユーザー種別 | 認証方式          | 説明                                  |
| ------------ | ----------------- | ------------------------------------- |
| **幹事**     | メール+パスワード | Rails 8標準認証、複数イベント管理可能 |
| **参加者**   | トークンベース    | ユーザー登録不要、編集URLで再アクセス |

### トークン管理
```ruby
# 参加者トークン有効期限
PARTICIPANT_TOKEN_EXPIRES_IN = 7.days
```

### アクセスフロー
```
幹事：
1. ユーザー登録（初回のみ）
2. ログイン
3. イベント作成・管理

参加者：
1. 共有URLアクセス
2. 名前・メールアドレス入力
3. 編集URLをメール受信
4. トークンでアクセス（7日間有効）
```

## 💾 データベース構造

### events（イベント）
```ruby
- id: integer
- user_id: integer      # 幹事のユーザーID
- name: string          # イベント名
- date: date           # 開催日
- description: text    # 備考
- share_token: string  # 共有URL用トークン
- created_at: datetime
- updated_at: datetime
```

### rounds（各回）
```ruby
- id: integer
- event_id: integer    # 所属イベント
- name: string         # 名称（例：1次会、2次会、前夜祭）
- order: integer       # 表示順（1, 2, 3...）
- venue: string        # 会場名
- start_time: time     # 開始時間
- fee: integer         # 参加費
- created_at: datetime
- updated_at: datetime
```

### participants（参加者）
```ruby
- id: integer
- event_id: integer    # 所属イベント
- name: string         # 名前
- email: string        # メールアドレス
- edit_token: string   # 編集URL用トークン
- expires_at: datetime # トークン有効期限
- created_at: datetime
- updated_at: datetime
```

### participations（参加状況）
```ruby
- id: integer
- participant_id: integer  # 参加者
- round_id: integer       # 各回
- is_joining: boolean     # 参加/不参加
- is_paid: boolean        # 支払い済/未払い
- created_at: datetime
- updated_at: datetime
```

### users（幹事ユーザー）
```ruby
# Rails 8標準認証で自動生成
- id: integer
- email: string
- password_digest: string
- created_at: datetime
- updated_at: datetime
```

## 💎 Gemfile

```ruby
source "https://rubygems.org"

ruby "3.3.6"

# ========================================
# Core - Rails 8基本構成
# ========================================
gem "rails", "~> 8.0.0"
gem "pg", "~> 1.1"
gem "puma", ">= 5.0"
gem "bootsnap", require: false

# ========================================
# Rails 8標準機能
# ========================================
gem "propshaft"           # アセットパイプライン
gem "turbo-rails"         # Hotwire Turbo
gem "stimulus-rails"      # Hotwire Stimulus
gem "jbuilder"           # JSON APIビルダー

# ========================================
# 認証・セキュリティ
# ========================================
gem "bcrypt", "~> 3.1.7"  # has_secure_password用

# ========================================
# フロントエンド・UI
# ========================================
gem "bootstrap", "~> 5.3.0"    # CSSフレームワーク
gem "jquery-rails"             # Bootstrap用
gem "bootstrap-icons-helper"   # アイコン
gem "view_component", "~> 3.0" # UIコンポーネント
gem "kaminari"                 # ページネーション

# ========================================
# 日本語化・国際化
# ========================================
gem "rails-i18n"         # Rails標準機能の日本語化
gem "enum_help"          # Enumの日本語化サポート

# ========================================
# バックグラウンド処理・キャッシュ
# ========================================
gem "solid_queue"        # Rails 8新標準のジョブキュー
gem "solid_cache"        # Rails 8新標準のキャッシュストア
gem "mission_control-jobs" # ジョブ管理UI

# ========================================
# データ管理・機能拡張
# ========================================
gem "discard"            # ソフトデリート機能
gem "rqrcode"            # QRコード生成（共有URL用）

# ========================================
# メール送信
# ========================================
gem "sendgrid-ruby", "~> 6.7"  # SendGridクライアント

# ========================================
# 開発・テスト環境
# ========================================
group :development, :test do
  gem "debug", platforms: %i[ mri windows ], require: "debug/prelude"
  gem "rspec-rails"        # テストフレームワーク
  gem "factory_bot_rails"  # テストデータ作成
  gem "faker"              # ダミーデータ生成
end

group :development do
  gem "web-console"        # ブラウザ上でのデバッグコンソール
  gem "letter_opener"      # 開発環境でのメール確認
  gem "annotate"           # モデルへのスキーマ情報追記
  gem "bullet"             # N+1問題の検出
  gem "better_errors"      # エラー画面の改善
  gem "binding_of_caller"  # better_errorsの拡張
  gem "lookbook"           # ViewComponentカタログ
  gem "listen", "~> 3.3"
  gem "spring"
end

group :test do
  gem "capybara"           # 統合テスト
  gem "selenium-webdriver" # ブラウザ自動操作
end
```

## 🐳 Docker環境構築

### Dockerfile
```dockerfile
FROM ruby:3.3.6-slim

ENV LANG C.UTF-8
ENV TZ Asia/Tokyo

# 必要なパッケージをインストール
RUN apt-get update -qq && apt-get install -y \
    build-essential \
    libpq-dev \
    git \
    vim \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /rails

# Gemfileを先にコピー（キャッシュ効率化）
COPY Gemfile Gemfile.lock ./
RUN bundle install

COPY . .

EXPOSE 3000
CMD ["rails", "server", "-b", "0.0.0.0"]
```

### docker-compose.yml
```yaml
version: '3.9'

services:
  web:
    build: .
    command: bash -c "rm -f tmp/pids/server.pid && bin/rails server -b 0.0.0.0"
    volumes:
      - .:/rails
      - bundle_cache:/usr/local/bundle
    ports:
      - "3000:3000"
    depends_on:
      - db
    environment:
      DATABASE_URL: postgres://postgres:password@db:5432/eventpay_manager_development
      RAILS_ENV: development
    stdin_open: true
    tty: true

  db:
    image: postgres:15-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      POSTGRES_PASSWORD: password
      POSTGRES_DB: eventpay_manager_development

volumes:
  postgres_data:
  bundle_cache:
```

## 🎨 CSS/Bootstrap設定

### ディレクトリ構造
```
app/assets/stylesheets/
├── application.scss        # メインファイル
├── base/
│   ├── _variables.scss    # 変数定義
│   ├── _mixins.scss       # ミックスイン
│   └── _reset.scss        # リセットCSS
├── components/            # ViewComponent用
│   ├── _index.scss
│   ├── _participant_card.scss
│   └── _payment_badge.scss
├── pages/                 # ページ固有
│   ├── _index.scss
│   └── _events.scss
└── utilities/            # ユーティリティ
    ├── _index.scss
    └── _overrides.scss
```

## 🧩 ViewComponent実装

### 基本コンポーネント
- **ParticipantCardComponent**: 参加者カード表示
- **PaymentStatusComponent**: 支払い状況バッジ
- **RoundCardComponent**: 各回（n次会）表示
- **EventHeaderComponent**: イベントヘッダー

### 実装例
```ruby
# app/components/participant_card_component.rb
class ParticipantCardComponent < ViewComponent::Base
  def initialize(participant:, custom_class: nil)
    @participant = participant
    @custom_class = custom_class
  end

  private

  def component_classes
    classes = ['participant-card', 'card', 'mb-3']
    classes << @custom_class if @custom_class
    classes.join(' ')
  end
end
```

## 📱 主要機能

### 1. イベント管理機能
- 幹事がログイン後、イベントを作成
- 基本情報（名前、日付、説明）を設定
- n次会を柔軟に追加・編集可能

### 2. 参加者登録機能
- 共有URLから登録（ユーザー登録不要）
- 名前とメールアドレスのみ必要
- 各回への参加を個別に選択可能
- 編集用URLをメール送信

### 3. 支払い管理機能
- 幹事が参加者の支払い状況を管理
- 各回ごとに独立して管理
- チェックボックスで簡単更新

### 4. リマインダー機能
- 未払い参加者に一括送信
- SendGrid経由でメール配信
- 送信履歴の記録

## 📧 メール設定

### SendGrid設定
```ruby
# config/environments/production.rb
config.action_mailer.delivery_method = :sendgrid_actionmailer
config.action_mailer.sendgrid_actionmailer_settings = {
  api_key: ENV['SENDGRID_API_KEY'],
  raise_delivery_errors: true
}

# config/environments/development.rb
config.action_mailer.delivery_method = :letter_opener
```

### 環境変数
```bash
# .env.local
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxx
APP_DOMAIN=eventpay.example.com
```

## 📁 プロジェクト構造

```
eventpay_manager/
├── app/
│   ├── components/          # ViewComponents
│   ├── controllers/
│   ├── models/
│   ├── views/
│   └── assets/
│       └── stylesheets/
├── config/
│   ├── database.yml
│   └── application.rb
├── db/
├── Dockerfile
├── docker-compose.yml
├── Gemfile
└── README.md
```

## 🚀 セットアップ手順

```bash
# 1. プロジェクト作成
rails new eventpay_manager \
  --database=postgresql \
  --authentication \
  --css=bootstrap \
  --skip-jbuilder=false

cd eventpay_manager

# 2. DockerfileとGemfileを配置

# 3. Docker環境起動
docker-compose up -d

# 4. データベース作成
docker-compose exec web rails db:create
docker-compose exec web rails db:migrate

# 5. 開発サーバー起動
docker-compose exec web bin/rails server -b 0.0.0.0

# 6. ブラウザでアクセス
# http://localhost:3000
```

## 🔧 開発ルール

### コーディング規約
- **Ruby**: RuboCopのデフォルト設定に準拠
- **CSS**: BEM記法 + Bootstrapユーティリティ
- **JavaScript**: Stimulusコントローラーで管理
- **テスト**: RSpecで単体・統合テストを作成

### Git管理
```gitignore
/config/master.key
/config/credentials.yml.enc
.env*
/tmp/*
/log/*
.DS_Store
```

### 命名規則
- **モデル**: 単数形、キャメルケース（Event, Participant）
- **テーブル**: 複数形、スネークケース（events, participants）
- **ViewComponent**: ComponentSuffix（ParticipantCardComponent）
- **CSSクラス**: ケバブケース（participant-card）

## ✅ MVP実装チェックリスト

- [ ] Rails 8プロジェクト作成
- [ ] Docker環境構築
- [ ] 幹事認証機能（Rails 8標準認証）
- [ ] イベントCRUD機能
- [ ] 各回（rounds）管理機能
- [ ] 参加者自己登録機能
- [ ] トークンベース認証（参加者）
- [ ] 支払い状況管理
- [ ] メール送信機能（SendGrid）
- [ ] ViewComponent実装
- [ ] Bootstrap統合
- [ ] 日本語化
- [ ] 基本的なテスト

## 🔮 今後の拡張予定

### Phase 2（MVP + 1〜2ヶ月）
- Google/LINE認証
- PWA化
- LINE通知連携
- ダークモード

### Phase 3（MVP + 3〜4ヶ月）
- 参加者別料金設定
- 支払い方法の記録
- エクスポート機能
- 複数幹事対応

### Phase 4（MVP + 6ヶ月〜）
- API公開
- 他アプリ連携
- 決済サービス統合

---

*統一版作成日: 2025年7月28日*
*この仕様書に基づいて開発を進めてください。*
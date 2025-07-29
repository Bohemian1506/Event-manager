# EventPay Manager - 環境構築ガイド & 実装ルール

## 📋 プロジェクト概要

**EventPay Manager**は、飲み会の幹事負担を軽減する出欠・精算管理アプリケーションです。

- **フレームワーク**: Rails 8.0.0
- **Ruby**: 3.3.6
- **データベース**: PostgreSQL 15
- **UIフレームワーク**: Bootstrap 5.3 + ViewComponent
- **開発環境**: Docker Compose

## 🐳 Docker環境構築

### 1. 必要なファイル

#### `Dockerfile`
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

#### `docker-compose.yml`
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
      DATABASE_URL: postgres://postgres:password@db:5432/eventpay_development
      RAILS_ENV: development
    stdin_open: true
    tty: true

  db:
    image: postgres:15-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      POSTGRES_PASSWORD: password
      POSTGRES_DB: eventpay_development

volumes:
  postgres_data:
  bundle_cache:
```

### 2. セットアップ手順

```bash
# 1. プロジェクト作成
rails new eventpay_manager \
  --database=postgresql \
  --authentication \
  --skip-javascript \
  --skip-jbuilder

cd eventpay_manager

# 2. 上記のDockerfileとdocker-compose.ymlを配置

# 3. Dockerコンテナ起動
docker-compose up -d

# 4. データベース作成
docker-compose exec web rails db:create
docker-compose exec web rails db:migrate

# 5. ブラウザでアクセス
# http://localhost:3000
```

## 💎 Gemfile構成

```ruby
source "https://rubygems.org"

ruby "3.3.6"

# Core
gem "rails", "~> 8.0.0"
gem "pg", "~> 1.1"
gem "puma", ">= 5.0"
gem "bootsnap", require: false

# Rails 8標準
gem "propshaft"
gem "turbo-rails"
gem "stimulus-rails"

# 認証
gem "bcrypt", "~> 3.1.7"

# UI Components
gem "view_component", "~> 3.0"
gem "bootstrap", "~> 5.3.0"
gem "jquery-rails"
gem "bootstrap-icons-helper"

# 日本語化
gem "rails-i18n"
gem "enum_help"

# バックグラウンド処理
gem "solid_queue"
gem "solid_cache"

# その他
gem "kaminari"
gem "discard"
gem "rqrcode"

group :development, :test do
  gem "debug"
  gem "rspec-rails"
  gem "factory_bot_rails"
  gem "faker"
end

group :development do
  gem "web-console"
  gem "letter_opener"
  gem "annotate"
  gem "bullet"
  gem "better_errors"
  gem "binding_of_caller"
  gem "lookbook"  # ViewComponentカタログ
end

group :test do
  gem "capybara"
  gem "selenium-webdriver"
end
```

## 🎨 CSS/Bootstrap設定

### 1. ディレクトリ構造

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

### 2. application.scss

```scss
// 1. Bootstrap変数のカスタマイズ
$primary: #007bff;
$success: #28a745;
$danger: #dc3545;
$warning: #ffc107;

// 2. Bootstrapをインポート
@import "bootstrap";

// 3. ベーススタイル
@import "base/variables";
@import "base/mixins";
@import "base/reset";

// 4. コンポーネント
@import "components/index";

// 5. ページ固有
@import "pages/index";

// 6. ユーティリティ（最高優先度）
@import "utilities/index";
```

### 3. CSS優先順位ルール

1. **Bootstrap標準** → **カスタムコンポーネント** → **ユーティリティ**の順で読み込む
2. `!important`は原則使用しない（ユーティリティクラスのみ例外）
3. 詳細度で優先順位をコントロール
4. BEM記法でクラス名を管理

## 🧩 ViewComponent実装ルール

### 1. 基本構造

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

```erb
<!-- app/components/participant_card_component.html.erb -->
<div class="<%= component_classes %>" data-participant-id="<%= @participant.id %>">
  <div class="card-body">
    <h5 class="participant-card__title card-title">
      <%= @participant.name %>
    </h5>
    <div class="participant-card__content">
      <%= content %>
    </div>
  </div>
</div>
```

### 2. コンポーネント命名規則

- **ファイル名**: `participant_card_component.rb`
- **クラス名**: `ParticipantCardComponent`
- **CSSクラス**: `participant-card`（ケバブケース）
- **BEM要素**: `participant-card__title`

### 3. スタイル定義

```scss
// app/assets/stylesheets/components/_participant_card.scss
.participant-card {
  // Bootstrapクラスの拡張
  @extend .shadow-sm;
  transition: all 0.3s ease;
  
  &:hover {
    @extend .shadow;
    transform: translateY(-2px);
  }
  
  // BEM記法で子要素を定義
  &__title {
    font-weight: bold;
    margin-bottom: 0.5rem;
  }
  
  &__content {
    color: $text-muted;
  }
}
```

## 📁 プロジェクト構造

```
eventpay_manager/
├── app/
│   ├── components/          # ViewComponents
│   │   ├── application_component.rb
│   │   ├── participant_card_component.rb
│   │   └── payment_status_component.rb
│   ├── controllers/
│   ├── models/
│   ├── views/
│   │   └── layouts/
│   │       └── application.html.erb
│   └── assets/
│       └── stylesheets/    # 上記構造
├── config/
│   ├── database.yml
│   └── application.rb      # タイムゾーン設定
├── db/
├── Dockerfile
├── docker-compose.yml
└── Gemfile
```

## 🔧 開発ルール

### 1. Git管理

```bash
# .gitignore に追加
/config/master.key
/config/credentials.yml.enc
.env*
/tmp/*
/log/*
```

### 2. データベース設計原則

- 論理削除には`discard` gemを使用
- タイムスタンプは必ずJST（Asia/Tokyo）で保存
- 外部キー制約を必ず設定

### 3. コーディング規約

- **Ruby**: RuboCopのデフォルト設定に準拠
- **CSS**: BEM記法 + Bootstrapユーティリティ
- **JavaScript**: Stimulusコントローラーで管理

### 4. テスト方針

- モデル: 単体テスト必須
- ViewComponent: コンポーネントテスト作成
- システムテスト: 主要フローをカバー

## 🔐 認証・アクセス管理

### 1. 幹事認証（MVP版）

- **方式**: メールアドレス + パスワード認証（Rails 8標準認証）
- **将来**: Google認証・LINE認証への拡張を考慮した設計

### 2. 参加者アクセス管理

```ruby
# トークン有効期限：7日間
PARTICIPANT_TOKEN_EXPIRES_IN = 7.days

# app/models/concerns/token_authenticatable.rb
module TokenAuthenticatable
  extend ActiveSupport::Concern
  
  included do
    has_secure_token :edit_token
    
    scope :valid, -> { where('expires_at > ?', Time.current) }
  end
  
  def token_valid?
    expires_at > Time.current
  end
  
  private
  
  def set_expiration
    self.expires_at = 7.days.from_now
  end
end
```

## 📧 メール送信設定（SendGrid）

### 1. SendGrid導入

```ruby
# Gemfile
gem "sendgrid-ruby", "~> 6.7"

# .env.local（.gitignoreに追加）
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxx
SENDGRID_DOMAIN=eventpay.example.com
```

### 2. Rails設定

```ruby
# config/environments/production.rb
config.action_mailer.delivery_method = :sendgrid_actionmailer
config.action_mailer.sendgrid_actionmailer_settings = {
  api_key: ENV['SENDGRID_API_KEY'],
  raise_delivery_errors: true
}

config.action_mailer.default_url_options = { 
  host: ENV['APP_DOMAIN'] || 'eventpay.example.com',
  protocol: 'https'
}

config.action_mailer.default_options = {
  from: 'EventPay Manager <noreply@eventpay.example.com>'
}

# config/environments/development.rb
if ENV['USE_SENDGRID_IN_DEV'] == 'true'
  config.action_mailer.delivery_method = :sendgrid_actionmailer
  config.action_mailer.sendgrid_actionmailer_settings = {
    api_key: ENV['SENDGRID_API_KEY']
  }
else
  config.action_mailer.delivery_method = :letter_opener
end
```

### 3. メーラー実装

```ruby
# app/mailers/participant_mailer.rb
class ParticipantMailer < ApplicationMailer
  include SendGrid
  
  def registration_confirmation(participant)
    @participant = participant
    @event = participant.event
    @edit_url = edit_participant_url(token: participant.edit_token)
    
    # SendGridカテゴリ（分析用）
    headers['X-SMTPAPI'] = {
      category: ['registration', "event_#{@event.id}"]
    }.to_json
    
    mail(
      to: @participant.email,
      subject: "【#{@event.name}】参加登録完了のお知らせ"
    )
  end
  
  def payment_reminder(participation)
    @participant = participation.participant
    @round = participation.round
    @event = @round.event
    
    headers['X-SMTPAPI'] = {
      category: ['reminder'],
      unique_args: {
        event_id: @event.id,
        round_id: @round.id
      }
    }.to_json
    
    mail(
      to: @participant.email,
      subject: "【#{@event.name}】#{@round.name}の参加費お支払いについて"
    )
  end
end
```

### 4. メールテンプレート

```erb
<%# app/views/participant_mailer/registration_confirmation.html.erb %>
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #333;"><%= @event.name %></h2>
  
  <p><%= @participant.name %> 様</p>
  
  <p>イベントへの参加登録ありがとうございます。</p>
  
  <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
    <h3 style="margin-top: 0;">参加内容</h3>
    <% @participant.participations.includes(:round).each do |participation| %>
      <p>
        <strong><%= participation.round.name %></strong><br>
        時間: <%= participation.round.start_time.strftime("%H:%M") %>〜<br>
        会場: <%= participation.round.venue %><br>
        参加費: ¥<%= number_with_delimiter(participation.round.fee) %>
      </p>
    <% end %>
  </div>
  
  <p>
    参加内容の確認・変更は以下のURLから行えます：<br>
    <%= link_to @edit_url, @edit_url, style: "color: #007bff;" %>
  </p>
  
  <hr style="border: none; border-top: 1px solid #dee2e6; margin: 30px 0;">
  
  <p style="color: #6c757d; font-size: 12px;">
    このメールは EventPay Manager から自動送信されています。
  </p>
</div>
```

## 🚀 開発の始め方

```bash
# 1. コンテナ起動
docker-compose up -d

# 2. コンソール接続
docker-compose exec web bash

# 3. 開発サーバー起動（コンテナ内で）
bin/rails server -b 0.0.0.0

# 4. テスト実行
docker-compose exec web rspec

# 5. コンポーネントカタログ確認
# http://localhost:3000/lookbook
```

## 📝 チェックリスト

- [ ] Dockerコンテナが正常に起動する
- [ ] PostgreSQLに接続できる
- [ ] Bootstrapのスタイルが適用される
- [ ] ViewComponentが正しく表示される
- [ ] タイムゾーンがJSTになっている
- [ ] 日本語エラーメッセージが表示される
- [ ] letter_openerでメール確認できる（開発環境）
- [ ] SendGrid APIキーが設定されている（本番環境）

---

*最終更新: 2025年1月*
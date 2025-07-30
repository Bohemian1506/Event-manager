# EventPay Manager - セットアップガイド

## 必要な環境

- Docker & Docker Compose
- Git

## 初回セットアップ

### 1. リポジトリクローン
```bash
git clone [repository-url]
cd eventpay_manager
```

### 2. 環境変数設定
```bash
# .env.local を作成
cp .env.example .env.local

# 以下の値を設定
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxx
APP_DOMAIN=localhost:3000
```

### 3. Docker環境構築
```bash
# コンテナビルド・起動
docker-compose up -d

# データベース作成
docker-compose exec web rails db:create

# マイグレーション実行
docker-compose exec web rails db:migrate

# 初期データ投入（必要に応じて）
docker-compose exec web rails db:seed
```

### 4. 動作確認
- ブラウザで http://localhost:3000 にアクセス
- 正常に画面が表示されることを確認

## 日常的な開発コマンド

### Docker操作
```bash
# 起動
docker-compose up -d

# 停止
docker-compose down

# ログ確認
docker-compose logs -f web

# コンテナ内でコマンド実行
docker-compose exec web [command]
```

### データベース操作
```bash
# マイグレーション作成
docker-compose exec web rails generate migration CreateEvents

# マイグレーション実行
docker-compose exec web rails db:migrate

# ロールバック
docker-compose exec web rails db:rollback

# リセット（危険）
docker-compose exec web rails db:drop db:create db:migrate
```

### Rails操作
```bash
# サーバー起動（通常はdocker-composeで自動起動）
docker-compose exec web rails server

# コンソール起動
docker-compose exec web rails console

# ルート確認
docker-compose exec web rails routes

# ジェネレーター実行例
docker-compose exec web rails generate controller Events
docker-compose exec web rails generate model Event name:string date:date
```

### テスト実行
```bash
# 全テスト
docker-compose exec web bundle exec rspec

# 特定のファイル
docker-compose exec web bundle exec rspec spec/models/event_spec.rb

# 特定のテストケース
docker-compose exec web bundle exec rspec spec/models/event_spec.rb:10

# カバレッジ付き実行
docker-compose exec web COVERAGE=true bundle exec rspec
```

### コード品質チェック
```bash
# RuboCop実行
docker-compose exec web bundle exec rubocop

# 自動修正
docker-compose exec web bundle exec rubocop -A

# 特定ファイルのみ
docker-compose exec web bundle exec rubocop app/models/event.rb
```

## 開発環境設定

### VSCode設定（推奨）
```json
// .vscode/settings.json
{
  "ruby.rubocop.useBundler": true,
  "ruby.format": "rubocop",
  "files.associations": {
    "*.html.erb": "erb"
  }
}
```

### 推奨拡張機能
- Ruby
- Ruby Solargraph
- ERB Formatter/Beautify
- Stimulus LSP

## トラブルシューティング

### よくある問題と解決方法

#### 1. データベース接続エラー
```bash
# PostgreSQLコンテナが起動しているか確認
docker-compose ps

# データベースを再作成
docker-compose exec web rails db:drop db:create db:migrate
```

#### 2. Gemインストールエラー
```bash
# bundleキャッシュをクリア
docker-compose exec web bundle install --redownload

# Gemfile.lockを削除して再インストール
rm Gemfile.lock
docker-compose build --no-cache web
```

#### 3. アセットの問題
```bash
# アセットプリコンパイル
docker-compose exec web rails assets:precompile

# キャッシュクリア
docker-compose exec web rails tmp:clear
```

#### 4. メール送信テスト（開発環境）
```bash
# letter_openerでメール確認
# 送信後、http://localhost:3000/letter_opener にアクセス
```

#### 5. パフォーマンス問題
```bash
# Bulletでn+1問題を検出
# 開発環境で自動的に警告が表示される

# プロファイリング
docker-compose exec web rails runner "puts Rails.application.routes.recognize_path('/events')"
```

## 本番環境デプロイ

### 環境変数設定（本番）
```bash
RAILS_ENV=production
SECRET_KEY_BASE=[generated_key]
DATABASE_URL=postgresql://user:password@host:port/database
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxx
APP_DOMAIN=your-domain.com
```

### デプロイコマンド
```bash
# アセットプリコンパイル
RAILS_ENV=production rails assets:precompile

# マイグレーション
RAILS_ENV=production rails db:migrate

# サーバー起動
RAILS_ENV=production rails server
```

## 開発tips

### よく使用するRailsコマンド
```bash
# モデル作成（マイグレーションも同時作成）
rails generate model Event name:string date:date description:text

# コントローラー作成
rails generate controller Events index show new create edit update destroy

# ViewComponent作成
rails generate component ParticipantCard participant

# マイグレーション単体作成
rails generate migration AddTokenToParticipants token:string
```

### デバッグ方法
```ruby
# binding.pryを使用したデバッグ
def show
  binding.pry  # ここで処理が停止
  @event = Event.find(params[:id])
end

# ログ出力
Rails.logger.debug "Event: #{@event.inspect}"

# コンソールでのデバッグ
Event.find(1)
User.create(email: 'test@example.com', password: 'password')
```

### パフォーマンス最適化
```ruby
# N+1問題の解決
Event.includes(:rounds, :participants).find(params[:id])

# カウンタキャッシュ
class Round < ApplicationRecord
  belongs_to :event, counter_cache: true
end

# インデックス追加
add_index :participants, :edit_token
add_index :events, :share_token
```
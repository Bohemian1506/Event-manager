#!/bin/bash

echo "EventPay Manager のセットアップを開始します..."

# Dockerコンテナでrails newを実行
echo "Railsアプリケーションを生成中..."
docker-compose run --rm web rails new . --force --no-deps --database=postgresql --skip-bundle

# Gemfileを上書き（既に作成済みのものを使用）
echo "Gemfileを設定中..."

# Bundle install
echo "Gem をインストール中..."
docker-compose run --rm web bundle install

# データベース設定ファイルを更新
echo "データベース設定を更新中..."
cat > config/database.yml << 'EOF'
default: &default
  adapter: postgresql
  encoding: unicode
  pool: <%= ENV.fetch("RAILS_MAX_THREADS") { 5 } %>
  username: eventpay_user
  password: password
  host: db

development:
  <<: *default
  database: eventpay_manager_development

test:
  <<: *default
  database: eventpay_manager_test

production:
  <<: *default
  database: eventpay_manager_production
  username: eventpay_manager
  password: <%= ENV["EVENTPAY_MANAGER_DATABASE_PASSWORD"] %>
EOF

# データベースの作成
echo "データベースを作成中..."
docker-compose run --rm web rails db:create

echo "基本セットアップが完了しました！"
echo "次のコマンドでサーバーを起動してください："
echo "docker-compose up"

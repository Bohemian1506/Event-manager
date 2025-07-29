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

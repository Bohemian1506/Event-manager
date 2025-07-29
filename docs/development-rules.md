# EventPay Manager - 開発ルール

## コーディング規約

### Ruby
- **RuboCop準拠**: デフォルト設定に従う
- **インデント**: 2スペース
- **文字列**: シングルクォート推奨（補間が必要な場合はダブルクォート）
- **メソッド名**: snake_case
- **定数**: SCREAMING_SNAKE_CASE

### CSS
- **BEM記法 + Bootstrapユーティリティ**: コンポーネント単位でのスタイル管理
- **ファイル名**: snake_case（例：`participant_card.scss`）
- **クラス名**: kebab-case（例：`participant-card`）

### JavaScript (Stimulus)
- **コントローラー名**: snake_case（例：`participant_form_controller.js`）
- **アクション名**: camelCase（例：`submitForm`）
- **データ属性**: kebab-case（例：`data-participant-form-target`）

### テスト
- **RSpec**: 単体・統合テスト
- **FactoryBot**: テストデータ作成
- **Faker**: ダミーデータ生成

## 命名規則

### データベース・モデル
- **モデル**: 単数形、PascalCase（Event, Participant）
- **テーブル**: 複数形、snake_case（events, participants）
- **外部キー**: `{model}_id`（例：`user_id`, `event_id`）
- **カラム**: snake_case（例：`created_at`, `share_token`）

### ファイル・ディレクトリ
- **コントローラー**: 複数形、snake_case（例：`events_controller.rb`）
- **ビュー**: リソース名/アクション名（例：`events/show.html.erb`）
- **ViewComponent**: ComponentSuffix（例：`ParticipantCardComponent`）
- **Stimulus**: snake_case + `_controller`（例：`participant_form_controller.js`）

## ファイル構成ルール

### アプリケーション構造
```
app/
├── components/              # ViewComponent
│   ├── {name}_component.rb
│   └── {name}_component.html.erb
├── controllers/
│   └── {resource}s_controller.rb
├── models/
│   └── {model}.rb
├── views/
│   └── {resource}s/
│       ├── index.html.erb
│       ├── show.html.erb
│       └── _form.html.erb
└── assets/
    ├── stylesheets/
    │   ├── application.scss
    │   ├── base/               # 基本設定
    │   ├── components/         # ViewComponent用
    │   ├── pages/              # ページ固有
    │   └── utilities/          # ユーティリティ
    └── javascripts/
        └── controllers/        # Stimulusコントローラー
```

### テスト構造
```
spec/
├── models/
├── controllers/
├── components/
├── features/                   # 統合テスト
└── support/
    ├── factory_bot.rb
    └── capybara.rb
```

## 開発フロー

### 1. 機能実装
1. ブランチ作成（`feature/feature-name`）
2. モデル・マイグレーション作成
3. コントローラー・ビュー実装
4. ViewComponent作成（必要に応じて）
5. ルーティング設定
6. **作業サマリー作成**: Issue完了時に必ず作業サマリーを作成

### 2. テスト作成・実行
```bash
# モデルテスト
docker-compose exec web bundle exec rspec spec/models/

# コントローラーテスト
docker-compose exec web bundle exec rspec spec/controllers/

# 統合テスト
docker-compose exec web bundle exec rspec spec/features/

# 全テスト実行
docker-compose exec web bundle exec rspec
```

### 3. コード品質チェック
```bash
# RuboCop実行
docker-compose exec web bundle exec rubocop

# 自動修正
docker-compose exec web bundle exec rubocop -A

# 特定ファイルのみ
docker-compose exec web bundle exec rubocop app/models/event.rb
```

### 4. 動作確認
```bash
# 開発サーバー起動
docker-compose up -d

# ログ確認
docker-compose logs -f web

# コンソール起動
docker-compose exec web rails console
```

### 5. 作業サマリー作成
```bash
# テンプレートをコピーして作業サマリー作成
cp docs/work-summary/TEMPLATE.md docs/work-summary/$(date +%Y-%m-%d).md

# または特定のIssue用
cp docs/work-summary/TEMPLATE.md docs/work-summary/$(date +%Y-%m-%d)-issue-XX.md
```

## 重要な実装ポイント

### 認証実装
- **幹事**: Rails 8標準認証（`has_secure_password`）
- **参加者**: カスタムトークン認証（7日間有効）

```ruby
# 幹事認証
class User < ApplicationRecord
  has_secure_password
  validates :email, presence: true, uniqueness: true
end

# 参加者認証
class Participant < ApplicationRecord
  before_create :generate_edit_token
  
  private
  
  def generate_edit_token
    self.edit_token = SecureRandom.urlsafe_base64(32)
    self.expires_at = PARTICIPANT_TOKEN_EXPIRES_IN.from_now
  end
end
```

### セキュリティ
- **トークン**: 暗号化して保存、URL安全文字列使用
- **メール検証**: 適切なバリデーション
- **CSRF保護**: Rails標準機能を活用
- **環境変数**: 機密情報は`.env`で管理

### パフォーマンス
- **N+1クエリ対策**: `includes`を適切に使用
- **インデックス**: 検索に使用するカラムに設定
- **ViewComponent**: メモ化でレンダリング最適化

```ruby
# N+1対策例
def show
  @event = Event.includes(rounds: :participations).find(params[:id])
end

# ViewComponentでのメモ化
class ParticipantCardComponent < ViewComponent::Base
  private
  
  def participant_status
    @participant_status ||= calculate_status
  end
end
```

## ViewComponent実装ガイド

### 基本構造
```ruby
# app/components/participant_card_component.rb
class ParticipantCardComponent < ViewComponent::Base
  def initialize(participant:, show_edit_link: false)
    @participant = participant
    @show_edit_link = show_edit_link
  end

  private

  attr_reader :participant, :show_edit_link

  def card_classes
    classes = %w[participant-card card mb-3]
    classes << 'border-success' if participant.paid?
    classes.join(' ')
  end
end
```

### テンプレート
```erb
<!-- app/components/participant_card_component.html.erb -->
<div class="<%= card_classes %>">
  <div class="card-body">
    <h6 class="card-title"><%= participant.name %></h6>
    <p class="card-text">
      <%= participant.email %>
      <%= render PaymentStatusComponent.new(participant: participant) %>
    </p>
    <% if show_edit_link %>
      <%= link_to "編集", participant_edit_path(token: participant.edit_token), 
                  class: "btn btn-sm btn-outline-primary" %>
    <% end %>
  </div>
</div>
```

## 作業サマリー作成ガイド

### 作成タイミング
- **Issue完了時**: 必須
- **大きな作業の区切り時**: 推奨  
- **セッション終了時**: 必須
- **機能実装完了時**: 必須

### ファイル命名規則
```bash
# 基本形式
docs/work-summary/YYYY-MM-DD.md

# Issue固有の場合
docs/work-summary/YYYY-MM-DD-issue-XX.md

# 機能固有の場合  
docs/work-summary/YYYY-MM-DD-feature-name.md
```

### 必須記録項目
1. **作業概要**: タイトル・日時・所要時間
2. **実施内容**: 完了タスク・ファイル変更
3. **技術的成果**: 新機能・改善点
4. **ドキュメント更新**: 追加・変更内容
5. **残課題**: 未完了・次回作業
6. **学習・気づき**: 新しい発見・改善案

### サマリー活用方法
- **次回作業開始時**: 前回サマリーを確認
- **進捗報告**: プロジェクト状況の把握
- **振り返り**: 効率改善のための分析
- **引き継ぎ**: 他の開発者への情報共有

### Claude Code対応
- **自動作成**: Issue完了時に自動でサマリーファイル生成
- **テンプレート使用**: 一貫性のある形式で記録
- **詳細記録**: 実行したコマンド・変更ファイルを漏れなく記載

## Git運用

### ブランチ戦略
- **main**: 本番環境
- **develop**: 開発環境
- **feature/**: 機能開発
- **fix/**: バグ修正

### コミットメッセージ
```
feat: 参加者登録機能を追加
fix: 支払い状況更新時のバグを修正
style: RuboCopの警告を修正
test: イベント作成のテストを追加
```

### .gitignore追加項目
```gitignore
# Rails標準 + 追加
/config/master.key
/config/credentials.yml.enc
.env*
/tmp/*
/log/*
.DS_Store
/coverage/
```
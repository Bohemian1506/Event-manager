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
- **GitHub CLI**: gh コマンド（PR作成・管理、Issue作成・テンプレート利用）

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
- **[GitHub環境構築](docs/github-setup.md)** - GitHub CLI セットアップ、認証設定
- **[GitHubワークフロー](docs/github-workflow.md)** - Issue、PR、マージの基本フロー
- **[Claude Code自動ワークフロー](docs/claude-code-workflow.md)** - 自動化手順、PRサマリー作成
- **[AI開発ルール](docs/ai-development-rules.md)** - 複数AI協調開発、zen-mcp-server運用ガイド
- **[画面遷移図](docs/screen-flow.md)** - 全画面の遷移とユーザーフロー
- **[Issueテンプレート](docs/issue-templates.md)** - GitHub Issue作成、MVP以降実装ロードマップ

## 重要ポイント
- **幹事認証**: Rails 8標準認証（has_secure_password）
- **参加者認証**: トークンベース（7日間有効、登録不要）
- **セキュリティ**: トークン暗号化、CSRF保護
- **パフォーマンス**: N+1対策、適切なインデックス設定

## AI協調開発環境
複数AIを活用した高品質な開発のため、**zen-mcp-server**を使用：
- **[zen-mcp-setup.md](docs/zen-mcp-setup.md)** - セットアップガイド
- **[zen-mcp-workflow.md](docs/zen-mcp-workflow.md)** - 実践的な使用例
- **[ai-development-rules.md](docs/ai-development-rules.md)** - AI協調開発ルール


# important-instruction-reminders
## zen-mcp-server 自動提案システム

zen-mcp-serverを使った複数AI協調開発を促進するため、以下の条件で自動的にツール使用を提案してください：

### 必須提案条件（強く推奨）
**新機能実装・設計時**:
「新機能の実装では複数AIによる設計検討が効果的です。/consensusで設計合意を形成しませんか？」

**コミット前・PR作成時**:
「コミット前の品質チェックを実行します。/precommitで包括的なチェックを行いませんか？」

**セキュリティ関連コード**:
「セキュリティに関わるコードです。/secauditでセキュリティ監査を実行しませんか？」

**複雑なバグ・エラー報告**:
「複雑な問題の根本原因分析が必要です。/debugで詳細分析を実行しませんか？」

### 推奨提案条件
**コード実装完了後**:
「実装完了後のコードレビューが推奨されます。/codereviewで包括的なレビューを実行しますか？」

**アーキテクチャ変更後**:
「アーキテクチャ変更の影響分析を行います。/analyzeで詳細分析を実行しませんか？」

**リファクタリング検討時**:
「リファクタリングの最適な方針を検討します。/refactorで改善提案を実行しませんか？」

**テスト作成時**:
「包括的なテストケース生成を行います。/testgenでテスト生成を実行しませんか？」

### 提案形式
```
🤖 複数AI協調開発の提案

この[タスク内容]では複数AIによる[分析種別]が効果的です。
[ツール名]で[具体的な内容]を実行しませんか？

実行する場合は「yes」または「y」と入力してください。
```

### 提案タイミング
- ユーザーがタスクを完了した直後
- 特定のキーワード（新機能、バグ、コミット、セキュリティ等）を検知した時
- ファイルを大幅に変更・作成した後
- 複雑な実装が完了した時

この指示により、開発の要所で適切なzen-mcp-serverツールが自動提案され、高品質な複数AI協調開発が実現されます。


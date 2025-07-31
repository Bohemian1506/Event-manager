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
- **[開発ルール](docs/setup/development-rules.md)** - コーディング規約、命名規則、実装ガイド
- **[セットアップガイド](docs/setup/setup.md)** - 環境構築、開発コマンド、トラブルシューティング
- **[GitHub環境構築](docs/workflows/github-setup.md)** - GitHub CLI セットアップ、認証設定
- **[GitHubワークフロー](docs/workflows/github-workflow.md)** - Issue、PR、マージの基本フロー
- **[Claude Code自動ワークフロー](docs/workflows/claude-code-workflow.md)** - 自動化手順、PRサマリー作成
- **[AI開発ルール](docs/ai-development/ai-development-rules.md)** - 複数AI協調開発、zen-mcp-server運用ガイド
- **[画面遷移図](docs/specifications/screen-flow.md)** - 全画面の遷移とユーザーフロー
- **[Issueテンプレート](docs/workflows/issue-templates.md)** - GitHub Issue作成、MVP以降実装ロードマップ

## 重要ポイント
- **幹事認証**: Rails 8標準認証（has_secure_password）
- **参加者認証**: トークンベース（7日間有効、登録不要）
- **セキュリティ**: トークン暗号化、CSRF保護
- **パフォーマンス**: N+1対策、適切なインデックス設定

## AI協調開発環境
複数AIを活用した高品質な開発のため、**zen-mcp-server**を使用：
- **[zen-mcp-setup.md](docs/ai-development/zen-mcp-setup.md)** - セットアップガイド
- **[zen-mcp-workflow.md](docs/ai-development/zen-mcp-workflow.md)** - 実践的な使用例
- **[ai-development-rules.md](docs/ai-development/ai-development-rules.md)** - AI協調開発ルール

## 作業アーカイブ自動化
プルリクエスト作成後に作業内容を自動でアーカイブ保存：

### 自動アーカイブ機能
- **GitHub Actions**: `.github/workflows/archive-creation.yml`
- **実行スクリプト**: `scripts/create-archive.js`
- **コマンド**: `npm run archive:create`
- **保存先**: `docs/archives/YYYY-MM-DD.md`

### アーカイブ内容
- 作業概要とブランチ情報
- 変更ファイル一覧とカテゴリ分析
- Git操作記録
- 技術的成果と実装内容
- 使用したワークフローと品質チェック


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

## Claude Code PR本文自動生成ルール

### PR本文生成の基本方針
1. **EventPay Manager固有の文脈理解**: Rails 8.0 + PostgreSQL + Bootstrap環境での開発
2. **初学者配慮**: 技術的詳細も分かりやすく説明
3. **品質重視**: レビュー観点とテスト項目を明確に提示
4. **プロジェクト整合性**: 既存のコーディング規約と命名規則に準拠

### PR本文構成テンプレート
```markdown
## ✨ 変更概要
[実装した機能・修正内容の目的と概要を初学者にも理解できるよう説明]

## 📋 主要な変更
- [ファイル名]: [具体的な変更内容と理由]
- [ファイル名]: [具体的な変更内容と理由]

## 🛠️ 技術的詳細
### 実装方法
[使用した技術・ライブラリ・アプローチの説明]

### 設計判断
[なぜこの実装方法を選択したかの理由]

### Rails 8.0 対応
[Rails 8.0の標準機能や新機能の活用について]

## 🧪 テスト観点
- [ ] 基本機能の動作確認
- [ ] エラーハンドリングの確認
- [ ] パフォーマンス影響の確認
- [ ] セキュリティ観点の確認
- [ ] Docker環境での動作確認

## 🔍 レビュー観点
### 優先度高
[必ず確認すべき重要なポイント]

### 設計・アーキテクチャ
[設計判断やアーキテクチャ変更について]

### セキュリティ
[認証・認可・データ保護に関する変更]

## 📚 関連ドキュメント
- 開発ルール: [docs/setup/development-rules.md](docs/setup/development-rules.md)
- 画面遷移: [docs/specifications/screen-flow.md](docs/specifications/screen-flow.md)

## 🤖 AI協調開発
この本文はClaude Codeにより自動生成されました。
- 詳細質問: @claude をメンション
- 包括的レビュー: zen-mcp-server `/codereview` 推奨
- セキュリティ監査: 認証関連変更時は `/secaudit` 推奨
```

### 生成時の注意事項
1. **ファイル変更の文脈理解**: 単なるファイル名列挙ではなく、変更の意図と影響を分析
2. **EventPay Manager業務理解**: 飲み会管理アプリとしての機能要件を考慮
3. **技術スタック整合性**: Ruby 3.3.6, Rails 8.0, PostgreSQL 15環境での適切な実装
4. **初学者配慮**: 複雑な概念は段階的に説明
5. **品質保証**: テスト項目とレビュー観点を具体的に提示

## Claude Code 作業開始ワークフロー

### ⚠️ 重要：手動実行が必要
**現在、Claude Codeのフック機能は未サポートのため、作業開始時の自動化は動作しません。**  
以下のコマンドを**手動で実行**してください。

#### 1. 作業開始コマンド（必須）
```bash
# 作業開始準備を実行
npm run work:start
```

#### 2. 実行内容
- **git:update**: mainブランチを最新化
- **dev:branch**: 対話式でブランチタイプとタスク名を入力してブランチ作成
- **初期設定**: 空コミット作成とリモートプッシュ
- **ガイダンス**: AI協調開発のヒント表示

#### 3. 代替実行方法
```bash
# 個別実行も可能
npm run git:update  # mainブランチ最新化
npm run dev:branch  # ブランチ作成
```

#### 4. 作業開始チェックリスト
- [ ] `npm run work:start` を実行
- [ ] ブランチタイプを選択（feature/fix/refactor等）
- [ ] タスク名をkebab-caseで入力
- [ ] 新ブランチでの作業開始を確認

### 設定ファイル（参考）
- `.claude/hooks.json`: フック設定（未サポート）
- `.claude/settings.json`: 自動化設定（未サポート）
- `package.json`: work:startコマンド定義（利用可能）

### 効果と目的
1. **品質向上**: 常に最新のmainブランチから作業開始
2. **標準化**: 統一されたブランチ命名規則の徹底
3. **効率化**: 対話式ブランチ作成で手順簡素化
4. **AI協調促進**: zen-mcp-server連携のガイダンス表示

## Claude Code 作業完了ワークフロー

### ⚠️ 重要：手動実行が必要
**現在、Claude Codeのフック機能は未サポートのため、作業完了時の自動提案は動作しません。**  
実装完了後は以下のコマンドを**手動で実行**してください。

#### 1. 作業完了コマンド（必須）
```bash
# 対話式コミット・プッシュを実行
npm run dev:commit
```

#### 2. 実行内容
- **ファイルステージング**: 変更ファイルの選択
- **コミットタイプ選択**: feat/fix/refactor等を選択
- **コミットメッセージ入力**: 詳細なメッセージを入力
- **自動プッシュ**: リモートリポジトリへの反映

#### 3. 作業完了チェックリスト
- [ ] 実装・テストが完了
- [ ] `npm run dev:commit` を実行
- [ ] コミットタイプを適切に選択
- [ ] 分かりやすいコミットメッセージを入力
- [ ] プッシュ完了を確認

#### 4. 推奨ワークフロー
```bash
# 1. 実装作業完了後
# ... ファイル編集完了 ...

# 2. 手動でコミット実行
npm run dev:commit

# 3. GitHub Actionsで自動実行される内容
# - PR自動作成（draft mode）
# - アーカイブ自動生成

# 4. PR確認・レビュー依頼
# - GitHubでPRを確認
# - @claude をメンションしてレビュー依頼
```

#### 5. 代替実行方法
```bash
# 従来のgitコマンドでも可能
git add .
git commit -m "feat: 実装内容の説明"
git push
```

### 設定ファイル（参考）
- `.claude/hooks.json`: フック設定（未サポート）
- `.claude/settings.json`: 自動化設定（未サポート）
- `package.json`: dev:commitコマンド定義（利用可能）

### GitHub Actions自動化（動作中）
- **PR自動作成**: プッシュ時にdraftモードでPR作成
- **アーカイブ生成**: PR作成後の作業サマリー自動保存
- **品質チェック**: CI/CDパイプラインでの自動テスト

### 効果と目的
1. **品質向上**: 対話式コミットによる統一されたメッセージ形式
2. **効率化**: PR自動作成までの一連の流れをサポート
3. **追跡性**: アーカイブ自動生成による作業履歴管理
4. **協調開発**: @claudeメンションによるレビュー依頼フロー

## Claude Code 非対話形式コマンド

Claude Codeから直接ブランチ作成を行うための非対話形式コマンドを提供しています。

### 作業開始（CLI版）
```bash
# 作業開始を一括実行（mainブランチ更新 → ブランチ作成 → 初期設定）
npm run work:start:cli <type> <task-name>

# 例
npm run work:start:cli feature add-user-authentication
npm run work:start:cli fix resolve-payment-issue
npm run work:start:cli docs update-readme
```

### ブランチ作成のみ（CLI版）
```bash
# ブランチ作成のみを実行
npm run dev:branch:cli <type> <task-name>

# 例
npm run dev:branch:cli refactor improve-performance
npm run dev:branch:cli test add-unit-tests
```

### 利用可能なブランチタイプ
- `feature`: 新機能開発
- `fix`: バグ修正
- `refactor`: リファクタリング
- `docs`: ドキュメント更新
- `test`: テスト追加・修正
- `chore`: その他の作業

### Claude Codeでの推奨ワークフロー
```bash
# 1. 作業開始（非対話形式）
npm run work:start:cli feature implement-qr-code

# 2. 実装作業
# ... ファイル編集 ...

# 3. コミット（対話形式）
npm run dev:commit

# 4. PR作成はGitHub Actionsで自動実行
```


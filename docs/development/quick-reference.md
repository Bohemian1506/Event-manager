# EventPay Manager - 開発クイックリファレンス

開発時によく使うコマンドと情報をまとめています。

## 🚀 作業開始・完了コマンド

### セッション開始
```bash
# 新しいセッション開始（自動mainブランチ更新）
npm run session:start

# セッション初期化（シンプル版）
npm run session:init

# 手動でmainブランチ切り替え（post-checkout hook自動実行）
git checkout main
```

### 作業開始
```bash
# Claude連携型スマートワークフロー（推奨）
npm run work:start

# 非対話式（Claude Code推奨）
npm run work:start:cli <type> <task-name>

# 手動操作
npm run work:start:manual    # 旧CLI版
npm run work:start:interactive  # 対話式

# 例
npm run work:start:cli feature add-user-authentication
npm run work:start:cli fix resolve-payment-issue
npm run work:start:cli docs update-readme
```

### 作業完了
```bash
# スマートコミット（推奨）
npm run dev:commit

# 手動コミット
npm run dev:commit:manual

# プッシュのみ
npm run dev:push
```

## 🎯 ブランチタイプ
- `feature`: 新機能開発
- `fix`: バグ修正
- `refactor`: リファクタリング
- `docs`: ドキュメント更新
- `test`: テスト追加・修正
- `chore`: その他の作業

## 📋 よく使うコマンド

### 開発環境
```bash
# Docker起動
docker-compose up -d

# DB作成・マイグレーション
docker-compose exec web rails db:create
docker-compose exec web rails db:migrate

# 依存関係インストール
docker-compose exec web bundle install
npm install

# アプリ確認
# http://localhost:3000
```

### Git操作
```bash
# mainブランチ最新化
npm run git:update

# マージ済みブランチ削除
npm run git:clean

# ブランチ作成のみ
npm run dev:branch:cli <type> <task-name>
npm run dev:branch  # 対話式

# Git hooks設定
npm run hooks:install

# セッション管理
npm run session:start  # mainブランチ切り替え+最新化
npm run session:init   # シンプルな初期化
```

### 品質チェック
```bash
# コード品質・テスト実行
npm run quality:check
# 実行内容: rubocop + rspec

# セキュリティスキャン
npm run security:scan
# 実行内容: brakeman --no-pager

# CSSビルド
npm run build:css
```

### PR・アーカイブ
```bash
# PR作成（Claude Code活用）
npm run pr:create

# PR本文更新（Claude Code活用）
npm run pr:update

# アーカイブ作成
npm run archive:create
```

## 🤖 AI協調開発

### zen-mcp-server連携
```bash
# 新機能設計検討
/consensus

# コミット前品質チェック
/precommit

# セキュリティ監査
/secaudit

# バグ分析
/debug

# コードレビュー
/codereview

# リファクタリング提案
/refactor
```

### Claude Code活用
- PR作成・更新: `@claude` メンション
- 高品質PR本文自動生成
- 技術的質問・実装相談

## 🔧 トラブルシューティング

### よくある問題
```bash
# Dockerコンテナ再起動
docker-compose down && docker-compose up -d

# DBリセット（全データ削除注意）
docker-compose exec web rails db:drop db:create db:migrate

# 依存関係更新
docker-compose exec web bundle install
npm install

# CSSビルドエラー
npm run build:css

# コンテナ再ビルド（イメージ更新時）
docker-compose build --no-cache
```

### ログ確認
```bash
# アプリケーションログ
docker-compose logs web
docker-compose logs -f web  # リアルタイム追跡

# データベースログ
docker-compose logs db

# 全サービスログ
docker-compose logs

# Railsコンソール
docker-compose exec web rails console

# DBコンソール
docker-compose exec web rails dbconsole
```

## 🎯 開発フロー

### 基本フロー
1. **作業開始**: `npm run work:start:cli <type> <task-name>`
2. **実装・テスト**: コード編集、動作確認
3. **品質チェック**: `npm run quality:check`
4. **コミット**: `npm run dev:commit`
5. **PR作成**: `npm run pr:create` または GitHub Actions自動作成
6. **レビュー**: `@claude` メンションで依頼
7. **マージ**: レビュー完了後、mainへマージ

### 品質管理フロー
- **コード品質**: rubocop-rails-omakase
- **テスト**: rspec + factory_bot + faker
- **セキュリティ**: brakeman監査
- **AIサポート**: zen-mcp-server `/precommit`

---

## 🚀 クイックスタート

```bash
# 1. 作業開始
npm run work:start:cli docs update-readme

# 2. 開発環境起動
docker-compose up -d

# 3. 品質チェック
npm run quality:check

# 4. コミット・プッシュ
npm run dev:commit

# 5. PR作成
npm run pr:create
```

---

💡 **Tips**: 
- 開発時は常にこのドキュメントを参照
- 新しいコマンドを追加したらここにも記載
- 不明点は`@claude`に質問

## 🔄 セッション管理機能

### 自動mainブランチ更新
新しいセッション開始時に自動でmainブランチを最新化する機能が実装されています。

#### Git Post-Checkout Hook
- mainブランチに切り替える際、自動的に最新のコミットをチェック
- リモートに新しいコミットがある場合、安全に自動更新実行
- 未コミット変更がある場合は警告表示

#### セッション開始コマンド
```bash
# 推奨: 完全なセッション開始
npm run session:start

# シンプル: 基本的な初期化のみ
npm run session:init

# 手動: Git hook自動実行
git checkout main
```

#### 動作フロー
1. `git checkout main` 実行
2. post-checkout hook が自動起動
3. リモートから最新情報をフェッチ
4. ローカルとリモートの差分をチェック
5. 安全に自動更新または警告表示

---

🆙 **最新更新**: 2025-07-31 - READMEと重複する技術スタック・アーキテクチャ情報を削除し、実用コマンドに特化
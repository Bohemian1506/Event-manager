# EventPay Manager - 開発支援スクリプト

## 📋 利用可能なコマンド

### 🚀 作業開始自動化 (推奨)
```bash
npm run work:start
```
**機能**: 作業開始時に必要な処理を自動実行
- `npm run git:update`: mainブランチを最新化
- 対話式でブランチタイプとタスク名を入力
- 新しいブランチを自動作成・プッシュ
- 初期空コミットを自動実行

### 🔀 ブランチ管理
```bash
npm run dev:branch      # 対話式ブランチ作成
npm run git:update      # mainブランチ最新化
npm run git:clean       # マージ済みブランチ削除
```

### 📝 コミット・プッシュ
```bash
npm run dev:commit      # 対話式コミット
npm run dev:push        # 安全なプッシュ
npm run dev:pr          # 手動PR作成
npm run dev:setup       # ブランチ作成→コミット
```

### 🔍 品質チェック
```bash
npm run quality:check   # RuboCop + RSpec
npm run security:scan   # Brakeman実行
npm run hooks:install   # フック再インストール
```

## 🎯 推奨ワークフロー

### 新しい作業を開始する場合
```bash
# 1. 作業開始 (git:update + dev:branch を自動実行)
npm run work:start

# 2. コード実装
# ... ファイル編集 ...

# 3. コミット
npm run dev:commit

# 4. プルリクエストが自動作成される
```

### 既存ブランチで作業を続ける場合
```bash
# 1. ブランチに切り替え
git checkout feature/your-branch

# 2. コード実装
# ... ファイル編集 ...

# 3. コミット
npm run dev:commit
```

## 📚 各スクリプトの詳細

### work-start.js
- **目的**: 作業開始時の煩雑な手順を自動化
- **実行内容**:
  1. メインブランチへの移動・最新化
  2. 対話式ブランチ作成
  3. 初期コミット・リモートプッシュ
  4. 次のステップの案内

### create-branch.js
- **目的**: 統一されたブランチ命名規則でブランチ作成
- **対応タイプ**: feature, fix, refactor, docs, test, chore
- **自動実行**: 初期空コミット、リモートプッシュ

### auto-commit.js
- **目的**: コミットタイプの統一と自動プッシュ制御
- **機能**: コミットタイプ選択、自動プッシュオプション
- **連携**: post-commitフックとの連携

### auto-push.js
- **目的**: 安全なプッシュ実行
- **機能**: pre-pushフックによる品質チェック実行

## 🤖 AI協調開発との連携

各スクリプトは zen-mcp-server との連携を前提に設計されています：

- **新機能実装時**: `/consensus` で設計検討
- **コミット前**: `/precommit` で品質チェック
- **PR作成後**: @claude メンションでレビュー依頼

## ⚠️ 注意事項

1. **メインブランチ保護**: 直接コミット・プッシュは自動的に防止
2. **品質チェック**: pre-pushフックで自動実行
3. **対話式UI**: 一部のスクリプトは対話式入力が必要

## 🔧 トラブルシューティング

### スクリプトが実行できない場合
```bash
chmod +x scripts/*.js
npm run hooks:install
```

### Gitフックが動作しない場合
```bash
npm run hooks:install
```

### ブランチ作成に失敗する場合
```bash
git status
git stash  # 必要に応じて
npm run git:update
```
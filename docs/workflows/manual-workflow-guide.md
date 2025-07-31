# Claude Code 手動ワークフローガイド

## 概要
Claude Codeのフック機能が未サポートのため、EventPay Managerでは手動でのワークフロー実行が必要です。このガイドでは、効率的な開発フローを実現するための手順を説明します。

## 1. 作業開始フロー

### 作業開始コマンド
```bash
npm run work:start
```

### 実行内容詳細
1. **mainブランチ最新化**
   - `git checkout main`
   - `git pull origin main`

2. **対話式ブランチ作成**
   - ブランチタイプ選択（feature/fix/refactor/docs/test/chore）
   - タスク名入力（kebab-case形式）
   - 自動ブランチ名生成：`{type}/{task-name}`

3. **初期設定**
   - 空コミット作成
   - リモートへのプッシュ
   - ブランチ追跡設定

### 作業開始チェック項目
- [ ] Docker環境が起動中
- [ ] `npm run work:start` 実行完了
- [ ] 新ブランチが作成され、切り替わっている
- [ ] リモートブランチが作成されている

## 2. 実装フロー

### 開発作業
```bash
# Docker環境での作業
docker-compose up -d
docker-compose exec web rails s
```

### 実装中のベストプラクティス
1. **小さな単位でのコミット**
   - 機能単位での実装
   - テスト駆動開発の推奨

2. **コード品質の維持**
   - Rails規約に従った実装
   - ViewComponentの活用
   - 適切なテストの作成

3. **セキュリティ考慮**
   - CSRF保護の確認
   - 認証・認可の適切な実装
   - SQLインジェクション対策

## 3. 作業完了フロー

### 作業完了コマンド
```bash
npm run dev:commit
```

### 実行内容詳細
1. **ファイルステージング**
   - 変更ファイルの一覧表示
   - 選択的ステージング

2. **コミット作成**
   - コミットタイプ選択（feat/fix/refactor/docs/test/chore）
   - コミットメッセージ入力
   - Conventional Commits形式

3. **自動プッシュ**
   - リモートブランチへの反映
   - PR自動作成のトリガー

### 作業完了チェック項目
- [ ] 実装とテストが完了
- [ ] `npm run dev:commit` 実行完了
- [ ] 適切なコミットタイプを選択
- [ ] 分かりやすいコミットメッセージを入力
- [ ] プッシュが成功している

## 4. GitHub Actions自動化

### 自動実行される処理
1. **PR自動作成**
   - プッシュ時にdraftモードでPR作成
   - ブランチ名とコミットメッセージからタイトル生成

2. **アーカイブ生成**
   - PR作成後の作業サマリー自動保存
   - `docs/archives/` ディレクトリへの保存

3. **品質チェック**
   - CI/CDパイプラインでの自動テスト
   - RuboCop、RSpec、Brakemanの実行

### PR確認・レビュー
1. **GitHub PR確認**
   - 自動生成されたPRの内容確認
   - 変更ファイルとdiffの確認

2. **Claude Code レビュー依頼**
   - PRに `@claude` をメンション
   - 具体的なレビュー項目の指定

## 5. トラブルシューティング

### よくある問題と解決方法

#### mainブランチの更新失敗
```bash
# 手動でmainブランチを更新
git checkout main
git pull origin main
```

#### ブランチ作成失敗
```bash
# 手動でブランチ作成
git checkout -b feature/task-name
git push -u origin feature/task-name
```

#### コミット失敗
```bash
# 手動でコミット
git add .
git commit -m "feat: 実装内容の説明"
git push
```

#### PR作成失敗
```bash
# 手動でPR作成
gh pr create --draft --title "feat: 実装内容" --body "実装の詳細説明"
```

## 6. 効率化のコツ

### 作業開始時
- プロジェクト固有のテンプレートを活用
- 過去のコミットメッセージを参考にする
- zen-mcp-serverツールの積極的活用

### 実装中
- Hot Reloadを活用した効率的な開発
- テストファーストアプローチ
- 定期的なコミットでリスク軽減

### 作業完了時
- コミットメッセージの品質向上
- PRテンプレートの活用
- レビュー観点の明確化

## 7. zen-mcp-server連携

### 推奨ツール使用タイミング
- **新機能実装時**: `/consensus` で設計検討
- **コミット前**: `/precommit` で品質チェック
- **セキュリティ関連**: `/secaudit` でセキュリティ監査
- **複雑なバグ**: `/debug` で根本原因分析
- **実装完了後**: `/codereview` で包括的レビュー

### コスト最適化
- 適切なモデル選択（gemini-flash/o3/o3-pro）
- 段階的な品質チェック
- 必要に応じた複数AI協調開発

## まとめ
手動ワークフローでも、適切な手順とツールの活用により、高品質で効率的な開発が可能です。将来的なClaude Codeフック機能対応まで、このガイドを参考に開発を進めてください。
# EventPay Manager - Claude Code自動ワークフロー

## 🚨 作業開始時の自動実行手順（必須）
**すべての作業で以下の手順を自動実行する：**

### 1. メインブランチ最新化確認
```bash
# 現在のブランチ確認
git branch

# メインブランチに移動
git checkout main

# 最新状態に更新（重要！）
git pull origin main

# 状態確認
git status
```

### 2. 新しいブランチ作成
```bash
# 作業内容に基づいて適切なブランチ名で作成
git checkout -b feature/作業内容
# 例: feature/user-authentication
# 例: fix/email-validation-error
# 例: refactor/controller-optimization

# ブランチ作成確認
git branch
```

### 3. 作業完了後の自動実行
```bash
# ステージング・コミット
git add .
git commit -m "適切なコミットメッセージ"

# リモートプッシュ
git push -u origin ブランチ名

# プルリクエスト自動作成
gh pr create --title "適切なタイトル" --body "変更内容の説明"
```

## プルリクエストサマリー自動作成
**「サマリーの作成」を依頼された場合、以下のテンプレートを使用：**

```markdown
## 概要
[変更内容の概要を記述]

## 変更内容
- [ ] [実装した機能/修正した項目]
- [ ] [テストケース追加]
- [ ] [ドキュメント更新]

## テスト
- [ ] 単体テスト実行
- [ ] 統合テスト実行  
- [ ] 手動テスト完了
- [ ] RSpec・テストスイート全体実行

## チェックリスト
- [ ] RuboCop警告なし
- [ ] テストが通る
- [ ] 機能が正常に動作する
- [ ] セキュリティ要件確認
- [ ] パフォーマンス影響確認
- [ ] ドキュメントを更新（必要に応じて）

## 関連Issue
Closes #Issueナンバー
```

## 🛡️ 重要な自動化ルール
- **mainブランチでの直接作業は絶対禁止**
- **作業開始時は必ずメインブランチの最新化を実行**
- **ブランチ名は作業内容を明確に表現**
- **コミットメッセージは規約に従う（feat:, fix:, refactor:等）**
- **PR作成時は適切なタイトルと説明を自動生成**
- **作業完了後は必ずプッシュ・PR作成まで実行**

## Claude Codeへの指示例
```
❌ 悪い例: "ユーザー認証機能を実装してください"
✅ 良い例: "feature/user-authenticationブランチを作成して、ユーザー認証機能を実装し、PR作成までお願いします"

ただし、Claude Codeは指示されていなくても自動的にブランチを作成するため、
シンプルに "ユーザー認証機能を実装してください" でも適切に処理される
```

## 作業フロー（Claude Code統合版）
1. **mainブランチ最新化**: git pull origin main で最新状態を確保
2. **自動ブランチ作成**: 作業内容に基づいて適切な名前のブランチを作成
3. **機能実装**: 必要なファイルの作成・編集
4. **テスト作成**: 実装した機能のテスト追加
5. **コミット作成**: 適切なコミットメッセージでコミット
6. **プッシュ実行**: リモートブランチにプッシュ
7. **PR作成**: 適切なタイトル・説明でプルリクエスト作成
8. **作業サマリー作成**: 完了時に自動でサマリーファイルを生成

## 関連ドキュメント
- **[GitHub環境構築](github-setup.md)**: GitHub CLI セットアップ、認証設定
- **[GitHubワークフロー](github-workflow.md)**: Issue、PR、マージの基本フロー
- **[開発ルール](development-rules.md)**: コーディング規約、作業サマリー作成
- **[AI開発ルール](ai-development-rules.md)**: 複数AI協調開発、zen-mcp-server運用

## 参考リンク
- [GitHub CLI 公式ドキュメント](https://cli.github.com/manual/)
- [Git ブランチ戦略](https://nvie.com/posts/a-successful-git-branching-model/)
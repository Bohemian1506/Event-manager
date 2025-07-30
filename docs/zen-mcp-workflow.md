# zen-mcp-server 実践ワークフロー

## 概要
このドキュメントでは、EventPay Manager開発においてzen-mcp-serverを活用した実践的なワークフローを紹介します。複数のAIモデルを効果的に組み合わせることで、高品質なコードを効率的に開発できます。

## 基本的な使い方

### ツール一覧と用途

| ツール | 用途 | 推奨モデル |
|--------|------|-----------|
| `/chat` | 一般的な質問、ブレインストーミング | auto（自動選択） |
| `/thinkdeep` | 複雑な問題の深い分析 | Gemini Pro, O3 |
| `/consensus` | 設計判断、技術選定の合意形成 | 複数モデル |
| `/codereview` | 包括的なコードレビュー | Gemini Pro |
| `/debug` | バグの根本原因分析 | O3 |
| `/analyze` | アーキテクチャ分析 | Gemini Pro |
| `/refactor` | リファクタリング提案 | auto |
| `/testgen` | テストコード生成 | O3 |
| `/secaudit` | セキュリティ監査 | Gemini Pro |
| `/precommit` | コミット前の最終チェック | Flash |

## EventPay Manager開発での実践例

### 1. 新機能実装フロー

#### Issue作成時の設計検討

```bash
# 複数AIによる設計案の検討
/consensus "飲み会の途中参加者の料金計算機能を実装したい。以下の観点で検討してください：
- データモデルの拡張方法
- UIの変更内容
- 既存機能への影響
- 実装の複雑さ"

# 結果を基にIssueを作成
gh issue create --title "途中参加者の料金計算機能" --body "$(cat consensus_result.md)"
```

#### 実装前の詳細分析

```bash
# 既存コードの影響範囲分析
/analyze "app/models/participation.rb と app/controllers/participations_controller.rb を分析して、
途中参加機能追加による影響を評価してください"

# セキュリティ観点でのチェック
/secaudit "relevant_files: [app/models/participation.rb, app/controllers/participations_controller.rb]
途中参加者の料金計算でセキュリティ上考慮すべき点を指摘してください"
```

### 2. バグ修正フロー

#### 問題の深掘り分析

```bash
# エラーログから原因究明
/debug "参加者が2次会に参加登録しようとすると500エラーが発生する。
エラーログ：NoMethodError: undefined method 'participation_for' for nil:NilClass
該当箇所：app/controllers/participations_controller.rb:45"

# 継続的な調査（continuation_idを使用）
/debug "continuation_id: [前回のID]
関連するモデルのバリデーションも確認してください"
```

### 3. コードレビューフロー

#### PR作成前の自動レビュー

```bash
# 包括的なコードレビュー
/codereview "relevant_files: [
  app/models/event.rb,
  app/controllers/events_controller.rb,
  app/views/events/show.html.erb
]
model: gemini-pro"

# レビュー結果を基に修正
# 修正後、別のAIで再レビュー
/codereview "continuation_id: [前回のID]
model: o3
修正内容を踏まえて、ロジックの正確性を重点的にレビューしてください"
```

### 4. テスト作成フロー

#### 複雑なビジネスロジックのテスト

```bash
# テストケース生成
/testgen "app/models/event.rb の calculate_split_amount メソッドのテストを生成してください。
以下のケースを網羅：
- 通常の均等割り
- 途中参加者がいる場合
- 複数回（1次会、2次会）の精算
- 端数処理"

# 生成されたテストの検証
/codereview "spec/models/event_spec.rb
生成されたテストの網羅性と正確性をレビューしてください"
```

### 5. リファクタリングフロー

#### 大規模リファクタリングの計画

```bash
# リファクタリング分析
/refactor "refactor_type: decompose
app/controllers/events_controller.rb が肥大化しています。
適切に分割する方法を提案してください"

# 提案を基に段階的実装計画
/planner "EventsControllerのリファクタリングを以下の順序で実装：
1. concern化できる共通処理の抽出
2. サービスクラスへのビジネスロジック移行
3. コントローラーのスリム化
各ステップでテストが通ることを確認"
```

### 6. セキュリティ監査フロー

#### 定期的なセキュリティチェック

```bash
# OWASP Top 10に基づく監査
/secaudit "audit_focus: owasp
relevant_files: [
  app/controllers/application_controller.rb,
  app/models/user.rb,
  app/models/participant.rb
]
認証・認可の実装を重点的に監査してください"

# 監査結果への対応計画
/consensus "セキュリティ監査で以下の指摘がありました：
[監査結果をペースト]
優先度と対応方針を検討してください"
```

## 高度な使い方

### AI間の会話継続

zen-mcp-serverの強力な機能として、異なるツール間で会話を継続できます：

```bash
# 1. 分析から開始
/analyze "model: gemini-pro
app/models/event.rb の設計を分析"
# → continuation_id: "abc123" が返される

# 2. 分析結果を基にデバッグ
/debug "continuation_id: abc123
model: o3
分析結果を踏まえて、calculate_split_amount の計算ロジックの問題を調査"

# 3. デバッグ結果を基にリファクタリング提案
/refactor "continuation_id: abc123
model: auto
問題を解決するリファクタリング案を提示"
```

### 効率的なモデル選択

#### モデルの特性を活かした使い分け

```bash
# 高速な初期チェック
/codereview "model: flash
基本的なスタイルとシンタックスをチェック"

# 深い分析が必要な場合
/thinkdeep "model: gemini-pro
thinking_mode: high
ViewComponentの導入がアーキテクチャに与える影響を分析"

# 論理的な正確性が重要な場合
/debug "model: o3
複雑な料金計算ロジックのバグを特定"
```

### バッチ処理での活用

```bash
# 複数ファイルの一括レビュー
for file in app/models/*.rb; do
  echo "Reviewing $file..."
  /codereview "relevant_files: [$file]
  model: flash
  基本的な問題をチェック" > "reviews/$(basename $file .rb)_review.md"
done

# レビュー結果の統合分析
/analyze "$(cat reviews/*_review.md)
全体的な傾向と優先的に対処すべき問題を分析"
```

## ベストプラクティス

### 1. 適切なツールとモデルの選択

- **初期調査**: `/chat` with `auto` - AIが最適なモデルを選択
- **深い分析**: `/thinkdeep` with `gemini-pro` or `o3`
- **クイックチェック**: 各種ツール with `flash`
- **セキュリティ**: `/secaudit` with `gemini-pro`

### 2. 会話の継続性を活用

- `continuation_id`を使って、複数のAIが協力して問題を解決
- 異なる視点からの分析を統合

### 3. 段階的なアプローチ

1. まず`flash`で高速チェック
2. 問題があれば`pro`や`o3`で深掘り
3. 複数AIの意見を`consensus`で統合

### 4. ログとフィードバックの活用

```bash
# 実行ログの確認
tail -f /home/bohemian1506/ai-development/zen-mcp-server/logs/mcp_activity.log

# 問題があった場合のデバッグ
grep "ERROR" /home/bohemian1506/ai-development/zen-mcp-server/logs/mcp_server.log
```

## トラブルシューティング

### ツールが応答しない場合

1. APIキーの残高を確認
2. ログでエラーを確認
3. Claude Codeを再起動

### 期待した結果が得られない場合

1. より具体的なプロンプトを使用
2. 適切なモデルを明示的に指定
3. `thinking_mode`を調整

### メモリ不足エラー

1. `MAX_CONVERSATION_TURNS`を減らす
2. 長い会話は新しいスレッドで開始
3. 不要な会話履歴をクリア

## まとめ

zen-mcp-serverを活用することで：

1. **品質向上**: 複数AIによる多角的なレビュー
2. **効率化**: 適材適所でAIを使い分け
3. **知識共有**: AI間で情報を引き継ぎ
4. **自動化**: 定型的なタスクをAIに委任

これらの機能を組み合わせることで、EventPay Managerの開発効率と品質を大幅に向上させることができます。

## 関連ドキュメント

- [zen-mcp-setup.md](zen-mcp-setup.md) - セットアップガイド
- [ai-development-rules.md](ai-development-rules.md) - AI開発ルール
- [development-rules.md](development-rules.md) - 一般的な開発ルール
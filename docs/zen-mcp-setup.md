# zen-mcp-server セットアップガイド

## 概要
zen-mcp-serverは、Claude Codeから複数のAI（Gemini、OpenAI、GROK等）を活用できるMCPサーバーです。このガイドでは、EventPay Manager開発環境でzen-mcp-serverを設定し、複数AIを協調させて効率的な開発を行う方法を説明します。

## 前提条件
- Claude Code がインストール済み
- Docker Compose 環境が構築済み（EventPay Manager用）
- 最低1つのAI APIキー（Gemini、OpenAI、またはX.AI）

## セットアップ手順

### 1. 初期セットアップ

```bash
# zen-mcp-serverディレクトリへ移動
cd /home/bohemian1506/ai-development/zen-mcp-server/

# セットアップスクリプトの実行
./run-server.sh
```

このスクリプトが自動的に以下を実行します：
- Python仮想環境の作成（`.zen_venv`）
- 必要な依存関係のインストール
- `.env`ファイルの作成（存在しない場合）
- Claude MCPへの統合設定
- APIキーの検証

### 2. APIキーの設定

`.env`ファイルを編集してAPIキーを設定します：

```bash
# .envファイルを編集
nano /home/bohemian1506/ai-development/zen-mcp-server/.env
```

以下のAPIキーを設定（最低1つは必須）：

```bash
# Gemini API（Google AI Studio）
# 取得先: https://makersuite.google.com/app/apikey
GEMINI_API_KEY=your_gemini_api_key_here

# OpenAI API
# 取得先: https://platform.openai.com/api-keys
OPENAI_API_KEY=your_openai_api_key_here

# X.AI API（GROK）
# 取得先: https://console.x.ai/
XAI_API_KEY=your_xai_api_key_here

# デフォルトモデル設定（推奨: auto）
DEFAULT_MODEL=auto
```

### 3. AI協調開発の詳細設定

#### 会話管理設定

```bash
# AI間の最大会話ターン数（デフォルト: 20）
# 20ターン = 10往復の対話
MAX_CONVERSATION_TURNS=20

# 会話の有効期限（デフォルト: 3時間）
# 長時間の開発セッション用に延長可能
CONVERSATION_TIMEOUT_HOURS=3

# ログレベル（開発中はDEBUG推奨）
LOG_LEVEL=DEBUG
```

#### モデル制限設定（オプション）

コスト管理やコンプライアンスのため、使用可能なモデルを制限できます：

```bash
# 使用可能なモデルを制限
OPENAI_ALLOWED_MODELS=o3-mini,o4-mini    # コスト管理
GOOGLE_ALLOWED_MODELS=flash,pro          # 全Geminiモデル許可
XAI_ALLOWED_MODELS=grok-3                # 標準GROKのみ
```

### 4. 動作確認

#### サーバーの起動確認

```bash
# ログをリアルタイムで確認
./run-server.sh -f

# または個別にログファイルを確認
tail -f logs/mcp_server.log
```

#### Claude Codeでの確認

Claude Codeを再起動後、以下のコマンドで設定を確認：

```
/version
```

利用可能なモデル一覧を確認：

```
/listmodels
```

### 5. トラブルシューティング

#### APIキーエラーの場合

```bash
# エラーログを確認
grep "ERROR" logs/mcp_server.log | tail -20

# APIキーの形式を確認
# Gemini: AIzaSy で始まる
# OpenAI: sk-proj- または sk- で始まる
# X.AI: xai- で始まる
```

#### サーバーが起動しない場合

```bash
# Python環境を確認
source /home/bohemian1506/ai-development/zen-mcp-server/.zen_venv/bin/activate
which python

# 依存関係を再インストール
pip install -r requirements.txt
```

#### Claude Codeでツールが表示されない場合

1. Claude Codeを完全に終了
2. MCP設定を確認：
   ```bash
   cat ~/.config/claude/claude_desktop_config.json
   ```
3. Claude Codeを再起動

### 6. 環境変数の詳細

#### 基本設定

| 環境変数 | 説明 | デフォルト値 |
|---------|------|------------|
| `DEFAULT_MODEL` | デフォルトで使用するモデル | `auto` |
| `DEFAULT_THINKING_MODE_THINKDEEP` | ThinkDeepツールの思考深度 | `high` |
| `LOG_LEVEL` | ログの詳細度 | `DEBUG` |
| `DISABLED_TOOLS` | 無効化するツール（カンマ区切り） | なし |

#### 思考モードの詳細

| モード | トークン消費 | 用途 |
|--------|------------|------|
| `minimal` | 128 | クイック分析 |
| `low` | 2,048 | 軽い推論タスク |
| `medium` | 8,192 | バランスの取れた推論 |
| `high` | 16,384 | 複雑な分析（推奨） |
| `max` | 32,768 | 最大の推論深度 |

### 7. セキュリティ考慮事項

#### APIキーの管理

- `.env`ファイルは絶対にGitにコミットしない
- 適切なファイル権限を設定：
  ```bash
  chmod 600 /home/bohemian1506/ai-development/zen-mcp-server/.env
  ```

#### ログファイルの管理

- ログファイルは自動ローテーション（20MB、10バックアップ）
- 定期的に古いログを削除：
  ```bash
  find logs/ -name "*.log.*" -mtime +30 -delete
  ```

## 次のステップ

セットアップが完了したら、以下のドキュメントを参照してください：

- **[zen-mcp-workflow.md](zen-mcp-workflow.md)** - 実践的な使用例とワークフロー
- **[ai-development-rules.md](ai-development-rules.md)** - AI協調開発のルールとベストプラクティス

## 関連リンク

- [zen-mcp-server リポジトリ](https://github.com/toyama1710/zen-mcp-server)
- [MCP (Model Context Protocol) ドキュメント](https://www.anthropic.com/model-context-protocol)
- [EventPay Manager 開発ルール](development-rules.md)
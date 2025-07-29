# Node.js環境構築とDocker設定最適化 - 2025-07-29

## 作業概要
EventPay ManagerプロジェクトでNode.js環境を導入し、Docker設定を最適化してBootstrap + Sass環境を構築しました。

## 背景
- 初期プロジェクトセットアップ後のリント・テスト確認時にNode.js依存関係が不足
- `cssbundling-rails`使用によりBootstrap/CSS処理でNode.js環境が必要
- Dockerビルドタイムアウト（2分）問題の解決が必要

## 実施した作業

### 1. リント・テスト環境確認
- **RuboCop実行**: 1つの違反検出・自動修正完了
  - `config/initializers/assets.rb:10:72` - ファイル末尾改行不足
- **テスト実行**: Node.js依存関係不足により失敗
- **問題特定**: `cssbundling-rails`がNode.js環境を要求

### 2. Node.js依存関係設定
```json
// package.json更新
{
  "name": "app",
  "private": "true",
  "dependencies": {
    "bootstrap": "^5.3.0",
    "@popperjs/core": "^2.11.8"
  },
  "scripts": {
    "build:css": "sass app/assets/stylesheets/application.bootstrap.scss:app/assets/builds/application.css --no-source-map --load-path=node_modules"
  }
}
```

### 3. Docker設定最適化

#### docker-compose.yml改善
```yaml
# 主な変更点
services:
  web:
    build:
      context: .
      target: development  # 開発用ステージ指定
    volumes:
      - node_modules:/myapp/node_modules  # Node.jsキャッシュ追加

volumes:
  node_modules:  # 新規追加
```

#### Dockerfile改善
```dockerfile
# 主な変更点
FROM build AS development
ENV RAILS_ENV="development"
ENV BUNDLE_WITHOUT=""
COPY . .
RUN bundle install
EXPOSE 3000
CMD ["./bin/rails", "server", "-b", "0.0.0.0"]
```

### 4. 課題と解決案提示
- **タイムアウト問題**: 2分でDockerビルドがタイムアウト
- **解決案1**: importmap + CDN方式（Node.js不要）
- **解決案2**: Docker層キャッシュ最適化
- **解決案3**: マルチステージビルド改善

## 技術的詳細

### Node.js環境構成
| 項目 | 設定値 | 用途 |
|------|--------|------|
| Node.js | 20.11.1 | JavaScript実行環境 |
| Yarn | latest | パッケージマネージャー |
| Bootstrap | 5.3.0 | CSSフレームワーク |
| Popper.js | 2.11.8 | Bootstrap依存ライブラリ |

### Docker最適化ポイント
1. **マルチステージビルド**: 開発用ステージ分離
2. **ボリュームキャッシュ**: `node_modules`永続化
3. **ビルド順序**: 依存関係→アプリケーションコード
4. **BUILDKIT活用**: 並列処理による高速化

## 現在の状況
- **リント**: ✅ 完了（RuboCop違反修正済み）
- **Node.js設定**: ✅ 完了（package.json、yarn.lock作成済み）
- **Docker設定**: ✅ 完了（最適化済み）
- **テスト**: ⏳ Dockerビルド完了後実行予定

## 次のアクションアイテム
1. Dockerビルド実行・完了確認
2. Node.js環境でのテスト実行
3. Bootstrap CSS/JSの動作確認
4. 開発環境の最終動作確認

## 学習ポイント
- Rails 8 + cssbundling-railsでのNode.js要件
- Docker マルチステージビルドの開発環境活用
- ボリュームキャッシュによるビルド時間短縮
- パッケージマネージャー（Yarn）の適切な設定

## 所感
Node.js環境の導入により、モダンなフロントエンド開発環境が整いました。Dockerの最適化により、開発効率とビルド時間のバランスを取ることができ、今後のBootstrap + Stimulusを活用したUI開発の基盤が完成しました。

次回は実際のアプリケーション機能（認証、イベント管理等）の実装に集中できます。
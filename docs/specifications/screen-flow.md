# EventPay Manager 画面遷移図

## 概要
EventPay Managerの全画面と画面遷移を示します。システムは大きく以下の3つのユーザーフローに分かれています：

1. **認証フロー**: ユーザー登録・ログイン
2. **幹事フロー**: イベント管理・参加者管理
3. **参加者フロー**: 参加登録・情報編集

## 画面遷移図

```mermaid
graph TB
    %% スタイル定義
    classDef auth fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    classDef organizer fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    classDef participant fill:#e8f5e9,stroke:#388e3c,stroke-width:2px
    classDef common fill:#fff3e0,stroke:#f57c00,stroke-width:2px

    %% 共通部分
    TOP[トップページ<br/>ランディング]:::common
    
    %% 認証関連
    LOGIN[ログイン画面]:::auth
    REGISTER[新規登録画面]:::auth
    RESET_PASS[パスワード再設定画面]:::auth
    RESET_COMPLETE[パスワード再設定<br/>メール送信完了]:::auth
    
    %% 幹事用画面
    DASHBOARD[ダッシュボード<br/>イベント一覧]:::organizer
    EVENT_CREATE[イベント作成画面]:::organizer
    EVENT_DETAIL[イベント詳細画面<br/>参加者・支払い状況一覧]:::organizer
    EVENT_EDIT[イベント編集画面]:::organizer
    ROUNDS_MANAGE[各回管理画面<br/>1次会・2次会等]:::organizer
    INVITE_URL[招待URL発行画面<br/>QRコード表示]:::organizer
    PARTICIPANT_DETAIL[参加者詳細画面<br/>個別の参加・支払い状況]:::organizer
    REMINDER[リマインダー<br/>送信確認画面]:::organizer
    ACCOUNT[アカウント設定画面]:::organizer
    
    %% 参加者用画面
    PARTICIPANT_REGISTER[参加登録画面<br/>共有URLからアクセス]:::participant
    PARTICIPANT_EDIT[参加情報編集画面<br/>編集URLからアクセス]:::participant
    REGISTER_COMPLETE[登録完了画面<br/>編集URLメール送信案内]:::participant
    ERROR[エラー画面<br/>無効なトークン・期限切れ]:::participant
    
    %% 画面遷移
    TOP --> LOGIN
    TOP --> REGISTER
    LOGIN --> DASHBOARD
    LOGIN --> RESET_PASS
    REGISTER --> DASHBOARD
    RESET_PASS --> RESET_COMPLETE
    
    DASHBOARD --> EVENT_CREATE
    DASHBOARD --> EVENT_DETAIL
    DASHBOARD --> ACCOUNT
    
    EVENT_CREATE --> EVENT_DETAIL
    EVENT_DETAIL --> EVENT_EDIT
    EVENT_DETAIL --> ROUNDS_MANAGE
    EVENT_DETAIL --> INVITE_URL
    EVENT_DETAIL --> PARTICIPANT_DETAIL
    EVENT_DETAIL --> REMINDER
    
    EVENT_EDIT --> EVENT_DETAIL
    ROUNDS_MANAGE --> EVENT_DETAIL
    PARTICIPANT_DETAIL --> EVENT_DETAIL
    
    %% 参加者フロー
    INVITE_URL -.共有URL.-> PARTICIPANT_REGISTER
    PARTICIPANT_REGISTER --> REGISTER_COMPLETE
    REGISTER_COMPLETE -.編集URL<br/>メール送信.-> PARTICIPANT_EDIT
    PARTICIPANT_EDIT --> ERROR
    
    %% 戻る遷移
    ACCOUNT --> DASHBOARD
    REMINDER --> EVENT_DETAIL
```

## 画面カテゴリ説明

### 🟦 認証関連画面（青）
- **トップページ**: サービスの説明とログイン・新規登録への導線
- **ログイン画面**: 既存幹事のログイン
- **新規登録画面**: 新規幹事の登録
- **パスワード再設定**: パスワードを忘れた場合の再設定フロー

### 🟪 幹事用画面（紫）
- **ダッシュボード**: 管理中のイベント一覧
- **イベント作成**: 新規イベントの作成
- **イベント詳細**: 参加者一覧と支払い状況の管理
- **イベント編集**: イベント情報の編集
- **各回管理**: 1次会、2次会などの各回設定
- **招待URL発行**: 参加者向けURLとQRコードの生成
- **参加者詳細**: 個別参加者の詳細情報
- **リマインダー**: 未払い者へのメール送信
- **アカウント設定**: 幹事アカウントの設定

### 🟩 参加者用画面（緑）
- **参加登録画面**: 共有URLからアクセスし、参加情報を登録
- **登録完了画面**: 登録完了と編集URL送信の案内
- **参加情報編集画面**: 編集URLから参加情報を編集
- **エラー画面**: トークン無効・期限切れの場合

## 特徴的な遷移パターン

### 1. URL経由のアクセス（点線）
- 幹事が発行した**共有URL**から参加登録画面へ
- メールで送信される**編集URL**から参加情報編集画面へ

### 2. トークンベース認証
- 参加者は登録不要でトークンによる認証
- トークンは7日間有効
- 期限切れの場合はエラー画面へ遷移

### 3. 循環的な管理フロー
- イベント詳細を中心に各種管理画面へ遷移
- 各管理画面からイベント詳細へ戻る設計

## 実装上の注意点

1. **認証の違い**
   - 幹事: Rails 8標準認証（セッションベース）
   - 参加者: トークンベース認証（登録不要）

2. **セキュリティ**
   - 共有URLと編集URLは異なるトークンを使用
   - トークンは暗号化して保存

3. **ユーザビリティ**
   - 参加者は登録不要で簡単に参加可能
   - 幹事は一元的にイベントを管理可能
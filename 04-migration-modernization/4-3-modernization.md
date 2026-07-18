# 4.3 新しいアーキテクチャ・モダナイゼーション機会の決定

## 試験で問われる観点

- 移行後(または移行と同時)のモダナイゼーション: コンテナ化・サーバーレス化・疎結合化・DB のパーパスビルト化
- モノリスの段階的分解パターン
- ファイル処理・バッチ・データ分析基盤の近代化

## コンテナ化

| サービス | 使いどころ |
|---|---|
| **App2Container (A2C)** | 既存の Java/.NET アプリを**自動でコンテナ化**(コード変更なし)→ ECS/EKS へ |
| **ECS + Fargate** | 運用負荷最小のコンテナ実行(「Kubernetes の知識不要」) |
| **EKS** | 既存 Kubernetes 資産・エコシステム活用、オンプレとの一貫性 (EKS Anywhere) |
| **App Runner** | Web アプリ/API を最速でデプロイ(インフラ意識ゼロ) |
| ECR | イメージレジストリ(スキャン・クロスリージョンレプリケーション) |

**判断基準**: 「.NET/Java のレガシーをコード変更なしでコンテナに」→ **App2Container**。「K8s を使いたい/既に使っている」→ EKS。それ以外のコンテナ運用は **ECS+Fargate** が既定解(最小運用負荷)。

## サーバーレス化(リファクタリングの定番パターン)

| 移行前 | 移行後 |
|---|---|
| cron ジョブ用 EC2 | **EventBridge Scheduler + Lambda**(15分超・大容量は Fargate タスク/Batch) |
| 常駐 API サーバー | **API Gateway + Lambda**(または ALB + Fargate) |
| ファイル到着を監視するポーリング処理 | **S3 イベント → Lambda / EventBridge** |
| アプリ内のジョブキュー(DB テーブル製) | **SQS**(+ワーカーの Lambda/Fargate) |
| 多段のバッチ処理・リトライ制御の自作 | **Step Functions** |
| メール送信サーバー | SES |
| セッションを持つステートフルアプリ | セッションを ElastiCache/DynamoDB へ外出し → ステートレス化 |
| モノリス内の非同期処理 | SNS/EventBridge でイベント駆動に分離 |

- **Strangler Fig パターン**: モノリスの機能を少しずつ API Gateway/ALB の背後で新実装に差し替える(一括書き換えより低リスク)— 頻出キーワード
- ALB の**パスベースルーティング**や API Gateway で新旧を共存させる

## データベースのモダナイゼーション(パーパスビルト)

- 商用 DB (Oracle/SQL Server) → **Aurora**(ライセンス脱却)。SCT + DMS([4-2](./4-2-migration-strategy.md))
- 単純な KVS 用途の RDBMS → **DynamoDB**
- セッション/キャッシュ用の RDBMS テーブル → ElastiCache
- 全文検索 SQL (LIKE '%…%') → OpenSearch
- Babelfish for Aurora PostgreSQL: SQL Server アプリを**ほぼ変更なしで** Aurora へ

## 分析基盤・データレイクの近代化

- オンプレ Hadoop → **EMR**(または Glue でサーバーレス ETL)
- オンプレ DWH → **Redshift**
- データレイク構築: **S3 + Glue (Catalog/ETL) + Athena + QuickSight**、権限管理は **Lake Formation**
- リアルタイム化: Kinesis Data Streams / Firehose(S3 へのニアリアルタイム配信)/ MSK
- 「メインフレームの近代化」→ **AWS Mainframe Modernization**(リプラットフォーム/リファクタリング)

## RPO/RTO・運用も含めた近代化の判断

- モダナイズの目的キーワード: 「運用負荷削減」→ サーバーレス/マネージド化、「デプロイ頻度向上」→ コンテナ+CI/CD、「ライセンス費削減」→ OSS エンジン/Aurora、「スケーラビリティ」→ 疎結合+オートスケール
- 期限が厳しい場合: まず Rehost で移行し、**後からモダナイズ**(二段階)が現実解として正解になることも

## 頻出のひっかけポイント

- 「コード変更なしでコンテナ化」→ App2Container(手動 Dockerfile 作成より優先)
- Lambda の制約(15分・ペイロード・一時領域)に触れるシナリオでは **Fargate/Batch** が正解
- Strangler Fig は「段階的置換」。ビッグバンリライトを選ばせない問題が多い
- 「SQL Server 互換のまま Aurora へ」→ **Babelfish**
- Lake Formation は S3 データレイクの**きめ細かなアクセス制御(行/列レベル)**が特徴

# 00. SAP-C02 試験範囲ガイド

公式試験ガイド(SAP-C02)に基づく試験範囲の整理。

> **最初に読む**: SAP-C02 は「Well-Architected Framework に基づく設計最適化」を問う試験です。全ドメインノートの判断軸となる [Well-Architected Framework 解説](./well-architected.md) を先に読んでください。

## 試験形式

- **問題数**: 75問(採点対象65問 + 採点対象外10問。どれが採点対象外かは受験者にはわからない)
- **時間**: 180分(1問あたり約2.4分)
- **合格点**: 750 / 1000(スケールスコア)。**ドメインごとの合格基準はなく、総合点で判定**(補償型スコアリング)
- **不正解によるペナルティなし** — 必ず全問回答する
- **受験料**: 300 USD(再受験も同額。AWS 認定保有者は 50% オフバウチャーあり)

## 想定する受験者像

- AWS を使ったクラウドソリューションの設計・実装経験 **2年以上**
- AWS Well-Architected Framework に基づく設計最適化の能力
- 複雑な組織(マルチアカウント・ハイブリッド環境)に対する設計能力

## ドメイン別タスクステートメント

### Domain 1: 組織の複雑さに対応する設計(26%)

| タスク | 内容 | ノート |
|---|---|---|
| 1.1 | ネットワーク接続戦略の設計 | [1-1](../01-organizational-complexity/1-1-network-connectivity.md) |
| 1.2 | セキュリティ統制の規定 | [1-2](../01-organizational-complexity/1-2-security-controls.md) |
| 1.3 | 信頼性が高く回復性のあるアーキテクチャの設計 | [1-3](../01-organizational-complexity/1-3-reliable-resilient.md) |
| 1.4 | マルチアカウント AWS 環境の設計 | [1-4](../01-organizational-complexity/1-4-multi-account.md) |
| 1.5 | コスト最適化と可視化の戦略の決定 | [1-5](../01-organizational-complexity/1-5-cost-optimization.md) |

### Domain 2: 新しいソリューションのための設計(29%)

| タスク | 内容 | ノート |
|---|---|---|
| 2.1 | ビジネス要件を満たすデプロイ戦略の設計 | [2-1](../02-new-solutions/2-1-deployment-strategy.md) |
| 2.2 | 事業継続性を確保するソリューションの設計 | [2-2](../02-new-solutions/2-2-business-continuity.md) |
| 2.3 | 要件に基づくセキュリティ統制の決定 | [2-3](../02-new-solutions/2-3-security-controls.md) |
| 2.4 | 信頼性要件を満たすソリューションの設計 | [2-4](../02-new-solutions/2-4-reliability.md) |
| 2.5 | パフォーマンス目標を満たすソリューションの設計 | [2-5](../02-new-solutions/2-5-performance.md) |
| 2.6 | コスト目標を満たすソリューションの決定 | [2-6](../02-new-solutions/2-6-cost-optimization.md) |

### Domain 3: 既存のソリューションの継続的な改善(25%)

| タスク | 内容 | ノート |
|---|---|---|
| 3.1 | 全体的な運用上の優秀性(Operational Excellence)を高める戦略 | [3-1](../03-continuous-improvement/3-1-operational-excellence.md) |
| 3.2 | セキュリティを改善する戦略 | [3-2](../03-continuous-improvement/3-2-security.md) |
| 3.3 | パフォーマンスを改善する戦略 | [3-3](../03-continuous-improvement/3-3-performance.md) |
| 3.4 | 信頼性を改善する戦略 | [3-4](../03-continuous-improvement/3-4-reliability.md) |
| 3.5 | コスト最適化の機会の特定 | [3-5](../03-continuous-improvement/3-5-cost.md) |

### Domain 4: ワークロードの移行とモダナイゼーションの加速(20%)

| タスク | 内容 | ノート |
|---|---|---|
| 4.1 | 移行可能なワークロードの選定と評価 | [4-1](../04-migration-modernization/4-1-migration-assessment.md) |
| 4.2 | 移行方法(7R)と移行サービスの決定 | [4-2](../04-migration-modernization/4-2-migration-strategy.md) |
| 4.3 | 新しいアーキテクチャ・モダナイゼーション機会の決定 | [4-3](../04-migration-modernization/4-3-modernization.md) |

## 試験範囲内の主要サービス(カテゴリ別・約150サービス)

頻出度の高いものを太字で示す。詳細は [05-cheatsheets](../05-cheatsheets/README.md) を参照。

### ネットワークとコンテンツ配信
**Amazon VPC**, **AWS Transit Gateway**, **AWS Direct Connect**, **AWS Site-to-Site VPN**, AWS Client VPN, **AWS PrivateLink**, **Amazon Route 53**, **Amazon CloudFront**, **AWS Global Accelerator**, Elastic Load Balancing (ALB/NLB/GWLB), AWS Cloud WAN, Amazon API Gateway, AWS App Mesh, AWS Cloud Map

### セキュリティ・アイデンティティ・コンプライアンス
**AWS IAM**, **AWS IAM Identity Center**, **AWS Organizations (SCP)**, **AWS Control Tower**, **AWS KMS**, AWS CloudHSM, **AWS WAF**, AWS Shield, **Amazon GuardDuty**, **AWS Security Hub**, Amazon Inspector, Amazon Macie, Amazon Detective, **AWS Secrets Manager**, AWS Certificate Manager (ACM), AWS Firewall Manager, AWS Network Firewall, AWS Directory Service, Amazon Cognito, AWS Resource Access Manager (RAM), AWS Audit Manager, AWS Artifact

### コンピューティング
**Amazon EC2**, **EC2 Auto Scaling**, **AWS Lambda**, AWS Batch, AWS Elastic Beanstalk, AWS Outposts, AWS Wavelength, AWS Local Zones, EC2 Image Builder, AWS Serverless Application Repository

### コンテナ
**Amazon ECS**, **Amazon EKS**, **AWS Fargate**, Amazon ECR, ECS Anywhere / EKS Anywhere, AWS App Runner, AWS App2Container

### ストレージ
**Amazon S3**, S3 Glacier, **Amazon EBS**, **Amazon EFS**, **Amazon FSx** (Windows / Lustre / NetApp ONTAP / OpenZFS), **AWS Storage Gateway**, **AWS Backup**, AWS Elastic Disaster Recovery (DRS)

### データベース
**Amazon RDS**, **Amazon Aurora (Global Database / Serverless)**, **Amazon DynamoDB (Global Tables / DAX)**, **Amazon ElastiCache** (Redis / Memcached), **Amazon Redshift**, Amazon Neptune, Amazon DocumentDB, Amazon Keyspaces, Amazon Timestream, Amazon QLDB, Amazon MemoryDB

### アプリケーション統合
**Amazon SQS**, **Amazon SNS**, **Amazon EventBridge**, **AWS Step Functions**, Amazon MQ, Amazon AppFlow, AWS AppSync, Amazon SES

### 分析
**Amazon Kinesis** (Data Streams / Data Firehose), Amazon MSK, **Amazon Athena**, AWS Glue, Amazon EMR, Amazon OpenSearch Service, Amazon QuickSight, AWS Lake Formation, AWS Data Exchange

### 移行と転送
**AWS Application Migration Service (MGN)**, **AWS Database Migration Service (DMS)**, **AWS DataSync**, **AWS Snow Family**, **AWS Transfer Family**, **AWS Migration Hub**, **AWS Application Discovery Service**, AWS Schema Conversion Tool (SCT), AWS Mainframe Modernization

### マネジメント・ガバナンス
**Amazon CloudWatch**, **AWS CloudTrail**, **AWS Config**, **AWS Systems Manager**, **AWS CloudFormation**, AWS Service Catalog, **AWS Trusted Advisor**, AWS Compute Optimizer, AWS License Manager, AWS Health Dashboard, AWS Well-Architected Tool, AWS Proton, AWS Resilience Hub, AWS Fault Injection Service

### コスト管理
**AWS Cost Explorer**, **AWS Cost and Usage Report (CUR)**, **AWS Budgets**, Savings Plans, AWS Cost Anomaly Detection, AWS Billing Conductor

### 開発者ツール
AWS CodePipeline, AWS CodeBuild, AWS CodeDeploy, AWS CDK, AWS X-Ray, AWS Amplify

### 機械学習(浅い出題)
Amazon SageMaker, Amazon Rekognition, Amazon Comprehend, Amazon Transcribe, Amazon Translate, Amazon Polly, Amazon Textract, Amazon Kendra, Amazon Fraud Detector, Amazon Personalize

## 試験範囲外(出題されない)

- コードの記述・デバッグそのもの(アーキテクチャ判断としてのサービス選択は出る)
- 機械学習アルゴリズムの詳細設計
- ネットワークプロトコルのビットレベルの詳細
- コンシューマー向けサービス(Amazon Chime, WorkMail 等)や、ゲーム(GameLift)・IoT・ロボティクス等の深い専門領域(名前と用途レベルは知っておくと安心)

## 学習リソース(公式)

- AWS Skill Builder: Exam Prep Official Practice Question Set (SAP-C02)(無料の公式練習問題)
- AWS Well-Architected Framework ホワイトペーパー(6本の柱)
- AWS アーキテクチャセンター / This is My Architecture
- 各サービスの FAQ(特に VPC / DX / S3 / RDS / DynamoDB / Organizations)

> **注**: 対象サービスリストは公式試験ガイドで随時更新されます。受験申込前に必ず最新の公式試験ガイド(AWS 認定ページからダウンロード可能)を確認してください。

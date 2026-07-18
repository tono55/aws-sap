# 05. サービス別チートシート(試験直前の暗記用)

各サービスの「試験に出る要点・制限値・使い分け」だけを凝縮した直前復習用シート。
詳しい設計判断はドメイン別ノート(01〜04)を参照。

## 目次

| シート | 対象サービス |
|---|---|
| [networking](./networking.md) | VPC, TGW, Direct Connect, VPN, PrivateLink, Route 53, CloudFront, Global Accelerator, ELB |
| [security-identity](./security-identity.md) | IAM, Organizations/SCP, Identity Center, KMS, WAF/Shield, GuardDuty ほか検知系 |
| [compute-containers](./compute-containers.md) | EC2, ASG, Lambda, ECS/EKS/Fargate, Batch, Outposts |
| [storage-data](./storage-data.md) | S3, EBS, EFS, FSx, Storage Gateway, AWS Backup |
| [database](./database.md) | RDS/Aurora, DynamoDB, ElastiCache, Redshift ほかパーパスビルト DB |
| [integration-app](./integration-app.md) | SQS, SNS, EventBridge, Step Functions, API Gateway, Kinesis/MSK |
| [migration-transfer](./migration-transfer.md) | MGN, DMS/SCT, DataSync, Snow Family, Transfer Family, Migration Hub |
| [management-cost](./management-cost.md) | CloudWatch, CloudTrail, Config, Systems Manager, CloudFormation, コスト管理系 |

## 直前チェックの使い方

1. 各シートの表を上から流し読みし、「使い分け」を即答できるか自己テスト
2. 詰まった項目だけドメインノートに戻って文脈ごと復習
3. 試験当日は「数値系(クォータ・制限・RTO/RPO 目安)」を最終確認

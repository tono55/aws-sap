# 3.4 信頼性を改善する戦略

## 試験で問われる観点

- 既存構成の単一障害点(SPOF)の発見と排除
- 自己復旧(self-healing)の仕組み化
- 監視・アラートの不足を補う改善

※新規設計の信頼性は [2-4](../02-new-solutions/2-4-reliability.md)、DR 戦略は [2-2](../02-new-solutions/2-2-business-continuity.md) を参照。

## SPOF 発見チェックリスト(問題文の構成図でここを見る)

| アンチパターン | 改善 |
|---|---|
| 単一 EC2 インスタンスでアプリ稼働 | ASG(複数 AZ)+ ELB。最低でも ASG min=1 で自己復旧 |
| RDS シングル AZ | **Multi-AZ 化**(変更のみ・アプリ影響なし) |
| NAT Gateway が 1 AZ のみ | **各 AZ に NAT GW** + AZ ごとのルートテーブル |
| 単一 AZ 配置の ALB ターゲット | 複数 AZ に分散 + クロスゾーン負荷分散 |
| EC2 内ローカルディスクに状態保存 | セッションは ElastiCache/DynamoDB、ファイルは EFS/S3 へ外出し(ステートレス化) |
| 単一リージョンのみ(RTO 要件が厳しい) | DR 構成([2-2](../02-new-solutions/2-2-business-continuity.md)) |
| ハードコードされた IP/ホスト | サービスディスカバリ(Cloud Map)/ DNS / エンドポイント参照 |
| cron を1台の EC2 で実行 | **EventBridge Scheduler + Lambda/ECS タスク**(サーバーレス化) |
| 同期的な密結合(直接 API 呼び出しの連鎖) | SQS/SNS/EventBridge で疎結合化 |

## 自己復旧の仕組み

- **ASG のヘルスチェック**: EC2 ステータス + **ELB ヘルスチェック連動**(`HealthCheckType: ELB`)でアプリレベル異常も置換
- **CloudWatch アラームの EC2 アクション**: システムステータス異常 → **recover**(同一 ID・EIP 維持で別ホストへ)/ インスタンスステータス異常 → reboot
- ECS/EKS: サービスの desired count による自動置換、コンテナヘルスチェック
- Route 53 ヘルスチェック + フェイルオーバーレコード
- Lambda の非同期呼び出し: リトライ(2回)+ **DLQ / 送信先 (Destinations)** で失敗を捕捉
- Step Functions のリトライ/キャッチで冪等な再実行

## 監視・検証の改善

- アラーム不足 → 主要メトリクス(4xx/5xx、レイテンシー p99、キュー深度、レプリカ遅延)にアラーム設定
- **複合アラーム (composite alarm)** でノイズ削減
- 障害対応が場当たり → Incident Manager のランブック化
- 「本当に復旧できるか検証したい」→ **FIS でカオス実験** / DR 訓練(game day)
- **Resilience Hub** で RTO/RPO 達成可能性を継続評価

## データ保護の改善

- バックアップが手動/ばらばら → **AWS Backup で一元化 + バックアップポリシー(Organizations)で強制**
- 誤削除対策: S3 バージョニング + MFA Delete、RDS 削除保護、CloudFormation スタックポリシー/termination protection
- 「バックアップからの復元テストをしていない」→ AWS Backup の**復元テスト機能**で定期検証

## 頻出のひっかけポイント

- RDS Multi-AZ は**可用性**(フェイルオーバー)、リードレプリカは**性能**(読み取りスケール)— 目的の混同を誘う選択肢が定番
- Multi-AZ のフェイルオーバーは DNS 切替(通常 60〜120秒)。**接続文字列はエンドポイント名を使う**(IP 直書きは NG)
- EC2 の「recover」アクションは**インスタンスストア搭載型では不可**、EBS ブートのみ
- ELB ヘルスチェックにしないと「アプリがハングしてもインスタンスは healthy」問題が残る
- 「1台の cron サーバーが SPOF」→ EventBridge Scheduler へ(2台に増やして重複実行、は通常不正解)

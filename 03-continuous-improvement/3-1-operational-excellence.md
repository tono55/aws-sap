# 3.1 運用上の優秀性(Operational Excellence)を高める戦略

## 試験で問われる観点

- Observability(メトリクス・ログ・トレース)の整備
- 運用作業の自動化(Systems Manager 中心)
- アラート・インシデント対応の仕組み化

## Observability スタック

| レイヤー | サービス | ポイント |
|---|---|---|
| メトリクス | **CloudWatch**(標準/カスタム) | EC2 のメモリ・ディスクは**カスタムメトリクス(CloudWatch Agent)が必要** — 頻出 |
| ログ | **CloudWatch Logs** | メトリクスフィルタ → アラーム。サブスクリプションフィルタ → Kinesis/Lambda/OpenSearch |
| トレース | **AWS X-Ray** | マイクロサービスの遅延ボトルネック特定。「どのサービス間呼び出しが遅いか」→ X-Ray |
| 統合監視 | CloudWatch ServiceLens / Application Signals, Container Insights, Lambda Insights | |
| 合成監視 | **CloudWatch Synthetics (canary)** | ユーザー視点の外形監視 |
| リアルユーザー | CloudWatch RUM | 実ユーザーの体感性能 |
| ダッシュボード | CloudWatch Dashboards(**クロスアカウント・クロスリージョン対応**) | 組織全体の一元可視化 |
| OSS 系 | Amazon Managed Grafana / Managed Service for Prometheus | 既存 Prometheus/Grafana 資産がある場合 |

- **CloudWatch エージェントの一括導入**: SSM Run Command / State Manager で全 EC2 に配布
- **組み込みメトリクスフォーマット (EMF)**: アプリログから高カーディナリティメトリクスを生成

## Systems Manager(運用自動化の中核・頻出)

| 機能 | 用途 |
|---|---|
| **Session Manager** | SSH 不要・ポート開放不要のシェルアクセス。**操作ログを S3/CloudWatch Logs に記録**(監査要件)— 頻出 |
| **Run Command** | 多数のインスタンスへのコマンド一括実行 |
| **Patch Manager** | パッチベースライン + メンテナンスウィンドウで自動パッチ — 頻出 |
| **State Manager** | 構成の継続的な維持(エージェント導入・設定強制) |
| **Automation (runbook)** | 定型運用の自動化(AMI 作成、再起動、修復)。**Config/EventBridge から呼び出す自動修復の実行役** |
| **Parameter Store** | 設定値の一元管理 |
| Inventory / Compliance | ソフトウェア構成の収集・準拠確認 |
| OpsCenter / Incident Manager | 運用課題・インシデントの管理(エスカレーション・オンコール) |
| **Fleet Manager / ハイブリッドアクティベーション** | **オンプレサーバーも SSM 管理下に**(ハイブリッド運用の一元化) |

**定番パターン**: 「SSH 鍵管理をやめて監査ログを取りたい」→ Session Manager。「毎月のパッチ適用を自動化」→ Patch Manager + Maintenance Window。「オンプレも含めて一元的にパッチ・コマンド実行」→ SSM ハイブリッドアクティベーション。

## イベント駆動の運用自動化

```
検知(CloudWatch アラーム / Config / GuardDuty / Health)
  → ルーティング(EventBridge)
  → 対応(SSM Automation / Lambda / Step Functions)
  → 通知(SNS / ChatOps)
```

- 例: 「EC2 の異常を検知したら自動で再起動/復旧」→ CloudWatch アラームの EC2 アクション(recover/reboot)
- 例: 「AMI を定期的に作成しパッチ済みイメージを配布」→ EC2 Image Builder(パイプライン化)
- 例: 「AWS の計画メンテ通知に自動対応」→ AWS Health イベント → EventBridge → Automation

## IaC・構成管理による運用改善

- 手動構築の環境 → CloudFormation 化(既存リソースの取り込み: resource import / IaC generator)
- 構成ドリフト検出: CloudFormation Drift Detection / AWS Config
- 「環境の複製(別リージョン・別アカウント)を素早く」→ テンプレート化が前提

## 頻出のひっかけポイント

- EC2 の**メモリ使用率は標準メトリクスにない**(CloudWatch Agent 必須)
- 「SSH の踏み台を廃止したい」「22番ポートを閉じたい」→ Session Manager(セキュリティ改善の文脈でも正解)
- 詳細モニタリング(1分間隔)と基本(5分)の違い。より細かい粒度は高解像度カスタムメトリクス(1秒)
- X-Ray はエージェント/SDK の組み込みが必要(自動で全部見えるわけではない)
- 「複数アカウントのダッシュボードを1つに」→ CloudWatch クロスアカウントオブザーバビリティ(モニタリングアカウント)

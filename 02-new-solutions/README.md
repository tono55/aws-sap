# Domain 2: 新しいソリューションのための設計(29%)

全ドメイン中最大の配点。「与えられたビジネス要件・技術要件を満たす新規アーキテクチャを設計できるか」を問う。
要件キーワード(RTO/RPO・最小コスト・最小運用負荷・最小レイテンシー)から最適なサービスの組み合わせを即断できることがゴール。

## 目次

| タスク | ノート | 主なテーマ |
|---|---|---|
| 2.1 | [デプロイ戦略](./2-1-deployment-strategy.md) | Blue/Green, Canary, IaC, CI/CD |
| 2.2 | [事業継続性](./2-2-business-continuity.md) | RTO/RPO, DR 4パターン, マルチリージョン |
| 2.3 | [セキュリティ統制](./2-3-security-controls.md) | 暗号化, 境界防御, 監査要件 |
| 2.4 | [信頼性](./2-4-reliability.md) | 疎結合, スケーリング, 自己復旧 |
| 2.5 | [パフォーマンス](./2-5-performance.md) | キャッシュ, エッジ, サービス選択 |
| 2.6 | [コスト](./2-6-cost-optimization.md) | 購入オプション, サーバーレス, ストレージ階層 |

## このドメインの攻略ポイント

- 問題文の**制約キーワードを最初に特定**する。「MOST cost-effective」「LEAST operational overhead」「minimize downtime」のどれが問われているかで正解が変わる
- 「最小運用負荷」なら**マネージド/サーバーレス**(Fargate, Aurora Serverless, EventBridge)を優先
- 「最小コスト」なら Spot / S3 階層化 / Graviton / Savings Plans を検討
- RTO/RPO の数値が出たら DR 4パターン(Backup & Restore / Pilot Light / Warm Standby / Multi-Site Active-Active)のどれに該当するかを即座に対応付ける

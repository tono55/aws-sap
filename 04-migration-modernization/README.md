# Domain 4: ワークロードの移行とモダナイゼーションの加速(20%)

オンプレミス(または他クラウド)から AWS への移行の**評価 → 戦略選定 → 実行 → モダナイズ**の一連の流れを問うドメイン。
移行サービス群(MGN / DMS / DataSync / Snow Family / Transfer Family)は実務で全部触る機会が少ないため、**各サービスの守備範囲の暗記**が得点に直結する。

## 目次

| タスク | ノート | 主なテーマ |
|---|---|---|
| 4.1 | [移行評価](./4-1-migration-assessment.md) | Discovery, Migration Evaluator, MRA, TCO |
| 4.2 | [移行戦略と移行サービス](./4-2-migration-strategy.md) | 7R, MGN, DMS, DataSync, Snow, Transfer Family |
| 4.3 | [モダナイゼーション](./4-3-modernization.md) | コンテナ化, サーバーレス化, 疎結合化, データレイク |

## このドメインの攻略ポイント

- データ移行問題は「**データ量 ÷ 帯域 = 転送日数**」をまず概算する。ネットワークで間に合わないなら Snow Family
- 「継続的に同期」か「一回きりの転送」かで DataSync/DMS(継続)と Snowball(オフライン一括)を切り分ける
- 7R は**キーワード対応**(そのまま→Rehost、DB だけ変更→Replatform、作り直し→Refactor)を即答できるように

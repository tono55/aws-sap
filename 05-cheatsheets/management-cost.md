# チートシート: マネジメント・ガバナンス・コスト

## CloudWatch

- EC2 標準メトリクスに**メモリ・ディスク使用率はない**(Agent 必須)
- 基本 5分 / 詳細 1分 / カスタム高解像度 1秒
- **メトリクスフィルタ**(ログ→メトリクス)→ アラーム。**複合アラーム**でノイズ削減
- アラームアクション: SNS / ASG / EC2(recover/reboot/stop)/ Systems Manager
- **サブスクリプションフィルタ**: Logs → Kinesis/Firehose/Lambda(クロスアカウント集約)
- Logs Insights(クエリ)・保持期間設定(既定は無期限=コスト注意)
- クロスアカウントオブザーバビリティ(モニタリングアカウント)
- **Synthetics**(外形監視)/ RUM / Evidently / **X-Ray**(分散トレース)

## CloudTrail

- 管理イベント(既定90日は Event history)。**証跡作成で S3 長期保存**
- **組織トレイル**: 全アカウント強制・メンバーは削除不可
- データイベント(S3 オブジェクト・Lambda 呼び出し)は別料金・要有効化
- **ログファイル整合性検証**(改ざん検知)。Insights(異常 API 量)

## AWS Config

- リソース構成の**記録・履歴・関係性** + **ルールで評価**(マネージド/カスタム)
- **自動修復(SSM Automation 連携)** — 「検出→修復」の定番
- **コンフォーマンスパック**(ルール集の一括展開)・**組織アグリゲーター**
- Config は「望ましい構成か」/ CloudTrail は「誰が何をしたか」/ GuardDuty は「悪意ある活動か」

## Systems Manager(頻出機能のみ)

- **Session Manager**: SSH レス・ポート開放不要・**操作ログ記録**
- **Patch Manager**: ベースライン+メンテナンスウィンドウ
- **Automation**: 修復ランブック(Config/EventBridge から起動)
- **Run Command / State Manager**: 一括実行・構成維持
- **Parameter Store**: 設定・シークレット(無料枠)
- **ハイブリッドアクティベーション**: オンプレも管理対象に

## CloudFormation

- **StackSets**: マルチアカウント・マルチリージョン展開(**Organizations 連携で自動デプロイ**)
- 変更セット(事前プレビュー)/ ドリフト検出 / スタックポリシー(更新保護)
- クロススタック参照(Export/ImportValue)/ ネスト
- カスタムリソース(Lambda)・フック(プロアクティブ検証)
- ロールバック: 失敗時自動。**保持ポリシー (DeletionPolicy: Retain/Snapshot)**

## その他ガバナンス

- **Service Catalog**: 承認済み構成のセルフサービス提供(起動制約 = 利用者に強い権限を渡さない)
- **Control Tower**: ランディングゾーン + ガードレール + Account Factory
- **License Manager**: ライセンス追跡・BYOL 管理
- **Trusted Advisor**: コスト/性能/セキュリティ/耐障害性/クォータのチェック(フル機能は Business 以上)
- **Compute Optimizer**: ML ベースのライトサイジング(EC2/ASG/EBS/Lambda)
- **Service Quotas**: クォータ管理(**アカウント×リージョン単位**・DR 側も忘れず)
- **Health Dashboard**: AWS 側の障害・メンテ通知(EventBridge 連携で自動対応)
- **Well-Architected Tool**: ワークロードのレビュー
- **Resilience Hub / FIS**: 回復性評価・カオス実験

## コスト管理

| ツール | 一言 |
|---|---|
| **Cost Explorer** | 分析 GUI・予測・**RI/SP 推奨と使用率/カバレッジ** |
| **CUR** | 最詳細明細 → **Athena+QuickSight**(定番) |
| **コスト配分タグ** | **有効化必須・遡及しない** |
| Cost Categories | 独自のコスト分類 |
| **Budgets** | 予算アラート + **Actions(SCP 適用・権限剥奪)** |
| **Cost Anomaly Detection** | ML で急増検知 |
| Billing Conductor | 独自レートの請求グループ |
| Instance Scheduler | 非本番の夜間週末停止 |

## 購入オプション早見

- **Compute Savings Plans**: 最も柔軟(EC2 全般 + **Fargate/Lambda**)〜66%
- EC2 Instance SP / Standard RI: 〜72%(固定的)
- Convertible RI: 交換可・〜66%
- **Spot**: 〜90%・2分通知・中断耐性必須
- Capacity Reservation: 確保のみ(割引なし・RI と併用可)
- RI/SP は**組織で共有**(無効化可)

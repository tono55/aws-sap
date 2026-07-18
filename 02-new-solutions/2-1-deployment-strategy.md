# 2.1 ビジネス要件を満たすデプロイ戦略の設計

## 試験で問われる観点

- ダウンタイム許容度・ロールバック要件・コストからデプロイ方式(In-place / Rolling / Blue/Green / Canary)を選択できるか
- サービスごとの Blue/Green・Canary の実現方法(CodeDeploy, Route 53, ALB, API Gateway, Lambda alias)を知っているか
- IaC(CloudFormation / CDK)とマルチアカウント展開(StackSets)を設計できるか

## デプロイ方式の比較

| 方式 | ダウンタイム | ロールバック | 追加コスト | 特徴 |
|---|---|---|---|---|
| In-place (All at once) | あり | 再デプロイが必要(遅い) | なし | 最速・最安。本番には不向き |
| Rolling | ほぼなし | 遅い(逆向きに再ロール) | なし | 新旧バージョン混在期間あり |
| Rolling with additional batch | なし | 遅い | 少(1バッチ分) | Elastic Beanstalk で選択可 |
| Immutable | なし | 速い(新 ASG を破棄) | 中(一時的に2倍) | 新規インスタンス群に展開 |
| **Blue/Green** | なし | **最速(切り戻すだけ)** | 高(環境2面) | 試験頻出。DNS or LB で切替 |
| **Canary / Linear** | なし | 速い | 中 | 一部トラフィックで検証しながら段階展開 |

**判断基準**: 「ロールバックを最速に」「ダウンタイムゼロ」→ Blue/Green。「リスクを最小化しながら段階的に」→ Canary。「コスト最小」→ Rolling。

## サービス別の Blue/Green・Canary 実現方法

| 対象 | 方法 | ポイント |
|---|---|---|
| EC2 / ASG | CodeDeploy Blue/Green(新 ASG 作成し LB で切替) | ALB のターゲットグループ切替 |
| ECS | CodeDeploy Blue/Green(タスクセット + リスナー切替) | テストリスナーで事前検証可能 |
| **Lambda** | **エイリアス + 加重ルーティング**(CodeDeploy Canary10Percent5Minutes 等) | `PreTraffic`/`PostTraffic` フックで検証 |
| API Gateway | カナリアリリース(ステージの canary 設定) | ステージ変数と組み合わせ |
| Route 53 | 加重ルーティング(Weighted Routing) | DNS TTL の影響でロールバックが即時でない点に注意 |
| CloudFront | 連続デプロイ(staging distribution) / Lambda@Edge の段階切替 | |
| RDS/Aurora | **Blue/Green Deployments 機能**(MySQL/PostgreSQL) | スキーマ変更やバージョンアップを安全に切替 |

**ひっかけ**: Route 53 の加重ルーティングによる切替は **DNS キャッシュ(TTL)** のためロールバックが即時ではない。「即時ロールバック」が要件なら **ALB リスナー/ターゲットグループの切替**を選ぶ。

## IaC とマルチアカウント展開

- **CloudFormation StackSets**: 複数アカウント・複数リージョンへ一括デプロイ。Organizations 連携(service-managed permissions)で **自動デプロイ(新規アカウント追加時に自動適用)** が可能 — 試験頻出
- **変更セット (Change Sets)**: 適用前に変更内容をプレビュー。本番変更の承認フローに組み込む
- **ドリフト検出 (Drift Detection)**: 手動変更の検出。修復は自動でない点に注意(検出のみ)
- **カスタムリソース / CloudFormation フック**: CFn が未対応のリソースや独自検証が必要な場合
- **AWS CDK**: プログラミング言語で IaC。内部的に CloudFormation を生成
- **AWS Service Catalog**: 承認済み構成(ポートフォリオ/製品)をエンドユーザーにセルフサービス提供。「利用者に限定的なプロビジョニング権限を与えたい」→ Service Catalog + 起動制約(Launch Constraint)
- **AWS Proton**: プラットフォームチームがテンプレートを管理し、開発者がセルフサービスでデプロイ(コンテナ/サーバーレス向け)

## CI/CD パイプライン

- **CodePipeline**: オーケストレーション。クロスアカウントデプロイは「ターゲットアカウントの IAM ロールを Assume + アーティファクト S3/KMS のクロスアカウント権限」がポイント
- **CodeBuild**: ビルド/テスト。VPC 内リソースへのアクセスは VPC 設定を追加
- **CodeDeploy**: EC2/ECS/Lambda/オンプレへのデプロイ。`appspec.yml` のフックでカスタム処理
- 承認ゲート: パイプラインに **Manual approval** アクション(SNS 通知と組み合わせ)

## 頻出のひっかけポイント

- 「デプロイ失敗時に**自動でロールバック**」→ CodeDeploy のアラーム連動ロールバック(CloudWatch アラームをトリガーに)
- 「新しいアカウントが作られたら自動で標準リソースを展開」→ **StackSets の自動デプロイ(Organizations 連携)** または Control Tower の Account Factory カスタマイズ
- Elastic Beanstalk の「Immutable」と「Rolling with additional batch」の違い(Immutable は全量を新規インスタンスで)
- Lambda のトラフィックシフトは **CodeDeploy + エイリアス**。バージョン発行(publish)しないとエイリアスが使えない

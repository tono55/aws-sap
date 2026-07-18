# チートシート: コンピューティング・コンテナ

## EC2

- ファミリー: C(CPU)/ M(汎用)/ R(メモリ)/ I(ローカル NVMe)/ P・G(GPU)/ **Graviton(価格性能比〜40%改善)**
- 購入: On-Demand / **Savings Plans** / RI / **Spot(〜90%引・2分前中断通知)** / Dedicated Host(**BYOL・ソケット単位ライセンス**)/ Dedicated Instance(専有 HW だがライセンス紐付けなし)
- **プレイスメントグループ**: Cluster(低レイテンシー HPC)/ Spread(分離・AZ 7台)/ Partition(Kafka/HDFS)
- **IMDSv2 強制**(SSRF 対策)。インスタンスプロファイルでキーレス化
- CloudWatch アラームアクション: **recover**(システム障害・EBS ブートのみ)/ reboot / stop
- Hibernate: RAM を EBS に保存(事前暗号化必須)

## Auto Scaling

- ポリシー: **Target Tracking(既定解)** / Step / **Predictive(周期パターン)** / Scheduled(既知イベント)
- **ウォームプール**: 起動の遅いアプリの事前初期化
- ライフサイクルフック: 起動/終了時の処理(ログ退避等)
- ヘルスチェック: EC2 / **ELB 連動(アプリ異常も置換)**
- 複数インスタンスタイプ + Spot/OD 混在(MixedInstancesPolicy)

## Lambda

- **最大 15分**・メモリ 128MB〜10GB(CPU 比例)・/tmp 最大 10GB・ペイロード 6MB(同期)
- 同時実行: アカウント既定 1,000(引き上げ可)。**リザーブド**(上限設定・確保)/ **プロビジョンド**(コールドスタート排除)
- VPC アクセス: ENI 経由(Hyperplane で高速化済)。**RDS には RDS Proxy 併用**が定番
- 非同期: 2回リトライ + **DLQ / Destinations**
- イベントソースマッピング(SQS/Kinesis/DynamoDB Streams)。Kinesis はシャード単位の並列
- **SnapStart**(Java 等のコールドスタート対策)。コンテナイメージ 10GB 対応
- デプロイ: バージョン + エイリアス + **CodeDeploy でカナリア**

## ECS / Fargate

- 起動タイプ: EC2(管理必要・DaemonSet 的用途可)/ **Fargate(サーバーレス・既定解)**
- タスクロール(アプリ権限)と実行ロール(イメージ取得・ログ)の区別
- ネットワーク: awsvpc モード(タスクごと ENI)
- **CodeDeploy Blue/Green** 対応。Capacity Provider で Spot 混在
- **ECS Anywhere**: オンプレのサーバーでタスク実行

## EKS

- マネージド K8s。ノード: マネージドノードグループ / **Fargate**(Pod 単位)/ セルフマネージド
- **IRSA (IAM Roles for Service Accounts)**: Pod 単位の IAM 権限
- EKS Anywhere / EKS Distro(オンプレ一貫性)
- 既存 K8s 資産・エコシステム(Helm 等)要件なら EKS、それ以外は ECS

## その他コンピューティング

- **App Runner**: ソース/イメージから Web アプリを最速デプロイ
- **App2Container**: Java/.NET を自動コンテナ化
- **AWS Batch**: バッチのキュー管理+最適配置(Spot 活用・依存関係)
- Elastic Beanstalk: アプリだけ持ち込む PaaS(裏は CFn)。デプロイポリシー(All at once/Rolling/Immutable/Blue-Green via swap URL)
- **Outposts**: AWS のラックをオンプレ設置(**低レイテンシー・データレジデンシー**)
- **Local Zones**: 都市近接の AWS インフラ(超低レイテンシー)
- **Wavelength**: 5G キャリア網内(モバイル超低レイテンシー)
- Lightsail: 定額 VPS(SAP ではほぼ不正解肢)

## 定番シナリオ即答

- 「中断可能・最安のバッチ」→ Spot + 複数タイプ/AZ(capacity-optimized)
- 「Windows ライセンス持ち込み(ソケット課金)」→ **Dedicated Host**
- 「15分超の処理をサーバーレスで」→ Fargate タスク / Batch / Step Functions 分割
- 「コールドスタートを排除」→ プロビジョンド同時実行
- 「オンプレでレイテンシー 10ms 未満の AWS サービス」→ Outposts

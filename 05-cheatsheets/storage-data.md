# チートシート: ストレージ

## S3

- 性能: **プレフィックスあたり 3,500 PUT / 5,500 GET/秒**(プレフィックス分散でスケール)
- 整合性: 強い書き込み後読み取り整合性(現行仕様)
- ストレージクラス: Standard / **Intelligent-Tiering(パターン不明の既定解)** / Standard-IA(最低30日)/ One Zone-IA / Glacier Instant(90日)/ Flexible / **Deep Archive(最安・180日・12h取得)**
- **ライフサイクル**: 移行+失効。**旧バージョン・未完了マルチパートの削除**を忘れず
- レプリケーション: **CRR/SRR**(バージョニング必須)。**RTC で 15分 SLA**。双方向可・削除マーカー複製は任意
- セキュリティ: **Block Public Access(アカウントレベル)**、バケットポリシー、**Object Lock(WORM・Compliance は解除不可)**、アクセスポイント、**OAC**(CloudFront)
- 暗号化: SSE-S3(既定)/ SSE-KMS(+Bucket Key でコスト減)/ SSE-C / クライアントサイド
- イベント: EventBridge 連携(フィルタ強力)/ S3 通知(SQS/SNS/Lambda)
- **S3 Batch Operations**: 既存オブジェクト一括処理(コピー・タグ・Lambda・リストア)
- Transfer Acceleration(遠隔アップロード)/ **Multi-Region Access Points** / Object Lambda(取得時変換)
- Storage Lens(組織全体の使用状況分析)

## EBS

- タイプ: **gp3(IOPS/スループット独立設定・gp2 より安い)** / io2 Block Express(〜256K IOPS・99.999%)/ st1 / sc1
- **io1/io2 のみマルチアタッチ**(クラスタ対応 FS 必須)
- スナップショット: 増分・S3 保存・**クロスリージョン/アカウントコピー**(暗号化スナップは再暗号化必要)。**DLM / AWS Backup で自動化**
- **Fast Snapshot Restore**: 復元直後の性能劣化(初期化)を排除
- AZ 内リソース。AZ 跨ぎはスナップショット経由
- 暗号化: 作成時のみ設定可(既存は「スナップ→暗号化コピー→再作成」)

## インスタンスストア

- 物理アタッチ NVMe・**最高 IOPS**・エフェメラル(stop で消える)
- 「一時データ・スクラッチ・最高性能」で正解になる

## EFS

- NFS・**マルチ AZ 標準(One Zone もあり)**・数千同時マウント・Linux のみ
- パフォーマンスモード: General Purpose / Max I/O(超並列・レイテンシー増)
- スループットモード: Bursting / Provisioned / **Elastic(スパイク対応・既定解化)**
- **EFS-IA / Archive + ライフサイクル**でコスト削減
- アクセスポイント(アプリ別 root/権限)。**クロスリージョンレプリケーション対応**
- オンプレからも DX/VPN 経由でマウント可

## FSx(使い分け最頻出)

| 製品 | キーワード |
|---|---|
| **FSx for Windows File Server** | **SMB・AD 統合・Windows ACL**(Windows ファイルサーバー移行) |
| **FSx for Lustre** | **HPC・ML・S3 連携**(lazy load/export)・数百 GB/s |
| **FSx for NetApp ONTAP** | **NFS+SMB 両対応・SnapMirror でオンプレ NetApp から移行**・重複排除・iSCSI |
| FSx for OpenZFS | NFS・ZFS スナップショット・低レイテンシー |

## Storage Gateway(ハイブリッド)

- **File Gateway**: NFS/SMB → S3(ローカルキャッシュ)。移行後のオンプレ継続アクセスに
- **Volume Gateway**: iSCSI。**Cached**(プライマリ S3・キャッシュのみローカル)/ **Stored**(全量ローカル・非同期バックアップ)
- **Tape Gateway**: 仮想テープ(VTL)→ バックアップソフトそのまま・Glacier 保管
- **S3 File Gateway vs DataSync**: 継続的なハイブリッド共存 = Gateway、移行・同期 = DataSync

## AWS Backup

- 対象: EBS/EC2/RDS/Aurora/DynamoDB/EFS/FSx/Storage Gateway/VMware 等を一元管理
- **クロスリージョン・クロスアカウントコピー**、**Backup Vault Lock(WORM)**
- **Organizations のバックアップポリシーで全社強制**
- 復元テスト機能(定期検証)

## Elastic Disaster Recovery (DRS)

- ブロックレベル継続レプリケーション → **RPO 秒・RTO 分**
- **Pilot Light の実装手段**(低コストのステージング領域に複製)

## 定番シナリオ即答

- 「Windows ファイルサーバーを AWS へ(AD 権限維持)」→ FSx for Windows
- 「オンプレ NetApp から移行」→ FSx for ONTAP (SnapMirror)
- 「S3 のデータで ML トレーニング(高速 FS)」→ FSx for Lustre
- 「テープバックアップ廃止」→ Tape Gateway
- 「ランサムウェア対策のバックアップ」→ AWS Backup + **Vault Lock**

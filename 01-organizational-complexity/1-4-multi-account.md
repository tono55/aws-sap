# 1.4 マルチアカウント AWS 環境の設計(最頻出トピック)

## 試験で問われる観点

- AWS Organizations の機能(OU 設計、SCP、委任管理者)
- Control Tower によるガバナンス自動化
- アカウント間のリソース共有(RAM)
- 既存アカウントの統合・移動シナリオ

## AWS Organizations の基本

- **一括請求 (Consolidated Billing)**: 全アカウントの請求を管理アカウントへ集約。**ボリューム割引・RI/Savings Plans の共有**が組織全体に効く
- **OU (Organizational Unit)**: アカウントのグループ。**SCP・各種ポリシーは OU 階層に継承**される
- **委任管理者 (Delegated Administrator)**: GuardDuty, Security Hub, Config, CloudTrail, StackSets 等の組織管理を管理アカウント以外(セキュリティアカウント)に委任 — ベストプラクティス
- 管理アカウントでは**ワークロードを動かさない**(SCP が効かないため)
- ポリシータイプ: **SCP** / **タグポリシー**(タグの標準化)/ **バックアップポリシー**(AWS Backup 計画の強制)/ AI サービスオプトアウトポリシー / **RCP (Resource Control Policy)**(リソース側の上限)

## SCP 設計パターン(頻出)

- SCP は**ガードレール(最大権限の制限)**。Allow を書いても権限は付与されない
- 評価: ルートから対象アカウントまでの**全階層で許可されている必要がある**(FullAWSAccess を外すと deny-list 方式から allow-list 方式になる)
- 定番 SCP 例:
  - リージョン制限: `Deny` + `aws:RequestedRegion` 条件(グローバルサービス除外)
  - **CloudTrail / Config の無効化禁止**: `cloudtrail:StopLogging` 等を Deny
  - ルートユーザーの使用禁止: `aws:PrincipalArn` = root を Deny
  - 特定サービスのみ許可(サンドボックス OU)
  - タグなしリソース作成の禁止(`aws:RequestTag` 条件)
- SCP が影響**しない**もの: 管理アカウント、サービスにリンクされたロール、組織外プリンシパルのリソースベースポリシー評価(→ RCP がカバー)

## 推奨 OU 構成(AWS 標準ガイダンス)

```
Root
├─ Security OU     … Log Archive / Security Tooling(委任管理者)
├─ Infrastructure OU … ネットワーク(TGW/DX 集約)・共有サービス
├─ Workloads OU    … Prod / SDLC(dev, test)を分ける
├─ Sandbox OU      … 実験用(緩い SCP・予算制限)
├─ Suspended OU    … 退役アカウント(全拒否 SCP)
└─ ...
```

- **環境(prod/dev)で OU を分ける**のが基本(会社の組織図をそのまま写さない)
- ネットワークアカウントに TGW / DX / Resolver を集約し、**RAM で共有**するのが定番

## AWS Control Tower

- ランディングゾーンの自動セットアップ(Organizations + Log Archive/Audit アカウント + 標準ガードレール)
- **コントロール(ガードレール)**: 予防的(SCP)/ **検出的(Config Rules)** / プロアクティブ(CloudFormation フック)
- **Account Factory**: 標準化されたアカウントの払い出し(Service Catalog ベース)。**AFT (Account Factory for Terraform)** / Customizations for Control Tower でカスタマイズ
- 「新規アカウントを標準構成・ガードレール付きで量産したい」→ Control Tower が既定解(自前 Organizations + StackSets は「既存の複雑な要件」がある場合)

## リソース共有(RAM)

- 共有できる主なもの: **サブネット(VPC 共有)**, **TGW**, Route 53 Resolver ルール, License Manager 設定, Outposts, Service Catalog 等
- **VPC 共有 (VPC Sharing)**: 1つの VPC のサブネットを複数アカウントで使用 — 「アカウントは分けたいが VPC は一元管理したい」「VPC 数・IP 空間を節約」の正解
- 組織内共有なら招待承諾が不要(組織との共有を有効化)

## アカウント移行・統合シナリオ

- **既存アカウントの組織への参加**: 招待 → 承諾。SCP・請求が適用される。**旧組織から離脱してから**新組織へ
- アカウント移動しても**リソースは無停止**(IAM・請求の管理系が変わるだけ)
- 会社合併シナリオ: 両組織の統合は「片方のアカウントを1つずつ移行」(組織同士のマージ機能はない)
- RI/SP 共有の範囲を管理したい → 一括請求の **RI 共有設定を無効化**できる(アカウント単位)

## 頻出のひっかけポイント

- 「SCP を Allow で書いたのに使えない」→ SCP は権限付与しない(IAM 側で Allow が必要)
- 「管理アカウントの利用を制限したい」→ SCP では不可能。**管理アカウントを使わない運用**にする
- タグの強制: **タグポリシー(監査)+ SCP の `aws:RequestTag` 条件(作成拒否)** の組み合わせ
- 「複数アカウントで同じ VPC/サブネットを使いたい」→ RAM の VPC 共有(Peering ではない)
- Control Tower の検出的ガードレールは **AWS Config ルール**の実装(修復は自動でないものもある)
- 組織トレイル・組織 Config は**メンバーアカウントから削除・停止できない**(これが集中管理の利点)

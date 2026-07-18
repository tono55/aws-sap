# チートシート: ネットワーキング

## VPC 基礎(Pro で問われる部分)

- サブネットは AZ 単位。各サブネットで AWS が5 IP 予約
- セカンダリ CIDR 追加可(枯渇対応)。CIDR は /16〜/28
- SG = ステートフル・Allow のみ / NACL = ステートレス・Deny 可・番号順評価
- **SG 参照**(他 SG をソース指定)で IP に依存しない制御。Peering 先の SG 参照は同一リージョンのみ
- VPC Flow Logs: ACCEPT/REJECT の記録(ペイロードは見えない)。宛先 S3 / CW Logs / Firehose

## VPC 間・オンプレ接続の使い分け(最頻出)

| 要件 | 解 |
|---|---|
| 2〜3 VPC を安く接続 | VPC Peering(非推移) |
| 多数 VPC + オンプレのハブ | **Transit Gateway** |
| 特定サービスだけ公開 / CIDR 重複 | **PrivateLink** |
| サブネット自体を他アカウントと共用 | RAM の VPC 共有 |
| マルチリージョン・グローバル統合管理 | Cloud WAN / TGW ピアリング |

## Transit Gateway

- リージョナル。リージョン間は **TGW ピアリング(静的ルートのみ)**
- ルートテーブルの**関連付け (association)** と**伝播 (propagation)** でセグメンテーション
- **ECMP** で VPN 帯域スケール。**アプライアンスモード**で検査 VPC の対称ルーティング
- RAM で組織内共有が定番

## Direct Connect

- 専用: 1/10/100/400 Gbps。ホスト: 50 Mbps〜10 Gbps。**開通に数週間以上**
- VIF 3種: **Private**(VPC)/ **Public**(AWS パブリックサービス)/ **Transit**(DX GW→TGW)
- **DX Gateway**: 複数リージョンの VGW/TGW へ。**VPC 間の推移的通信は不可**
- **暗号化されない** → 必要なら DX 上の VPN or MACsec
- 冗長化: DX + VPN バックアップ(安価)/ DX×2 拠点(最高 SLA)
- BFD で高速障害検知

## Site-to-Site VPN

- 1接続 = 2トンネル、トンネルあたり **最大 1.25 Gbps**(TGW+ECMP で束ねる)
- Accelerated VPN(Global Accelerator 経由)

## Route 53

- ルーティング: Simple / **Weighted**(段階移行)/ **Latency** / **Failover** / **Geolocation**(所在地=コンプラ用途)/ Geoproximity(バイアス調整)/ Multivalue
- **Alias レコード**: AWS リソースへは zone apex も可・無料
- ヘルスチェック: パブリックエンドポイント対象。プライベートは **CloudWatch アラーム連動**で代替
- **Resolver**: Inbound(オンプレ→AWS)/ Outbound(AWS→オンプレ)+ 転送ルール(RAM 共有可)
- DNSSEC 対応。クエリログ取得可
- **ARC (Application Recovery Controller)**: 確実な手動フェイルオーバー・readiness check

## CloudFront

- **OAC** で S3 オリジンを非公開化。オリジンフェイルオーバー(2オリジン)
- **CloudFront Functions**(閲覧者エッジ・軽量 JS・ヘッダー/リダイレクト)vs **Lambda@Edge**(リージョナルエッジ・Node/Python・オリジンリクエスト改変や認可)
- 署名付き URL/Cookie(有料コンテンツ)、フィールドレベル暗号化
- WAF/Shield Advanced をアタッチ可。地域制限(Geo restriction)

## Global Accelerator

- **静的 Anycast IP×2**。TCP/UDP(L4)。キャッシュなし
- **DNS キャッシュに影響されない即時フェイルオーバー** — CloudFront との対比で頻出
- 用途: 非 HTTP、固定 IP 要件、マルチリージョン API/ゲーム/VoIP

## ELB

- **ALB**: L7、パス/ホスト/ヘッダールーティング、Lambda ターゲット、認証統合(Cognito/OIDC)
- **NLB**: L4、超高スループット・低レイテンシー、**静的 IP/EIP**、TLS パススルー、PrivateLink の基盤
- **GWLB**: サードパーティアプライアンス挿入(GENEVE)。検査のスケールアウト
- クロスゾーン負荷分散: ALB 常時オン(無料)/ NLB オプション(AZ 間転送課金)

## VPC エンドポイント

- **Gateway 型: S3/DynamoDB・無料**・ルートテーブル方式(同一 VPC 内からのみ)
- **Interface 型 (PrivateLink)**: ENI 方式・ほぼ全サービス・**オンプレからも DX/VPN 経由で利用可**
- エンドポイントポリシーで対象リソース制限(例: 組織のバケットのみ)

## 数値・制限の要点

- VPN トンネル: 1.25 Gbps/本
- VPC Peering: 推移なし・CIDR 重複不可
- NAT GW: AZ 障害対策で **AZ ごとに配置**、〜100 Gbps/個
- プレイスメントグループ Spread: AZ あたり 7 インスタンス

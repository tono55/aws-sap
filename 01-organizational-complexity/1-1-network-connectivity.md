# 1.1 ネットワーク接続戦略の設計

## 試験で問われる観点

- オンプレミス接続(Direct Connect / VPN)の帯域・冗長性・暗号化要件への対応
- 多数の VPC / アカウントの相互接続方式(TGW / Peering / PrivateLink)の選択
- ハイブリッド環境の DNS 解決(Route 53 Resolver)
- IP アドレス設計(重複 CIDR への対処、IPAM)

## オンプレミス接続の選択

| 方式 | 帯域 | 特徴 |
|---|---|---|
| **Site-to-Site VPN** | トンネルあたり最大 1.25 Gbps | 数分〜数時間で開通・安価・**インターネット経由(暗号化あり)**。2トンネル/接続 |
| **Direct Connect (DX) 専用線** | 1/10/100/400 Gbps | 専有・安定・低レイテンシー。**開通に数週間〜数か月**。**デフォルトでは暗号化されない** |
| DX ホスト接続 | 50 Mbps〜10 Gbps | パートナー経由の小容量 |
| **DX + VPN バックアップ** | — | 定番の冗長構成(コスト重視) |
| DX 2本(別ロケーション) | — | 最高の可用性(SLA 要件が厳しい場合) |

- **仮想インターフェイス (VIF)**: Private VIF(VPC へ)/ Public VIF(S3 等パブリックサービスへ)/ **Transit VIF(DX Gateway 経由で TGW へ)**
- **DX Gateway**: 1つの DX から**複数リージョン**の VGW/TGW へ接続(グローバルリソース)。ただし DX Gateway 経由で **VPC 間の相互通信はできない**(オンプレ⇔VPC のみ)
- **DX の暗号化**: 要件にあれば「**DX 上で VPN (IPsec)**」(Public VIF 経由で VGW/TGW へ VPN)または MACsec(10/100 Gbps 専用接続)
- **ECMP**: TGW + 複数 VPN トンネルで帯域をスケール(VPN で 1.25 Gbps を超えたい場合)

**判断基準**: 「今すぐ・安く」→ VPN。「安定帯域・大容量・低レイテンシー」→ DX。「DX の障害に備えつつ安価に」→ DX + VPN フェイルオーバー。「暗号化必須の DX」→ DX 上に VPN。

## VPC 間接続の選択(最頻出)

| 方式 | スケール | 特徴 |
|---|---|---|
| **VPC Peering** | 2 VPC 間(フルメッシュは n(n-1)/2) | 非推移的。低コスト・低レイテンシー・帯域制限なし。**少数 VPC(〜10未満)なら最安** |
| **Transit Gateway (TGW)** | 数千 VPC | **ハブ&スポーク・推移的ルーティング**。ルートテーブルでセグメンテーション。リージョナル(**ピアリングでリージョン間接続**)。処理料金あり |
| **PrivateLink (Interface Endpoint)** | 1サービス単位 | **単方向・特定サービスの公開**。**CIDR 重複でも OK**。NLB (+ALB) の背後にサービスを置く |
| **VPC Lattice** | アプリ層 | サービス間通信のメッシュ(L7)。アプリケーションレベルの接続と認可 |
| **Cloud WAN** | グローバル | 複数リージョン・拠点をポリシーベースで統合管理(TGW の上位互換的な位置付け) |

**判断基準**:
- 「**数十〜数百 VPC の相互接続**」「オンプレも含めたハブ」→ **TGW**
- 「**2〜3 VPC だけ・最小コスト**」→ VPC Peering
- 「**自社サービスを他アカウント/他社に公開**(全ネットワークは見せない)」「**CIDR が重複**」→ **PrivateLink**
- 「SaaS プロバイダーとして数千顧客に提供」→ PrivateLink(エンドポイントサービス)

### TGW の設計ポイント

- アタッチメント: VPC / VPN / DX (Transit VIF) / TGW ピアリング / Connect (SD-WAN, GRE)
- **TGW ルートテーブルで分離**: 本番と開発を同じ TGW につないでも、ルートテーブルの関連付け/伝播で通信可否を制御(「開発 VPC 同士は通信不可、共有サービス VPC へは全員可」など)
- **アプライアンスモード**: 検査 VPC(Network Firewall / サードパーティ)へ対称ルーティングを保証
- 共有: **AWS RAM で他アカウントに TGW を共有**(組織内共有が定番)

## ハイブリッド DNS(Route 53 Resolver)— 頻出

- **Inbound Endpoint**: オンプレ → AWS の名前解決(オンプレの DNS からフォワード先として指定)
- **Outbound Endpoint + 転送ルール**: AWS → オンプレの名前解決(`corp.example.com` はオンプレ DNS へ転送)
- **Private Hosted Zone (PHZ) の共有**: 複数 VPC に関連付け(クロスアカウントは CLI/API で関連付け、または RAM で Resolver ルールを共有)
- 定番構成: **中央ネットワークアカウントに Resolver エンドポイントを集約**し、転送ルールを RAM で全アカウントへ共有

## IP アドレス設計

- **CIDR 重複時の接続**: Peering/TGW は重複不可 → **PrivateLink** か **NAT + 二重 NAT**、または片方をリナンバー。「重複したまま特定サービスだけ使いたい」→ PrivateLink が定番正解
- **VPC への セカンダリ CIDR 追加**で枯渇に対応
- **Amazon VPC IPAM**: 組織全体の CIDR 割り当て管理・重複検出
- IPv6: Egress-only Internet Gateway(IPv6 のアウトバウンド専用、NAT GW の IPv6 版に相当)

## その他の頻出トピック

- **VPC エンドポイント**: Gateway 型(S3/DynamoDB、無料)と Interface 型(PrivateLink、その他ほぼ全サービス)。**エンドポイントポリシー**でアクセス制限(例: 自組織のバケットのみ)
- **オンプレから S3 へプライベート接続**: DX + Interface Endpoint(PrivateLink for S3)または Public VIF
- VPC Flow Logs: 接続トラブルシュート(ACCEPT/REJECT)。S3/CloudWatch Logs/Kinesis Firehose へ
- Network Access Analyzer / Reachability Analyzer: 経路の検証(実トラフィック不要)

## 頻出のひっかけポイント

- VPC Peering は**推移しない**。「A-B、B-C をピアリングしても A-C は通信不可」→ TGW へ移行が正解になりやすい
- DX Gateway は **VPC 間通信のハブにはならない**(オンプレとの通信のみ)
- VPN の帯域不足 → **TGW + ECMP で複数トンネル**(単一トンネルは 1.25 Gbps 上限)
- 「DX で S3 にアクセス」: Public VIF または **Private VIF + Interface Endpoint**。Gateway Endpoint は**オンプレからは使えない**
- TGW はリージョナル。リージョン間は **TGW ピアリング**(静的ルートのみ、伝播なし)
- Resolver Inbound/Outbound の向きを混同しない(Inbound = オンプレ**から**来るクエリを受ける)

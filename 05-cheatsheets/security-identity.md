# チートシート: セキュリティ・アイデンティティ

## IAM

- 評価順: **明示的 Deny > SCP > Permissions Boundary > セッションポリシー > Allow**
- クロスアカウント: AssumeRole(信頼ポリシー+実行側 Allow)。サードパーティには **ExternalId**
- **Permissions Boundary**: ユーザー/ロールの最大権限(委任管理シナリオ)
- **IAM Access Analyzer**: 外部公開の検出・未使用権限・ポリシー生成(CloudTrail から)
- 条件キー頻出: `aws:PrincipalOrgID` / `aws:RequestedRegion` / `aws:RequestTag` / `aws:SourceVpce` / `aws:MultiFactorAuthPresent`
- **IAM Roles Anywhere**: オンプレのワークロードに X.509 で一時認証情報

## Organizations / SCP

- SCP = **ガードレール(権限付与しない)**。管理アカウント・サービスリンクロールに効かない
- OU 階層に継承。全階層で許可が必要
- ポリシー種別: SCP / RCP / **タグポリシー** / **バックアップポリシー** / AI オプトアウト
- **委任管理者**でセキュリティ系サービスの管理をセキュリティアカウントへ
- 一括請求: ボリューム割引合算・**RI/SP 共有(無効化可)**

## IAM Identity Center(旧 AWS SSO)

- マルチアカウント SSO の既定解。外部 IdP と SAML 2.0 / **SCIM で自動プロビジョニング**
- **権限セット** → 各アカウントに IAM ロールとして展開
- CLI v2 の SSO ログイン対応

## Directory Service

- **Managed Microsoft AD**: 本物の AD。**オンプレと信頼関係**。Windows ワークロード対応
- **AD Connector**: プロキシのみ(AWS にデータ保存なし)。既存 AD の認証をそのまま
- Simple AD: 小規模・安価(信頼関係不可)

## KMS

- CMK 種別: AWS マネージド / カスタマーマネージド / **インポート (BYOK・自動ローテ不可)** / **カスタムキーストア (CloudHSM)**
- **エンベロープ暗号化**(GenerateDataKey)。直接 Encrypt は 4KB まで
- クロスアカウント: **キーポリシー + IAM の両方**
- **マルチリージョンキー**(DR・グローバルテーブル暗号化)
- grant: 一時的・プログラム的な権限付与
- S3 Bucket Key で KMS コスト削減

## CloudHSM

- **FIPS 140-2 Level 3**・シングルテナント・鍵は完全に顧客管理
- SSL オフロード、Oracle TDE、独自 CA 用途

## 境界防御

| サービス | 覚え方 |
|---|---|
| WAF | L7(SQLi/XSS/レート制限/ボット)。CloudFront/ALB/API GW/AppSync(**NLB 不可**) |
| Shield Standard | 無料・自動 L3/L4 |
| Shield Advanced | DRT 支援・**DDoS コスト保護**・高度な検知 |
| Network Firewall | VPC の IDS/IPS・ドメインフィルタ(検査 VPC + TGW 構成) |
| **Firewall Manager** | 上記+SG を**組織全体に強制適用** |

## 検知・監査サービス(混同注意)

| サービス | 一言 |
|---|---|
| **GuardDuty** | 脅威検知(有効化のみ・エージェント不要) |
| **Inspector** | 脆弱性スキャン(EC2/ECR/Lambda) |
| **Macie** | S3 の PII 検出 |
| **Security Hub** | findings 集約 + 標準準拠スコア |
| **Detective** | 調査・根本原因分析 |
| **Config** | 構成コンプライアンス+変更履歴 |
| **Audit Manager** | 監査証拠の自動収集 |
| **Artifact** | AWS の準拠レポート取得 |

## シークレット管理

- **Secrets Manager**: 自動ローテーション(RDS 等マネージド対応)・クロスアカウント共有・有料
- **SSM Parameter Store**: Standard 無料・ローテーションなし
- ACM: パブリック証明書無料・自動更新。**Private CA** で内部 PKI

## Cognito

- **User Pool** = 認証(サインイン、JWT 発行、Hosted UI、MFA)
- **Identity Pool** = AWS 認証情報の払い出し(ゲストアクセス可)

## 定番シナリオ即答

- 組織内のみ S3 アクセス → バケットポリシー `aws:PrincipalOrgID`
- リージョン利用制限 → SCP `aws:RequestedRegion`(グローバルサービス除外)
- ルートユーザー禁止 → SCP `aws:PrincipalArn`
- 公開バケットを作らせない → **アカウントレベル Block Public Access + SCP で変更禁止**
- 規制で n 年間ログ削除不可 → S3 **Object Lock Compliance モード** / Backup Vault Lock

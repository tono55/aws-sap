# 2.3 要件に基づくセキュリティ統制の決定

## 試験で問われる観点

- 暗号化要件(保存時/転送時、キー管理の主体)からキー管理方式を選択できるか
- 境界防御(WAF / Shield / Network Firewall)の適材適所
- 監査・コンプライアンス要件(証跡、改ざん防止)を満たす構成

## 暗号化とキー管理

| 要件 | 選択 |
|---|---|
| 標準的な保存時暗号化(運用負荷最小) | KMS の AWS マネージドキー / カスタマーマネージドキー (CMK) |
| キーローテーションを自動で | KMS CMK の自動ローテーション(1年ごと。インポートキーは不可) |
| キーマテリアルを自社で生成・管理したい | KMS への **キーインポート (BYOK)** |
| **FIPS 140-2 Level 3** / 専有 HSM が必須 | **CloudHSM**(または KMS カスタムキーストア経由) |
| キーの利用をリージョン跨ぎで(DR) | KMS **マルチリージョンキー** |
| S3 で暗号化しつつ、鍵を AWS に渡さない | SSE-C(顧客提供キー)またはクライアントサイド暗号化 |
| 大量オブジェクトの KMS コスト削減 | **S3 Bucket Key**(KMS API 呼び出しを削減) |

- **エンベロープ暗号化**: KMS はデータキーを暗号化(GenerateDataKey)。4KB 超のデータは直接 Encrypt できない
- **KMS キーポリシー**: クロスアカウント利用は「キーポリシーで相手アカウント許可 + 相手側 IAM ポリシー」の両方が必要 — 頻出
- 転送時暗号化: ACM で TLS 証明書(パブリック証明書は無料・自動更新)。**ACM Private CA** で内部向け証明書。ALB/NLB/CloudFront に関連付け

## 境界防御・ネットワークセキュリティ

| サービス | 防ぐもの | 適用先 |
|---|---|---|
| **AWS WAF** | L7 攻撃(SQLi/XSS/ボット/レートベース) | CloudFront, ALB, API Gateway, AppSync |
| **Shield Standard** | 一般的な L3/L4 DDoS(無料・自動) | 全アカウント |
| **Shield Advanced** | 大規模 DDoS + DRT サポート + **コスト保護** | CloudFront, Route 53, ALB, EIP 等 |
| **Network Firewall** | VPC レベルの IDS/IPS、ドメイン/プロトコルフィルタ | VPC(検査用サブネット) |
| Firewall Manager | WAF/Shield/SG/Network Firewall ポリシーを**組織全体に一括適用** | Organizations 全体 |
| GWLB (Gateway Load Balancer) | サードパーティ仮想アプライアンスのスケーラブルな挿入(GENEVE) | インライン検査 |

**判断基準**: 「組織内全アカウントの ALB に WAF を強制」→ **Firewall Manager**。「アウトバウンドのドメインフィルタリング」→ **Network Firewall**(または NAT 経由のプロキシ)。「サードパーティ IPS 製品を使う」→ **GWLB**。

## アプリケーション層のセキュリティ

- **Secrets Manager**: 認証情報の保存 + **自動ローテーション**(RDS 等はマネージド対応)。「DB パスワードの自動ローテーション」→ Secrets Manager(Parameter Store はローテーション機能なし)
- **SSM Parameter Store**: 設定値・シークレット(Standard は無料)。ローテーション不要ならこちらが低コスト
- **Cognito**: アプリのユーザー認証(User Pool)と一時的 AWS 認証情報の付与(Identity Pool)
- API Gateway の認可: Cognito オーソライザー / Lambda オーソライザー / IAM 認証 / リソースポリシー(IP 制限等)
- S3 の署名付き URL / CloudFront 署名付き URL・Cookie(OAC でオリジンを CloudFront 経由に限定)

## 監査・証跡

- **CloudTrail**: API 証跡。**組織トレイル (organization trail)** で全アカウント一括。**ログファイル整合性検証 (log file validation)** で改ざん検知。S3 + MFA Delete / Object Lock で保護
- **CloudWatch Logs**: アプリ/システムログ。KMS 暗号化、サブスクリプションフィルタで Kinesis/Lambda へ
- **S3 Object Lock**: WORM(Governance / **Compliance モードは root でも解除不可**)。「規制で n 年間削除不可」→ Object Lock Compliance モード
- **AWS Config**: 構成変更の記録と評価(詳細は 3-2)
- **Amazon Macie**: S3 内の PII 検出。「機密データが S3 に含まれていないか検出」→ Macie

## 頻出のひっかけポイント

- 「キーを完全に自社管理(AWS がアクセス不可)」→ CloudHSM / SSE-C / クライアントサイド暗号化。KMS CMK は AWS 管理インフラ上
- KMS インポートキー(BYOK)は**自動ローテーション不可**(手動で新キーマテリアル)
- Shield Advanced の「DDoS によるコスト増を補償(cost protection)」はこのサービス固有の特徴
- WAF は NLB に**アタッチできない**(CloudFront/ALB/API Gateway/AppSync のみ)
- 「組織の全アカウントで新規リソースにも自動で WAF ルール適用」→ Firewall Manager(WAF 単体では組織適用不可)
- CloudTrail の改ざん検知は「ログファイル整合性検証」。保管の削除防止は S3 Object Lock

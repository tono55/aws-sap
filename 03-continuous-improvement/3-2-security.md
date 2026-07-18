# 3.2 セキュリティを改善する戦略

## 試験で問われる観点

- 既存環境のセキュリティホール(平文シークレット、過剰権限、未パッチ、公開リソース)の検出と修復
- 脅威検知 → 自動修復のパイプライン構築
- コンプライアンス継続監視

## 検知サービスの使い分け(暗記必須)

| サービス | 検知対象 | データソース |
|---|---|---|
| **GuardDuty** | **脅威(不正アクセス・マルウェア・暗号通貨マイニング等)** | CloudTrail, VPC Flow Logs, DNS ログ, EKS 監査ログ, S3 データイベント等 |
| **Inspector** | **脆弱性(CVE)・意図しないネットワーク露出** | EC2 (SSM 経由), ECR イメージ, Lambda |
| **Macie** | **S3 内の機密データ (PII)** | S3 オブジェクト |
| **Security Hub** | **上記の集約 + セキュリティ標準チェック**(CIS, AWS Foundational 等) | 各サービスの findings |
| **Detective** | インシデントの**調査・根本原因分析** | GuardDuty findings 等の関連付け |
| **Config** | **構成のコンプライアンス**(暗号化未設定、公開 SG 等) | リソース構成 |
| IAM Access Analyzer | 外部共有リソース・未使用権限 | ポリシー解析 |
| CloudTrail Insights | 異常な API 活動量 | CloudTrail |

**判断基準**: 「EC2 が C&C サーバーと通信している」→ GuardDuty。「OS の CVE を継続スキャン」→ Inspector。「S3 に個人情報がないか」→ Macie。「複数アカウントの findings を1画面に」→ Security Hub(委任管理者)。「侵害の経緯を調査」→ Detective。

## 自動修復パターン(頻出)

```
GuardDuty/Config/Security Hub → EventBridge → Lambda / SSM Automation → 修復
```

| シナリオ | 修復例 |
|---|---|
| SG が 0.0.0.0/0 で SSH 開放 | Config ルール (`restricted-ssh`) + **自動修復(SSM Automation)** で閉じる |
| S3 バケットが公開された | Config ルール + 自動修復 / **アカウントレベルの S3 Block Public Access を有効化**(予防) |
| 侵害された EC2 | EventBridge → Lambda で**隔離 SG に付け替え + スナップショット保全**(フォレンジック) |
| アクセスキー漏えい検知 | GuardDuty finding → キー無効化 + 通知 |
| 非準拠リソースの一括是正 | Security Hub の**自動化ルール** / カスタムアクション |

- **予防 (SCP / IAM / Block Public Access) > 検出+修復** の順で検討。「そもそも作れなくする」選択肢があれば強い

## シークレット・認証情報の改善

- ハードコードされた DB パスワード → **Secrets Manager**(+自動ローテーション)
- EC2 に置いたアクセスキー → **インスタンスプロファイル(IAM ロール)** — 定番の改善
- オンプレサーバーの長期キー → **IAM Roles Anywhere**
- 過剰な IAM 権限 → **IAM Access Analyzer の未使用アクセス分析 / CloudTrail ベースのポリシー生成**で最小権限化
- IMDSv2 の強制(SSRF 対策)— `HttpTokens=required`

## パッチ・脆弱性管理

- **Patch Manager**(ベースライン + メンテナンスウィンドウ + パッチグループ)で自動化
- コンテナ: **ECR の拡張スキャン(Inspector 連携)** + CI でのイメージスキャン
- 「パッチ適用済みの標準 AMI を組織で配る」→ **EC2 Image Builder + AMI の共有(RAM/Organizations)**

## コンプライアンス継続監視

- **AWS Config**: マネージドルール + カスタムルール(Lambda / Guard)。**コンフォーマンスパック**でルール集を一括展開。組織アグリゲーターで全社集約
- **Security Hub のセキュリティ標準**: CIS AWS Foundations / PCI DSS / AWS Foundational Security Best Practices のスコア化
- **Audit Manager**: 監査証拠の自動収集(フレームワーク別)
- **AWS Artifact**: AWS 側の準拠レポート(SOC, ISO)のダウンロード

## 頻出のひっかけポイント

- GuardDuty は「**有効化するだけ**」で機能する(エージェント不要)。Inspector の EC2 スキャンは **SSM エージェント**経由
- Config は「望ましい構成かどうか」、GuardDuty は「悪意ある活動」— 問題文の主語で判別
- Security Hub 自体は検知エンジンではなく**集約・標準チェック**
- 「公開 S3 を今後一切作らせない」→ **アカウント/組織レベル Block Public Access(+SCP で設定変更禁止)**(Config 修復は事後対応)
- Trusted Advisor にもセキュリティチェックがあるが、継続的コンプライアンスは Config/Security Hub が本命

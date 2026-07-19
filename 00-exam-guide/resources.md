# SAP-C02 試験対策 情報ソース集

試験対策に有効な外部リソースを「何に使うか・学習のどの段階で使うか」の説明付きでまとめる。
リンク切れを避けるため、公式ドメインの安定したページを優先している。

## 1. 公式・必須(まずここから)

| リソース | 用途 |
|---|---|
| [AWS Certified Solutions Architect – Professional 公式ページ](https://aws.amazon.com/jp/certification/certified-solutions-architect-professional/) | 試験の最新情報・申込の起点。**受験前に必ず最新の試験ガイドをここから確認** |
| [公式試験ガイド (SAP-C02)](https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-professional-02/solutions-architect-professional-02.html) | 出題範囲の一次情報。本リポジトリの [00-exam-guide](./README.md) の元ネタ |
| [公式サンプル問題 PDF](https://d1.awsstatic.com/training-and-certification/docs-sa-pro/AWS-Certified-Solutions-Architect-Professional_Sample-Questions.pdf) | 本番の問題文の「長さと癖」を最初に体感する(10問) |
| [AWS Skill Builder — SAP-C02 Exam Prep](https://skillbuilder.aws/category/exam-prep/solutions-architect-professional-SAP-C02) | 公式の試験対策コース群の入口 |
| AWS Skill Builder — **Official Practice Question Set**(上記ページから。無料・20問) | 公式の練習問題。**解説と参照リンク付き**で、無料枠ならまずこれ |
| AWS Skill Builder — **Official Practice Exam**(有料サブスクリプション・75問) | 本番と同形式・同時間のフル模試。直前期の実力測定に |

**使い方**: サンプル問題 → 学習ノート一巡 → Official Practice Question Set → 弱点補強 → Official Practice Exam(直前)の順が効率的。

## 2. Well-Architected Framework(判断軸の一次情報)

| リソース | 用途 |
|---|---|
| [AWS Well-Architected 公式ページ](https://aws.amazon.com/jp/architecture/well-architected/) | 6本の柱ホワイトペーパーへの入口。本リポジトリの [well-architected.md](./well-architected.md) の原典 |
| [Well-Architected Framework ドキュメント](https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html) | 柱・設計原則・ベストプラクティスの全文(英語推奨。日本語版もあり) |
| [ホワイトペーパー: Disaster Recovery of Workloads on AWS](https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-workloads-on-aws.html) | **DR 4パターンの原典**。[2-2](../02-new-solutions/2-2-business-continuity.md) を深掘りするならこれ |
| [ホワイトペーパー: Organizing Your AWS Environment Using Multiple Accounts](https://docs.aws.amazon.com/whitepapers/latest/organizing-your-aws-environment/organizing-your-aws-environment.html) | **推奨 OU 構成の原典**。[1-4](../01-organizational-complexity/1-4-multi-account.md) の深掘りに |
| [AWS ホワイトペーパー一覧](https://aws.amazon.com/jp/whitepapers/) | その他のホワイトペーパー(セキュリティ、ハイブリッド等)の検索起点 |

## 3. 公式ドキュメント・FAQ(サービス知識の裏取り)

**FAQ は試験問題の宝庫**。「よくある質問」の形式が、そのまま試験の選択肢の根拠になっていることが多い。頻出サービスの FAQ を通読する価値は高い。

| リソース | 用途 |
|---|---|
| [Amazon VPC FAQ](https://aws.amazon.com/jp/vpc/faqs/) / [Direct Connect FAQ](https://aws.amazon.com/jp/directconnect/faqs/) | Domain 1 のネットワーク(制限値・接続条件の裏取り) |
| [Amazon S3 FAQ](https://aws.amazon.com/jp/s3/faqs/) / [RDS FAQ](https://aws.amazon.com/jp/rds/faqs/) / [DynamoDB FAQ](https://aws.amazon.com/jp/dynamodb/faqs/) | ストレージ・DB の頻出論点 |
| [AWS Organizations FAQ](https://aws.amazon.com/jp/organizations/faqs/) | SCP・一括請求の細部 |
| [AWS アーキテクチャセンター](https://aws.amazon.com/jp/architecture/) | リファレンスアーキテクチャ集。「定番構成」を図で覚える |
| [AWS 規範ガイダンス (Prescriptive Guidance)](https://aws.amazon.com/jp/prescriptive-guidance/) | 移行戦略・マルチアカウント等の実践ガイド。Domain 4 の 7R の掘り下げに |
| [AWS ドキュメント総合](https://docs.aws.amazon.com/) | 個別機能の最終確認 |

## 4. 日本語リソース

| リソース | 用途 |
|---|---|
| [AWS Black Belt Online Seminar 一覧(AWS 公式ブログ)](https://aws.amazon.com/jp/blogs/news/aws-blackbelt-overview/) | **サービス別の日本語解説資料の決定版**。試験対象サービスで理解が浅いものは Black Belt の PDF/動画で補強するのが最短 |
| [AWS Black Belt — YouTube プレイリスト](https://www.youtube.com/playlist?list=PLzWGOASvSx6FIwIC2X1nObr1KcMCBBlqY) | 上記の動画版。通勤時間などの耳学習に |
| [Amazon Web Services ブログ(日本語)](https://aws.amazon.com/jp/blogs/news/) | 新機能・アップデートの日本語一次情報 |
| [DevelopersIO(クラスメソッド)](https://dev.classmethod.jp/) | 「やってみた」系の日本語記事が豊富。個別サービスの挙動確認・[Black Belt 一覧記事](https://dev.classmethod.jp/articles/blackbelt-list/)も有用 |
| [Qiita — SAP-C02 タグ検索](https://qiita.com/search?q=SAP-C02) | 合格体験記から「使った教材と期間」の相場観を得る |

## 5. 問題演習(サードパーティ)

| リソース | 用途・注意 |
|---|---|
| [Tutorials Dojo — SAP-C02 Practice Exams](https://portal.tutorialsdojo.com/courses/aws-certified-solutions-architect-professional-practice-exams/) | **解説の質に定評**のある英語模試(75問×複数セット)。不正解選択肢の理由まで説明されるため、解説を読むこと自体が学習になる |
| [Udemy — SAP-C02 コース検索](https://www.udemy.com/courses/search/?q=SAP-C02) | Stephane Maarek 氏の講座・模試などの定番教材。セール時に購入するのが通例。日本語の模試講座もあり |
| [ExamTopics — SAP-C02](https://www.examtopics.com/exams/amazon/aws-certified-solutions-architect-professional-sap-c02/) | 無料の問題プール。**ただし注意**: コミュニティ投稿ベースで「表示される正解」が誤っていることが多く、コメント欄の議論まで読んで自分で判断する必要がある。また実試験問題の転載(いわゆる dump)に該当するコンテンツは AWS 認定の規約違反となるため、位置づけを理解した上で扱うこと |

**模試の使い方**: 点数より「間違えた問題の分類」が重要。間違いをドメイン別に集計し、該当する本リポジトリのノートに戻る、を繰り返す。本番は 75 問 180 分(1問 2.4 分)なので、**時間を計って解く**練習を必ず入れる。

## 6. ハンズオン・動画

| リソース | 用途 |
|---|---|
| [AWS Workshops](https://workshops.aws/) | 公式ワークショップ集。Organizations・Transit Gateway・DR など「実務で触りにくい」Domain 1 系こそハンズオンで確認 |
| [AWS ハンズオン資料(日本語)](https://aws.amazon.com/jp/aws-jp-introduction/aws-jp-webinar-hands-on/) | 日本語のセルフペースハンズオン |
| [AWS Events — YouTube チャンネル](https://www.youtube.com/@AWSEventsChannel) | re:Invent セッション動画。深掘り系(300/400 レベル)のアーキテクチャ解説が SAP レベルに合う |
| [AWS Skill Builder(全般)](https://skillbuilder.aws/) | 無料デジタルコース多数。Exam Prep Enhanced コース(SAP-C02)はドメイン別の講義+演習 |

## 7. 受験手続き・特典

| リソース | 内容 |
|---|---|
| [AWS 認定 — 試験の申込 (AWS Certification)](https://aws.amazon.com/jp/certification/) | アカウント作成・申込の起点(試験は Pearson VUE で配信。テストセンター/自宅監督付きオンラインを選択) |
| **50% 割引バウチャー** | SAA など**既存の AWS 認定を保有していると、次の試験が 50% オフ**になるバウチャーが [AWS Certification アカウント](https://aws.amazon.com/jp/certification/benefits/)の特典ページから取得できる。SAP($300)に適用すれば $150 |
| 再受験ポリシー | 不合格の場合、**14日間**待てば再受験可能(回数制限なし・都度受験料) |
| 有効期限 | 合格から**3年間**。SAP に合格すると下位の SAA も自動更新される |

## 8. 学習フローへの組み込み方(まとめ)

| 段階 | 使うリソース |
|---|---|
| ① 判断軸の習得 | [well-architected.md](./well-architected.md) → W-A 公式ホワイトペーパー(必要な柱のみ) |
| ② 範囲の把握 | 公式試験ガイド + サンプル問題 PDF(問題の「長さ」を体感) |
| ③ ドメイン学習 | 本リポジトリのノート(01〜04)+ 理解の浅いサービスは **Black Belt** で補強 |
| ④ 知識の裏取り | サービス FAQ・ホワイトペーパー(DR / マルチアカウント) |
| ⑤ 問題演習 | Skill Builder 無料20問 → Tutorials Dojo / Udemy 模試(時間を計る)→ 間違いをノートに還元 |
| ⑥ 直前期 | [05-cheatsheets](../05-cheatsheets/README.md) + Official Practice Exam で最終測定 |
| ⑦ 申込 | 50% バウチャーを忘れずに適用 |

> **注**: 外部サイトの URL・価格・提供形態は変わることがある。特に Skill Builder のコース URL は変更されやすいため、リンク切れの場合はカテゴリページ(セクション1)から検索すること。

# AWS Certified Solutions Architect – Professional (SAP-C02) 学習リポジトリ

AWS ソリューションアーキテクト プロフェッショナル資格取得のための学習コンテンツ集。

**対象読者**: SAA (Solutions Architect – Associate) 取得済み・AWS 実務経験のある方。
Associate レベルの基礎知識は既知として、Professional 特有の内容(マルチアカウント設計、ハイブリッドネットワーク、移行戦略、設計トレードオフの判断)に集中した構成です。

## 試験概要(2026年7月時点の現行試験: SAP-C02)

| 項目 | 内容 |
|---|---|
| 試験コード | SAP-C02 |
| 問題数 | 75問(採点対象65問 + 採点対象外10問) |
| 形式 | 択一選択(multiple choice)/ 複数選択(multiple response) |
| 試験時間 | 180分 |
| 合格点 | 750(100–1000 のスケールスコア) |
| 受験料 | 300 USD |
| 言語 | 日本語で受験可能 |
| 有効期限 | 3年 |

### 出題ドメインと配点

| ドメイン | 配点 | 学習パート |
|---|---|---|
| 1. 組織の複雑さに対応する設計 | 26% | [01-organizational-complexity](./01-organizational-complexity/README.md) |
| 2. 新しいソリューションのための設計 | 29% | [02-new-solutions](./02-new-solutions/README.md) |
| 3. 既存のソリューションの継続的な改善 | 25% | [03-continuous-improvement](./03-continuous-improvement/README.md) |
| 4. ワークロードの移行とモダナイゼーションの加速 | 20% | [04-migration-modernization](./04-migration-modernization/README.md) |

## コンテンツ構成

| パート | 内容 |
|---|---|
| [00-exam-guide](./00-exam-guide/README.md) | 試験範囲の詳細(タスクステートメント・対象サービス一覧) |
| [学習リソース集](./00-exam-guide/resources.md) | 公式教材・日本語リソース・模試・ハンズオンのリンク集(用途の解説付き) |
| [01-organizational-complexity](./01-organizational-complexity/README.md) | Domain 1: ネットワーク接続・セキュリティ統制・信頼性・マルチアカウント・コスト |
| [02-new-solutions](./02-new-solutions/README.md) | Domain 2: デプロイ戦略・事業継続性・セキュリティ・信頼性・性能・コスト |
| [03-continuous-improvement](./03-continuous-improvement/README.md) | Domain 3: 運用・セキュリティ・性能・信頼性・コストの改善 |
| [04-migration-modernization](./04-migration-modernization/README.md) | Domain 4: 移行評価・7R 戦略・モダナイゼーション |
| [05-cheatsheets](./05-cheatsheets/README.md) | サービス別チートシート(試験直前の暗記用) |

## 使い方(推奨学習フロー)

1. **判断軸の習得** — [Well-Architected Framework 解説](./00-exam-guide/well-architected.md) を最初に読む。SAP の全問題の評価基準となる6本の柱とトレードオフの読み方を押さえる
2. **試験範囲の把握** — [00-exam-guide](./00-exam-guide/README.md) で全体像とタスクステートメントを確認
3. **ドメイン別学習** — 配点の大きい順(02 → 01 → 03 → 04)にノートを読み込む。各ノートは「テーマの背景 → Well-Architected との対応 → 仕組みと選定理由の解説 → ケーススタディ → 試験直前の要点」の構成
4. **模擬試験・問題演習** — AWS Skill Builder の公式練習問題や市販の模試で弱点を特定し、該当ノートに戻る(教材の選び方は[学習リソース集](./00-exam-guide/resources.md)を参照)
5. **直前対策** — [05-cheatsheets](./05-cheatsheets/README.md) で要点と使い分けを総復習

## SAP 試験の特徴(SAA との違い)

- **問題文が長い**: 1問あたり数百語のシナリオを 2.4 分/問 のペースで処理する必要がある。「要件キーワード(RTO/RPO、最小コスト、最小運用負荷、最小ダウンタイム)」を素早く抽出する訓練が重要
- **正解が複数ありえる中から「最適」を選ぶ**: 技術的に動く選択肢が複数並び、コスト・運用負荷・要件適合度で最適解を判断させる
- **組織規模の問題設定**: 単一アカウント/単一 VPC ではなく、複数アカウント・複数リージョン・オンプレミス接続を前提としたシナリオが中心

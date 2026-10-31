// 出題範囲(SAP-C02 公式試験ガイドのドメイン/タスクステートメント)
window.SAP = window.SAP || { questions: {} };
SAP.repo = "https://github.com/tono55/aws-sap/blob/claude/aws-solutions-architect-exam-20iizj/";
SAP.domains = [
  { id: "1", name: "組織の複雑さに対応する設計", weight: 26, tasks: [
    { id: "1.1", name: "ネットワーク接続戦略の設計", note: "01-organizational-complexity/1-1-network-connectivity.md" },
    { id: "1.2", name: "セキュリティ統制の規定", note: "01-organizational-complexity/1-2-security-controls.md" },
    { id: "1.3", name: "信頼性が高く回復性のあるアーキテクチャの設計", note: "01-organizational-complexity/1-3-reliable-resilient.md" },
    { id: "1.4", name: "マルチアカウント AWS 環境の設計", note: "01-organizational-complexity/1-4-multi-account.md" },
    { id: "1.5", name: "コスト最適化と可視化の戦略の決定", note: "01-organizational-complexity/1-5-cost-optimization.md" }
  ]},
  { id: "2", name: "新しいソリューションのための設計", weight: 29, tasks: [
    { id: "2.1", name: "ビジネス要件を満たすデプロイ戦略の設計", note: "02-new-solutions/2-1-deployment-strategy.md" },
    { id: "2.2", name: "事業継続性を確保するソリューションの設計", note: "02-new-solutions/2-2-business-continuity.md" },
    { id: "2.3", name: "要件に基づくセキュリティ統制の決定", note: "02-new-solutions/2-3-security-controls.md" },
    { id: "2.4", name: "信頼性要件を満たすソリューションの設計", note: "02-new-solutions/2-4-reliability.md" },
    { id: "2.5", name: "パフォーマンス目標を満たすソリューションの設計", note: "02-new-solutions/2-5-performance.md" },
    { id: "2.6", name: "コスト目標を満たすソリューションの決定", note: "02-new-solutions/2-6-cost-optimization.md" }
  ]},
  { id: "3", name: "既存のソリューションの継続的な改善", weight: 25, tasks: [
    { id: "3.1", name: "運用上の優秀性を高める戦略", note: "03-continuous-improvement/3-1-operational-excellence.md" },
    { id: "3.2", name: "セキュリティを改善する戦略", note: "03-continuous-improvement/3-2-security.md" },
    { id: "3.3", name: "パフォーマンスを改善する戦略", note: "03-continuous-improvement/3-3-performance.md" },
    { id: "3.4", name: "信頼性を改善する戦略", note: "03-continuous-improvement/3-4-reliability.md" },
    { id: "3.5", name: "コスト最適化の機会の特定", note: "03-continuous-improvement/3-5-cost.md" }
  ]},
  { id: "4", name: "ワークロードの移行とモダナイゼーションの加速", weight: 20, tasks: [
    { id: "4.1", name: "移行可能なワークロードの選定と評価", note: "04-migration-modernization/4-1-migration-assessment.md" },
    { id: "4.2", name: "移行方法(7R)と移行サービスの決定", note: "04-migration-modernization/4-2-migration-strategy.md" },
    { id: "4.3", name: "新しいアーキテクチャ・モダナイゼーション機会の決定", note: "04-migration-modernization/4-3-modernization.md" }
  ]}
];
SAP.add = function (task, list) {
  SAP.questions[task] = (SAP.questions[task] || []).concat(list);
};

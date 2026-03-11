import type { Article } from '../types';

const h = (hoursAgo: number) =>
  new Date(Date.now() - hoursAgo * 3600_000).toISOString();

export const mockArticles: Article[] = [
  // ── ホット ──────────────────────────────────────────────
  {
    id: '1',
    title: 'OpenAI、GPT-5を正式発表——マルチモーダル推論が大幅強化',
    source: 'Zenn',
    category: 'openai',
    publishedAt: h(1),
    summary:
      'OpenAIが次世代モデルGPT-5を発表。動画理解・長文コンテキスト・数学的推論が前世代比で2〜3倍向上。APIは段階的ロールアウト。',
    tags: ['GPT-5', 'マルチモーダル', 'API'],
    url: '#',
    isHot: true,
  },
  {
    id: '2',
    title: 'Anthropic、Claude 4を公開——「考える」プロセスをユーザーが観察可能に',
    source: 'note',
    category: 'anthropic',
    publishedAt: h(2),
    summary:
      'Claude 4では拡張思考モード（Extended Thinking）が強化され、推論ステップをストリーミングで可視化できる。コーディングベンチマークでSoTAを更新。',
    tags: ['Claude 4', '拡張思考', 'ベンチマーク'],
    url: '#',
    isHot: true,
  },
  {
    id: '3',
    title: 'Google DeepMind、Gemini 2.0 Ultraをリリース——長文処理100万トークンへ',
    source: 'Qiita',
    category: 'google',
    publishedAt: h(3),
    summary:
      'コンテキストウィンドウが100万トークンに拡張されたGemini 2.0 Ultraが一般提供開始。Google Workspaceへの統合も同時発表。',
    tags: ['Gemini 2.0', 'コンテキスト', 'Google'],
    url: '#',
    isHot: true,
  },

  // ── 今日の話題（today, not hot） ──────────────────────
  {
    id: '4',
    title: 'Meta、Llama 4をオープンウェイトで公開——商用利用制限が大幅緩和',
    source: 'Zenn',
    category: 'meta',
    publishedAt: h(4),
    summary:
      'Llama 4は70B〜400Bのパラメータ構成で提供。前世代の商用利用制限が撤廃され、企業での利用が容易に。日本語性能も大きく改善。',
    tags: ['Llama 4', 'OSS', 'Meta'],
    url: '#',
  },
  {
    id: '5',
    title: 'Claude for Workに新機能——Slackとの深い統合でAIがミーティング議事録を自動生成',
    source: 'note',
    category: 'anthropic',
    publishedAt: h(5),
    summary:
      'Anthropicが企業向けClaude for Workに新機能を追加。Slackと連携してミーティング文字起こしから議事録・アクションアイテムを自動生成する。',
    tags: ['Claude for Work', 'Slack', '議事録'],
    url: '#',
  },
  {
    id: '6',
    title: 'OpenAI、API料金を最大60%値下げ——GPT-4o miniが中心',
    source: 'Qiita',
    category: 'openai',
    publishedAt: h(6),
    summary:
      'GPT-4o miniのAPIトークン単価が入力・出力ともに大幅値下げ。低コストで高品質な推論が可能になり、個人開発者の参入障壁が下がる。',
    tags: ['GPT-4o mini', 'API', '料金'],
    url: '#',
  },
  {
    id: '7',
    title: 'RSSHub × Claude APIで日本語AI記事を自動要約する仕組みを作った',
    source: 'Zenn',
    category: 'other',
    publishedAt: h(7),
    summary:
      'Zenn・Qiita・noteのRSSフィードをRSSHubで集約し、Claude APIで要約・タグ付けを行うパイプラインの実装レポート。Appwrite Functionsを使ったサーバーレス構成。',
    tags: ['RSSHub', 'Claude API', 'Appwrite'],
    url: '#',
  },
  {
    id: '8',
    title: '2026年版AIコーディングアシスタント比較——Cursor vs Windsurf vs GitHub Copilot',
    source: 'Qiita',
    category: 'other',
    publishedAt: h(8),
    summary:
      '主要3ツールを同一タスクで比較検証。補完精度・コンテキスト理解・日本語対応の観点でスコアリング。結果は用途によって異なるが総合ではCursorが優位。',
    tags: ['Cursor', 'Copilot', 'AIコーディング'],
    url: '#',
  },

  // ── 最新記事（recent, past days） ────────────────────
  {
    id: '9',
    title: 'Google、NotebookLMに音声会話機能を追加——資料と話せるAIノート',
    source: 'note',
    category: 'google',
    publishedAt: h(26),
    summary:
      'NotebookLMにリアルタイム音声対話機能が追加。アップロードした資料に対して音声で質問でき、AIが資料の内容に基づいて回答する。',
    tags: ['NotebookLM', '音声', 'RAG'],
    url: '#',
  },
  {
    id: '10',
    title: 'Anthropicの最新研究：LLMの「忠実さ」を定量測定する新手法を提案',
    source: 'Zenn',
    category: 'anthropic',
    publishedAt: h(30),
    summary:
      'Anthropic Researchが、モデルが内部で考えていることと出力が一致しているかを測定するフレームワークを発表。AI安全性研究の重要な進展。',
    tags: ['AI安全性', 'Anthropic Research', '解釈可能性'],
    url: '#',
  },
  {
    id: '11',
    title: 'Meta AI、日本語対応を強化——LINEライクなUIで国内展開加速',
    source: 'note',
    category: 'meta',
    publishedAt: h(36),
    summary:
      'Meta AIのモバイルアプリが日本語UIと日本語特化チューニングで全面リニューアル。LINEとの連携も検討中とされる。',
    tags: ['Meta AI', '日本語', 'モバイル'],
    url: '#',
  },
  {
    id: '12',
    title: 'OpenAI Operators APIで自律エージェントを構築する実践ガイド',
    source: 'Zenn',
    category: 'openai',
    publishedAt: h(48),
    summary:
      'OpenAIのOperators APIを使ってWebブラウジング・ファイル操作・コード実行を自動化するエージェントを構築する手順を解説。TypeScript実装例付き。',
    tags: ['Operators', 'エージェント', 'TypeScript'],
    url: '#',
  },
  {
    id: '13',
    title: 'Appwrite + Claude APIで個人向けAIダッシュボードを作る',
    source: 'Qiita',
    category: 'other',
    publishedAt: h(50),
    summary:
      'Appwrite CloudのFunctionsとDatabaseを使い、Claude APIで分類・要約したコンテンツをダッシュボードで表示するシステムの構築方法。',
    tags: ['Appwrite', 'Claude API', 'ダッシュボード'],
    url: '#',
  },
  {
    id: '14',
    title: 'Gemini 1.5 Pro vs Claude 3.5 Sonnet——長文要約タスクの比較実験',
    source: 'note',
    category: 'google',
    publishedAt: h(72),
    summary:
      '10万トークンを超える長文ドキュメントの要約品質を複数の評価軸で比較。忠実性・簡潔さ・構造化の観点で詳細に分析した実験レポート。',
    tags: ['Gemini', 'Claude', 'ベンチマーク'],
    url: '#',
  },
  {
    id: '15',
    title: 'AIニュース週次まとめ（2026年3月第1週）——主要モデルアップデート総覧',
    source: 'note',
    category: 'other',
    publishedAt: h(96),
    summary:
      'GPT、Claude、Gemini、Llamaの各モデルで3月第1週に発表されたアップデートをまとめた週次レポート。モデル比較表と注目論文も収録。',
    tags: ['週次まとめ', 'モデル比較', '論文'],
    url: '#',
  },
];

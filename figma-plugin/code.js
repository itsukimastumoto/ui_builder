// OASIS Proto - Figma画面整理プラグイン（フラット化 + カテゴリ別再整理）
//
// カスタマイズ: CATEGORIES と LAYOUT を編集してください

// ============================================================
// 設定（カスタマイズ可能）
// ============================================================

const CATEGORIES = [
  { name: "ホーム", keywords: ["ホーム", "Home"] },
  { name: "ショップ", keywords: ["商品一覧", "ギフト詳細", "検索"] },
  { name: "ピアギフト（レター）", keywords: ["レター", "ギフトを選ぶ", "プレビュー", "お支払い", "送信完了", "ピアギフトダッシュボード"] },
  { name: "マイギフト", keywords: ["マイギフト", "ギフトアルバム", "レターアルバム"] },
  { name: "マイページ", keywords: ["マイページ", "プロフィール編集", "ポイント履歴", "注文履歴", "お気に入り"] },
  { name: "お知らせ", keywords: ["お知らせ", "通知設定"] },
  { name: "クーポン", keywords: ["クーポン"] },
  { name: "社内報", keywords: ["社内報"] },
  { name: "ユーティリティ", keywords: ["ストレスチェック", "安否確認"] },
  { name: "法務・ヘルプ", keywords: ["運営会社", "プライバシーポリシー", "利用規約", "特定商取引", "ヘルプ"] }
];

const LAYOUT = {
  sectionGap: 200,      // セクション間の間隔
  frameGap: 80,         // フレーム間の間隔
  sectionPadding: 100   // セクション内のパディング
};

// ============================================================
// メインロジック（基本的に編集不要）
// ============================================================

const page = figma.currentPage;

// ステップ1: 全フレームをページ直下にフラット化（入れ子解消）
function flattenAll(parent) {
  const frames = [];
  for (const child of parent.children.slice()) {
    if (child.type === "SECTION") {
      frames.push(...flattenAll(child));
    } else {
      frames.push(child);
    }
  }
  return frames;
}

const allFrames = flattenAll(page);

// 全フレームをページ直下に移動
for (const frame of allFrames) {
  page.appendChild(frame);
}

// 空のセクションを削除
for (const child of page.children.slice()) {
  if (child.type === "SECTION") {
    child.remove();
  }
}

// ステップ2: カテゴリ分けして整理
const freshNodes = page.children.slice();
let sectionY = 0;
let totalMoved = 0;
const matched = new Set();

for (const cat of CATEGORIES) {
  const matchedFrames = [];
  for (const node of freshNodes) {
    if (matched.has(node.id)) continue;
    const name = node.name || "";
    if (cat.keywords.some(kw => name.includes(kw))) {
      matchedFrames.push(node);
      matched.add(node.id);
    }
  }

  if (matchedFrames.length === 0) continue;

  const section = figma.createSection();
  section.name = cat.name;

  let frameX = LAYOUT.sectionPadding;
  let maxHeight = 0;

  for (const frame of matchedFrames) {
    section.appendChild(frame);
    frame.x = frameX;
    frame.y = LAYOUT.sectionPadding;
    frameX += frame.width + LAYOUT.frameGap;
    if (frame.height > maxHeight) maxHeight = frame.height;
    totalMoved++;
  }

  section.resizeWithoutConstraints(
    frameX + LAYOUT.sectionPadding,
    maxHeight + LAYOUT.sectionPadding * 2
  );

  section.x = 0;
  section.y = sectionY;
  sectionY += section.height + LAYOUT.sectionGap;
}

// 未分類チェック
const remaining = page.children.filter(n => n.type !== "SECTION");
if (remaining.length > 0) {
  const section = figma.createSection();
  section.name = "未分類";
  let frameX = LAYOUT.sectionPadding;
  let maxHeight = 0;
  for (const frame of remaining) {
    section.appendChild(frame);
    frame.x = frameX;
    frame.y = LAYOUT.sectionPadding;
    frameX += frame.width + LAYOUT.frameGap;
    if (frame.height > maxHeight) maxHeight = frame.height;
  }
  section.resizeWithoutConstraints(
    frameX + LAYOUT.sectionPadding,
    maxHeight + LAYOUT.sectionPadding * 2
  );
  section.x = 0;
  section.y = sectionY;
}

// 全体を表示
figma.viewport.scrollAndZoomIntoView(page.children);

let msg = `整理完了！ ${totalMoved}画面をセクションに分類しました`;
figma.notify(msg);
figma.closePlugin();

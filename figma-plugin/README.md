# OASIS Screen Organizer - Figmaプラグイン

Figmaにキャプチャした画面をカテゴリ別セクションに自動整理するプラグイン。

## インストール

1. Figma Desktop App を開く
2. メニュー → Plugins → Development → Import plugin from manifest...
3. このフォルダの `manifest.json` を選択

## 実行

1. 整理したいページを開く
2. メニュー → Plugins → Development → OASIS Screen Organizer

## 動作

1. **フラット化**: ページ内の全フレームをページ直下に移動（入れ子解消）
2. **カテゴリ分け**: フレーム名のキーワードに基づいてセクションに分類
3. **レイアウト**: 各セクション内でフレームを横並びに配置

## カスタマイズ

`code.js` 先頭の設定を編集:

### カテゴリ (`CATEGORIES`)

```js
const CATEGORIES = [
  { name: "セクション名", keywords: ["キーワード1", "キーワード2"] },
  ...
];
```

- `name`: Figma上のセクション名
- `keywords`: フレーム名に含まれるキーワード（部分一致）
- マッチしないフレームは「未分類」セクションに入る

### レイアウト (`LAYOUT`)

```js
const LAYOUT = {
  sectionGap: 200,      // セクション間の間隔
  frameGap: 80,         // フレーム間の間隔
  sectionPadding: 100   // セクション内のパディング
};
```

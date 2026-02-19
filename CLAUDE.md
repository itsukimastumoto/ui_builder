# UI Builder

## 役割
- プロダクトの要件からUI画面（単一HTML）を生成し、Figmaに反映するツール。
- プロダクト別のUI Builderは `<product>/` に配置する。
- 共通ツール（Figma連携）はこのフォルダ直下に配置。

## 運用ルール
- 作業前に対象プロダクト配下の `CLAUDE_GUIDE.md` と `AGENTS.md` / `CLAUDE.md` を必ず読む。
- UI作成は各プロダクト配下で行う。
- 新規プロダクトを追加する場合は `template/` をコピーしてセットアップする。

## プロダクト
- `oasis` — giftee Benefit（OASIS）
- `template` — 新規プロダクト用テンプレート（コピーして使う）

## 新規プロダクト追加（「セットアップして」と言われたら）
1. **環境準備**: `template/AGENTS.md` の「0. 環境準備」に従い、前提条件（Chrome, Figma Desktop, MCP設定等）を確認
2. `template/AGENTS.md` のセットアップフローに従う
3. ユーザーにプロダクト名・カラー・画面タイプ等を確認
4. `template/` を `<product>/` にコピーし、プレースホルダーを置換
5. **テンプレート作成**: Figmaに既存デザインがあれば Dev Mode MCP で読み込み、`templates/` にHTMLテンプレートを作成
6. セットアップ完了後、すぐにUI作成が始められる

---

## 全プロダクト共通: UI作成の基本ルール

以下のルールは全プロダクトのUI Builderに共通する。プロダクト固有のルール（カラー、レイアウト等）は各プロダクトの `CLAUDE_GUIDE.md` に記載。

### 出力形式
- **すべてのUIは単一HTMLファイルとして完結させる**
- CSS は `<style>` タグ内に記述
- JavaScript が必要な場合は `<script>` タグ内に記述
- 外部ファイル参照は Google Fonts のみ許可
- SVGアイコンはインラインで記述
- 画像は `assets/images/` から相対パスで参照、または絵文字/SVGで代替

### タスクフォルダ構成

画面作成のたびにタスクフォルダが作られ、要件（インプット）と生成物（アウトプット）がセットで管理される。

```
<product>/task/
└── YYMMDD_タイトル/
    ├── 01_require/               # インプット: 要件書
    │   └── YYMMDD_タイトル.txt
    ├── 02_asset/                 # 参考素材（スクショ、既存UI画像など）
    ├── 03_ui/                    # アウトプット: 生成されたHTML
    │   └── [画面名].html
    └── figma.json                # Figmaキャプチャ履歴（自動生成）
```

### UI作成ワークフロー

UI作成依頼を受けたら、以下の手順で進める:

```
1. 要件の確認        → 01_require/ の要件書を読む or ユーザー指示から要件書を作成
2. 参照ファイル読み込み → assets/design-tokens.css + templates/ を参照
3. HTML生成          → 単一HTMLを 03_ui/ に出力
4. Figmaキャプチャ    → figma-capture + MCP で自動反映（デフォルト実行）
5. 要件追記          → フィードバックがあれば UI修正 + 01_require/ の要件書に追記
```

**各ステップの詳細は、対象プロダクトの `CLAUDE_GUIDE.md` を参照。**

### 追加要件の追記（必須）
- ユーザーから追加要望が出たら、UI修正と同時に `01_require/` の要件書へ追記する。
- `---` 区切り + 日付付きで追加する（元要件は変更しない）。

```
01_require/YYMMDD_タイトル.txt

---

## 追加要件（YYYY/MM/DD）
- 追加要望1
- 追加要望2
```

---

## 全プロダクト共通: Figma連携

### Figma Dev Mode MCP（読み取り: Figma → HTML）
- 「Figmaから取って」等の指示があれば使用
- `get_design_context` + `get_screenshot` で取得 → 単一HTML形式に変換
- Figma出力はReact+Tailwind → プレーンHTML+CSS（`<style>` 内包）に変換すること
- **初回セットアップ時**: Dev Mode MCP で既存デザインからHTMLテンプレートを作成する

### Figmaキャプチャ（書き込み: HTML → Figma）
- **HTML生成後、Figmaへのキャプチャをデフォルトで実行する**
- 「キャプチャ不要」と言われた場合のみスキップ
- 共通ヘルパー `figma-capture` と MCP `generate_figma_design` を組み合わせて実行
- 詳細手順は対象プロダクトの `CLAUDE_GUIDE.md` または `README.md` を参照

## 共通ツール

### figma-capture（HTMLをFigmaにキャプチャ）
- **パス**: `figma-capture`
- **用途**: HTML生成後、Figma Remote MCP (`generate_figma_design`) と組み合わせてFigmaにキャプチャする
- **サブコマンド**: `serve` / `inject` / `open` / `clean` / `stop`
- 全プロダクト共通で使用可能

### figma-plugin（Figma画面整理プラグイン）
- **パス**: `figma-plugin/`
- **用途**: Figmaにキャプチャした画面をカテゴリ別セクションに自動整理
- Figma Desktop Appのプラグインメニューから手動実行
- カテゴリは `code.js` 先頭の `CATEGORIES` を編集してプロダクトごとにカスタマイズ可能

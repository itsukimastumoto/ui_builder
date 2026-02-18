# UI Builder Oasis（tools/ui-builder/oasis）

## 役割
- giftee Benefit（OASIS）専用のUIワイヤー作成ツール。
- 単一HTMLで画面を作る（テンプレ＋デザイントークン前提）。

## 重要ルール
- 画面上に「oasis」という名称を出さない。ユーザー向け名称は「giftee Benefit」。
- デフォルトはCS画面（ユーザー向け）。管理画面と明示された場合のみCL画面。
- 出力は単一HTML。CSSは `<style>`、JSは `<script>` に内包する。
- 外部参照はGoogle Fonts（Noto Sans JP）のみ許可。

## 作業フロー（推奨）
- `tools/ui-builder/oasis/run --requirements "..." --title "..." --screen cs|cl --output file.html` を使う。
- 生成先は `task/yymmdd_タイトル/` 配下。
- 要件書は `task/.../01_require/要件書.txt`。
- UIは `task/.../03_ui/*.html`。

## 旧フロー
- `input/` と `output/` を使う運用は旧式。基本は `task/` を使用する。

## Dropbox同期
- 「同期して」依頼時は `tools/ui-builder/oasis/output/250110_palm_dp管理画面/` を Dropbox の ` /Users/itsuki.matsumoto/giftee Dropbox/Matsumoto Itsuki/giftee_Biz_template/00_biz_汎用/#sales汎用資料/g4b_Corporate Gift/02_プロダクト検討/02_gifteeBenefit/01_プロダクト概要/04_デモ環境/proto/機能説明用proto/DP管理画面1stリリースproto/` に同期する。
- 古いファイル削除は許可（`rsync --delete`）。

## 参照アセット
- デザイントークン: `assets/design-tokens.css`
- アイコン: `assets/icons.html`
- ロゴ: `assets/images/logo-giftee-benefit.svg`
- ギフトカード画像: `assets/images/gift-cards/`

## テンプレート
- CS画面: `templates/cs/`
- CL画面: `templates/cl/`

## 追加要件の追記（必須）
- ユーザーから追加要望が出たら、UI修正と同時に要件書へ追記する。
- 追記は日付付きで追加する（元要件は変更しない）。

## SVG作成
- 「SVG化して」と言われたら同じ `output` フォルダにSVGを作成する。
- 画面状態ごとにファイルを分ける（一覧、詳細、モーダル等）。

## Figma Dev Mode MCP 連携（読み取り: Figma → HTML）
- 「Figmaから取って」「Figmaのデザインをベースに」等の指示があれば、Figma Dev Mode MCPを使う。
- ユーザーがFigmaでノードを選択 → `get_design_context` + `get_screenshot` で取得 → HTML変換。
- Figma出力はReact+Tailwind。UI Builderの単一HTML形式に変換すること（詳細は `CLAUDE_GUIDE.md` の「Figma Dev Mode MCP 連携」セクション参照）。
- Figma Desktop Appが起動していないとエラーになる。その場合はユーザーに起動を依頼する。

## Figma キャプチャ（書き込み: HTML → Figma）
- **HTML生成後、Figmaへのキャプチャをデフォルトで実行する。**
- 「キャプチャ不要」「Figmaに反映しなくていい」と言われた場合のみスキップ。
- 共通ヘルパー `tools/ui-builder/figma-capture` と MCP `generate_figma_design` を組み合わせて実行。
- キャプチャ先は `existingFile` モード（既存Figmaファイルに追加）がデフォルト。
- タスクフォルダの `figma.json` に fileKey とキャプチャ履歴を保存。
- 初回実行時はユーザーに Figma ファイルキーを確認する。
- 複数HTMLは1ファイルずつ順次処理（Chrome背景タブ制約の回避）。
- **詳細手順は `CLAUDE_GUIDE.md` の「Figma キャプチャワークフロー」を参照。**

## Figma 画面整理プラグイン
- キャプチャ後の画面整理に使用: `tools/ui-builder/figma-plugin/`（共通）
- カテゴリ別セクション作成・フレーム配置を自動化。
- Figma Desktop App のプラグインメニューから手動実行。
- カテゴリは `figma-plugin/code.js` 先頭の `CATEGORIES` を編集してカスタマイズ。

## 詳細
- `README.md` と `CLAUDE_GUIDE.md` を参照。

# UI Builder __PRODUCT_NAME__（tools/ui-builder/__PRODUCT_DIR__）

> **セットアップ前のテンプレート状態です。** `__PRODUCT_NAME__` や `__PRODUCT_DIR__` がプレースホルダーのまま残っている場合は、下記のセットアップフローを実行してください。

## セットアップフロー（「セットアップして」と言われたら）

ユーザーに以下を順番に確認し、テンプレートをカスタマイズする:

### 0. 環境準備（前提条件の確認）

以下が揃っているか確認し、不足があればインストール・設定を案内する:

| # | 必須ツール | 確認方法 | 未インストール時の案内 |
|---|-----------|---------|---------------------|
| 1 | **Claude Code or Codex CLI** | `claude --version` or `codex --version` | https://docs.anthropic.com/en/docs/claude-code |
| 2 | **Google Chrome** | `/Applications/Google Chrome.app` の存在確認 | https://www.google.com/chrome/ からインストール |
| 3 | **Figma Desktop App** | `/Applications/Figma.app` の存在確認 | https://www.figma.com/downloads/ からインストール |

**MCP サーバーの設定**（Claude Codeの場合は `.mcp.json`、Codexの場合は `~/.codex/config.toml`）:

| サーバー | 用途 | 設定方法 |
|---------|------|---------|
| **figma-dev-mode-mcp-server** | Figma → Claude Code（デザイン読み取り） | Figma Desktop Appで Dev Mode MCP を有効化。エンドポイント: `http://127.0.0.1:3845/sse` |
| **figma-remote-mcp** | Claude Code → Figma（キャプチャ書き込み） | OAuth認証が必要。エンドポイント: `https://mcp.figma.com/mcp`。初回接続時にブラウザでFigmaアカウント認証 |

**Figma画面整理プラグイン**（任意、推奨）:
1. Figma Desktop App を開く
2. Plugins → Development → "Import plugin from manifest..." を選択
3. `tools/ui-builder/figma-plugin/manifest.json` を指定
4. プラグイン一覧に表示されたら完了

すべての前提条件が揃ったら、次のステップへ進む。

### 1. 基本情報を聞く
- **プロダクト名**: UIに表示する正式名称（例: "giftee Benefit"）
- **フォルダ名**: 英語の短い名前（例: "oasis", "gift-store-module"）
- **プロダクト概要**: 一文で何のプロダクトか（AGENTS.mdの役割欄に使う）

### 2. デザイン情報を聞く
- **プライマリカラー**: メインカラー（例: "#0C6993"）
- **その他のキーカラー**: テキスト色、背景色、ボーダー色など
- **フォント**: 使用フォント（デフォルト: Noto Sans JP）
- **画面タイプ**: モバイル/デスクトップ/両方
- **既存のFigmaファイルがあるか**: あればファイルキーを取得

### 3. 自動セットアップを実行
1. `template/` を `tools/ui-builder/<フォルダ名>/` にコピー
2. 全ファイルで `__PRODUCT_NAME__` → プロダクト名、`__PRODUCT_DIR__` → フォルダ名 を置換
3. `assets/design-tokens.css` にカラーパレットを設定
4. `run` スクリプトのプロンプトにデザイントークンを反映
5. AGENTS.md / CLAUDE.md の役割欄にプロダクト概要を記載
6. Figmaファイルキーがあればルート `figma.json` を作成
7. 親の `AGENTS.md` のプロダクト一覧に追記

### 4. 完了報告
- 作成したフォルダパスを伝える
- 「〇〇のUIを作成して」で使い始められることを案内

---

## 役割
- __PRODUCT_NAME__ 専用のUIワイヤー作成ツール。
- 出力は単一HTML（CSS/JSを内包）。

## 重要ルール
- 出力は単一HTML。CSSは `<style>`、JSは `<script>` に内包する。
- 外部参照はGoogle Fonts（Noto Sans JP）のみ許可。
<!-- 以下はプロダクト固有のルールを追記 -->

## 作業フロー（推奨）
- `tools/ui-builder/__PRODUCT_DIR__/run --requirements "..." --title "..." --output file.html` を使う。
- 生成先は `task/yymmdd_タイトル/` 配下。
- 要件書は `task/.../01_require/要件書.txt`。
- UIは `task/.../03_ui/*.html`。

## 参照アセット
- デザイントークン: `assets/design-tokens.css`
<!-- テンプレートやアイコンがある場合は追記 -->

## 追加要件の追記（必須）
- ユーザーから追加要望が出たら、UI修正と同時に要件書へ追記する。
- 追記は日付付きで追加する（元要件は変更しない）。

## Figma Dev Mode MCP 連携（読み取り: Figma → HTML）
- 「Figmaから取って」「Figmaのデザインをベースに」等の指示があれば、Figma Dev Mode MCPを使う。
- ユーザーがFigmaでノードを選択 → `get_design_context` + `get_screenshot` で取得 → HTML変換。
- Figma出力はReact+Tailwind。単一HTML形式に変換すること。
- Figma Desktop Appが起動していないとエラーになる。その場合はユーザーに起動を依頼する。

## Figma キャプチャ（書き込み: HTML → Figma）
- **HTML生成後、Figmaへのキャプチャをデフォルトで実行する。**
- 「キャプチャ不要」「Figmaに反映しなくていい」と言われた場合のみスキップ。
- 共通ヘルパー `tools/ui-builder/figma-capture` と MCP `generate_figma_design` を組み合わせて実行。
- キャプチャ先は `existingFile` モード（既存Figmaファイルに追加）がデフォルト。
- タスクフォルダの `figma.json` に fileKey とキャプチャ履歴を保存。
- 初回実行時はユーザーに Figma ファイルキーを確認する。
- 複数HTMLは1ファイルずつ順次処理（Chrome背景タブ制約の回避）。
- **キャプチャワークフロー詳細は `tools/ui-builder/README.md` またはOASISの `CLAUDE_GUIDE.md`「Figma キャプチャワークフロー」を参照。**

## Figma 画面整理プラグイン
- キャプチャ後の画面整理に使用: `tools/ui-builder/figma-plugin/`（共通）
- カテゴリ別セクション作成・フレーム配置を自動化。
- Figma Desktop App のプラグインメニューから手動実行。
- カテゴリは `figma-plugin/code.js` 先頭の `CATEGORIES` を編集してプロダクトごとにカスタマイズ。

# UI Builder __PRODUCT_NAME__（__PRODUCT_DIR__）

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
| 4 | **Python 3** | `python3 --version` | macOSなら標準で入っていることが多い（なければインストール） |

**MCP サーバーの設定**（Claude Codeの場合は `.mcp.json`、Codexの場合は `~/.codex/config.toml`）:

| サーバー | 用途 | 設定方法 |
|---------|------|---------|
| **figma-dev-mode-mcp-server** | Figma → Claude Code（デザイン読み取り） | Figma Desktop Appで Dev Mode MCP を有効化。エンドポイント: `http://127.0.0.1:3845/sse` |
| **figma-remote-mcp** | Claude Code → Figma（キャプチャ書き込み） | OAuth認証が必要。エンドポイント: `https://mcp.figma.com/mcp`。初回接続時にブラウザでFigmaアカウント認証 |

**Figma画面整理プラグイン**（任意、推奨）:
1. Figma Desktop App を開く
2. Plugins → Development → "Import plugin from manifest..." を選択
3. `../figma-plugin/manifest.json` を指定
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
1. （リポジトリルートの）`template/` を `<フォルダ名>/` にコピー
2. 全ファイルで `__PRODUCT_NAME__` → プロダクト名、`__PRODUCT_DIR__` → フォルダ名 を置換
3. `assets/design-tokens.css` にカラーパレットを設定
4. `run` スクリプトのプロンプトにデザイントークンを反映
5. AGENTS.md / CLAUDE.md の役割欄にプロダクト概要を記載
6. Figmaファイルキーがあればルート `figma.json` を作成
7. 親の `AGENTS.md` のプロダクト一覧に追記

### 4. テンプレート作成（初回セットアップの重要ステップ）

Figmaに既存デザインがある場合、Dev Mode MCP で読み込んで `templates/` にHTMLテンプレートを作成する。テンプレートがあると、以降のUI作成がプロダクトのデザインルールに沿ったものになる。

詳細は `CLAUDE_GUIDE.md` の「初回セットアップ: テンプレート作成」セクションを参照。

### 5. 完了報告
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

## タスクフォルダ構成

画面作成のたびにタスクフォルダが作られ、要件（インプット）と生成物（アウトプット）がセットで管理される。

```
task/YYMMDD_タイトル/
├── 01_require/               # インプット: 要件書
│   └── YYMMDD_タイトル.txt
├── 02_asset/                 # 参考素材（スクショ、既存UI画像など）
├── 03_ui/                    # アウトプット: 生成されたHTML
│   └── [画面名].html
└── figma.json                # Figmaキャプチャ履歴（自動生成）
```

## UI作成ワークフロー

UI作成依頼を受けたら、以下の手順で進める。**詳細は `CLAUDE_GUIDE.md` を参照。**

```
1. 要件の確認     → 01_require/ の要件書を読む or ユーザー指示から要件書を作成
2. 参照ファイル読み込み → assets/design-tokens.css + templates/ を参照
3. HTML生成       → 単一HTMLを 03_ui/ に出力
4. Figmaキャプチャ → figma-capture + MCP で自動反映（デフォルト実行）
5. 要件追記       → フィードバックがあれば UI修正 + 要件書に追記
```

## 参照アセット
- デザイントークン: `assets/design-tokens.css`
- テンプレート: `templates/`
<!-- テンプレートやアイコンがある場合は追記 -->

## 追加要件の追記（必須）
- ユーザーから追加要望が出たら、UI修正と同時に `01_require/` の要件書へ追記する。
- `---` 区切り + 日付付きで追加する（元要件は変更しない）。
- 詳細フォーマットは `CLAUDE_GUIDE.md` の「追加要件の管理」セクションを参照。

## Figma Dev Mode MCP 連携（読み取り: Figma → HTML）
- 「Figmaから取って」「Figmaのデザインをベースに」等の指示があれば、Figma Dev Mode MCPを使う。
- ユーザーがFigmaでノードを選択 → `get_design_context` + `get_screenshot` で取得 → HTML変換。
- Figma出力はReact+Tailwind。単一HTML形式に変換すること。
- Figma Desktop Appが起動していないとエラーになる。その場合はユーザーに起動を依頼する。
- 変換ルール詳細は `CLAUDE_GUIDE.md` を参照。

## Figma キャプチャ（書き込み: HTML → Figma）
- **HTML生成後、Figmaへのキャプチャをデフォルトで実行する。**
- 「キャプチャ不要」「Figmaに反映しなくていい」と言われた場合のみスキップ。
- 共通ヘルパー `../figma-capture` と MCP `generate_figma_design` を組み合わせて実行。
- キャプチャ先は `existingFile` モード（既存Figmaファイルに追加）がデフォルト。
- タスクフォルダの `figma.json` に fileKey とキャプチャ履歴を保存。
- 初回実行時はユーザーに Figma ファイルキーを確認する。
- 複数HTMLは1ファイルずつ順次処理（Chrome背景タブ制約の回避）。
- **キャプチャワークフロー詳細は `CLAUDE_GUIDE.md` を参照。**

## Figma 画面整理プラグイン
- キャプチャ後の画面整理に使用: `../figma-plugin/`（共通）
- カテゴリ別セクション作成・フレーム配置を自動化。
- Figma Desktop App のプラグインメニューから手動実行。
- カテゴリは `figma-plugin/code.js` 先頭の `CATEGORIES` を編集してプロダクトごとにカスタマイズ。

## 詳細
- `README.md` と `CLAUDE_GUIDE.md` を参照。

# UI Builder

Claude Code / Codex を使って単一HTMLのUIワイヤーフレームを生成し、Figmaに反映するツール。

このREADMEは、このリポジトリを **単体で GitHub から clone して使う**前提で書かれています（パスはリポジトリルート基準）。

## 提供価値

- アイデアが「既存システムのUIルール（デザイントークン/テンプレ）」準拠ですぐ形になる（単一HTMLで即プレビュー可能）
- 形になったUIをFigmaに反映し、Figma上で管理しながら手調整できる
- 作成したデザインを元に、Figmaでプロトタイプをすぐ作って提案に使える

## ワークフロー

```
0. 事前準備              デザイントークン（色/フォント）とAGENTS.md（デザインルール）を整備
       ↓
1. 要件をインプット       要件書 or 対話で「何の画面を作るか」を定義
       ↓
2. Figma読み込み（任意）  Figma Dev Mode MCP で既存デザインを参照
       ↓
3. HTML生成              Claude Code でHTMLデザインを作成 → task/ に保存
       ↓
4. Figmaにキャプチャ      figma-capture + generate_figma_design でFigmaに反映
       ↓
5. プロトタイプ作成       Figma上でフレームを接続してプロトタイプ化
```

## タスクフォルダ構造

UI Builderでは **画面作成のたびにタスクフォルダが作られ**、要件（インプット）と生成物（アウトプット）がセットで管理される。

```
<product>/task/
└── YYMMDD_タイトル/              # 例: 260218_ホーム画面刷新
    ├── 01_require/               # インプット: 要件書
    │   └── YYMMDD_タイトル.txt   #   画面の要件・仕様テキスト
    ├── 02_asset/                 # 参考素材（スクショ、既存UI画像など）
    ├── 03_ui/                    # アウトプット: 生成されたHTML
    │   ├── home.html             #   単一HTMLファイル（CSS/JS内包）
    │   ├── modal-gift.html       #   画面ごとに1ファイル
    │   └── ...
    └── figma.json                # Figmaキャプチャ履歴（自動生成）
```

### インプットとアウトプットの関係

| フォルダ | 役割 | 内容 |
|---------|------|------|
| `01_require/` | **インプット** | 要件書テキスト。画面の目的・構成要素・振る舞いなどを記載 |
| `02_asset/` | **参考素材** | 参考スクショ、既存UI画像、ワイヤースケッチなど |
| `03_ui/` | **アウトプット** | AIが生成した単一HTMLファイル |
| `figma.json` | **キャプチャ記録** | FigmaファイルキーとキャプチャURL履歴 |

### 要件書の追記ルール

ユーザーから追加要望・フィードバックがあった場合、UIの修正と同時に要件書にも追記する。

```
01_require/YYMMDD_タイトル.txt

---

## 追加要件（YYYY/MM/DD）

### 〇〇の改善
- 追加要望1
- 追加要望2
```

元の要件は変更せず、日付付きで追記する（経緯を後から追えるようにする）。

## 前提条件

| 必須 | 内容 |
|------|------|
| Claude Code or Codex CLI | HTML生成に使用 |
| Google Chrome | Figmaキャプチャに使用（macOS） |
| Figma Desktop App | Dev Mode MCP（読み取り）に使用 |
| Figma Remote MCP | `generate_figma_design`（書き込み）に使用。OAuth認証が必要 |
| Python 3 | `figma-capture` のHTTPサーバー/注入処理に使用 |

## クイックスタート

前提: [Claude Code](https://docs.anthropic.com/en/docs/claude-code) または Codex CLI がインストール済みであること。`./doctor` で環境チェックできます。

```bash
# 1) 環境チェック
./doctor

# 2) 新規プロダクト用フォルダを作成
./create-product --dir my-product --name "My Product"

# 3) デザイントークンを設定（色/フォントなど）
#    プロダクトのカラーパレットに合わせて編集してください
open my-product/assets/design-tokens.css

# 4) テンプレート作成（重要）
#    Figmaに既存デザインがあれば、Claude Code対話モードで読み込んで
#    templates/ にHTMLテンプレートを作成する
cd my-product
claude   # Claude Code起動
# → 「Figmaの〇〇画面をベースにテンプレートを作って」と指示

# 5) UIを作成（テンプレート作成後はここからスタート）
# 対話モード（推奨）:
#   「ホーム画面を作って。要件は〇〇」と指示
# バッチモード:
./run --requirements "ホーム画面を作成" --title "ホーム"
```

### MCP設定

| サーバー | エンドポイント | 用途 |
|---------|---------------|------|
| figma-dev-mode-mcp-server | `http://127.0.0.1:3845/sse` | Figma → Claude Code（読み取り） |
| figma-remote-mcp | `https://mcp.figma.com/mcp` | Claude Code → Figma（書き込み） |

#### Claude Code (`.mcp.json`) の設定例

```json
{
  "mcpServers": {
    "figma-dev-mode-mcp-server": {
      "url": "http://127.0.0.1:3845/sse"
    },
    "figma-remote-mcp": {
      "url": "https://mcp.figma.com/mcp"
    }
  }
}
```

#### Codex CLI (`~/.codex/config.toml`) の設定例

```toml
[mcpServers.figma-dev-mode-mcp-server]
type = "sse"
url = "http://127.0.0.1:3845/sse"

[mcpServers.figma-remote-mcp]
type = "sse"
url = "https://mcp.figma.com/mcp"
```

**figma-dev-mode-mcp-server**: Figma Desktop App で Dev Mode MCP を有効にすると、ローカルの `127.0.0.1:3845` でSSEサーバーが起動する。

**figma-remote-mcp**: 初回接続時にブラウザでFigmaアカウントのOAuth認証が必要。認証後はトークンが保持される。

## ディレクトリ構成

```
./
├── README.md              # このファイル
├── AGENTS.md / CLAUDE.md  # 親レベルのエージェント指示
├── create-product          # 新規プロダクト作成スクリプト
├── doctor                  # 環境チェックスクリプト
├── figma-capture           # 共通: Figmaキャプチャヘルパー
├── figma-plugin/           # 共通: Figma画面整理プラグイン
├── template/               # 新規プロダクト用テンプレート
└── oasis/                  # giftee Benefit（OASIS）— 実運用中の参考実装
```

### プロダクトフォルダの構成

```
<product>/
├── run                    # バッチ生成スクリプト
├── AGENTS.md / CLAUDE.md  # AIへのデザインルール・作業指示
├── assets/
│   ├── design-tokens.css  # デザイントークン（色/フォント/スペーシング）
│   ├── icons.html         # SVGアイコン集（任意）
│   └── images/            # ロゴ・画像素材（任意）
├── templates/             # 参照用HTMLテンプレート
└── task/                  # タスクフォルダ（要件+生成物のセット管理）
    └── YYMMDD_タイトル/
        ├── 01_require/    # インプット（要件書）
        ├── 02_asset/      # 参考素材
        ├── 03_ui/         # アウトプット（生成HTML）
        └── figma.json     # キャプチャ履歴
```

## 新しいプロダクトを追加する

### Step 1: テンプレートをコピー

```bash
./create-product --dir <your-product> --name "My Product"
```

### Step 2: プレースホルダーを置換

`create-product` を使う場合は不要（自動で置換されます）。

```bash
cd <your-product>

# プロダクト名とフォルダ名を置換
sed -i '' 's/__PRODUCT_NAME__/My Product/g' run AGENTS.md CLAUDE.md assets/design-tokens.css
sed -i '' 's/__PRODUCT_DIR__/<your-product>/g' run AGENTS.md CLAUDE.md
```

### Step 3: カスタマイズ

1. **`assets/design-tokens.css`** — プロダクトのカラーパレット・フォントを設定
2. **`run`** — プロンプト内のデザイントークン値を更新
3. **`AGENTS.md` / `CLAUDE.md`** — プロダクト固有のルール（画面タイプ、命名規則等）を追記
4. **`templates/`** — 参照用HTMLテンプレートを配置（任意）

### Step 4: 動作確認

```bash
./run \
  --requirements "ホーム画面を作成" \
  --title "ホーム"
```

## 共通ツール

### figma-capture

HTMLファイルをFigmaにキャプチャするためのヘルパースクリプト。

```bash
./figma-capture serve <dir> [--port 8765]    # HTTPサーバー起動
./figma-capture inject <html> <script>       # キャプチャスクリプト注入
./figma-capture open <url> [--delay 8]       # Chromeでページ表示→待機→閉じる
./figma-capture clean <html>                 # キャプチャスクリプト除去
./figma-capture stop                         # HTTPサーバー停止
```

MCP `generate_figma_design` と組み合わせて使用（詳細はこのREADMEの「キャプチャワークフロー詳細」を参照）。

### figma-plugin

Figmaにキャプチャした画面をカテゴリ別セクションに自動整理するプラグイン。

```
figma-plugin/
├── manifest.json
├── code.js         # CATEGORIES, LAYOUT を編集してカスタマイズ
└── README.md
```

**インストール**: Figma Desktop → Plugins → Development → Import plugin from manifest（`figma-plugin/manifest.json`）

## 各プロダクト固有の情報

各プロダクトフォルダ内の `AGENTS.md` / `CLAUDE.md` に以下を記載する:

- プロダクト固有のデザインルール
- 画面タイプ（モバイル/デスクトップ/管理画面 等）
- テンプレートとアセットの一覧
- ブランドガイドライン（色使い、製品名ルール等）
- Figmaファイルの参照情報

## キャプチャワークフロー詳細

### 基本フロー（エージェントが実行）

以下は「`<product>/` ディレクトリで作業している」前提（共通スクリプトは `../figma-capture`）です。

```
1. figma.json 確認（なければ fileKey をユーザーに確認→作成）
2. ../figma-capture serve <03_ui/ディレクトリ>
3. generate_figma_design(outputMode="existingFile", fileKey=...) → captureId取得
4. ../figma-capture inject <html> <JSスニペット>
5. ../figma-capture open http://localhost:8765/<filename>#figmacapture={captureId}&...
6. generate_figma_design(captureId=...) → ポーリング → FigmaURL取得
7. ../figma-capture clean <html>
   ※複数HTMLは Step 3-7 を繰り返す（1ファイルずつ順次処理）
8. ../figma-capture stop
9. figma.json にキャプチャ履歴を記録、FigmaURLをユーザーに報告
```

### タスクフォルダの figma.json

```json
{
  "fileKey": "FigmaファイルキーをURLから抽出",
  "captures": [
    {
      "file": "home.html",
      "captureId": "...",
      "figmaUrl": "https://www.figma.com/design/...",
      "capturedAt": "2026-02-18T14:30:00+09:00"
    }
  ]
}
```

### リトライ

- ポーリングで `pending` が続く → キャッシュバスター `?v=timestamp` 付きで再実行
- それでも失敗 → `figmadelay` を 3000→5000ms に増加
- 2回リトライしても失敗 → ユーザーに報告してスキップ

### 技術的な注意事項

- **Chrome背景タブ制約**: 複数ページの同時キャプチャは不可。1ページずつ順次処理
- **HTMLのクリーンさ**: キャプチャ完了後は必ず `clean` で注入スクリプトを除去
- **サーバー停止**: 作業完了後は必ず `stop` でHTTPサーバーを停止
- **`--dangerously-skip-permissions`**: `run` スクリプト内で使用。Claude Codeのパイプモード（`-p`）で非対話的にHTML生成するために必要。プロンプトはスクリプトが制御しており、出力はHTML文字列のみ

## 価値を出すための前提（重要）

- 「既存システムのUIルール準拠」は、各プロダクトの `assets/design-tokens.css` と `AGENTS.md`（デザインルール/制約）を整備していることが前提
- 要件の粒度が高いほど出力の品質が上がる。`01_require/` に要件書を事前に書いておくと、AIが意図通りの画面を生成しやすい
- Figma反映はキャプチャベースのため、最終的なプロダクション実装用のコンポーネント設計（Auto Layout/Variants等）を自動生成する用途ではない

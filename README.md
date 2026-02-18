# UI Builder

Claude Code / Codex を使って単一HTMLのUIワイヤーフレームを生成し、Figmaに反映するツール。

## ワークフロー

```
1. Figma読み込み        Figma Dev Mode MCP で既存デザインを取得（任意）
       ↓
2. HTML生成            Claude Code でHTMLデザインを作成
       ↓
3. Figmaにキャプチャ    figma-capture + generate_figma_design でFigmaに反映
       ↓
4. プロトタイプ作成      Figma上でフレームを接続してプロトタイプ化
```

## 前提条件

| 必須 | 内容 |
|------|------|
| Claude Code or Codex CLI | HTML生成に使用 |
| Google Chrome | Figmaキャプチャに使用（macOS） |
| Figma Desktop App | Dev Mode MCP（読み取り）に使用 |
| Figma Remote MCP | `generate_figma_design`（書き込み）に使用。OAuth認証が必要 |

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
tools/ui-builder/
├── README.md              # このファイル
├── AGENTS.md / CLAUDE.md  # 親レベルのエージェント指示
├── figma-capture           # 共通: Figmaキャプチャヘルパー
├── figma-plugin/           # 共通: Figma画面整理プラグイン
├── template/               # 新規プロダクト用テンプレート
├── oasis/                  # giftee Benefit（OASIS）
└── kondate-loop/           # Kondate Loop
```

## 新しいプロダクトを追加する

### Step 1: テンプレートをコピー

```bash
cp -r tools/ui-builder/template tools/ui-builder/<your-product>
```

### Step 2: プレースホルダーを置換

```bash
cd tools/ui-builder/<your-product>

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
tools/ui-builder/<your-product>/run \
  --requirements "ホーム画面を作成" \
  --title "ホーム"
```

## 共通ツール

### figma-capture

HTMLファイルをFigmaにキャプチャするためのヘルパースクリプト。

```bash
figma-capture serve <dir> [--port 8765]    # HTTPサーバー起動
figma-capture inject <html> <script>       # キャプチャスクリプト注入
figma-capture open <url> [--delay 8]       # Chromeでページ表示→待機→閉じる
figma-capture clean <html>                 # キャプチャスクリプト除去
figma-capture stop                         # HTTPサーバー停止
```

MCP `generate_figma_design` と組み合わせて使用。詳細な手順は `oasis/CLAUDE_GUIDE.md` の「Figma キャプチャワークフロー」セクションを参照。

### figma-plugin

Figmaにキャプチャした画面をカテゴリ別セクションに自動整理するプラグイン。

```
figma-plugin/
├── manifest.json
├── code.js         # CATEGORIES, LAYOUT を編集してカスタマイズ
└── README.md
```

**インストール**: Figma Desktop → Plugins → Development → Import plugin from manifest

## 各プロダクト固有の情報

各プロダクトフォルダ内の `AGENTS.md` / `CLAUDE.md` に以下を記載する:

- プロダクト固有のデザインルール
- 画面タイプ（モバイル/デスクトップ/管理画面 等）
- テンプレートとアセットの一覧
- ブランドガイドライン（色使い、製品名ルール等）
- Figmaファイルの参照情報

## キャプチャワークフロー詳細

### 基本フロー（エージェントが実行）

```
1. figma.json 確認（なければ fileKey をユーザーに確認→作成）
2. figma-capture serve <03_ui/ディレクトリ>
3. generate_figma_design(outputMode="existingFile", fileKey=...) → captureId取得
4. figma-capture inject <html> <JSスニペット>
5. figma-capture open http://localhost:8765/<filename>#figmacapture={captureId}&...
6. generate_figma_design(captureId=...) → ポーリング → FigmaURL取得
7. figma-capture clean <html>
   ※複数HTMLは Step 3-7 を繰り返す（1ファイルずつ順次処理）
8. figma-capture stop
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

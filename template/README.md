# UI Builder — テンプレート

新しいプロダクト用のUI Builderスターターキット。

## セットアップ

### 1. テンプレートをコピー

```bash
cp -r tools/ui-builder/template tools/ui-builder/<your-product>
```

### 2. プレースホルダーを置換

以下のファイルで `__PRODUCT_NAME__` と `__PRODUCT_DIR__` を置換:

| ファイル | 置換内容 |
|---------|---------|
| `run` | `PRODUCT_NAME`, `PRODUCT_DIR` の変数 |
| `AGENTS.md` / `CLAUDE.md` | プロダクト名、フォルダ名 |
| `assets/design-tokens.css` | プロダクト名コメント |

```bash
# 一括置換の例
cd tools/ui-builder/<your-product>
sed -i '' 's/__PRODUCT_NAME__/My Product/g' run AGENTS.md CLAUDE.md
sed -i '' 's/__PRODUCT_DIR__/<your-product>/g' run AGENTS.md CLAUDE.md
```

### 3. デザイントークンを設定

`assets/design-tokens.css` をプロダクトのカラーパレット・フォントに合わせて編集。

### 4. run スクリプトのプロンプトを調整

`run` 内の `prompt` 変数にデザイントークンの主要カラーとプロダクト固有のConstraintsを記載。

### 5. テンプレート追加（任意）

`templates/` に参照用HTMLを配置（ログイン画面、ホーム画面など）。

## 使い方

```bash
tools/ui-builder/<your-product>/run \
  --requirements "ログイン画面を作成" \
  --title "ログイン" \
  --output login.html
```

## ディレクトリ構成

```
<your-product>/
├── run                       # HTML生成スクリプト
├── AGENTS.md                 # エージェント指示（Codex用）
├── CLAUDE.md                 # エージェント指示（Claude Code用）
├── assets/
│   └── design-tokens.css     # デザイントークン
├── templates/                # 参照テンプレート（任意）
└── task/                     # 生成タスク（自動作成）
    └── yymmdd_タイトル/
        ├── 01_require/要件書.txt
        ├── 03_ui/*.html
        └── figma.json        # Figmaキャプチャ設定
```

## Figma連携

共通ツールを使って4ステップのワークフローを実行できます:

1. **Figma読み込み** — Figma Dev Mode MCP でテンプレ/既存デザインを取得
2. **HTML生成** — `run` スクリプトまたはClaude Codeで直接作成
3. **Figmaにキャプチャ** — `tools/ui-builder/figma-capture` + `generate_figma_design`
4. **プロトタイプ作成** — Figma上でフレームを接続

詳細は `tools/ui-builder/README.md` を参照。

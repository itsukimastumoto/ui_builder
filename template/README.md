# UI Builder __PRODUCT_NAME__

__PRODUCT_NAME__ 専用のUIワイヤー作成フォルダです。

## 最小の使い方

```bash
# 対話モード（推奨）
cd __PRODUCT_DIR__
claude   # Claude Code起動 → AGENTS.md/CLAUDE.md を自動読み込み
# → 「ホーム画面を作って」で作業開始
```

```bash
# バッチモード
./run --requirements "ホーム画面を作成" --title "ホーム"
```

## タスクフォルダ構成

```
task/YYMMDD_タイトル/
├── 01_require/               # インプット: 要件書
│   └── YYMMDD_タイトル.txt
├── 02_asset/                 # 参考素材
├── 03_ui/                    # アウトプット: 生成されたHTML
│   └── [画面名].html
└── figma.json                # Figmaキャプチャ履歴
```

## UI作成ワークフロー

```
1. 要件の確認        → 01_require/ の要件書を読む or ユーザー指示から作成
2. 参照ファイル読み込み → design-tokens.css + templates/ を参照
3. HTML生成          → 単一HTMLを 03_ui/ に出力
4. Figmaキャプチャ    → 自動でFigmaに反映
5. 要件追記          → フィードバック → UI修正 + 要件書に追記
```

## デザイン調整ポイント

- デザイントークン: `assets/design-tokens.css`
- 参照テンプレート: `templates/`
- 生成プロンプト（必要なら）: `run`
- デザインルール: `AGENTS.md` / `CLAUDE.md`

## Figma連携

- **読み取り（Figma → HTML）**: Figma Dev Mode MCP で既存デザインを読み込み
- **書き込み（HTML → Figma）**: `../figma-capture` + Figma Remote MCP でキャプチャ
- 詳細手順は `CLAUDE_GUIDE.md` を参照

## 詳細ガイド

- `CLAUDE_GUIDE.md` — UI作成の具体手順、テンプレート作成、Figmaキャプチャ手順、要件追記フォーマット等

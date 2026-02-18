# UI Builder __PRODUCT_NAME__

__PRODUCT_NAME__ 専用のUIワイヤー作成フォルダです。

## 最小の使い方

```bash
./run --requirements "ホーム画面を作成" --title "ホーム"
```

## 生成物

- タスクフォルダ: `task/yymmdd_タイトル/`
- 要件書: `task/.../01_require/要件書.txt`
- UI(単一HTML): `task/.../03_ui/*.html`

## デザイン調整ポイント

- デザイントークン: `assets/design-tokens.css`
- 参照テンプレート（任意）: `templates/`
- 生成プロンプト（必要なら）: `run`

## Figma連携（キャプチャ）

- 共通ヘルパー: `../figma-capture`
- Figmaへの書き込みは Figma Remote MCP の `generate_figma_design` を使用
- 詳細手順はリポジトリルートの `README.md` を参照


# UI Builder（tools/ui-builder）

## 役割
- UI Builder群の親フォルダ。
- プロダクト別のUI Builderは `tools/ui-builder/<product>/` に配置する。
- 共通ツール（Figma連携）はこのフォルダ直下に配置。

## 運用ルール
- 作業前に対象プロダクト配下の `README.md` と `AGENTS.md` / `CLAUDE.md` を必ず読む。
- UI作成は各プロダクト配下で行う。
- 新規プロダクト追加時は `tools/ツール一覧.md` と `DIRECTORY.md` を更新する。

## プロダクト
- `oasis` — giftee Benefit（OASIS）
- `kondate-loop` — Kondate Loop
- `template` — 新規プロダクト用テンプレート（コピーして使う）

## 新規プロダクト追加（「セットアップして」と言われたら）
1. **環境準備**: `template/AGENTS.md` の「0. 環境準備」に従い、前提条件（Chrome, Figma Desktop, MCP設定等）を確認
2. `template/AGENTS.md` のセットアップフローに従う
3. ユーザーにプロダクト名・カラー・画面タイプ等を確認
4. `template/` を `tools/ui-builder/<product>/` にコピーし、プレースホルダーを置換
5. セットアップ完了後、すぐにUI作成が始められる

## 共通ツール

### figma-capture（HTMLをFigmaにキャプチャ）
- **パス**: `tools/ui-builder/figma-capture`
- **用途**: HTML生成後、Figma Remote MCP (`generate_figma_design`) と組み合わせてFigmaにキャプチャする
- **サブコマンド**: `serve` / `inject` / `open` / `clean` / `stop`
- 全プロダクト共通で使用可能

### figma-plugin（Figma画面整理プラグイン）
- **パス**: `tools/ui-builder/figma-plugin/`
- **用途**: Figmaにキャプチャした画面をカテゴリ別セクションに自動整理
- Figma Desktop Appのプラグインメニューから手動実行
- カテゴリは `code.js` 先頭の `CATEGORIES` を編集してプロダクトごとにカスタマイズ可能

## 全プロダクト共通: Figma連携ワークフロー

全プロダクトのUI Builderで以下のフローが使える：

```
1. Figma Dev Mode MCP でテンプレ/既存デザインを読み込み（任意）
2. Claude Code で HTML デザインを作成
3. figma-capture + generate_figma_design で Figma に図形として保存
4. Figma上でプロトタイプ接続（ユーザーが別途指示）
```

- ステップ 1-3 は UI Builder のワークフロー内で実行
- ステップ 4 はユーザーが別途指示して実行（UI Builder の自動化対象外）
- 詳細手順は `README.md` のキャプチャワークフロー詳細セクションを参照

# UI Builder __PRODUCT_NAME__ ガイド

__PRODUCT_NAME__ 専用のUI作成ツールガイドです。

## 単一HTMLファイル形式

**すべてのUIは単一のHTMLファイルとして完結させてください。**

- CSS は `<style>` タグ内に記述
- JavaScript が必要な場合は `<script>` タグ内に記述
- 外部ファイル参照は Google Fonts のみ許可
- SVGアイコンはインラインで記述
- 画像は `assets/images/` から相対パスで参照、または絵文字/SVGで代替

<!-- プロダクト固有の制約があればここに追記 -->

## UI作成ワークフロー

### Step 1: 要件の確認

タスクフォルダの要件書を読む、またはユーザーの口頭指示から要件を把握する。

```
task/YYMMDD_タイトル/01_require/YYMMDD_タイトル.txt
```

要件書がまだない場合は、ユーザーの指示をもとに要件書を作成する。

### Step 2: 参照ファイルの読み込み

#### デザイントークン（必ず参照）
```
assets/design-tokens.css
```
カラーパレット、フォント、スペーシング等の定義。生成するHTMLはこのトークンに準拠すること。

#### アイコン（必要に応じて参照）
```
assets/icons.html
```
<!-- アイコン集がある場合。なければこの行を削除 -->

#### テンプレート（必要に応じて参照）
```
templates/
```
<!-- 画面タイプごとのテンプレートがあれば、ここにテーブルで一覧を記載 -->
<!-- 例:
| ファイル | 用途 |
|----------|------|
| `templates/login.html` | ログイン画面 |
| `templates/home.html` | ホーム画面 |
| `templates/list.html` | 一覧画面 |
| `templates/detail.html` | 詳細画面 |
| `templates/form.html` | フォーム画面 |
-->

### Step 3: HTML生成

要件とデザイントークン、テンプレートを参考に、単一HTMLファイルを生成する。

**出力先:**
```
task/YYMMDD_タイトル/03_ui/[画面名].html
```

### Step 4: Figmaキャプチャ

**HTML生成後、Figmaへのキャプチャをデフォルトで実行する。**

「キャプチャ不要」「Figmaに反映しなくていい」と言われた場合のみスキップ。

詳細手順は本ファイル末尾の「Figma キャプチャワークフロー」セクション、および（リポジトリルートの）`README.md` を参照。

### Step 5: 追加要件の管理

> **重要: ユーザーから追加要望・フィードバックを受けた場合、UIの変更と同時に必ず要件書にも追記すること。これは必須ルールであり、省略してはならない。**

#### 追記のタイミング
- ユーザーから追加の要望・修正依頼があった時
- UI変更を行う前、または変更と同時に要件書も更新する
- 追加要件の追記を忘れた場合は、気づいた時点で必ず追記する

#### 追記フォーマット
```
task/.../01_require/YYMMDD_タイトル.txt

---

## 追加要件（YYYY/MM/DD）

### 〇〇の改善
- 追加要望1
- 追加要望2
```

#### ルール
- `---` で区切りを入れ、日付付きで追記
- 元の要件は変更せず、追記のみ行う
- 同じ日に複数回の追加がある場合は `#2`, `#3` と番号を付ける
- 要件書の更新を怠らないこと（後から見返した時に経緯がわかるようにする）

---

## 初回セットアップ: テンプレート作成

プロダクトフォルダ作成後、最初にやるべきことは **HTMLテンプレートの整備** です。

### Figmaに既存デザインがある場合

Figma Dev Mode MCP を使って、既存デザインからHTMLテンプレートを作成する。

1. Figma Desktop App で対象のデザインファイルを開く
2. ベースとなるフレーム（ログイン画面、ホーム画面、一覧画面など）を選択
3. `get_screenshot` でビジュアルを確認
4. `get_design_context` でノードの構造・コード・デザイントークンを取得
5. 取得した情報をもとに `templates/` にHTMLテンプレートを作成
6. 同時に `assets/design-tokens.css` にカラー・フォント等を設定

**変換ルール（Figma出力 → UI Builder出力）:**
- React+Tailwind → プレーンHTML+CSS（`<style>` 内包）
- Tailwindクラス → 対応するCSSプロパティに展開
- CSS変数（`var(--text/brand)`等）→ `design-tokens.css` のトークンにマッピング
- `localhost:3845` の画像URL → SVGインライン化 or `assets/images/` の既存画像に置換
- `data-node-id` 属性 → 削除（デバッグ用なので最終HTMLには不要）

### Figmaにデザインがない場合

ユーザーからヒアリングした情報（カラー、画面タイプ、レイアウト構成）をもとに、シンプルなテンプレートを手動で作成する。

テンプレートが整備できたら、以降はこのテンプレートを参照しながら各画面のUIを作成していく。

---

## Figma Dev Mode MCP 連携（読み取り: Figma → HTML）

「Figmaから取って」「Figmaのデザインをベースに」等の指示があった場合に使用する。

**使い方:**

1. ユーザーがFigmaで対象ノードを選択
2. `get_screenshot` でビジュアルを確認
3. `get_design_context` でノードの構造・コード・デザイントークンを取得
4. 取得した情報をベースにHTML/CSSを生成（React+Tailwind → 単一HTML に変換）

**ノードIDを指定して取得する場合:**
- FigmaのURLから `node-id` パラメータを抽出: `?node-id=1-2` → nodeId `1:2`
- `get_design_context(nodeId="8016:4031")` のように直接指定可能

**ツール一覧:**
| ツール | 用途 |
|--------|------|
| `get_design_context` | ノードのコード生成（メイン） |
| `get_screenshot` | ビジュアル確認 |
| `get_metadata` | ノード構造の概要把握 |
| `get_variable_defs` | デザイントークン（カラー・フォント）取得 |

---

## Figma キャプチャワークフロー（HTML → Figma 反映）

HTML生成後、Figmaにキャプチャして反映する。ヘルパースクリプト `figma-capture` と Figma Remote MCP (`generate_figma_design`) を組み合わせて実行する。

**デフォルト動作**: HTML生成後に自動実行。「キャプチャ不要」「Figmaに反映しなくていい」と言われた場合のみスキップ。

### 前提条件

- Figma Remote MCP (`figma-remote-mcp`) が接続済み
- Google Chrome がインストール・起動済み
- macOS（AppleScript使用）

### ヘルパースクリプト

```
../figma-capture
```

| サブコマンド | 説明 |
|---|---|
| `serve <dir> [--port 8765]` | HTTPサーバー起動 |
| `inject <html-file> <script>` | キャプチャスクリプト注入 |
| `open <url> [--delay 8]` | Chromeでページ表示→待機→閉じる |
| `clean <html-file>` | キャプチャスクリプト除去 |
| `stop` | HTTPサーバー停止 |

### ワークフロー手順

#### Step 1: figma.json の確認・作成

タスクフォルダに `figma.json` があるか確認する。

```
task/YYMMDD_title/figma.json
```

**ない場合**: ユーザーにキャプチャ先の Figma ファイルキーを確認する。

> 「キャプチャ先のFigmaファイルを教えてください。FigmaファイルのURLから `figma.com/design/{fileKey}/` の `fileKey` 部分を抽出します。」

確認後、`figma.json` を作成:

```json
{
  "fileKey": "xxxxxxxx",
  "captures": []
}
```

**ある場合**: `fileKey` を読み取って使用。

#### Step 2: HTTPサーバー起動

```bash
../figma-capture serve task/YYMMDD_title/03_ui/
```

#### Step 3: captureId 取得（MCP呼び出し）

**HTMLファイルごとに** `generate_figma_design` を呼び出す:

```
generate_figma_design(
  outputMode: "existingFile",
  fileKey: "<figma.jsonのfileKey>"
)
```

返り値から **captureId** と **JavaScriptスニペット** を取得する。

#### Step 4: キャプチャスクリプト注入

```bash
../figma-capture inject task/.../03_ui/home.html '<script src="https://...capture.js" async></script>'
```

#### Step 5: Chromeでページ表示

```bash
../figma-capture open "http://localhost:8765/home.html#figmacapture={captureId}&figmaendpoint=https%3A%2F%2Fmcp.figma.com%2Fmcp%2Fcapture%2F{captureId}%2Fsubmit&figmadelay=3000" --delay 8
```

#### Step 6: ポーリング（MCP呼び出し）

```
generate_figma_design(captureId: "<captureId>")
```

- 完了: Figma URL が返される → Step 7 へ
- `pending`: 5秒待って再ポーリング（最大3回）
- 失敗: リトライ処理（後述）へ

#### Step 7: クリーンアップ

```bash
../figma-capture clean task/.../03_ui/home.html
```

**複数ファイルがある場合**: Step 3〜7 をファイルごとに繰り返す（**必ず1ファイルずつ順次処理**）。

#### Step 8: サーバー停止

```bash
../figma-capture stop
```

#### Step 9: 記録・報告

`figma.json` にキャプチャ履歴を追記し、ユーザーに Figma URL を報告する。

### リトライ処理

| 状況 | 対応 |
|---|---|
| ポーリングで `pending` が3回以上続く | URLにキャッシュバスター `?v={timestamp}` を付けて再キャプチャ |
| キャッシュバスター付きでも失敗 | `figmadelay` を 3000 → 5000ms に増加して再実行 |
| 2回リトライしても失敗 | ユーザーに報告してスキップ。失敗したファイルを一覧表示 |

### 注意事項

- **Chrome背景タブ制約**: 複数ページの同時キャプチャは不可。必ず1ページずつ順次処理する
- **HTMLのクリーンさ**: キャプチャ完了後は必ず `clean` でスクリプトを除去する
- **サーバー停止**: 作業完了後は必ず `stop` でHTTPサーバーを停止する

---

## SVG画像の作成

**ユーザーが「これをSVGにして」と言った場合、作成済みのHTMLファイルを元にSVGファイルを作成する。**

### 作成ルール
- 同じ `03_ui/` フォルダ内にSVGファイルを出力
- HTMLの見た目をベクター形式で再現
- 画面の状態ごとに別ファイルを作成（一覧、詳細、モーダル等）

### 命名規則
```
[画面名]-list.svg      # 一覧表示
[画面名]-detail.svg    # 詳細/モーダル表示
[画面名]-[状態].svg    # その他の状態
```

### SVG作成時のポイント
- カラーは design-tokens の値を使用
- グラデーションは `<defs>` 内に `<linearGradient>` で定義
- シャドウは `<filter>` で `<feDropShadow>` を使用
- フォント: `font-family="'Noto Sans JP', sans-serif"`
- アイコン: HTMLで使用しているSVGアイコンと同じものをそのまま使用する

<!-- プロダクト固有のデザインガイドライン（カラーパレット、レイアウト構造、ボタンスタイル等）はここ以降に追記 -->

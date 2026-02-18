# UI Builder Oasis ガイド

giftee Benefit (OASIS) 専用のUI作成ツールガイドです。

> **このツールはOASIS専用です**。他のプロダクトには対応していません。

## 重要: 製品名称について

**「oasis」はギフティ社内の内部呼称です。ユーザーに見える画面上には絶対に「oasis」の名称を露出させないでください。**

- 外部向け正式名称: **giftee Benefit**
- 社内呼称: oasis（画面には表示しない）
- ロゴファイル: `assets/images/logo-giftee-benefit.svg`
- ヘッダーにロゴを表示する際は、必ず上記SVGファイルをインラインで埋め込む
- ホーム画面など、ロゴを表示するヘッダーでは `width="140" height="20"` 程度に縮小して使用

## 重要: デフォルトはCS画面

**「管理画面」と明示されていない限り、CS画面（ユーザー向け）として作成してください。**

## 画面タイプ

### CS画面（Customer Screen・ユーザー向け）- デフォルト
- **対象**: エンドユーザーが使用する画面
- **レイアウト**: モバイルファースト（375px幅）
- **ナビゲーション**: ボトムナビゲーション（iOS風blur効果）
- **テンプレート**: `templates/cs/`
- **特徴**:
  - ステータスバー表示
  - ボトムバーにblur効果
  - ホームインジケーター

### CL画面（Client Screen・管理者向け）
- **対象**: 企業管理者が使用する画面（管理画面と指定された場合のみ）
- **レイアウト**: デスクトップ（サイドナビ260px）
- **ナビゲーション**: サイドナビゲーション
- **テンプレート**: `templates/cl/`

## 単一HTMLファイル形式

**すべてのUIは単一のHTMLファイルとして完結させてください。**

- CSS は `<style>` タグ内に記述
- JavaScript が必要な場合は `<script>` タグ内に記述
- 外部ファイル参照は Google Fonts のみ許可
- SVGアイコンはインラインで記述
- 画像は `assets/images/` から相対パスで参照、または絵文字/SVGで代替

## UI作成時のワークフロー

### 1. 要件書の読み込み
```
input/yymmdd_要件署名.txt を読む
```

### 2. 参照ファイル

#### デザイントークン（必ず参照）
```
assets/design-tokens.css
```
カラーパレット、フォント、スペーシング等の定義

#### アイコン（必要に応じて参照）
```
assets/icons.html
```
よく使うSVGアイコン集

#### ロゴ
```
assets/images/logo-giftee-benefit.svg
```

#### ギフトカード画像（メッセージアルバム用）
```
assets/images/gift-cards/
```
- メッセージアルバムのギフトカードに使用する画像
- PNG/JPEG形式
- 画像がない場合はタグ種別に応じた背景色グラデーションを表示

### 3. テンプレート参照

#### CS画面（ユーザー向け）- デフォルト
| ファイル | 用途 |
|----------|------|
| `templates/cs/cs-login.html` | ログイン画面 |
| `templates/cs/cs-home.html` | ホーム画面（ボトムナビ付き） |
| `templates/cs/cs-gift-detail.html` | ギフト詳細画面 |

#### CL画面（管理者向け）- 管理画面と指定された場合のみ
| ファイル | 用途 |
|----------|------|
| `templates/cl/login.html` | ログイン画面 |
| `templates/cl/page-home.html` | ダッシュボード |
| `templates/cl/page-list.html` | 一覧画面 |
| `templates/cl/page-detail.html` | 詳細画面 |
| `templates/cl/page-form.html` | フォーム画面 |

### 4. 出力先
```
output/yymmdd_要件署名/
└── [画面名].html
```

### 5. 追加要件の管理（必須）

> **重要: ユーザーから追加要望・フィードバックを受けた場合、UIの変更と同時に必ず対応する要件書（input/yymmdd_要件署名.txt）にも追記すること。これは必須ルールであり、省略してはならない。**

#### 追記のタイミング
- ユーザーから追加の要望・修正依頼があった時
- UI変更を行う前、または変更と同時に要件書も更新する
- 追加要件の追記を忘れた場合は、気づいた時点で必ず追記する

#### 追記フォーマット
```
input/yymmdd_要件署名.txt

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

### 6. SVG画像の作成

**ユーザーが「これをSVGにして」と言った場合、作成済みのHTMLファイルを元にSVGファイルを作成する。**

#### 作成ルール
- 同じoutputフォルダ内にSVGファイルを出力
- HTMLの見た目をベクター形式で再現
- 画面の状態ごとに別ファイルを作成（一覧、詳細、モーダル等）

#### 命名規則
```
[画面名]-list.svg      # 一覧表示
[画面名]-detail.svg    # 詳細/モーダル表示
[画面名]-[状態].svg    # その他の状態
```

#### SVG作成時のポイント
- サイズ: CS画面は `width="375" height="812"`
- カラーは design-tokens の値を使用
- グラデーションは `<defs>` 内に `<linearGradient>` で定義
- シャドウは `<filter>` で `<feDropShadow>` を使用
- フォント: `font-family="'Noto Sans JP', sans-serif"`

#### 重要な注意点
- **アイコン**: HTMLで使用しているSVGアイコンと同じものをそのまま使用する（viewBox、pathを正確にコピー）
- **サイズ**: テキストサイズ、アイコンサイズはHTMLのCSSと一致させる
- **モーダル表示**: モーダルのSVGを作成する際は、背面の画面も表示し実際のUIと同じ見た目にする
  - 背面の画面を描画 → 半透明オーバーレイ（rgba(0,0,0,0.5)） → モーダルの順に重ねる

## カラーパレット（クイックリファレンス）

```css
/* Primary */
--color-primary: #0C6993;
--color-primary-dark: #0F658D;
--color-primary-light: #EBF4FA;

/* Text */
--color-text: #4E5B61;
--color-text-dark: #4B4B4B;
--color-text-gray: #777777;
--color-text-link: #1E90FF;

/* Background */
--color-background: #F0F0F0;  /* CS */
--color-white: #FFFFFF;

/* Border */
--color-border: #D9D9D9;

/* Status */
--color-positive: #28A745;
--color-negative: #DC3545;

/* Accent */
--color-accent-pink: #E8A598;
--color-accent-orange: #F4B860;
--color-accent-green: #7ECBA1;
--color-accent-blue: #7BA7D7;
```

## 色使いの注意

### 基本方針
**プライマリカラー（#0C6993）を主軸に使用すること。**

アクセントカラー（ピンク、オレンジ等）は補助的な用途に限定し、メインのUI要素には使用しない。

### プライマリカラーを使う場面
- **ボタン**: プライマリボタンの背景
- **アイコン**: 強調したいアイコンの背景・色
- **タグ/バッジ**: メインのタグ（例：「ありがとう」タグ）
- **リンク**: テキストリンク（またはtext-link色）
- **アクティブ状態**: ナビゲーションのアクティブアイテム
- **グラデーション**: `linear-gradient(135deg, #0C6993, #0F658D)`
- **装飾要素**: 背景のアクセントライン等

### アクセントカラーを使う場面（限定的）
- **タグの区別**: 複数種類のタグを色で区別する場合のみ
  - 例：「ありがとう」→ プライマリ、「おめでとう」→ オレンジ、「お疲れ様」→ グリーン
- **グラフ/チャート**: データの区別が必要な場合
- **特別なキャンペーン表示**: 目立たせたい限定コンテンツ

### 避けるべき使い方
- 背景色にピンクやオレンジ系の暖色を多用しない
- アイコンやアバターの背景にアクセントカラーのグラデーションを使わない
- メインのCTAボタンにアクセントカラーを使わない

### 背景色の使い分け
```css
/* 標準背景 */
--color-background: #F0F0F0;  /* ページ背景 */
--color-white: #FFFFFF;       /* カード背景 */
--color-primary-light: #EBF4FA; /* 強調エリアの背景（控えめに） */
```

## タイポグラフィ

```css
--font-family: 'Noto Sans JP', -apple-system, BlinkMacSystemFont, sans-serif;
```
- Google Fonts から Noto Sans JP (400, 500, 700) を読み込む
- 柔らかい印象が必要な場合は Zen Maru Gothic を追加

## レイアウト構造

### CS画面（モバイル）
```html
<div class="app">
  <div class="status-bar">...</div>
  <header class="header">...</header>
  <main class="main-content">
    <!-- ページコンテンツ -->
  </main>
  <nav class="bottom-nav">...</nav>
</div>
```
- max-width: 375px
- ボトムナビゲーション固定

### CL画面（デスクトップ）
```html
<div class="layout">
  <nav class="sidenav">...</nav>
  <main class="main">
    <div class="main-content">
      <!-- ページコンテンツ -->
    </div>
  </main>
</div>
```
- サイドナビ幅: 260px

## CS画面のボトムナビゲーション

標準的な5項目構成：
1. ホーム
2. 商品一覧
3. レター（ハートアイコン）※内部呼称は「ピアギフト」、ページ上部に「想いを届ける」サブタイトル
4. マイギフト
5. マイページ

```html
<nav class="bottom-nav">
  <div class="bottom-nav-list">
    <a href="#" class="bottom-nav-item active">
      <svg class="bottom-nav-icon">...</svg>
      <span class="bottom-nav-label">ホーム</span>
    </a>
    <!-- 他のナビアイテム -->
  </div>
  <div class="home-indicator-container">
    <div class="home-indicator"></div>
  </div>
</nav>
```

## ボトムバーのスタイル（CS画面）

```css
background: rgba(248, 248, 248, 0.82);
backdrop-filter: blur(60px);
-webkit-backdrop-filter: blur(60px);
box-shadow: 0px -0.3px 0px 0px rgba(174, 174, 180, 1);
```

## ボタンのスタイル

```css
/* プライマリボタン */
background: var(--color-primary);
color: white;
border-radius: 9999px;  /* 完全な丸み */
height: 48px;
font-weight: 700;
```

## 美しいUIのためのポイント

1. **ホバーエフェクト**: `transform: translateY(-2px)` + box-shadow
2. **トランジション**: `transition: 0.2s ease`
3. **アクティブ状態**: `transform: scale(0.98)`
4. **カードシャドウ**: `0 4px 16px rgba(0, 0, 0, 0.08)`

## スマホでUIを確認する

ユーザーから「スマホで確認したい」と言われた場合、ngrokを使って外部からアクセスできるURLを発行する。

### 手順

1. **ローカルサーバー起動**（バックグラウンド）
```bash
cd "output/[対象フォルダ]" && python3 -m http.server 8080
```

2. **ngrokでトンネル作成**（バックグラウンド）
```bash
ngrok http 8080
```

3. **公開URLを取得**
```bash
curl -s http://127.0.0.1:4040/api/tunnels | python3 -c "import sys,json; data=json.load(sys.stdin); print(data['tunnels'][0]['public_url'] if data['tunnels'] else 'No tunnels')"
```

4. **ユーザーにURLを共有**
取得したURL（例: `https://xxxx.ngrok-free.app`）をユーザーに伝える。

### 注意事項
- ngrokの無料プランでは初回アクセス時に「Visit Site」ボタンが表示される
- 確認が終わったらサーバーとngrokを停止する

## Figma参照

- **File Key**: `PtIjftYnAC9cIGfkH5DMSX`
- **Master（CS画面）**: ユーザー向け画面のベース
- **Master CL画面**: 管理者向け画面のベース

### Figma Dev Mode MCP 連携

Figma Desktop Appが起動していれば、Dev Mode MCP Server経由でデザイン情報を直接取得できる。

**使い方（Figmaからデザインを取得してUI作成）:**

1. ユーザーがFigmaで対象ノードを選択
2. `get_screenshot` でビジュアルを確認
3. `get_design_context` でノードの構造・コード・デザイントークンを取得
4. 取得した情報をベースにHTML/CSSを生成（React+Tailwind → 単一HTML に変換）

**変換ルール（Figma出力 → UI Builder出力）:**
- React+Tailwind → プレーンHTML+CSS（`<style>` 内包）
- Tailwindクラス → 対応するCSSプロパティに展開
- CSS変数（`var(--text/brand)`等）→ `design-tokens.css` のトークンにマッピング
- `localhost:3845` の画像URL → SVGインライン化 or `assets/images/` の既存画像に置換
- `data-node-id` 属性 → 削除（デバッグ用なので最終HTMLには不要）

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

## 優先順位

1. **ユーザー体験** - 最優先
2. **視覚的な美しさ** - 重要
3. **現行UIとの一貫性** - 重要
4. **abukumaデザインシステム準拠** - 基本

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

出力例: `Server started on port 8765 (PID: 12345)`

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

Step 3 で返されたJSスニペット（scriptタグ）をそのまま渡す。

#### Step 5: Chromeでページ表示

```bash
../figma-capture open "http://localhost:8765/home.html#figmacapture={captureId}&figmaendpoint=https%3A%2F%2Fmcp.figma.com%2Fmcp%2Fcapture%2F{captureId}%2Fsubmit&figmadelay=3000" --delay 8
```

- URL のハッシュパラメータに `captureId`、`figmaendpoint`、`figmadelay` を付与
- `figmadelay`: 3000ms（初回）。リトライ時は5000msに増加

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

**複数ファイルがある場合**: Step 3〜7 をファイルごとに繰り返す（**必ず1ファイルずつ順次処理**。Chromeの背景タブ制約により同時処理は失敗する）。

#### Step 8: サーバー停止

```bash
../figma-capture stop
```

#### Step 9: 記録・報告

`figma.json` にキャプチャ履歴を追記:

```json
{
  "fileKey": "xxxxxxxx",
  "captures": [
    {
      "file": "home.html",
      "captureId": "15a25d89-...",
      "figmaUrl": "https://www.figma.com/design/xxxxxxxx/...",
      "capturedAt": "2026-02-18T14:30:00+09:00"
    }
  ]
}
```

ユーザーに Figma URL を報告する。

### リトライ処理

| 状況 | 対応 |
|---|---|
| ポーリングで `pending` が3回以上続く | URLにキャッシュバスター `?v={timestamp}` を付けて再キャプチャ |
| キャッシュバスター付きでも失敗 | `figmadelay` を 3000 → 5000ms に増加して再実行 |
| 2回リトライしても失敗 | ユーザーに報告してスキップ。失敗したファイルを一覧表示 |

### Figma 画面整理プラグイン

キャプチャ後、Figma上で画面をカテゴリ別に整理するプラグインを同梱:

```
../figma-plugin/
├── manifest.json
├── code.js         # カテゴリ定義は先頭の変数で設定
└── README.md       # インストール・実行手順
```

**実行方法**: Figma Desktop App → Plugins → Development → Import plugin from manifest → `manifest.json` を指定 → Run

**デフォルトカテゴリ**（OASIS用）:
- ホーム、ショップ、ピアギフト（レター）、マイギフト、マイページ、お知らせ、クーポン、社内報、ユーティリティ、法務・ヘルプ

カテゴリは `code.js` 先頭の `CATEGORIES` 配列を編集してカスタマイズ可能。

### 注意事項

- **Chrome背景タブ制約**: 複数ページの同時キャプチャは不可。必ず1ページずつ順次処理する
- **HTMLのクリーンさ**: キャプチャ完了後は必ず `clean` でスクリプトを除去する（HTMLにキャプチャスクリプトが残らないこと）
- **サーバー停止**: 作業完了後は必ず `stop` でHTTPサーバーを停止する
- **IME注意**: AppleScript操作時に日本語IMEの影響を受ける場合がある

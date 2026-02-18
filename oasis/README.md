# UI Builder Oasis

giftee Benefit (OASIS) の構想中UIをHTMLで作成するツールです。

> **注意**: このツールはOASIS専用です。他のプロダクトのUI作成には対応していません。

## 特徴

- **単一HTMLファイル形式**: 各UIは完全に独立した単一HTMLファイルとして出力
- **美しいUI**: グラデーション、シャドウ、ホバーエフェクトを活用したモダンなデザイン
- **2種類のテンプレート**: ユーザー向け（CS画面）と管理者向け（CL画面）
- **デザインアセット**: カラーパレット、アイコン、ロゴなどを同梱

## 重要: デフォルトはCS画面

**「管理画面」と明示されていない限り、CS画面（ユーザー向け）として作成してください。**

## ディレクトリ構造

```
ui-builder/oasis/
├── input/                      # 要件書入力フォルダ
│   └── yymmdd_要件署名.txt      # 要件書ファイル
├── output/                     # 作成したUI出力フォルダ
│   └── yymmdd_要件署名/        # 各要件ごとのフォルダ
│       └── *.html              # 作成したUIファイル（単一HTML）
├── templates/                  # テンプレート
│   ├── cs/                     # CS画面（ユーザー向け）
│   │   ├── cs-login.html       # ログイン画面
│   │   ├── cs-home.html        # ホーム画面
│   │   └── cs-gift-detail.html # ギフト詳細画面
│   └── cl/                     # CL画面（管理者向け）
│       ├── login.html          # ログイン画面
│       ├── page-home.html      # ダッシュボード
│       ├── page-list.html      # 一覧画面
│       ├── page-detail.html    # 詳細画面
│       └── page-form.html      # フォーム画面
├── assets/                     # デザインアセット
│   ├── design-tokens.css       # カラーパレット・デザイントークン
│   ├── icons.html              # SVGアイコンライブラリ
│   └── images/                 # 画像ファイル
│       └── logo-giftee-benefit.svg  # ロゴ
├── styles/
│   └── abukuma.css             # デザインシステムCSS（参考用）
├── CLAUDE_GUIDE.md             # Claude用ガイド
└── README.md
```

## 画面タイプ

### CS画面（Customer Screen・ユーザー向け）- デフォルト
- エンドユーザーが使用するモバイル画面
- ボトムナビゲーション（iOS風blur効果）
- max-width: 375px
- テンプレート: `templates/cs/`

### CL画面（Client Screen・管理者向け）
- 企業管理者が使用するデスクトップ画面（管理画面と指定された場合のみ）
- サイドナビゲーション
- サイドナビ幅: 260px
- テンプレート: `templates/cl/`

## 使い方

### 1. 要件書を作成

`input/` フォルダに要件書を配置します。

**ファイル名形式:** `yymmdd_要件署名.txt`

例: `250108_ユーザー管理画面.txt`

### 2. UI作成を依頼

Claudeに以下のように依頼してください:

```
#要件書 input/250108_ユーザー管理画面.txt
このUIを作成してください。
```

### 3. 出力されるファイル

`output/` フォルダに単一HTMLファイルとして出力されます:

```
output/
└── 250108_ユーザー管理画面/
    ├── user-list.html      # ユーザー一覧画面
    ├── user-detail.html    # ユーザー詳細画面
    └── user-form.html      # ユーザー登録画面
```

## デザイン仕様

### カラーパレット

| 用途 | カラー | 説明 |
|------|--------|------|
| Primary | #0C6993 | ブランドカラー、リンク、ボタン |
| Primary Dark | #003F65 | ホバー、グラデーション |
| Primary Light | #EBF4FA | 背景、フォーカス |
| Text | #4E5B61 | 通常テキスト |
| Text Gray | #777777 | 薄いテキスト |
| Background | #F0F0F0 | ページ背景（CS）/ #F6F7F8（CL） |
| Border | #D9D9D9 | ボーダー（CS）/ #E1E7EA（CL） |
| Positive | #28A745 | 成功状態 |
| Negative | #DC3545 | エラー状態 |

### フォント

- **ファミリー:** Noto Sans JP (Google Fonts)
- **ウェイト:** 400 (通常), 500 (中), 700 (太字)

### テンプレート

#### CS画面（ユーザー向け）- `templates/cs/`
| ファイル | 用途 |
|----------|------|
| `cs-login.html` | ログイン画面 |
| `cs-home.html` | ホーム画面（ボトムナビ付き） |
| `cs-gift-detail.html` | ギフト詳細画面 |

#### CL画面（管理者向け）- `templates/cl/`
| ファイル | 用途 |
|----------|------|
| `login.html` | ログイン画面 |
| `page-home.html` | ダッシュボード/ホーム |
| `page-list.html` | 一覧画面（検索・テーブル・ページネーション） |
| `page-detail.html` | 詳細画面（詳細テーブル・タブ） |
| `page-form.html` | 登録/編集フォーム画面 |

### アセット

#### デザイントークン - `assets/design-tokens.css`
カラーパレット、フォント、スペーシング、ボーダーラジウス、シャドウなどの定義。

#### アイコンライブラリ - `assets/icons.html`
よく使うSVGアイコン集（ナビゲーション、アクション、ステータス等）。

#### 画像 - `assets/images/`
- `logo-giftee-benefit.svg` - giftee Benefitロゴ

## 動作確認

作成したHTMLファイルはブラウザで直接開いて確認できます:

```bash
# macOS
open output/yymmdd_要件署名/page.html

# Windows
start output/yymmdd_要件署名/page.html
```

## 参照元

- **現行Oasis UI:** [giftee Benefit Figma](https://www.figma.com/design/PtIjftYnAC9cIGfkH5DMSX/giftee-Benefit)
  - Master（CS画面）: ユーザー向け画面
  - Master CL画面: 管理者向け画面
- **デザインシステム abukuma:** [Design System Abukuma Figma](https://www.figma.com/design/DcLAACPcrYnAri1nyZNxC6/)

## 優先順位

1. **ユーザー体験** - 最優先
2. **視覚的な美しさ** - 重要
3. **現行UIとの一貫性** - 重要
4. **abukumaデザインシステム準拠** - 基本

デザインシステムのルールより、ユーザーにとって使いやすく美しいUIを優先します。

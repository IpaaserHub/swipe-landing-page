# Swipe Landing Page

モダンでレスポンシブな16ページの縦スワイプ動画ランディングページです。

## 🎯 特徴

- **16ページの縦スワイプ動画LP** - 美容系商品に最適化
- **完全レスポンシブ** - モバイル/タブレット/PC対応
- **自動再生機能** - 10秒間隔での自動切り替え
- **スムーズなアニメーション** - 縦方向のスワイプ操作
- **クリーンなUI** - ミニマルで洗練されたデザイン

## 🚀 ライブデモ

### Vercel Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/swipe-landing-page)

### Netlify Deploy
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/YOUR_USERNAME/swipe-landing-page)

## 📱 動作環境

- **モダンブラウザ** (Chrome, Firefox, Safari, Edge)
- **モバイルデバイス** (iOS, Android)
- **HTTPS環境** (動画自動再生のため)

## 🛠️ セットアップ

### ローカル開発

```bash
# リポジトリをクローン
git clone https://github.com/YOUR_USERNAME/swipe-landing-page.git
cd swipe-landing-page

# 依存関係をインストール
npm install

# 開発サーバー起動
npm run dev
```

ブラウザで `http://localhost:3000` を開いてください。

## 📁 プロジェクト構造

```
swipe-landing-page/
├── index.html              # メインHTML
├── css/
│   └── style.css          # スタイルシート
├── js/
│   ├── config.js          # 動画設定
│   ├── swipe-controller.js # スワイプ制御
│   └── main.js            # メインアプリケーション
├── assets/                # 動画ファイル
│   ├── hero.mp4
│   ├── hero (2).mp4
│   ├── 3.mp4 ~ 16.mp4
│   └── favicon.ico
└── package.json
```

## 🎥 動画の管理

### 動画ファイルの配置
`assets/` フォルダに以下のファイルを配置してください：

- `hero.mp4` - 1ページ目
- `hero (2).mp4` - 2ページ目  
- `3.mp4` ~ `16.mp4` - 3-16ページ目

### 設定ファイルの編集
`js/config.js` でスライドの設定を変更できます：

```javascript
const MEDIA_CONFIG = {
    slides: [
        {
            id: 1,
            type: 'video',
            src: 'assets/hero.mp4',
            alt: 'ヒーロー動画'
        },
        // 他のスライド...
    ]
};
```

## ⚙️ カスタマイズ

### 自動再生間隔の変更
```javascript
// js/config.js
autoplay: {
    delay: 10000, // 10秒間隔（ミリ秒）
}
```

### 背景色の変更
```css
/* css/style.css */
:root {
    --primary-color: #7fb3d5;
    --secondary-color: #d6eaf8;
    --accent-color: #ebf5fb;
    --gradient: linear-gradient(135deg, #7fb3d5 0%, #d6eaf8 70%, #ebf5fb 100%);
}
```

## 🎮 操作方法

### デスクトップ
- **マウスホイール** - 上下スクロールでスライド切り替え
- **キーボード** - `↑` `↓` キーで操作
- **Space** - 自動再生の開始/停止

### モバイル
- **縦スワイプ** - 上下スワイプでスライド切り替え
- **タッチ操作** - 直感的なタッチ操作

## 🌐 デプロイ

### Vercel
1. [Vercel](https://vercel.com) でアカウント作成
2. GitHubリポジトリを連携
3. 自動デプロイ開始

### Netlify
1. [Netlify](https://netlify.com) でアカウント作成
2. GitHubリポジトリを連携
3. 自動デプロイ開始

### 手動デプロイ
`deployment/` フォルダの内容を任意のウェブサーバーにアップロード

## 📊 ファイルサイズ

- **HTML/CSS/JS**: < 100KB
- **動画ファイル**: 約20MB (全16ファイル)
- **総容量**: 約20MB

## 📝 ライセンス

MIT License

## 🤝 貢献

プルリクエストやイシューの報告を歓迎します。

## 📞 サポート

質問やサポートが必要な場合は、イシューを作成してください。

---

**美容系商品のプロモーションに最適化された高品質なスワイプ動画LPです。**
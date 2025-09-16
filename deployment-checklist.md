# クライアント共有用デプロイメントガイド

## 🏃‍♂️ 最速：Netlify Deploy（5分で完了）

### 手順
1. **Netlifyアクセス**: https://netlify.com
2. **「Deploy manually」クリック**
3. **フォルダをドラッグ&ドロップ**
   ```
   swipe-landing-page/ フォルダ全体を選択してドロップ
   ```
4. **即座にURL取得**: `https://wonderful-name-123456.netlify.app`

### 必要なファイル
- ✅ index.html
- ✅ css/style.css  
- ✅ js/config.js
- ✅ js/swipe-controller.js
- ✅ js/main.js
- ✅ assets/ (全動画ファイル)

---

## 🔧 代替案：Vercel Deploy

### 手順
1. **Vercelアクセス**: https://vercel.com
2. **「Import Project」**
3. **フォルダアップロード**
4. **自動デプロイ**

---

## 📱 共有用URL例
- `https://your-project.netlify.app`
- `https://your-project.vercel.app`  
- `https://your-username.github.io/swipe-lp`

## ⚠️ 注意事項
1. **動画ファイルサイズ**: 大きいファイルはアップロード時間長め
2. **HTTPS必須**: 動画自動再生にはHTTPS必要
3. **ファイル構造維持**: 相対パスを保持

## 🎯 おすすめの流れ
1. **Netlify Deploy**（最速）
2. **URLをクライアントに送信**
3. **フィードバック収集**
4. **修正 → 再デプロイ**

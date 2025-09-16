/**
 * Swipe Landing Page Configuration
 * 画像・動画の管理とスライド設定
 */

// メディア設定 - ここで画像や動画を管理します
const MEDIA_CONFIG = {
    // スライドデータ配列
    slides: [
        {
            id: 1,
            type: 'video',
            src: 'assets/hero.mp4', // 1ページ目: hero.mp4
            alt: 'ヒーロー動画'
            // テキストオーバーレイなし（純粋な動画表示）
        },
        {
            id: 2,
            type: 'video',
            src: 'assets/hero (2).mp4', // 2ページ目: hero (2).mp4
            alt: 'ヒーロー動画2'
            // テキストオーバーレイなし（純粋な動画表示）
        },
        {
            id: 3,
            type: 'video',
            src: 'assets/3.mp4',
            alt: '動画3'
        },
        {
            id: 4,
            type: 'video',
            src: 'assets/4.mp4',
            alt: '動画4'
        },
        {
            id: 5,
            type: 'video',
            src: 'assets/5.mp4',
            alt: '動画5'
        },
        {
            id: 6,
            type: 'video',
            src: 'assets/6.mp4',
            alt: '動画6'
        },
        {
            id: 7,
            type: 'video',
            src: 'assets/7.mp4',
            alt: '動画7'
        },
        {
            id: 8,
            type: 'video',
            src: 'assets/8.mp4',
            alt: '動画8'
        },
        {
            id: 9,
            type: 'video',
            src: 'assets/9.mp4',
            alt: '動画9'
        },
        {
            id: 10,
            type: 'video',
            src: 'assets/10.mp4',
            alt: '動画10'
        },
        {
            id: 11,
            type: 'video',
            src: 'assets/11.mp4',
            alt: '動画11'
        },
        {
            id: 12,
            type: 'video',
            src: 'assets/12.mp4',
            alt: '動画12'
        },
        {
            id: 13,
            type: 'video',
            src: 'assets/13.mp4',
            alt: '動画13'
        },
        {
            id: 14,
            type: 'video',
            src: 'assets/14.mp4',
            alt: '動画14'
        },
        {
            id: 15,
            type: 'video',
            src: 'assets/15.mp4',
            alt: '動画15'
        },
        {
            id: 16,
            type: 'video',
            src: 'assets/16.mp4',
            alt: '動画16'
        }
    ],
    
    // デフォルト画像（メディアファイルが見つからない場合）
    fallbackImage: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080"%3E%3Cdefs%3E%3ClinearGradient id="grad1" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23667eea;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23764ba2;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="1920" height="1080" fill="url(%23grad1)"/%3E%3Ctext x="960" y="540" font-family="Arial, sans-serif" font-size="48" fill="white" text-anchor="middle" dominant-baseline="middle"%3EImage Placeholder%3C/text%3E%3C/svg%3E'
};

// スライダー設定
const SWIPER_CONFIG = {
    // 基本設定
    speed: 600, // 切り替え速度（ミリ秒）
    direction: 'vertical', // スライド方向: 'horizontal' または 'vertical'
    autoplay: {
        delay: 10000, // 自動再生間隔（ミリ秒）10秒
        disableOnInteraction: false, // ユーザー操作後も自動再生を継続
        pauseOnMouseEnter: true // マウスホバー時に一時停止
    },
    loop: false, // ループ無効（端で停止）
    rewind: false, // 最後から最初に戻らない
    effect: 'slide', // エフェクト: 'slide', 'fade', 'cube', 'coverflow', 'flip'
    
    // ページネーション設定
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
        dynamicBullets: true
    },
    
    // ナビゲーション設定
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
    },
    
    // キーボード操作
    keyboard: {
        enabled: true,
        onlyInViewport: true
    },
    
    // マウスホイール操作（縦スワイプ用に最適化）
    mousewheel: {
        enabled: true,
        sensitivity: 1,
        releaseOnEdges: true,
        preventWheelAction: 'auto' // エッジでのスクロール防止
    },
    
    // エッジでの動作制御
    resistance: true,
    resistanceRatio: 0.85,
    
    // タッチ操作（縦スワイプ用に最適化）
    touchEventsTarget: 'container',
    simulateTouch: true,
    touchStartPreventDefault: false,
    allowTouchMove: true, // Chrome用タッチムーブ許可
    
    // タッチ操作（縦スワイプ用に調整）
    touchRatio: 1,
    touchAngle: 60, // 縦スワイプを優先
    grabCursor: true,
    threshold: 30, // Chrome用に閾値を下げる
    longSwipesRatio: 0.5, // Chrome用ロングスワイプ
    longSwipesMs: 300, // Chrome用ロングスワイプ時間
    
    // レスポンシブ対応
    breakpoints: {
        320: {
            spaceBetween: 10
        },
        768: {
            spaceBetween: 20
        },
        1024: {
            spaceBetween: 30
        }
    },
    
    // パフォーマンス設定
    watchSlidesProgress: true,
    watchSlidesVisibility: true,
    preloadImages: false,
    lazy: {
        loadPrevNext: true,
        loadPrevNextAmount: 2
    }
};

// アプリケーション設定
const APP_CONFIG = {
    // アニメーション設定
    animations: {
        enabled: true,
        duration: 600,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
    },
    
    // UI設定
    ui: {
        showProgress: true,
        showControls: true,
        showCounter: true,
        showSettings: true,
        hideControlsDelay: 3000 // コントロール自動非表示時間（ミリ秒）
    },
    
    // パフォーマンス設定
    performance: {
        enableLazyLoading: true,
        preloadDistance: 2, // 事前読み込みするスライド数
        enableImageOptimization: true
    },
    
    // 開発者設定
    debug: true, // デバッグモード
    verbose: true // 詳細ログ出力
};

// ユーティリティ関数
const CONFIG_UTILS = {
    /**
     * メディアファイルの存在確認
     * @param {string} src - ファイルパス
     * @returns {Promise<boolean>}
     */
    checkMediaExists: async function(src) {
        return new Promise((resolve) => {
            if (src.startsWith('data:')) {
                resolve(true);
                return;
            }
            
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = src;
        });
    },
    
    /**
     * 設定の検証
     * @param {Object} config - 設定オブジェクト
     * @returns {boolean}
     */
    validateConfig: function(config) {
        if (!config.slides || !Array.isArray(config.slides)) {
            console.error('スライド設定が正しくありません');
            return false;
        }
        
        if (config.slides.length === 0) {
            console.warn('スライドが設定されていません');
            return false;
        }
        
        // 各スライドの検証
        for (const slide of config.slides) {
            if (!slide.src) {
                console.error(`スライドID ${slide.id}: srcが設定されていません`);
                return false;
            }
            
            if (!['image', 'video'].includes(slide.type)) {
                console.error(`スライドID ${slide.id}: typeは'image'または'video'である必要があります`);
                return false;
            }
        }
        
        return true;
    },
    
    /**
     * 設定のマージ
     * @param {Object} defaultConfig - デフォルト設定
     * @param {Object} userConfig - ユーザー設定
     * @returns {Object}
     */
    mergeConfig: function(defaultConfig, userConfig) {
        return {
            ...defaultConfig,
            ...userConfig,
            slides: userConfig.slides || defaultConfig.slides
        };
    }
};

// 設定をグローバルスコープで利用可能にする
window.MEDIA_CONFIG = MEDIA_CONFIG;
window.SWIPER_CONFIG = SWIPER_CONFIG;
window.APP_CONFIG = APP_CONFIG;
window.CONFIG_UTILS = CONFIG_UTILS;

// デバッグ用ログ出力
if (APP_CONFIG.debug) {
    console.log('Configuration loaded:', {
        mediaConfig: MEDIA_CONFIG,
        swiperConfig: SWIPER_CONFIG,
        appConfig: APP_CONFIG
    });
}

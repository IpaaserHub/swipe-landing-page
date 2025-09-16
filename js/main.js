/**
 * Main Application Entry Point
 * アプリケーションのメインエントリーポイント
 */

// アプリケーション全体の状態管理
const App = {
    swipeController: null,
    isLoaded: false,
    loadingScreen: null,
    
    /**
     * アプリケーション初期化
     */
    async init() {
        try {
            console.log('App initialization started...'); // デバッグ用ログ
            
            this.loadingScreen = document.getElementById('loadingScreen');
            
            // 設定の検証
            await this.validateConfiguration();
            
            // SwipeController初期化
            this.swipeController = new SwipeController();
            
            // SwipeController初期化完了を待機
            document.addEventListener('swipeControllerReady', () => {
                this.onReady();
            });
            
            // エラーハンドリング
            this.setupErrorHandling();
            
            // パフォーマンス監視
            this.setupPerformanceMonitoring();
            
        } catch (error) {
            console.error('App initialization failed:', error);
            this.showError('アプリケーションの初期化に失敗しました');
        }
    },
    
    /**
     * 設定の検証
     */
    async validateConfiguration() {
        // 必要な設定オブジェクトの存在確認
        if (!window.MEDIA_CONFIG) {
            throw new Error('MEDIA_CONFIG not found');
        }
        
        if (!window.SWIPER_CONFIG) {
            throw new Error('SWIPER_CONFIG not found');
        }
        
        if (!window.APP_CONFIG) {
            throw new Error('APP_CONFIG not found');
        }
        
        // Swiperライブラリの存在確認
        if (typeof window.Swiper === 'undefined') {
            throw new Error('Swiper library not loaded');
        }
        
        console.log('Configuration validation passed'); // デバッグ用ログ
    },
    
    /**
     * アプリケーション準備完了
     */
    onReady() {
        console.log('App ready'); // デバッグ用ログ
        
        this.isLoaded = true;
        this.hideLoadingScreen();
        this.setupGlobalEvents();
        this.setupAccessibility();
        
        // アプリケーション準備完了イベント
        this.dispatchEvent('appReady');
        
        // パフォーマンス情報をログ出力
        this.logPerformanceInfo();
    },
    
    /**
     * ローディング画面非表示
     */
    hideLoadingScreen() {
        if (this.loadingScreen) {
            this.loadingScreen.classList.add('hidden');
            
            // アニメーション完了後に要素を削除
            setTimeout(() => {
                if (this.loadingScreen && this.loadingScreen.parentNode) {
                    this.loadingScreen.parentNode.removeChild(this.loadingScreen);
                }
            }, 500);
        }
    },
    
    /**
     * グローバルイベント設定
     */
    setupGlobalEvents() {
        // ページ離脱前の処理
        window.addEventListener('beforeunload', () => {
            if (this.swipeController) {
                this.swipeController.destroy();
            }
        });
        
        // ページ可視性変更
        document.addEventListener('visibilitychange', () => {
            if (this.swipeController) {
                if (document.hidden) {
                    this.swipeController.stopAutoPlay();
                } else {
                    this.swipeController.startAutoPlay();
                }
            }
        });
        
        // オンライン/オフライン状態
        window.addEventListener('online', () => {
            console.log('Connection restored');
        });
        
        window.addEventListener('offline', () => {
            console.log('Connection lost');
        });
        
        // メディアクエリ変更
        const mediaQuery = window.matchMedia('(max-width: 768px)');
        mediaQuery.addListener((mq) => {
            console.log(`Mobile view: ${mq.matches}`); // デバッグ用ログ
            // モバイル表示時の調整（必要に応じて）
        });
    },
    
    /**
     * アクセシビリティ設定
     */
    setupAccessibility() {
        // 動きを減らす設定への対応
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (prefersReducedMotion.matches) {
            // アニメーション無効化
            document.documentElement.style.setProperty('--transition', 'none');
            console.log('Reduced motion preference detected'); // デバッグ用ログ
        }
        
        // 高コントラスト設定への対応
        const prefersHighContrast = window.matchMedia('(prefers-contrast: high)');
        if (prefersHighContrast.matches) {
            document.body.classList.add('high-contrast');
            console.log('High contrast preference detected'); // デバッグ用ログ
        }
        
        // フォーカス管理
        this.setupFocusManagement();
    },
    
    /**
     * フォーカス管理
     */
    setupFocusManagement() {
        // タブキー操作でのフォーカス表示
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('tab-focus');
            }
        });
        
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('tab-focus');
        });
        
        // スキップリンク（必要に応じて）
        this.addSkipLink();
    },
    
    /**
     * スキップリンク追加（無効化）
     */
    addSkipLink() {
        // スキップリンクを無効化
        return;
    },
    
    /**
     * エラーハンドリング設定
     */
    setupErrorHandling() {
        // グローバルエラーハンドラー
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
            if (APP_CONFIG.debug) {
                this.showError(`エラーが発生しました: ${event.error.message}`);
            }
        });
        
        // Promise rejection ハンドラー
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            if (APP_CONFIG.debug) {
                this.showError(`Promise エラー: ${event.reason}`);
            }
        });
    },
    
    /**
     * パフォーマンス監視設定
     */
    setupPerformanceMonitoring() {
        if (!APP_CONFIG.performance || !window.performance) return;
        
        // ページロード時間監視
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                if (perfData) {
                    console.log('Page load performance:', {
                        domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                        loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
                        totalTime: perfData.loadEventEnd - perfData.fetchStart
                    });
                }
            }, 0);
        });
    },
    
    /**
     * パフォーマンス情報ログ出力
     */
    logPerformanceInfo() {
        if (!APP_CONFIG.verbose || !window.performance) return;
        
        const memory = performance.memory;
        if (memory) {
            console.log('Memory usage:', {
                used: Math.round(memory.usedJSHeapSize / 1048576) + ' MB',
                total: Math.round(memory.totalJSHeapSize / 1048576) + ' MB',
                limit: Math.round(memory.jsHeapSizeLimit / 1048576) + ' MB'
            });
        }
        
        const timing = performance.timing;
        if (timing) {
            console.log('Load timing:', {
                domReady: timing.domContentLoadedEventEnd - timing.navigationStart + ' ms',
                loadComplete: timing.loadEventEnd - timing.navigationStart + ' ms'
            });
        }
    },
    
    /**
     * エラー表示
     */
    showError(message) {
        // エラートースト表示（シンプル実装）
        const errorDiv = document.createElement('div');
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ff4757;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 10000;
            max-width: 300px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(errorDiv);
        
        // 5秒後に自動削除
        setTimeout(() => {
            errorDiv.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (errorDiv.parentNode) {
                    errorDiv.parentNode.removeChild(errorDiv);
                }
            }, 300);
        }, 5000);
    },
    
    /**
     * カスタムイベント発火
     */
    dispatchEvent(eventName, detail = {}) {
        const event = new CustomEvent(eventName, { detail });
        document.dispatchEvent(event);
    },
    
    /**
     * 公開API
     */
    getSwipeController() {
        return this.swipeController;
    },
    
    isAppReady() {
        return this.isLoaded;
    }
};

// アニメーション用CSS追加
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .tab-focus *:focus {
        outline: 2px solid var(--accent-color) !important;
        outline-offset: 2px !important;
    }
    
    .high-contrast {
        filter: contrast(150%);
    }
`;
document.head.appendChild(style);

// アプリケーション初期化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
} else {
    App.init();
}

// グローバルスコープでAppを利用可能にする
window.App = App;

// デバッグ用
if (APP_CONFIG && APP_CONFIG.debug) {
    console.log('Main.js loaded successfully');
    window.DEBUG = {
        app: App,
        config: {
            media: window.MEDIA_CONFIG,
            swiper: window.SWIPER_CONFIG,
            app: window.APP_CONFIG
        }
    };
}

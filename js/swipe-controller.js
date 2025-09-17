/**
 * Swipe Controller
 * スワイプ機能とタッチ操作を管理するクラス
 */

class SwipeController {
    constructor() {
        console.log('SwipeController initializing...'); // デバッグ用ログ
        
        this.swiper = null;
        this.isAutoPlaying = false;
        this.currentSlide = 0;
        this.totalSlides = 0;
        this.settings = {
            autoplaySpeed: 10,
            transitionSpeed: 600,
            loopMode: true,
            showProgress: true
        };
        
        this.elements = {};
        this.isInitialized = false;
        
        this.bindEvents();
    }

    /**
     * 初期化
     */
    async init() {
        try {
            console.log('Starting SwipeController initialization...'); // デバッグ用ログ
            
            await this.loadElements();
            await this.validateMedia();
            await this.generateSlides();
            this.initializeSwiper();
            this.setupUI();
            this.loadSettings();
            
            this.isInitialized = true;
            console.log('SwipeController initialized successfully'); // デバッグ用ログ
            
            // 初期化完了イベントを発火
            this.dispatchEvent('swipeControllerReady');
        } catch (error) {
            console.error('SwipeController initialization failed:', error);
            this.showError('初期化に失敗しました');
        }
    }

    /**
     * DOM要素の取得
     */
    async loadElements() {
        this.elements = {
            swiperWrapper: document.getElementById('swiperWrapper'),
            navDots: document.getElementById('navDots'),
            progressFill: document.getElementById('progressFill'),
            prevBtn: document.getElementById('prevBtn'),
            nextBtn: document.getElementById('nextBtn'),
            playPauseBtn: document.getElementById('playPauseBtn'),
            slideCounter: document.getElementById('slideCounter'),
            currentSlide: document.getElementById('currentSlide'),
            totalSlides: document.getElementById('totalSlides'),
            settingsToggle: document.getElementById('settingsToggle'),
            settingsPanel: document.getElementById('settingsPanel'),
            autoplaySpeed: document.getElementById('autoplaySpeed'),
            transitionSpeed: document.getElementById('transitionSpeed'),
            loopMode: document.getElementById('loopMode'),
            showProgress: document.getElementById('showProgress'),
            autoplaySpeedValue: document.getElementById('autoplaySpeedValue'),
            transitionSpeedValue: document.getElementById('transitionSpeedValue')
        };

        // 必須要素の存在確認
        const requiredElements = ['swiperWrapper', 'navDots', 'progressFill'];
        for (const key of requiredElements) {
            if (!this.elements[key]) {
                throw new Error(`Required element not found: ${key}`);
            }
        }
    }

    /**
     * メディアファイルの検証
     */
    async validateMedia() {
        console.log('Validating media files...'); // デバッグ用ログ
        
        if (!window.MEDIA_CONFIG || !CONFIG_UTILS.validateConfig(MEDIA_CONFIG)) {
            throw new Error('Invalid media configuration');
        }

        // メディアファイルの存在確認
        for (const slide of MEDIA_CONFIG.slides) {
            console.log(`Checking media file: ${slide.src}`); // デバッグ用ログ
            
            // 動画ファイルの場合は存在確認をスキップ（ブラウザで直接処理）
            if (slide.type === 'video') {
                console.log(`Video file detected: ${slide.src}, skipping validation`);
                continue;
            }
            
            const exists = await CONFIG_UTILS.checkMediaExists(slide.src);
            if (!exists) {
                console.warn(`Media file not found: ${slide.src}, using fallback`);
                slide.src = MEDIA_CONFIG.fallbackImage;
                slide.type = 'image';
            }
        }

        this.totalSlides = MEDIA_CONFIG.slides.length;
        if (this.elements.totalSlides) {
            this.elements.totalSlides.textContent = this.totalSlides;
        }
    }

    /**
     * スライドHTML生成
     */
    async generateSlides() {
        console.log('Generating slides...'); // デバッグ用ログ
        
        const slidesHTML = MEDIA_CONFIG.slides.map((slide, index) => {
            return this.createSlideHTML(slide, index);
        }).join('');

        this.elements.swiperWrapper.innerHTML = slidesHTML;
        this.generateNavDots();
    }

    /**
     * 個別スライドHTML作成
     */
    createSlideHTML(slide, index) {
        const mediaHTML = slide.type === 'video' 
            ? this.createVideoHTML(slide)
            : this.createImageHTML(slide);

        // テキストオーバーレイがある場合のみ表示
        const hasTextContent = slide.title || slide.subtitle || slide.description || (slide.buttonText && slide.buttonLink);
        
        const contentHTML = hasTextContent ? `
            <div class="slide-overlay"></div>
            <div class="slide-content">
                ${slide.title ? `<h1>${slide.title}</h1>` : ''}
                ${slide.subtitle ? `<h2>${slide.subtitle}</h2>` : ''}
                ${slide.description ? `<p>${slide.description}</p>` : ''}
                ${slide.buttonText && slide.buttonLink ? 
                    `<a href="${slide.buttonLink}" class="btn">${slide.buttonText}</a>` : ''}
            </div>
        ` : '';

        return `
            <div class="swiper-slide" data-slide-index="${index}">
                <div class="slide-content-container">
                    ${mediaHTML}
                    ${contentHTML}
                </div>
            </div>
        `;
    }

    /**
     * 画像HTML作成
     */
    createImageHTML(slide) {
        return `<img src="${slide.src}" alt="${slide.alt || ''}" class="slide-image slide-media" loading="lazy">`;
    }

    /**
     * 動画HTML作成
     */
    createVideoHTML(slide) {
        return `
            <video class="slide-video slide-media"
                   muted
                   playsinline
                   preload="metadata"
                   webkit-playsinline="true"
                   disablepictureinpicture
                   controlslist="nodownload nofullscreen noremoteplayback"
                   style="pointer-events: none;"
                   data-slide-id="${slide.id}"
                   ${slide.poster ? `poster="${slide.poster}"` : ''}>
                <source src="${slide.src}" type="video/mp4">
                <p>動画を再生できません。ブラウザが対応していない可能性があります。</p>
            </video>
        `;
    }

    /**
     * ナビゲーションドット生成
     */
    generateNavDots() {
        const dotsHTML = MEDIA_CONFIG.slides.map((_, index) => {
            return `<div class="nav-dot ${index === 0 ? 'active' : ''}" data-slide="${index}"></div>`;
        }).join('');

        this.elements.navDots.innerHTML = dotsHTML;
    }

    /**
     * Swiper初期化
     */
    initializeSwiper() {
        console.log('🟢 Swiper初期化開始...');
        
        // タッチイベントの確認
        console.log('📱 タッチイベント対応:', 'ontouchstart' in window);
        console.log('📱 ユーザーエージェント:', navigator.userAgent);
        
        try {
            const config = {
                ...SWIPER_CONFIG,
                speed: this.settings.transitionSpeed,
                autoplay: this.settings.loopMode ? {
                    delay: this.settings.autoplaySpeed * 1000,
                    disableOnInteraction: false
                } : false,
                loop: false, // 強制的にループを無効
                rewind: false, // リワインドも無効
                allowSlidePrev: true,
                allowSlideNext: true,
                on: {
                    init: (swiper) => {
                        console.log('✅ Swiper初期化成功');
                        console.log('📊 スライド数:', swiper.slides.length);
                        console.log('🎛️ Swiper設定:', {
                            touchRatio: swiper.params.touchRatio,
                            threshold: swiper.params.threshold,
                            touchAngle: swiper.params.touchAngle,
                            simulateTouch: swiper.params.simulateTouch
                        });
                        this.swiper = swiper;
                        this.currentSlide = 0;
                        this.updateUI();
                        this.startAutoPlay();
                        // 初期スライドの動画再生を開始
                        this.playCurrentSlideVideo();
                    },
                    touchStart: (swiper, event) => {
                        console.log('👆 タッチ開始:', event.type, {
                            clientX: event.touches ? event.touches[0].clientX : event.clientX,
                            clientY: event.touches ? event.touches[0].clientY : event.clientY
                        });
                    },
                    touchMove: (swiper, event) => {
                        console.log('👆 タッチ移動:', event.type);
                    },
                    slideChange: (swiper) => {
                        if (swiper && swiper.activeIndex !== undefined) {
                            this.currentSlide = swiper.activeIndex;
                            this.updateUI();
                            this.updateProgress();
                            // スライド変更時：新しい動画を1回再生
                            this.playCurrentSlideVideo();
                        }
                    },
                    reachBeginning: (swiper) => {
                        console.log('Reached beginning - preventing further navigation'); // デバッグ用ログ
                        swiper.allowSlidePrev = false;
                        setTimeout(() => {
                            swiper.allowSlidePrev = true;
                        }, 100);
                    },
                    reachEnd: (swiper) => {
                        console.log('Reached end - preventing further navigation'); // デバッグ用ログ
                        swiper.allowSlideNext = false;
                        setTimeout(() => {
                            swiper.allowSlideNext = true;
                        }, 100);
                    },
                    autoplayStart: () => {
                        this.isAutoPlaying = true;
                        this.updatePlayPauseButton();
                    },
                    autoplayStop: () => {
                        this.isAutoPlaying = false;
                        this.updatePlayPauseButton();
                    }
                }
            };

            this.swiper = new Swiper('#mainSwiper', config);
            
            if (!this.swiper) {
                throw new Error('Swiper initialization failed');
            }
            
            console.log('Swiper instance created:', this.swiper); // デバッグ用ログ
            
        } catch (error) {
            console.error('Swiper initialization error:', error);
            throw error;
        }
    }

    /**
     * UI設定
     */
    setupUI() {
        this.updateProgress();
        this.updatePlayPauseButton();
        this.setupSettingsPanel();
    }

    /**
     * イベントバインド
     */
    bindEvents() {
        // DOMContentLoadedイベント
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            // すでにDOMが読み込まれている場合
            setTimeout(() => this.init(), 0);
        }

        // ウィンドウイベント
        window.addEventListener('resize', this.debounce(() => {
            if (this.swiper) {
                this.swiper.update();
            }
        }, 250));

        // キーボードイベント（縦方向対応）
        document.addEventListener('keydown', (e) => {
            if (!this.isInitialized) return;
            
            switch (e.key) {
                case 'ArrowUp':
                    e.preventDefault();
                    this.prevSlide();
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    this.nextSlide();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    this.prevSlide();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.nextSlide();
                    break;
                case ' ':
                    e.preventDefault();
                    this.toggleAutoPlay();
                    break;
                case 'Escape':
                    this.closeSettings();
                    break;
            }
        });

        // コントロールボタンイベント（イベント委譲）
        document.addEventListener('click', (e) => {
            if (!this.isInitialized) return;
            
            const target = e.target.closest('[id]');
            if (!target) return;

            switch (target.id) {
                case 'prevBtn':
                    this.prevSlide();
                    break;
                case 'nextBtn':
                    this.nextSlide();
                    break;
                case 'playPauseBtn':
                    this.toggleAutoPlay();
                    break;
                case 'settingsToggle':
                    this.toggleSettings();
                    break;
            }

            // ナビゲーションドット
            if (target.classList.contains('nav-dot')) {
                const slideIndex = parseInt(target.dataset.slide);
                this.goToSlide(slideIndex);
            }
        });
    }

    /**
     * 設定パネルセットアップ
     */
    setupSettingsPanel() {
        if (!this.elements.autoplaySpeed) return;

        // 設定値の初期化
        this.elements.autoplaySpeed.value = this.settings.autoplaySpeed;
        this.elements.transitionSpeed.value = this.settings.transitionSpeed;
        this.elements.loopMode.checked = this.settings.loopMode;
        this.elements.showProgress.checked = this.settings.showProgress;
        
        this.updateSettingDisplays();

        // 設定変更イベント
        this.elements.autoplaySpeed.addEventListener('input', (e) => {
            this.settings.autoplaySpeed = parseFloat(e.target.value);
            this.updateSettingDisplays();
            this.updateSwiperSettings();
            this.saveSettings();
        });

        this.elements.transitionSpeed.addEventListener('input', (e) => {
            this.settings.transitionSpeed = parseInt(e.target.value);
            this.updateSettingDisplays();
            this.updateSwiperSettings();
            this.saveSettings();
        });

        this.elements.loopMode.addEventListener('change', (e) => {
            this.settings.loopMode = e.target.checked;
            this.updateSwiperSettings();
            this.saveSettings();
        });

        this.elements.showProgress.addEventListener('change', (e) => {
            this.settings.showProgress = e.target.checked;
            this.toggleProgressBar();
            this.saveSettings();
        });
    }

    /**
     * 設定表示更新
     */
    updateSettingDisplays() {
        if (this.elements.autoplaySpeedValue) {
            this.elements.autoplaySpeedValue.textContent = this.settings.autoplaySpeed;
        }
        if (this.elements.transitionSpeedValue) {
            this.elements.transitionSpeedValue.textContent = this.settings.transitionSpeed;
        }
    }

    /**
     * Swiper設定更新
     */
    updateSwiperSettings() {
        if (!this.swiper) return;

        this.swiper.params.speed = this.settings.transitionSpeed;
        
        if (this.settings.loopMode) {
            this.swiper.params.autoplay = {
                delay: this.settings.autoplaySpeed * 1000,
                disableOnInteraction: false
            };
            if (this.isAutoPlaying) {
                this.swiper.autoplay.start();
            }
        } else {
            this.swiper.autoplay.stop();
        }

        this.swiper.update();
    }

    /**
     * UI更新
     */
    updateUI() {
        this.updateSlideCounter();
        this.updateNavDots();
        this.updateProgress();
    }

    /**
     * スライドカウンター更新
     */
    updateSlideCounter() {
        if (this.elements.currentSlide) {
            this.elements.currentSlide.textContent = this.currentSlide + 1;
        }
    }

    /**
     * ナビゲーションドット更新
     */
    updateNavDots() {
        const dots = this.elements.navDots.querySelectorAll('.nav-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });
    }

    /**
     * プログレスバー更新
     */
    updateProgress() {
        if (this.elements.progressFill && this.settings.showProgress) {
            const progress = ((this.currentSlide + 1) / this.totalSlides) * 100;
            this.elements.progressFill.style.width = `${progress}%`;
        }
    }

    /**
     * プレイ/ポーズボタン更新
     */
    updatePlayPauseButton() {
        if (!this.elements.playPauseBtn) return;

        const playIcon = this.elements.playPauseBtn.querySelector('.play-icon');
        const pauseIcon = this.elements.playPauseBtn.querySelector('.pause-icon');

        if (playIcon && pauseIcon) {
            playIcon.classList.toggle('hidden', this.isAutoPlaying);
            pauseIcon.classList.toggle('hidden', !this.isAutoPlaying);
        }
    }

    /**
     * プログレスバー表示切り替え
     */
    toggleProgressBar() {
        const progressBar = document.querySelector('.progress-bar');
        if (progressBar) {
            progressBar.style.display = this.settings.showProgress ? 'block' : 'none';
        }
    }

    /**
     * スライド操作メソッド
     */
    nextSlide() {
        if (this.swiper && typeof this.swiper.slideNext === 'function') {
            // 最後のスライドでないかチェック
            if (this.currentSlide < this.totalSlides - 1) {
                this.swiper.slideNext();
            } else {
                console.log('Already at last slide - preventing navigation');
            }
        }
    }

    prevSlide() {
        if (this.swiper && typeof this.swiper.slidePrev === 'function') {
            // 最初のスライドでないかチェック
            if (this.currentSlide > 0) {
                this.swiper.slidePrev();
            } else {
                console.log('Already at first slide - preventing navigation');
            }
        }
    }

    goToSlide(index) {
        if (this.swiper && typeof this.swiper.slideTo === 'function') {
            // 有効なインデックス範囲かチェック
            if (index >= 0 && index < this.totalSlides) {
                this.swiper.slideTo(index);
            } else {
                console.log('Invalid slide index:', index);
            }
        }
    }

    startAutoPlay() {
        if (this.swiper && this.swiper.autoplay && this.settings.loopMode) {
            this.swiper.autoplay.start();
        }
    }

    stopAutoPlay() {
        if (this.swiper && this.swiper.autoplay) {
            this.swiper.autoplay.stop();
        }
    }

    toggleAutoPlay() {
        if (this.isAutoPlaying) {
            this.stopAutoPlay();
        } else {
            this.startAutoPlay();
        }
    }

    /**
     * 設定パネル操作
     */
    toggleSettings() {
        if (this.elements.settingsPanel) {
            this.elements.settingsPanel.classList.toggle('active');
        }
    }

    closeSettings() {
        if (this.elements.settingsPanel) {
            this.elements.settingsPanel.classList.remove('active');
        }
    }

    /**
     * 設定の保存・読み込み
     */
    saveSettings() {
        try {
            localStorage.setItem('swipeSettings', JSON.stringify(this.settings));
        } catch (error) {
            console.warn('Failed to save settings:', error);
        }
    }

    loadSettings() {
        try {
            const saved = localStorage.getItem('swipeSettings');
            if (saved) {
                this.settings = { ...this.settings, ...JSON.parse(saved) };
                this.updateSettingDisplays();
                this.toggleProgressBar();
            }
        } catch (error) {
            console.warn('Failed to load settings:', error);
        }
    }

    /**
     * ユーティリティメソッド
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    dispatchEvent(eventName, detail = {}) {
        const event = new CustomEvent(eventName, { detail });
        document.dispatchEvent(event);
    }

    showError(message) {
        console.error(message);
        // エラー表示UI（必要に応じて実装）
    }

    /**
     * 現在のスライドの動画を1回再生
     */
    playCurrentSlideVideo() {
        if (!this.swiper) return;
        
        const currentSlide = this.swiper.slides[this.swiper.activeIndex];
        if (!currentSlide) return;
        
        // 全ての動画を停止
        this.stopAllVideos();
        
        // 現在のスライドの動画を再生
        const video = currentSlide.querySelector('.slide-video');
        if (video) {
            console.log('🎬 動画再生開始:', video.dataset.slideId);
            video.currentTime = 0; // 最初から再生
            
            video.play().then(() => {
                console.log('✅ 動画再生成功');
            }).catch(error => {
                console.warn('⚠️ 動画再生失敗:', error);
                // 自動再生に失敗した場合のフォールバック
                this.handleVideoAutoplayFailure(video);
            });
            
            // 動画終了時の処理（1回のみ再生）
            video.onended = () => {
                console.log('🎬 動画再生完了');
                // 動画は停止状態を維持（ループしない）
            };
        }
    }
    
    /**
     * 全ての動画を停止
     */
    stopAllVideos() {
        const allVideos = this.container.querySelectorAll('.slide-video');
        allVideos.forEach(video => {
            video.pause();
            video.currentTime = 0;
        });
    }

    /**
     * モバイル用動画再生確保（新実装）
     */
    ensureVideoPlayback() {
        // 新しい実装では playCurrentSlideVideo を使用
        this.playCurrentSlideVideo();
    }

    /**
     * 動画自動再生失敗時の処理
     */
    handleVideoAutoplayFailure(video) {
        // ユーザーの最初のタッチで全動画を再生可能にする
        const enableVideoPlayback = () => {
            const allVideos = document.querySelectorAll('video');
            allVideos.forEach(v => {
                if (v.paused) {
                    v.play().catch(e => console.log('Video play failed:', e));
                }
            });
            
            // イベントリスナーを削除
            document.removeEventListener('touchstart', enableVideoPlayback);
            document.removeEventListener('click', enableVideoPlayback);
        };

        // 最初のユーザー操作を待機
        document.addEventListener('touchstart', enableVideoPlayback, { once: true });
        document.addEventListener('click', enableVideoPlayback, { once: true });
        
        console.log('Video playback will be enabled on first user interaction');
    }

    /**
     * 破棄
     */
    destroy() {
        if (this.swiper) {
            this.swiper.destroy();
            this.swiper = null;
        }
        this.isInitialized = false;
    }
}

// SwipeControllerをグローバルスコープで利用可能にする
window.SwipeController = SwipeController;

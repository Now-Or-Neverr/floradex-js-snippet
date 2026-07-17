/**
 * Floradex Biodiversity Dashboard - JavaScript Widget
 * Version: 2.2.0
 * 
 * A professional, standalone widget for embedding biodiversity dashboard data
 * on external websites with dynamic project parameters, theme support, and
 * automatic 24-hour data refresh functionality.
 * 
 * @author Pollenize
 * @license Proprietary
 * @copyright 2024 Pollenize. All rights reserved.
 * 
 * @example
 * <script src="https://cdn.pollenize.org.uk/" data-project="bodmin-airfield" data-theme="light"></script>
 * <div id="floradex-widget-container"></div>
 */

(function (global) {
    'use strict';

    /**
     * Configuration constants and default settings
     * @namespace FLORADEX_CONFIG
     */
    const FLORADEX_CONFIG = {
        /** @type {string} Base URL for the Shiny app deployment */
        baseUrl: 'https://pollenize1.shinyapps.io/Floradex-live-demo/',

        /** @type {Object} Default widget settings */
        defaults: {
            height: '800px',
            width: '100%',
            theme: 'light',
            showHeader: false,
            showFooter: false,
            /** Hide scrollbars on the widget mount (host div); does not change cross-origin iframe internals */
            hideMountScrollbar: true,
            responsive: true,
            projectId: null,
            containerId: 'floradex-widget-container',
            loadingTimeout: 30000, // 30 seconds
            retryAttempts: 3
        },

        /** @type {Object} Supported theme configurations */
        themes: {
            light: {
                backgroundColor: '#ffffff',
                textColor: '#262626',
                borderColor: '#e5e5e5',
                shadowColor: 'rgba(0, 0, 0, 0.1)'
            },
            dark: {
                backgroundColor: '#1a1a1a',
                textColor: '#ffffff',
                borderColor: '#404040',
                shadowColor: 'rgba(255, 255, 255, 0.1)'
            }
        },

        /** @type {Object} Available project configurations */
        projects: {
            'bodmin-airfield': {
                name: 'Bodmin Airfield',
                description: 'Biodiversity monitoring at Bodmin Airfield'
            },
            'hemsworth-farm-master': {
                name: 'Hemsworth Farm Master',
                description: 'Agricultural biodiversity monitoring'
            },
            'brannel-academy-ukri': {
                name: 'Brannel Academy UKRI',
                description: 'Educational biodiversity project at Brannel Academy'
            },
            'helston-school-ukri': {
                name: 'Helston School UKRI',
                description: 'School-based biodiversity monitoring at Helston'
            },
            'camborne-school-ukri': {
                name: 'Camborne School UKRI',
                description: 'Educational biodiversity tracking at Camborne School'
            },
            'mounts-bay-academy-ukri': {
                name: 'Mounts Bay Academy UKRI',
                description: 'Academy biodiversity project at Mounts Bay'
            },
            'penrice-academy-ukri': {
                name: 'Penrice Academy UKRI',
                description: 'Educational biodiversity monitoring at Penrice Academy'
            },
            'penryn-college-ukri': {
                name: 'Penryn College UKRI',
                description: 'College biodiversity project at Penryn'
            },
            'treviglas-academy-ukri': {
                name: 'Treviglas Academy UKRI',
                description: 'Academy biodiversity tracking at Treviglas'
            },
            'city-college-plymouth': {
                name: 'City College Plymouth',
                description: 'Educational institution biodiversity'
            },
            'newquay-orchard': {
                name: 'Newquay Orchard',
                description: 'Orchard biodiversity monitoring in Newquay'
            },
            'penzance-heliport': {
                name: 'Penzance Heliport',
                description: 'Heliport biodiversity tracking at Penzance'
            },
            'queen-marys-university-london': {
                name: 'Queen Mary\'s University London',
                description: 'University biodiversity project in London'
            },
            'scott-business-park': {
                name: 'Scott Business Park',
                description: 'Business park biodiversity monitoring'
            },
            'seaspace-newquay': {
                name: 'Seaspace Newquay',
                description: 'Marine biodiversity tracking at Newquay'
            },
            'sherford': {
                name: 'Sherford',
                description: 'Community biodiversity monitoring at Sherford'
            },
            'st-marys-church-tamerton': {
                name: 'St Mary\'s Church Tamerton',
                description: 'Church grounds biodiversity tracking'
            },
            'tamar-valley-centre': {
                name: 'Tamar Valley Centre',
                description: 'Biodiversity tracking in Tamar Valley'
            },
            'teats-hill-takeapart': {
                name: 'Teats Hill Takeapart',
                description: 'Community biodiversity project at Teats Hill'
            },
            'tippy-park-orchard': {
                name: 'Tippy Park Orchard',
                description: 'Orchard biodiversity monitoring at Tippy Park'
            },
            'tulgey-woods': {
                name: 'Tulgey Woods',
                description: 'Woodland biodiversity tracking'
            },
            'waterden-green-qeop': {
                name: 'Waterden Green QEOP',
                description: 'Queen Elizabeth Olympic Park biodiversity monitoring'
            },
            'wray-crescent-london': {
                name: 'Wray Crescent London',
                description: 'Urban biodiversity tracking in London'
            },
            'central-park-nature-counts': {
                name: 'Central Park Nature Counts',
                description: 'Urban park biodiversity monitoring'
            },
            'devonport-park-nature-counts': {
                name: 'Devonport Park Nature Counts',
                description: 'Urban park biodiversity tracking'
            },
            'keyham-park-nature-counts': {
                name: 'Keyham Park Nature Counts',
                description: 'Park biodiversity monitoring at Keyham'
            },
            'mount-wise-park-nature-counts': {
                name: 'Mount Wise Park Nature Counts',
                description: 'Park biodiversity tracking at Mount Wise'
            },
            'common-flora-biodiversity-toolkit': {
                name: 'Common Flora Biodiversity Toolkit',
                description: 'Common Flora Biodiversity Toolkit'
            },
            'abundant-life-1': {
                name: 'Abundant Life 1',
                description: 'Abundant Life biodiversity project 1'
            },
            'yelland-farm-biodivesity-toolkit': {
                name: 'Yelland Farm Biodiversity Toolkit',
                description: 'Yelland Farm Biodiversity Toolkit'
            },
            'abundant-life-3': {
                name: 'Abundant Life 3',
                description: 'Abundant Life biodiversity project 3'
            },
            'cutwellcombe-farm-biodiversity-toolkit': {
                name: 'Cutwellcombe Farm Biodiversity Toolkit',
                description: 'Cutwellcombe Farm Biodiversity Toolkit'
            },
            'fowlescombe-farm-biodiversity-toolkit': {
                name: 'Fowlescombe Farm Biodiversity Toolkit',
                description: 'Fowlescombe Farm Biodiversity Toolkit'
            },
            'abundant-life-6': {
                name: 'Abundant Life 6',
                description: 'Abundant Life biodiversity project 6'
            },
            'abundant-life-7': {
                name: 'Abundant Life 7',
                description: 'Abundant Life biodiversity project 7'
            },
            'abundant-life-8': {
                name: 'Abundant Life 8',
                description: 'Abundant Life biodiversity project 8'
            },
            'abundant-life-9': {
                name: 'Abundant Life 9',
                description: 'Abundant Life biodiversity project 9'
            },
            'abundant-life-10': {
                name: 'Abundant Life 10',
                description: 'Abundant Life biodiversity project 10'
            },
            'common-flora-abundant-life': {
                name: 'Common Flora Abundant Life',
                description: 'Common flora biodiversity tracking for Abundant Life'
            },
            'pollenize-cornish-essential-oils': {
                name: 'Pollenize Cornish Essential Oils',
                description: 'Plant diversity monitoring for essential oils'
            },
            'pollenize-lost-gardens-of-heligan': {
                name: 'Pollenize Lost Gardens of Heligan',
                description: 'Garden biodiversity analysis at Heligan'
            },
            'pollenize-merryhue-farm': {
                name: 'Pollenize Merryhue Farm',
                description: 'Farm biodiversity monitoring at Merryhue'
            },
            'pollenize-newton-farm-metherell': {
                name: 'Pollenize Newton Farm Metherell',
                description: 'Farm biodiversity tracking at Newton Farm'
            },
            'pollenize-penhale-pantry': {
                name: 'Pollenize Penhale Pantry',
                description: 'Pantry biodiversity project at Penhale'
            },
            'mvv-plymouth': {
                name: 'MVV Plymouth',
                description: 'MVV Plymouth biodiversity project'
            },
            "south-west-dairy-development-centre": {
                name: 'South West Dairy Development Centre',
                description: 'South West Dairy Development Centre biodiversity project'
            }
        }
    };

    /**
     * Main Floradex Widget Class
     * @class FloradexWidget
     */
    class FloradexWidget {
        /**
         * Creates an instance of FloradexWidget
         * @param {Object} [options={}] - Widget configuration options
         * @param {string} [options.projectId] - Project identifier (required)
         * @param {string} [options.theme='light'] - Theme ('light' or 'dark')
         * @param {string} [options.containerId='floradex-widget-container'] - Container element ID
         */
        constructor(options = {}) {
            this.settings = { ...FLORADEX_CONFIG.defaults, ...options };
            this.container = null;
            this.iframe = null;
            this.isInitialized = false;
            this.currentProject = null;
            this.retryCount = 0;
            this.loadingTimeout = null;
            this.refreshInterval = null;
            this.lastRefreshTime = Date.now();
            this.instanceId = this.generateInstanceId();

            // Extract settings from script tag data attributes
            this.extractScriptAttributes();

            // Initialize when DOM is ready
            this.initializeWhenReady();
        }

        /**
         * Generate unique instance ID
         * @private
         * @returns {string} Unique instance ID
         */
        generateInstanceId() {
            return 'floradex-' + Math.random().toString(36).substr(2, 9) + '-' + Date.now();
        }

        /**
         * Extract configuration from script tag data attributes
         * @private
         */
        extractScriptAttributes() {
            try {
                // Any external script URL; match by data attributes below
                const scripts = document.querySelectorAll('script[src]');
                const script = Array.from(scripts).find(s =>
                    s.hasAttribute('data-project') || s.hasAttribute('data-theme')
                );

                if (!script) {
                    this.log('debug', 'No script tag with data attributes found');
                    this.log('debug', 'Available scripts:', Array.from(scripts).map(s => ({
                        src: s.src,
                        hasDataProject: s.hasAttribute('data-project'),
                        hasDataTheme: s.hasAttribute('data-theme')
                    })));
                    return;
                }

                const attrs = script.dataset;
                this.log('debug', 'Found script with data attributes:', attrs);

                // Map data attributes to settings with validation
                this.mapDataAttributes(attrs);

            } catch (error) {
                this.log('error', 'Failed to extract script attributes:', error);
            }
        }

        /**
         * Map data attributes to widget settings
         * @private
         * @param {Object} attrs - Data attributes from script tag
         */
        mapDataAttributes(attrs) {
            // Only map the essential data attributes
            if (attrs.project !== undefined) {
                this.settings.projectId = attrs.project;
            }

            if (attrs.theme !== undefined) {
                this.settings.theme = attrs.theme;
            }

            if (attrs.hideScrollbar !== undefined) {
                const s = String(attrs.hideScrollbar).trim().toLowerCase();
                this.settings.hideMountScrollbar = !(s === 'false' || s === '0' || s === 'no');
            }

            this.log('debug', 'Mapped settings:', this.settings);
        }

        /**
         * Initialize widget when DOM is ready
         * @private
         */
        initializeWhenReady() {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.init());
            } else {
                this.init();
            }
        }

        /**
         * Initialize the widget
         * @public
         * @returns {Promise<void>}
         */
        async init() {
            try {
                this.log('info', 'Initializing Floradex widget...');

                // Validate container
                if (!this.validateContainer()) {
                    return;
                }

                // Validate settings
                if (!this.validateSettings()) {
                    return;
                }

                // Setup widget
                this.setupWidget();

                // Build and load widget
                await this.loadWidget();

                this.log('info', 'Widget initialized successfully', {
                    projectId: this.settings.projectId,
                    theme: this.settings.theme
                });

            } catch (error) {
                this.log('error', 'Initialization failed:', error);
                this.handleInitializationError(error);
            }
        }

        /**
         * Validate container element exists
         * @private
         * @returns {boolean}
         */
        validateContainer() {
            this.container = document.getElementById(this.settings.containerId);

            if (!this.container) {
                this.log('error', 'Container element not found', { containerId: this.settings.containerId });
                this.showError('Widget container not found');
                return false;
            }

            // Track widget instance on container
            this.container._floradexWidget = this;
            this.container.id = this.container.id || this.instanceId;

            return true;
        }

        /**
         * Validate widget settings
         * @private
         * @returns {boolean}
         */
        validateSettings() {
            if (!this.settings.projectId) {
                this.log('error', 'Project ID is required');
                this.showError('Project ID is required. Set data-project attribute on script tag.');
                return false;
            }

            if (!FLORADEX_CONFIG.projects[this.settings.projectId]) {
                this.log('error', 'Project not found', { projectId: this.settings.projectId });
                this.showError(`Project "${this.settings.projectId}" is not available`);
                return false;
            }

            return true;
        }

        /**
         * Setup widget components
         * @private
         */
        setupWidget() {
            this.addHeaderFooter();
            this.applyStyles();
            this.applyMountScrollbarPresentation();
            this.currentProject = this.settings.projectId;
        }

        /**
         * Load the widget iframe
         * @private
         * @returns {Promise<void>}
         */
        async loadWidget() {
            const widgetUrl = this.buildWidgetUrl();
            this.createIframe(widgetUrl);
            this.isInitialized = true;

            // Setup automatic refresh every 24 hours
            this.setupAutoRefresh();

            this.dispatchEvent('floradex:initialized', {
                projectId: this.settings.projectId,
                container: this.container
            });
        }

        /**
         * Handle initialization errors
         * @private
         * @param {Error} error - The error that occurred
         */
        handleInitializationError(error) {
            this.showError('Failed to initialize widget');
            this.dispatchEvent('floradex:error', {
                projectId: this.settings.projectId,
                error: error.message,
                type: 'initialization'
            });
        }

        /**
         * Professional logging system
         * @private
         * @param {string} level - Log level (debug, info, warn, error)
         * @param {string} message - Log message
         * @param {*} [data] - Additional data to log
         */
        log(level, message, data = null) {
            const timestamp = new Date().toISOString();
            const prefix = `[Floradex ${timestamp}]`;

            const logData = data ? { message, data } : { message };

            switch (level) {
                case 'debug':
                    if (this.settings.debug) {
                        console.debug(prefix, message, data || '');
                    }
                    break;
                case 'info':
                    console.info(prefix, message, data || '');
                    break;
                case 'warn':
                    console.warn(prefix, message, data || '');
                    break;
                case 'error':
                    console.error(prefix, message, data || '');
                    break;
            }
        }

        /**
         * Build the widget URL with essential parameters
         * @param {boolean} [forceRefresh=false] - Whether to force cache refresh
         */
        buildWidgetUrl(forceRefresh = false) {
            const params = new URLSearchParams();

            // Add essential parameters only
            if (this.settings.projectId) {
                params.append('project', this.settings.projectId);
            }

            // Add theme parameter
            params.append('theme', this.settings.theme);

            // Add widget mode parameter for embedding
            params.append('widget', 'true');

            // Add timestamp to force cache refresh every 24 hours
            if (forceRefresh) {
                params.append('_t', Date.now().toString());
            } else {
                // Use daily timestamp for consistent caching within 24-hour periods
                const dailyTimestamp = Math.floor(Date.now() / (24 * 60 * 60 * 1000)) * (24 * 60 * 60 * 1000);
                params.append('_t', dailyTimestamp.toString());
            }

            const baseUrl = FLORADEX_CONFIG.baseUrl.endsWith('/')
                ? FLORADEX_CONFIG.baseUrl
                : FLORADEX_CONFIG.baseUrl + '/';

            return baseUrl + '?' + params.toString();
        }

        /**
         * Create and configure the iframe
         * @private
         * @param {string} url - Widget URL
         */
        createIframe(url) {
            try {
                this.clearContainer();
                this.addHeaderFooter();

                this.iframe = this.createIframeElement(url);
                this.configureIframeStyles();
                this.setupIframeEventHandlers();

                this.container.appendChild(this.iframe);
                this.log('debug', 'Iframe created and added to container', { url });

            } catch (error) {
                this.log('error', 'Failed to create iframe:', error);
                this.showError('Failed to create widget iframe');
            }
        }

        /**
         * Clear container content
         * @private
         */
        clearContainer() {
            this.container.innerHTML = '';
        }

        /**
         * Create iframe element with proper attributes
         * @private
         * @param {string} url - Widget URL
         * @returns {HTMLIFrameElement}
         */
        createIframeElement(url) {
            const iframe = document.createElement('iframe');
            iframe.src = url;
            iframe.title = 'Floradex Biodiversity Dashboard';
            iframe.allowFullscreen = true;
            iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation');
            iframe.setAttribute('loading', 'lazy');
            iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
            return iframe;
        }

        /**
         * Configure iframe styles
         * @private
         */
        configureIframeStyles() {
            const theme = FLORADEX_CONFIG.themes[this.settings.theme] || FLORADEX_CONFIG.themes.light;

            this.iframe.style.cssText = `
                width: ${this.settings.width};
                height: ${this.settings.height};
                border: none;
                border-radius: 12px;
                box-shadow: 0 4px 12px ${theme.shadowColor};
                background-color: ${theme.backgroundColor};
                display: block;
                margin: 0 auto;
                transition: opacity 0.3s ease;
            `;
        }

        /**
         * Setup iframe event handlers
         * @private
         */
        setupIframeEventHandlers() {
            this.showLoading();

            // Set loading timeout
            this.loadingTimeout = setTimeout(() => {
                this.handleLoadingTimeout();
            }, this.settings.loadingTimeout);

            this.iframe.onload = () => {
                this.handleIframeLoad();
            };

            this.iframe.onerror = () => {
                this.handleIframeError();
            };
        }

        /**
         * Handle iframe load success
         * @private
         */
        handleIframeLoad() {
            this.clearLoadingTimeout();
            this.hideLoading();

            this.log('info', 'Widget loaded successfully');
            this.dispatchEvent('floradex:loaded', {
                projectId: this.settings.projectId,
                url: this.iframe.src
            });
        }

        /**
         * Handle iframe load error
         * @private
         */
        handleIframeError() {
            this.clearLoadingTimeout();
            this.hideLoading();

            this.log('error', 'Failed to load widget iframe');
            this.showError('Failed to load widget');
            this.dispatchEvent('floradex:error', {
                projectId: this.settings.projectId,
                error: 'iframe_load_failed',
                type: 'load_error'
            });
        }

        /**
         * Handle loading timeout
         * @private
         */
        handleLoadingTimeout() {
            this.hideLoading();
            this.log('warn', 'Widget loading timeout exceeded');
            this.showError('Widget loading timeout. Please try again.');
            this.dispatchEvent('floradex:error', {
                projectId: this.settings.projectId,
                error: 'loading_timeout',
                type: 'timeout'
            });
        }

        /**
         * Clear loading timeout
         * @private
         */
        clearLoadingTimeout() {
            if (this.loadingTimeout) {
                clearTimeout(this.loadingTimeout);
                this.loadingTimeout = null;
            }
        }

        /**
         * Add header and footer elements
         */
        addHeaderFooter() {
            const theme = FLORADEX_CONFIG.themes[this.settings.theme] || FLORADEX_CONFIG.themes.light;

            // Add header
            if (this.settings.showHeader) {
                const header = document.createElement('div');
                header.className = 'floradex-header';
                header.style.cssText = `
                    text-align: center;
                    margin-bottom: 20px;
                    color: ${theme.textColor};
                `;

                const projectConfig = FLORADEX_CONFIG.projects[this.settings.projectId];
                const projectName = projectConfig ? projectConfig.name : 'Biodiversity Tracking Dashboard';

                header.innerHTML = `
                    <h2 style="
                        font-size: 28px;
                        font-weight: 600;
                        margin-bottom: 8px;
                        font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
                        color: ${theme.textColor};
                    ">${projectName}</h2>
                    <p style="
                        font-size: 16px;
                        color: ${theme.textColor}80;
                        margin: 0;
                        font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
                    ">Explore pollinator diversity and plant support scores</p>
                `;

                this.container.insertBefore(header, this.container.firstChild);
            }

            // Add footer
            if (this.settings.showFooter) {
                const footer = document.createElement('div');
                footer.className = 'floradex-footer';
                footer.style.cssText = `
                    text-align: center;
                    margin-top: 20px;
                    font-size: 14px;
                    color: ${theme.textColor}80;
                `;

                footer.innerHTML = `
                    Powered by <a href="https://www.pollenize.org.uk/" target="_blank" style="color: #fabd30; text-decoration: none;">Pollenize</a>
                `;

                this.container.appendChild(footer);
            }
        }

        /**
         * Apply responsive styles
         */
        applyStyles() {
            if (document.getElementById('floradex-widget-styles')) {
                return; // Styles already added
            }

            const style = document.createElement('style');
            style.id = 'floradex-widget-styles';
            style.textContent = `
                .floradex-loading {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 200px;
                    color: #666;
                    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
                }
                
                .floradex-error {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 200px;
                    color: #e74c3c;
                    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
                    text-align: center;
                    padding: 20px;
                }
                
                @media (max-width: 768px) {
                    .floradex-header h2 {
                        font-size: 24px !important;
                    }
                    
                    .floradex-header p {
                        font-size: 14px !important;
                    }
                }
                
                @media (max-width: 480px) {
                    .floradex-header h2 {
                        font-size: 20px !important;
                    }
                }

                .floradex-widget--hide-mount-scrollbar {
                    scrollbar-width: none;
                    -ms-overflow-style: none;
                }
                .floradex-widget--hide-mount-scrollbar::-webkit-scrollbar {
                    display: none;
                    width: 0;
                    height: 0;
                }
            `;

            document.head.appendChild(style);
        }

        /**
         * Hide scrollbars on the widget container (embed mount section).
         * @private
         */
        applyMountScrollbarPresentation() {
            if (!this.container) {
                return;
            }
            if (this.settings.hideMountScrollbar) {
                this.container.classList.add('floradex-widget--hide-mount-scrollbar');
            } else {
                this.container.classList.remove('floradex-widget--hide-mount-scrollbar');
            }
        }

        /**
         * Show loading state
         */
        showLoading() {
            if (!this.container.querySelector('.floradex-loading')) {
                const loading = document.createElement('div');
                loading.className = 'floradex-loading';
                loading.innerHTML = `
                    <div>
                        <div style="margin-bottom: 10px;">🔄</div>
                        <div>Loading biodiversity data...</div>
                    </div>
                `;
                this.container.appendChild(loading);
            }
        }

        /**
         * Hide loading state
         */
        hideLoading() {
            const loading = this.container.querySelector('.floradex-loading');
            if (loading) {
                loading.remove();
            }
        }

        /**
         * Show error message with retry option
         * @private
         * @param {string} message - Error message
         * @param {boolean} [showRetry=false] - Show retry button
         */
        showError(message, showRetry = false) {
            const retryButton = showRetry && this.retryCount < this.settings.retryAttempts
                ? `<button onclick="this.closest('.floradex-error').retry()" style="
                    margin-top: 10px;
                    padding: 8px 16px;
                    background: #fabd30;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-family: inherit;
                ">Retry</button>`
                : '';

            this.container.innerHTML = `
                <div class="floradex-error" ${showRetry ? 'retry="true"' : ''}>
                    <div>
                        <div style="margin-bottom: 10px; font-size: 24px;">⚠️</div>
                        <div style="margin-bottom: 10px;">${message}</div>
                        ${retryButton}
                    </div>
                </div>
            `;

            // Add retry functionality
            if (showRetry) {
                const errorDiv = this.container.querySelector('.floradex-error');
                errorDiv.retry = () => {
                    this.retryCount++;
                    this.log('info', `Retrying widget load (attempt ${this.retryCount})`);
                    this.init();
                };
            }
        }

        /**
         * Update widget with new parameters
         * @public
         * @param {Object} newSettings - New settings to apply
         * @returns {Promise<void>}
         */
        async update(newSettings = {}) {
            this.log('info', 'Updating widget settings', newSettings);

            // Merge new settings
            this.settings = { ...this.settings, ...newSettings };

            // Re-extract script attributes if needed
            this.extractScriptAttributes();

            if (this.isInitialized) {
                await this.init();
            }
        }

        /**
         * Setup automatic refresh every 24 hours
         * @private
         */
        setupAutoRefresh() {
            // Clear any existing interval
            if (this.refreshInterval) {
                clearInterval(this.refreshInterval);
            }

            // Set up 24-hour refresh interval (24 * 60 * 60 * 1000 ms)
            this.refreshInterval = setInterval(() => {
                this.refreshWidget();
            }, 24 * 60 * 60 * 1000);

            this.log('info', 'Auto-refresh setup: widget will refresh every 24 hours');
        }

        /**
         * Refresh the widget with fresh data
         * @public
         * @returns {Promise<void>}
         */
        async refreshWidget() {
            if (!this.isInitialized || !this.iframe) {
                this.log('warn', 'Cannot refresh widget: not initialized');
                return;
            }

            this.log('info', 'Refreshing widget with fresh data...');

            try {
                // Build new URL with fresh timestamp
                const freshUrl = this.buildWidgetUrl(true);

                // Update iframe source to force refresh
                this.iframe.src = freshUrl;
                this.lastRefreshTime = Date.now();

                this.dispatchEvent('floradex:refreshed', {
                    projectId: this.settings.projectId,
                    refreshTime: this.lastRefreshTime
                });

                this.log('info', 'Widget refreshed successfully');

            } catch (error) {
                this.log('error', 'Failed to refresh widget:', error);
                this.dispatchEvent('floradex:refreshError', {
                    error: error.message,
                    projectId: this.settings.projectId
                });
            }
        }

        /**
         * Get time until next refresh
         * @public
         * @returns {number} Milliseconds until next refresh
         */
        getTimeUntilNextRefresh() {
            const nextRefreshTime = this.lastRefreshTime + (24 * 60 * 60 * 1000);
            return Math.max(0, nextRefreshTime - Date.now());
        }

        /**
         * Destroy the widget and clean up resources
         * @public
         */
        destroy() {
            this.log('info', 'Destroying widget');

            // Clear refresh interval
            if (this.refreshInterval) {
                clearInterval(this.refreshInterval);
                this.refreshInterval = null;
            }

            // Clear timeouts
            this.clearLoadingTimeout();

            // Clean up container
            if (this.container) {
                this.container.classList.remove('floradex-widget--hide-mount-scrollbar');
                this.container.innerHTML = '';
            }

            // Reset state
            this.isInitialized = false;
            this.iframe = null;
            this.retryCount = 0;

            this.dispatchEvent('floradex:destroyed', {
                projectId: this.settings.projectId
            });
        }

        /**
         * Get current widget state
         * @public
         * @returns {Object} Current widget state
         */
        getState() {
            return {
                isInitialized: this.isInitialized,
                projectId: this.settings.projectId,
                theme: this.settings.theme,
                container: this.container,
                iframe: this.iframe,
                retryCount: this.retryCount
            };
        }

        /**
         * Check if widget is ready
         * @public
         * @returns {boolean} True if widget is ready
         */
        isReady() {
            return this.isInitialized && this.iframe && this.iframe.contentDocument;
        }

        /**
         * Dispatch custom events
         */
        dispatchEvent(eventName, detail = {}) {
            const event = new CustomEvent(eventName, {
                detail: detail,
                bubbles: true,
                cancelable: true
            });
            document.dispatchEvent(event);
        }
    }

    /**
     * Auto-initialization function
     */
    function autoInitialize() {
        console.log('Floradex: Auto-initializing...', {
            readyState: document.readyState,
            bodyExists: !!document.body,
            headExists: !!document.head
        });

        // Look for container elements with data-floradex attribute
        const containers = document.querySelectorAll('[data-floradex]');
        console.log('Floradex: Found containers with data-floradex:', containers.length, containers);

        // Look for default container
        const defaultContainer = document.getElementById('floradex-widget-container');
        console.log('Floradex: Found default container:', !!defaultContainer, defaultContainer);

        // Look for script tags with data attributes (any script src URL)
        const scripts = document.querySelectorAll('script[src]');
        const scriptWithData = Array.from(scripts).find(s => {
            return s.hasAttribute('data-project') || s.hasAttribute('data-theme');
        });
        console.log('Floradex: Found script with data attributes:', !!scriptWithData, scriptWithData);
        console.log('Floradex: All scripts found:', scripts.length, Array.from(scripts).map(s => s.src));

        containers.forEach(container => {
            const options = {};

            // Parse essential data attributes only
            if (container.dataset.project) options.projectId = container.dataset.project;
            if (container.dataset.theme) options.theme = container.dataset.theme;

            options.containerId = container.id || 'floradex-widget-' + Math.random().toString(36).substr(2, 9);
            if (!container.id) container.id = options.containerId;

            console.log('Floradex: Initializing widget for container:', options);
            // Initialize widget
            new FloradexWidget(options);
        });

        // If no containers found, look for the default container and check for script tag data attributes
        if (containers.length === 0) {
            const defaultContainer = document.getElementById('floradex-widget-container');
            if (defaultContainer) {
                // Check if there's a script tag with data attributes (any script src URL)
                const scripts = document.querySelectorAll('script[src]');
                const scriptWithData = Array.from(scripts).find(s => {
                    return s.hasAttribute('data-project') || s.hasAttribute('data-theme');
                });

                if (scriptWithData) {
                    console.log('Floradex: Auto-initializing with script tag data attributes');
                    // Initialize with default container - the widget will read data attributes from script tag
                    new FloradexWidget({ containerId: 'floradex-widget-container' });
                } else {
                    console.log('Floradex: No script tag with data attributes found, checking for global config');
                    // Check for global configuration
                    const globalConfig = window.FloradexConfig || {};
                    if (globalConfig.projectId) {
                        console.log('Floradex: Using global config:', globalConfig);
                        new FloradexWidget({
                            containerId: 'floradex-widget-container',
                            projectId: globalConfig.projectId,
                            theme: globalConfig.theme || 'light'
                        });
                    } else {
                        console.log('Floradex: No configuration found, initializing with defaults');
                        new FloradexWidget({ containerId: 'floradex-widget-container' });
                    }
                }
            } else {
                console.log('Floradex: No containers found, waiting for DOM...');
                // Wait a bit more for DOM to be ready
                setTimeout(() => {
                    console.log('Floradex: Retrying after timeout...');
                    autoInitialize();
                }, 100);
            }
        }
    }

    /**
     * Auto-initialization when DOM is ready
     */
    function initializeWidgets() {
        console.log('Floradex: initializeWidgets called', {
            readyState: document.readyState,
            documentComplete: document.readyState === 'complete',
            documentInteractive: document.readyState === 'interactive',
            documentLoading: document.readyState === 'loading'
        });

        if (document.readyState === 'loading') {
            console.log('Floradex: DOM still loading, waiting for DOMContentLoaded');
            document.addEventListener('DOMContentLoaded', () => {
                console.log('Floradex: DOMContentLoaded event fired');
                autoInitialize();
            });
        } else if (document.readyState === 'interactive') {
            console.log('Floradex: DOM interactive, initializing immediately');
            autoInitialize();
        } else if (document.readyState === 'complete') {
            console.log('Floradex: DOM complete, initializing immediately');
            autoInitialize();
        } else {
            console.log('Floradex: Unknown readyState, initializing immediately');
            autoInitialize();
        }
    }

    // Initialize widgets with multiple fallbacks
    if (document.readyState === 'loading') {
        // DOM is still loading
        document.addEventListener('DOMContentLoaded', initializeWidgets);
    } else {
        // DOM is already ready
        initializeWidgets();
    }

    // Additional fallback for slow-loading pages
    window.addEventListener('load', () => {
        console.log('Floradex: Window load event fired, checking for missed containers');
        const existingWidgets = document.querySelectorAll('[id^="floradex-widget"]');
        if (existingWidgets.length === 0) {
            console.log('Floradex: No widgets found, retrying initialization');
            autoInitialize();
        }
    });

    /**
     * Global API for manual widget management
     * @namespace Floradex
     */
    const Floradex = {
        /**
         * Create a new widget instance
         * @param {Object} options - Widget options
         * @returns {FloradexWidget} Widget instance
         */
        create: (options = {}) => new FloradexWidget(options),

        /**
         * Get all active widget instances
         * @returns {Array<FloradexWidget>} Active widgets
         */
        getInstances: () => {
            return Array.from(document.querySelectorAll('[id^="floradex-widget"]'))
                .map(container => container._floradexWidget)
                .filter(Boolean);
        },

        /**
         * Destroy all widgets
         */
        destroyAll: () => {
            Floradex.getInstances().forEach(widget => widget.destroy());
        },

        /**
         * Refresh all widgets with fresh data
         */
        refreshAll: () => {
            const widgets = Floradex.getInstances();
            widgets.forEach(widget => {
                if (typeof widget.refreshWidget === 'function') {
                    widget.refreshWidget();
                }
            });
            return widgets.length;
        },

        /**
         * Refresh a specific widget by project ID
         * @param {string} projectId - Project ID to refresh
         * @returns {boolean} True if widget was found and refreshed
         */
        refreshByProject: (projectId) => {
            const widgets = Floradex.getInstances();
            const targetWidget = widgets.find(widget =>
                widget.settings && widget.settings.projectId === projectId
            );

            if (targetWidget && typeof targetWidget.refreshWidget === 'function') {
                targetWidget.refreshWidget();
                return true;
            }

            return false;
        },

        /**
         * Manually initialize widgets (fallback for timing issues)
         */
        init: () => {
            console.log('Floradex: Manual initialization called');
            autoInitialize();
        },

        /**
         * Check if widgets are initialized
         * @returns {boolean} True if any widgets are found
         */
        isInitialized: () => {
            return Floradex.getInstances().length > 0;
        },

        /**
         * Configuration object
         */
        config: FLORADEX_CONFIG,

        /**
         * Version
         */
        version: '2.2.0'
    };

    // Expose to global scope
    global.Floradex = Floradex;
    global.FloradexWidget = FloradexWidget;
    global.FloradexConfig = FLORADEX_CONFIG;

    // Export for module systems
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = { Floradex, FloradexWidget, FLORADEX_CONFIG };
    }

    // AMD support
    if (typeof define === 'function' && define.amd) {
        define([], () => ({ Floradex, FloradexWidget, FLORADEX_CONFIG }));
    }

})(typeof window !== 'undefined' ? window : this);

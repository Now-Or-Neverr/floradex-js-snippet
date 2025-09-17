/**
 * Floradex Biodiversity Dashboard - Dynamic JavaScript Widget
 * Version: 2.1.0
 * 
 * A standalone widget that can be embedded on external sites with dynamic project parameters.
 * This version includes workarounds for the current Shiny app limitations.
 * 
 * Usage:
 * <script src="https://cdn.pollenize.org.uk/widget/floradex-dynamic.js" data-project="bodmin-airfield" data-theme="light"></script>
 * <div id="floradex-widget-container"></div>
 */

(function() {
    'use strict';
    
    // Configuration and constants
    const FLORADEX_CONFIG = {
        // Default deployment URL (can be overridden)
        baseUrl: 'https://chirag1234.shinyapps.io/Floradex-live-demo/',
        
        // Default settings
        defaults: {
            height: '800px',
            width: '100%',
            theme: 'light',
            showHeader: true,
            showFooter: true,
            responsive: true,
            projectId: null,
            postcode: null,
            distance: 5,
            tab: 'landing-page',
            startYear: null,
            endYear: null,
            containerId: 'floradex-widget-container'
        },
        
        // Supported themes
        themes: {
            light: {
                backgroundColor: '#ffffff',
                textColor: '#262626',
                borderColor: '#e5e5e5'
            },
            dark: {
                backgroundColor: '#1a1a1a',
                textColor: '#ffffff',
                borderColor: '#404040'
            }
        },
        
        // Project configurations - All projects are now available
        projects: {
            'bodmin-airfield': {
                name: 'Bodmin Airfield',
                description: 'Biodiversity monitoring at Bodmin Airfield',
                available: true,
                fallbackProject: null
            },
            'tamar-valley-centre': {
                name: 'Tamar Valley Centre',
                description: 'Biodiversity tracking in Tamar Valley',
                available: true,
                fallbackProject: null
            },
            'cornish-essential-oils': {
                name: 'Cornish Essential Oils',
                description: 'Plant diversity monitoring',
                available: true,
                fallbackProject: null
            },
            'lost-gardens-of-heligan': {
                name: 'Lost Gardens of Heligan',
                description: 'Garden biodiversity analysis',
                available: true,
                fallbackProject: null
            },
            'hemsworth-farm-master': {
                name: 'Hemsworth Farm Master',
                description: 'Agricultural biodiversity monitoring',
                available: true,
                fallbackProject: null
            },
            'devonport-park-nature-counts': {
                name: 'Devonport Park Nature Counts',
                description: 'Urban park biodiversity tracking',
                available: true,
                fallbackProject: null
            },
            'city-college-plymouth': {
                name: 'City College Plymouth',
                description: 'Educational institution biodiversity',
                available: true,
                fallbackProject: null
            },
            'mvv-plymouth': {
                name: 'MVV Plymouth',
                description: 'MVV Plymouth biodiversity project',
                available: true,
                fallbackProject: null
            }
        }
    };
    
    /**
     * Main Floradex Widget Class
     */
    class FloradexWidget {
        constructor(options = {}) {
            this.settings = { ...FLORADEX_CONFIG.defaults, ...options };
            this.container = null;
            this.iframe = null;
            this.isInitialized = false;
            this.currentProject = null;
            
            // Extract settings from script tag data attributes
            this.extractScriptAttributes();
            
            // Initialize when DOM is ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.init());
            } else {
                this.init();
            }
        }
        
        /**
         * Extract configuration from script tag data attributes
         */
        extractScriptAttributes() {
            const scripts = document.querySelectorAll('script[src*="floradex"]');
            const script = Array.from(scripts).find(s => s.src.includes('floradex'));
            
            if (script) {
                const attrs = script.dataset;
                
                // Map data attributes to settings
                if (attrs.project) this.settings.projectId = attrs.project;
                if (attrs.theme) this.settings.theme = attrs.theme;
                if (attrs.height) this.settings.height = attrs.height;
                if (attrs.width) this.settings.width = attrs.width;
                if (attrs.postcode) this.settings.postcode = attrs.postcode;
                if (attrs.distance) this.settings.distance = parseInt(attrs.distance);
                if (attrs.tab) this.settings.tab = attrs.tab;
                if (attrs.container) this.settings.containerId = attrs.container;
                if (attrs.header !== undefined) this.settings.showHeader = attrs.header === 'true';
                if (attrs.footer !== undefined) this.settings.showFooter = attrs.footer === 'true';
                if (attrs.startYear) this.settings.startYear = parseInt(attrs.startYear);
                if (attrs.endYear) this.settings.endYear = parseInt(attrs.endYear);
            }
        }
        
        /**
         * Initialize the widget
         */
        async init() {
            try {
                // Find container element
                this.container = document.getElementById(this.settings.containerId);
                
                if (!this.container) {
                    console.error('Floradex: Container element not found. Looking for:', this.settings.containerId);
                    return;
                }
                
                // Validate required settings
                if (!this.settings.projectId) {
                    console.error('Floradex: Project ID is required. Set data-project attribute on script tag.');
                    this.showError('Project ID is required');
                    return;
                }
                
                // Add header and footer if enabled
                this.addHeaderFooter();
                
                // Apply responsive styles
                this.applyStyles();
                
                // Handle project-specific data loading
                await this.handleProjectData();
                
                // Mark as initialized
                this.isInitialized = true;
                
                console.log('Floradex widget initialized successfully for project:', this.settings.projectId);
                
                // Dispatch custom event
                this.dispatchEvent('floradex:initialized', {
                    projectId: this.settings.projectId,
                    container: this.container
                });
                
            } catch (error) {
                console.error('Floradex: Initialization failed:', error);
                this.showError('Failed to initialize widget');
            }
        }
        
        /**
         * Handle project-specific data loading
         */
        async handleProjectData() {
            if (!this.settings.projectId) {
                this.showError('Project ID is required');
                return;
            }
            
            // Get project configuration
            const projectConfig = FLORADEX_CONFIG.projects[this.settings.projectId];
            
            if (!projectConfig) {
                this.showError(`Project "${this.settings.projectId}" is not recognized. Please check the project ID.`);
                return;
            }
            
            // Set current project
            this.currentProject = this.settings.projectId;
            
            // Build widget URL with parameters
            const widgetUrl = this.buildWidgetUrl();
            
            // Create and configure iframe
            this.createIframe(widgetUrl);
        }
        
        
        /**
         * Build the widget URL with all parameters
         */
        buildWidgetUrl() {
            const params = new URLSearchParams();
            
            // Add all relevant parameters
            if (this.settings.projectId) {
                params.append('project', this.settings.projectId);
            }
            
            if (this.settings.postcode) {
                params.append('postcode', this.settings.postcode);
            }
            
            if (this.settings.distance) {
                params.append('distance', this.settings.distance);
            }
            
            if (this.settings.tab) {
                params.append('tab', this.settings.tab);
            }
            
            if (this.settings.startYear) {
                params.append('start_year', this.settings.startYear);
            }
            
            if (this.settings.endYear) {
                params.append('end_year', this.settings.endYear);
            }
            
            // Add theme parameter
            params.append('theme', this.settings.theme);
            
            // Add widget mode parameter for embedding
            params.append('widget', 'true');
            
            const baseUrl = FLORADEX_CONFIG.baseUrl.endsWith('/') 
                ? FLORADEX_CONFIG.baseUrl 
                : FLORADEX_CONFIG.baseUrl + '/';
                
            return baseUrl + '?' + params.toString();
        }
        
        /**
         * Create and configure the iframe
         */
        createIframe(url) {
            // Clear container
            this.container.innerHTML = '';
            
            // Re-add header and footer
            this.addHeaderFooter();
            
            // Create iframe
            this.iframe = document.createElement('iframe');
            this.iframe.src = url;
            this.iframe.title = 'Floradex Biodiversity Dashboard';
            this.iframe.allowFullscreen = true;
            this.iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms allow-popups');
            
            // Apply styles
            const theme = FLORADEX_CONFIG.themes[this.settings.theme] || FLORADEX_CONFIG.themes.light;
            
            this.iframe.style.cssText = `
                width: ${this.settings.width};
                height: ${this.settings.height};
                border: none;
                border-radius: 12px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                background-color: ${theme.backgroundColor};
                display: block;
                margin: 0 auto;
            `;
            
            // Add loading state
            this.showLoading();
            
            // Handle iframe load
            this.iframe.onload = () => {
                this.hideLoading();
                this.dispatchEvent('floradex:loaded', {
                    projectId: this.settings.projectId
                });
            };
            
            this.iframe.onerror = () => {
                this.hideLoading();
                this.showError('Failed to load widget');
                this.dispatchEvent('floradex:error', {
                    projectId: this.settings.projectId,
                    error: 'iframe_load_failed'
                });
            };
            
            // Add to container
            this.container.appendChild(this.iframe);
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
            `;
            
            document.head.appendChild(style);
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
         * Show error message
         */
        showError(message) {
            this.container.innerHTML = `
                <div class="floradex-error">
                    <div>
                        <div style="margin-bottom: 10px;">⚠️</div>
                        <div>${message}</div>
                    </div>
                </div>
            `;
        }
        
        /**
         * Update widget with new parameters
         */
        update(newSettings = {}) {
            this.settings = { ...this.settings, ...newSettings };
            if (this.isInitialized) {
                this.init();
            }
        }
        
        /**
         * Destroy the widget
         */
        destroy() {
            if (this.container) {
                this.container.innerHTML = '';
            }
            this.isInitialized = false;
            this.dispatchEvent('floradex:destroyed', {
                projectId: this.settings.projectId
            });
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
        // Look for container elements with data-floradex attribute
        const containers = document.querySelectorAll('[data-floradex]');
        
        containers.forEach(container => {
            const options = {};
            
            // Parse data attributes
            if (container.dataset.project) options.projectId = container.dataset.project;
            if (container.dataset.theme) options.theme = container.dataset.theme;
            if (container.dataset.height) options.height = container.dataset.height;
            if (container.dataset.width) options.width = container.dataset.width;
            if (container.dataset.postcode) options.postcode = container.dataset.postcode;
            if (container.dataset.distance) options.distance = parseInt(container.dataset.distance);
            if (container.dataset.tab) options.tab = container.dataset.tab;
            if (container.dataset.header) options.showHeader = container.dataset.header === 'true';
            if (container.dataset.footer) options.showFooter = container.dataset.footer === 'true';
            if (container.dataset.startYear) options.startYear = parseInt(container.dataset.startYear);
            if (container.dataset.endYear) options.endYear = parseInt(container.dataset.endYear);
            
            options.containerId = container.id || 'floradex-widget-' + Math.random().toString(36).substr(2, 9);
            if (!container.id) container.id = options.containerId;
            
            // Initialize widget
            new FloradexWidget(options);
        });
        
        // If no containers found, look for the default container
        if (containers.length === 0) {
            const defaultContainer = document.getElementById('floradex-widget-container');
            if (defaultContainer) {
                new FloradexWidget({ containerId: 'floradex-widget-container' });
            }
        }
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', autoInitialize);
    } else {
        autoInitialize();
    }
    
    // Expose to global scope for manual initialization
    window.FloradexWidget = FloradexWidget;
    window.FloradexConfig = FLORADEX_CONFIG;
    
    // Export for module systems
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = FloradexWidget;
    }
    
})();

// Windows 11 风格设置系统
var Settings = Settings || {
    // 用户设置
    user: {
        name: "玩家",
        avatar: "👤",
        email: "player@horror-game.com"
    },
    
    // 系统设置
    system: {
        darkMode: true,
        notifications: true,
        sound: false,
        soundVolume: 50,
        animations: true,
        currentTheme: "dark"
    },
    
    // 个性化设置
    personalization: {
        theme: "dark",
        accentColor: "#ffaa66",
        transparency: true,
        backgroundImage: "default"
    },
    
    // 隐私与安全
    privacy: {
        firewallEnabled: false,
        privacyEnabled: false,
        antivirusEnabled: false,
        dnsEnabled: false
    },
    
    // 应用设置
    apps: {
        autoSave: true,
        autoUpdate: false,
        installedApps: [
            { id: "browser", name: "伪人浏览器", icon: "🌐", version: "1.0.0", installed: true },
            { id: "email", name: "邮件箱", icon: "📧", version: "1.0.0", installed: true },
            { id: "notepad", name: "记事本", icon: "📝", version: "1.0.0", installed: true },
            { id: "security", name: "Windows 安全中心", icon: "🛡️", version: "1.0.0", installed: true },
            { id: "settings", name: "设置", icon: "⚙️", version: "1.0.0", installed: true },
            { id: "news", name: "紧急新闻", icon: "📰", version: "1.0.0", installed: true },
            { id: "chat", name: "家人群聊", icon: "💬", version: "1.0.0", installed: true },
            { id: "achievements", name: "结局图鉴", icon: "🏆", version: "1.0.0", installed: true }
        ],
        availableApps: [
            { id: "store", name: "微软商店", icon: "🛒", version: "1.0.0", price: "免费", description: "发现和安装新应用" },
            { id: "media", name: "媒体播放器", icon: "🎵", version: "1.0.0", price: "免费", description: "播放音乐和视频" },
            { id: "calc", name: "计算器", icon: "🧮", version: "1.0.0", price: "免费", description: "简单计算工具" },
            { id: "calendar", name: "日历", icon: "📅", version: "1.0.0", price: "免费", description: "日程管理" }
        ]
    },
    
    // 当前选中的设置页面
    currentPage: "account",
    
    _settingsContent: null,
    _callbacks: {},
    _game: null,
    _soundInstance: null,
    
    init: function(settingsContent, game) {
        this._settingsContent = settingsContent;
        this._game = game;
        this.load();
        this.render();
        this.applyTheme();
        this.applyAccentColor();
        this.applyTransparency();
        this.initSoundSystem();
    },
    
    load: function() {
        var saved = Helpers.load('pseudoSettings', null);
        if (saved) {
            this.user = saved.user || this.user;
            this.system = saved.system || this.system;
            this.personalization = saved.personalization || this.personalization;
            this.privacy = saved.privacy || this.privacy;
            this.apps = saved.apps || this.apps;
        }
    },
    
    save: function() {
        Helpers.save('pseudoSettings', {
            user: this.user,
            system: this.system,
            personalization: this.personalization,
            privacy: this.privacy,
            apps: this.apps
        });
    },
    
    // ==================== 声音系统 ====================
    initSoundSystem: function() {
        if (!this.system.sound) return;
        
        document.addEventListener('click', function initAudio() {
            if (Settings.system.sound && !Settings._soundInstance) {
                Settings.initAudio();
            }
            document.removeEventListener('click', initAudio);
        });
    },
    
    initAudio: function() {
        try {
            this._soundInstance = new (window.AudioContext || window.webkitAudioContext)();
            this._soundInstance.resume();
            console.log("音频系统已初始化");
        } catch(e) {
            console.log("音频初始化失败:", e);
        }
    },
    
    playSound: function(type) {
        if (!this.system.sound || !this._soundInstance) return;
        
        try {
            var now = this._soundInstance.currentTime;
            var oscillator = this._soundInstance.createOscillator();
            var gain = this._soundInstance.createGain();
            
            oscillator.connect(gain);
            gain.connect(this._soundInstance.destination);
            
            var volume = this.system.soundVolume / 100;
            
            switch(type) {
                case 'click':
                    oscillator.frequency.value = 880;
                    gain.gain.value = 0.1 * volume;
                    oscillator.type = 'sine';
                    oscillator.start();
                    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);
                    oscillator.stop(now + 0.15);
                    break;
                case 'notification':
                    oscillator.frequency.value = 660;
                    gain.gain.value = 0.15 * volume;
                    oscillator.type = 'sine';
                    oscillator.start();
                    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
                    oscillator.stop(now + 0.25);
                    break;
                case 'error':
                    oscillator.frequency.value = 440;
                    gain.gain.value = 0.2 * volume;
                    oscillator.type = 'sawtooth';
                    oscillator.start();
                    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
                    oscillator.stop(now + 0.4);
                    break;
                case 'success':
                    oscillator.frequency.value = 1046.5;
                    gain.gain.value = 0.12 * volume;
                    oscillator.type = 'sine';
                    oscillator.start();
                    setTimeout(function() {
                        if (self._soundInstance) {
                            var osc2 = self._soundInstance.createOscillator();
                            var gain2 = self._soundInstance.createGain();
                            osc2.connect(gain2);
                            gain2.connect(self._soundInstance.destination);
                            osc2.frequency.value = 1318.5;
                            osc2.type = 'sine';
                            gain2.gain.value = 0.12 * volume;
                            osc2.start();
                            gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
                            osc2.stop(now + 0.25);
                        }
                    }, 120);
                    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
                    oscillator.stop(now + 0.25);
                    break;
            }
        } catch(e) {}
    },
    
    // ==================== 主题系统 ====================
    applyTheme: function() {
        var body = document.body;
        var desktop = document.querySelector('.desktop');
        
        var themes = {
            dark: {
                desktopBg: 'linear-gradient(135deg, #2d4a6e 0%, #1a3a4a 100%)',
                bodyBg: 'radial-gradient(circle at center, #1a2a3a 0%, #0a121c 100%)',
                text: '#eef4ff',
                cardBg: 'rgba(0,0,0,0.75)'
            },
            light: {
                desktopBg: 'linear-gradient(135deg, #e8f0f8 0%, #d0e0f0 100%)',
                bodyBg: 'radial-gradient(circle at center, #f0f4f8 0%, #e0e8f0 100%)',
                text: '#1a2a3a',
                cardBg: 'rgba(255,255,255,0.85)'
            },
            horror: {
                desktopBg: 'linear-gradient(135deg, #4a2a2a 0%, #3a1a1a 100%)',
                bodyBg: 'radial-gradient(circle at center, #3a1a1a 0%, #2a0a0a 100%)',
                text: '#ffaaaa',
                cardBg: 'rgba(0,0,0,0.85)'
            }
        };
        
        var theme = themes[this.system.currentTheme] || themes.dark;
        
        if (body) body.style.background = theme.bodyBg;
        if (desktop) desktop.style.background = theme.desktopBg;
        
        var textElements = document.querySelectorAll('.desktop-icon, .taskbar, .clock, .sanity-label, .quest-title, .task-icon, .start-text');
        for (var i = 0; i < textElements.length; i++) {
            textElements[i].style.color = theme.text;
        }
        
        this.personalization.theme = this.system.currentTheme;
    },
    
    applyAccentColor: function() {
        var style = document.createElement('style');
        style.id = 'accent-color-style';
        style.textContent = 
            '.desktop-icon:hover { border-color: ' + this.personalization.accentColor + ' !important; } ' +
            '.quest-container { border-left-color: ' + this.personalization.accentColor + ' !important; } ' +
            '.sanity-label { color: ' + this.personalization.accentColor + ' !important; } ' +
            '.toggle-switch.active { background: ' + this.personalization.accentColor + ' !important; } ' +
            '.nav-item.active { color: ' + this.personalization.accentColor + ' !important; } ' +
            '.card-header { color: ' + this.personalization.accentColor + ' !important; } ' +
            '.app-grid-item:hover { border-color: ' + this.personalization.accentColor + ' !important; } ' +
            '.recommended-item:hover .recommended-action { color: ' + this.personalization.accentColor + ' !important; }';
        var oldStyle = document.getElementById('accent-color-style');
        if (oldStyle) oldStyle.remove();
        document.head.appendChild(style);
    },
    
    applyTransparency: function() {
        var panels = document.querySelectorAll('.sanity-container, .quest-container, .network-container, .ending-progress-container, .settings-card, .taskbar, .start-menu');
        for (var i = 0; i < panels.length; i++) {
            if (this.personalization.transparency) {
                panels[i].style.backdropFilter = 'blur(20px)';
                panels[i].style.backgroundColor = 'rgba(0,0,0,0.6)';
            } else {
                panels[i].style.backdropFilter = 'none';
                panels[i].style.backgroundColor = 'rgba(0,0,0,0.9)';
            }
        }
    },
    
    applyAnimation: function() {
        var elements = document.querySelectorAll('.desktop-icon, .window, .notification, .game-btn, .task-icon, .start-btn, .nav-item');
        for (var i = 0; i < elements.length; i++) {
            if (this.system.animations) {
                elements[i].style.transition = 'all 0.2s ease';
            } else {
                elements[i].style.transition = 'none';
            }
        }
    },
    
    // ==================== 渲染 ====================
    render: function() {
        if (!this._settingsContent) return;
        
        var html = '<div class="win11-settings">' +
            '<div class="settings-sidebar">' +
            '<div class="sidebar-header">' +
            '<div class="sidebar-user">' +
            '<div class="user-avatar">' + this.user.avatar + '</div>' +
            '<div class="user-info">' +
            '<div class="user-name">' + this.user.name + '</div>' +
            '<div class="user-email">' + this.user.email + '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="sidebar-nav">' +
            '<div class="nav-item ' + (this.currentPage === 'account' ? 'active' : '') + '" data-page="account">' +
            '<span class="nav-icon">👤</span><span class="nav-label">账号</span></div>' +
            '<div class="nav-item ' + (this.currentPage === 'system' ? 'active' : '') + '" data-page="system">' +
            '<span class="nav-icon">⚙️</span><span class="nav-label">系统</span></div>' +
            '<div class="nav-item ' + (this.currentPage === 'personalization' ? 'active' : '') + '" data-page="personalization">' +
            '<span class="nav-icon">🎨</span><span class="nav-label">个性化</span></div>' +
            '<div class="nav-item ' + (this.currentPage === 'privacy' ? 'active' : '') + '" data-page="privacy">' +
            '<span class="nav-icon">🔒</span><span class="nav-label">隐私与安全</span></div>' +
            '<div class="nav-item ' + (this.currentPage === 'apps' ? 'active' : '') + '" data-page="apps">' +
            '<span class="nav-icon">📱</span><span class="nav-label">应用</span></div>' +
            '<div class="nav-item" data-page="about">' +
            '<span class="nav-icon">ℹ️</span><span class="nav-label">关于</span></div>' +
            '</div>' +
            '</div>' +
            '<div class="settings-content" id="settingsContent">' +
            this.renderPage(this.currentPage) +
            '</div>' +
            '</div>';
        
        this._settingsContent.innerHTML = html;
        
        var self = this;
        var navItems = document.querySelectorAll('.nav-item');
        for (var i = 0; i < navItems.length; i++) {
            (function(el) {
                el.onclick = function(e) {
                    e.stopPropagation();
                    var page = el.getAttribute('data-page');
                    if (page) {
                        if (self.system.sound) self.playSound('click');
                        self.currentPage = page;
                        self.render();
                    }
                };
            })(navItems[i]);
        }
        
        this.bindEvents();
    },
    
    renderPage: function(page) {
        switch(page) {
            case 'account': return this.renderAccountPage();
            case 'system': return this.renderSystemPage();
            case 'personalization': return this.renderPersonalizationPage();
            case 'privacy': return this.renderPrivacyPage();
            case 'apps': return this.renderAppsPage();
            case 'about': return this.renderAboutPage();
            default: return this.renderAccountPage();
        }
    },
    
    renderAccountPage: function() {
        return '<div class="settings-page">' +
            '<h2 class="page-title">👤 账号信息</h2>' +
            '<div class="settings-card">' +
            '<div class="card-header">你的信息</div>' +
            '<div class="card-content">' +
            '<div class="setting-row"><label class="setting-label">头像</label>' +
            '<div class="avatar-selector" id="avatarSelector">' +
            '<div class="avatar-option ' + (this.user.avatar === '👤' ? 'selected' : '') + '" data-avatar="👤">👤</div>' +
            '<div class="avatar-option ' + (this.user.avatar === '👻' ? 'selected' : '') + '" data-avatar="👻">👻</div>' +
            '<div class="avatar-option ' + (this.user.avatar === '👾' ? 'selected' : '') + '" data-avatar="👾">👾</div>' +
            '<div class="avatar-option ' + (this.user.avatar === '🤖' ? 'selected' : '') + '" data-avatar="🤖">🤖</div>' +
            '<div class="avatar-option ' + (this.user.avatar === '🎭' ? 'selected' : '') + '" data-avatar="🎭">🎭</div>' +
            '</div></div>' +
            '<div class="setting-row"><label class="setting-label">用户名</label>' +
            '<input type="text" id="userNameInput" class="setting-input" value="' + this.user.name + '"></div>' +
            '<div class="setting-row"><label class="setting-label">电子邮箱</label>' +
            '<input type="email" id="userEmailInput" class="setting-input" value="' + this.user.email + '"></div>' +
            '<div class="setting-row"><button id="saveAccountBtn" class="setting-btn">保存更改</button></div>' +
            '</div></div>' +
            '<div class="settings-card"><div class="card-header">账户安全</div>' +
            '<div class="card-content">' +
            '<div class="setting-row"><span class="setting-label">上次登录</span><span class="setting-value">刚刚</span></div>' +
            '<div class="setting-row"><span class="setting-label">登录设备</span><span class="setting-value">Windows 伪人版</span></div>' +
            '<div class="setting-row"><span class="setting-label">账户状态</span><span class="setting-value" style="color:#4caf50;">✓ 安全</span></div>' +
            '</div></div></div>';
    },
    
    renderSystemPage: function() {
        return '<div class="settings-page">' +
            '<h2 class="page-title">⚙️ 系统设置</h2>' +
            '<div class="settings-card"><div class="card-header">显示</div>' +
            '<div class="card-content">' +
            '<div class="setting-row"><label class="setting-label">深色模式</label>' +
            '<div class="toggle-switch ' + (this.system.darkMode ? 'active' : '') + '" id="darkModeToggle"></div></div>' +
            '<div class="setting-row"><label class="setting-label">动画效果</label>' +
            '<div class="toggle-switch ' + (this.system.animations ? 'active' : '') + '" id="animationsToggle"></div></div>' +
            '</div></div>' +
            '<div class="settings-card"><div class="card-header">声音</div>' +
            '<div class="card-content">' +
            '<div class="setting-row"><label class="setting-label">🔊 背景音乐/音效</label>' +
            '<div class="toggle-switch ' + (this.system.sound ? 'active' : '') + '" id="soundToggle"></div></div>' +
            '<div class="setting-row"><label class="setting-label">音量</label>' +
            '<input type="range" id="volumeSlider" min="0" max="100" value="' + this.system.soundVolume + '" style="width: 200px; accent-color: ' + this.personalization.accentColor + ';"></div>' +
            '<div class="setting-row"><button id="testSoundBtn" class="setting-btn">测试音效</button></div>' +
            '</div></div>' +
            '<div class="settings-card"><div class="card-header">通知</div>' +
            '<div class="card-content">' +
            '<div class="setting-row"><label class="setting-label">系统通知</label>' +
            '<div class="toggle-switch ' + (this.system.notifications ? 'active' : '') + '" id="notificationsToggle"></div></div>' +
            '</div></div>' +
            '<div class="settings-card"><div class="card-header">恢复</div>' +
            '<div class="card-content">' +
            '<div class="setting-row"><button id="factoryResetBtn" class="setting-btn danger">🗑️ 恢复出厂设置</button></div>' +
            '<p class="setting-hint">⚠️ 此操作将清除所有游戏进度和已解锁结局，不可恢复！</p>' +
            '</div></div></div>';
    },
    
    renderPersonalizationPage: function() {
        return '<div class="settings-page">' +
            '<h2 class="page-title">🎨 个性化</h2>' +
            '<div class="settings-card"><div class="card-header">主题</div>' +
            '<div class="card-content">' +
            '<div class="theme-selector" id="themeSelector">' +
            '<div class="theme-option ' + (this.system.currentTheme === 'dark' ? 'selected' : '') + '" data-theme="dark">' +
            '<div class="theme-preview dark-preview"></div><span>深色</span></div>' +
            '<div class="theme-option ' + (this.system.currentTheme === 'light' ? 'selected' : '') + '" data-theme="light">' +
            '<div class="theme-preview light-preview"></div><span>浅色</span></div>' +
            '<div class="theme-option ' + (this.system.currentTheme === 'horror' ? 'selected' : '') + '" data-theme="horror">' +
            '<div class="theme-preview horror-preview"></div><span>恐怖红</span></div>' +
            '</div></div></div>' +
            '<div class="settings-card"><div class="card-header">强调色</div>' +
            '<div class="card-content">' +
            '<div class="color-selector" id="colorSelector">' +
            '<div class="color-option ' + (this.personalization.accentColor === '#ffaa66' ? 'selected' : '') + '" data-color="#ffaa66" style="background:#ffaa66;"></div>' +
            '<div class="color-option ' + (this.personalization.accentColor === '#66aaff' ? 'selected' : '') + '" data-color="#66aaff" style="background:#66aaff;"></div>' +
            '<div class="color-option ' + (this.personalization.accentColor === '#ff66aa' ? 'selected' : '') + '" data-color="#ff66aa" style="background:#ff66aa;"></div>' +
            '<div class="color-option ' + (this.personalization.accentColor === '#66ffaa' ? 'selected' : '') + '" data-color="#66ffaa" style="background:#66ffaa;"></div>' +
            '<div class="color-option ' + (this.personalization.accentColor === '#aa66ff' ? 'selected' : '') + '" data-color="#aa66ff" style="background:#aa66ff;"></div>' +
            '</div></div></div>' +
            '<div class="settings-card"><div class="card-header">透明效果</div>' +
            '<div class="card-content">' +
            '<div class="setting-row"><label class="setting-label">启用透明效果</label>' +
            '<div class="toggle-switch ' + (this.personalization.transparency ? 'active' : '') + '" id="transparencyToggle"></div></div>' +
            '</div></div></div>';
    },
    
    renderPrivacyPage: function() {
        return '<div class="settings-page">' +
            '<h2 class="page-title">🔒 隐私与安全</h2>' +
            '<div class="settings-card"><div class="card-header">安全防护</div>' +
            '<div class="card-content">' +
            '<div class="setting-row"><label class="setting-label">🛡️ Windows 防火墙</label>' +
            '<div class="toggle-switch ' + (this.privacy.firewallEnabled ? 'active' : '') + '" id="firewallToggle"></div>' +
            '<span class="setting-hint-small">阻止伪人网络入侵</span></div>' +
            '<div class="setting-row"><label class="setting-label">👁️ 隐私保护模式</label>' +
            '<div class="toggle-switch ' + (this.privacy.privacyEnabled ? 'active' : '') + '" id="privacyToggle"></div>' +
            '<span class="setting-hint-small">防止摄像头和位置追踪</span></div>' +
            '<div class="setting-row"><label class="setting-label">🦠 实时病毒防护</label>' +
            '<div class="toggle-switch ' + (this.privacy.antivirusEnabled ? 'active' : '') + '" id="antivirusToggle"></div>' +
            '<span class="setting-hint-small">检测和清除伪人威胁</span></div>' +
            '<div class="setting-row"><label class="setting-label">🔐 DNS 加密 (防追踪)</label>' +
            '<div class="toggle-switch ' + (this.privacy.dnsEnabled ? 'active' : '') + '" id="dnsToggle"></div>' +
            '<span class="setting-hint-small">加密网络请求，隐藏位置</span></div>' +
            '</div></div>' +
            '<div class="settings-card"><div class="card-header">活动历史</div>' +
            '<div class="card-content">' +
            '<div class="setting-row"><span class="setting-label">已解锁结局</span>' +
            '<span class="setting-value">' + (this._game ? this._game._state.getUnlockedCount() : 0) + ' / 16</span></div>' +
            '<div class="setting-row"><span class="setting-label">理智值最低记录</span>' +
            '<span class="setting-value">' + (this._game ? this._game._state.sanity : 100) + '%</span></div>' +
            '<div class="setting-row"><span class="setting-label">搜索次数</span>' +
            '<span class="setting-value">' + (this._game ? this._game._searchCount : 0) + ' 次</span></div>' +
            '</div></div></div>';
    },
    
    renderAppsPage: function() {
        var html = '<div class="settings-page">' +
            '<h2 class="page-title">📱 应用设置</h2>' +
            '<div class="settings-card"><div class="card-header">游戏设置</div>' +
            '<div class="card-content">' +
            '<div class="setting-row"><label class="setting-label">自动保存</label>' +
            '<div class="toggle-switch ' + (this.apps.autoSave ? 'active' : '') + '" id="autoSaveToggle"></div></div>' +
            '<div class="setting-row"><label class="setting-label">自动更新</label>' +
            '<div class="toggle-switch ' + (this.apps.autoUpdate ? 'active' : '') + '" id="autoUpdateToggle"></div></div>' +
            '</div></div>' +
            '<div class="settings-card"><div class="card-header">已安装应用 <span style="font-size:11px;">(' + this.apps.installedApps.length + ')</span></div>' +
            '<div class="card-content"><div class="app-list">';
        
        for (var i = 0; i < this.apps.installedApps.length; i++) {
            var app = this.apps.installedApps[i];
            html += '<div class="app-item" data-app-id="' + app.id + '">' +
                '<span class="app-icon">' + app.icon + '</span>' +
                '<div class="app-info">' +
                '<span class="app-name">' + app.name + '</span>' +
                '<span class="app-version">v' + app.version + '</span>' +
                '</div>' +
                '<button class="app-uninstall" data-app="' + app.id + '">卸载</button>' +
                '</div>';
        }
        
        html += '</div></div></div>' +
            '<div class="settings-card"><div class="card-header">微软商店</div>' +
            '<div class="card-content">' +
            '<div class="store-banner" id="openStoreBtn">' +
            '<span class="store-icon">🛒</span>' +
            '<div class="store-info">' +
            '<span class="store-text">微软商店</span>' +
            '<span class="store-desc">发现新应用，丰富你的桌面</span>' +
            '</div>' +
            '<span class="store-arrow">▼</span>' +
            '</div>' +
            '<div class="available-apps" id="availableApps" style="display:none;">' +
            '<h4>📦 可下载的应用</h4>';
        
        for (var j = 0; j < this.apps.availableApps.length; j++) {
            var availApp = this.apps.availableApps[j];
            html += '<div class="store-app-item">' +
                '<span class="app-icon">' + availApp.icon + '</span>' +
                '<div class="store-app-info">' +
                '<span class="app-name">' + availApp.name + '</span>' +
                '<span class="app-desc">' + availApp.description + '</span>' +
                '</div>' +
                '<span class="app-price">' + availApp.price + '</span>' +
                '<button class="install-app-btn" data-app="' + availApp.id + '">安装</button>' +
                '</div>';
        }
        
        html += '</div></div></div></div>';
        
        return html;
    },
    
    renderAboutPage: function() {
        return '<div class="settings-page">' +
            '<h2 class="page-title">ℹ️ 关于</h2>' +
            '<div class="settings-card"><div class="card-header">伪人入侵</div>' +
            '<div class="card-content about-content">' +
            '<div class="about-logo">👁️‍🗨️</div>' +
            '<div class="about-name">伪人入侵</div>' +
            '<div class="about-version">版本 1.0.0</div>' +
            '<div class="about-desc">一款心理恐怖风格的虚拟桌面游戏。你需要在一个被"伪人"入侵的电脑系统中生存下来。</div>' +
            '<div class="about-stats">' +
            '<div class="stat-item">🎮 16个结局</div>' +
            '<div class="stat-item">👻 多种恐怖元素</div>' +
            '<div class="stat-item">🧠 理智值系统</div>' +
            '</div>' +
            '<div class="about-features">' +
            '<div class="feature-item">✨ Windows 11 风格界面</div>' +
            '<div class="feature-item">🎨 可自定义主题和强调色</div>' +
            '<div class="feature-item">🔊 音效系统</div>' +
            '<div class="feature-item">📱 应用商店（开发中）</div>' +
            '</div>' +
            '<div class="about-copyright">© 2024 伪人入侵制作组<br>灵感来源于 CreepyPasta</div>' +
            '</div></div></div>';
    },
    
    bindEvents: function() {
        var self = this;
        
        // 头像选择
        var avatarOptions = document.querySelectorAll('.avatar-option');
        for (var i = 0; i < avatarOptions.length; i++) {
            (function(el) {
                el.onclick = function(e) {
                    e.stopPropagation();
                    var avatar = el.getAttribute('data-avatar');
                    if (avatar) {
                        self.user.avatar = avatar;
                        self.render();
                        if (self.system.sound) self.playSound('click');
                        if (self._game) self._game.updateStartMenuUserInfo();
                    }
                };
            })(avatarOptions[i]);
        }
        
        // 保存账号
        var saveAccountBtn = document.getElementById('saveAccountBtn');
        if (saveAccountBtn) {
            saveAccountBtn.onclick = function(e) {
                e.stopPropagation();
                var nameInput = document.getElementById('userNameInput');
                var emailInput = document.getElementById('userEmailInput');
                if (nameInput) self.user.name = nameInput.value;
                if (emailInput) self.user.email = emailInput.value;
                self.save();
                if (self.system.sound) self.playSound('success');
                Notifications.success("账号信息已保存", 2000);
                if (self._game) self._game.updateStartMenuUserInfo();
                self.render();
            };
        }
        
        // 深色模式
        var darkModeToggle = document.getElementById('darkModeToggle');
        if (darkModeToggle) {
            darkModeToggle.onclick = function(e) {
                e.stopPropagation();
                self.system.darkMode = !self.system.darkMode;
                darkModeToggle.classList.toggle('active');
                self.system.currentTheme = self.system.darkMode ? 'dark' : 'light';
                self.save();
                self.applyTheme();
                if (self.system.sound) self.playSound('click');
                Notifications.info(self.system.darkMode ? "深色模式已启用" : "浅色模式已启用", 2000);
            };
        }
        
        // 动画效果
        var animationsToggle = document.getElementById('animationsToggle');
        if (animationsToggle) {
            animationsToggle.onclick = function(e) {
                e.stopPropagation();
                self.system.animations = !self.system.animations;
                animationsToggle.classList.toggle('active');
                self.save();
                self.applyAnimation();
                if (self.system.sound) self.playSound('click');
            };
        }
        
        // 声音开关
        var soundToggle = document.getElementById('soundToggle');
        if (soundToggle) {
            soundToggle.onclick = function(e) {
                e.stopPropagation();
                self.system.sound = !self.system.sound;
                soundToggle.classList.toggle('active');
                self.save();
                if (self.system.sound) {
                    self.initAudio();
                    self.playSound('success');
                    Notifications.success("声音已开启", 2000);
                } else {
                    Notifications.info("声音已关闭", 2000);
                }
            };
        }
        
        // 音量滑块
        var volumeSlider = document.getElementById('volumeSlider');
        if (volumeSlider) {
            volumeSlider.onchange = function(e) {
                e.stopPropagation();
                self.system.soundVolume = parseInt(volumeSlider.value);
                self.save();
                if (self.system.sound) self.playSound('click');
            };
        }
        
        // 测试音效
        var testSoundBtn = document.getElementById('testSoundBtn');
        if (testSoundBtn) {
            testSoundBtn.onclick = function(e) {
                e.stopPropagation();
                if (self.system.sound) {
                    self.playSound('success');
                    Notifications.success("音效测试成功", 1500);
                } else {
                    Notifications.warning("请先开启声音", 1500);
                }
            };
        }
        
        // 通知
        var notificationsToggle = document.getElementById('notificationsToggle');
        if (notificationsToggle) {
            notificationsToggle.onclick = function(e) {
                e.stopPropagation();
                self.system.notifications = !self.system.notifications;
                notificationsToggle.classList.toggle('active');
                self.save();
                if (self.system.sound) self.playSound('click');
            };
        }
        
        // 恢复出厂设置
        var factoryResetBtn = document.getElementById('factoryResetBtn');
        if (factoryResetBtn) {
            factoryResetBtn.onclick = function(e) {
                e.stopPropagation();
                var confirmReset = confirm("⚠️ 警告：恢复出厂设置将清除所有游戏进度和已解锁结局！\n\n确定要继续吗？");
                if (confirmReset) {
                    localStorage.removeItem('pseudoGame');
                    localStorage.removeItem('pseudoEndings');
                    localStorage.removeItem('pseudoSettings');
                    if (self.system.sound) self.playSound('error');
                    Notifications.error("🗑️ 数据已清除！页面将重新加载...", 2000);
                    setTimeout(function() { location.reload(); }, 1500);
                }
            };
        }
        
        // 主题选择
        var themeOptions = document.querySelectorAll('.theme-option');
        for (var i = 0; i < themeOptions.length; i++) {
            (function(el) {
                el.onclick = function(e) {
                    e.stopPropagation();
                    var theme = el.getAttribute('data-theme');
                    if (theme) {
                        self.system.currentTheme = theme;
                        self.system.darkMode = (theme === 'dark');
                        self.save();
                        self.applyTheme();
                        if (self.system.sound) self.playSound('click');
                        self.render();
                    }
                };
            })(themeOptions[i]);
        }
        
        // 颜色选择
        var colorOptions = document.querySelectorAll('.color-option');
        for (var i = 0; i < colorOptions.length; i++) {
            (function(el) {
                el.onclick = function(e) {
                    e.stopPropagation();
                    var color = el.getAttribute('data-color');
                    if (color) {
                        self.personalization.accentColor = color;
                        self.save();
                        self.applyAccentColor();
                        if (self.system.sound) self.playSound('click');
                        self.render();
                    }
                };
            })(colorOptions[i]);
        }
        
        // 透明效果
        var transparencyToggle = document.getElementById('transparencyToggle');
        if (transparencyToggle) {
            transparencyToggle.onclick = function(e) {
                e.stopPropagation();
                self.personalization.transparency = !self.personalization.transparency;
                transparencyToggle.classList.toggle('active');
                self.save();
                self.applyTransparency();
                if (self.system.sound) self.playSound('click');
            };
        }
        
        // 防火墙
        var firewallToggle = document.getElementById('firewallToggle');
        if (firewallToggle) {
            firewallToggle.onclick = function(e) {
                e.stopPropagation();
                self.privacy.firewallEnabled = !self.privacy.firewallEnabled;
                firewallToggle.classList.toggle('active');
                self.save();
                if (self.system.sound) self.playSound('click');
                Notifications.info(self.privacy.firewallEnabled ? "🛡️ 防火墙已开启" : "⚠️ 防火墙已关闭", 2000);
                if (self._game && self._game.addToggleCount) self._game.addToggleCount();
            };
        }
        
        // 隐私保护
        var privacyToggle = document.getElementById('privacyToggle');
        if (privacyToggle) {
            privacyToggle.onclick = function(e) {
                e.stopPropagation();
                self.privacy.privacyEnabled = !self.privacy.privacyEnabled;
                privacyToggle.classList.toggle('active');
                self.save();
                if (self.system.sound) self.playSound('click');
                Notifications.info(self.privacy.privacyEnabled ? "👁️ 隐私保护已开启" : "⚠️ 隐私保护已关闭", 2000);
                if (self._game && self._game.addToggleCount) self._game.addToggleCount();
            };
        }
        
        // 病毒防护
        var antivirusToggle = document.getElementById('antivirusToggle');
        if (antivirusToggle) {
            antivirusToggle.onclick = function(e) {
                e.stopPropagation();
                self.privacy.antivirusEnabled = !self.privacy.antivirusEnabled;
                antivirusToggle.classList.toggle('active');
                self.save();
                if (self.system.sound) self.playSound('click');
                Notifications.info(self.privacy.antivirusEnabled ? "🦠 病毒防护已开启" : "⚠️ 病毒防护已关闭", 2000);
                if (self._game && self._game.addToggleCount) self._game.addToggleCount();
            };
        }
        
        // DNS加密
        var dnsToggle = document.getElementById('dnsToggle');
        if (dnsToggle) {
            dnsToggle.onclick = function(e) {
                e.stopPropagation();
                self.privacy.dnsEnabled = !self.privacy.dnsEnabled;
                dnsToggle.classList.toggle('active');
                self.save();
                if (self.system.sound) self.playSound('click');
                Notifications.info(self.privacy.dnsEnabled ? "🔐 DNS加密已开启" : "⚠️ DNS加密已关闭", 2000);
                if (self._game && self._game.addToggleCount) self._game.addToggleCount();
            };
        }
        
        // 自动保存
        var autoSaveToggle = document.getElementById('autoSaveToggle');
        if (autoSaveToggle) {
            autoSaveToggle.onclick = function(e) {
                e.stopPropagation();
                self.apps.autoSave = !self.apps.autoSave;
                autoSaveToggle.classList.toggle('active');
                self.save();
                if (self.system.sound) self.playSound('click');
            };
        }
        
        // 自动更新
        var autoUpdateToggle = document.getElementById('autoUpdateToggle');
        if (autoUpdateToggle) {
            autoUpdateToggle.onclick = function(e) {
                e.stopPropagation();
                self.apps.autoUpdate = !self.apps.autoUpdate;
                autoUpdateToggle.classList.toggle('active');
                self.save();
                if (self.system.sound) self.playSound('click');
            };
        }
        
        // 打开微软商店
        var openStoreBtn = document.getElementById('openStoreBtn');
        if (openStoreBtn) {
            openStoreBtn.onclick = function(e) {
                e.stopPropagation();
                var availableAppsDiv = document.getElementById('availableApps');
                if (availableAppsDiv) {
                    var isVisible = availableAppsDiv.style.display !== 'none';
                    availableAppsDiv.style.display = isVisible ? 'none' : 'block';
                    var arrow = openStoreBtn.querySelector('.store-arrow');
                    if (arrow) arrow.textContent = isVisible ? '▼' : '▲';
                    if (self.system.sound) self.playSound('click');
                }
            };
        }
        
        // 卸载应用
        var uninstallBtns = document.querySelectorAll('.app-uninstall');
        for (var i = 0; i < uninstallBtns.length; i++) {
            (function(el) {
                el.onclick = function(e) {
                    e.stopPropagation();
                    var appId = el.getAttribute('data-app');
                    var confirmUninstall = confirm("确定要卸载这个应用吗？");
                    if (confirmUninstall) {
                        var index = -1;
                        for (var j = 0; j < self.apps.installedApps.length; j++) {
                            if (self.apps.installedApps[j].id === appId) {
                                index = j;
                                break;
                            }
                        }
                        if (index !== -1) {
                            var removed = self.apps.installedApps.splice(index, 1)[0];
                            self.apps.availableApps.unshift({
                                id: removed.id,
                                name: removed.name,
                                icon: removed.icon,
                                version: removed.version,
                                price: "免费",
                                description: removed.name + " 应用"
                            });
                            self.save();
                            if (self.system.sound) self.playSound('success');
                            Notifications.success(removed.name + " 已卸载", 2000);
                            self.render();
                        }
                    }
                };
            })(uninstallBtns[i]);
        }
        
        // 安装应用
        var installBtns = document.querySelectorAll('.install-app-btn');
        for (var i = 0; i < installBtns.length; i++) {
            (function(el) {
                el.onclick = function(e) {
                    e.stopPropagation();
                    var appId = el.getAttribute('data-app');
                    var index = -1;
                    for (var j = 0; j < self.apps.availableApps.length; j++) {
                        if (self.apps.availableApps[j].id === appId) {
                            index = j;
                            break;
                        }
                    }
                    if (index !== -1) {
                        var installed = self.apps.availableApps.splice(index, 1)[0];
                        self.apps.installedApps.push({
                            id: installed.id,
                            name: installed.name,
                            icon: installed.icon,
                            version: "1.0.0",
                            installed: true
                        });
                        self.save();
                        if (self.system.sound) self.playSound('success');
                        Notifications.success(installed.name + " 安装成功！", 2000);
                        self.render();
                    }
                };
            })(installBtns[i]);
        }
    }
};
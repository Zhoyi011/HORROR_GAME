// 安全中心模块
var Security = Security || {
    _content: null,
    _state: null,
    _settings: null,
    _game: null,
    
    init: function(content, state, settings, game) {
        this._content = content;
        this._state = state;
        this._settings = settings;
        this._game = game;
        this.render();
    },
    
    render: function() {
        if (!this._content) return;
        var self = this;
        
        this._content.innerHTML = '<div class="security-status">' +
            '<div class="security-status-icon">' + (this._settings.antivirusEnabled ? '🛡️' : '⚠️') + '</div>' +
            '<div class="security-status-text">' + (this._settings.antivirusEnabled ? '防护已启用' : '防护已禁用') + '</div>' +
            '</div>' +
            '<button class="security-scan-btn" id="scanBtn">🔍 快速扫描</button>' +
            '<div id="scanResult"></div>' +
            '<div class="setting-section" style="margin-top: 15px;">' +
            '<div class="setting-title">📋 威胁日志</div>' +
            '<div id="threatLog">暂无威胁记录</div>' +
            '</div>';
        
        var scanBtn = document.getElementById('scanBtn');
        if (scanBtn) {
            scanBtn.onclick = function(e) {
                e.stopPropagation();
                self.runScan();
            };
        }
    },
    
    runScan: function() {
        if (this._settings.scanInProgress) return;
        this._settings.scanInProgress = true;
        var self = this;
        var scanResult = document.getElementById('scanResult');
        if (scanResult) {
            scanResult.innerHTML = '<div class="loading-spinner" style="padding: 20px;"><div class="spinner"></div><p>正在扫描系统...</p></div>';
        }
        
        setTimeout(function() {
            var threats = [];
            if (!self._settings.firewallEnabled) threats.push("防火墙已关闭 - 高危");
            if (!self._settings.privacyEnabled) threats.push("隐私模式已禁用 - 中危");
            if (!self._settings.dnsEnabled) threats.push("DNS加密未启用 - 中危");
            if (self._state.step >= 1) threats.push("可疑招聘网站访问记录 - 中危");
            if (self._state.step >= 2) threats.push("伪人入侵痕迹检测 - 极高危");
            
            self._settings.detectedThreats = threats;
            
            if (scanResult) {
                if (threats.length === 0) {
                    scanResult.innerHTML = '<div style="background: #2a6a4a; padding: 12px; border-radius: 8px; margin-top: 10px; color: #eef4ff;">✅ 扫描完成，未发现威胁</div>';
                    Notifications.success("安全扫描完成，系统状态良好", 3000);
                } else {
                    var threatHtml = '<div style="background: #4a2a2a; padding: 12px; border-radius: 8px; margin-top: 10px;">' +
                        '<span style="color: #ff8888;">⚠️ 发现 ' + threats.length + ' 个威胁</span>' +
                        '<div style="margin-top: 10px;">';
                    for (var i = 0; i < threats.length; i++) {
                        threatHtml += '<div class="security-threat">⚠️ ' + threats[i] + '</div>';
                    }
                    threatHtml += '</div>';
                    if (self._settings.antivirusEnabled) {
                        threatHtml += '<button id="cleanBtn" class="security-scan-btn" style="margin-top: 10px;">🧹 清除威胁</button>';
                    } else {
                        threatHtml += '<p style="margin-top: 10px; color: #ff8888;">启用病毒防护以清除威胁</p>';
                    }
                    threatHtml += '</div>';
                    scanResult.innerHTML = threatHtml;
                    
                    // 结局11：双重人格 - 扫描到威胁也算一次防护相关操作
                    if (self._game && self._game.addToggleCount && threats.length > 0) {
                        self._game.addToggleCount();
                    }
                    
                    var cleanBtn = document.getElementById('cleanBtn');
                    if (cleanBtn) {
                        cleanBtn.onclick = function(e) {
                            e.stopPropagation();
                            if (self._settings.antivirusEnabled && threats.length > 0) {
                                scanResult.innerHTML = '<div style="background: #2a6a4a; padding: 12px; border-radius: 8px;">🧹 威胁已清除！系统安全。</div>';
                                Notifications.success("威胁已清除！系统安全", 3000);
                                if (self._state.step >= 2 && !self._state.gameEnded && self._settings.firewallEnabled && self._settings.dnsEnabled) {
                                    GameState.unlockEnding(6);
                                    if (window.Game && window.Game.showEnding) window.Game.showEnding(6);
                                }
                            }
                        };
                    }
                }
            }
            self._settings.scanInProgress = false;
        }, 2000);
    }
};
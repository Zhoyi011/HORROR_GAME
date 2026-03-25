// 设置系统
var Settings = Settings || {
    firewallEnabled: false,
    privacyEnabled: false,
    antivirusEnabled: false,
    dnsEnabled: false,
    scanInProgress: false,
    detectedThreats: [],
    
    _settingsContent: null,
    _callbacks: {},
    _game: null,
    
    init: function(settingsContent, game) {
        this._settingsContent = settingsContent;
        this._game = game;
        this.load();
        this.render();
    },
    
    load: function() {
        var saved = Helpers.load('pseudoSettings', null);
        if (saved) {
            this.firewallEnabled = saved.firewallEnabled || false;
            this.privacyEnabled = saved.privacyEnabled || false;
            this.antivirusEnabled = saved.antivirusEnabled || false;
            this.dnsEnabled = saved.dnsEnabled || false;
        }
    },
    
    save: function() {
        Helpers.save('pseudoSettings', {
            firewallEnabled: this.firewallEnabled,
            privacyEnabled: this.privacyEnabled,
            antivirusEnabled: this.antivirusEnabled,
            dnsEnabled: this.dnsEnabled
        });
    },
    
    render: function() {
        if (!this._settingsContent) return;
        var self = this;
        
        this._settingsContent.innerHTML = '<div class="setting-section">' +
            '<div class="setting-title">🔒 隐私与安全</div>' +
            '<div class="setting-item">' +
            '<span class="setting-label">🛡️ Windows 防火墙</span>' +
            '<div class="setting-toggle ' + (this.firewallEnabled ? 'active' : '') + '" id="firewallToggle"></div>' +
            '</div>' +
            '<div class="setting-item">' +
            '<span class="setting-label">👁️ 隐私保护模式</span>' +
            '<div class="setting-toggle ' + (this.privacyEnabled ? 'active' : '') + '" id="privacyToggle"></div>' +
            '</div>' +
            '<div class="setting-item">' +
            '<span class="setting-label">🦠 实时病毒防护</span>' +
            '<div class="setting-toggle ' + (this.antivirusEnabled ? 'active' : '') + '" id="antivirusToggle"></div>' +
            '</div>' +
            '<div class="setting-item">' +
            '<span class="setting-label">🔐 DNS 加密 (防追踪)</span>' +
            '<div class="setting-toggle ' + (this.dnsEnabled ? 'active' : '') + '" id="dnsToggle"></div>' +
            '</div>' +
            '</div>' +
            '<div class="setting-section" style="margin-top: 15px; border-left-color: #ff6666;">' +
            '<div class="setting-title">⚠️ 危险操作</div>' +
            '<div class="setting-item">' +
            '<span class="setting-label">🗑️ 恢复出厂设置 (重置所有数据，包括结局)</span>' +
            '<button id="factoryResetBtn" style="background: #c44; border: none; padding: 8px 16px; border-radius: 20px; color: white; cursor: pointer;">重置</button>' +
            '</div>' +
            '<p style="font-size: 10px; color: #ff8888; margin-top: 8px;">⚠️ 此操作将清除所有游戏进度和结局记录，不可恢复！</p>' +
            '</div>' +
            '<p style="font-size: 11px; color: #aaa; margin-top: 15px; text-align: center;">💡 提示：修改设置可能影响游戏结局</p>';
        
        var firewallToggle = document.getElementById('firewallToggle');
        var privacyToggle = document.getElementById('privacyToggle');
        var antivirusToggle = document.getElementById('antivirusToggle');
        var dnsToggle = document.getElementById('dnsToggle');
        var factoryResetBtn = document.getElementById('factoryResetBtn');
        
        if (firewallToggle) {
            firewallToggle.onclick = function(e) {
                e.stopPropagation();
                self.firewallEnabled = !self.firewallEnabled;
                firewallToggle.classList.toggle('active');
                self.save();
                Notifications.info(self.firewallEnabled ? "🛡️ 防火墙已开启，伪人入侵难度增加" : "⚠️ 防火墙已关闭，系统更易受到攻击", 3000);
                if (self._callbacks.onFirewallChange) self._callbacks.onFirewallChange(self.firewallEnabled);
                
                // 结局11：双重人格 - 开关防护计数
                if (self._game && self._game.addToggleCount) {
                    self._game.addToggleCount();
                }
            };
        }
        
        if (privacyToggle) {
            privacyToggle.onclick = function(e) {
                e.stopPropagation();
                self.privacyEnabled = !self.privacyEnabled;
                privacyToggle.classList.toggle('active');
                self.save();
                Notifications.info(self.privacyEnabled ? "👁️ 隐私保护已开启" : "⚠️ 隐私保护已关闭", 2000);
                
                // 结局11：双重人格 - 开关防护计数
                if (self._game && self._game.addToggleCount) {
                    self._game.addToggleCount();
                }
            };
        }
        
        if (antivirusToggle) {
            antivirusToggle.onclick = function(e) {
                e.stopPropagation();
                self.antivirusEnabled = !self.antivirusEnabled;
                antivirusToggle.classList.toggle('active');
                self.save();
                Notifications.info(self.antivirusEnabled ? "🦠 实时病毒防护已开启" : "⚠️ 病毒防护已关闭", 2000);
                
                // 结局11：双重人格 - 开关防护计数
                if (self._game && self._game.addToggleCount) {
                    self._game.addToggleCount();
                }
            };
        }
        
        if (dnsToggle) {
            dnsToggle.onclick = function(e) {
                e.stopPropagation();
                self.dnsEnabled = !self.dnsEnabled;
                dnsToggle.classList.toggle('active');
                self.save();
                Notifications.info(self.dnsEnabled ? "🔐 DNS加密已开启，伪人难以追踪你的位置" : "⚠️ DNS加密已关闭", 2000);
                if (self._callbacks.onDnsChange) self._callbacks.onDnsChange(self.dnsEnabled);
                
                // 结局11：双重人格 - 开关防护计数
                if (self._game && self._game.addToggleCount) {
                    self._game.addToggleCount();
                }
            };
        }
        
        // 恢复出厂设置按钮
        if (factoryResetBtn) {
            factoryResetBtn.onclick = function(e) {
                e.stopPropagation();
                
                var confirmReset = confirm("⚠️ 警告：恢复出厂设置将清除所有游戏进度和已解锁结局！\n\n确定要继续吗？");
                if (confirmReset) {
                    localStorage.removeItem('pseudoGame');
                    localStorage.removeItem('pseudoEndings');
                    localStorage.removeItem('pseudoSettings');
                    
                    Notifications.error("🗑️ 数据已清除！页面将重新加载...", 2000);
                    
                    setTimeout(function() {
                        location.reload();
                    }, 1500);
                }
            };
        }
    },
    
    on: function(event, callback) {
        this._callbacks[event] = callback;
    }
};
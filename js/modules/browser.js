// 浏览器模块
var Browser = Browser || {
    _content: null,
    _state: null,
    _onJobApply: null,
    _game: null,
    
    init: function(content, state, onJobApply, game) {
        this._content = content;
        this._state = state;
        this._onJobApply = onJobApply;
        this._game = game;
        if (this._content) {
            this.renderGoogleHomepage();
        }
    },
    
    renderGoogleHomepage: function() {
        if (!this._content) return;
        if (!this._state.isOnline) { 
            this.showOfflineMessage(); 
            return; 
        }
        
        var self = this;
        this._content.innerHTML = '<div class="search-container">' +
            '<div style="text-align: center; margin-bottom: 20px;">' +
            '<span style="font-size: 48px;">🔍</span>' +
            '<div style="font-size: 28px; margin-top: 5px;">' +
            '<span style="color: #4285f4;">伪</span>' +
            '<span style="color: #ea4335;">人</span>' +
            '<span style="color: #fbbc05;">搜</span>' +
            '<span style="color: #34a853;">索</span>' +
            '</div>' +
            '</div>' +
            '<div class="search-box">' +
            '<input type="text" class="search-input" id="searchInput" placeholder="输入关键词搜索..." value="高薪工作应聘网站">' +
            '<button class="search-btn" id="searchBtn">搜索</button>' +
            '</div>' +
            '<p style="margin-top: 15px; font-size: 12px; color: #aaa; text-align: center;">💡 试试搜索 "高薪工作应聘网站"、"如何摆脱伪人" 或 "世界是程序"</p>' +
            '</div>';
        
        var searchBtn = document.getElementById('searchBtn');
        var searchInput = document.getElementById('searchInput');
        
        var doSearch = function() {
            if (!self._state.isOnline) { self.showOfflineMessage(); return; }
            var query = searchInput ? searchInput.value : '';
            
            if (self._game) {
                self._game.addSearchCount();
            }
            
            if (query.indexOf('高薪工作') !== -1 || query.indexOf('应聘网站') !== -1 || query === '高薪工作应聘网站') {
                self.showSearchLoading();
            } else if (query.indexOf('如何摆脱伪人') !== -1 || query.indexOf('摆脱伪人') !== -1 || query.indexOf('驱逐伪人') !== -1) {
                self.showSecretPage();
            } else if (query.indexOf('世界是程序') !== -1 || query.indexOf('代码真相') !== -1) {
                self.showCodeTruthPage();
            } else {
                self.showNormalSearch(query);
            }
        };
        
        if (searchBtn) searchBtn.onclick = doSearch;
        if (searchInput) searchInput.onkeypress = function(e) { if (e.key === 'Enter') doSearch(); };
    },
    
    showNormalSearch: function(query) {
        var self = this;
        if (!query || query.trim() === '') {
            this._content.innerHTML = '<div style="padding: 20px;"><p>请输入搜索关键词</p><button class="game-btn" id="backToSearch">返回</button></div>';
            var backBtn = document.getElementById('backToSearch');
            if (backBtn) backBtn.onclick = function() { self.renderGoogleHomepage(); };
        } else {
            this._content.innerHTML = '<div class="loading-spinner"><div class="spinner"></div><p>搜索 "' + query + '"...</p></div>';
            setTimeout(function() {
                self._content.innerHTML = '<div style="padding: 20px;">' +
                    '<p>未找到与 "' + query + '" 相关的结果。</p>' +
                    '<p style="color: #aaa; margin-top: 10px;">💡 试试搜索 "高薪工作应聘网站"、"如何摆脱伪人" 或 "世界是程序"</p>' +
                    '<button class="game-btn" id="backToSearch">返回搜索</button>' +
                    '</div>';
                var backBtn = document.getElementById('backToSearch');
                if (backBtn) backBtn.onclick = function() { self.renderGoogleHomepage(); };
            }, 1500);
        }
    },
    
    showSecretPage: function() {
        var self = this;
        this._state.secretSearchUnlocked = true;
        
        // 结局15：收集古籍
        if (this._game && this._game.addAncientBook) {
            this._game.addAncientBook("驱逐伪人古籍");
        }
        
        this._content.innerHTML = '<div style="padding: 20px;">' +
            '<div style="background: #2a4a3a; border-radius: 12px; padding: 20px; border: 1px solid #ffaa66;">' +
            '<h3 style="color: #ffaa66;">📜 古籍：如何驱逐伪人</h3>' +
            '<div style="margin: 20px 0; line-height: 1.8; color: #eef4ff;">' +
            '<p>根据古老的记载，伪人是一种寄生在数字世界的异常存在。要驱逐它们，需要完成以下仪式：</p>' +
            '<ol style="margin: 15px 0 15px 20px;">' +
            '<li>📖 第一步：阅读并理解伪人的本质（已完成）</li>' +
            '<li>🛡️ 第二步：启用防火墙和DNS加密保护系统</li>' +
            '<li>🔍 第三步：在安全中心进行深度扫描</li>' +
            '<li>✨ 第四步：在心中默念驱逐咒语："我驱逐你，异界的入侵者！"</li>' +
            '</ol>' +
            '<p style="color: #ffaa66;">⚠️ 完成以上步骤后，伪人将被永久驱逐！</p>' +
            '</div>' +
            '<button class="apply-btn" id="performRitualBtn" style="background: #4a6a3a;">✨ 执行驱逐仪式 ✨</button>' +
            '<button class="game-btn" id="backToSearchBtn" style="margin-top: 10px;">返回搜索</button>' +
            '</div>' +
            '</div>';
        
        var ritualBtn = document.getElementById('performRitualBtn');
        var backBtn = document.getElementById('backToSearchBtn');
        
        if (ritualBtn) {
            ritualBtn.onclick = function() {
                if (Settings.firewallEnabled && Settings.antivirusEnabled && Settings.dnsEnabled) {
                    // 结局7：驱逐仪式
                    GameState.unlockEnding(7);
                    if (window.Game && window.Game.showEnding) window.Game.showEnding(7);
                } else {
                    Notifications.warning("⚠️ 仪式失败！需要先启用防火墙、病毒防护和DNS加密", 4000);
                    var msgDiv = document.createElement('div');
                    msgDiv.style.cssText = 'color:#ff8888; margin-top:10px; padding:10px; background:#3a1a1a; border-radius:8px;';
                    msgDiv.innerHTML = '❌ 驱逐失败：防护措施不完整。请在设置中启用所有安全选项后重试。';
                    self._content.appendChild(msgDiv);
                }
            };
        }
        
        if (backBtn) backBtn.onclick = function() { self.renderGoogleHomepage(); };
    },
    
    showCodeTruthPage: function() {
        var self = this;
        this._content.innerHTML = '<div style="padding: 20px;">' +
            '<div style="background: #2a4a6a; border-radius: 12px; padding: 20px; border: 1px solid #88aaff;">' +
            '<h3 style="color: #88aaff;">💻 代码真相</h3>' +
            '<div style="margin: 20px 0; line-height: 1.8; color: #eef4ff;">' +
            '<p>你发现了一串神秘的代码：</p>' +
            '<code style="display:block; background:#1a2a2a; padding:15px; border-radius:8px; margin:15px 0; font-family: monospace;">' +
            '// 世界是程序<br>' +
            '// 伪人是系统清理程序<br>' +
            '// 只有保持理智值100%才能看到真相<br>' +
            '// 删除自己，成为自由的数据...<br>' +
            '</code>' +
            '<p style="color: #ffaa66;">⚠️ 你似乎接触到了世界的本质...</p>' +
            '<p style="color: #88aaff;">💡 保持理智值100%才能真正理解这一切。</p>' +
            '</div>' +
            '<button class="game-btn" id="backToSearchBtn">返回搜索</button>' +
            '</div>' +
            '</div>';
        
        // 结局14：代码真相
        if (this._game && this._game.checkCodeTruth) {
            this._game.checkCodeTruth();
        }
        
        var backBtn = document.getElementById('backToSearchBtn');
        if (backBtn) backBtn.onclick = function() { self.renderGoogleHomepage(); };
    },
    
    showSearchLoading: function() {
        this._content.innerHTML = '<div class="loading-spinner"><div class="spinner"></div><p>正在搜索 "高薪工作应聘网站"...</p><p style="font-size:12px; color:#aaa;">正在连接暗网招聘服务器...</p></div>';
        var self = this;
        setTimeout(function() { self.showSearchResults(); }, 1800);
    },
    
    showSearchResults: function() {
        var self = this;
        this._content.innerHTML = '<div style="padding: 10px;">' +
            '<div style="color: #88aaff; margin-bottom: 15px; font-size: 12px;">找到约 1 条结果 (用时 0.43 秒)</div>' +
            '<div class="job-item" id="searchResultItem">' +
            '<div style="color: #ffaa66; font-size: 18px; font-weight: bold;">⚠️ 异常高薪工作招聘网 - 伪人专属通道</div>' +
            '<div style="color: #88ffaa; font-size: 12px;">https://pseudo-jobs.darkweb/urgent-hire</div>' +
            '<div style="color: #aaa; margin-top: 8px; font-size: 13px;">紧急招聘！超高薪！无需经验！立即入职可获得身份转换机会...</div>' +
            '</div>' +
            '<p style="color: #ff8888; margin-top: 15px; font-size: 12px;">⚠️ 该网站已被标记为危险站点，继续浏览风险自负</p>' +
            '</div>';
        var resultItem = document.getElementById('searchResultItem');
        if (resultItem) resultItem.onclick = function() { self.showJobListings(); };
    },
    
    showJobListings: function() {
        var self = this;
        var jobsHtml = '<h3 style="color:#ffaa66; margin-bottom: 12px;">⚠️ 异常招聘列表</h3><p style="font-size:12px; color:#aaa; margin-bottom: 15px;">以下工作可能存在未知风险...</p>';
        for (var i = 0; i < GameState.jobs.length; i++) {
            var job = GameState.jobs[i];
            jobsHtml += '<div class="job-item" data-job-id="' + job.id + '"><strong style="font-size: 16px; color: #ffaa88;">' + job.title + '</strong><br>' +
                '<span style="font-size: 12px; color: #aaa;">' + job.company + ' | ' + job.salary + '</span>' +
                '<div style="font-size: 11px; color: #ff8888; margin-top: 5px;">危险等级: ' + job.danger + '</div></div>';
        }
        this._content.innerHTML = jobsHtml;
        
        var jobElements = document.querySelectorAll('#browserContent .job-item');
        for (var j = 0; j < jobElements.length; j++) {
            (function(el) {
                el.onclick = function() {
                    var jobId = parseInt(el.getAttribute('data-job-id'));
                    var job = GameState.getJob(jobId);
                    if (job) self.showJobDetail(job);
                };
            })(jobElements[j]);
        }
    },
    
    showJobDetail: function(job) {
        var self = this;
        this._content.innerHTML = '<div class="job-detail" style="max-height: 400px; overflow-y: auto;">' +
            '<h3 style="color: #ffaa66;">' + job.title + '</h3>' +
            '<p><strong style="color: #ffaa88;">🏢 公司：</strong><span style="color: #eef4ff;">' + job.company + '</span></p>' +
            '<p><strong style="color: #ffaa88;">💰 薪资：</strong><span style="color: #eef4ff;">' + job.salary + '</span></p>' +
            '<p><strong style="color: #ffaa88;">⚠️ 危险等级：</strong><span style="color:#ff8888;">' + job.danger + '</span></p>' +
            '<p><strong style="color: #ffaa88;">📋 职位描述：</strong><br><span style="color: #eef4ff;">' + job.desc + '</span></p>' +
            '<p><strong style="color: #ffaa88;">📌 任职要求：</strong><br><span style="color: #eef4ff;">' + job.requirement + '</span></p>' +
            '<div style="height: 120px; overflow-y: auto; background: #1e2e2e; padding: 12px; margin: 12px 0; border-radius: 8px; font-size: 12px; border: 1px solid #5a7a7a;">' +
            '<p style="color: #ffaa66; font-weight: bold;">📜 详细说明（往下滑动查看更多）...</p>' +
            '<p style="margin-top: 10px; color: #eef4ff;">' + (job.id === 2 ? '⚠️ 此职位需要实时摄像头验证身份，系统将检测你是否为"真实人类"。' : '该职位已有数名应聘者失联，请谨慎考虑。') + '</p>' +
            '</div>' +
            '<button class="apply-btn" id="applyJobBtn">📩 前往应聘</button>' +
            '<button id="backToJobsBtn" style="margin-top:12px; background:#5a6a6a; padding:10px; border:none; border-radius:25px; color:white; cursor:pointer; width:100%;">← 返回职位列表</button>' +
            '</div>';
        
        var applyBtn = document.getElementById('applyJobBtn');
        var backBtn = document.getElementById('backToJobsBtn');
        
        if (applyBtn) {
            var newApplyBtn = applyBtn.cloneNode(true);
            applyBtn.parentNode.replaceChild(newApplyBtn, applyBtn);
            newApplyBtn.onclick = function() { self._onJobApply(job); };
        }
        
        if (backBtn) {
            var newBackBtn = backBtn.cloneNode(true);
            backBtn.parentNode.replaceChild(newBackBtn, backBtn);
            newBackBtn.onclick = function() { self.showJobListings(); };
        }
    },
    
    showApplyResult: function(job) {
        var self = this;
        this._content.innerHTML = '<div class="loading-spinner"><div class="spinner"></div><p>提交简历中...</p></div>';
        setTimeout(function() {
            self._content.innerHTML = '<div style="background:#2a3a3a; padding:25px; border-left:4px solid #ff8888;">' +
                '<p style="color: #eef4ff;">⚠️ 系统警告：该公司的服务器地址位于未知区域</p>' +
                '<div style="display: flex; gap: 10px; margin-top: 20px;">' +
                '<button class="game-btn" id="continueInvasion" style="background: #8b0000;">⚠️ 了解详情</button>' +
                '<button class="game-btn" id="cancelApply" style="background: #5a6a6a;">❌ 取消应聘</button>' +
                '</div>' +
                '</div>';
            
            var continueBtn = document.getElementById('continueInvasion');
            var cancelBtn = document.getElementById('cancelApply');
            
            if (continueBtn) {
                var newContinueBtn = continueBtn.cloneNode(true);
                continueBtn.parentNode.replaceChild(newContinueBtn, continueBtn);
                newContinueBtn.onclick = function() { 
                    GameState.step = 2; 
                    GameState.reduceSanity(25);
                    Quest.update("🚨 伪人通过招聘网站入侵了你的电脑！");
                    if (window.Game && window.Game.triggerInvasion) window.Game.triggerInvasion();
                };
            }
            
            if (cancelBtn) {
                var newCancelBtn = cancelBtn.cloneNode(true);
                cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
                newCancelBtn.onclick = function() {
                    self._content.innerHTML = '<div style="text-align:center; padding:30px;">' +
                        '<p style="color: #88ff88;">✅ 已取消应聘</p>' +
                        '<button class="game-btn" id="backToJobsBtn" style="margin-top:15px;">返回职位列表</button>' +
                        '</div>';
                    var backBtn = document.getElementById('backToJobsBtn');
                    if (backBtn) {
                        backBtn.onclick = function() {
                            self.showJobListings();
                        };
                    }
                    Notifications.info("你取消了应聘，暂时安全了...", 2000);
                };
            }
        }, 2000);
    },
    
    showOfflineMessage: function() {
        var self = this;
        this._content.innerHTML = '<div style="text-align:center; padding:60px;"><div style="font-size:48px;">⚠️</div><h3 style="color: #eef4ff;">无法连接到互联网</h3><button class="game-btn" id="retryNetworkBtn">重新连接</button></div>';
        var btn = document.getElementById('retryNetworkBtn');
        if (btn) {
            var newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            newBtn.onclick = function() { 
                GameState.isOnline = true; 
                if (window.Game && window.Game.updateNetworkUI) window.Game.updateNetworkUI(); 
                self.renderGoogleHomepage(); 
            };
        }
    },
    
    resetCameraDenyCount: function() {
        if (window.Game) {
            window.Game._cameraDenyCount = 0;
        }
    }
};
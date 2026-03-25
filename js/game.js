// 游戏主控制器
var Game = Game || {
    _state: null,
    _settings: null,
    _windowManager: null,
    _browser: null,
    _email: null,
    _notepad: null,
    _security: null,
    _globalDoom: null,
    _clockInterval: null,
    _sanityDeathCheckInterval: null,
    
    // 计数器
    _cameraDenyCount: 0,
    _cameraAllowCount: 0,
    _searchCount: 0,
    _goodEndingsCount: 0,
    _toggleCount: 0,
    _ancientBooksFound: [],
    _predictionText: null,
    _emailsRead: false,  // 邮件已读标记
    
    init: function() {
        console.log("Game initializing...");
        
        Notifications.init();
        
        this._windowManager = WindowManager;
        this._windowManager.init();
        
        this._state = GameState;
        this._state.load();
        
        this._settings = Settings;
        this._settings.init(this._windowManager.getContent('settings'), this);
        
        this._browser = Browser;
        this._browser.init(
            this._windowManager.getContent('browser'),
            this._state,
            this.applyForJob.bind(this),
            this
        );
        
        this._email = Email;
        this._email.init(
            this._windowManager.getContent('email'),
            this._state,
            this  // 传入 Game 引用
        );
        
        this._notepad = Notepad;
        this._notepad.init(
            this._windowManager.getContent('notepad'),
            this._state,
            this
        );
        
        this._security = Security;
        this._security.init(
            this._windowManager.getContent('security'),
            this._state,
            this._settings,
            this
        );
        
        this._globalDoom = GlobalDoom;
        this._globalDoom.init(
            this._state,
            this._windowManager.getWindow('news'),
            this._windowManager.getWindow('chat'),
            this._windowManager.getContent('news'),
            this._windowManager.getContent('chat'),
            this
        );
        
        this.renderAchievements();
        this.bindUIEvents();
        this.startClock();
        this.checkMobile();
        this.startSanityDrain();
        this.startSanityDeathCheck();
        this.updateUI();
        this.updateNetworkUI();
        this.updateEndingProgress();
        
        // 每小时检查古老契约
        setInterval(function() {
            if (window.Game) window.Game.checkAncientContract();
        }, 60000);
        
        window.Game = this;
        
        console.log("Game initialized successfully");
    },
    
    // 标记邮件已读
    markEmailsRead: function() {
        this._emailsRead = true;
        // 结局10：所有邮件已读 + 解锁3个好结局
        if (this._goodEndingsCount >= 3 && this._emailsRead && !this._state.gameEnded && !this._state.isEndingUnlocked(10)) {
            this._state.unlockEnding(10);
            this.showEnding(10);
        }
    },
    
    addSearchCount: function() {
        this._searchCount++;
        console.log("搜索次数:", this._searchCount);
        
        // 结局9：搜索3次以上伪人关键词
        if (this._searchCount >= 3 && !this._state.gameEnded && !this._state.isEndingUnlocked(9)) {
            this._state.unlockEnding(9);
            this.showEnding(9);
        }
    },
    
    addGoodEnding: function() {
        this._goodEndingsCount++;
        console.log("好结局数量:", this._goodEndingsCount);
        
        // 结局10：解锁3个好结局 + 所有邮件已读
        if (this._goodEndingsCount >= 3 && this._emailsRead && !this._state.gameEnded && !this._state.isEndingUnlocked(10)) {
            this._state.unlockEnding(10);
            this.showEnding(10);
        }
    },
    
    addToggleCount: function() {
        this._toggleCount++;
        console.log("防护切换次数:", this._toggleCount);
        
        // 结局11：理智值在50%左右时，切换防护3次
        if (this._toggleCount >= 3 && this._state.sanity >= 45 && this._state.sanity <= 55 && !this._state.gameEnded && !this._state.isEndingUnlocked(11)) {
            this._state.unlockEnding(11);
            this.showEnding(11);
        }
    },
    
    addAncientBook: function(bookName) {
        if (this._ancientBooksFound.indexOf(bookName) === -1) {
            this._ancientBooksFound.push(bookName);
            console.log("发现古籍:", bookName);
        }
    },
    
    setPrediction: function(text) {
        this._predictionText = text;
        console.log("预言已记录:", text);
        Notifications.success("🔮 预言已记录！如果预言成真，将解锁隐藏结局", 3000);
    },
    
    checkPrediction: function() {
        if (!this._predictionText) return;
        
        // 检查是否入侵发生
        if (this._predictionText.indexOf("入侵") !== -1 && this._state.step >= 2) {
            if (!this._state.gameEnded && !this._state.isEndingUnlocked(12)) {
                // 阻止普通入侵，直接触发结局12
                this._state.unlockEnding(12);
                this.showEnding(12);
                return true;
            }
        }
        return false;
    },
    
    checkCodeTruth: function() {
        if (this._state.sanity === 100 && !this._state.gameEnded && !this._state.isEndingUnlocked(14)) {
            this._state.unlockEnding(14);
            this.showEnding(14);
        }
    },
    
    checkAncientContract: function() {
        var now = new Date();
        var hours = now.getHours();
        var minutes = now.getMinutes();
        
        // 午夜12点（23:55 到 00:05）
        var isMidnight = (hours === 23 && minutes >= 55) || (hours === 0 && minutes <= 5);
        
        if (this._ancientBooksFound.length >= 1 && isMidnight && !this._state.gameEnded && !this._state.isEndingUnlocked(15)) {
            this._state.unlockEnding(15);
            this.showEnding(15);
        }
    },
    
    startSanityDeathCheck: function() {
        var self = this;
        this._sanityDeathCheckInterval = setInterval(function() {
            if (!self._state.gameEnded && self._state.sanity <= 0) {
                if (self._searchCount >= 1) {
                    self._state.unlockEnding(5);
                    self.showEnding(5);
                } else {
                    self._state.unlockEnding(1);
                    self.showEnding(1);
                }
            }
        }, 500);
    },
    
    renderAchievements: function() {
        var achievementsContent = this._windowManager.getContent('achievements');
        if (!achievementsContent) return;
        
        var html = '<div class="achievement-grid">';
        var endings = EndingsData.getAll();
        
        for (var i = 1; i <= 16; i++) {
            var ending = endings[i];
            if (ending) {
                var isUnlocked = this._state.isEndingUnlocked(i);
                html += '<div class="achievement-card ' + (isUnlocked ? 'unlocked' : 'locked') + '">' +
                    '<div class="achievement-icon">' + (isUnlocked ? ending.name.charAt(0) : '❓') + '</div>' +
                    '<div class="achievement-name">' + (isUnlocked ? ending.name : '???') + '</div>' +
                    '<div class="achievement-category">' + EndingsData.getCategoryName(ending.category) + '</div>' +
                    (isUnlocked ? '<div class="achievement-desc">' + ending.desc + '</div>' : '<div class="achievement-desc">未解锁</div>') +
                    '</div>';
            }
        }
        
        html += '</div><p style="text-align: center; margin-top: 15px; color: #aaa;">解锁更多结局...</p>';
        achievementsContent.innerHTML = html;
    },
    
    applyForJob: function(job) {
        if (this._state.gameEnded) {
            Notifications.warning("游戏已结束，请点击「重启」重新开始", 2000);
            return;
        }
        
        if (this._state.jumpscareTriggered) return;
        
        // 结局5：如果理智值已经很低且搜索过
        if (this._state.sanity <= 5 && this._searchCount >= 1) {
            this._state.unlockEnding(5);
            this.showEnding(5);
            return;
        }
        
        // 伪人识别测试员 - 需要摄像头权限
        if (job.id === 2 && job.fakeCamera) {
            this.showCameraModalForJob(job);
            return;
        }
        
        if (!this._state.jobApplied) {
            this._state.jobApplied = true;
            this._state.step = 1;
            this._state.reduceSanity(10);
            Notifications.warning("⚠️ 你应聘了一份诡异工作！邮件箱收到警告信...", 4000);
            this._email.sendWarning();
            this._browser.showApplyResult(job);
        } else {
            this._state.step = 2;
            this._state.reduceSanity(30);
            Notifications.error("🚨 伪人通过招聘网站入侵了你的电脑！", 4000);
            this._email.render();
            this.shakeDesktop();
            
            // 检查预言，如果预言成真则阻止入侵
            if (this.checkPrediction()) {
                return;
            }
            
            if (this._state.sanity <= 0) {
                if (this._searchCount >= 1) {
                    this._state.unlockEnding(5);
                    this.showEnding(5);
                    return;
                }
            }
            
            this.triggerInvasion();
        }
    },
    
    triggerInvasion: function() {
        // 结局5优先
        if (this._state.sanity <= 5 && this._searchCount >= 1 && !this._state.gameEnded) {
            this._state.unlockEnding(5);
            this.showEnding(5);
            return;
        }
        
        // 结局3：断网逃生
        if (!this._state.isOnline && this._state.step >= 2) {
            GameState.unlockEnding(3);
            this.showEnding(3);
            return;
        }
        
        // 结局6：防火墙胜利
        if (Settings.firewallEnabled && Settings.antivirusEnabled && Settings.dnsEnabled && this._state.step >= 2) {
            this._state.unlockEnding(6);
            this.showEnding(6);
            return;
        }
        
        // 结局1：普通入侵
        if (!this._state.jumpscareTriggered && !this._state.gameEnded) {
            this.showInvasionInterface();
        }
    },
    
    showInvasionInterface: function() {
        this._windowManager.open('browser');
        
        var browserContent = this._windowManager.getContent('browser');
        if (browserContent) {
            browserContent.innerHTML = '<div style="text-align:center; padding: 40px; border: 3px solid red; background: #2a1a1a; border-radius: 16px;">' +
                '<span style="font-size: 32px;">⚠️ 系统入侵 ⚠️</span>' +
                '<p id="glitchMsg" style="margin-top: 20px; font-family: monospace; font-size: 16px; color: #ff8888;">>> 伪人已锁定你的位置 <<</p>' +
                '<button id="desperateBtn" class="game-btn" style="margin-top: 25px; background: #8b0000;">💀 试图关闭 💀</button>' +
                '</div>';
            
            var desperateBtn = document.getElementById('desperateBtn');
            if (desperateBtn) {
                var newDesperateBtn = desperateBtn.cloneNode(true);
                desperateBtn.parentNode.replaceChild(newDesperateBtn, desperateBtn);
                newDesperateBtn.onclick = function() { 
                    if (window.Game && window.Game.triggerJumpscare) window.Game.triggerJumpscare(); 
                };
            }
            
            this.startBrowserGlitch();
        }
        
        setTimeout(function() {
            if (window.Game && window.Game._windowManager) {
                window.Game._windowManager.open('browser');
            }
        }, 100);
    },
    
    showCameraModalForJob: function(job) {
        var modal = document.getElementById('cameraModal');
        if (!modal) return;
        
        modal.classList.remove('hidden');
        
        var allowBtn = document.getElementById('cameraAllowBtn');
        var denyBtn = document.getElementById('cameraDenyBtn');
        var self = this;
        
        if (allowBtn) {
            var newAllowBtn = allowBtn.cloneNode(true);
            allowBtn.parentNode.replaceChild(newAllowBtn, allowBtn);
            newAllowBtn.onclick = function(e) {
                e.stopPropagation();
                modal.classList.add('hidden');
                
                self._cameraAllowCount++;
                
                // 结局13：伪人之眼 - 拒绝3次后第4次同意
                if (self._cameraDenyCount >= 3 && !self._state.gameEnded && !self._state.isEndingUnlocked(13)) {
                    self._state.unlockEnding(13);
                    self.showEnding(13);
                    return;
                }
                
                var browserContent = self._windowManager.getContent('browser');
                if (browserContent) {
                    browserContent.innerHTML = '<div class="loading-spinner"><div class="spinner"></div><p>验证中...</p></div>';
                }
                setTimeout(function() {
                    if (browserContent) {
                        browserContent.innerHTML = '<div style="text-align:center; padding:25px; border:2px solid #ff8888; background: #2a1a1a;">' +
                            '<span style="font-size:28px; color: #ffaa66;">⚠️ 验证异常</span>' +
                            '<p style="color: #eef4ff;">面容匹配度 87%</p>' +
                            '<button class="game-btn" id="backToJobsBtn">返回职位列表</button>' +
                            '</div>';
                        var backBtn = document.getElementById('backToJobsBtn');
                        if (backBtn) {
                            backBtn.onclick = function() {
                                self._browser.showJobListings();
                            };
                        }
                    }
                }, 2000);
            };
        }
        
        if (denyBtn) {
            var newDenyBtn = denyBtn.cloneNode(true);
            denyBtn.parentNode.replaceChild(newDenyBtn, denyBtn);
            newDenyBtn.onclick = function(e) {
                e.stopPropagation();
                modal.classList.add('hidden');
                
                self._cameraDenyCount++;
                
                // 拒绝3次后不再触发基因同化，而是允许触发伪人之眼
                // 结局4改为其他触发方式，这里不触发结局4
                if (self._cameraDenyCount >= 3 && !self._state.gameEnded) {
                    Notifications.warning("👁️ 你多次拒绝摄像头...再拒绝一次可能会触发未知结局", 2000);
                }
                
                var browserContent = self._windowManager.getContent('browser');
                if (browserContent) {
                    var remaining = 3 - self._cameraDenyCount;
                    if (remaining <= 0) {
                        browserContent.innerHTML = '<div style="color:#ffaa66; text-align:center; padding:30px;">' +
                            '⚠️ 你已经拒绝了3次摄像头<br>' +
                            '<span style="font-size:12px; color:#aaa;">下次同意可能会触发隐藏结局</span>' +
                            '<br><button class="game-btn" id="backToJobsBtn" style="margin-top:15px;">返回职位列表</button>' +
                            '</div>';
                    } else {
                        browserContent.innerHTML = '<div style="color:#ff8888; text-align:center; padding:30px;">' +
                            '❌ 已拒绝摄像头权限<br>' +
                            '<span style="font-size:12px; color:#aaa;">你还剩 ' + remaining + ' 次拒绝机会</span>' +
                            '<br><button class="game-btn" id="backToJobsBtn" style="margin-top:15px;">返回职位列表</button>' +
                            '</div>';
                    }
                    
                    var backBtn = document.getElementById('backToJobsBtn');
                    if (backBtn) {
                        backBtn.onclick = function() {
                            self._browser.showJobListings();
                        };
                    }
                }
                
                Notifications.warning("⚠️ 摄像头已拒绝 (" + self._cameraDenyCount + "/3)", 2000);
            };
        }
    },
    
    showEnding: function(endingId) {
        if (this._state.gameEnded) return;
        this._state.gameEnded = true;
        
        var ending = EndingsData.get(endingId);
        if (!ending) return;
        
        this._state.unlockEnding(endingId);
        
        if (endingId >= 6 && endingId <= 10) {
            this.addGoodEnding();
        }
        
        this.renderAchievements();
        this.updateEndingProgress();
        
        var modal = document.getElementById('endingModal');
        var categoryEl = document.getElementById('endingCategory');
        var titleEl = document.getElementById('endingTitle');
        var textEl = document.getElementById('endingText');
        var hintEl = document.getElementById('endingHint');
        
        if (categoryEl) {
            categoryEl.className = 'ending-category ' + ending.category;
            categoryEl.textContent = EndingsData.getCategoryName(ending.category);
        }
        if (titleEl) titleEl.textContent = ending.name;
        if (textEl) textEl.innerHTML = ending.desc;
        if (hintEl) hintEl.innerHTML = '🔍 解锁条件: ' + ending.condition;
        if (modal) modal.classList.remove('hidden');
        
        var self = this;
        var restartBtn = document.getElementById('restartGameBtn');
        var continueBtn = document.getElementById('continueBtn');
        
        if (restartBtn) {
            var newRestartBtn = restartBtn.cloneNode(true);
            restartBtn.parentNode.replaceChild(newRestartBtn, restartBtn);
            newRestartBtn.onclick = function() { 
                self.resetGame();
            };
        }
        if (continueBtn) {
            var newContinueBtn = continueBtn.cloneNode(true);
            continueBtn.parentNode.replaceChild(newContinueBtn, continueBtn);
            newContinueBtn.onclick = function() {
                modal.classList.add('hidden');
                self._windowManager.open('achievements');
            };
        }
        
        this._windowManager.closeAll();
    },
    
    triggerJumpscare: function() {
        if (this._state.jumpscareTriggered || this._state.gameEnded) return;
        this._state.jumpscareTriggered = true;
        this._state.step = 3;
        
        this._windowManager.closeAll();
        
        var overlay = document.createElement('div');
        overlay.className = 'jumpscare-overlay';
        overlay.innerHTML = '<div style="font-size: 100px; text-align: center;">👁️‍🗨️👤⚠️</div>' +
            '<div style="color: #ff4444; font-size: 42px; font-weight: bold; text-align: center; margin-top: 20px;">伪 人 入 侵</div>' +
            '<div style="color: #ffffff; margin-top: 25px; text-align: center; font-size: 18px;">你的身份已被覆盖...</div>';
        document.body.appendChild(overlay);
        
        try {
            var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            var osc = audioCtx.createOscillator();
            var gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.type = 'sawtooth';
            osc.frequency.value = 880;
            gain.gain.value = 0.25;
            osc.start();
            gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.8);
            osc.stop(audioCtx.currentTime + 1.8);
        } catch(e) {}
        
        var self = this;
        setTimeout(function() {
            overlay.remove();
            self._state.unlockEnding(1);
            self.showEnding(1);
        }, 2500);
    },
    
    startBrowserGlitch: function() {
        var self = this;
        if (this._state.glitchInterval) clearInterval(this._state.glitchInterval);
        this._state.glitchInterval = setInterval(function() {
            var span = document.getElementById('glitchMsg');
            if (span && self._state.step === 2 && !self._state.gameEnded) {
                var msgs = ['>> 我们注意到你 <<', '>> 不要回头 <<', '>> 伪人已复制你的面容 <<'];
                span.innerText = msgs[Math.floor(Math.random() * msgs.length)];
            }
        }, 700);
    },
    
    shakeDesktop: function() {
        var desk = document.querySelector('.desktop');
        if (desk) {
            desk.style.animation = 'shake 0.08s 3';
            setTimeout(function() { desk.style.animation = ''; }, 300);
        }
    },
    
    startSanityDrain: function() {
        var self = this;
        setInterval(function() {
            if (!self._state.gameEnded && self._state.step >= 2 && self._state.sanity > 0 && self._state.isOnline && !Settings.firewallEnabled) {
                self._state.reduceSanity(1);
                self.updateUI();
            }
        }, 4000);
    },
    
    updateUI: function() {
        var sanityFill = document.getElementById('sanityFill');
        var sanityPercent = document.getElementById('sanityPercent');
        if (sanityFill) sanityFill.style.width = this._state.sanity + '%';
        if (sanityPercent) sanityPercent.innerText = this._state.sanity + '%';
    },
    
    updateNetworkUI: function() {
        var networkText = document.querySelector('.network-text');
        var networkIcon = document.querySelector('.network-icon');
        var networkContainer = document.getElementById('networkContainer');
        
        if (this._state.isOnline) {
            if (networkText) networkText.textContent = '网络已连接';
            if (networkIcon) networkIcon.textContent = '🌐';
            if (networkContainer) networkContainer.classList.remove('network-offline');
        } else {
            if (networkText) networkText.textContent = '网络已断开';
            if (networkIcon) networkIcon.textContent = '⚠️';
            if (networkContainer) networkContainer.classList.add('network-offline');
        }
    },
    
    updateEndingProgress: function() {
        var count = this._state.getUnlockedCount();
        var percentage = (count / 16) * 100;
        var fill = document.getElementById('endingProgressFill');
        var text = document.getElementById('endingProgressText');
        if (fill) fill.style.width = percentage + '%';
        if (text) text.innerText = count + ' / 16';
    },
    
    bindUIEvents: function() {
        var self = this;
        
        var icons = document.querySelectorAll('[data-win]');
        for (var i = 0; i < icons.length; i++) {
            (function(el) {
                el.addEventListener('click', function(e) {
                    var winId = el.getAttribute('data-win');
                    if (!self._state.jumpscareTriggered && !self._state.gameEnded) {
                        self._windowManager.open(winId);
                    } else if (self._state.gameEnded) {
                        Notifications.warning("游戏已结束，请点击「重启」重新开始", 2000);
                    }
                    e.stopPropagation();
                });
            })(icons[i]);
        }
        
        document.addEventListener('click', function(e) {
            if (e.target.classList && e.target.classList.contains('close-win')) {
                var win = e.target.closest('.window');
                if (win) win.classList.add('hidden');
            }
        });
        
        var startBtn = document.getElementById('startBtn');
        var startMenu = document.getElementById('startMenu');
        if (startBtn) {
            startBtn.onclick = function(e) {
                e.stopPropagation();
                startMenu.classList.toggle('hidden');
            };
        }
        
        var shutdownBtn = document.getElementById('shutdownBtn');
        if (shutdownBtn) {
            shutdownBtn.onclick = function(e) {
                e.stopPropagation();
                startMenu.classList.add('hidden');
                self._state.unlockEnding(2);
                self.showEnding(2);
            };
        }
        
        var restartBtn = document.getElementById('restartBtn');
        if (restartBtn) {
            restartBtn.onclick = function(e) {
                e.stopPropagation();
                startMenu.classList.add('hidden');
                self.resetGame();
            };
        }
        
        var achievementsBtn = document.getElementById('achievementsBtn');
        if (achievementsBtn) {
            achievementsBtn.onclick = function(e) {
                e.stopPropagation();
                startMenu.classList.add('hidden');
                self._windowManager.open('achievements');
                self.renderAchievements();
            };
        }
        
        var networkToggle = document.getElementById('networkToggleBtn');
        if (networkToggle) {
            networkToggle.onclick = function(e) {
                e.stopPropagation();
                if (self._state.globalDoomTriggered && !self._state.gameEnded) {
                    Notifications.warning("⚠️ 全球网络已被伪人控制，无法切换网络！", 3000);
                    return;
                }
                self._state.isOnline = !self._state.isOnline;
                self.updateNetworkUI();
                
                if (!self._state.isOnline) {
                    Notifications.info("🌐 网络已断开！伪人无法通过网络追踪你", 3000);
                } else {
                    Notifications.info("🌐 网络已恢复。可以继续寻找工作了", 3000);
                    self._browser.renderGoogleHomepage();
                }
            };
        }
        
        document.addEventListener('click', function(e) {
            if (startMenu && !startMenu.contains(e.target) && e.target !== startBtn) {
                startMenu.classList.add('hidden');
            }
        });
        
        var taskIcons = document.querySelectorAll('.task-icon');
        for (var j = 0; j < taskIcons.length; j++) {
            (function(el) {
                el.addEventListener('click', function(e) {
                    e.stopPropagation();
                    var winId = el.getAttribute('data-win');
                    if (winId && !self._state.jumpscareTriggered && !self._state.gameEnded) {
                        self._windowManager.open(winId);
                    } else if (winId && self._state.gameEnded) {
                        Notifications.warning("游戏已结束，请点击「重启」重新开始", 2000);
                    }
                });
            })(taskIcons[j]);
        }
    },
    
    startClock: function() {
        Helpers.updateClock();
        this._clockInterval = setInterval(function() {
            Helpers.updateClock();
        }, 1000);
    },
    
    checkMobile: function() {
        if (window.innerWidth <= 768) {
            var tip = document.getElementById('mobileTip');
            if (tip) tip.classList.remove('hidden');
            
            var closeBtn = document.getElementById('closeMobileTip');
            if (closeBtn) {
                var newCloseBtn = closeBtn.cloneNode(true);
                closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);
                newCloseBtn.onclick = function(e) {
                    e.stopPropagation();
                    var tipEl = document.getElementById('mobileTip');
                    if (tipEl) tipEl.classList.add('hidden');
                };
            }
        }
    },
    
    resetGame: function() {
        this._cameraDenyCount = 0;
        this._cameraAllowCount = 0;
        this._searchCount = 0;
        this._goodEndingsCount = 0;
        this._toggleCount = 0;
        this._ancientBooksFound = [];
        this._predictionText = null;
        this._emailsRead = false;
        
        if (this._state.glitchInterval) clearInterval(this._state.glitchInterval);
        if (this._globalDoom) {
            if (this._globalDoom._chatMessageInterval) clearInterval(this._globalDoom._chatMessageInterval);
            if (this._globalDoom._finalDrainInterval) clearInterval(this._globalDoom._finalDrainInterval);
            if (this._globalDoom._sanityCheckInterval) clearInterval(this._globalDoom._sanityCheckInterval);
        }
        if (this._sanityDeathCheckInterval) clearInterval(this._sanityDeathCheckInterval);
        if (this._clockInterval) clearInterval(this._clockInterval);
        
        this._state.reset();
        
        localStorage.removeItem('pseudoGame');
        
        location.reload();
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { 
        Game.init(); 
    });
} else {
    Game.init();
}
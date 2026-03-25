// 全军覆没剧情模块
var GlobalDoom = GlobalDoom || {
    _state: null,
    _newsWin: null,
    _chatWin: null,
    _newsContent: null,
    _chatContent: null,
    _chatMessages: [],
    _newsMessages: [],
    _chatMessageInterval: null,
    _finalDrainInterval: null,
    _sanityCheckInterval: null,
    _invasionDefeated: false,
    _chatTriggered: false,
    _isGoodEndingChat: false,
    _isDoomEndingChat: false,
    _game: null,
    
    init: function(state, newsWin, chatWin, newsContent, chatContent, game) {
        this._state = state;
        this._newsWin = newsWin;
        this._chatWin = chatWin;
        this._newsContent = newsContent;
        this._chatContent = chatContent;
        this._game = game;
        
        this.initNormalNews();
        this.initNormalChat();
        this.startSanityCheck();
    },
    
    startSanityCheck: function() {
        var self = this;
        this._sanityCheckInterval = setInterval(function() {
            if (self._invasionDefeated) return;
            
            if (!self._state.gameEnded && 
                !self._state.globalDoomTriggered && 
                self._state.step >= 1 && 
                self._state.sanity <= 80 && 
                self._state.sanity > 0) {
                self.triggerNews();
            }
        }, 1000);
    },
    
    initNormalNews: function() {
        this._newsMessages = [];
        
        var normalNews = [
            { title: "🌤️ 天气预报", content: "今日天气晴朗，气温22-28℃，适合外出活动。", time: "07:00" },
            { title: "🏀 体育新闻", content: "本地篮球队以98:95险胜对手，晋级决赛！", time: "10:30" },
            { title: "🎬 娱乐资讯", content: "最新科幻电影《数字迷城》本周五上映，预售已开启。", time: "12:15" },
            { title: "💰 财经快报", content: "科技股今日小幅上涨，市场情绪回暖。", time: "14:20" },
            { title: "🍜 美食推荐", content: "新开的日料店评分超高，网友推荐三文鱼刺身！", time: "16:45" },
            { title: "🐱 萌宠趣闻", content: "市民救助流浪猫，网友点赞暖心行为。", time: "18:30" }
        ];
        
        for (var i = 0; i < normalNews.length; i++) {
            var news = normalNews[i];
            var newsHtml = '<div style="background: #2a3a3a; padding: 12px; margin: 8px 0; border-radius: 12px; border-left: 4px solid #ffaa66;">' +
                '<div style="color: #ffaa66; font-weight: bold;">' + news.title + '</div>' +
                '<div style="color: #888; font-size: 11px;">' + news.time + '</div>' +
                '<p style="color: #eef4ff; margin-top: 8px;">' + news.content + '</p>' +
                '</div>';
            this._newsMessages.push(newsHtml);
        }
        
        this.renderNewsContent(false);
    },
    
    renderNewsContent: function(isHorror) {
        if (!this._newsContent) return;
        
        if (!isHorror) {
            var html = '<div style="padding: 10px; max-height: 400px; overflow-y: auto;">';
            for (var i = 0; i < this._newsMessages.length; i++) {
                html += this._newsMessages[i];
            }
            html += '</div>';
            this._newsContent.innerHTML = html;
        } else {
            var self = this;
            this._newsContent.innerHTML = '<div style="padding: 10px;">' +
                '<div style="background: #4a2a2a; padding: 15px; border-radius: 12px; border-left: 4px solid #ff4444;">' +
                '<h3 style="color: #ff8888;">🚨 紧急新闻快报 🚨</h3>' +
                '<p style="color: #eef4ff; line-height: 1.6;">据官方消息，全国多个城市出现大规模人口失踪事件。失踪者最后都被发现...变成了另一个人。</p>' +
                '<p style="color: #ffaa66; margin-top: 10px;">专家警告：这可能与一种名为"伪人"的异常存在有关！</p>' +
                '<p style="color: #ff8888; margin-top: 10px;">⚠️ 你的家人可能已经处于危险之中！</p>' +
                '<div style="display: flex; gap: 10px; margin-top: 15px;">' +
                '<button class="game-btn" id="goodEndingBtn" style="background: #2a6a4a;">🏠 提醒家人</button>' +
                '<button class="game-btn" id="doomEndingBtn" style="background: #8b0000;">💀 继续工作</button>' +
                '</div>' +
                '</div>' +
                '</div>';
            
            var goodBtn = document.getElementById('goodEndingBtn');
            if (goodBtn) {
                var newGoodBtn = goodBtn.cloneNode(true);
                goodBtn.parentNode.replaceChild(newGoodBtn, goodBtn);
                newGoodBtn.onclick = function() {
                    self._newsWin.classList.add('hidden');
                    self._isGoodEndingChat = true;
                    Notifications.success("🏠 你决定提醒家人！打开聊天看看他们的回复...", 3000);
                    Quest.update("🏠 你决定提醒家人！打开「聊天」看看他们的回复...");
                };
            }
            
            var doomBtn = document.getElementById('doomEndingBtn');
            if (doomBtn) {
                var newDoomBtn = doomBtn.cloneNode(true);
                doomBtn.parentNode.replaceChild(newDoomBtn, doomBtn);
                newDoomBtn.onclick = function() {
                    self._newsWin.classList.add('hidden');
                    self._isDoomEndingChat = true;
                    Notifications.warning("💀 你选择继续工作，没有提醒家人...", 3000);
                    Quest.update("💀 你选择继续工作，没有提醒家人...打开「聊天」看看发生了什么？");
                };
            }
        }
    },
    
    initNormalChat: function() {
        this._chatMessages = [];
        this._chatTriggered = false;
        this._isGoodEndingChat = false;
        this._isDoomEndingChat = false;
        
        var normalMessages = [
            { sender: "妈妈", text: "😊 儿子，今天晚饭想吃什么？", time: "18:30" },
            { sender: "爸爸", text: "💼 今天加班，晚点回来", time: "18:32" },
            { sender: "妹妹", text: "🎮 哥哥，我游戏通关啦！", time: "18:35" },
            { sender: "妈妈", text: "🍜 那就煮面条吧，简单点", time: "18:38" },
            { sender: "你", text: "👍 好的，我马上回来", time: "18:40" },
            { sender: "妹妹", text: "✨ 哥哥记得带奶茶！", time: "18:42" },
            { sender: "爸爸", text: "🚗 路上堵车，可能要晚半小时", time: "18:45" },
            { sender: "妈妈", text: "🍳 那我把菜温着，不着急", time: "18:47" }
        ];
        
        for (var i = 0; i < normalMessages.length; i++) {
            var msg = normalMessages[i];
            var messageHtml = '<div class="chat-message">' +
                '<span class="chat-sender">' + msg.sender + ':</span>' +
                '<div class="chat-bubble">' +
                '<span>' + msg.text + '</span>' +
                '<div style="font-size: 10px; color: #888; margin-top: 4px;">' + msg.time + '</div>' +
                '</div>' +
                '</div>';
            this._chatMessages.push(messageHtml);
        }
        
        this.renderChatContent();
    },
    
    renderChatContent: function() {
        if (!this._chatContent) return;
        
        var messagesHtml = '<div style="padding: 10px;">' +
            '<div style="background: #2a3a3a; border-radius: 12px; overflow: hidden;">' +
            '<div style="background: #1e6a3a; padding: 12px; color: white;">' +
            '<span>👨‍👩‍👧‍👦 家人群聊</span>' +
            '<span style="float: right;">3人在线</span>' +
            '</div>' +
            '<div id="chatMessagesArea" style="height: 350px; overflow-y: auto; padding: 15px; background: #1e2a2a;">';
        
        for (var i = 0; i < this._chatMessages.length; i++) {
            messagesHtml += this._chatMessages[i];
        }
        
        messagesHtml += '</div>' +
            '<div style="padding: 10px; background: #2a3a3a; border-top: 1px solid #5a7a7a;">' +
            '<input type="text" id="chatInput" placeholder="输入消息..." style="width: 100%; padding: 8px; border-radius: 20px; border: none; background: #1e2a2a; color: #eef4ff;" disabled>' +
            '</div>' +
            '</div>' +
            '</div>';
        
        this._chatContent.innerHTML = messagesHtml;
        
        this.setupChatWindowListener();
    },
    
    setupChatWindowListener: function() {
        var self = this;
        var chatWindow = document.getElementById('chatWindow');
        if (chatWindow) {
            var observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                        if (!chatWindow.classList.contains('hidden')) {
                            self.onChatWindowOpened();
                        }
                    }
                });
            });
            observer.observe(chatWindow, { attributes: true });
        }
    },
    
    onChatWindowOpened: function() {
        if (this._chatTriggered) return;
        if (this._state.gameEnded) return;
        
        // 情况1：提醒家人后打开聊天（好结局 - 家庭团圆）
        if (this._isGoodEndingChat && this._state.globalDoomTriggered) {
            this._chatTriggered = true;
            this.startGoodEndingMessages();
            return;
        }
        
        // 情况2：选择继续工作后打开聊天（坏结局 - 全军覆没）
        if (this._isDoomEndingChat && this._state.globalDoomTriggered) {
            this._chatTriggered = true;
            this.startDoomEndingMessages();
            return;
        }
    },
    
    startGoodEndingMessages: function() {
        var self = this;
        var goodMessages = [
            { sender: "妈妈", text: "😨 儿子，我看到新闻了！你没事吧？", time: "19:05" },
            { sender: "爸爸", text: "⚠️ 快关掉电脑！那些招聘网站有问题！", time: "19:06" },
            { sender: "妹妹", text: "😰 哥哥，我在新闻上看到失踪的人...", time: "19:07" },
            { sender: "你", text: "💡 我知道！快拔掉网线，关掉所有电子设备！", time: "19:08" },
            { sender: "妈妈", text: "🏃 已经关了！我们准备离开家，你也快出来！", time: "19:09" },
            { sender: "爸爸", text: "🚗 我在楼下等你，快下来！", time: "19:10" },
            { sender: "妹妹", text: "❤️ 哥哥，我们等你！一定要安全出来！", time: "19:11" }
        ];
        
        var messageIndex = 0;
        
        if (this._chatMessageInterval) clearInterval(this._chatMessageInterval);
        
        this._chatMessageInterval = setInterval(function() {
            if (self._state.gameEnded) {
                clearInterval(self._chatMessageInterval);
                return;
            }
            
            if (messageIndex < goodMessages.length) {
                var msg = goodMessages[messageIndex];
                
                var messageHtml = '<div class="chat-message">' +
                    '<span class="chat-sender">' + msg.sender + ':</span>' +
                    '<div class="chat-bubble" style="background: #2a6a4a;">' +
                    '<span>' + msg.text + '</span>' +
                    '<div style="font-size: 10px; color: #aaffaa; margin-top: 4px;">' + msg.time + '</div>' +
                    '</div>' +
                    '</div>';
                
                self._chatMessages.push(messageHtml);
                
                var messagesArea = document.getElementById('chatMessagesArea');
                if (messagesArea) {
                    messagesArea.innerHTML = '';
                    for (var i = 0; i < self._chatMessages.length; i++) {
                        messagesArea.innerHTML += self._chatMessages[i];
                    }
                    messagesArea.scrollTop = messagesArea.scrollHeight;
                }
                
                messageIndex++;
            } else {
                clearInterval(self._chatMessageInterval);
                if (!self._state.gameEnded && self._state.globalDoomTriggered) {
                    self._state.unlockEnding(8);
                    if (window.Game && window.Game.showEnding) window.Game.showEnding(8);
                }
            }
        }, 3000);
    },
    
    startDoomEndingMessages: function() {
        var self = this;
        var doomMessages = [
            { sender: "妈妈", text: "😈 儿子...你怎么还不回家？", time: "19:05" },
            { sender: "爸爸", text: "👁️ 我们都在等你...变成和我们一样", time: "19:07" },
            { sender: "妹妹", text: "👤 哥哥，我们变成了一样的呢", time: "19:09" },
            { sender: "妈妈", text: "💀 你也该成为我们的一员了", time: "19:11" },
            { sender: "爸爸", text: "🌀 放弃抵抗吧，这是命运", time: "19:13" },
            { sender: "妹妹", text: "✨ 快来陪我们吧，永远在一起", time: "19:15" },
            { sender: "妈妈", text: "⚠️ 全世界都是我们的了...", time: "19:17" }
        ];
        
        var messageIndex = 0;
        
        if (this._chatMessageInterval) clearInterval(this._chatMessageInterval);
        
        this._chatMessageInterval = setInterval(function() {
            if (self._state.gameEnded) {
                clearInterval(self._chatMessageInterval);
                return;
            }
            
            if (messageIndex < doomMessages.length) {
                var msg = doomMessages[messageIndex];
                
                var messageHtml = '<div class="chat-message">' +
                    '<span class="chat-sender">' + msg.sender + ':</span>' +
                    '<div class="chat-bubble" style="background: #4a2a2a;">' +
                    '<span>' + msg.text + '</span>' +
                    '<div style="font-size: 10px; color: #ff8888; margin-top: 4px;">' + msg.time + '</div>' +
                    '</div>' +
                    '</div>';
                
                self._chatMessages.push(messageHtml);
                
                var messagesArea = document.getElementById('chatMessagesArea');
                if (messagesArea) {
                    messagesArea.innerHTML = '';
                    for (var i = 0; i < self._chatMessages.length; i++) {
                        messagesArea.innerHTML += self._chatMessages[i];
                    }
                    messagesArea.scrollTop = messagesArea.scrollHeight;
                }
                
                messageIndex++;
            } else {
                clearInterval(self._chatMessageInterval);
                if (!self._state.gameEnded) {
                    self._state.unlockEnding(16);
                    if (window.Game && window.Game.showEnding) window.Game.showEnding(16);
                }
            }
        }, 3500);
    },
    
    triggerNews: function() {
        if (this._state.globalDoomTriggered || this._invasionDefeated) return;
        
        this._state.globalDoomTriggered = true;
        Notifications.error("📰 紧急新闻！全国多地出现异常失踪事件", 5000);
        Quest.update("📰 紧急新闻弹窗：点击查看详情...");
        
        this.renderNewsContent(true);
        this._newsWin.classList.remove('hidden');
        this._newsWin.style.left = '25%';
        this._newsWin.style.top = '20%';
        this._newsWin.style.position = 'fixed';
    },
    
    showInvasionContent: function() {
        console.log("showInvasionContent called - 现在由 game.js 直接处理入侵");
    },
    
    cleanup: function() {
        if (this._chatMessageInterval) clearInterval(this._chatMessageInterval);
        if (this._finalDrainInterval) clearInterval(this._finalDrainInterval);
        if (this._sanityCheckInterval) clearInterval(this._sanityCheckInterval);
    }
};
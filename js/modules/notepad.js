// 记事本模块
var Notepad = Notepad || {
    _content: null,
    _state: null,
    _game: null,
    
    init: function(content, state, game) {
        this._content = content;
        this._state = state;
        this._game = game;
        this.render();
    },
    
    render: function() {
        if (!this._content) return;
        
        var self = this;
        var html = '<div class="diary-entry">📓 求职日记</div>';
        
        if (this._state.step >= 1) {
            html += '<div class="diary-entry">⚠️ 应聘了奇怪的工作...<br>' +
                '<span style="font-size:11px; color: #aaa;">那些招聘信息看起来不对劲</span></div>';
        }
        if (this._state.step >= 2) {
            html += '<div class="diary-entry" style="background:#4a2a2a;">‼️ 伪人正在入侵！屏幕在闪烁...<br>' +
                '我需要找到摆脱它们的方法！</div>';
        }
        
        html += '<div class="diary-entry" style="background:#2a5a3a;">' +
            '<strong style="color: #ffaa66;">📖 重要发现：</strong><br>' +
            '我在网上看到有人说，搜索"如何摆脱伪人"可能会找到驱逐它们的方法...' +
            '<span style="display:block; margin-top:8px; color: #ffaa66;">💡 提示：在浏览器中搜索这个关键词</span>' +
            '</div>' +
            '<div class="diary-entry" style="background:#3a2a5a;">' +
            '<strong style="color: #aa88ff;">🔮 预言笔记：</strong><br>' +
            '<textarea id="predictionInput" placeholder="写下你的预言...例如：伪人将会入侵" style="width:100%; height:60px; background:#1e2a2a; color:#eef4ff; border:1px solid #ffaa66; border-radius:8px; padding:8px; margin-top:8px;"></textarea>' +
            '<button id="savePredictionBtn" class="game-btn" style="margin-top:8px;">📝 保存预言</button>' +
            '<p style="font-size:10px; color:#aaa; margin-top:5px;">💡 如果预言成真，可能会解锁隐藏结局！</p>' +
            '</div>' +
            '<button class="game-btn" id="investigateBtn">🔍 调查伪人线索</button>';
        
        this._content.innerHTML = html;
        
        var btn = document.getElementById('investigateBtn');
        if (btn) {
            btn.onclick = function() {
                Notifications.info("📖 日记提示：试试在浏览器搜索「如何摆脱伪人」", 5000);
                Quest.update("📖 日记提示：试试在浏览器搜索「如何摆脱伪人」");
            };
        }
        
        var saveBtn = document.getElementById('savePredictionBtn');
        var input = document.getElementById('predictionInput');
        if (saveBtn && input) {
            saveBtn.onclick = function() {
                var text = input.value.trim();
                if (text) {
                    self._game.setPrediction(text);
                    Notifications.success("🔮 预言已记录！如果预言成真，将解锁隐藏结局", 3000);
                    Quest.update("🔮 预言已记录：" + text);
                    input.disabled = true;
                    saveBtn.disabled = true;
                    saveBtn.style.opacity = '0.5';
                } else {
                    Notifications.warning("请先写下你的预言", 2000);
                }
            };
        }
    }
};
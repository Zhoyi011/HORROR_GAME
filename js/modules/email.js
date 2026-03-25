// 邮件模块
var Email = Email || {
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
        
        // 标记邮件已读（用于结局10）
        if (this._state.emailWarningReceived && this._game && !this._game._emailsRead) {
            this._game.markEmailsRead();
        }
        
        if (!this._state.emailWarningReceived) {
            this._content.innerHTML = '<div class="empty-email">📭 暂无邮件<br><span style="font-size: 12px;">等待系统通知...</span></div>';
            return;
        }
        
        if (this._state.step === 1) {
            this._content.innerHTML = '<div class="email-item">' +
                '<strong>📩 紧急安全警告</strong><br>' +
                '<span class="warning">⚠️ 来自: security@system-alert.net</span><br>' +
                '<b>标题：您访问的招聘网站已被标记为恶意站点</b><br><br>' +
                '您刚刚应聘的职位可能涉及伪人活动，该组织已被列为高危实体。<br>' +
                '请立即断开网络连接，并关闭所有应用程序！' +
                '</div>' +
                '<div class="email-item">' +
                '<strong>📩 匿名邮件</strong><br>' +
                '有人正在尝试复制你的身份信息...<br>' +
                '你的面部数据可能已被采集。' +
                '</div>';
        } else if (this._state.step >= 2) {
            this._content.innerHTML = '<div class="email-item" style="background: #4a2a2a; color: #ffb5b5; border-left-color: #ff0000;">' +
                '<span class="warning">‼️ 入侵警报 - 最高级别 ‼️</span><br><br>' +
                '检测到异常生物信号入侵！<br>' +
                '您的电脑已被伪人网络锁定。<br>' +
                '请立即关闭所有应用程序... 但已经来不及了。' +
                '</div>' +
                '<div class="email-item" style="background: #3a2a2a;">' +
                '⚠️ 最后一条消息: 它们在屏幕里看着你...' +
                '</div>';
        }
    },
    
    sendWarning: function() {
        this._state.emailWarningReceived = true;
        this.render();
        Notifications.warning("📧 收到紧急警告邮件！请查看邮件箱", 4000);
    }
};
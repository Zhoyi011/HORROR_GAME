// 通知系统
const Notifications = {
    _container: null,
    
    init: function() {
        this._container = document.createElement('div');
        this._container.className = 'notifications-container';
        this._container.style.cssText = 'position: fixed; top: 70px; right: 20px; z-index: 10000; display: flex; flex-direction: column; gap: 10px;';
        document.body.appendChild(this._container);
    },
    
    show: function(message, type, duration) {
        type = type || 'info';
        duration = duration || 4000;
        
        var notification = document.createElement('div');
        notification.className = 'notification ' + type;
        
        var icons = { info: '📢', warning: '⚠️', error: '💀', success: '✅' };
        var icon = icons[type] || '📢';
        
        notification.innerHTML = '<div class="notification-content">' +
            '<span class="notification-icon">' + icon + '</span>' +
            '<span class="notification-text">' + message + '</span>' +
            '<button class="notification-close">✕</button>' +
            '</div>';
        
        var bgColor = type === 'error' ? 'linear-gradient(135deg, #3a1a1a, #2a0a0a)' : 
                       (type === 'warning' ? 'linear-gradient(135deg, #3a3a1a, #2a2a0a)' : 
                       (type === 'success' ? 'linear-gradient(135deg, #1a4a3a, #0a3a2a)' : 
                       'linear-gradient(135deg, #1a3a2a, #0a2a1a)'));
        var borderColor = type === 'error' ? '#ff4444' : (type === 'warning' ? '#ffaa66' : '#88ff88');
        
        notification.style.cssText = 'background: ' + bgColor + '; border-left: 4px solid ' + borderColor + '; border-radius: 12px; padding: 12px 16px; color: white; width: 300px; box-shadow: 0 4px 20px rgba(0,0,0,0.4); animation: slideInRight 0.3s ease; backdrop-filter: blur(8px);';
        
        var closeBtn = notification.querySelector('.notification-close');
        if (closeBtn) {
            closeBtn.style.cssText = 'background: none; border: none; color: ' + borderColor + '; cursor: pointer; margin-left: 12px; font-size: 14px;';
            closeBtn.onclick = function() { notification.remove(); };
        }
        
        if (this._container) {
            this._container.appendChild(notification);
        } else {
            document.body.appendChild(notification);
        }
        
        setTimeout(function() {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(function() { notification.remove(); }, 300);
        }, duration);
    },
    
    info: function(message, duration) {
        this.show(message, 'info', duration);
    },
    
    warning: function(message, duration) {
        this.show(message, 'warning', duration);
    },
    
    error: function(message, duration) {
        this.show(message, 'error', duration);
    },
    
    success: function(message, duration) {
        this.show(message, 'success', duration);
    }
};
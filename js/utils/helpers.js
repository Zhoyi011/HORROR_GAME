// 工具函数
const Helpers = {
    // 显示通知（基础函数）
    showNotification: function(message, duration, type) {
        duration = duration || 4000;
        type = type || 'info';
        var notification = document.createElement('div');
        notification.className = 'game-notification';
        notification.innerHTML = '<div class="notification-content">' +
            '<span class="notification-icon">' + (type === 'error' ? '💀' : (type === 'warning' ? '⚠️' : '📢')) + '</span>' +
            '<span class="notification-text">' + message + '</span>' +
            '<button class="notification-close">✕</button>' +
            '</div>';
        document.body.appendChild(notification);
        
        var bgColor = type === 'error' ? 'linear-gradient(135deg, #3a1a1a, #2a0a0a)' : 
                       (type === 'warning' ? 'linear-gradient(135deg, #3a3a1a, #2a2a0a)' : 
                       'linear-gradient(135deg, #1a3a2a, #0a2a1a)');
        var borderColor = type === 'error' ? '#ff4444' : (type === 'warning' ? '#ffaa66' : '#88ff88');
        
        notification.style.cssText = 'position: fixed; top: 80px; right: 20px; background: ' + bgColor + '; border-left: 4px solid ' + borderColor + '; border-radius: 12px; padding: 12px 16px; color: white; z-index: 10000; max-width: 320px; box-shadow: 0 4px 20px rgba(0,0,0,0.4); animation: slideInRight 0.3s ease; backdrop-filter: blur(8px);';
        
        var closeBtn = notification.querySelector('.notification-close');
        if (closeBtn) {
            closeBtn.style.cssText = 'background: none; border: none; color: ' + borderColor + '; cursor: pointer; margin-left: 12px; font-size: 14px;';
            closeBtn.onclick = function() { notification.remove(); };
        }
        
        setTimeout(function() {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(function() { notification.remove(); }, 300);
        }, duration);
        
        if (!document.querySelector('#notification-styles')) {
            var style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = '@keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } } @keyframes slideOutRight { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }';
            document.head.appendChild(style);
        }
    },
    
    // 随机数
    random: function(min, max) {
        return min + Math.random() * (max - min);
    },
    
    // 随机整数
    randomInt: function(min, max) {
        return Math.floor(min + Math.random() * (max - min + 1));
    },
    
    // 限制数值范围
    clamp: function(value, min, max) {
        return Math.min(max, Math.max(min, value));
    },
    
    // 保存到localStorage
    save: function(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch(e) { console.log('save error', e); }
    },
    
    // 从localStorage加载
    load: function(key, defaultValue) {
        try {
            var saved = localStorage.getItem(key);
            if (saved) {
                return JSON.parse(saved);
            }
        } catch(e) { console.log('load error', e); }
        return defaultValue;
    },
    
    // 生成随机位置
    getRandomPosition: function(winWidth, winHeight) {
        var maxLeft = window.innerWidth - winWidth - 50;
        var maxTop = window.innerHeight - winHeight - 100;
        return {
            left: this.clamp(this.randomInt(20, maxLeft), 20, maxLeft),
            top: this.clamp(this.randomInt(30, maxTop), 30, maxTop)
        };
    },
    
    // 更新时钟
    updateClock: function() {
        var d = new Date();
        var clock = document.getElementById('clock');
        if (clock) {
            clock.innerText = d.getHours().toString().padStart(2,'0') + ':' + d.getMinutes().toString().padStart(2,'0') + ':' + d.getSeconds().toString().padStart(2,'0');
        }
        return true;
    }
};
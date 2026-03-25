// 任务提示系统
const Quest = {
    _questDiv: null,
    _container: null,
    
    init: function(questDiv) {
        this._questDiv = questDiv;
        this._container = document.getElementById('questContainer');
    },
    
    update: function(message, showNotification) {
        if (this._questDiv) {
            this._questDiv.innerHTML = message;
        }
        
        if (showNotification !== false) {
            Notifications.info(message, 4000);
        }
        
        // 闪烁效果
        if (this._container) {
            this._container.style.animation = 'none';
            var self = this;
            setTimeout(function() {
                if (self._container) self._container.style.animation = 'fadeIn 0.3s';
            }, 10);
        }
    },
    
    updateWithoutNotify: function(message) {
        if (this._questDiv) {
            this._questDiv.innerHTML = message;
        }
    }
};
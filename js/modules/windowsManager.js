// 窗口管理器 - 负责所有窗口的创建、拖拽、缩放
var WindowManager = {
    _windows: {},
    _container: null,
    
    init: function(container) {
        this._container = container || document.getElementById('windows-container');
        if (!this._container) {
            this._container = document.createElement('div');
            this._container.id = 'windows-container';
            document.body.appendChild(this._container);
        }
        this.createAllWindows();
        var self = this;
        setTimeout(function() {
            self.initWindowDragAndResize();
        }, 100);
    },
    
    // 创建所有窗口
    createAllWindows: function() {
        var windows = [
            { id: 'email', title: '📧 邮件箱' },
            { id: 'browser', title: '🌐 浏览器' },
            { id: 'notepad', title: '📝 记事本' },
            { id: 'settings', title: '⚙️ Windows 设置' },
            { id: 'security', title: '🛡️ Windows 安全中心' },
            { id: 'achievements', title: '🏆 结局图鉴' },
            { id: 'news', title: '📰 紧急新闻' },
            { id: 'chat', title: '💬 家人群聊' }
        ];
        
        for (var i = 0; i < windows.length; i++) {
            var win = windows[i];
            var winElement = this.createWindow(win.id, win.title);
            this._windows[win.id] = winElement;
            if (this._container) {
                this._container.appendChild(winElement);
            } else {
                document.body.appendChild(winElement);
            }
        }
    },
    
    // 创建单个窗口
    createWindow: function(id, title) {
        var win = document.createElement('div');
        win.id = id + 'Window';
        win.className = 'window resizable hidden';
        win.setAttribute('data-win-id', id);
        
        win.innerHTML = '<div class="window-header" data-drag-handle>' +
            '<span>' + title + '</span>' +
            '<div class="window-controls">' +
            '<div class="window-btn resize-btn" title="重置大小">🗖</div>' +
            '<div class="window-btn close-win" title="关闭">✕</div>' +
            '</div>' +
            '</div>' +
            '<div class="window-content" id="' + id + 'Content"></div>' +
            '<div class="resize-handle"></div>';
        
        return win;
    },
    
    // 获取窗口
    getWindow: function(id) {
        return this._windows[id];
    },
    
    // 获取窗口内容
    getContent: function(id) {
        var win = this._windows[id];
        if (win) {
            return win.querySelector('.window-content');
        }
        return null;
    },
    
    // 打开窗口（带动画）
    open: function(id) {
        var win = this._windows[id];
        if (!win) return;
        
        if (win.classList.contains('hidden')) {
            win.classList.remove('hidden');
            
            // 设置初始动画状态
            win.style.transform = 'scale(0.95)';
            win.style.opacity = '0';
            win.style.transition = 'transform 0.2s cubic-bezier(0.2, 0.9, 0.4, 1.1), opacity 0.2s ease';
            
            // 设置位置
            if (!win.style.left || win.style.left === '' || win.style.left === 'auto') {
                var pos = Helpers.getRandomPosition(win.offsetWidth, win.offsetHeight);
                win.style.left = Math.max(20, pos.left) + 'px';
                win.style.top = Math.max(30, pos.top) + 'px';
                win.style.position = 'fixed';
            }
            
            // 播放动画
            setTimeout(function() {
                win.style.transform = 'scale(1)';
                win.style.opacity = '1';
            }, 10);
            
            win.style.zIndex = 100 + Math.floor(Math.random() * 50);
        } else {
            // 如果已打开，直接关闭
            win.classList.add('hidden');
        }
    },
    
    // 关闭窗口（带动画）
    close: function(id) {
        var win = this._windows[id];
        if (win) {
            win.style.transform = 'scale(0.95)';
            win.style.opacity = '0';
            win.style.transition = 'transform 0.15s ease, opacity 0.15s ease';
            
            setTimeout(function() {
                win.classList.add('hidden');
                win.style.transform = '';
                win.style.opacity = '';
            }, 150);
        }
    },
    
    // 关闭所有窗口
    closeAll: function() {
        for (var id in this._windows) {
            this.close(id);
        }
    },
    
    // 初始化所有窗口的拖拽和缩放
    initWindowDragAndResize: function() {
        for (var id in this._windows) {
            var win = this._windows[id];
            if (win) {
                this.makeWindowDraggable(win);
                this.makeWindowResizable(win);
            }
        }
    },
    
    // 单个窗口拖拽
    makeWindowDraggable: function(win) {
        var header = win.querySelector('.window-header');
        if (!header) return;
        
        var dragData = {
            isDragging: false,
            startX: 0,
            startY: 0,
            startLeft: 0,
            startTop: 0
        };
        
        var onMouseMove = function(e) {
            if (!dragData.isDragging) return;
            e.preventDefault();
            
            var clientX = e.clientX;
            var clientY = e.clientY;
            
            var newLeft = dragData.startLeft + (clientX - dragData.startX);
            var newTop = dragData.startTop + (clientY - dragData.startY);
            
            newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - win.offsetWidth));
            newTop = Math.max(0, Math.min(newTop, window.innerHeight - win.offsetHeight));
            
            win.style.left = newLeft + 'px';
            win.style.top = newTop + 'px';
        };
        
        var onMouseUp = function() {
            dragData.isDragging = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };
        
        var onMouseDown = function(e) {
            if (e.target.classList && (e.target.classList.contains('window-btn') || e.target.classList.contains('close-win') || e.target.classList.contains('resize-btn'))) {
                return;
            }
            
            dragData.isDragging = true;
            dragData.startX = e.clientX;
            dragData.startY = e.clientY;
            dragData.startLeft = win.offsetLeft;
            dragData.startTop = win.offsetTop;
            
            win.style.zIndex = 1000;
            
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
            
            e.preventDefault();
            e.stopPropagation();
        };
        
        var onTouchMove = function(e) {
            if (!dragData.isDragging) return;
            e.preventDefault();
            var touch = e.touches[0];
            var clientX = touch.clientX;
            var clientY = touch.clientY;
            
            var newLeft = dragData.startLeft + (clientX - dragData.startX);
            var newTop = dragData.startTop + (clientY - dragData.startY);
            
            newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - win.offsetWidth));
            newTop = Math.max(0, Math.min(newTop, window.innerHeight - win.offsetHeight));
            
            win.style.left = newLeft + 'px';
            win.style.top = newTop + 'px';
        };
        
        var onTouchEnd = function() {
            dragData.isDragging = false;
            document.removeEventListener('touchmove', onTouchMove);
            document.removeEventListener('touchend', onTouchEnd);
        };
        
        var onTouchStart = function(e) {
            if (e.target.classList && (e.target.classList.contains('window-btn') || e.target.classList.contains('close-win') || e.target.classList.contains('resize-btn'))) {
                return;
            }
            
            var touch = e.touches[0];
            dragData.isDragging = true;
            dragData.startX = touch.clientX;
            dragData.startY = touch.clientY;
            dragData.startLeft = win.offsetLeft;
            dragData.startTop = win.offsetTop;
            
            win.style.zIndex = 1000;
            
            document.addEventListener('touchmove', onTouchMove, { passive: false });
            document.addEventListener('touchend', onTouchEnd);
            
            e.preventDefault();
            e.stopPropagation();
        };
        
        header.addEventListener('mousedown', onMouseDown);
        header.addEventListener('touchstart', onTouchStart, { passive: false });
    },
    
    // 单个窗口缩放
    makeWindowResizable: function(win) {
        var handle = win.querySelector('.resize-handle');
        var resizeBtn = win.querySelector('.resize-btn');
        
        // 缩放手柄功能
        if (handle) {
            var resizeData = {
                isResizing: false,
                startX: 0,
                startY: 0,
                startWidth: 0,
                startHeight: 0
            };
            
            var onMouseMove = function(e) {
                if (!resizeData.isResizing) return;
                e.preventDefault();
                
                var clientX = e.clientX;
                var clientY = e.clientY;
                
                var newWidth = resizeData.startWidth + (clientX - resizeData.startX);
                var newHeight = resizeData.startHeight + (clientY - resizeData.startY);
                
                newWidth = Math.max(320, Math.min(newWidth, window.innerWidth - 50));
                newHeight = Math.max(280, Math.min(newHeight, window.innerHeight - 100));
                
                win.style.width = newWidth + 'px';
                win.style.height = newHeight + 'px';
            };
            
            var onMouseUp = function() {
                resizeData.isResizing = false;
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            };
            
            var onMouseDown = function(e) {
                resizeData.isResizing = true;
                resizeData.startX = e.clientX;
                resizeData.startY = e.clientY;
                resizeData.startWidth = win.offsetWidth;
                resizeData.startHeight = win.offsetHeight;
                
                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
                
                e.preventDefault();
                e.stopPropagation();
            };
            
            var onTouchMove = function(e) {
                if (!resizeData.isResizing) return;
                e.preventDefault();
                var touch = e.touches[0];
                var clientX = touch.clientX;
                var clientY = touch.clientY;
                
                var newWidth = resizeData.startWidth + (clientX - resizeData.startX);
                var newHeight = resizeData.startHeight + (clientY - resizeData.startY);
                
                newWidth = Math.max(320, Math.min(newWidth, window.innerWidth - 50));
                newHeight = Math.max(280, Math.min(newHeight, window.innerHeight - 100));
                
                win.style.width = newWidth + 'px';
                win.style.height = newHeight + 'px';
            };
            
            var onTouchEnd = function() {
                resizeData.isResizing = false;
                document.removeEventListener('touchmove', onTouchMove);
                document.removeEventListener('touchend', onTouchEnd);
            };
            
            var onTouchStart = function(e) {
                resizeData.isResizing = true;
                var touch = e.touches[0];
                resizeData.startX = touch.clientX;
                resizeData.startY = touch.clientY;
                resizeData.startWidth = win.offsetWidth;
                resizeData.startHeight = win.offsetHeight;
                
                document.addEventListener('touchmove', onTouchMove, { passive: false });
                document.addEventListener('touchend', onTouchEnd);
                
                e.preventDefault();
                e.stopPropagation();
            };
            
            handle.addEventListener('mousedown', onMouseDown);
            handle.addEventListener('touchstart', onTouchStart, { passive: false });
        }
        
        // 重置按钮功能
        if (resizeBtn) {
            var newResizeBtn = resizeBtn.cloneNode(true);
            resizeBtn.parentNode.replaceChild(newResizeBtn, resizeBtn);
            
            newResizeBtn.onclick = function(e) {
                e.stopPropagation();
                win.style.width = '600px';
                win.style.height = '450px';
                var maxLeft = window.innerWidth - 620;
                var maxTop = window.innerHeight - 500;
                var currentLeft = parseInt(win.style.left);
                var currentTop = parseInt(win.style.top);
                if (currentLeft > maxLeft) {
                    win.style.left = Math.max(20, maxLeft) + 'px';
                }
                if (currentTop > maxTop) {
                    win.style.top = Math.max(30, maxTop) + 'px';
                }
                if (isNaN(currentLeft) || currentLeft < 0) {
                    win.style.left = '20%';
                }
                if (isNaN(currentTop) || currentTop < 0) {
                    win.style.top = '15%';
                }
            };
        }
    },
    
    // 刷新所有窗口内容
    refreshContent: function(id, renderFunction) {
        var content = this.getContent(id);
        if (content && renderFunction) {
            renderFunction(content);
        }
    }
};
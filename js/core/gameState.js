// 游戏状态管理
const GameState = {
    // 游戏状态
    step: 0,
    sanity: 100,
    jumpscareTriggered: false,
    jobApplied: false,
    emailWarningReceived: false,
    currentJobData: null,
    glitchInterval: null,
    isOnline: true,
    gameEnded: false,
    currentEnding: null,
    
    // 结局系统
    unlockedEndings: [],
    totalEndings: 10,
    
    // 特殊状态
    secretSearchUnlocked: false,
    
    // 全军覆没相关
    globalDoomTriggered: false,
    newsRead: false,
    secondNewsTriggered: false,
    chatMessages: [],
    chatMessageInterval: null,
    finalDrainInterval: null,
    sanityCheckInterval: null,
    
    // 工作列表
    jobs: [
        { id: 1, title: "🌙 夜间守墓人", company: "永恒安息有限公司", salary: "月薪 25000-35000", desc: "负责夜间墓地巡逻，需要极强的心理素质。", danger: "中度", requirement: "能熬夜，不怕鬼", fakeCamera: false },
        { id: 2, title: "👤 伪人识别测试员", company: "人类身份验证局", salary: "日薪 8000", desc: "通过摄像头识别伪装成人类的异常个体。", danger: "极高", requirement: "必须开启摄像头", fakeCamera: true },
        { id: 3, title: "📀 数据清理师", company: "旧世界档案室", salary: "月薪 18000", desc: "清理被污染的数据档案。", danger: "高", requirement: "熟悉各类文件格式" },
        { id: 4, title: "🕯️ 午夜档案管理员", company: "遗忘档案库", salary: "月薪 22000", desc: "管理午夜后才能查阅的机密档案。", danger: "高", requirement: "胆大心细" },
        { id: 5, title: "👁️ 梦境监视员", company: "潜意识安全局", salary: "月薪 30000", desc: "监视人们的梦境，防止伪人入侵。", danger: "极高", requirement: "需要佩戴特殊设备" }
    ],
    
    // 获取工作
    getJob: function(id) {
        for (var i = 0; i < this.jobs.length; i++) {
            if (this.jobs[i].id === id) return this.jobs[i];
        }
        return null;
    },
    
    // 减少理智值
    reduceSanity: function(amount) {
        this.sanity = Math.max(0, this.sanity - amount);
        var fill = document.getElementById('sanityFill');
        var percent = document.getElementById('sanityPercent');
        if (fill) fill.style.width = this.sanity + '%';
        if (percent) percent.innerText = this.sanity + '%';
        return this.sanity;
    },
    
    // 增加理智值
    increaseSanity: function(amount) {
        this.sanity = Math.min(100, this.sanity + amount);
        var fill = document.getElementById('sanityFill');
        var percent = document.getElementById('sanityPercent');
        if (fill) fill.style.width = this.sanity + '%';
        if (percent) percent.innerText = this.sanity + '%';
        return this.sanity;
    },
    
    // 解锁结局
    unlockEnding: function(endingId) {
        if (this.unlockedEndings.indexOf(endingId) === -1) {
            this.unlockedEndings.push(endingId);
            this.save();
            return true;
        }
        return false;
    },
    
    // 检查结局是否解锁
    isEndingUnlocked: function(endingId) {
        return this.unlockedEndings.indexOf(endingId) !== -1;
    },
    
    // 获取解锁数量
    getUnlockedCount: function() {
        return this.unlockedEndings.length;
    },
    
    // 获取好结局解锁数量
    getGoodEndingsCount: function() {
        var count = 0;
        for (var i = 6; i <= 10; i++) {
            if (this.unlockedEndings.indexOf(i) !== -1) count++;
        }
        return count;
    },
    
    // 保存游戏
    save: function() {
        var saveData = {
            unlockedEndings: this.unlockedEndings,
            step: this.step,
            sanity: this.sanity,
            jobApplied: this.jobApplied,
            emailWarningReceived: this.emailWarningReceived
        };
        Helpers.save('pseudoGame', saveData);
        Helpers.save('pseudoEndings', this.unlockedEndings);
    },
    
    // 加载游戏
    load: function() {
        var saved = Helpers.load('pseudoGame', null);
        if (saved) {
            this.unlockedEndings = saved.unlockedEndings || [];
            this.step = saved.step || 0;
            this.sanity = saved.sanity || 100;
            this.jobApplied = saved.jobApplied || false;
            this.emailWarningReceived = saved.emailWarningReceived || false;
        }
        
        var endings = Helpers.load('pseudoEndings', []);
        if (endings.length > 0) {
            this.unlockedEndings = endings;
        }
        
        // 更新UI
        var fill = document.getElementById('sanityFill');
        var percent = document.getElementById('sanityPercent');
        if (fill) fill.style.width = this.sanity + '%';
        if (percent) percent.innerText = this.sanity + '%';
    },
    
    // 重置游戏（完全重置）
    reset: function() {
        this.step = 0;
        this.sanity = 100;
        this.jumpscareTriggered = false;
        this.jobApplied = false;
        this.emailWarningReceived = false;
        this.currentJobData = null;
        this.gameEnded = false;
        this.currentEnding = null;
        this.globalDoomTriggered = false;
        this.newsRead = false;
        this.secondNewsTriggered = false;
        this.chatMessages = [];
        this.isOnline = true;
        this.secretSearchUnlocked = false;
        
        // 清除所有定时器
        if (this.chatMessageInterval) clearInterval(this.chatMessageInterval);
        if (this.finalDrainInterval) clearInterval(this.finalDrainInterval);
        if (this.sanityCheckInterval) clearInterval(this.sanityCheckInterval);
        if (this.glitchInterval) clearInterval(this.glitchInterval);
        
        // 重置UI
        var fill = document.getElementById('sanityFill');
        var percent = document.getElementById('sanityPercent');
        if (fill) fill.style.width = '100%';
        if (percent) percent.innerText = '100%';
        
        // 重置网络UI
        if (window.Game && window.Game.updateNetworkUI) {
            window.Game.updateNetworkUI();
        }
        
        // 保存重置后的状态
        this.save();
    }
};
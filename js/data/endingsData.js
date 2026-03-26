// 结局数据定义 - 调整版
var EndingsData = {
    list: {
        1: { name: "💀 身份覆写", category: "bad", desc: "伪人完全复制了你的身份...", condition: "入侵后点击红色按钮" },
        2: { name: "🔌 断电逃生", category: "normal", desc: "你及时切断了电源...", condition: "关机" },
        3: { name: "🌐 断网避难", category: "normal", desc: "断开网络连接后，伪人失去了追踪目标...", condition: "断网后应聘" },
        4: { name: "🧬 基因侵蚀", category: "bad", desc: "你的DNA被伪人程序慢慢改写...", condition: "理智值低于30%时被入侵" },  // 改回基因侵蚀
        5: { name: "🕳️ 深渊凝视", category: "bad", desc: "你研究伪人太久了...", condition: "搜索后理智归零" },
        6: { name: "🛡️ 防火墙无敌！", category: "good", desc: "防火墙联合拦截了伪人入侵...", condition: "全防护后入侵" },
        7: { name: "✨ 驱逐仪式", category: "good", desc: "你按照古籍方法完成了驱逐仪式...", condition: "搜索古籍+全防护+执行仪式" },
        8: { name: "🏠 家庭团圆", category: "good", desc: "你及时提醒了家人...", condition: "新闻后提醒家人+打开聊天" },
        9: { name: "📖 知识就是力量", category: "good", desc: "通过研究伪人的弱点...", condition: "搜索3个以上伪人关键词" },
        10: { name: "🔍 真相大白", category: "good", desc: "你收集了所有证据...", condition: "阅读所有邮件+解锁3个好结局" },
        11: { name: "🎭 双重人格", category: "secret", desc: "你的体内觉醒了伪人意识...", condition: "理智值50%时开关防护3次" },
        12: { name: "🔮 预知未来", category: "secret", desc: "你在记事本里写下了预言...", condition: "写下预言+入侵发生" },
        13: { name: "👁️ 伪人之眼", category: "secret", desc: "你允许摄像头权限后，看到了真实的世界...", condition: "拒绝3次后第4次同意" },
        14: { name: "💻 代码真相", category: "secret", desc: "你发现整个世界都是程序代码...", condition: "搜索「世界是程序」+理智值100%" },
        15: { name: "📜 古老契约", category: "secret", desc: "伪人其实是古代封印的恶魔...", condition: "发现古籍+午夜12点执行仪式" },
        16: { name: "💀 全军覆没", category: "bad", desc: "你选择继续工作...", condition: "新闻后继续工作+打开聊天" }
    },
    
    getCategoryName: function(category) {
        var names = { bad: '💀 坏结局', normal: '📄 普通结局', good: '✨ 好结局', secret: '🔮 隐藏结局' };
        return names[category] || '结局';
    },
    
    get: function(id) { return this.list[id]; },
    getAll: function() { return this.list; },
    getTotalCount: function() { return 16; }
};
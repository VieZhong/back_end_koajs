const dialogs_total = {
    'xiaofu': [{
        id: 'vie',
        name: '旧日憾事',
        data: [
            ['你好，我是旧日憾事，很高兴认识你！', 1, new Date().valueOf() - 7200000 ],
            ['你好，我是小夫。有事找我吗？', 0, new Date().valueOf() - 7200000 * 3]
        ]
    }],
    'vie': [{
        id: 'xiaofu',
        name: '小夫',
        data: [
            ['你好，我是旧日憾事，很高兴认识你！', 0, new Date().valueOf() - 7200000],
            ['你好，我是小夫。有事找我吗？', 1, new Date().valueOf() - 7200000 * 3]
        ]
    }]
};

for (let i = 0; i < 30; i++) {
    dialogs_total['xiaofu'].push({
        id: i + 1,
        name: '张三' + i * 3,
        data: [
            ['你好，我是张三，很高兴认识你！', 1, new Date().valueOf() - 7200000 * (i + 1)],
            ['你好，我是小夫。有事找我吗？', 0, new Date().valueOf() - 7200000 * (i + 1) * 3]
        ]
    });
    dialogs_total['vie'].push({
        id: i + 1,
        name: '李四' + i * 3,
        data: [
            ['你好，我是李四，很高兴认识你！', 1, new Date().valueOf() - 6000000 * (i + 1)],
            ['你好，我是旧日憾事。有事找我吗？', 0, new Date().valueOf() - 6000000 * (i + 1) * 4]
        ]
    });
};

module.exports = dialogs_total;
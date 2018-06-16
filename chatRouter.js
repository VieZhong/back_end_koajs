const WebSocket = require('ws');
const createRouter = require('koa-bestest-router');

const dialogs_total = {
    'xiaofu': [],
    'vie': []
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
}


const router = createRouter({
    GET: {
        '/api/chat/:id/dialogs': (ctx, next) => {
            if (!ctx.session.authed) {
                return;
            }
            const id = ctx.params.id;
            if(dialogs_total[id]) {
                ctx.status = 200;
                ctx.body = dialogs_total[id];
            } else {
                ctx.status = 200;
                ctx.body = [];
            }
        }
    },
    POST: {
        '/api/chat/login': (ctx, next) => {
            const user = ctx.request.body;
            if(user.account == 'xiaofu' && user.password == '123456') {
                ctx.session.authed = true;
                ctx.status = 200;
                ctx.body = {'id': user.account, 'name': '小夫'};
                ctx.cookies.set('login', 1, {'httpOnly': false});
            } else if(user.account == 'vie' && user.password == '123456') {
                ctx.session.authed = true;
                ctx.status = 200;
                ctx.body = {'id': user.account, 'name': '旧日憾事'};
                ctx.cookies.set('login', 1, {'httpOnly': false});
            } else {
                ctx.status = 400;
            }
        },
        '/api/chat/logout': (ctx, next) => {
            ctx.session.authed = false;
            ctx.status = 200;
            ctx.cookies.set('login', 0, {'httpOnly': false});
        }
    },
    PUT: {
        
    },
    DELETE: {
        
    }
});


const wss = new WebSocket.Server({ port: 8082 });
wss.on('connection', ws => {
    ws.on('message', message => {
        const result = [];
        const { id, word, time, by } = JSON.parse(message);
        dialogs_total[by].forEach(({id: i, name, data}) => {
            if(i == id) {
                data.push([word, 0, time]);
                result.unshift({id, name, data});
            } else {
                result.push({id: i, name, data});  
            }
        });
        dialogs_total[by] = result;
    });
});


module.exports = router;
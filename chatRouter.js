// const WebSocket = require('ws');
const dialogs_total = require('./database/communication');
const createRouter = require('koa-bestest-router');

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

module.exports = router;
const createRouter = require('koa-bestest-router');

const router = createRouter({
    GET: {
        '/api/users/me': async (ctx, next) => {
            if (!ctx.session.authed) {
                ctx.body = {
                    authed: false
                }
            } else {
                ctx.body = {
                    authed: true,
                    account: 'xiaofu',
                    name: 'VieZhong'
                }
            }
        }
    },
    POST: {
        '/api/login': (ctx, next) => {
            const user = ctx.request.body;
            if(user.account == 'xiaofu' && user.password == '584662') {
                ctx.session.authed = true;
                ctx.status = 200;
                ctx.body = {'account': user.account, 'name': 'VieZhong'};
                ctx.cookies.set('login', 1, {'httpOnly': false});
            } else {
                ctx.status = 400;
            }
        },
        '/api/logout': (ctx, next) => {
            ctx.session.authed = false;
            ctx.status = 200;
            ctx.cookies.set('login', 0, {'httpOnly': false});
        }
    }
});


module.exports = router;
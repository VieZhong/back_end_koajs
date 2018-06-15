const Koa = require('koa');
const logger = require('koa-logger');
const session = require('koa-session');
const bodyParser = require('koa-bodyparser');
const serve = require('koa-better-serve');


const app = new Koa();

const userRouter = require('./userRouter.js');
const bookstoreRouter = require('./bookstoreRouter.js');
const chatRouter = require('./chatRouter.js')

app.keys = ['koajs'];

app
    .use((ctx, next) => {
        if (ctx.path === '/') {
            ctx.status = 301;
            ctx.redirect('/index.html');
            return;
        } else if (ctx.path === '/bookstore') {
            ctx.status = 301;
            ctx.redirect('/bookstore/index.html');
            return;
        } else if (ctx.path === '/blog') {
            ctx.status = 301;
            ctx.redirect('http://viezhong.github.io/blog');
            return;
        }
        return next();
    })
    .use(logger())
    .use(session({
        key: 'koa:sess',
        maxAge: 86400000
    }, app))
    .use(bodyParser({
        extendTypes: {
            form: ['text/plain']
        }
    }))
    .use(userRouter)
    .use(bookstoreRouter)
    .use(chatRouter)
    .use(serve('./apps', '/'));


app.listen(8081);
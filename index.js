const Koa = require('koa');
const logger = require('koa-logger');
const session = require('koa-session');
const bodyParser = require('koa-bodyparser');
const serve = require('koa-better-serve');


const app = new Koa();

const userRouter = require('./userRouter.js');
const bookstoreRouter = require('./bookstoreRouter.js');

app.keys = ['koajs'];

app
    .use((ctx, next) => {
        if(ctx.path === '/bookstore') {
            ctx.redirect('/bookstore/index.html');
            ctx.status = 301;
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
    .use(serve('./apps/bookstore', '/bookstore'));


app.listen(8080);
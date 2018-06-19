const fs = require('fs');
const url = require('url');
const http = require('http');
const Koa = require('koa');
const logger = require('koa-logger');
const session = require('koa-session');
const bodyParser = require('koa-bodyparser');
const serve = require('koa-better-serve');

const userRouter = require('./userRouter.js');
const bookstoreRouter = require('./bookstoreRouter.js');
const { router: chatRouter, webSocketServer: chatWSServer } = require('./chatRouter.js');

const app = new Koa();

app.keys = ['koajs'];

app
    .use((ctx, next) => {
        if (ctx.path === '/') {
            ctx.set('Content-Type', 'text/html');
            ctx.body = fs.readFileSync('apps/index.html');
            return;
        } else if (ctx.path === '/bookstore') {
            ctx.status = 301;
            ctx.redirect('/bookstore/index.html');
            return;
        } else if (['/communication', '/communication/login', '/communication/chat', '/communication/box','/communication/contact'].includes(ctx.path)) {
            ctx.set('Content-Type', 'text/html');
            ctx.body = fs.readFileSync('apps/communication/index.html');
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


const server = http.createServer(app.callback());

server.on('upgrade', (request, socket, head) => {
    if (url.parse(request.url).pathname === '/api/communication/chat') {
        chatWSServer.handleUpgrade(request, socket, head, (ws) => {
            chatWSServer.emit('connection', ws, request);
        });
    } else {
        socket.destroy();
    }
})

server.listen(80);


process.on('SIGINT', () => {
    console.info('SIGINT signal received.')

    server.close(err => {
        if (err) {
            console.error(err)
            process.exit(1)
        }
    });
})
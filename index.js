const fs = require('fs');
const url = require('url');
const http = require('http');
const WebSocket = require('ws');
const Koa = require('koa');
const logger = require('koa-logger');
const session = require('koa-session');
const bodyParser = require('koa-bodyparser');
const serve = require('koa-better-serve');

const app = new Koa();

const userRouter = require('./userRouter.js');
const bookstoreRouter = require('./bookstoreRouter.js');
const chatRouter = require('./chatRouter.js');

const dialogs_total = require('./database/communication');

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
const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', ws => {
    ws.isAlive = true;
    ws.on('pong', () => {
        ws.isAlive = true;
    });
    ws.on('message', message => {
        const { id, word, time, by, type } = JSON.parse(message);

        if(type == 'connection') {
            ws['userId'] = by;
            return;
        }

        if(type == 'message') {  
            //发信者对话
            const senderBox = [];
            dialogs_total[by] && dialogs_total[by].forEach(({id: i, name, data}) => {
                if(i == id) {
                    data.push([word, 0, time]);
                    senderBox.unshift({id, name, data});
                } else {
                    senderBox.push({id: i, name, data});  
                }
            });
            dialogs_total[by] = senderBox;

            //收信者对话
            const receiverBox = [];
            dialogs_total[id] && dialogs_total[id].forEach(({id: i, name, data}) => {
                if(i == by) {
                    data.push([word, 1, time]);
                    receiverBox.unshift({id: by, name, data});
                } else {
                    receiverBox.push({id: i, name, data});  
                }
            });
            dialogs_total[id] = receiverBox;

            wss.clients.forEach(w => {
                if (w.userId == id){
                    try {
                        w.send(message);
                    } catch(e){
                        console.log("ws send error!");
                    }
                }
            });
            return;
        }

    });
});

setInterval(() => {
    wss.clients.forEach(ws => {
        if (!ws.isAlive){
            return ws.terminate();
        }
        ws.isAlive = false;
        ws.ping(() => {});
    });
}, 60000);

server.on('upgrade', (request, socket, head) => {
    if (url.parse(request.url).pathname === '/api/communication/chat') {
        wss.handleUpgrade(request, socket, head, function done(ws) {
            wss.emit('connection', ws, request);
        });
    } else {
        socket.destroy();
    }
})

server.listen(80);
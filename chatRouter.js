const WebSocket = require('ws');
const createRouter = require('koa-bestest-router');

const dialogs_total = require('./database/communication');

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
            const { account, password } = ctx.request.body;
            if(account == 'xiaofu' && password == '123456') {
                ctx.session.authed = true;
                ctx.status = 200;
                ctx.body = {'id': account, 'name': '小夫'};
                ctx.cookies.set('login', 1, {'httpOnly': false});
            } else if(account == 'vie' && password == '123456') {
                ctx.session.authed = true;
                ctx.status = 200;
                ctx.body = {'id': account, 'name': '旧日憾事'};
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

module.exports = { router, webSocketServer: wss };
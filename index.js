var fs  = require('co-fs');
var logger = require('koa-logger');
var route = require('koa-route');
var koa = require('koa');

var app = koa();

app.use(logger());

app.use(route.get('/bookstore/index.html', function* (next) {
    this.body = yield fs.readFile('./apps/bookstore/index.html', 'utf8');
}));

app.use(route.get('/bookstore/bundle.js', function* (next) {
    this.body = yield fs.readFile('./apps/bookstore/bundle.js', 'utf8');
}));

app.listen(80);

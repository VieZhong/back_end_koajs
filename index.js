var fs = require('co-fs');
var logger = require('koa-logger');
var route = require('koa-route');
var staticServe = require('koa-static');
var koa = require('koa');

var app = koa();

app.use(logger());

app.use(staticServe('./apps/'));

app.use(route.get('/api/bookstore/books/hasRead', function* (next) {
    this.response.body = JSON.parse(yield fs.readFile('./database/bookstore/hasRead.js', 'utf8'));
}));

app.use(route.get('/api/bookstore/books/willRead', function* (next) {
    this.response.body = JSON.parse(yield fs.readFile('./database/bookstore/willRead.js', 'utf8'));
}));

app.listen(80, () => {
    console.log('listening on port 80');
});

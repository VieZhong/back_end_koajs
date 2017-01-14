var fs = require('co-fs');
var parse = require('co-body');
var logger = require('koa-logger');
var route = require('koa-route');
var staticServe = require('koa-static');
var koa = require('koa');

var app = koa();

app.use(logger());

app.use(staticServe('./apps/'));

app.use(route.get('/api/bookstore/books/hasRead', function* () {
    this.response.body = JSON.parse(yield fs.readFile('./database/bookstore/hasRead.js', 'utf8'));
}));

app.use(route.get('/api/bookstore/books/hasRead/:id', function* (id) {
    let booksList = JSON.parse(yield fs.readFile('./database/bookstore/hasRead.js', 'utf8'));
    let result = booksList.find((book) => id == book.id);
    if(!result){
        this.response.status = 404;
        this.response.body = '该书不存在！';
        return;
    }
    this.response.body = result;
}));

app.use(route.post('/api/bookstore/books/hasRead', function* () {
    let newBook =  yield parse.json(this), booksList;
    let isEmpty, isExisted;
    isEmpty = !['name', 'country', 'author'].every((key) => !!newBook[key]);
    if(isEmpty){
        this.response.status = 400;
        this.response.body = '字段均不能为空！';
        return;
    }
    booksList = JSON.parse(yield fs.readFile('./database/bookstore/hasRead.js', 'utf8'));
    isExisted = booksList.some((book) => ['name', 'country', 'author'].every((key) => newBook[key] == book[key]));
    if(isExisted){
        this.response.status = 400;
        this.response.body = '该书已存在！';
        return;
    }
    this.response.status = 200;
    newBook.id = (booksList.length + 1);
    booksList.push(newBook);
    fs.writeFile('./database/bookstore/hasRead.js', JSON.stringify(booksList), {'encoding': 'utf8'});
}));

app.use(route.put('/api/bookstore/books/hasRead/:id', function* (id) {
    let newBook =  yield parse.json(this);
    //字段为空
    let isEmpty = !['name', 'country', 'author'].every((key) => !!newBook[key]);
    if(isEmpty){
        this.response.status = 400;
        this.response.body = '字段均不能为空！';
        return;
    }
    //找不到该书
    let booksList = JSON.parse(yield fs.readFile('./database/bookstore/hasRead.js', 'utf8'));
    let result = booksList.find((book) => id == book.id);
    if(!result){
        this.response.status = 404;
        this.response.body = '该书不存在！';
        return;
    }
    //没有变化
    let noChange = ['name', 'country', 'author'].every((key) => newBook[key] == result[key]);
    if(noChange){
        this.response.body = '修改成功！';
        return;
    }
    //修改成其他已存在的书本
    let isExisted = booksList.some((book) => book.id != result.id && ['name', 'country', 'author'].every((key) => result[key] == book[key]));
    if(isExisted){
        this.response.status = 409;
        this.response.body = '该书已存在！';
        return;
    }
    //执行
    this.response.body = '修改成功！';
    ['name', 'country', 'author'].forEach((key) => {
        result[key] = newBook[key];
    });
    fs.writeFile('./database/bookstore/hasRead.js', JSON.stringify(booksList), {'encoding': 'utf8'});
}));

app.use(route.delete('/api/bookstore/books/hasRead/:id', function* (id) {
    let booksList = JSON.parse(yield fs.readFile('./database/bookstore/hasRead.js', 'utf8'));
    let result = booksList.find((book) => id == book.id);
    this.response.body = '删除成功！';
    if(!result){
        return;
    }
    booksList.sort((x, y) => x.id - y.id).splice(id - 1, 1);
    booksList.forEach((book, i) => {
        book.id = i;
    });
    fs.writeFile('./database/bookstore/hasRead.js', JSON.stringify(booksList), {'encoding': 'utf8'});
}));

app.use(route.get('/api/bookstore/books/willRead', function* () {
    this.response.body = JSON.parse(yield fs.readFile('./database/bookstore/willRead.js', 'utf8'));
}));

app.use(route.get('/api/bookstore/books/willRead/:id', function* (id) {
    let booksList = JSON.parse(yield fs.readFile('./database/bookstore/willRead.js', 'utf8'));
    let result = booksList.find((book) => id == book.id);
    if(!result){
        this.response.status = 404;
        this.response.body = '该书不存在！';
        return;
    }
    this.response.body = result;
}));

app.use(route.post('/api/bookstore/books/willRead', function* () {
    let newBook =  yield parse.json(this), booksList;
    let isEmpty, isExisted;
    isEmpty = !['name', 'country', 'author'].every((key) => !!newBook[key]);
    if(isEmpty){
        this.response.status = 400;
        this.response.body = '字段均不能为空！';
        return;
    }
    booksList = JSON.parse(yield fs.readFile('./database/bookstore/willRead.js', 'utf8'));
    isExisted = booksList.some((book) => ['name', 'country', 'author'].every((key) => newBook[key] == book[key]));
    if(isExisted){
        this.response.status = 400;
        this.response.body = '该书已存在！';
        return;
    }
    this.response.status = 200;
    newBook.id = (booksList.length + 1);
    booksList.push(newBook);
    fs.writeFile('./database/bookstore/willRead.js', JSON.stringify(booksList), {'encoding': 'utf8'});
}));

app.use(route.put('/api/bookstore/books/willRead/:id', function* (id) {
    let newBook =  yield parse.json(this);
    //字段为空
    let isEmpty = !['name', 'country', 'author'].every((key) => !!newBook[key]);
    if(isEmpty){
        this.response.status = 400;
        this.response.body = '字段均不能为空！';
        return;
    }
    //找不到该书
    let booksList = JSON.parse(yield fs.readFile('./database/bookstore/willRead.js', 'utf8'));
    let result = booksList.find((book) => id == book.id);
    if(!result){
        this.response.status = 404;
        this.response.body = '该书不存在！';
        return;
    }
    //没有变化
    let noChange = ['name', 'country', 'author'].every((key) => newBook[key] == result[key]);
    if(noChange){
        this.response.body = '修改成功！';
        return;
    }
    //修改成其他已存在的书本
    let isExisted = booksList.some((book) => book.id != result.id && ['name', 'country', 'author'].every((key) => result[key] == book[key]));
    if(isExisted){
        this.response.status = 409;
        this.response.body = '该书已存在';
        return;
    }
    //执行
    this.response.body = '修改成功！';
    ['name', 'country', 'author'].forEach((key) => {
        result[key] = newBook[key];
    });
    fs.writeFile('./database/bookstore/willRead.js', JSON.stringify(booksList), {'encoding': 'utf8'});
}));

app.use(route.delete('/api/bookstore/books/willRead/:id', function* (id) {
    let booksList = JSON.parse(yield fs.readFile('./database/bookstore/willRead.js', 'utf8'));
    let result = booksList.find((book) => id == book.id);
    this.response.body = '删除成功！';
    if(!result){
        return;
    }
    booksList.sort((x, y) => x.id - y.id).splice(id - 1, 1);
    booksList.forEach((book, i) => {
        book.id = i + 1;
    });
    fs.writeFile('./database/bookstore/willRead.js', JSON.stringify(booksList), {'encoding': 'utf8'});
}));

app.listen(80, () => {
    console.log('listening on port 80');
});

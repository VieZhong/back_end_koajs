const fs = require("await-fs");

const createRouter = require('koa-bestest-router');

const router = createRouter({
    GET: {
        '/api/bookstore/books/:db': async (ctx, next) => {
            if (!['hasRead', 'willRead'].includes(ctx.params.db)) {
                ctx.body = '请求方法不存在！';
                ctx.status = 404;
                return;
            }
            ctx.body = JSON.parse(await fs.readFile(`./database/bookstore/${ctx.params.db}.js`, 'utf8'));
        },
        '/api/bookstore/books/:db/:id': async (ctx, next) => {
            if (!['hasRead', 'willRead'].includes(ctx.params.db)) {
                ctx.body = '请求方法不存在！';
                ctx.status = 404;
                return;
            }
            const booksList = JSON.parse(await fs.readFile(`./database/bookstore/${ctx.params.db}.js`, 'utf8'));
            const result = booksList.find(book => ctx.params.id == book.id);
            if (!result) {
                ctx.status = 404;
                ctx.body = '该书不存在！';
                return;
            }
            ctx.body = result;
        }
    },
    POST: {
        '/api/bookstore/books/:db': async (ctx, next) => {
            if (!ctx.session.authed) {
                return;
            }
            if (!['hasRead', 'willRead'].includes(ctx.params.db)) {
                ctx.body = '请求方法不存在！';
                ctx.status = 404;
                return;
            }
            const newBook = ctx.request.body;
            let isEmpty, isExisted;
            isEmpty = !['name', 'country', 'author'].every((key) => !!newBook[key]);
            if (isEmpty) {
                ctx.status = 400;
                ctx.body = '字段均不能为空！';
                return;
            }
            const booksList = JSON.parse(await fs.readFile(`./database/bookstore/${ctx.params.db}.js`, 'utf8'));
            isExisted = booksList.some((book) => ['name', 'country', 'author'].every((key) => newBook[key] == book[key]));
            if (isExisted) {
                ctx.status = 400;
                ctx.body = '该书已存在！';
                return;
            }
            newBook.id = (booksList.length + 1);
            ctx.status = 200;
            ctx.body = newBook;
            booksList.push(newBook);
            fs.writeFile(`./database/bookstore/${ctx.params.db}.js`, JSON.stringify(booksList), {
                'encoding': 'utf8'
            });
        },
        '/api/bookstore/books/hasReadFromWillRead/:id': async (ctx, next) => {
            if (!ctx.session.authed) {
                return;
            }
            const willReadList = JSON.parse(await fs.readFile(`./database/bookstore/willRead.js`, 'utf8'));
            const result = willReadList.find((book) => ctx.params.id == book.id);
            if (!result) {
                ctx.body = '该书不存在！';
                ctx.status = 404;
                return;
            }
            const hasReadList = JSON.parse(await fs.readFile(`./database/bookstore/hasRead.js`, 'utf8'));
            const isExisted = hasReadList.some((book) => ['name', 'country', 'author'].every((key) => result[key] == book[key]));
            if (isExisted) {
                ctx.status = 409;
                ctx.body = '该书已存在于阅读记录！';
                return;
            }
            willReadList.sort((x, y) => x.id - y.id).splice(ctx.params.id - 1, 1);
            willReadList.forEach((book, i) => {
                book.id = i + 1;
            });
            hasReadList.push(Object.assign(result, {
                id: hasReadList.length + 1
            }));
            ctx.status = 200;
            fs.writeFile(`./database/bookstore/hasRead.js`, JSON.stringify(hasReadList), {
                'encoding': 'utf8'
            });
            fs.writeFile(`./database/bookstore/willRead.js`, JSON.stringify(willReadList), {
                'encoding': 'utf8'
            });
        }
    },
    PUT: {
        '/api/bookstore/books/:db/:id': async (ctx, next) => {
            if (!ctx.session.authed) {
                return;
            }
            if (!['hasRead', 'willRead'].includes(ctx.params.db)) {
                ctx.body = '请求方法不存在！';
                ctx.status = 404;
                return;
            }
            const newBook = ctx.request.body;
            //字段为空
            const isEmpty = !['name', 'country', 'author'].every((key) => !!newBook[key]);
            if (isEmpty) {
                ctx.status = 400;
                ctx.body = '字段均不能为空！';
                return;
            }
            //找不到该书
            const booksList = JSON.parse(await fs.readFile(`./database/bookstore/${ctx.params.db}.js`, 'utf8'));
            const result = booksList.find((book) => ctx.params.id == book.id);
            if (!result) {
                ctx.status = 404;
                ctx.body = '该书不存在！';
                return;
            }
            //没有变化
            const noChange = ['name', 'country', 'author'].every((key) => newBook[key] == result[key]);
            if (noChange) {
                ctx.body = '修改成功！';
                return;
            }
            //修改成其他已存在的书本
            const isExisted = booksList.some((book) => book.id != result.id && ['name', 'country', 'author'].every((key) => result[key] == book[key]));
            if (isExisted) {
                ctx.status = 409;
                ctx.body = '该书已存在！';
                return;
            }
            //执行
            ctx.body = '修改成功！';
            ['name', 'country', 'author'].forEach((key) => {
                result[key] = newBook[key];
            });
            fs.writeFile(`./database/bookstore/${ctx.params.db}.js`, JSON.stringify(booksList), {
                'encoding': 'utf8'
            });
        }
    },
    DELETE: {
        '/api/bookstore/books/:db/:id': async (ctx, next) => {
            if (!ctx.session.authed) {
                return;
            }
            if (!['hasRead', 'willRead'].includes(ctx.params.db)) {
                ctx.body = '请求方法不存在！';
                ctx.status = 404;
                return;
            }
            const booksList = JSON.parse(await fs.readFile(`./database/bookstore/${ctx.params.db}.js`, 'utf8'));
            const result = booksList.find((book) => ctx.params.id == book.id);
            ctx.body = '删除成功！';
            if (!result) {
                return;
            }
            booksList.sort((x, y) => x.id - y.id).splice(ctx.params.id - 1, 1);
            booksList.forEach((book, i) => {
                book.id = i + 1;
            });
            fs.writeFile(`./database/bookstore/${ctx.params.db}.js`, JSON.stringify(booksList), {
                'encoding': 'utf8'
            });
        }
    }
});


module.exports = router;
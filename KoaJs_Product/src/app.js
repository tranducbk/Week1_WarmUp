const Koa = require('koa');
const koaBody = require('koa-body').default;
const render = require('koa-ejs');
const path = require('path');
const routes = require('./routes/routes');

const app = new Koa();
const PORT = 5000;

// Cấu hình EJS
render(app, {
    root: path.join(__dirname, 'views'),
    layout: 'template',
    viewExt: 'ejs',
    cache: false,
    debug: true
});

app.use(koaBody());
app.use(routes.routes());
app.use(routes.allowedMethods());

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
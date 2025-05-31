const Koa = require('koa');
const koaBody = require('koa-body').default;
const routes = require('./routes/routes');

const app = new Koa();
const PORT = 5000;

app.use(koaBody());
app.use(routes.routes());
app.use(routes.allowedMethods());

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
import Koa from 'koa';
import json from 'koa-json';
import handleError from 'koa-onerror';
import bodyparser from 'koa-bodyparser';
import logger from 'koa-logger';
import staticCache from 'koa-static-cache';

// router
import users from './routes/users';

const app = new Koa();

handleError(app);

app.use(
  bodyparser({
    enableTypes: ['json', 'form', 'text']
  })
);
app.use(json());
app.use(logger());
app.use(staticCache(__dirname + '/public', { maxAge: 100000 }));

// logger
app.use(async (ctx, next) => {
  const start = +new Date();
  await next();
  const ms = +new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

app.use(users.routes());

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx);
});

export default app;

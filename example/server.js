const http2 = require('http2');
const koa = require('koa');
const _ = require('koa-route');
const fs = require('fs');
const altar = require('../altar');

const app = koa();

app.use(altar({
  root: 'public',
  middleware: {
    js: [altar.jsMinify],
    css: [altar.cssMinify],
    html: [altar.htmlHTTP2Send, altar.htmlMinify, altar.htmlRenderState],
  },
}));

app.use(_.get('/', function* getPeople() {
  altar.renderState(this, '/index.html', { message: 'You are on the home' });
}));

app.use(_.get('/people', function* getPeople() {
  altar.renderState(this, '/index.html', { message: 'You are on the people' });
}));

app.use(_.get('*', function* getPeople() {
  if (this.accepts('html')) {
    altar.renderState(this, '/index.html', { message: 'You are on the 404' });
  }
}));

app.use(_.get('/api/people', function* getPeople() {
  this.body = '{"a":1}';
}));

const options = {
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.crt'),
};

http2
  .createServer(options, app.callback())
  .listen(3000, (err) => {
    if (err) {
      throw new Error(err);
    }
    console.log(`Listening on port: ${3000}.`);
  });

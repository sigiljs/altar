const _ = require('koa-route');
const serve = require('koa-static');
const path = require('path');
/*
  app.use(serve('public'));
  app.use(_.get('/', function *(next) {
  var push = this.res.push('/test.css');
  push.writeHead(200);
  fs.createReadStream(path.join(__dirname, '/public/test.css')).pipe(push);
  this.body = '<head><link rel="stylesheet" type="text/css" href="test.css"><link rel="stylesheet" type="text/css" href="blah.css"></head>Serving using HTTP2!';
  yield next;
}));*/

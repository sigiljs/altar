const resolve = require('path').resolve;
const send = require('koa-send');
const path = require('path');
const fs = require('fs');

const cache = {};

function altar(options) {
  const opts = options || {};
  opts.root = resolve(options.root);
  return function* serve(next) {
    yield* next;
    if (this.method !== 'HEAD' && this.method !== 'GET') return;
    if ((this.body !== null && this.body !== undefined) || this.status !== 404) return;
    if (yield send(this, this.path, opts)) return;
    if (this.altar) {
      const middleware = opts.middleware[path.extname(this.altar.path).substr(1)];
      if (middleware) {
        let cachedText = cache[this.altar.path];
        if (!cachedText) {
          cachedText = cache[this.altar.path] = fs.readFileSync(path.join(opts.root, this.altar.path), 'utf8');
        }
        this.body = cachedText;
        for (let i = 0; i < middleware.length; i += 1) {
          middleware[i](this, opts);
        }
      } else {
        yield send(this, this.altar.path, opts);
      }
    }
  };
}

altar.jsMinify = function () {
  // TODO - minify and cache
};

altar.cssMinify = function () {
  // TODO - minify and cache
};

altar.htmlHTTP2Send = function (context, opts) {
  const links = context.body.match(/<link[^>]*>/g);
  for (let i = 0; i < links.length; i += 1) {
    if (links[i].indexOf('rel="preload"') !== -1) {
      const resourcePath = /href="([^"]*)"/.exec(links[i])[1];
      console.log(`HTTP2 sending ${resourcePath}`);
      const push = context.res.push(resourcePath);
      push.writeHead(200);
      fs.createReadStream(path.join(opts.root, resourcePath)).pipe(push);
    }
  }
};

altar.htmlMinify = function () {
  // TODO - minify and cache
};

altar.htmlRenderState = function (context) {
  // TODO - come up with a more standard way to replace
  context.body = context.body.replace('{{STATE}}', JSON.stringify(context.altar.data));
};

altar.renderState = function (context, path, data) {
  context.altar = {
    path,
    data,
  };
};

module.exports = altar;

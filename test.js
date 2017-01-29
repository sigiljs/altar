const http2 = require('http2');
const koa = require('koa');
const _ = require('koa-route');
const fs = require('fs');
const altar = require('./altar');

const app = koa();


async function rootRouteHandler() {
  console.log('handling root');
}

async function peopleRouteHandler() {
  console.log('handling people');
}

async function getPeople() {
  console.log('handling people retrieval');
}

app.use(altar({
  staticFiles: 'public',
  rootElement: 'app-component',
  bundles: {
    default: 'appBundle.html',
    person: 'personBundle.html',
  },
  routes: [
    {
      path: '/',
      handler: rootRouteHandler,
    },
    {
      path: '/people',
      bundles: 'person',
      handler: peopleRouteHandler,
    },
    {
      path: '*',
      handler: altar.redirect('/'),
    },
  ],
}));

app.use(_.get('/api/people', function* (next) {
  /* var result = await getPeople();*/
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

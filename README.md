

#Altar

A library for transforming and multiplexing file requests from the server using HTTP/2

Altar knows what files to Server Push by analyzing HTML requests for ```<link rel="preload" ... >``` as per the W3C spec https://www.w3.org/TR/preload/

You can define other transformer middleware that will transform and cache files into more efficient forms for delivery:

public/index.html
```html
<html>
<head>
  <!-- a flag for signalling to the backend to HTTP/2 server push this when this file is requested -->
  <link rel="preload" href="/app.css" as="style">
  <link rel="stylesheet" type="text/css" href="/app.css">
</head>
<body>
  Hello World
</body>
<script>
//State is dynamically injected depending on the route
var state = {{STATE}};
console.log(state.message);
</script>
</html>
```

```javascript
...
const app = koa();

//Define static files location and middleware
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
...

```

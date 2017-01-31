importScripts('https://cdn.rawgit.com/sigiljs/trapezoid/master/trapezoid.min.js');

const app = trapezoid();

app.precache('/');
app.precache('/app.css');

app.run('helloworld-v1');

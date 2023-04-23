const express = require("express");
const app = express();
const morgan = require('morgan');
const PORT = 1337;
const data = require('./postBank')
app.use(morgan('dev'));
app.use(express.static('public'));

app.get("/", (req, res, next) => {
  try {
    const posts = data.list();
    const html = `<!DOCTYPE html>
    <html>
    <head>
      <title>Wizard news</title>
      <link rel="stylesheet" href="/style.css" />
    </head>
    <body>
      <div class="news-list">
         <header><img src="/logo.png"/>Wizard News</header>
         ${posts.map(post => `
            <div class="news-item">
              <p>
                  <span class="news-position">${post.id}. ▲</span>
                  <a href="/posts/${post.id}">${post.title}</a>
                  <small>(by ${post.name})</small>
              </p>
                  <small class="news-info">
                  ${post.upvotes} upvotes | ${post.date}
                  </small>
              </div>
            </div>`
     ).join('')}
    </body>
    </html>`;
    res.send(html)
  } catch (error) {
    next(error)
  }
});

app.get("/posts/:id", (req, res, next) => {
  try {
    if(!post.id) {
      next({
      name: 'Page not found',
      message: 'Sorry that id was not found',
      status: 404
      })
    } else {

      const id = req.params.id;
      const post = data.find(id);
      const singlePosthtml = `<!DOCTYPE html>
      <html>
      <head>
      <title>Wizard news</title>
      <link rel="stylesheet" href="/style.css" />
      </head>
      <body>
      <div class="news-list">
      <header><img src="/logo.png"/>Wizard News</header>
      <div class="news-item">
      <p>
      <span>${post.title}</span>
      <small>(by ${post.name})</small>
      </p>
      <p>
      <p>${post.content}</p>
      </p>
      </div>
      </div>
      </body>
      </html>`;
      res.send(singlePosthtml)
    }
  } catch (error) {
    next(error)
  }
});

app.use((req, res, next) => {
  res.status(404).res.send('That didnt work!')
})

app.use((err, req, res, next) => {
  if(res.status < 500){
    res.status(err.status).send({
      succes: false, 
      error: err,
      data: null
    })
  } console.error(err.stack);
  res.send('Oops something broke')
})

app.listen(PORT, () => {
  console.log(`App listening in port ${PORT}`);
});

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function (request, response) {
  const rootDir = __dirname.replace('/server', '');
  response.sendFile(`${rootDir}/src/index.html`);
});

// ==============
// DB MODEL LOGIC
// ==============
const DataAccessObject = require('./dataAccessObject');
const Comment = require('./comment');

const dataAccessObject = new DataAccessObject('./database.sqlite3');
const comment = new Comment(dataAccessObject);

comment.createTable().catch(error => {
  console.log(`Error: ${JSON.stringify(error)}`);
});

// ==============
// COMMENT ROUTES
// ==============
app.post('/createComment', function (request, response) {
  const { body } = request;
  comment.createComment(body).then(result => {
    response.send(result);
  });
});

app.get('/getComment', function (request, response) {
  const { body } = request;
  const { id } = body;
  comment.getComment(id).then(result => {
    response.send(result);
  });
});

app.get('/getComments', function (request, response) {
  comment.getComments().then(result => {
    response.send(result);
  });
});

app.delete('/deleteComments', function (request, response) {
  comment.deleteComments().then(result => {
    response.send(result);
  });
});

// =================
// SOCKET CONNECTION
// =================
let server = app.listen(port, () => console.log(`Listening on port ${port}`));
let io = require('socket.io').listen(server);

io.on('connection', (socket) => {
  socket.on('COMMENT_CREATED', (msg) => {
    io.emit('COMMENT_CREATED', msg)
  })
});

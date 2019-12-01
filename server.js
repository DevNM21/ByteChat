const express = require('express');
const helmet = require('helmet')
const socketio = require('socket.io');
const bodyparser = require('body-parser');
const session = require("express-session");
const ejs = require('ejs')
const app = express();
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

localLink = "mongodb://localhost:27017/CG2"
const mongoose = require('mongoose');
mongoose.connect(localLink, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.set('useCreateIndex', true);

app.use(session({
    secret: process.env.SESSIONSECRET || 'areallyreallyverycomplexsecret',
    resave: true,
    saveUninitialized: true,
  }))
  

const expressServer = app.listen(8080);
const io = socketio(expressServer);
app.use(helmet());

console.log("Express and socketio are listening on port 8080");

module.exports = {
    app,
    io
}

require('./sockets/main')
require('./router/app')


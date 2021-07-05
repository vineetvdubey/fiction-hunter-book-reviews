const express = require('express');
const path = require('path');
const genuuid = require('uuid').v4;
const session = require('express-session');
const MongoStore = require('connect-mongo');

const db = require('./server/db');
const api = require('./server/api');

require('dotenv').config();

const app = express();

db.connect(process.env.MONGODB_URI).then(() => {
  app.use(
    '/api',
    session({
      genid() {
        return genuuid();
      },
      store: new MongoStore({ client: db.getClient() }),
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
      cookie: {
        maxAge: parseInt(process.env.SESSION_MAX_AGE, 10),
      },
    }),
    api,
  );

  app.use(express.static('public'));
  app.use(express.static(path.join(__dirname, 'client', 'build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
  });

  app.listen(process.env.PORT);
});

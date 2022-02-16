const {reset, run} = require('./vm');
const uuid = require('./util/uuid');
const session = require('express-session');
const express = require('express');

require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3030;
const sessionName = uuid();

app.use(session({
  resave: false,
  saveUninitialized: true,
  genid: () => uuid(),
  secret: process.env.SECRET,
  cookie: {
    maxAge: 100000,
  },
  name: sessionName,
}))

app.use(express.json());

app.use((req, res, next) => {
  res.header({
  'Access-Control-Allow-Credentials': true,
  'Access-Control-Request-Method': 'POST',
  "Access-Control-Allow-Headers": 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  'Access-Control-Allow-Origin': `${process.env.CLIENT}`,
  })
  next();
})

app.post('/api', reset, (req, res, next) => {
  console.log(req.session.cookie, req.session.id);
  next();
}, run);

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
})

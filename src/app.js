require('dotenv').config();
const {run} = require('./vm');
const uuid = require('./util/uuid');
const session = require('express-session');
const express = require('express');
const dbConfig = require('./db/config/db.config');
console.log(dbConfig.url)

const app = express();
const PORT = process.env.PORT || 3030;
const sessionName = uuid();

const postRouter = express.Router();

const sessionConfig = {
  resave: false,
  saveUninitialized: true,
  genid: () => uuid(),
  secret: process.env.SECRET,
  cookie: {
    maxAge: 100000,
  },
  name: sessionName,
}

postRouter.use(express.json());
postRouter.use((req, res, next) => {
  res.header({
  'Access-Control-Allow-Credentials': true,
  'Access-Control-Request-Method': 'POST',
  'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  'Access-Control-Allow-Origin': `${process.env.CLIENT}`,
  })
  next();
})
postRouter.post('/', run);

app.use(session(sessionConfig));
app.use('/api', postRouter);

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
})

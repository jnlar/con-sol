require('dotenv').config();
const {run} = require('./vm');
const uuid = require('./util/uuid');
const session = require('express-session');
const express = require('express');
const compression = require('compression');

const app = express();
const PORT = process.env.PORT || 3030;

const postRouter = express.Router();

const sessionConfig = {
  resave: false,
  saveUninitialized: true,
  genid: () => uuid(),
  secret: process.env.SECRET,
  cookie: {},
  name: uuid(),
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

app.use(compression());
app.use(session(sessionConfig));
app.use('/api', postRouter);

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
})

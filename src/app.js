const run = require('./vm');
const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 3030;

app.use(express.json());

app.use((req, res, next) => {
  res.header({
  'Access-Control-Request-Method': 'POST',
  "Access-Control-Allow-Headers": 'Origin, X-Requested-With, Content-Type, Accept',
  'Access-Control-Allow-Origin': `${process.env.CLIENT}`,
  })
  next();
})

// TODO:
// - Reset sandbox on page reload? this should be done on pageload in the front-end
app.post('/api', run);

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
})

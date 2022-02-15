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
// - return an indication that an error happened, so we can style 
//   the output color for the console.
// 1. middleware that runs the vm.run(), send json to next
//    with different shape if it's an error
// 2. endpoint that 
app.post('/api', run);

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
})

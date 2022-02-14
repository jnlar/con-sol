const express = require('express');
const app = express();
require('dotenv').config();
const {VM} = require('vm2');

const ext = {}
const vm = new VM({
  console: 'inherit',
  sandbox: {
    ext
  },
  require: {
    external: true,
    root: './'
  }
});

const PORT = process.env.PORT || 3030;

// TODO:
// - Error handling
// - Allow variable redecleration
// - Reset sandbox on page reload? this should be done on pageload in the front-end
const run = (run) => vm.run(run, 'vm.js');

app.use(express.json());
app.use((req, res, next) => {
  res.header({
  'Access-Control-Request-Method': 'POST',
  "Access-Control-Allow-Headers": 'Origin, X-Requested-With, Content-Type, Accept',
  'Access-Control-Allow-Origin': `${process.env.CLIENT}`,
  })
  next();
})

app.post('/api', (req, res) => {
  const execReq = run(req.body.run);
  res.json({ result: execReq });
})

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
})

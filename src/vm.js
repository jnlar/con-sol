const {VM} = require('vm2');

const vm = new VM({
  console: 'inherit',
  sandbox: {
    ext: {}
  },
  require: {
    external: true,
    root: './'
  }
});

const run = (req, res) => {
  try {
    return res.send({result: vm.run(req.body.run, 'vm.js')});
  } catch(err) {
    console.log(new Date().toISOString() + ': Error');
    console.log(err);
    return res.send({error: err.toString()});
  }
}

module.exports = run;

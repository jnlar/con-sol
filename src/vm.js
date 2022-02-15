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

// TODO:
// - Reset sandbox on page reload? this should be done on pageload in the front-end
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

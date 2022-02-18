const {VM} = require('vm2');

let vm;

const create = () => {
  return new VM({
    console: 'inherit',
    eval: false,
    sandbox: {
      ext: {}
    },
    require: {
      external: true,
      root: './'
    }
  })
}

// TODO: reset VM (for when we actually have a store for each sessions window object)
const reset = (req, res, next) => {
  console.log(new Date().toISOString() + ': Resetting VM for session ' + `[${req.session.id}]`);
  // for now, we're just creating a new VM for every page reload
  vm = create();
  return res.status(200);
}

const run = (req, res) => {
  try {
    const execute = vm.run(req.body.run, 'vm.js');
    console.log(execute)
    return res.send({result: execute});
  } catch(err) {
    console.log(err.stack)
    return res.send({error: err.toString()});
  }
}

module.exports = {
  run,
  reset,
};

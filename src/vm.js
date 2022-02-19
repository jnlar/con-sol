const {VM} = require('vm2');
const {insert, hasSession} = require('./db/db');
const dbConfig = require ('./db/config/db.config')
const vms = [];
// REMOVEME
let vm;

function create() {
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

// TODO: implement as getter so we can get the current 
// vm that's binded to the session
function getVm(vms) {}

// REMOVEME
vm = create();

async function run(req, res) {
  let execute; 

  try {
    let hasSessionBool = await hasSession(dbConfig.url, req.session.id);

    if (!hasSessionBool) {
      insert(dbConfig.url, {session: req.session.id});
      vms.push({session: req.session.id, vm: create()})
      // FIXME: this isn't going to work as multiple clients
      // can fire off a new session, but we're still going to get the first vm
      execute = vms[0].vm.run(req.body.run, 'vm.js');
      return res.send({result: execute});
    } else {
      // FIXME: use a getter to refer to the vm assosciated with the current session
      execute = vm.run(req.body.run, 'vm.js');
      return res.send({result: execute});
    }

  } catch(err) {
    console.log(err.stack)
    return res.send({error: err.toString()});
  }
}

module.exports = {
  run,
};

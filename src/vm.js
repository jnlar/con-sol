const {VM} = require('vm2');
const {hasSession} = require('./db/db');
const dbConfig = require ('./db/config/db.config')
const vms = new Map();

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

function execute(currentSession, vms, req) {
  return vms.get(currentSession).vm.run(req.body.run, 'vm.js');
}

async function run(req, res) {
  let currentSession = req.session.id.replace(/\-/gm, '');
  console.log(req.session.id);
  console.log(req.body.run);
  console.log(vms);
  
  try {
    let hasSessionBool = await hasSession(dbConfig.url, req.session.id);
    console.log(hasSessionBool);

    if (!hasSessionBool) {
      vms.set(currentSession, {vm: create()});
      return res.send({result: execute(currentSession, vms, req)});
    } else {
      return res.send({result: execute(currentSession, vms, req)});
    }
  } catch(err) {
    console.log(err.stack)
    return res.send({error: err.toString()});
  } 
}

module.exports = {
  run,
};

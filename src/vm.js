const {VM} = require('vm2');
const {insert, hasSession} = require('./db/db');
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

  try {
    let hasSessionBool = await hasSession(dbConfig.url, req.session.id);

    if (!hasSessionBool) {
      insert(dbConfig.url, {session: req.session.id});
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

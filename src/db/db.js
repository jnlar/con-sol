const {MongoClient} = require('mongodb');

async function hasSession(url, id) {
  const client = new MongoClient(url);
  try {
    await client.connect();

    const db = client.db('windowObjects');
    const session = db.collection('session');

    const res = await session.findOne({session: id}, {
      projection: {_id: 0, session: 1}
    })

    return res === null ? false : true;
  } catch {
    console.error;
  } finally {
    await client.close();
  }
}

async function insert(url, vm) {
  const client =  new MongoClient(url);

  try {
    await client.connect();

    const db = client.db('windowObjects');
    const session = db.collection('session');

    return await session.insertOne(vm);
  } catch {
    console.error;
  } finally {
    await client.close();
  }
}

module.exports = {
  insert,
  hasSession,
};

const {MongoClient} = require('mongodb');

const con = url => new MongoClient(url);

async function hasSession(url, id) {
  const client = con(url);

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

async function insert(url, currentSession) {
  const client = con(url);

  try {
    await client.connect();

    const db = client.db('windowObjects');
    const session = db.collection('session');

    return await session.insertOne(currentSession);
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

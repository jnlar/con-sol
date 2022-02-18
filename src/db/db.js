const {MongoClient} = require('mongodb');

function main(url) {
  const client = new MongoClient(url);

  return async (req, res, next) => {
    try {
      await client.connect();

      await client.db('admin').command({ping: 1});
      console.log('Connected to database...');
    } finally {
      await client.close();
    }

    next();
  }
}

module.exports = main;

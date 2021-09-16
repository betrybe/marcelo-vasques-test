const { MongoClient } = require('mongodb');

const url = process.env.MONGO_DB_URL || 'mongodb://localhost:27017/Cookmaster';
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

const databaseName = process.env.DB_NAME || 'Cookmaster';
const collection = async (col) => {
  // eslint-disable-next-line no-underscore-dangle
  if (client._eventsCount === 0) {
    await client.connect();
  }
  const db = client.db(databaseName);
  const collectDb = db.collection(col);
  return collectDb;
};

module.exports = collection;
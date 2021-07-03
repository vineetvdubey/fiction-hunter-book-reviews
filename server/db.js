const mongoose = require('mongoose');

const connect = (mongoUri) => {
  try {
    return mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`Error connecting to MongoDB: ${err}`);
    throw err;
  }
};

const getClient = () => mongoose.connection.getClient();

module.exports = {
  connect,
  getClient,
};

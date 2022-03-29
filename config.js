require('dotenv').config();
const firebaseConfig = require('./db/firebase/firebase.config.json');

module.exports = {
  ENV: {
    PORT: process.env.PORT || 8080,
    PERS: process.env.PERS || 'mongo', // Puede cambiar entre [ firebase, mongo, file, memory ]
  },
  DB_CONFIG: {
    mongodb: {
      uri: process.env.URI_MONGODB
    },
    firebase: {
      credential: firebaseConfig,
    }
  }
}
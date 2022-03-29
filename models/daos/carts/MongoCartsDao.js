const { Schema } = require('mongoose');
const MongoContainer = require('../../containers/MongoContainer');

const cartsSchema = new Schema({
  id: { type: Number, min: 0, required: true, unique: true },
  timestamp: { type: String },
  products: [{ type: Object }],
});

class MongoCartsDao extends MongoContainer {
  constructor() {
    super('carts', cartsSchema);
  }
}

module.exports = MongoCartsDao;
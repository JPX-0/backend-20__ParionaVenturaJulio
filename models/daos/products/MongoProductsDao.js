const { Schema } = require('mongoose');
const MongoContainer = require('../../containers/MongoContainer');

const productsSchema = new Schema({
  id: { type: Number, min: 0, required: true, unique: true },
  name: { type: String },
  description: { type: String },
  photo: { type: String },
  price: { type: Number, min: 0 },
  stock: { type: Number, min: 0 },
  timestamp: { type: String }
});

class MongoProductsDao extends MongoContainer {
  constructor() {
    super('products', productsSchema);
  }
}

module.exports = MongoProductsDao;

const { Schema } = require('mongoose');
const MongoContainer = require('../../containers/MongoContainer');

const collection = 'products';

const productsSchema = new Schema({
  id: { type: Number, min: 0, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String },
  photo: { type: String },
  price: { type: Number, min: 0, required: true },
  stock: { type: Number, min: 0, required: true },
  timestamp: { type: String }
});

class MongoProductsDao extends MongoContainer {
  constructor() {
    super(collection, productsSchema);
  }
}

module.exports = MongoProductsDao;

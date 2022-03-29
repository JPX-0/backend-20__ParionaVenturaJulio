const mongoose = require('mongoose');
const moment = require('moment');
const { DB_CONFIG } = require('../../config');

let count = 0;
class MongoContainer {
  constructor(collection, schema) {
    if(!count) { // Una vez inicializado la coneccion no volvera a llamarse.
      this.connect().then(() => console.log('Database connected!'));
    }
    count++;
    this.model = mongoose.model(collection, schema);
  }

  async connect() {
    await mongoose.connect(DB_CONFIG.mongodb.uri);
  }

  async generateID() { // Genera un ID único ascendente
    const docRef = await this.getAll();
    const findId = docRef.map(document => document.id);
    let newId;
    if(findId.length == 0) newId = 1;
    else newId = Math.max.apply(null, findId) + 1;
    return newId;
  }

  async getAll() {
    const documents = await this.model.find({}, { _id: 0, __v: 0 }).lean();
    return documents;
  }

  async getById(id) {
    const document = await this.model.findOne({ id }, { _id: 0, __v: 0 });
    return document;
  }

  async save(payload) {
    if(!payload.id) { // si el ID no existe crea uno nuevo.
      payload.id = await this.generateID();
      payload.timestamp = `${moment().format('L')} ${moment().format('LTS')}`;
    }
    const docRef = new this.model(payload);
    await docRef.save();
  }

  async updateById(id, payload) {
    const updatedDocument = await this.model.updateOne({ id }, { $set: { ...payload } });
    return updatedDocument;
  }

  async deleteById(id) {
    return await this.model.deleteOne({ id });
  }
}

module.exports = MongoContainer;
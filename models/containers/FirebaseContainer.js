const admin = require("firebase-admin");
const moment = require('moment');
const { getFirestore } = require("firebase-admin/firestore");
const { DB_CONFIG } = require("../../config");

let count = 0;
class FirebaseContainer {
  constructor(coll) {
    this.connect();
    const db = getFirestore();
    this.query = db.collection(coll);
  }

  connect() {
    if(!count) { // Una vez inicializado la coneccion no volvera a llamarse.
      admin.initializeApp({
        credential: admin.credential.cert(DB_CONFIG.firebase.credential)
      });
      console.log("Connected to Firestore!");
    }
    count++;
  }

  async generateID() { // Genera un ID único ascendente
    const docRef = await this.query.get();
    const documents = docRef.docs;
    const findId = documents.map(document => document.id);
    let newId;
    if(findId.length == 0) newId = 1;
    else newId = Math.max.apply(null, findId) + 1;
    return newId;
  }

  async getAll() { // Obtiene tdos los datos
    const docRef = await this.query.get();
    const documents = docRef.docs;
    return documents.map(document => ({ 
      id: document.id,
      ...document.data()
    }))
  }

  async getById(id) { // Obtiene un dato que coincida el ID
    const docRef = this.query.doc(`${id}`);
    const document = await docRef.get();
    return document.data();
  }

  async save(payload) {
    let docRef
    if(payload.id) { // Regresa el dato a su estado incial.
      docRef = this.query.doc(`${payload.id}`);
    } else { // Guarda un nuevo dato.
      docRef = this.query.doc(`${await this.generateID()}`);
      payload.id = await this.generateID();
      payload.timestamp = `${moment().format('L')} ${moment().format('LTS')}`;
    }
    await docRef.set(payload);
  }

  async updateById(id, payload) { // Actualiza un dato que coincida su ID.
    const docRef = this.query.doc(`${id}`);
    await docRef.update(payload);
  }

  async deleteById(id) { // Elimina un dato que coincida su ID.
    const docRef = this.query.doc(`${id}`);
    await docRef.delete();
  }
}

module.exports = FirebaseContainer;
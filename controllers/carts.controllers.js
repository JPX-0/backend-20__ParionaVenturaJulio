const { CartsDao } = require('../models/daos/index');
const { productsDao } = require('./products.controllers');

const cartsDao = new CartsDao();

const getAllCarts = async (req, res, next) => {
  try {
    const carts = await cartsDao.getAll();
    res.status(200).json({ success: true, result: carts });
  } 
  catch(error) { next(error); }
};

const getCartById = async (req, res, next) => {
  const { id } = req.params;
  try {
    if(isNaN(+id)) return res.status(400).json({ success: false, error: `The ID must be a valid number` });
    const carts = await cartsDao.getById(id);
    if(!carts) return res.status(404).json({ success: false, error: `Cart ${id} not found` });
    res.status(200).json({ success: true, result: carts });
  } 
  catch(error) { next(error); }
};

const createCart = async (req, res, next) => {
  const { id_prod } = req.body;
  try {
    if(!id_prod || id_prod.length === 0 || !Array.isArray(id_prod)) return res.status(400).json({ success: false, error: `Wrong body format` });
    let productFound = [];
    for (let i = 0; i < id_prod.length; i++) { // Recorre y verifica los IDs.
      const requestedProduct = +id_prod[i];
      if(isNaN(requestedProduct)) return res.status(400).json({ success: false, error: `The [${id_prod[i]}] must be a valid number` });
      const productFind = await productsDao.getById(+id_prod[i]);
      if(!productFind) return res.status(404).json({ success: false, error: `Product ${id_prod[i]} not found` });
      productFound.push(productFind);
    }
    await cartsDao.save({ products: productFound }); // Crea un carrito nuevo.

    for (let i = 0; i < id_prod.length; i++) {
      let id = +id_prod[i];
      await productsDao.save({ id });
    }
    res.status(200).json({ success: true, result: "Cart created successfully" });
  }
  catch(error) { next(error); }
};


const addProductToCart = async (req, res, next) => {
  const { params: { id }, body: { id_prod } } = req;
  try {
    if(isNaN(+id)) return res.status(400).json({ success: false, error: `The ID must be a valid number` });
    const cartFound = await cartsDao.getById(id);
    if(!cartFound) return res.status(404).json({ success: false, error: `Cart ${id_prod[i]} not found` });
    if(!id_prod || id_prod.length === 0 || !Array.isArray(id_prod)) return res.status(400).json({ success: false, error: `Wrong body format` });
    let productFound = [];
    for (let i = 0; i < id_prod.length; i++) { // Recorre y verifica los IDs.
      const requestedProduct = +id_prod[i];
      if(isNaN(requestedProduct)) return res.status(400).json({ success: false, error: `The [${id_prod[i]}] must be a valid number` });
      const productFind = await productsDao.getById(+id_prod[i]);
      if(!productFind) return res.status(404).json({ success: false, error: `Product ${id_prod[i]} not found` });
      productFound.push(productFind);
    }
    const productsUpated = [...cartFound.products, ...productFound];
    await cartsDao.updateById(id, { products: productsUpated }); // Agrega un producto al carrito.

    // ↓↓↓ Elimina el producto manteniendo solo su ID para regresarlo a su estado inicial cuando se estime conveniente.
    for (let i = 0; i < id_prod.length; i++) await productsDao.save({ id: +id_prod[i] });
    // ↑↑↑

    res.status(200).json({ success: true, result: "Cart created successfully" });
  }
  catch(error) { next(error); }
};

const updateProductInCart = async (req, res, next) => {
  const { params: { id, id_prod }, body: { name, description, photo, price, stock } } = req;
  try {
    if(isNaN(+id) || isNaN(+id_prod)) return res.status(400).json({ success: false, error: `The ID must be a valid number` });
    const cartFound = await cartsDao.getById(id);
    if(!cartFound) return res.status(404).json({ success: false, error: `Cart ${id_prod} not found` });
    const productFind = cartFound.products.findIndex(e => e.id == +id_prod);
    if(productFind < 0) return res.status(404).json({ success: false, error: `Product ${id_prod} not found` });
    const productFound = cartFound.products.find(e => e.id == +id_prod);
    if(name || description || photo || !isNaN(+price) || !isNaN(+stock)) {
      cartFound.products[productFind] = { ...productFound, ...req.body };
      await cartsDao.updateById(id, cartFound); // Actualiza un producto perteneciente al carrito
      res.status(200).json({ success: true, result: "Cart upated successfully" });
    } else return res.status(400).json({ success: false, error: `Wrong body format` });
  }
  catch(error) { next(error); }
};

const deleteCartById = async (req, res, next) => {
  const { id } = req.params;
  try {
    if(isNaN(+id)) return res.status(400).json({ success: false, error: `The ID must be a valid number` });
    const cartFound = await cartsDao.getById(id);
    if(!cartFound) return res.status(404).json({ success: false, error: `Cart ${id} not found` });
    for (let i = 0; i < cartFound.products.length; i++) await productsDao.updateById(cartFound.products[i].id, cartFound.products[i]);
    await cartsDao.deleteById(id); // Elimina un carrito.
    res.json({ success: true, result: "Cart removed successfully" });
  }
  catch(error) { next(error); }
};

const removeProductToCart = async (req, res, next) => {
  const { id, id_prod } = req.params;
  try {
    if(isNaN(+id) || isNaN(+id_prod)) return res.status(400).json({ success: false, error: `The ID must be a valid number` });
    const cartFound = await cartsDao.getById(id);
    if(!cartFound) return res.status(404).json({ success: false, error: `Cart ${id_prod} not found` });
    const productFind = cartFound.products.findIndex(e => e.id == +id_prod);
    if(productFind < 0) return res.status(404).json({ success: false, error: `Product ${id_prod} not found` });
    const productFound = cartFound.products.find(e => e.id == +id_prod);
    cartFound.products.splice(productFind, 1);
    await cartsDao.updateById(id, cartFound); // Elimina un producto perteneciente al carrito 
    await productsDao.updateById(id_prod, productFound); // Regresa el producto eliminado a su estado inicial.
    res.json({ success: true, result: "Product removed successfully" });
  }
  catch(error) { next(error); }
};

module.exports = {
  getAllCarts,
  getCartById,
  createCart,
  deleteCartById,
  addProductToCart,
  updateProductInCart,
  removeProductToCart
}
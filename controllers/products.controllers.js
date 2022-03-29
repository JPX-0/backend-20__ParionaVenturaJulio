const { ProductsDao } = require('../models/daos/index');

const productsDao = new ProductsDao();

const ee = data => { // Empty Entry -- Verifica si el dato registrado está vacio.
  if(data) return data.length == 0;
  else if(!data) return true;
} 

const getAllProducts = async (req, res, next) => {
  try {
    const products = await productsDao.getAll();
    res.status(200).json({ success: true, result: products });
  } 
  catch(error) { next(error); }
};

const getProductById = async (req, res, next) => {
  const { id } = req.params;
  try {
    if(isNaN(+id)) return res.status(400).json({ success: false, error: `The ID must be a valid number` });
    const product = await productsDao.getById(id);
    if(!product) return res.status(404).json({ success: false, error: `Product ${id} not found` });
    else res.status(200).json({ success: true, result: product });
  } 
  catch(error) { next(error); }
};

const createProduct = async (req, res, next) => {
  const { name, description, photo, price, stock } = req.body;
  try {
    if(ee(name) || ee(description) || ee(photo) || ee(price) || +stock < 0) return res.status(400).json({ success: false, error: `Wrong body format` });
    if(isNaN(price) || isNaN(stock)) return res.status(400).json({ success: false, error: `The ${isNaN(price) ? "price" : (isNaN(stock) && "stock")} must be a valid number` });
    req.body.price = +price;
    req.body.stock = +stock;
    await productsDao.save(req.body); // Crea un producto nuevo.
    res.status(200).json({ success: true, result: "Product created successfully" });
  }
  catch(error) { next(error); }
};

const updateProductById = async (req, res, next) => {
  const { params: { id }, body: { name, description, photo, price, stock } } = req;
  try {
    if(isNaN(+id)) return res.status(400).json({ success: false, error: `The ID must be a valid number` });
    const productFind = await productsDao.getById(id);
    if(!productFind) return res.status(404).json({ success: false, error: `Product ${id} not found` });
    if(name || description || photo || !isNaN(+price) || !isNaN(+stock)) {
      await productsDao.updateById(id, req.body); // Actualiza el producto.
      res.status(200).json({ success: true, result: "Product upated successfully" });
    } else return res.status(400).json({ success: false, error: `Wrong body format` });
  }
  catch(error) { next(error); }
};

const deleteProductById = async (req, res, next) => {
  const { id } = req.params;
  try {
    if(isNaN(+id)) return res.status(400).json({ success: false, error: `The ID must be a valid number` });
    const productFind = await productsDao.getById(id);
    if(!productFind) return res.status(404).json({ success: false, error: `Product ${id} not found` });
    await productsDao.deleteById(id); // Elimina el producto
    res.json({ success: true, result: "Product removed successfully" });
  }
  catch(error) { next(error); }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProductById,
  deleteProductById,
  productsDao
}
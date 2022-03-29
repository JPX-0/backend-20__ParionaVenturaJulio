const { Router } = require('express');
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProductById,
  deleteProductById,
} = require('../../controllers/products.controllers');

const router = Router();

router.get('/', getAllProducts); // Trae todos los productos.

router.get('/:id', getProductById); // Trae un producto.

router.post('/', createProduct); // Crea un producto.

router.put('/:id', updateProductById); // Actualiza un producto.

router.delete('/:id', deleteProductById); // Elimina un producto.

module.exports = router;
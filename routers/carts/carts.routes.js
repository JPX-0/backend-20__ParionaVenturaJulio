const { Router } = require('express');
const {
  getAllCarts,
  getCartById,
  createCart,
  deleteCartById,
  addProductToCart,
  updateProductInCart,
  removeProductToCart
} = require('../../controllers/carts.controllers');

const router = Router();

router.post('/', createCart); // Crea un carrito.

router.delete('/:id', deleteCartById); // Elimina un carrito.

router.get('/', getAllCarts); // Trae todos los carritos.

router.get('/:id', getCartById); // Trae un carrito.

router.post('/:id/products', addProductToCart); // Agrega uno o mas productos a un carrito.

router.put('/:id/products/:id_prod', updateProductInCart); // Actualiza un producto de su carrito.

router.delete('/:id/products/:id_prod', removeProductToCart); // Elimina un producto de su carrito.

module.exports = router;
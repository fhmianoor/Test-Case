const express = require('express');
const router = express.Router();
const limiter = require('../middleware/rateLimiter.js');
const auth = require('../middleware/auth.js');
const { login, getUsersById, createUsers, updateUsers } = require('../controllers/userController.js');
const { uploadProducts, getProducts, getProductsById, updateProducts, deleteProducts } = require('../controllers/productsController.js');

router.post('/signin', limiter, login);
router.get('/users/:id', getUsersById);
router.post('/signup', createUsers);
router.put('/users/update/:id', updateUsers);

router.post('/products', auth, uploadProducts);
router.get('/products', auth, getProducts);
router.get('/products/:id', auth, getProductsById);
router.put('/products/update/:id', auth, updateProducts);
router.delete('/products/:id', auth, deleteProducts);


module.exports = router;
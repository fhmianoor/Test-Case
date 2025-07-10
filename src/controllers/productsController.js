const productService = require('../services/productService.js');

const uploadProducts = async (req, res) => {
    try {
        const productData = await productService.uploadProduct(req.user, req.body);
        res.status(201).json({ status: 'ok', data: productData });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
};

const getProducts = async (req, res) => {
    try {
        const productsData = await productService.getProducts(req.user); // ← fixed
        res.status(200).json({ status: 'ok', data: productsData });
    } catch (error) {
        res.status(404).json({ status: 'error', message: error.message });
    }
};

const getProductsById = async (req, res) => {
    try {
        const productData = await productService.getProductById(req.params.id);
        res.status(200).json({ status: 'ok', data: productData });
    } catch (error) {
        res.status(404).json({ status: 'error', message: error.message });
    }
};

const updateProducts = async (req, res) => {
    try {
        const productData = await productService.updateProduct(req.params.id, req.body);
        res.status(200).json({ status: 'ok', data: productData });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
};

const deleteProducts = async (req, res) => {
    try {
        const result = await productService.deleteProduct(req.params.id);
        res.status(200).json({ status: 'ok', data: result });
    } catch (error) {
        res.status(404).json({ status: 'error', message: error.message });
    }
};

module.exports = {
    uploadProducts,
    getProducts,
    getProductsById,
    updateProducts,
    deleteProducts
};

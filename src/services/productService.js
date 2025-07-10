const db = require('../models/index.js');
const Product = db.product;

const uploadProduct = async (user, { name, price, description, stock }) => {
    const { id: userId, role } = user;

    if (role !== 'vendor') {
        throw new Error('Only vendors can upload products');
    }

    if (!name || !price || !description || stock === undefined) {
        throw new Error('All fields are required');
    }

    if (typeof price !== 'number' || price <= 0) {
        throw new Error('Price must be a positive number');
    }

    if (typeof stock !== 'number' || stock < 0) {
        throw new Error('Stock must be a non-negative number');
    }

    const product = await Product.create({
        userId,
        name,
        price,
        description,
        stock
    });

    return product;
};

const getProducts = async (user) => {
    const { role, id: userId } = user;

    let products;
    if (role === 'vendor') {
        products = await Product.findAll({ where: { userId } });
    } else {
        products = await Product.findAll(); // admin, dsb
    }

    if (!products.length) {
        throw new Error('No products found');
    }

    return products;
};

const getProductById = async (id) => {
    const productData = await Product.findByPk(id);
    if (!productData) {
        throw new Error('Product not found');
    }
    return productData;
};

const updateProduct = async (id, { name, price, description, stock }) => {
    const productData = await Product.findByPk(id);
    if (!productData) {
        throw new Error('Product not found');
    }

    if (!name && !price && !description && stock === undefined) {
        throw new Error('At least one field must be provided for update');
    }

    if (name) productData.name = name;

    if (price !== undefined) {
        if (typeof price !== 'number' || price <= 0) {
            throw new Error('Price must be a positive number');
        }
        productData.price = price;
    }

    if (description) productData.description = description;

    if (stock !== undefined) {
        if (typeof stock !== 'number' || stock < 0) {
            throw new Error('Stock must be a non-negative number');
        }
        productData.stock = stock;
    }

    await productData.save();
    return productData;
};

const deleteProduct = async (id) => {
    const productData = await Product.findByPk(id);
    if (!productData) {
        throw new Error('Product not found');
    }
    await productData.destroy();
    return { message: 'Product deleted successfully' };
};

module.exports = {
    uploadProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
};

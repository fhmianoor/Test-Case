const productService = require('../../src/services/productService');
const db = require('../../src/models');

jest.mock('../../src/models', () => {
  return {
    product: {
      create: jest.fn(),
      findAll: jest.fn(),
      findByPk: jest.fn(),
    },
  };
});

describe('Product Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('uploadProduct', () => {
    it('should create product if valid vendor and input', async () => {
      const user = { id: 1, role: 'vendor' };
      const payload = {
        name: 'Product A',
        price: 10000,
        description: 'Test product',
        stock: 10
      };

      const expectedProduct = { ...payload, userId: user.id };
      db.product.create.mockResolvedValue(expectedProduct);

      const result = await productService.uploadProduct(user, payload);

      expect(db.product.create).toHaveBeenCalledWith({ userId: 1, ...payload });
      expect(result).toEqual(expectedProduct);
    });

    it('should throw error if not a vendor', async () => {
      const user = { id: 1, role: 'user' };

      await expect(
        productService.uploadProduct(user, {
          name: 'X',
          price: 1,
          description: 'Y',
          stock: 1
        })
      ).rejects.toThrow('Only vendors can upload products');
    });

    it('should throw error on invalid price or stock', async () => {
      const user = { id: 1, role: 'vendor' };

      await expect(
        productService.uploadProduct(user, {
          name: 'X',
          price: -10,
          description: 'Y',
          stock: 1
        })
      ).rejects.toThrow('Price must be a positive number');

      await expect(
        productService.uploadProduct(user, {
          name: 'X',
          price: 10,
          description: 'Y',
          stock: -1
        })
      ).rejects.toThrow('Stock must be a non-negative number');
    });
  });

  describe('getProducts', () => {
    it('should return products for vendor', async () => {
      const user = { id: 2, role: 'vendor' };
      const expected = [{ id: 1, name: 'X', userId: 2 }];
      db.product.findAll.mockResolvedValue(expected);

      const result = await productService.getProducts(user);
      expect(db.product.findAll).toHaveBeenCalledWith({ where: { userId: 2 } });
      expect(result).toEqual(expected);
    });

    it('should return all products for admin', async () => {
      const user = { id: 99, role: 'admin' };
      const expected = [{ id: 1, name: 'A' }];
      db.product.findAll.mockResolvedValue(expected);

      const result = await productService.getProducts(user);
      expect(db.product.findAll).toHaveBeenCalledWith();
      expect(result).toEqual(expected);
    });

    it('should throw error if no products found', async () => {
      db.product.findAll.mockResolvedValue([]);

      await expect(
        productService.getProducts({ id: 1, role: 'vendor' })
      ).rejects.toThrow('No products found');
    });
  });

  describe('getProductById', () => {
    it('should return product if found', async () => {
      const product = { id: 1, name: 'A' };
      db.product.findByPk.mockResolvedValue(product);

      const result = await productService.getProductById(1);
      expect(result).toEqual(product);
    });

    it('should throw error if not found', async () => {
      db.product.findByPk.mockResolvedValue(null);

      await expect(productService.getProductById(999))
        .rejects.toThrow('Product not found');
    });
  });

  describe('updateProduct', () => {
    it('should update valid fields', async () => {
      const mockProduct = {
        id: 1,
        name: 'Old',
        price: 10,
        description: 'desc',
        stock: 1,
        save: jest.fn().mockResolvedValue(true)
      };

      db.product.findByPk.mockResolvedValue(mockProduct);

      const result = await productService.updateProduct(1, {
        name: 'New',
        price: 20,
        description: 'new desc',
        stock: 5
      });

      expect(mockProduct.name).toBe('New');
      expect(mockProduct.price).toBe(20);
      expect(mockProduct.description).toBe('new desc');
      expect(mockProduct.stock).toBe(5);
      expect(result).toEqual(mockProduct);
    });

    it('should throw if no product found', async () => {
      db.product.findByPk.mockResolvedValue(null);

      await expect(
        productService.updateProduct(999, { name: 'X' })
      ).rejects.toThrow('Product not found');
    });

    it('should throw error if no fields provided', async () => {
      db.product.findByPk.mockResolvedValue({ save: jest.fn() });

      await expect(
        productService.updateProduct(1, {})
      ).rejects.toThrow('At least one field must be provided for update');
    });
  });

  describe('deleteProduct', () => {
    it('should delete product if found', async () => {
      const mockProduct = {
        id: 1,
        destroy: jest.fn().mockResolvedValue(true)
      };

      db.product.findByPk.mockResolvedValue(mockProduct);

      const result = await productService.deleteProduct(1);

      expect(mockProduct.destroy).toHaveBeenCalled();
      expect(result).toEqual({ message: 'Product deleted successfully' });
    });

    it('should throw if product not found', async () => {
      db.product.findByPk.mockResolvedValue(null);

      await expect(productService.deleteProduct(999))
        .rejects.toThrow('Product not found');
    });
  });
});

const productService = require('../../src/services/productService');
const productsController = require('../../src/controllers/productsController');

jest.mock('../../src/services/productService');

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json   = jest.fn().mockReturnValue(res);
  return res;
};

describe('Products Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockUser = { id: 1, role: 'vendor' };
  const mockProduct = { id: 1, name: 'Test Product', price: 100, stock: 10, description: 'A product', userId: 1 };

  describe('uploadProducts', () => {
    it('should upload a product successfully', async () => {
      const req = { user: mockUser, body: mockProduct };
      const res = mockRes();

      productService.uploadProduct.mockResolvedValue(mockProduct);

      await productsController.uploadProducts(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ status: 'ok', data: mockProduct });
    });

    it('should handle upload error', async () => {
      const req = { user: mockUser, body: {} };
      const res = mockRes();

      productService.uploadProduct.mockRejectedValue(new Error('Upload error'));

      await productsController.uploadProducts(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ status: 'error', message: 'Upload error' });
    });
  });

  describe('getProducts', () => {
    it('should return products list', async () => {
      const req = { user: mockUser };
      const res = mockRes();

      productService.getProducts.mockResolvedValue([mockProduct]);

      await productsController.getProducts(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ status: 'ok', data: [mockProduct] });
    });

    it('should handle get error', async () => {
      const req = { user: mockUser };
      const res = mockRes();

      productService.getProducts.mockRejectedValue(new Error('Get error'));

      await productsController.getProducts(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ status: 'error', message: 'Get error' });
    });
  });

  describe('getProductsById', () => {
    it('should return a product by id', async () => {
      const req = { params: { id: 1 } };
      const res = mockRes();

      productService.getProductById.mockResolvedValue(mockProduct);

      await productsController.getProductsById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ status: 'ok', data: mockProduct });
    });

    it('should handle not found', async () => {
      const req = { params: { id: 1 } };
      const res = mockRes();

      productService.getProductById.mockRejectedValue(new Error('Product not found'));

      await productsController.getProductsById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ status: 'error', message: 'Product not found' });
    });
  });

  describe('updateProducts', () => {
    it('should update a product', async () => {
      const req = { params: { id: 1 }, body: { name: 'Updated' } };
      const res = mockRes();

      productService.updateProduct.mockResolvedValue({ ...mockProduct, name: 'Updated' });

      await productsController.updateProducts(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ status: 'ok', data: { ...mockProduct, name: 'Updated' } });
    });

    it('should handle update error', async () => {
      const req = { params: { id: 1 }, body: {} };
      const res = mockRes();

      productService.updateProduct.mockRejectedValue(new Error('Update failed'));

      await productsController.updateProducts(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ status: 'error', message: 'Update failed' });
    });
  });

  describe('deleteProducts', () => {
    it('should delete a product', async () => {
      const req = { params: { id: 1 } };
      const res = mockRes();

      productService.deleteProduct.mockResolvedValue({ message: 'Product deleted successfully' });

      await productsController.deleteProducts(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ status: 'ok', data: { message: 'Product deleted successfully' } });
    });

    it('should handle delete error', async () => {
      const req = { params: { id: 99 } };
      const res = mockRes();

      productService.deleteProduct.mockRejectedValue(new Error('Delete failed'));

      await productsController.deleteProducts(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ status: 'error', message: 'Delete failed' });
    });
  });
});

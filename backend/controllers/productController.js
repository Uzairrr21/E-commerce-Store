const Product = require('../models/Product');
const asyncHandler = require('express-async-handler');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};

  const count = await Product.countDocuments({ ...keyword });
  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ 
    products: products.map(p => ({
      ...p._doc,
      countInStock: p.stock // Add countInStock alias
    })), 
    page, 
    pages: Math.ceil(count / pageSize) 
  });
});

// @desc    Fetch featured products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isFeatured: true })
    .limit(8)
    .sort({ createdAt: -1 });

  res.json(products.map(p => ({
    ...p._doc,
    countInStock: p.stock // Add countInStock alias
  })));
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json({
      ...product._doc,
      countInStock: product.stock // Add countInStock alias
    });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, image, stock, isFeatured } = req.body;

  const product = new Product({
    name,
    description,
    price,
    image,
    stock,
    isFeatured: isFeatured || false,
    user: req.user._id,
  });

  const createdProduct = await product.save();
  res.status(201).json({
    ...createdProduct._doc,
    countInStock: createdProduct.stock // Add countInStock alias
  });
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const { name, description, price, image, stock, isFeatured } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.image = image || product.image;
    product.stock = stock || product.stock;
    product.isFeatured = typeof isFeatured !== 'undefined' ? isFeatured : product.isFeatured;

    const updatedProduct = await product.save();
    res.json({
      ...updatedProduct._doc,
      countInStock: updatedProduct.stock // Add countInStock alias
    });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

module.exports = {
  getProducts,
  getFeaturedProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
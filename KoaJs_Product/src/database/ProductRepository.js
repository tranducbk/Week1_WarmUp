const fs = require('fs');
const {data: products} = require('./products.json');

/**
 * @description Get all products
 * @param {number} limit - Limit of products
 * @param {string} sort - Sort order
 * @returns {Array} - Array of products
 */
function getAllProducts(limit, sort) {
  let result = [...products];
  if (sort) {
    result.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sort === 'asc' ? dateA - dateB : dateB - dateA;
    })
  }
  if (limit) {
    result = result.slice(0, parseInt(limit));
  }
  return result;
}

/**
 * @description Get one product
 * @param {number} id - Product ID
 * @returns {Object} - Product object
 */
function getOneProduct(id) {
  return products.find(product => product.id === id);
}

function addNewProduct(data) {
  const updatedProducts = [data, ...products];
  return fs.writeFileSync('./src/database/products.json', JSON.stringify({
    data: updatedProducts
  }));
}

/**
 * @description Update a product by ID
 * @param {number} id - Product ID
 * @param {Object} data - Product data
 * @returns {Object} - Updated product
 */
function updateProductById(id, data) {
  const productIndex = products.findIndex(product => product.id === id);
  if (productIndex !== -1) {
    products[productIndex] = {...products[productIndex], ...data};
    fs.writeFileSync('./src/database/products.json', JSON.stringify({data: products}));
    return products[productIndex];
  }
  throw new Error('Product Not Found with that id!');
}

/**
 * @description Delete a product by ID
 * @param {number} id - Product ID
 * @returns {Object} - Deleted product
 */
function deleteProductById(id) {
  const productIndex = products.findIndex(product => product.id === id);
  if (productIndex) {
    products.splice(productIndex, 1);
    fs.writeFileSync('./src/database/products.json', JSON.stringify({data: products}));
    return {success: true};
  }
  throw new Error('Product Not Found with that id!');
}

module.exports = {
    getOneProduct,
    getAllProducts,
    addNewProduct,
    updateProductById,
    deleteProductById
};
const fs = require('fs');
const products = require('./products.json').data;

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

function getOneProduct(id) {
  return products.find(product => product.id === parseInt(id));
}

function addNewProduct(data) {
  const updatedProducts = [data, ...products];
  return fs.writeFileSync('./src/database/products.json', JSON.stringify({
    data: updatedProducts
  }));
}

function updateProductById(id, data) {
  const productIndex = products.findIndex(product => product.id === parseInt(id));
  if (productIndex !== -1) {
    products[productIndex] = {...products[productIndex], ...data};
    fs.writeFileSync('./src/database/products.json', JSON.stringify({data: products}));
    return products[productIndex];
  }
  throw new Error('Product Not Found with that id!');
}

function deleteProductById(id) {
  const productIndex = products.findIndex(product => product.id === parseInt(id));
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
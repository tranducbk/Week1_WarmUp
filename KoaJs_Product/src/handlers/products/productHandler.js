const {
  getOneProduct,
  getAllProducts,
  addNewProduct,
  updateProductById,
  deleteProductById,
} = require("../../database/ProductRepository");

/**
 * @description Get all products
 * @param {Object: {
 *  limit: string,
 *  sort: string
 * }} ctx - Koa context
 * @returns {Object: {
 *  success: boolean,
 *  data: Array
 * }} - Product object
 */
async function getProducts(ctx) {
  try {
    const { limit, sort } = ctx.query;
    const products = getAllProducts(limit ? parseInt(limit) : undefined, sort);
    
    ctx.status = 200;
    ctx.body = {
      success: true,
      data: products
    };
  } catch (e) {
    ctx.status = 404;
    ctx.body = {
      success: false,
      data: [],
      error: e.message
    };
  }
}

/**
 * @description Get one product
 * @param {Object: {
 *  id: string
 * }} ctx - Koa context
 * @returns {Object: {
 *  success: boolean,
 *  data: Object
 * }} - Product object
 */
async function getProduct(ctx) {
  try {
    const { id } = ctx.params;
    const getCurrentProduct = getOneProduct(parseInt(id));
    if (getCurrentProduct) {
      return (ctx.body = {
        success: true,
        data: getCurrentProduct
      });
    }

    throw new Error("Product Not Found with that id!");
  } catch (e) {
    ctx.status = 404;
    return (ctx.body = {
      success: false,
      error: e.message,
    });
  }
}

/**
 * @description Add a new product
 * @param {Object: {
 *  id: number,
 *  name: string,
 *  price: number,
 *  description: string,
 *  product: string,
 *  color: string,
 *  createdAt: string,
 *  image: string
 * }} ctx - Koa context
 * @returns {Object: {
 *  success: boolean
 * }} - Product object
 */
async function addProduct(ctx) {
  try {
    const postData = ctx.request.body;
    addNewProduct(postData);
    ctx.status = 201;
    return (ctx.body = {
      success: true,
    });
  } catch (error) {
    return (ctx.body = {
      success: false,
      error: error.message,
    });
  }
}

/**
 * @description Delete a product by ID
 * @param {Object: {
 *  id: string
 * }} ctx - Koa context
 * @returns {Object: { 
 *  success: boolean,
 * }} - Product object
 */
async function deleteProduct(ctx) {
  try {
    const { id } = ctx.params;
    const deletedProduct = deleteProductById(id);
    ctx.status = 200;
    return (ctx.body = {
      success: true,
    });
  } catch (e) {
    ctx.status = 404;
    return (ctx.body = {
      success: false,
      error: e.message,
    });
  }
}

/**
 * @description Update a product by ID
 * @param {Object: {
 *  id: string
 * }} ctx - Koa context
 * @returns {Object: { 
 *  success: boolean,
 *  data: Object
 * }} - Product object
 */
async function updateProduct(ctx) {
  try {
    const { id } = ctx.params;
    const postData = ctx.request.body;
    const updatedProduct = updateProductById(parseInt(id), postData);
    ctx.status = 200;
    return (ctx.body = {
      success: true,
      data: updatedProduct,
    });
  } catch (e) {
    ctx.status = 404;
    return (ctx.body = {
      success: false,
      error: e.message,
    });
  }
}

module.exports = {
  getProducts,
  getProduct,
  addProduct,
  updateProduct,
  deleteProduct,
};

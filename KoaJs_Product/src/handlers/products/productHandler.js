const {
  getOneProduct,
  getAllProducts,
  addNewProduct,
  updateProductById,
  deleteProductById,
} = require("../../database/ProductRepository");

async function getProducts(ctx) {
  try {
    const { limit, sort } = ctx.query;
    const products = getAllProducts(limit, sort);
    
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

async function getProduct(ctx) {
  try {
    const { id } = ctx.params;
    const getCurrentProduct = getOneProduct(id);
    if (getCurrentProduct) {
      return (ctx.body = {
        data: getCurrentProduct,
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

async function deleteProduct(ctx) {
  try {
    const { id } = ctx.params;
    const deletedProduct = deleteProductById(id);
    ctx.status = 200;
    return (ctx.body = {
      data: deletedProduct,
    });
  } catch (e) {
    ctx.status = 404;
    return (ctx.body = {
      success: false,
      error: e.message,
    });
  }
}

async function updateProduct(ctx) {
  try {
    const { id } = ctx.params;
    const postData = ctx.request.body;
    const updatedProduct = updateProductById(id, postData);
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

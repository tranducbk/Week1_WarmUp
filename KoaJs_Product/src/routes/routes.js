const Router = require('koa-router');
const productsHandler = require('../handlers/products/productHandler');
const productInputMiddleware = require('../middleware/productInputMiddleware');
const { getAllProducts } = require('../database/ProductRepository');

const router = new Router();

// Render trang chủ
router.get('/', async (ctx) => {
    const products = await getAllProducts();
    await ctx.render('product-list', { 
        products,
        title: 'Product List'
    });
});

// API routes
const apiRouter = new Router({
    prefix: '/api'
});

apiRouter.get('/products', productsHandler.getProducts);
apiRouter.get('/products/:id', productsHandler.getProduct);
apiRouter.post('/products', productInputMiddleware, productsHandler.addProduct);
apiRouter.put('/products/:id', productInputMiddleware, productsHandler.updateProduct);
apiRouter.delete('/products/:id', productsHandler.deleteProduct);

router.use(apiRouter.routes());
router.use(apiRouter.allowedMethods());

module.exports = router;
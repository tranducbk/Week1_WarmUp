const Router = require('koa-router');
const booksHandler = require('../handlers/books/bookHandler');
const bookInputMiddleware = require('../middleware/bookInputMiddleware');

const router = new Router({
    prefix: '/api'
});


router.get('/books', booksHandler.handleGetBooks);
router.get('/books/:id', booksHandler.handleGetOneBook);
router.post('/books', bookInputMiddleware, booksHandler.save)

module.exports = router;
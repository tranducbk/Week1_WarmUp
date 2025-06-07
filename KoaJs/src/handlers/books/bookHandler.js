const {getAll: getAllBooks, getOne: getOneBook, add: addBook} = require("../../database/bookRepository");

/**
 * @description Get all books
 * @param {Object: {
 *  limit: string,
 *  sort: string
 * }} ctx - Koa context
 * @returns {Object: {
 *  data: Array
 * }} - Book object
 */
async function handleGetBooks(ctx) {
  try {
    const {limit, sort} = ctx.query;
    const books = getAllBooks({limit: limit ? parseInt(limit) : undefined, sort});

    ctx.body = {
      data: books
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
 * @description Get one book
 * @param {Object: {
 *  id: string
 * }} ctx - Koa context
 * @returns {Object: {
 *  data: Object
 * }} - Book object
 */
async function handleGetOneBook(ctx) {
  try {
    const {id} = ctx.params;
    const getCurrentBook = getOneBook(parseInt(id));
    if (getCurrentBook) {
      return ctx.body = {
        data: getCurrentBook
      }
    }

    throw new Error('Book Not Found with that id!')
  } catch (e) {
    ctx.status = 404;
    return ctx.body = {
      success: false,
      error: e.message
    }
  }
}

/**
 * @description Save a new book
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
 * }} - Book object
 */
async function save(ctx) {
    try {
        const postData = ctx.request.body;
        addBook(postData);
        ctx.status = 201;
        return ctx.body = {
            success: true,
        };
    }
    catch (error) {
        return ctx.body = {
            success: false,
            error: error.message
        }
    }
}

module.exports = {
  handleGetBooks,
  handleGetOneBook,
  save
};
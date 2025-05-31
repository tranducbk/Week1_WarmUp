const {getAll: getAllBooks, getOne: getOneBook, add: addBook} = require("../../database/bookRepository");

async function getBooks(ctx) {
  try {
    const {limit, sort} = ctx.query;
    const books = await getAllBooks( limit, sort );

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

async function getBook(ctx) {
  try {
    const {id} = ctx.params;
    const getCurrentBook = getOneBook(id);
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
  getBooks,
  getBook,
  save
};
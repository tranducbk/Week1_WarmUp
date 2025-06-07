const fs = require('fs');
const {data: books} = require('./books.json');

/**
 * @description Get all books
 * @param {string} sort - Sort order
 * @param {number} limit - Maximum number of books
 * @returns {Array} - Array of books
 */
function getAll({limit, sort}) {
  let bookList = [...books];
  if (sort) {
    bookList.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sort === 'asc' ? dateA - dateB : dateB - dateA;
    })
  }
  if (limit) {
    bookList = bookList.filter(book => book.id <= limit);
  }
  return bookList;
}

function getOne(id) {
  return books.find(book => book.id === parseInt(id));
}

function add(data) {
  const updatedBooks = [...books, data];
  return fs.writeFileSync('./src/database/books.json', JSON.stringify({
    data: updatedBooks
  }));
}

module.exports = {
  getOne,
  getAll,
  add
};
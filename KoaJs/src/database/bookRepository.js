const fs = require('fs');
const {data: books} = require('./books.json');


function getAll(limit, sort) {
  let books = [...books];
  if (sort) {
    books.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sort === 'asc' ? dateA - dateB : dateB - dateA;
    })
  }
  if (limit) {
    books = books.slice(0, parseInt(limit));
  }
  return books;
}

function getOne(id) {
  return books.find(book => book.id === parseInt(id));
}

function add(data) {
  const updatedBooks = [data, ...books];
  return fs.writeFileSync('./src/database/books.json', JSON.stringify({
    data: updatedBooks
  }));
}

module.exports = {
  getOne,
  getAll,
  add
};
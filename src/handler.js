/* eslint-disable linebreak-style */
/* eslint-disable no-const-assign */
const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    insertedAt,
    updatedAt,
  };
  newBook.finished = false;

  // eslint-disable-next-line no-prototype-builtins
  if (!request.payload.hasOwnProperty('name')) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    return response.code(400);
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    return response.code(400);
  }

  if (pageCount === readPage) {
    newBook.finished = true;
  }

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;
  // eslint-disable-next-line no-console

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    return response.code(201);
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  return response.code(500);
};

const getAllBooksHandler = (request, h) => {
  let newBooks = {};
  if (request.query.name) {
    newBooks = books.filter((book) => book.name === request.query.name).map((item) => ({
      id: item.id,
      name: item.name,
      publisher: item.publisher,
    }));
  } else if (+request.query.reading === 0) {
    newBooks = books.filter((book) => book.reading === false).map((item) => ({
      id: item.id,
      name: item.name,
      publisher: item.publisher,
    }));
  } else if (+request.query.reading === 1) {
    newBooks = books.filter((book) => book.reading === true).map((item) => ({
      id: item.id,
      name: item.name,
      publisher: item.publisher,
    }));
  } else if (+request.query.finished === 0) {
    newBooks = books.filter((book) => book.finished === false).map((item) => ({
      id: item.id,
      name: item.name,
      publisher: item.publisher,
    }));
  } else if (+request.query.finished === 1) {
    newBooks = books.filter((book) => book.finished === true).map((item) => ({
      id: item.id,
      name: item.name,
      publisher: item.publisher,
    }));
  } else {
    newBooks = books.map((item) => ({
      id: item.id,
      name: item.name,
      publisher: item.publisher,
    }));
  }

  const response = h.response({
    status: 'success',
    data: {
      books: newBooks,
    },
  });
  return response.code(200);
};

const getBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const resultBook = books.filter((n) => n.id === id)[0];
  if (resultBook !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        book: resultBook,
      },
    });
    return response.code(200);
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  return response.code(404);
};

const editBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();

  // eslint-disable-next-line no-prototype-builtins
  if (!request.payload.hasOwnProperty('name')) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    return response.code(400);
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    return response.code(400);
  }

  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    return response.code(200);
  }
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  return response.code(404);
};

const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    return response.code(200);
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  return response.code(404);
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};

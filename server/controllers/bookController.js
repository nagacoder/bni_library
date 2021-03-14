const Books = require('../models').books;
const TransactionBook = require('../models').transactionBook;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const fs = require('fs');
require('dotenv').config();

const readXlsxFile = require('read-excel-file/node');

module.exports = {
  getBookList: async (req, res) => {
    let { judul, kategori, tahunTerbit, limit, page, order, sort } = req.body;
    let paramQuerySQL = {};

    if (kategori != '' && typeof kategori !== 'undefined') {
      paramQuerySQL.where = {
        kategori: {
          [Op.like]: '%' + kategori + '%',
        },
      };
    }

    if (judul != '' && typeof judul !== 'undefined') {
      paramQuerySQL.where = {
        judul: {
          [Op.like]: '%' + judul + '%',
        },
      };
    }

    if (tahunTerbit != '' && typeof tahunTerbit !== 'undefined') {
      paramQuerySQL.where = {
        tahunTerbit: {
          [Op.like]: '%' + tahunTerbit + '%',
        },
      };
    }

    if (limit != '' && typeof limit !== 'undefined' && limit > 0) {
      paramQuerySQL.limit = parseInt(limit);
    }
    // offset
    if (page != '' && typeof page !== 'undefined' && page > 0) {
      paramQuerySQL.offset = parseInt((page - 1) * req.body.limit);
    }

    // order by
    if (
      order != '' &&
      typeof order !== 'undefined' &&
      ['createdAt'].includes(order.toLowerCase())
    ) {
      paramQuerySQL.order = [[order, sort]];
    }

    if (typeof sort !== 'undefined' && !['asc', 'desc'].includes(sort.toLowerCase())) {
      sort = 'DESC';
    }

    return await Books.findAndCountAll(paramQuerySQL)
      .then(book => {
        let activePage = Math.ceil(book.count / req.body.limit);
        let page = req.body.page;
        res.status(200).json({
          count: book.count,
          totalPage: activePage,
          activePage: page,
          data: book.rows,
        });
      })
      .catch(err => {
        res.status(500).send({ message: err });
      });
  },

  getBookById: async (req, res) => {
    try {
      let paramQuerySQL = {
        where: {
          id: req.params.id,
        },
      };

      const book = await Books.findAll(paramQuerySQL);

      if (book.length < 1) {
        return res.status(404).send({
          message: 'book Not Found',
        });
      }

      return res.status(200).send(book[0]);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error.message);
    }
  },

  // getBookListNeedRated: async (req, res) => {
  //   try {
  //     let paramQuerySQL = {
  //       where: {
  //         isGiveRating: false,
  //         userId: req.params.userId
  //       },
  //       include: 'book'
  //     }

  //     const transactionBook = await TransactionBook.findAll(paramQuerySQL);
  //     if (transactionBook.length < 1) {
  //       return res.status(404).send({
  //         message: 'book Not Found',
  //       });
  //     }

  //     return res.status(200).send(transactionBook);
  //   } catch (error) {
  //     console.log(error);
  //     return res.status(500).json(error.message);
  //   }
  // },

  list: async (req, res) => {
    let { judul, kategori, tahunTerbit, limit, page, order, sort } = req.body;
    let paramQuerySQL = {};

    if (kategori != '' && typeof kategori !== 'undefined') {
      paramQuerySQL.where = {
        kategori: {
          [Op.like]: '%' + kategori + '%',
        },
      };
    }

    if (judul != '' && typeof judul !== 'undefined') {
      paramQuerySQL.where = {
        judul: {
          [Op.like]: '%' + judul + '%',
        },
      };
    }

    if (tahunTerbit != '' && typeof tahunTerbit !== 'undefined') {
      paramQuerySQL.where = {
        tahunTerbit: {
          [Op.like]: '%' + tahunTerbit + '%',
        },
      };
    }

    if (limit != '' && typeof limit !== 'undefined' && limit > 0) {
      paramQuerySQL.limit = parseInt(limit);
    }
    // offset
    if (page != '' && typeof page !== 'undefined' && page > 0) {
      paramQuerySQL.offset = parseInt((page - 1) * req.body.limit);
    }

    // order by
    if (
      order != '' &&
      typeof order !== 'undefined' &&
      ['createdAt'].includes(order.toLowerCase())
    ) {
      paramQuerySQL.order = [[order, sort]];
    }

    if (typeof sort !== 'undefined' && !['asc', 'desc'].includes(sort.toLowerCase())) {
      sort = 'DESC';
    }

    return await Books.findAndCountAll(paramQuerySQL)
      .then(book => {
        let activePage = Math.ceil(book.count / req.body.limit);
        let page = req.body.page;
        res.status(200).json({
          count: book.count,
          totalPage: activePage,
          activePage: page,
          data: book.rows,
        });
      })
      .catch(err => {
        res.status(500).send({ message: err });
      });
  },

  getById: async (req, res) => {
    try {
      let paramQuerySQL = {
        where: {
          id: req.params.id,
        },
      };

      const book = await Books.findAll(paramQuerySQL);

      if (book.length < 1) {
        return res.status(404).send({
          message: 'book Not Found',
        });
      }

      return res.status(200).send(book[0]);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error.message);
    }
  },

  add: async (req, res) => {
    if (typeof req.file == 'undefined') {
      return res.status(400).json({
        message: 'Image Tidak Ditemukan',
      });
    }

    let location = req.body.image
      ? req.body.image
      : `${process.env.SERVER_BACKEND}/img/images/${req.file.filename}`;

    Books.create({
      kategori: req.body.kategori,
      judul: req.body.judul,
      pengarang: req.body.pengarang,
      tahunTerbit: req.body.tahunTerbit,
      description: req.body.description,
      stockBuku: req.body.stockBuku,
      tanggalTerbit: req.body.tanggalTerbit,
      isbn: req.body.isbn,
      bahasa: req.body.bahasa,
      penerbit: req.body.penerbit,
      lokasiPerpustakaan: req.body.lokasiPerpustakaan,
      nomorLemari: req.body.nomorLemari,
      rakLemari: req.body.rakLemari,
      keterangan: req.body.keterangan,
      urlFile: req.body.urlFile,
      status: req.body.status,
      image: req.file ? location : null,
    })
      .then(response => {
        // console.log("response", response.id)

        return res.status(201).json({
          message: 'Process Succesfully create Book',
          data: response,
        });
      })
      .catch(err => res.status(500).send(err));
  },

  update: async (req, res) => {
    return Books.findByPk(req.params.id)

      .then(book => {
        if (!book) {
          return res.status(400).send({ message: 'Book not found' });
        }

        let location = req.body.image
          ? req.body.image
          : `${process.env.SERVER_BACKEND}/img/images/${req.file.filename}`;
        return book
          .update({
            kategori: req.body.kategori,
            judul: req.body.judul,
            pengarang: req.body.pengarang,
            tahunTerbit: req.body.tahunTerbit,
            description: req.body.description,
            stockBuku: req.body.stockBuku,
            tanggalTerbit: req.body.tanggalTerbit,
            isbn: req.body.isbn,
            bahasa: req.body.bahasa,
            penerbit: req.body.penerbit,
            lokasiPerpustakaan: req.body.lokasiPerpustakaan,
            nomorLemari: req.body.nomorLemari,
            rakLemari: req.body.rakLemari,
            keterangan: req.body.keterangan,
            urlFile: req.body.urlFile,
            status: req.body.status,
            image: req.file ? location : req.file,
          })
          .then(response => {
            res.status(200).json({ message: 'successfully update book', data: response });
          })
          .catch(err => res.status(404).send(err));
      })
      .catch(error => res.status(500).json({ test: error }));
  },

  uploadBook: async (req, res) => {
    function getUniqueListBy(arr) {
      return Object.values(arr.reduce((acc, cur) => Object.assign(acc, { [cur.judul]: cur }), {}));
    }

    try {
      if (req.file == undefined) {
        return res.status(500).send('Tolong import data dengan format excel!');
      }

      let path = __basedir + '/server/public/document/' + req.file.filename;

      readXlsxFile(path).then(rows => {
        // skip header
        rows.shift();

        let Databooks = [];

        rows.forEach(row => {
          let rowBook = {
            kategori: row[1],
            judul: row[2],
            pengarang: row[3],
            tahunTerbit: row[4],
            jumlahPeminjam: row[5],
            description: row[6],
            stockBuku: row[7],
            tanggalTerbit: row[8],
            isbn: row[9],
            bahasa: row[10],
            penerbit: row[11],
            lokasiPerpustakaan: row[12],
            status: row[13],
            nomorLemari: row[20],
            rakLemari: row[21],
            keterangan: row[22],
            image: row[23],
          };

          Databooks.push(rowBook);
        });

        const arr1 = getUniqueListBy(Databooks);
        Books.findAndCountAll({}).then(response => {
          // console.log('response', response.rows);
          let concatData = response.rows.concat(arr1);

          const uniqueValues = new Set(concatData.map(v => v.judul));

          if (uniqueValues.size < concatData.length) {
            console.log('duplicates found');
            res.status(500).json({
              message: 'Check Kembali File , terdapat data yang sama di system !',
            });
          } else {
            Books.bulkCreate(arr1)
              .then(response => {
                return res.status(200).json({
                  message: 'Uploaded the file successfully: ' + req.file.originalname,
                });
              })
              .catch(error => {
                console.log({ error });
                res.status(500).json({
                  message: 'Gagal import kedalam system!',
                  error: error.message,
                });
              });
          }
        });
      });
    } catch (error) {
      res.status(500).json({
        message: 'Could not upload the file: ' + req.file.originalname,
      });
    }
  },

  delete: async (req, res) => {
    return Books.findByPk(req.params.id)
      .then(book => {
        if (!book) {
          return res.status(404).send({ message: 'Book not found' });
        }
        return book
          .destroy()
          .then(() => res.status(200).send({ message: 'succesfully delete' }))
          .catch(error => res.status(404).send(error));
      })
      .catch(error => res.status(500).send(error));
  },

  downloadSampleExcel: async (req, res) => {
    try {
      const excel = fs.readFileSync(`${__dirname}/../file/example-book-format.xlsx`);
      res.writeHead(200, [
        ['Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
      ]);
      return res.end(new Buffer(excel, 'base64'));
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: 'something went wrong',
      });
    }
  },
};

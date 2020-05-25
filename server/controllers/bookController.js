const Books = require('../models').books;
const upload = require("../helpers/Upload.js");
const path = require('path');

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = {
  list(req, res) {

    // queryStrings
    let { q, order, sort, limit, offset } = req.query;

    let paramQuerySQL = {};


    //search (q) , need fix
    if (q != '' && typeof q !== 'undefined') {
      paramQuerySQL.where = {
        q: {
          [Op.like]: '%' + q + '%'
        }
      }

    }

    //limit
    if (limit != '' && typeof limit !== 'undefined' && limit > 0) {
      paramQuerySQL.limit = parseInt(limit);
    }

    // offset
    if (offset != '' && typeof offset !== 'undefined' && offset > 0) {
      paramQuerySQL.offset = parseInt(offset);
    }

    // sort par defaut si param vide ou inexistant
    if (typeof sort === 'undefined' || sort == '') {
      sort = 'ASC';
    }
    // order by
    if (
      order != '' &&
      typeof order !== 'undefined' &&
      ['name'].includes(order.toLowerCase())
    ) {
      paramQuerySQL.order = [[order, sort]];
    }

    return Books.findAndCountAll(paramQuerySQL).then(book => {
      res.status(200).send(book);
    })
      .catch(err => {
        res.status(500).send(err)
      })

  },

  getById(req, res) {
    return Books.findByPk(req.params.id)
      .then(book => {
        if (!book) {
          return res.status(404).send({
            message: 'book Not Found',
          });
        }
        return res.status(200).send(book);
      })
      .catch(error => res.status(400).send(error));
  },

  add(req, res) {
    upload(req, res, err => {
      if (err) throw err;
      return Books.create({
        code: req.body.code,
        title: req.body.title,
        statementResponsibility: req.body.statementResponsibility,
        description: req.body.description,
        dateBook: req.body.edition,
        stockBook: req.body.stock,
        category: req.body.category,
        image: req.file.path,
        author: req.body.author,
        isPromotion: req.body.isPromotion ? req.body.isPromotion : false,
      })
        .then(response => res.status(200).send(response))
        .catch(err => res.status(400).send(err));
    });
  },

  update(req, res) {
    upload(req, res, err => {
      if (err) throw err;
      return Books.findByPk(req.params.id)
        .then(book => {
          if (!book) {
            return res.status(400).send({ message: 'Book not found' });
          }
          return book
            .update({
              code: req.body.code,
              title: req.body.title,
              statementResponsibility: req.body.statementResponsibility,
              description: req.body.description,
              dateBook: req.body.edition,
              stockBook: req.body.stock,
              category: req.body.category,
              image: req.file.path,
              author: req.body.author,
              isPromotion: req.body.isPromotion ? req.body.isPromotion : false,
            })
            .then(response => res.status(200).send(response))
            .catch(err => res.status(400).send(err));
        })
        .catch(error => res.status(400).send(error));
    });
  },

  delete(req, res) {
    return Books.findByPk(req.params.id)
      .then(book => {
        if (!book) {
          return res.status(400).send({ message: 'Book not found' });
        }
        return book
          .destroy()
          .then(() => res.status(204).send({ message: 'succesfully delete' }))
          .catch(error => res.status(400).send(error));
      })
      .catch(error => res.status(400).send(error));
  },
};

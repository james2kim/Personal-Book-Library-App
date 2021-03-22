const Book = require ('../models/Book')
const mongoose = require('mongoose');

/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

module.exports = function (app) {

  app.route('/api/books')
    .get( async (req, res) => {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      try {
        const books = await Book.find({})
        res.status(200).send(books)
      } catch (err) {
        console.log(err)
      }
    })
    
    .post( async (req, res) => {
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      if (!req.body.title) return res.send('missing required field title')
      const book = new Book(req.body)
      try {
        await book.save()
        const{_id} = book
        return res.status(200).send({title, _id})
      } catch (err) {
        console.log(err)
      }
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
    });



  app.route('/api/books/:id')
    .get(async (req, res) => {
      let bookid = req.params.id;
      try {
        let book = await Book.findById(mongoose.Types.ObjectId(bookid))
        if (!book) return res.status(200).send('no book exists')

        const {title, _id, comments} = book
        return res.status(200).send({title, _id, comments})
      } catch (err) {
        console.log(err)
      }
    })
    
    .post(async (req, res) => {
      let bookid = req.params.id;
      let comment = req.body.comment;

      if (!comment) return res.status(200).send('missing required field comment')

      try {
       let book = await Book.findById(mongoose.Types.ObjectId(bookid))
        if (!book) return res.status(200).send('no book exists')
        book.comments.push(comment)
        await book.save()
        const {title, _id, comments} = book
        return res.status(200).send({title, _id, comments})
      } catch (err) {
        console.log(err)
      }

    })
    
    .delete(async (req, res) => {
      let bookid = req.params.id;
      try {
        let book = await Book.findById(mongoose.Types.ObjectId(bookid))
        if (!book) return res.status(200).send('no book exists')
        await Book.findByIdAndDelete(mongoose.Types.ObjectId(bookid))
        return res.status(200).send('complete delete successful')
      } catch (err) {
        console.log(err)
      }
    });
};

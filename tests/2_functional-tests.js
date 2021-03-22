/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
let ObjectId = require('mongodb').ObjectId;
chai.use(chaiHttp);

suite('Functional Tests', function() {

  suite('Routing tests', function() {
    let id

    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
          chai.request(server)
          .post('/api/books')
          .send({title:'Title'})
          .end((err, res) => {
            assert.equal(res.status, 200)
            assert.equal(res.body.title, 'Title')
            assert.property(res.body, '_id')
            id = res.body._id
            done()
          })
      });
      
      test('Test POST /api/books with no title given', function(done) {
          chai.request(server)
          .post('/api/books')
          .send({})
          .end((err, res) => {
            assert.equal(res.status,200)
            assert.equal(res.text, 'missing required field title')
            done()
          })
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
        .get('/api/books')
        .end((err, res) => {
          assert.equal(res.status,200)
          done()
        })
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
          chai.request(server)
          .get(`/api/books/${String(ObjectId())}`)
          .end((err,res) => {
            assert.equal(res.status, 200)
            assert.equal(res.text, 'no book exists')
            done()
          })
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
          .get(`/api/books/${id}`)
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body._id, id);
            assert.equal(res.body.title, 'Title');
            assert.isArray(res.body.comments);
            done();
          });
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
        .post(`/api/books/${id}`)
        .send({
          comment: 'Comment'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body._id, id);
          assert.equal(res.body.title, 'Title');
          assert.deepEqual(res.body.comments, ['Comment']);
          done();
        });
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        chai.request(server)
        .post(`/api/books/${id}`)
        .send({})
        .end((err,res) => {
          assert.equal(res.status, 200)
          assert.equal(res.text, 'missing required field comment')
          done()
        })
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        chai.request(server)
          .post(`/api/books/${String(ObjectId())}`)
          .send({
            comment: 'Comment'
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists');
            done();
          });
      });
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        chai.request(server)
          .delete(`/api/books/${id}`)
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'complete delete successful');
            done();
          });
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        chai.request(server)
          .delete(`/api/books/${String(ObjectId())}`)
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists');
            done();
          });
      });
    });
  });
});

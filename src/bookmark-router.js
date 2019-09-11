const express = require('express')
const uuid = require('uuid/v4')
const logger = require('./logger')
const {bookmarks} = require('./store')

const bookmarkRouter = express.Router()
const bodyParser = express.json()

bookmarkRouter
    .route('/bookmarks')
    .get((req, res) => {
        res.json(bookmarks)
    })
    .post(bodyParser,(req,res)=>{
        let {title, url, description='', rating=null} = req.body;
        if(!title){
            logger.error('Title is required');
            res.status(400)
                .send('Invalid data')
        }
        if(!url){
            logger.error('Url is required');
            res.status(400)
                .send('Invalid data')
        }
        if(!description || description ===''){
            description = 'No description'
        }
        if(!rating || rating== null){
            rating = 1;
        }
        //get an id for the bookmark
        const id = uuid();
        const bookmark = {
            id,
            title,
            url,
            description,
            rating
        }
        bookmarks.push(bookmark);
        logger.info(`A bookmark with id ${id} created`)
        res.status(201)
            .location('http://localhost:8000/bookmarks/${id}')
            .json({id})


    })
bookmarkRouter
    .route('/bookmarks/:id')
    .get((req,res)=>{
        const {id} = req.params;
        let bookmark = bookmarks.find(bm => bm.id == id)
        if(!bookmark){
            logger.error(`Cannot find a bookmark with id ${id}`)
            res.status(404).send('Bookmark not found')
        }
        logger.info(`Get bookmark with id ${id}`)
        res.json(bookmark)
    })
    .delete((req,res)=>{
        const {id} = req.params;
        const bookmarkIndex = bookmarks.findIndex(bm => bm.id == id);

  if (bookmarkIndex === -1) {
    logger.error(`Bookmark with id ${id} not found.`);
    return res
      .status(404)
      .send('Not Found');
  }

  bookmarks.splice(bookmarkIndex, 1);

  logger.info(`Bookmark with id ${id} deleted.`);
  res
    .status(204)
    .end();
    })
module.exports = bookmarkRouter;
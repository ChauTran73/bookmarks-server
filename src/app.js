require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const { NODE_ENV } = require('./config')
const helmet = require('helmet')
const uuid = require('uuid/v4');
const validateBearerToken = require('./validateBearerToken')
const bookmarkRouter = require('./bookmark-router')


app = express()
app.use(morgan('dev'))
app.use(helmet())
app.use(cors())
app.use(express.json());
app.use(validateBearerToken)
app.use(bookmarkRouter)

app.get('/', (req,res)=>{
  res.send('GET /')
})

app.use(function errorHandler(error, req, res, next) {
    let response
    if (NODE_ENV === 'production') {
       response = { error: { message: 'server error' } }
       } else {
        console.error(error)
        response = { message: error.message, error }
      }
      res.status(500).json(response)
})

module.exports =  app

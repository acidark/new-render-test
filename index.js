const express = require('express')
require('dotenv').config()
const cors = require('cors')


const Note = require('./models/note')

const app = express()

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

const requestLogger = (request,response,next) => {
  console.log('Method',request.method)
  console.log('Path',request.path)
  console.log('Body',request.body)
  next()
}
app.use(requestLogger)

app.get('/',(request,response)=>{
  response.send('<h1>Hello ooiioiworld</h1>')
})

app.get('/api/notes',(request,response) => {
  Note.find({}).then(notes =>{
    response.json(notes)
  })
})

app.post('/api/notes',(request,response,next)=> {
  const body = request.body
  if(body.content === undefined){
   return response.status(404).json({
    error:'content missing'
  })
  }

  const note = new Note({
    "content" : body.content,
    "important" : Boolean(body.important) || false,
    // "id" : generateId()
  })
  note.save().then(savedNote =>{ 
  response.json(savedNote)
  })
  .catch(error=>next(error))
})
app.get('/api/notes/:id',(request,response,next) => {
  const id = request.params.id

  Note.findById(id).then(note =>{
    if(note) {
    response.json(note)
    }
    else {
      response.status(404).end()
    }
  })
  .catch(error => next(error))
})
 
app.delete('/api/notes/:id',(request,response)=>{
  const id = request.params.id
  Note.findByIdAndDelete(id)
  .then(result => {
    response.status(204).end()
  })
  .catch(error => next(error))
})
app.put('/api/notes/:id',(request,response,next)=> {
  const id = request.params.id
  const {content , important } = request.body
  Note.findByIdAndUpdate(id,{content,important},{new:true,runValidators:true,context:'query'})
  .then(updatedNote=>{
    response.json(updatedNote)
  })
  .catch(error => next(error))
})

const unknownEndpoint = (request,response) => {
  response.status(404).send({error:'unknown endpoint'})
}

app.use(unknownEndpoint)

const errorHandler = (error,request,response,next) => {
  console.error(error.message)

  if(error.name === 'CastError'){
    return response.status(400).send({error:'malformated id'})
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({error : error.message})
  }
  next(error)
}

app.use(errorHandler)

const PORT= process.env.BACKEND_PORT
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
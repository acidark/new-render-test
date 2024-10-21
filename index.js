const express = require('express')
require('dotenv').config()
const cors = require('cors')

// const mongoose = require('mongoose')
const Note = require('./models/note')


// const http = require('http')

const unknownEndpoint = (request,response) => {
  response.status(404).send({error:'unknown endpoint'})
}
const requestLogger = (request,response,next) => {
  console.log('Method',request.method)
  console.log('Path',request.path)
  console.log('Body',request.body)
  next()
}
const app = express()
app.use(express.json())
app.use(express.static('dist'))
app.use(cors())
app.use(requestLogger)
// let notes = [
//   {
//     id: "1",
//     content: "HTML is easy",
//     important: true
//   },
//   {  
//     id: "2",
//     content: "Browser can execute only JavaScript",
//     important: false
//   },
//   {
//     id: "3",
//     content: "GET and POST are the most important methods of HTTP protocol",
//     important: true
//   }
  
// ]



// const username = process.env.NOTESDB_USERNAME
// const password = process.env.NOTESDB_PASSWORD 
// const MONGODB_URL = process.env.MONGODB_URL
// const url = `mongodb://${username}:${password}@${MONGODB_URL}/notesDB?retryWrites=true&w=majority&authSource=admin`
// console.log(url)
// mongoose.set('strictQuery',false)
// mongoose.connect(url)

// const noteSchema = new mongoose.Schema({
//   content:String,
//   important:Boolean
// })

// noteSchema.set('toJSON',{
//   transform:(document,returnedObject) => {
//     returnedObject.id = returnedObject._id,toString()
//     delete returnedObject._id
//     delete returnedObject.__v
//   }
// })

// const Note =mongoose.model('Note',noteSchema)
app.get('/',(request,response)=>{
  response.send('<h1>Hello ooiioiworld</h1>')
})

app.get('/api/notes',(request,response) => {
  Note.find({}).then(notes =>{
    response.json(notes)
  })
})

// const generateId = () => {
//    const maxId = notes.length > 0
//   ? Math.max(...notes.map(n=>Number(n.id)))
//   : 0
//   return String(maxId+1)
//   }
app.post('/api/notes',(request,response)=> {
  const body = request.body
  if(!body.content){
   return response.status(404).json({
    error:'empty'
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
})
app.get('/api/notes/:id',(request,response) => {
  const id = request.params.id
  // const note = notes.find(n=>n.id === id)
  Note.findById(id).then(note =>{
    response.json(note)
  })
  .catch(() => {
    response.status(404).end()
  })
})
// const app = http.createServer((request, response) => {
  // response.writeHead(200, { 'Content-Type': 'application/json' })
  // response.end(JSON.stringify(notes))
  
app.delete('/api/notes/:id',(request,response)=>{
  const id = request.params.id
  notes = notes.map(n => n.id != id)
  response.status(204).end()
})
app.use(unknownEndpoint)
const PORT= process.env.BACKEND_PORT
app.listen(PORT)
console.log(`Server running on port ${PORT}`)


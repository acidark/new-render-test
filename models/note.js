const mongoose = require('mongoose')
mongoose.set('strictQuery',false)
const username = process.env.NOTESDB_USERNAME
const password = process.env.NOTESDB_PASSWORD
const MONGODB_URL = process.env.MONGODB_URL
const url= `mongodb://${username}:${password}@${MONGODB_URL}/notesDB?retryWrites=true&w=majority&authSource=admin`
console.log(url)
mongoose.connect(url)
  .then(result =>{
    console.log('connected to db')
  })
  .catch(error =>{
    console.log('error connecting to db:',error.message)
  })

  const noteSchema = new mongoose.Schema({
    content:String,
    important:Boolean
  })

  noteSchema.set('toJSON',{
    transform :(document,returnedDocument)=>{
      returnedDocument.id = returnedDocument._id
      delete  returnedDocument._id
      delete returnedDocument.__v
    }
  })

module.exports = mongoose.model('Note',noteSchema)
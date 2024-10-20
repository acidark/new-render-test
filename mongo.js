const mongoose = require('mongoose')
require('dotenv').config()
if (process.argv.length < 3){
  console.log('give passsword as argument')
  process.exit(1)
}

const password = process.argv[2]
const MONGODB_URL = process.env.MONGODB_URL
const url = `mongodb://fullstack:${password}@${MONGODB_URL}/notesDB?retryWrites=true&w=majority&authSource=admin`
mongoose.set('strictQuery',false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content:String,
  important:Boolean
})

const Note =mongoose.model('Note',noteSchema)

const note = new Note({
  content:'HTML is easy',
  important:true
})

note.save().then(result => {
  console.log('note saved')
//   mongoose.connection.close()
})
Note.find({}).then(result => {
  result.forEach(note => {
    console.log(note)
  })
  mongoose.connection.close()
})
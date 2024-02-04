const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fullstack:${password}@cluster0.4qeenga.mongodb.net/persons?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  content: String,
  number: String,
})
const Person = mongoose.model('Person', personSchema)

if (process.argv.length > 3){


  const person = new Person({
    content: process.argv[3],
    number: process.argv[4],
  })

  person.save().then(result => {
    console.log('person saved!')
    mongoose.connection.close()
  })

}
else {
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  })
}

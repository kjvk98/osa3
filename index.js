const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
require('dotenv').config()
const Person = require('./models/person')

morgan.token('data', function getData (req) {
  return JSON.stringify(req.body)
})

app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))
app.use(express.json())
app.use(express.static('dist'))



app.get('/info', (req, res) => {
  const date = new Date()
  Person.find({}).then(result =>
    res.send(`<p>Phonebook has info for ${result.length} people</p>` +
    `<p>${date}`))

})

app.get('/api/persons', (req, res) => {
  Person.find({}).then(result => res.json(result))

})


app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    }).catch(error => next(error))
})


app.delete('/api/persons/:id', (request, response, next) => {

  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body


  Person.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})



app.post('/api/persons', (request, response, next) => {
  const body = request.body

  //const id = Math.floor(Math.random() * 1000)
  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  }).catch(error => next(error))

  //persons = persons.concat(person)
  //response.json(person)
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
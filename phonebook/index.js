const Person = require('./models/person')

const express = require('express')
var morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

morgan.token('body', (call) =>
  call.method == 'POST' ? JSON.stringify(call.body) : '',
)

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body'),
)

app.get('/info', (request, response) => {
  Person.find().then((people) => {
    response.send(`<h1>Phonebook has info for ${people.length} people</h1>
    <p>${new Date().toString()}</p>`)
  })
})

app.get('/api/persons', (request, response, next) => {
  Person.find()
    .then((people) => {
      response.json(people)
    })
    .catch((error) => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById({ _id: request.params.id })
    .then((person) => {
      response.json(person)
    })
    .catch((error) => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  console.log(request.params.id)
  Person.deleteOne({ _id: request.params.id })
    .then(response.status(204).end())
    .catch((error) => next(error))
})

app.post('/api/persons', (request, response, next) => {

  Person.findOne({ name: request.body.name }).then((exists) => {
    if (exists) {
      const error = new Error()
      error.name = 'AlreadyExists'
      return next(error)
    }

    const person = new Person({
      name: request.body.name,
      number: request.body.number,
    })

    person
      .save()
      .then((result) => {
        response.json(result)
      })
      .catch((error) => next(error))
  })
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findOne({ _id: request.params.id })
    .then((person) => {
      if (!person) {
        const error = new Error()
        error.name = 'PersonNotFound'
        return next(error)
      }

      person.name = name
      person.number = number

      return person.save().then((updatedPerson) => {
        response.json(updatedPerson)
      })
    })
    .catch((error) => next(error))
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  }
  if (error.name === 'AlreadyExists') {
    return response.status(400).send({ error: 'name must be unique' })
  }
  if (error.name === 'PersonNotFound') {
    return response.status(404).send({ error: 'person not found' })
  }

  next(error)
}

app.use(errorHandler)

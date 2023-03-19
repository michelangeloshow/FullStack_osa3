const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static('build'))

morgan.token('requestJson', function (req, res) {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  } else return
})

app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :requestJson'
  )
)

let phonebook = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendick',
    number: '39-23-6423122',
  },
]

const generateId = () => {
  return Math.floor(Math.random() * 10000)
}

app.get('/api/persons', (req, res) => {
  res.json(phonebook)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const info = phonebook.find((info) => info.id === id)

  if (info) {
    res.json(info)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  phonebook = phonebook.filter((info) => info.id !== id)

  res.status(204).end()
})

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).json({ error: 'content missing' })
  }

  if (phonebook.find((info) => info.name === body.name)) {
    return res.status(400).json({ error: 'name exists already' })
  }

  const newInfo = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }

  phonebook = phonebook.concat(newInfo)

  res.json(newInfo)
})

app.get('/info', (req, res) => {
  res.send(
    `<div><p>Phonebook has info for ${
      phonebook.length
    } people</p><p>${new Date()}</p></div>`
  )
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

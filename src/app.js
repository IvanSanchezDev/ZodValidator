import express from 'express'
import { validateMovie, validatePartialMovie } from './schemas/movie.js'
import crypto from 'node:crypto'
import { movies } from '../movies.js'

const app = express()
app.use(express.json())
app.disable('x-powered-by') // deshabilitar el header X-powered-By: Express

app.get('/movies', (req, res) => {
  res.send(movies)
})

app.post('/movies', (req, res) => {
  const result = validateMovie(req.body)
  if (result.error) {
    const errorMessages = result.error.issues.map((error) => error.message)
    return res.status(400).json({ error: errorMessages })
  }

  const newMovie = {
    id: crypto.randomUUID(),
    ...result.data
  }

  movies.push(newMovie)
  res.status(201).send(newMovie)
})

app.patch('/movies/:id', (req, res) => {
  const result = validatePartialMovie(req.body)

  if (result.error) {
    const errorMessages = result.error.issues.map((error) => error.message)
    return res.status(400).json({ error: errorMessages })
  }

  const { id } = req.params

  const movieIndex = movies.findIndex(movie => movie.id === id)

  if (movieIndex === -1) {
    return res.status(404).json({ message: 'Movie no found' })
  }

  const updateMovie = {
    ...movies[movieIndex],
    ...result.data
  }

  movies[movieIndex] = updateMovie

  return res.json(updateMovie)
})

const port = process.env.PORT ?? 1234

app.listen(port, () => {
  console.log(`server listening on port http://localhost:${port}`)
})

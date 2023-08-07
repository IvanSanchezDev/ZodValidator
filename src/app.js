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
  // funcion de validacion que retorna los datos ya validados o los mensajes de errores
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

  // se recupera el id que se la pasa como parametro
  const { id } = req.params

  // ubicacion de la pelicula buscada
  const movieIndex = movies.findIndex(movie => movie.id === id)

  if (movieIndex === -1) {
    return res.status(404).json({ message: 'Movie no found' })
  }

  // Este objeto se compone de las propiedades de la película encontrada en el array movies (que se obtiene con movies[movieIndex]) y las propiedades validadas proporcionadas en result.data.
  const updateMovie = {
    ...movies[movieIndex],
    ...result.data
  }

  // se actualiza la película en el array movies con el objeto updateMovie, reemplazando así la película antigua con los datos actualizados y validados.
  movies[movieIndex] = updateMovie

  return res.json(updateMovie)
})

const port = process.env.PORT ?? 1234

app.listen(port, () => {
  console.log(`server listening on port http://localhost:${port}`)
})

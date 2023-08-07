import z from 'zod'

const movieSchema = z.object({
  title: z.string({
    invalid_type_error: 'Movie title must be a string',
    required_error: 'Movie title is required.'
  }),
  year: z.number().int().min(1900, { message: 'el año debe ser mayor que 1900' }).max(2024, { message: 'el año debe ser menor que 2024' }),
  director: z.string(),
  duration: z.number().int().positive(),
  rate: z.number().min(0, { message: 'el año debe ser mayor que 0' }).max(10, { message: 'el rate debe ser igual o menor que 10' }),
  poster: z.string().url({
    message: 'poster must be a url'
  }),
  genre: z.array(z.enum(['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Thriller', 'Sci-Fi']),
    {
      required_error: 'Movie genre is required',
      message: 'Debe ser un genero valido'
    }
  )
})

export function validateMovie (object) {
  return movieSchema.safeParse(object)
}

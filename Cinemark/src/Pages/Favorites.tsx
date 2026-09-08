import { useEffect, useState } from 'react'
import { API_KEY, API_URL, options, useFavoritesStore } from '../Store/favoritesStore'
import type { Movies } from '../Types/movies'

async function fetchMovieById(movieId: number): Promise<Movies> {
  const response = await fetch(`${API_URL}/movie/${movieId}?api_key=${API_KEY}&language=es-ES`, options)

  if (!response.ok) {
    throw new Error(`No se pudo cargar la película ${movieId}`)
  }

  return response.json()
}

function Favorites() {
  const favoriteIds = useFavoritesStore((state) => state.favoriteIds)
  const removeFavorite = useFavoritesStore((state) => state.removeFavorite)
  const [movies, setMovies] = useState<Movies[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (favoriteIds.length === 0) {
      setMovies([])
      setError(null)
      return
    }

    let isActive = true

    const loadFavorites = async () => {
      setLoading(true)
      setError(null)

      try {
        const favoriteMovies = await Promise.all(favoriteIds.map(fetchMovieById))
        if (isActive) {
          setMovies(favoriteMovies)
        }
      } catch (err) {
        if (isActive) {
          setError(err instanceof Error ? err.message : 'Error cargando favoritos')
        }
      } finally {
        if (isActive) {
          setLoading(false)
        }
      }
    }

    void loadFavorites()

    return () => {
      isActive = false
    }
  }, [favoriteIds])

  return (
    <div style={{ padding: '20px' }}>
      <h1>Películas favoritas</h1>

      {loading && <p>Cargando favoritos...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && favoriteIds.length === 0 && (
        <p>Todavía no agregaste ninguna película a tus favoritos.</p>
      )}

      {movies.length > 0 && (
        <ul>
          {movies.map((movie) => (
            <li key={movie.id} style={{ marginBottom: '12px' }}>
              <span>{movie.title}</span>
              <button type="button" onClick={() => removeFavorite(movie.id)} style={{ marginLeft: '12px' }}>
                Quitar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Favorites
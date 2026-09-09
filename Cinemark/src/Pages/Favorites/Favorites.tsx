import { useEffect } from 'react'
import { useFavoritesStore } from '../../Store/favoritesStore'
import { useMoviesStore } from '../../Store/UseMoviesStore'
import { useNavigate } from 'react-router-dom'
import { ExtraInfo } from '../../components/ExtraInfo'
import './Favorites.css'

function Favorites() {
  const favoriteIds = useFavoritesStore((state) => state.favoriteIds)
  const removeFavorite = useFavoritesStore((state) => state.removeFavorite)
  const movies = useMoviesStore((state) => state.items)
  const loading = useMoviesStore((state) => state.loading)
  const error = useMoviesStore((state) => state.error)
  const fetchMovies = useMoviesStore((state) => state.fetchMovies)
  const moreInfo = useMoviesStore((state) => state.moreInfo)
  const navigate = useNavigate()
  const clearMoreInfo = useMoviesStore((state) => state.clearMoreInfo)
  const selectedMovieId = useMoviesStore((state) => state.selectedMovieId)

  useEffect(() => {
    if (movies.length === 0) {
      void fetchMovies()
    }
  }, [fetchMovies, movies.length])

  const favoriteMovies = movies.filter((movie) => favoriteIds.includes(movie.id))
  const selectedMovie = movies.find((movie) => movie.id === selectedMovieId)

  if (selectedMovie) {
    return (
      <div style={{ padding: '20px' }}>
        <ExtraInfo item={selectedMovie} />
        <button type="button" onClick={clearMoreInfo} style={{ marginTop: '16px' }}>
          Volver a favoritos
        </button>
      </div>
    )
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Películas favoritas</h1>
      {loading && <p>Cargando favoritos...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && favoriteIds.length === 0 && (
        <p>Todavía no agregaste ninguna película a tus favoritos.</p>
      )}
      {favoriteMovies.length > 0 && (
        <div style={{ display: 'grid', gap: '20px' }}>
          {favoriteMovies.map((movie) => (
            <div key={movie.id} style={{ border: '1px solid #ddd', borderRadius: '10px', padding: '12px', display: 'flex', gap: '16px' }}>
              <img
                src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                alt={movie.title}
                style={{ width: '120px', borderRadius: '8px' }}
              />
              <div>
                <h3>{movie.title}</h3>
                <p>{movie.overview}</p>
                <p><strong>Estreno:</strong> {movie.release_date}</p>
                <button type="button" onClick={() => removeFavorite(movie.id)}>
                  Quitar
                </button>
                <button type="button" onClick={() => void moreInfo(movie.id)}>
                  Ver más info
                </button>
              </div>
            </div>
          ))}
            <button type="button" onClick={() => navigate(-1)}>
                Volver a películas
            </button>
        </div>
      )}
      {!loading && favoriteIds.length > 0 && favoriteMovies.length === 0 && (
        <p>No se encontraron películas favoritas en la lista cargada.</p>
      )}
    </div>
  )
}

export default Favorites
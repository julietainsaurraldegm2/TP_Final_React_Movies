import { useEffect } from 'react'
import './App.css'
import { useMoviesStore } from './Store/UseMoviesStore'
import  useUserStore from './Store/userInfo'
import { useNavigate } from 'react-router-dom'
import { ExtraInfo } from './components/ExtraInfo'
import Movie from './components/Movie'

function App() {
  const items = useMoviesStore((state) => state.items)
  const error = useMoviesStore((state) => state.error)
  const loading = useMoviesStore((state) => state.loading)
  const fetchMovies = useMoviesStore((state) => state.fetchMovies)
  const page = useMoviesStore((state) => state.page)
  const incrementar = useMoviesStore((state) => state.incrementar)
  const decrementar = useMoviesStore((state) => state.decrementar)
  const selectedMovieId = useMoviesStore((state) => state.selectedMovieId)
  const clearMoreInfo = useMoviesStore((state) => state.clearMoreInfo)
  const selectedMovie = items.find((m) => m.id === selectedMovieId)

  const logout = useUserStore((state) => state.logout)
  const user = useUserStore((state) => state.user)
  const navigate = useNavigate()

  useEffect(() => {
    fetchMovies()
  }, [fetchMovies, page])

  return (
    <div style={{ padding: '20px' }}>
      <h1>Cinemark: Tu selector de películas.</h1>

      {!selectedMovie && (
        <nav style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
          <button type="button" className="counter" onClick={decrementar}>
            ⬅️
          </button>

          <span>{page}</span>

          <button type="button" className="counter" onClick={incrementar}>
            ➡️
          </button>

          {user && (
            <button
              type="button"
              className="counter"
              onClick={() => { logout(); navigate('/', { replace: true }) }}
              style={{ marginLeft: 12 }}
            >
              Cerrar sesión
            </button>
          )}
        </nav>
      )}

      {loading && <p>Cargando películas...</p>}
      {error && <p>{error}</p>}

      {selectedMovie ? (
        <>
          <ExtraInfo item={selectedMovie} />
          <button type="button" onClick={clearMoreInfo}>
            Volver a películas
          </button>
        </>
      ) : (
        items.map((item) => (
          <div className="movie" key={item.id}>
            <Movie item={item} />
          </div>
        ))
      )}
    </div>
  )
}

export default App

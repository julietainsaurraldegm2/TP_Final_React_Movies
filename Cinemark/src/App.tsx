import { useEffect, type ReactNode } from 'react'
import './App.css'
import { useMoviesStore } from './Store/UseMoviesStore'
import useUserStore from './Store/userInfo'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ExtraInfo } from './components/ExtraInfo'
import Movie from './components/Movie'
import Login from './Pages/Login/Login'
import Favorites from './Pages/Favorites'

function MoviesView() {
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

  useEffect(() => {
    if (user) void fetchMovies()
  }, [fetchMovies, page, user])

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
              onClick={() => { logout(); }}
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

function ProtectedRoute({ children }: { children: ReactNode }) {
  const user = useUserStore((state) => state.user)
  if (!user) return <Navigate to="/" replace />
  return <>{children}</>
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/Movie" element={
        <ProtectedRoute>
          <MoviesView />
        </ProtectedRoute>
      } />
      <Route path="/favorites" element={
        <ProtectedRoute>
          <Favorites />
        </ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App

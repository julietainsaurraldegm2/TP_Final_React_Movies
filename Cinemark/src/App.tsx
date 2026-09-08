import { useEffect, type ReactNode } from 'react'
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom'
import Login from './Pages/Login/Login';
import Favorites from './Pages/Favorites';
import { useMoviesStore } from './Store/UseMoviesStore';
import Movie from './components/Movie';
import userInfo from './Store/userInfo';
import './App.css';

function MoviesView() {
  const items = useMoviesStore((state) => state.items);
  const error = useMoviesStore((state) => state.error);
  const loading = useMoviesStore((state) => state.loading);
  const fetchMovies = useMoviesStore((state) => state.fetchMovies);
  const page = useMoviesStore((state) => state.page)
  const incrementar = useMoviesStore((state) => state.incrementar)
  const decrementar = useMoviesStore((state) => state.decrementar)
  const user = userInfo((state) => state.user)

  useEffect(() => {
    if (user) fetchMovies();
  }, [fetchMovies, page, user]);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Cinemark: Tu selector de películas.</h1>
      <nav style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
        <button
          type="button"
          className="counter"
          onClick={decrementar}
          >
          ⬅️
        </button>
        <span>{page}</span>
        <button
          type="button"
          className="counter"
          onClick={incrementar}
          >
          ➡️
        </button>
        <Link to="/favorites">Ver favoritos</Link>
      </nav>
      {loading && <p>Cargando películas...</p>}
      {error && <p>{error}</p>}

      {items.map((item) => (
        <div className="movie" key={item.id}>
          <Movie item={item} />
        </div>
      ))}
    </div>
  )
}

function ProtectedRoute({ children }: { children: ReactNode }) {
  const user = userInfo((state) => state.user)
  if (!user) return <Navigate to="/" replace />
  return <>{children}</>
}

function App() {
  return (
    <BrowserRouter>
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
        {/* fallback: redirect unknown routes to login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;

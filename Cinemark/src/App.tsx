import { ExtraInfo } from "./components/ExtraInfo";
import { useEffect, useState } from 'react'
import { useMoviesStore } from './Store/UseMoviesStore';
import Movie from './components/Movie';
import { Settings, useTema } from './components/Settings';
import './App.css';

function App() {
  const [showSettings, setShowSettings] = useState(false)
  const { tema } = useTema()
  const items = useMoviesStore((state) => state.items);
  const error = useMoviesStore((state) => state.error);
  const loading = useMoviesStore((state) => state.loading);
  const fetchMovies = useMoviesStore((state) => state.fetchMovies);
  const page = useMoviesStore((state) => state.page)
  const incrementar = useMoviesStore((state) => state.incrementar)
  const decrementar = useMoviesStore((state) => state.decrementar)
  const selectedMovieId = useMoviesStore((state) => state.selectedMovieId)
  const clearMoreInfo = useMoviesStore((state) => state.clearMoreInfo)
  const selectedMovie = items.find((item) => item.id === selectedMovieId)

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies, page]);

  if (showSettings) {
    return (
      <div className={`app-shell tema-${tema}`}>
        <Settings onBack={() => setShowSettings(false)} />
      </div>
    )
  }

  return (
    <div className={`app-shell tema-${tema}`}>
      <header className="app-header">
        <h1>Cinemark: Tu recomendador de películas.</h1>
        <button type="button" className="navigation-button" onClick={() => setShowSettings(true)}>
          Settings
        </button>
      </header>
      {!selectedMovie && <nav>
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
        </nav>}
      {loading && <p>Cargando películas...</p>}
      {error && <p>{error}</p>}

      {selectedMovie ? (
        <>
          <ExtraInfo item={selectedMovie} />
          <button type="button" onClick={clearMoreInfo}>Volver a películas</button>
        </>
      ) : (
        items.map((item) => (
          <div className="movie" key={item.id}>
            <Movie item={item} />
          </div>
        ))
      )}
    </div>
  );
}

export default App;

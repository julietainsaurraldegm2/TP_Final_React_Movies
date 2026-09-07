import { ExtraInfo } from "./components/ExtraInfo";
import { useEffect } from 'react'
import { useMoviesStore } from './store/UseMoviesStore';
import Movie from './components/Movie';
import './App.css';

function App() {
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
  
  return (
    <div style={{ padding: '20px' }}>
      <h1>Cinemark: Tu selector de películas.</h1>
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

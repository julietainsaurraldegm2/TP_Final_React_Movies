import { useEffect } from "react"; // 1. Importa useEffect
import { useMoviesStore } from "./store/UseMoviesStore";
import Movie from "./components/Movie";
import "./App.css";

function App() {
  const items = useMoviesStore((state) => state.items);
  const error = useMoviesStore((state) => state.error);
  const loading = useMoviesStore((state) => state.loading);
  const fetchMovies = useMoviesStore((state) => state.fetchMovies);
  const page = useMoviesStore((state) => state.page)
  const incrementar = useMoviesStore((state) => state.incrementar)
  const decrementar = useMoviesStore((state) => state.decrementar)

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies, page]);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Cinemark: Tu selector de películas.</h1>
      <nav>
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
      </nav>
      {loading && <p>Cargando películas...</p>}
      {error && <p>{error}</p>}

      {items.map((item) => (
        <div className="movie" key={item.id}>
          <Movie item={item} />
        </div>
      ))}
    </div>
  );
}

export default App;

import { useMoviesStore } from "./store/UseMoviesStore";
import Movie from "./components/Movie";


function App() {

  const items = useMoviesStore((state) => state.items)
  const error = useMoviesStore((state) => state.error)
  const loading = useMoviesStore((state) => state.loading)
  const fetchMovies = useMoviesStore((state) => state.fetchMovies)


  return (
    <div style={{ padding: '20px' }}>
      <h1>Cinemark: Tu selector de peliculas.</h1>
      <button onClick={fetchMovies}>click me</button>
      {loading && <p>Cargando peliculas...</p>}
      {error && <p>{error}</p>}
      {items.map((item) => (
        <Movie key={item.id} item={item} />
      ))}
    </div>
  );
}

export default App;

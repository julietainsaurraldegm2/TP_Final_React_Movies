import { useMoviesStore } from "./store/UseMoviesStore";


function App() {

  const items = useMoviesStore((state) => state.items)
  const error = useMoviesStore((state) => state.error)
  const loading = useMoviesStore((state) => state.loading)
  const fetchMovies = useMoviesStore((state) => state.fetchMovies)


  return (
    <div style={{ padding: '20px' }}>
      <h1>Cinemark: Tu selector de peliculas.</h1>
      <button onClick={fetchMovies}>click me</button>
    </div>
  );
}

export default App;

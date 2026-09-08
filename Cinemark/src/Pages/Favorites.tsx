import { useFavoritesStore } from '../Store/favoritesStore'

function Favorites() {
  const favorites = useFavoritesStore((state) => state.favorites)
  const removeFavorite = useFavoritesStore((state) => state.removeFavorite)

  return (
    <div style={{ padding: '20px' }}>
      <h1>Películas favoritas</h1>

      {favorites.length === 0 ? (
        <p>Todavía no agregaste ninguna película a tus favoritos.</p>
      ) : (
        <ul>
          {favorites.map((movie) => (
            <li key={movie.id}>
              <span>{movie.title}</span>
              <button type="button" onClick={() => void removeFavorite(movie.id)}>
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
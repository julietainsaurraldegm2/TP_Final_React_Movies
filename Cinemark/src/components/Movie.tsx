import type { Movies } from "../Types/movies";
import { useFavoritesStore } from "../Store/favoritesStore";
import "./MovieStyle.css"

interface MovieProps {
    item: Movies;
}

function Movie({ item }: MovieProps) {
    const baseUrlMovies = `https://image.tmdb.org/t/p/w500/`
    const isFavorite = useFavoritesStore((state) => state.isFavorite(item.id))
    const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite)

    return (
        <div>
            <h2 className="title">{item.title}</h2>
            <button type="button" onClick={() => toggleFavorite(item.id)}>
                {isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            </button>
            <div className="infoMovie">
                <p>{item.overview}</p>
                <img src={baseUrlMovies + item.poster_path} alt="Poster de pelicula"></img>
                <p>{`La pelicula se lanzo en ${item.release_date}`}</p>
            </div>
        </div>
    )
}

export default Movie;
import type { Movies } from "../types/movies";

interface MovieProps {
    item: Movies;
}

function Movie({ item }: MovieProps) {
    const baseUrlMovies = `https://image.tmdb.org/t/p/w500/`

    return (
        <div>
            <h2>{item.title}</h2>
            <p>{item.overview}</p>
            <img src={baseUrlMovies+item.poster_path} alt={`La pelicula se lanzo ${item.release_date}`}></img>
        </div>
    )
}

export default Movie;
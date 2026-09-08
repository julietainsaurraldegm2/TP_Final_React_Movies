import type { Movies } from "../types/movies";
import { useMoviesStore } from "../store/UseMoviesStore";
import "./MovieStyle.css"

interface MovieProps {
    item: Movies;
}

function Movie({ item }: MovieProps) {
    const moreInfo = useMoviesStore((state) => state.moreInfo);
    const baseUrlMovies = `https://image.tmdb.org/t/p/w500/`

    return (
        <div>
            <h2 className="title">{item.title}</h2>
            <div className="infoMovie">
                <p>{item.overview}</p>
                <img src={baseUrlMovies + item.poster_path} alt="Poster de pelicula"></img>
                <p>{`La pelicula se lanzo en ${item.release_date}`}</p>
                <button onClick={() => moreInfo(item.id)}>Ver más info</button>
            </div>
        </div>
    )
}

export default Movie;
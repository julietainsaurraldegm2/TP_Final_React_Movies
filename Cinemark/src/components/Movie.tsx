import type { Movies } from "../types/movies";

interface MovieProps {
    item: Movies;
}

function Movie({ item }: MovieProps) {
    return (
        <div>
            <h2>{item.title}</h2>
            <p>{item.overview}</p>
        </div>
    )
}

export default Movie;
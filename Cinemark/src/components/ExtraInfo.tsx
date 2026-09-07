import { useMoviesStore } from "../store/UseMoviesStore";
import type { Movies } from "../types/movies";
import "./MovieStyle.css";

interface MovieProps {
    item: Movies;
}

function ExtraInfo({ item }: MovieProps) {
    const cast = useMoviesStore((state) => state.cast);
    const reviews = useMoviesStore((state) => state.reviews);
    const detailsLoading = useMoviesStore((state) => state.detailsLoading);
    const detailsError = useMoviesStore((state) => state.detailsError);
    const baseUrlImages = "https://image.tmdb.org/t/p/w500/";

    return (
        <div>
            <h2 className="title">{item.title}</h2>
            <div className="infoMovie">
                <p>{item.overview}</p>
                <img src={baseUrlImages + item.poster_path} alt={`Poster de ${item.title}`} />
                <p>{`La pelicula se lanzo en ${item.release_date}`}</p>

                {detailsLoading && <p>Cargando información adicional...</p>}
                {detailsError && <p>{detailsError}</p>}

                <h3>Elenco de la pelicula:</h3>
                <div className="castGrid">
                    {cast.map((actor) => (
                        <div key={actor.id} className="actorCard">
                            {actor.profile_path && (
                                <img
                                    src={baseUrlImages + actor.profile_path}
                                    alt={actor.name}
                                />
                            )}
                            <p className="actorName"><strong>{actor.name}</strong></p>
                            <p className="actorCharacter">{actor.character}</p>
                        </div>
                    ))}
                </div>

                <section className="reviewsSection">
                    <h3>Reviews:</h3>
                    {reviews.length > 0 ? (
                        reviews.map((review) => (
                            <article key={review.id} className="reviewCard">
                                <h4>{review.author}</h4>
                                {review.author_details?.rating != null && (
                                    <p>Valoración: {review.author_details.rating}/10</p>
                                )}
                                <p className="reviewContent">{review.content}</p>
                                <small>{new Date(review.created_at).toLocaleDateString("es-ES")}</small>
                            </article>
                        ))
                    ) : (
                        <p>No hay reviews disponibles para esta película.</p>
                    )}
                </section>
            </div>
        </div>
    );
}

export { ExtraInfo };

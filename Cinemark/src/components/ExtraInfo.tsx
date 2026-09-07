import { useEffect, useState } from "react";
import type { Movies } from "../types/movies";
import "./MovieStyle.css";

interface MovieProps {
    item: Movies;
}

interface Actor {
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
}

interface Review {
    id: string;
    author: string;
    content: string;
    created_at: string;
    author_details?: {
        rating?: number | null;
    };
}

function ExtraInfo({ item }: MovieProps) {
    const baseUrlImages = `https://image.tmdb.org/t/p/w500/`;

    const [cast, setCast] = useState<Actor[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);

    useEffect(() => {
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4YzEwZTdhNGE4ZjM3NDRiNTEyOGUwYzMyNTg0YTkwNiIsIm5iZiI6MTc4ODQzOTIyMS4yNjksInN1YiI6IjZhOTk2YWI1YjM1NmYwNTNmY2IyZjhjZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.NqkTZkqmSUuYQ9eFoDjpWuHmuSsxr2cboEvSPdoAipc'
            }
        };

        fetch(`https://api.themoviedb.org/3/movie/${item.id}/credits?language=es-ES`, options)
            .then(res => res.json())
            .then(data => {
                if (data.cast) {
                    setCast(data.cast.slice(0, 8));
                }
            })
            .catch(err => console.error("Error cargando el cast:", err));

    }, [item.id]);

    useEffect(() => {
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4YzEwZTdhNGE4ZjM3NDRiNTEyOGUwYzMyNTg0YTkwNiIsIm5iZiI6MTc4ODQzOTIyMS4yNjksInN1YiI6IjZhOTk2YWI1YjM1NmYwNTNmY2IyZjhjZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.NqkTZkqmSUuYQ9eFoDjpWuHmuSsxr2cboEvSPdoAipc'
            }
        };

        async function fetchReviews() {
            try {
                const response = await fetch(
                    `https://api.themoviedb.org/3/movie/${item.id}/reviews?language=es-ES&page=1`,
                    options
                );

                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }

                const data = await response.json();
                setReviews(data.results ?? []);
            } catch (err) {
                console.error("Error cargando las reviews:", err);
                setReviews([]);
            }
        }

        fetchReviews();
    }, [item.id])


    return (
        <div>
            <h2 className="title">{item.title}</h2>
            <div className="infoMovie">
                <p>{item.overview}</p>
                <img src={baseUrlImages + item.poster_path} alt="Poster de pelicula" />
                <p>{`La pelicula se lanzo en ${item.release_date}`}</p>

                <h3>Elenco de la pelicula:</h3>
                <div className="castGrid">
                    {cast.map(actor => (
                        <div key={actor.id} className="actorCard">
                            <img
                                src={baseUrlImages + actor.profile_path}
                                alt={actor.name}
                            />
                            <p className="actorName"><strong>{actor.name}</strong></p>
                            <p className="actorCharacter">{actor.character}</p>
                        </div>
                    ))}
                </div>

                <section className="reviewsSection">
                    <h3>Reviews:</h3>
                    {reviews.length > 0 ? (
                        reviews.map(review => (
                            <article key={review.id} className="reviewCard">
                                <h4>{review.author}</h4>
                                {review.author_details?.rating != null && (
                                    <p>Valoración: {review.author_details.rating}/10</p>
                                )}
                                <p style={{
                                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                    borderRadius: '20px'
                                }}>{review.content}</p>
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

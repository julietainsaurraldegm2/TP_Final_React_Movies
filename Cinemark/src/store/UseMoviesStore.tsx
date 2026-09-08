import { create } from 'zustand'
import type { Actor, Movies, Review } from '../Types/movies';

const API_KEY = '8c10e7a4a8f3744b5128e0c32584a906';
const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4YzEwZTdhNGE4ZjM3NDRiNTEyOGUwYzMyNTg0YTkwNiIsIm5iZiI6MTc4ODQzOTIyMS4yNjksInN1YiI6IjZhOTk2YWI1YjM1NmYwNTNmY2IyZjhjZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.NqkTZkqmSUuYQ9eFoDjpWuHmuSsxr2cboEvSPdoAipc'
    }
};

const API_URL = 'https://api.themoviedb.org/3';

async function fetchApiData<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, options);

    if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return response.json() as Promise<T>;
}

interface MoviesState {
    items: Movies[];
    page: number;
    loading: boolean;
    error: string | null;
    fetchMovies: () => Promise<void>;
    incrementar: () => void;
    decrementar: () => void;
    moreInfo: (movieId: number) => Promise<void>;
    clearMoreInfo: () => void;
    selectedMovieId: number | null;
    cast: Actor[];
    reviews: Review[];
    detailsLoading: boolean;
    detailsError: string | null;
}

export const useMoviesStore = create<MoviesState>((set, get) => ({
    items: [],
    error: null,
    cast: [],
    reviews: [],
    detailsLoading: false,
    detailsError: null,
    loading: false,
    fetchMovies: async () => {
        const { page } = get();

        set(() => ({ loading: true }))
        try {
            const data = await fetchApiData<{ results: Movies[] }>(
                `/movie/popular?page=${page}&api_key=${API_KEY}&language=es-ES`
            );
            const filteredMovies = data.results.filter((movie: Movies) => movie.overview && movie.overview.trim() !== "");

            set({
                items: filteredMovies,
                loading: false,
                error: null
            });
        } catch (err) {
            set({ error: err instanceof Error ? err.message : 'Error desconocido', loading: false });
        }
    },
    page: 2,
    selectedMovieId: null,
    incrementar: () => set((state) => ({ page: state.page + 1 })),
    decrementar: () => set((state) => ({ page: state.page <= 1 ? state.page : state.page - 1 })),
    moreInfo: async (movieId) => {
        set({
            selectedMovieId: movieId,
            cast: [],
            reviews: [],
            detailsLoading: true,
            detailsError: null,
        });

        try {
            const [credits, reviews] = await Promise.all([
                fetchApiData<{ cast: Actor[] }>(`/movie/${movieId}/credits?language=es-ES`),
                fetchApiData<{ results: Review[] }>(`/movie/${movieId}/reviews?language=es-ES&page=1`),
            ]);

            set({
                cast: credits.cast.slice(0, 8),
                reviews: reviews.results,
                detailsLoading: false,
            });
        } catch (err) {
            set({
                detailsLoading: false,
                detailsError: err instanceof Error ? err.message : 'Error desconocido',
            });
        }
    },
    clearMoreInfo: () => set({
        selectedMovieId: null,
        cast: [],
        reviews: [],
        detailsError: null,
    }),
}))





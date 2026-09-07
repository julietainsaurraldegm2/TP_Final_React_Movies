import { create } from 'zustand'
import type { Movies } from '../types/movies';

const API_KEY = '8c10e7a4a8f3744b5128e0c32584a906';
const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4YzEwZTdhNGE4ZjM3NDRiNTEyOGUwYzMyNTg0YTkwNiIsIm5iZiI6MTc4ODQzOTIyMS4yNjksInN1YiI6IjZhOTk2YWI1YjM1NmYwNTNmY2IyZjhjZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.NqkTZkqmSUuYQ9eFoDjpWuHmuSsxr2cboEvSPdoAipc'
    }
};

interface MoviesState {
    items: Movies[];
    page: number;
    loading: boolean;
    error: string | null;
    fetchMovies: () => void;
    incrementar: () => void;
    decrementar: () => void;
    moreInfo: (movieId: number) => void;
    clearMoreInfo: () => void;
    selectedMovieId: number | null;
}

export const useMoviesStore = create<MoviesState>((set, get) => ({
    items: [],
    error: null,
    loading: false,
    fetchMovies: async () => {
        const { page } = get();
        const URL = `https://api.themoviedb.org/3/movie/popular?page=${page}&api_key=${API_KEY}&language=es-ES`;

        set(() => ({ loading: true }))
        try {
            const response = await fetch(URL, options);

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
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
    moreInfo: (movieId) => set({ selectedMovieId: movieId }),
    clearMoreInfo: () => set({ selectedMovieId: null }),
}))





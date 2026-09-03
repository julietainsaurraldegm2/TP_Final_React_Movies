import { create } from 'zustand'
import type { Movies } from '../types/movies';

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

const page = getRandomInt(1, 500)
const API_KEY = '8c10e7a4a8f3744b5128e0c32584a906';
const URL = `https://api.themoviedb.org/3/movie/popular?page=${page}?api_key=${API_KEY}&language=es-ES`;
const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4YzEwZTdhNGE4ZjM3NDRiNTEyOGUwYzMyNTg0YTkwNiIsIm5iZiI6MTc4ODQzOTIyMS4yNjksInN1YiI6IjZhOTk2YWI1YjM1NmYwNTNmY2IyZjhjZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.NqkTZkqmSUuYQ9eFoDjpWuHmuSsxr2cboEvSPdoAipc'
    }
};

interface MoviesState {
    items: Movies[];
    loading: boolean;
    error: string | null;
    fetchMovies: () => void;
}

export const useMoviesStore = create<MoviesState>((set) => ({
    items: [],
    error: null,
    loading: false,
    fetchMovies: async () => {
        set(() => ({ loading: true }))
        fetch(URL, options)
            .then(res => res.json())
            .then(res => console.log(res))
            .catch(err => {
                set({
                    error: err
                })
            });
    }
}))




import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const API_KEY = '8c10e7a4a8f3744b5128e0c32584a906'
export const API_URL = 'https://api.themoviedb.org/3'
export const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4YzEwZTdhNGE4ZjM3NDRiNTEyOGUwYzMyNTg0YTkwNiIsIm5iZiI6MTc4ODQzOTIyMS4yNjksInN1YiI6IjZhOTk2YWI1YjM1NmYwNTNmY2IyZjhjZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.NqkTZkqmSUuYQ9eFoDjpWuHmuSsxr2cboEvSPdoAipc'
  }
}

interface FavoritesState {
  favoriteIds: number[]
  addFavorite: (movieId: number) => void
  removeFavorite: (movieId: number) => void
  toggleFavorite: (movieId: number) => void
  isFavorite: (movieId: number) => boolean
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favoriteIds: [],
      addFavorite: (movieId) => {
        const ids = get().favoriteIds
        if (!ids.includes(movieId)) {
          set({ favoriteIds: [...ids, movieId] })
        }
      },
      removeFavorite: (movieId) => {
        set({ favoriteIds: get().favoriteIds.filter((id) => id !== movieId) })
      },
      toggleFavorite: (movieId) => {
        const ids = get().favoriteIds
        if (ids.includes(movieId)) {
          set({ favoriteIds: ids.filter((id) => id !== movieId) })
        } else {
          set({ favoriteIds: [...ids, movieId] })
        }
      },
      isFavorite: (movieId) => {
        return get().favoriteIds.includes(movieId)
      },
    }),
    {
      name: 'favorites-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ favoriteIds: state.favoriteIds }),
    }
  )
)

export default useFavoritesStore

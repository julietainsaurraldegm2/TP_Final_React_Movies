import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Movies } from '../Types/movies'

interface FavoritesState {
  favorites: Movies[]
  addFavorite: (movie: Movies) => void
  removeFavorite: (movieId: number) => void
  toggleFavorite: (movie: Movies) => void
  isFavorite: (movieId: number) => boolean
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      addFavorite: (movie) => {
        const favs = get().favorites
        if (!favs.some((f) => f.id === movie.id)) {
          set({ favorites: [...favs, movie] })
        }
      },
      removeFavorite: (movieId) => {
        set({ favorites: get().favorites.filter((f) => f.id !== movieId) })
      },
      toggleFavorite: (movie) => {
        const favs = get().favorites
        if (favs.some((f) => f.id === movie.id)) {
          set({ favorites: favs.filter((f) => f.id !== movie.id) })
        } else {
          set({ favorites: [...favs, movie] })
        }
      },
      isFavorite: (movieId) => {
        return get().favorites.some((f) => f.id === movieId)
      },
    }),
    {
      name: 'favorites-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ favorites: state.favorites }),
    }
  )
)

export default useFavoritesStore

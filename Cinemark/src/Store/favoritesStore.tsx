import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'


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

import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import type { User } from "../Types/User"
import Credentials from "../Data/Credentials.json"

interface InfoState {
    user: User | null
    email: string
    password: string
    setEmail: (email: string) => void
    setPassword: (password: string) => void
    login: (email: string, password: string, name: string) => void
    logout: () => void
}

export const ClAVE_STORAGE = '090807'

const testCredentials = Credentials as User[]

const userInfo = create<InfoState>()(
    persist(
        (set) => ({
            user: null,
            email: '',
            password: '',
            setEmail: (email) => set({ email }),
            setPassword: (password) => set({ password }),
            login: (email, password, name) => {
                const match = testCredentials.find(
                    (credential) => credential.email === email && credential.password === password,
                )

                if (!match) {
                    return
                }

                const finalName = name.trim() || match.name

                set({
                    user: { name: finalName, email: match.email },
                    email,
                    password,
                })
            },
            logout: () => {
                set({ user: null, email: '', password: '' })
            }
        }),
        {
            name: ClAVE_STORAGE,
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                user: state.user,
                email: state.email,
            }),
        }
    )
)

export default userInfo
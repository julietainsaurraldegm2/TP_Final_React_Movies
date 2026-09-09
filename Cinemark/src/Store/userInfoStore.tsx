import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import type { User } from "../Types/User"
import Credentials from "../Data/Credentials.json"

interface InfoState {
    user: User | null
    name: string
    email: string
    password: string
    setName: (name: string) => void
    setEmail: (email: string) => void
    setPassword: (password: string) => void
    login: (email: string, password: string, name: string) => boolean
    logout: () => void
}

export const ClAVE_STORAGE = '090807'

const testCredentials = Credentials as User[]

const userInfo = create<InfoState>()(
    persist(
        (set) => ({
            user: null,
            name: '',
            email: '',
            password: '',
            setName: (name) => set({ name }),
            setEmail: (email) => set({ email }),
            setPassword: (password) => set({ password }),
            login: (email, password, name) => {
                console.log('store.login called with', { email, password, name })
                const match = testCredentials.find(
                    (credential) => credential.email === email && credential.password === password,
                )

                if (!match) {
                    console.log('store.login -> no match for credentials')
                    return false
                }

                const finalName = name.trim() || match.name

                set({
                    user: { name: finalName, email: match.email },
                    name: finalName,
                    email,
                    password,
                });
                return true;
            },
            logout: () => {
                console.log('store.logout called')
                set({ user: null, name: '', email: '', password: '' })
            }
        }),
        {
            name: ClAVE_STORAGE,
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                user: state.user,
                name: state.name,
                email: state.email,
            }),
        }
    )
)

export default userInfo

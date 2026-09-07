import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { User } from "../Types/User"
import Credentials from "../Data/Credentials.json"

interface InfoState {
    user: User | null
    email: string
    password: string
    setEmail: (email: string) => void
    setPassword: (password: string) => void
    login: (email: string, password: string) => void
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
            login: (email, password) => {
                const match = testCredentials.find(
                    (credential) => credential.email === email && credential.password === password,
                )

                if (!match) {
                    return
                }

                set({
                    user: { name: match.name, email: match.email },
                    email,
                    password,
                })
            },
        }),
        { name: ClAVE_STORAGE }
    )
)

export default userInfo
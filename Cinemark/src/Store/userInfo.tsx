import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { User } from "../Types/User"
import Credentials from "../Data/Credentials.json"
interface InfoState{
    user: User | null
    login: (email: string, password: string) => void
}
export const ClAVE_STORAGE = '090807'
    const testCredentials = Credentials as User[]
    const userInfo = create<InfoState>()(
        persist(
                (set)=> ({
                  user: null,
                  login: (email, password) => {

                    const match = testCredentials.find(
                        (credential) => credential.email === email && credential.password === password,
                    );
                    if(!match){
                        return
                    }else{
                        set({user:{name:match.name, email: match.email}})
                    }
                },

            }), {name: ClAVE_STORAGE}
        )
    )

    export default userInfo
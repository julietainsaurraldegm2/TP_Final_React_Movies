import { useState } from "react";
import userInfo from "../../Store/userInfo";

function Login(){
    const[LocalUser,setLocalUser] = useState('')
    const user = userInfo((state)=> state.user)
    const email =userInfo((state)=>state.email)
    const login = userInfo((state)=> state.login)
    const password = userInfo((state)=> state.password)
    const setPassword = userInfo((state)=> state.setPassword)

function handleSubmit(e: React.FormEvent<HTMLFormElement>){
     e.preventDefault()
    if (LocalUser.trim() === '') return
    if (password.trim().length < 8) return
    login(LocalUser)
    setLocalUser('')
  }

  return(
  <>
  <p>Bienvenido{user}</p> 
  {!user ?(
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={LocalUser}
            onChange={(e) => setLocalUser(e.target.value)}
            placeholder="Escribe tu usuario"
          />
          <input
          type="email"
          value={email}/>
          onChange={(e)=> set}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Escribí la contraseña"
          />
          <button type="submit" disabled={LocalUser.trim() === '' || password.trim().length < 8}>
            Iniciar sesion
          </button>
        </form>
      ):null }
  </>
  )
}

export default Login




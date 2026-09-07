import { useState } from "react";
import userInfo from "../../Store/userInfo";

function Login() {
  const [user, setUser] = useState('')
  const userState = userInfo((state) => state.user)
  const email = userInfo((state) => state.email)
  const setEmail = userInfo((state) => state.setEmail)
  const login = userInfo((state) => state.login)
  const password = userInfo((state) => state.password)
  const setPassword = userInfo((state) => state.setPassword)
  const logout = userInfo((state) => state.logout)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (user.trim() === '' || email.trim() === '' || password.trim() === '') return
    login(email, password, user)
  }

  return (
    <>
      <p>Bienvenido {userState ? userState.name : 'visitante'}</p>

      {!userState ? (
        <form onSubmit={handleSubmit} id="login-form">
          <input
            id="name-input"
            type="text"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            placeholder="Escribí tu nombre"
          />

          <input
            id="email-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Escribí tu email"
          />

          <input  
            id="password-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Escribí la contraseña"
          />

          <button type="submit" disabled={user.trim() === '' || email.trim() === '' || password.trim() === ''}>
            Iniciar sesión
          </button>
        </form>
      ) : (
        <button type="button" onClick={logout}>
          Cerrar sesión
        </button>
      )}
    </>
  )
}

export default Login




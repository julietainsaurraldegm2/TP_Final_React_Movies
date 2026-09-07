import userInfo from "../../Store/userInfo";

function Login() {
  const user = userInfo((state) => state.user)
  const email = userInfo((state) => state.email)
  const setEmail = userInfo((state) => state.setEmail)
  const login = userInfo((state) => state.login)
  const password = userInfo((state) => state.password)
  const setPassword = userInfo((state) => state.setPassword)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (email.trim() === '' || password.trim() === '') return
    login(email, password)
    setEmail('')
    setPassword('')
  }

  return (
    <>
      <p>Bienvenido {user ? user.name : 'visitante'}</p>

      {!user ? (
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Escribí tu email"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Escribí la contraseña"
          />

          <button type="submit" disabled={email.trim() === '' || password.trim() === ''}>
            Iniciar sesión
          </button>
        </form>
      ) : null}
    </>
  )
}

export default Login




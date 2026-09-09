# Cinemark - Recomendador de peliculas
Julieta Insaurralde - Santiago Barua

Aplicación web para descubrir películas. Permite iniciar sesión, explorar películas populares (vía la API de TMDB), ver el detalle de cada una con elenco y reviews, marcar favoritas y cambiar entre tema claro y oscuro.

## Funcionalidades

- **Login persistente**: se valida contra un archivo local de credenciales de prueba. La sesión queda guardada y no se pierde al recargar la página.
- **Rutas protegidas**: si no iniciaste sesión, no podés acceder a `/Movie` ni a `/favorites`.
- **Listado de películas**: trae populares desde la API de TMDB, con paginación.
- **Detalle de película**: overview, elenco, reviews de TMDB y comentarios propios con rating.
- **Favoritos**: marcá/desmarcá películas; se guardan en `localStorage` y persisten entre sesiones.
- **Tema claro/oscuro**: se puede cambiar desde la pantalla de Configuración y se recuerda la preferencia.

## Como iniciar la pagina
```bash
npm install
npm run dev
```

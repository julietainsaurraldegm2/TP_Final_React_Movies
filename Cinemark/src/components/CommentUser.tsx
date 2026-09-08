import { useEffect, useState } from "react";
import type { Movies } from "../Types/movies";
import userInfo from "../Store/userInfo";

interface CommentUserProps {
    pelicula: Movies;
}

interface LocalComment {
    id: string;
    author: string;
    content: string;
    created_at: string;
    updated_at?: string;
    rating: number;
}

interface GuestSessionResponse {
    success: boolean;
    guest_session_id?: string;
    status_message?: string;
}

interface AccountStatesResponse {
    rated?: {
        value: number;
    };
}

const API_URL = "https://api.themoviedb.org/3";
const API_KEY = "8c10e7a4a8f3744b5128e0c32584a906";
const TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4YzEwZTdhNGE4ZjM3NDRiNTEyOGUwYzMyNTg0YTkwNiIsIm5iZiI6MTc4ODQzOTIyMS4yNjksInN1YiI6IjZhOTk2YWI1YjM1NmYwNTNmY2IyZjhjZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.NqkTZkqmSUuYQ9eFoDjpWuHmuSsxr2cboEvSPdoAipc";
const SESSION_STORAGE_KEY = "tmdb_guest_session_id";
const COMMENTS_STORAGE_KEY = "cinemark_comments";

const authHeaders = {
    accept: "application/json",
    Authorization: `Bearer ${TOKEN}`,
};

function getStoredComments(movieId: number, author: string): LocalComment[] {
    try {
        const stored = JSON.parse(localStorage.getItem(COMMENTS_STORAGE_KEY) || "[]") as LocalComment[];
        return stored.filter((comment) => comment.id.startsWith(`${movieId}:`) && comment.author === author);
    } catch {
        return [];
    }
}

function saveStoredComments(movieId: number, author: string, comments: LocalComment[]) {
    try {
        const stored = JSON.parse(localStorage.getItem(COMMENTS_STORAGE_KEY) || "[]") as LocalComment[];
        const otherComments = stored.filter(
            (comment) => !comment.id.startsWith(`${movieId}:`) || comment.author !== author,
        );
        localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify([...otherComments, ...comments]));
    } catch {
        localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(comments));
    }
}

async function getGuestSessionId(): Promise<string> {
    const savedSessionId = localStorage.getItem(SESSION_STORAGE_KEY);
    if (savedSessionId) return savedSessionId;

    const response = await fetch(
        `${API_URL}/authentication/guest_session/new?api_key=${API_KEY}`,
        { headers: authHeaders },
    );
    const data = (await response.json()) as GuestSessionResponse;

    if (!response.ok || !data.success || !data.guest_session_id) {
        throw new Error(data.status_message || "No se pudo crear la sesión de TMDB");
    }

    localStorage.setItem(SESSION_STORAGE_KEY, data.guest_session_id);
    return data.guest_session_id;
}

async function updateTmdbRating(movieId: number, rating: number) {
    const sessionId = await getGuestSessionId();
    const response = await fetch(
        `${API_URL}/movie/${movieId}/rating?guest_session_id=${sessionId}&api_key=${API_KEY}`,
        {
            method: "POST",
            headers: { ...authHeaders, "Content-Type": "application/json;charset=utf-8" },
            body: JSON.stringify({ value: rating }),
        },
    );
    const data = (await response.json()) as { success?: boolean; status_message?: string };
    if (!response.ok || !data.success) {
        throw new Error(data.status_message || "No se pudo guardar el rating en TMDB");
    }
}

async function deleteTmdbRating(movieId: number) {
    const sessionId = await getGuestSessionId();
    const response = await fetch(
        `${API_URL}/movie/${movieId}/rating?guest_session_id=${sessionId}&api_key=${API_KEY}`,
        { method: "DELETE", headers: authHeaders },
    );
    const data = (await response.json()) as { success?: boolean; status_message?: string };
    if (!response.ok || !data.success) {
        throw new Error(data.status_message || "No se pudo borrar el rating de TMDB");
    }
}

function CommentUser({ pelicula }: CommentUserProps) {
    const userName = userInfo((state) => state.user?.name || state.name) || "usuario";
    const [comentarios, setComentarios] = useState<LocalComment[]>(() =>
        getStoredComments(pelicula.id, userName),
    );
    const [texto, setTexto] = useState("");
    const [rating, setRating] = useState(0);
    const [editandoId, setEditandoId] = useState<string | null>(null);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let activo = true;

        async function loadRating() {
            try {
                const sessionId = await getGuestSessionId();
                const response = await fetch(
                    `${API_URL}/movie/${pelicula.id}/account_states?guest_session_id=${sessionId}&api_key=${API_KEY}`,
                    { headers: authHeaders },
                );
                if (!response.ok || !activo) return;

                const data = (await response.json()) as AccountStatesResponse;
                const tmdbRating = data.rated?.value;
                if (tmdbRating && comentarios.length === 0) setRating(tmdbRating);
            } catch {
            }
        }

        void loadRating();
        return () => {
            activo = false;
        };
    }, [pelicula.id, comentarios.length]);

    function resetForm() {
        setTexto("");
        setRating(0);
        setEditandoId(null);
    }

    async function handleSave() {
        const content = texto.trim();
        if (!content) {
            setError("Escribí un comentario.");
            return;
        }
        if (rating < 0.5 || rating > 10) {
            setError("El rating debe estar entre 0.5 y 10.");
            return;
        }

        setCargando(true);
        setError(null);
        const now = new Date().toISOString();
        const comment: LocalComment = {
            id: editandoId || `${pelicula.id}:${Date.now()}`,
            author: userName,
            content,
            created_at: editandoId
                ? comentarios.find((item) => item.id === editandoId)?.created_at || now
                : now,
            updated_at: editandoId ? now : undefined,
            rating,
        };
        const nextComments = editandoId
            ? comentarios.map((item) => (item.id === editandoId ? comment : item))
            : [...comentarios, comment];

        saveStoredComments(pelicula.id, userName, nextComments);
        setComentarios(nextComments);
        resetForm();

        try {
            await updateTmdbRating(pelicula.id, rating);
        } catch (requestError) {
            setError(
                `El comentario quedó guardado localmente, pero no se pudo actualizar TMDB: ${
                    requestError instanceof Error ? requestError.message : "error desconocido"
                }`,
            );
        } finally {
            setCargando(false);
        }
    }

    async function handleDelete(commentId: string) {
        const nextComments = comentarios.filter((item) => item.id !== commentId);
        saveStoredComments(pelicula.id, userName, nextComments);
        setComentarios(nextComments);
        setError(null);
        setCargando(true);

        try {
            await deleteTmdbRating(pelicula.id);
        } catch (requestError) {
            setError(
                `El comentario se borró localmente, pero no se pudo borrar el rating de TMDB: ${
                    requestError instanceof Error ? requestError.message : "error desconocido"
                }`,
            );
        } finally {
            setCargando(false);
        }
    }

    function handleEdit(comment: LocalComment) {
        setEditandoId(comment.id);
        setTexto(comment.content);
        setRating(comment.rating);
        setError(null);
    }

    return (
        <section className="reviewsSection">
            <h3>Mis comentarios:</h3>
            {comentarios.map((comment) => (
                <article key={comment.id} className="reviewCard">
                    <h4>{comment.author}</h4>
                    <p>Valoración: {comment.rating}/10</p>
                    <p className="reviewContent">{comment.content}</p>
                    <small>
                        {new Date(comment.updated_at || comment.created_at).toLocaleDateString("es-ES")}
                        {comment.updated_at ? " (editado)" : ""}
                    </small>
                    <div>
                        <button type="button" onClick={() => handleEdit(comment)} disabled={cargando}>
                            Editar
                        </button>
                        <button type="button" onClick={() => void handleDelete(comment.id)} disabled={cargando}>
                            Borrar
                        </button>
                    </div>
                </article>
            ))}

            <h3>{editandoId ? "Editar comentario" : "Agregar comentario"}</h3>
            <textarea
                value={texto}
                onChange={(event) => setTexto(event.target.value)}
                placeholder="Escribí tu comentario..."
                rows={4}
                disabled={cargando}
            />
            <label>
                Rating (0 a 10)
                <input
                    type="number"
                    min="0"
                    max="10"
                    step="0"
                    value={rating || ""}
                    onChange={(event) => setRating(Number(event.target.value))}
                    disabled={cargando}
                />
            </label>
            <button type="button" onClick={() => void handleSave()} disabled={cargando}>
                {cargando ? "Guardando..." : editandoId ? "Guardar cambios" : "Comentar"}
            </button>
            {editandoId && (
                <button type="button" onClick={resetForm} disabled={cargando}>
                    Cancelar
                </button>
            )}
            {error && <p role="alert">{error}</p>}
        </section>
    );
}

export default CommentUser;

import { createContext, useContext, useState, useEffect, type ReactNode, type Dispatch, type SetStateAction } from 'react'

function useLocalStorage<T>(clave: string, valorInicial: T): [T, Dispatch<SetStateAction<T>>] {
    const [valor, setValor] = useState<T>(() => {
        const guardado = localStorage.getItem(clave)
        return guardado ? (JSON.parse(guardado) as T) : valorInicial
    })

    useEffect(() => {
        localStorage.setItem(clave, JSON.stringify(valor))
    }, [clave, valor])

    return [valor, setValor]
}

interface TemaContextType {
    tema: string
    cambiarTema: () => void
}

export const TemaContext = createContext<TemaContextType | undefined>(undefined)

export function TemaProvider({ children }: { children: ReactNode }) {
    const [tema, setTema] = useLocalStorage("tema", "claro")

    const cambiarTema = () => setTema((tema) => tema = tema == 'claro' ? 'oscuro' : 'claro')

    return (
        <TemaContext.Provider value={{ tema, cambiarTema }}>
            {children}
        </TemaContext.Provider>
    )
}

export function useTema() {
    const contexto = useContext(TemaContext)
    if (!contexto) {
        throw new Error('useTema debe usarse dentro de un ThemeContext.Provider')
    }
    return contexto
}

export function Settings({ onBack }: { onBack: () => void }) {
    const { tema, cambiarTema } = useTema()

    return (
        <div className="settings-page">
            <button type="button" className="navigation-button" onClick={onBack}>
                Volver a películas
            </button>
            <h1>Configuración</h1>
            <h2>Apariencia</h2>
            <p>Tema actual: {tema === 'claro' ? 'Claro' : 'Oscuro'}</p>
            <button type="button" className="theme-button" onClick={cambiarTema}>
                Cambiar a tema {tema === 'claro' ? 'oscuro' : 'claro'}
            </button>
        </div>
    )
}
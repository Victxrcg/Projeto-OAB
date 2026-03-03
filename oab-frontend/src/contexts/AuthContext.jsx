import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [advogado, setAdvogado] = useState(null)
  const [loading, setLoading] = useState(true)

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
    withCredentials: true,
  })

  useEffect(() => { verificarSessao() }, [])

  const verificarSessao = async () => {
    try {
      const response = await api.get('/auth/session')
      if (response.data.autenticado) setAdvogado(response.data.advogado)
    } catch { setAdvogado(null) }
    finally { setLoading(false) }
  }

  const loginPorCpf = async (cpf) => {
    try {
      const response = await api.post('/auth/login', { cpf })
      setAdvogado(response.data.advogado)
      return { success: true, data: response.data }
    } catch (error) {
      return { success: false, error: error.response?.data?.erro || 'Erro ao acessar' }
    }
  }

  const verificarCpf = async (cpf) => {
    try {
      const response = await api.post('/cpf/verificar', { cpf })
      return response.data
    } catch { return { existe: false } }
  }

  const logout = async () => {
    try { await api.post('/auth/logout'); setAdvogado(null) }
    catch (error) { console.error('Erro ao fazer logout:', error) }
  }

  const value = { advogado, isAuthenticated: !!advogado, loading, loginPorCpf, verificarCpf, logout, api }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

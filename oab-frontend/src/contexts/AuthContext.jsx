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
    baseURL: '/api',
    withCredentials: true,
  })

  useEffect(() => {
    verificarSessao()
  }, [])

  const verificarSessao = async () => {
    try {
      const response = await api.get('/auth/session')
      if (response.data.autenticado) {
        setAdvogado(response.data.advogado)
      }
    } catch (error) {
      setAdvogado(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (cpf, senha) => {
    try {
      const response = await api.post('/auth/login', { cpf, senha })
      setAdvogado(response.data.advogado)
      return { success: true, data: response.data }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.erro || 'Erro ao fazer login'
      }
    }
  }

  const register = async (dados) => {
    try {
      const response = await api.post('/auth/register', dados)
      setAdvogado(response.data.advogado)
      return { success: true, data: response.data }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.erro || 'Erro ao cadastrar'
      }
    }
  }

  const logout = async () => {
    try {
      await api.post('/auth/logout')
      setAdvogado(null)
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  const verificarCpf = async (cpf) => {
    try {
      const response = await api.post('/cpf/verificar', { cpf })
      return response.data
    } catch (error) {
      return { existe: false, requer_senha: false }
    }
  }

  const value = {
    advogado,
    isAuthenticated: !!advogado,
    loading,
    login,
    register,
    logout,
    verificarCpf,
    api,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}


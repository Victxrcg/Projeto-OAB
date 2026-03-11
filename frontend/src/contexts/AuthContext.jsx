import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { MOCK_CPF_MARIA, mockAdvogadoMaria } from '../mock/mockData'
import { createMockApi } from '../mock/mockApi'

const AuthContext = createContext()

// Mock ativo por padrão (sem backend). Para usar o backend: VITE_USE_MOCK=false no .env
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'
const MOCK_STORAGE_KEY = 'mock_advogado'

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [advogado, setAdvogado] = useState(null)
  const [loading, setLoading] = useState(true)

  const apiReal = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
    withCredentials: true,
  })

  const mockApi = createMockApi()
  const api = USE_MOCK ? mockApi : apiReal

  useEffect(() => { verificarSessao() }, [])

  const verificarSessao = async () => {
    if (USE_MOCK) {
      try {
        const stored = sessionStorage.getItem(MOCK_STORAGE_KEY)
        if (stored) setAdvogado(JSON.parse(stored))
      } catch { setAdvogado(null) }
      setLoading(false)
      return
    }
    try {
      const response = await apiReal.get('/auth/session')
      if (response.data.autenticado) setAdvogado(response.data.advogado)
    } catch { setAdvogado(null) }
    finally { setLoading(false) }
  }

  const loginPorCpf = async (cpf) => {
    const cpfLimpo = String(cpf || '').replace(/\D/g, '')
    if (USE_MOCK) {
      if (cpfLimpo !== MOCK_CPF_MARIA) {
        return { success: false, error: 'CPF não encontrado no sistema' }
      }
      setAdvogado(mockAdvogadoMaria)
      sessionStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(mockAdvogadoMaria))
      return { success: true, data: { mensagem: 'Acesso realizado com sucesso', advogado: mockAdvogadoMaria } }
    }
    try {
      const response = await apiReal.post('/auth/login', { cpf: cpfLimpo })
      setAdvogado(response.data.advogado)
      return { success: true, data: response.data }
    } catch (error) {
      return { success: false, error: error.response?.data?.erro || 'Erro ao acessar' }
    }
  }

  const verificarCpf = async (cpf) => {
    if (USE_MOCK) {
      const cpfLimpo = String(cpf || '').replace(/\D/g, '')
      return { existe: cpfLimpo === MOCK_CPF_MARIA }
    }
    try {
      const response = await apiReal.post('/cpf/verificar', { cpf })
      return response.data
    } catch { return { existe: false } }
  }

  const logout = async () => {
    if (USE_MOCK) {
      sessionStorage.removeItem(MOCK_STORAGE_KEY)
      setAdvogado(null)
      return
    }
    try {
      await apiReal.post('/auth/logout')
      setAdvogado(null)
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  const value = { advogado, isAuthenticated: !!advogado, loading, loginPorCpf, verificarCpf, logout, api }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

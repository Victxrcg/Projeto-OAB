import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Loader2, Scale, Search } from 'lucide-react'

function LoginPage() {
  const [cpf, setCpf] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { loginPorCpf, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => { if (isAuthenticated) navigate('/dashboard') }, [isAuthenticated, navigate])

  const formatarCpf = (value) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 11) return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
    return value
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const cpfLimpo = cpf.replace(/\D/g, '')
    if (cpfLimpo.length !== 11) { setError('Digite um CPF válido com 11 dígitos'); return }
    setLoading(true)
    const resultado = await loginPorCpf(cpfLimpo)
    if (resultado.success) navigate('/dashboard')
    else setError(resultado.error)
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Scale size={48} className="text-primary mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-primary">Portal de Negociações</h2>
          <p className="mt-2 text-gray-500">OAB - Simples, Rápido e Seguro</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-8">
          <p className="text-center text-gray-600 mb-6">Digite seu CPF para consultar seus débitos</p>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-2">CPF</label>
              <input id="cpf" type="text" value={cpf} onChange={(e) => { setCpf(formatarCpf(e.target.value)); setError('') }}
                placeholder="000.000.000-00" maxLength={14} autoFocus
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition text-lg text-center tracking-wider" required />
            </div>
            {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm text-center">{error}</div>}
            <button type="submit" disabled={loading || cpf.replace(/\D/g, '').length !== 11}
              className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg">
              {loading ? (<><Loader2 className="animate-spin" size={22} /> Consultando...</>) : (<><Search size={20} /> Consultar Débitos</>)}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginPage

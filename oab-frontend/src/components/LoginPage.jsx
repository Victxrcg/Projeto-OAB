import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Loader2 } from 'lucide-react'

function LoginPage() {
  const [cpf, setCpf] = useState('')
  const [senha, setSenha] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [verificandoCpf, setVerificandoCpf] = useState(false)
  const [cpfExiste, setCpfExiste] = useState(null)

  const { login, verificarCpf, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  const formatarCpf = (value) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
    }
    return value
  }

  const handleCpfChange = async (e) => {
    const value = e.target.value
    const formatted = formatarCpf(value)
    setCpf(formatted)

    const cpfLimpo = value.replace(/\D/g, '')
    if (cpfLimpo.length === 11) {
      setVerificandoCpf(true)
      try {
        const resultado = await verificarCpf(cpfLimpo)
        setCpfExiste(resultado.existe)
        if (!resultado.existe) {
          setError('CPF não cadastrado. Você será redirecionado para o cadastro.')
          setTimeout(() => {
            navigate('/register', { state: { cpf: cpfLimpo } })
          }, 2000)
        }
      } catch (err) {
        console.error('Erro ao verificar CPF:', err)
      } finally {
        setVerificandoCpf(false)
      }
    } else {
      setCpfExiste(null)
      setError('')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!cpf || !senha) {
      setError('Por favor, preencha todos os campos')
      return
    }

    setLoading(true)
    const cpfLimpo = cpf.replace(/\D/g, '')
    const resultado = await login(cpfLimpo, senha)

    if (resultado.success) {
      navigate('/dashboard')
    } else {
      setError(resultado.error)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-primary">Portal da OAB</h2>
          <p className="mt-2 text-gray-600">Acesse sua conta</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-2">
                CPF
              </label>
              <div className="relative">
                <input
                  id="cpf"
                  type="text"
                  value={cpf}
                  onChange={handleCpfChange}
                  placeholder="000.000.000-00"
                  maxLength={14}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                  required
                />
                {verificandoCpf && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Loader2 className="animate-spin text-primary" size={20} />
                  </div>
                )}
              </div>
            </div>

            {cpfExiste && (
              <div>
                <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-2">
                  Senha
                </label>
                <div className="relative">
                  <input
                    id="senha"
                    type={mostrarSenha ? 'text' : 'password'}
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    placeholder="Digite sua senha"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {mostrarSenha ? 'Ocultar' : 'Mostrar'}
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !cpfExiste || verificandoCpf}
              className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Não tem uma conta?{' '}
              <a href="/register" className="text-primary hover:underline font-medium">
                Cadastre-se
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage


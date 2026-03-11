import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Loader2, User } from 'lucide-react'
import fundoImg from '../assets/fundo.png'

const PONTOS_ANIMADOS = [
  { left: '77.7429%', top: '86.5147%', delay: '1.37511s', duration: '3.73399s' },
  { left: '87.3736%', top: '4.12896%', delay: '0.899986s', duration: '3.55821s' },
  { left: '18.1829%', top: '24.6043%', delay: '1.0853s', duration: '3.08447s' },
  { left: '1.75142%', top: '0.323231%', delay: '0.722863s', duration: '3.71825s' },
  { left: '71.0793%', top: '97.8899%', delay: '1.8297s', duration: '3.71335s' },
  { left: '79.3132%', top: '19.8985%', delay: '0.432613s', duration: '2.7603s' },
  { left: '55.9545%', top: '91.9623%', delay: '0.563066s', duration: '3.82704s' },
  { left: '7.0952%', top: '97.5162%', delay: '1.77635s', duration: '2.9855s' },
  { left: '67.1333%', top: '30.7858%', delay: '1.23511s', duration: '3.79093s' },
  { left: '67.2318%', top: '27.1175%', delay: '0.0436816s', duration: '2.48697s' },
  { left: '41.1964%', top: '39.1683%', delay: '1.52662s', duration: '2.02986s' },
  { left: '93.3359%', top: '29.3838%', delay: '0.989894s', duration: '2.5062s' },
  { left: '6.86288%', top: '15.0905%', delay: '1.67761s', duration: '2.04071s' },
  { left: '79.7313%', top: '89.8778%', delay: '1.33163s', duration: '2.86423s' },
  { left: '95.7856%', top: '66.8234%', delay: '1.27025s', duration: '3.27778s' },
  { left: '78.6187%', top: '26.4003%', delay: '0.534533s', duration: '2.29054s' },
  { left: '48.7358%', top: '28.9004%', delay: '0.48401s', duration: '3.81556s' },
  { left: '27.8397%', top: '2.38383%', delay: '1.74447s', duration: '3.37978s' },
  { left: '48.5004%', top: '31.7767%', delay: '0.643562s', duration: '2.66201s' },
  { left: '0.499368%', top: '43.0786%', delay: '0.108624s', duration: '2.08376s' },
  { left: '14.9838%', top: '8.76798%', delay: '1.49511s', duration: '3.70275s' },
  { left: '89.9502%', top: '27.5149%', delay: '0.058613s', duration: '2.98589s' },
  { left: '99.5875%', top: '34.1439%', delay: '0.0447427s', duration: '3.49493s' },
  { left: '31.8427%', top: '14.0984%', delay: '1.37444s', duration: '3.68534s' },
  { left: '49.3099%', top: '64.8531%', delay: '0.618317s', duration: '3.91536s' },
  { left: '12.3438%', top: '57.5889%', delay: '1.87007s', duration: '2.88554s' },
  { left: '1.41235%', top: '82.5045%', delay: '1.08354s', duration: '3.4272s' },
  { left: '81.6786%', top: '64.2949%', delay: '0.868002s', duration: '3.17722s' },
  { left: '2.06537%', top: '66.0895%', delay: '0.442893s', duration: '2.95768s' },
  { left: '64.8172%', top: '36.3025%', delay: '1.37991s', duration: '2.71722s' },
  { left: '43.2402%', top: '84.0075%', delay: '1.03659s', duration: '2.01683s' },
  { left: '80.114%', top: '74.1585%', delay: '0.967059s', duration: '3.22551s' },
  { left: '47.4771%', top: '9.77993%', delay: '1.77215s', duration: '3.77097s' },
  { left: '0.428808%', top: '17.6365%', delay: '0.024305s', duration: '2.16662s' },
  { left: '80.4637%', top: '43.6828%', delay: '0.321403s', duration: '2.79201s' },
  { left: '53.0873%', top: '94.932%', delay: '0.896879s', duration: '3.30668s' },
  { left: '72.6038%', top: '18.6631%', delay: '0.85713s', duration: '2.34624s' },
  { left: '65.1932%', top: '63.2093%', delay: '1.31933s', duration: '3.21432s' },
  { left: '8.76874%', top: '63.5308%', delay: '0.231195s', duration: '2.11069s' },
  { left: '36.4064%', top: '48.8509%', delay: '0.663394s', duration: '3.99993s' },
  { left: '43.8375%', top: '36.3027%', delay: '1.28487s', duration: '2.55018s' },
  { left: '17.5754%', top: '63.2973%', delay: '0.94945s', duration: '3.9511s' },
  { left: '45.9649%', top: '4.50478%', delay: '0.248637s', duration: '3.7418s' },
  { left: '2.87646%', top: '56.1634%', delay: '0.432974s', duration: '2.89159s' },
  { left: '55.6296%', top: '47.0602%', delay: '0.81011s', duration: '2.50414s' },
  { left: '98.37%', top: '36.7502%', delay: '0.841638s', duration: '3.41677s' },
  { left: '0.62723%', top: '2.23168%', delay: '0.254435s', duration: '2.60111s' },
  { left: '69.9848%', top: '87.267%', delay: '0.819901s', duration: '3.7512s' },
  { left: '92.8338%', top: '86.3182%', delay: '1.45223s', duration: '3.62723s' },
  { left: '24.4764%', top: '23.9493%', delay: '0.607016s', duration: '2.86542s' },
]

function LoginPage() {
  const [cpf, setCpf] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { loginPorCpf, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard')
  }, [isAuthenticated, navigate])

  const formatarCpf = (value) => {
    const numbers = value.replace(/\D/g, '').slice(0, 11)
    return numbers
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const cpfLimpo = cpf.replace(/\D/g, '')
    if (cpfLimpo.length !== 11) {
      setError('Digite um CPF válido com 11 dígitos')
      return
    }
    setLoading(true)
    const resultado = await loginPorCpf(cpfLimpo)
    if (resultado.success) navigate('/dashboard')
    else setError(resultado.error)
    setLoading(false)
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 relative overflow-hidden p-4">
      {/* Imagem de fundo opaca */}
      <div className="absolute inset-0">
        <img src={fundoImg} alt="Background OAB" className="w-full h-full object-cover opacity-20" />
      </div>

      {/* Pontos luminosos animados */}
      <div className="absolute inset-0">
        {PONTOS_ANIMADOS.map((p, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-30 animate-pulse"
            style={{
              left: p.left,
              top: p.top,
              animationDelay: p.delay,
              animationDuration: p.duration,
            }}
          />
        ))}
      </div>

      {/* Cartão de login */}
      <div className="relative z-10 w-full max-w-sm sm:max-w-md mx-auto" style={{ opacity: 1, transform: 'none' }}>
        <div className="text-card-foreground flex flex-col gap-6 rounded-xl py-6 bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
          <div className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 has-data-[slot=card-action]:grid-cols-[1fr_auto] text-center pb-4 px-4 sm:px-6">
            <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <User className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" aria-hidden />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Acesse sua conta</h2>
            <p className="text-sm sm:text-base text-gray-600">Digite seu CPF para continuar</p>
          </div>

          <div className="space-y-4 sm:space-y-6 px-4 sm:px-6 pb-6">
            <form id="loginForm" className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="flex items-center gap-2 font-medium text-sm sm:text-base text-gray-700" htmlFor="cpf">
                  CPF
                </label>
                <input
                  type="text"
                  id="cpf"
                  value={cpf}
                  onChange={(e) => {
                    setCpf(formatarCpf(e.target.value))
                    setError('')
                  }}
                  placeholder="000.000.000-00"
                  maxLength={14}
                  autoFocus
                  className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-3 text-center text-base sm:text-lg h-12 sm:h-14 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm text-center">
                  {error}
                </div>
              )}
              <button
                type="submit"
                disabled={loading || cpf.replace(/\D/g, '').length !== 11}
                className="w-full h-12 sm:h-14 bg-gradient-to-b from-blue-500 to-blue-600 text-white font-bold shadow-md hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 px-6 py-2 rounded-lg text-base sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin w-5 h-5" />
                    Consultando...
                  </>
                ) : (
                  'Consultar'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}

export default LoginPage

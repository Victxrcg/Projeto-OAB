import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import AnuidadeCard from './AnuidadeCard'
import { Loader2, AlertCircle, CreditCard, CalendarRange, Info } from 'lucide-react'

function Dashboard() {
  const { api, advogado } = useAuth()
  const [anuidades, setAnuidades] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => { carregarAnuidades() }, [])

  const carregarAnuidades = async () => {
    try {
      setLoading(true)
      const response = await api.get('/anuidades')
      setAnuidades(response.data.anuidades)
      setError('')
    } catch (err) { setError('Erro ao carregar anuidades'); console.error(err) }
    finally { setLoading(false) }
  }

  const anuidadesPendentes = anuidades.filter(a => a.status === 'pendente' || a.status === 'vencido')
  const anuidadesPagas = anuidades.filter(a => a.status === 'pago')

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="animate-spin text-primary mx-auto mb-4" size={48} />
        <p className="text-gray-600">Carregando anuidades...</p>
      </div>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Minhas Anuidades</h1>
        <p className="text-gray-600 mt-1">
          Olá, <span className="font-semibold text-gray-900">{advogado?.nome_completo?.toUpperCase()}</span>!
          {' '}Confira suas oportunidades de pagamento e regularize sua situação com a OAB.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
          <AlertCircle size={20} />{error}
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 mb-8">
        <p className="text-primary font-semibold mb-3">Negocie todas as suas anuidades com as melhores condições</p>
        <div className="flex flex-wrap gap-6 text-sm text-gray-700">
          <div className="flex items-center gap-2"><CreditCard size={18} className="text-primary" /><span>Pagamento no cartão, PIX ou boleto</span></div>
          <div className="flex items-center gap-2"><CalendarRange size={18} className="text-primary" /><span>Parcelamento disponível</span></div>
        </div>
      </div>

      {anuidadesPendentes.length > 0 && (
        <div className="mb-10 space-y-6">
          {anuidadesPendentes.map((a) => <AnuidadeCard key={a.id} anuidade={a} />)}
        </div>
      )}

      {anuidadesPagas.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Info size={20} className="text-green-600" /> Anuidades Quitadas
          </h2>
          <div className="space-y-4">
            {anuidadesPagas.map((a) => <AnuidadeCard key={a.id} anuidade={a} />)}
          </div>
        </div>
      )}

      {anuidades.length === 0 && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-600 text-lg">Nenhuma anuidade encontrada.</p>
        </div>
      )}
    </div>
  )
}

export default Dashboard

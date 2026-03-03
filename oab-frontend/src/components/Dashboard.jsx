import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import AnuidadeCard from './AnuidadeCard'
import { Loader2, AlertCircle } from 'lucide-react'

function Dashboard() {
  const { api, advogado } = useAuth()
  const [anuidades, setAnuidades] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    carregarAnuidades()
  }, [])

  const carregarAnuidades = async () => {
    try {
      setLoading(true)
      const response = await api.get('/anuidades')
      setAnuidades(response.data.anuidades)
      setError('')
    } catch (err) {
      setError('Erro ao carregar anuidades')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const anuidadesPendentes = anuidades.filter(a => a.status === 'pendente' || a.status === 'vencido')
  const anuidadesPagas = anuidades.filter(a => a.status === 'pago')
  const totalPendente = anuidadesPendentes.reduce((sum, a) => sum + a.valor_atual, 0)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin text-primary mx-auto mb-4" size={48} />
          <p className="text-gray-600">Carregando anuidades...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Bem-vindo, {advogado?.nome_completo}!
        </h1>
        <p className="text-gray-600">Gerencie suas anuidades e pendências</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Pendente</h3>
          <p className="text-3xl font-bold text-red-600">
            R$ {totalPendente.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Anuidades Pendentes</h3>
          <p className="text-3xl font-bold text-primary">{anuidadesPendentes.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Anuidades Pagas</h3>
          <p className="text-3xl font-bold text-green-600">{anuidadesPagas.length}</p>
        </div>
      </div>

      {/* Anuidades Pendentes */}
      {anuidadesPendentes.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Anuidades Pendentes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {anuidadesPendentes.map((anuidade) => (
              <AnuidadeCard
                key={anuidade.id}
                anuidade={anuidade}
                onUpdate={carregarAnuidades}
              />
            ))}
          </div>
        </div>
      )}

      {/* Anuidades Pagas */}
      {anuidadesPagas.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Anuidades Pagas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {anuidadesPagas.map((anuidade) => (
              <AnuidadeCard
                key={anuidade.id}
                anuidade={anuidade}
                onUpdate={carregarAnuidades}
              />
            ))}
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


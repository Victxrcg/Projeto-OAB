import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Loader2, AlertCircle, FileText, CheckCircle, CreditCard, Calendar, ChevronDown, ChevronUp, Phone } from 'lucide-react'

const TELEFONE_ATENDIMENTO = '0800 123 4060'
const fmt = (value) =>
  Number(value || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const formatDate = (iso) => {
  if (!iso) return '-'
  return new Date(iso.replace('Z', '') + (iso.includes('T') ? '' : 'T00:00:00')).toLocaleDateString('pt-BR')
}

function AcordoCardPago({ acordo }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-green-200 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
          <CheckCircle className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900">{acordo.descricao}</h3>
          <p className="text-sm text-gray-500 mt-0.5">
            {acordo.forma_pagamento_label} • Pago em {formatDate(acordo.data_quitacao)}
          </p>
          <p className="text-lg font-semibold text-green-700 mt-1">R$ {fmt(acordo.valor_total)}</p>
        </div>
      </div>
      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
        Pago
      </span>
    </div>
  )
}

function AcordoCardEmAndamento({ acordo, api }) {
  const [expanded, setExpanded] = useState(false)
  const [detalhe, setDetalhe] = useState(null)
  const [loadingDetalhe, setLoadingDetalhe] = useState(false)

  useEffect(() => {
    if (expanded && !detalhe && api) {
      setLoadingDetalhe(true)
      api.get(`/acordos/${acordo.id}`).then((r) => {
        setDetalhe(r.data)
      }).catch(() => setDetalhe(null)).finally(() => setLoadingDetalhe(false))
    }
  }, [expanded, acordo.id, api, detalhe])

  const parcelas = detalhe?.parcelas || []

  return (
    <div className="bg-white rounded-xl shadow-sm border border-orange-200 overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full p-5 text-left hover:bg-orange-50/50 transition-colors flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
            <CreditCard className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">{acordo.descricao}</h3>
            <p className="text-sm text-gray-500 mt-0.5">
              {acordo.forma_pagamento_label} • {acordo.numero_parcelas}x de R$ {fmt(acordo.valor_parcela)}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Parcelas: <strong>{acordo.parcelas_pagas}/{acordo.numero_parcelas}</strong> pagas
            </p>
            {acordo.proximo_vencimento && (
              <p className="text-sm text-orange-700 mt-1 flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Próximo vencimento: {formatDate(acordo.proximo_vencimento)}
              </p>
            )}
            <p className="text-lg font-semibold text-gray-900 mt-2">Total: R$ {fmt(acordo.valor_total)}</p>
          </div>
        </div>
        <span className="flex items-center gap-2 shrink-0">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700 border border-orange-200">
            Em andamento
          </span>
          {expanded ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
        </span>
      </button>

      {expanded && (
        <div className="border-t border-orange-100 bg-orange-50/30 px-5 pb-5 pt-2">
          {loadingDetalhe ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="animate-spin text-orange-600" size={28} />
            </div>
          ) : parcelas.length > 0 ? (
            <div className="overflow-x-auto rounded-lg border border-orange-200 bg-white">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-orange-50 border-b border-orange-200">
                    <th className="text-left py-2.5 px-3 font-semibold text-gray-700">Parcela</th>
                    <th className="text-left py-2.5 px-3 font-semibold text-gray-700">Vencimento</th>
                    <th className="text-left py-2.5 px-3 font-semibold text-gray-700">Valor</th>
                    <th className="text-left py-2.5 px-3 font-semibold text-gray-700">Situação</th>
                  </tr>
                </thead>
                <tbody>
                  {parcelas.map((p) => (
                    <tr key={p.numero} className="border-b border-gray-100 last:border-0">
                      <td className="py-2.5 px-3 text-gray-900">{p.numero}/{acordo.numero_parcelas}</td>
                      <td className="py-2.5 px-3 text-gray-700">{formatDate(p.vencimento)}</td>
                      <td className="py-2.5 px-3 font-medium text-gray-900">R$ {fmt(p.valor)}</td>
                      <td className="py-2.5 px-3">
                        {p.status === 'pago' && <span className="font-semibold text-green-700">PAGO</span>}
                        {p.status === 'vencido' && (
                          <span className="font-semibold text-red-700">
                            VENCIDO (LIGUE {TELEFONE_ATENDIMENTO})
                            <a href={`tel:${TELEFONE_ATENDIMENTO.replace(/\s/g, '')}`} className="inline-flex items-center ml-1 text-primary" aria-label="Ligar"><Phone size={14} /></a>
                          </span>
                        )}
                        {p.status === 'pendente' && <span className="text-gray-500">Pendente</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-gray-500 py-4">Nenhuma parcela encontrada.</p>
          )}
        </div>
      )}
    </div>
  )
}

function AcordoCard({ acordo, api }) {
  const isPago = acordo.status === 'pago'
  const isEmAndamento = acordo.status === 'em_andamento'

  if (isPago) return <AcordoCardPago acordo={acordo} />
  if (isEmAndamento) return <AcordoCardEmAndamento acordo={acordo} api={api} />
  return null
}

function MeusAcordosPage() {
  const { api } = useAuth()
  const [acordos, setAcordos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    carregarAcordos()
  }, [])

  const carregarAcordos = async () => {
    try {
      setLoading(true)
      const response = await api.get('/acordos')
      setAcordos(response.data.acordos || [])
      setError('')
    } catch (err) {
      setError('Erro ao carregar acordos')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const acordosEmAndamento = acordos.filter((a) => a.status === 'em_andamento')
  const acordosQuitados = acordos.filter((a) => a.status === 'pago')

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin text-primary mx-auto mb-4" size={48} />
          <p className="text-gray-600">Carregando acordos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Meus acordos</h1>
        <p className="text-gray-600 mt-1">
          Acompanhe os acordos quitados e os que estão em andamento (parcelamento).
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {acordosEmAndamento.length > 0 && (
        <section className="mb-10">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Em andamento</h2>
          <div className="space-y-4">
            {acordosEmAndamento.map((acordo) => (
              <AcordoCard key={acordo.id} acordo={acordo} api={api} />
            ))}
          </div>
        </section>
      )}

      {acordosQuitados.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Pagos</h2>
          <div className="space-y-4">
            {acordosQuitados.map((acordo) => (
              <AcordoCard key={acordo.id} acordo={acordo} api={api} />
            ))}
          </div>
        </section>
      )}

      {acordos.length === 0 && (
        <div className="bg-white rounded-xl shadow p-12 text-center">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Nenhum acordo encontrado.</p>
        </div>
      )}
    </div>
  )
}

export default MeusAcordosPage

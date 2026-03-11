import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, ChevronRight, ChevronDown } from 'lucide-react'

const fmt = (value) => Number(value || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const formatDate = (iso) => { if (!iso) return '-'; return new Date(iso + 'T00:00:00').toLocaleDateString('pt-BR') }

function StatusBadge({ status }) {
  const styles = {
    'Quitado': 'bg-green-100 text-green-700 border-green-200',
    'A receber': 'bg-orange-50 text-orange-700 border-orange-200',
    'pendente': 'bg-orange-50 text-orange-700 border-orange-200',
    'pago': 'bg-green-100 text-green-700 border-green-200',
    'vencido': 'bg-red-100 text-red-700 border-red-200',
  }
  const labels = { 'pendente': 'A receber', 'pago': 'Quitado', 'vencido': 'A receber' }
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[status] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
      {labels[status] || status}
    </span>
  )
}

function AnuidadeCard({ anuidade }) {
  const navigate = useNavigate()
  const [mostrarDetalhes, setMostrarDetalhes] = useState(false)
  const isPago = anuidade.status === 'pago' || anuidade.status_debito === 'Quitado'

  if (isPago) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-green-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle size={22} className="text-green-500" />
            <h3 className="text-lg font-bold text-gray-900">Anuidade {anuidade.ano}</h3>
          </div>
          <StatusBadge status="Quitado" />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-gray-200">
        <h3 className="text-lg font-bold text-gray-900">Anuidade {anuidade.ano}</h3>
        <StatusBadge status={anuidade.status_debito || anuidade.status} />
      </div>

      <div className="px-6 py-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Identificação</h4>
            <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
              <span className="text-gray-500">Descrição</span>
              <span className="text-gray-900 font-medium">{anuidade.descricao_cobranca || `Anuidade de ${anuidade.ano}`}</span>
              <span className="text-gray-500">Nº OAB</span>
              <span className="text-gray-900 font-medium">{anuidade.numero_oab || '-'}</span>
              <span className="text-gray-500">Vencimento</span>
              <span className="text-gray-900 font-medium">{formatDate(anuidade.data_vencimento_original || anuidade.data_vencimento)}</span>
              <span className="text-gray-500">Parcela</span>
              <span className="text-gray-900 font-medium">{anuidade.situacao_parcela || '-'}</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Valor</h4>
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">Total Atualizado</span>
                <span className="text-xl font-bold text-red-600">R$ {fmt(anuidade.valor_total_atualizado || anuidade.valor_atual)}</span>
              </div>
              <button onClick={() => setMostrarDetalhes(!mostrarDetalhes)}
                className="flex items-center gap-1 text-xs text-primary hover:text-blue-700 mt-2 transition-colors">
                <ChevronDown size={14} className={`transition-transform ${mostrarDetalhes ? 'rotate-180' : ''}`} />
                {mostrarDetalhes ? 'Ocultar detalhes' : 'Ver detalhes'}
              </button>
              {mostrarDetalhes && (
                <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Valor Principal</span>
                    <span className="text-gray-900 font-medium">R$ {fmt(anuidade.valor_principal || anuidade.valor_original)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Multa</span>
                    <span className={anuidade.multa > 0 ? 'text-red-600 font-medium' : 'text-gray-400'}>R$ {fmt(anuidade.multa)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Juros</span>
                    <span className={anuidade.juros > 0 ? 'text-red-600 font-medium' : 'text-gray-400'}>R$ {fmt(anuidade.juros)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 pb-5">
        <div className="flex justify-end">
          <button onClick={() => navigate(`/pagamento/${anuidade.id}`)}
            className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
            Ver Opções de Pagamento <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default AnuidadeCard

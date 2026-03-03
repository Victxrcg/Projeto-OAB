import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Calendar, DollarSign, AlertCircle, CheckCircle, CreditCard, FileText } from 'lucide-react'

function AnuidadeCard({ anuidade, onUpdate }) {
  const { api } = useAuth()
  const [mostrarOpcoes, setMostrarOpcoes] = useState(false)
  const [opcoesPagamento, setOpcoesPagamento] = useState(null)
  const [loading, setLoading] = useState(false)
  const [processando, setProcessando] = useState(false)

  const getStatusColor = (status) => {
    switch (status) {
      case 'pago':
        return 'bg-green-100 text-green-800'
      case 'vencido':
        return 'bg-red-100 text-red-800'
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'pago':
        return 'Pago'
      case 'vencido':
        return 'Vencido'
      case 'pendente':
        return 'Pendente'
      default:
        return status
    }
  }

  const simularPagamento = async (forma) => {
    try {
      setLoading(true)
      const response = await api.post(`/anuidades/${anuidade.id}/simular`, {
        forma_pagamento: forma,
        numero_parcelas: forma === 'parcelado' ? 3 : 1,
      })
      setOpcoesPagamento(response.data)
      setMostrarOpcoes(true)
    } catch (error) {
      console.error('Erro ao simular pagamento:', error)
      alert('Erro ao simular pagamento')
    } finally {
      setLoading(false)
    }
  }

  const processarPagamento = async (tipo, valor, parcelas = 1) => {
    try {
      setProcessando(true)
      const endpoint = tipo === 'cartao' ? '/pagamentos/cartao' : '/pagamentos/boleto'
      await api.post(endpoint, {
        anuidade_id: anuidade.id,
        valor_pago: valor,
        numero_parcelas: parcelas,
      })
      alert('Pagamento processado com sucesso!')
      setMostrarOpcoes(false)
      onUpdate()
    } catch (error) {
      console.error('Erro ao processar pagamento:', error)
      alert('Erro ao processar pagamento')
    } finally {
      setProcessando(false)
    }
  }

  if (anuidade.status === 'pago') {
    return (
      <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">Anuidade {anuidade.ano}</h3>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(anuidade.status)}`}>
            {getStatusText(anuidade.status)}
          </span>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-600">
            <CheckCircle size={18} className="text-green-500" />
            <span>Anuidade quitada</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 border-l-4 border-primary hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900">Anuidade {anuidade.ano}</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(anuidade.status)}`}>
          {getStatusText(anuidade.status)}
        </span>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar size={18} />
          <span>Vencimento: {new Date(anuidade.data_vencimento).toLocaleDateString('pt-BR')}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <DollarSign size={18} />
          <span className="font-semibold text-lg text-gray-900">
            R$ {anuidade.valor_atual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>
        {anuidade.desconto_maximo > 0 && (
          <div className="flex items-center gap-2 text-green-600">
            <AlertCircle size={18} />
            <span>Desconto à vista: {anuidade.desconto_maximo}%</span>
          </div>
        )}
      </div>

      {!mostrarOpcoes ? (
        <div className="space-y-2">
          <button
            onClick={() => simularPagamento('vista')}
            disabled={loading}
            className="w-full bg-primary text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? 'Carregando...' : 'Ver opções de pagamento'}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {opcoesPagamento?.opcoes?.map((opcao, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              {opcao.tipo === 'vista' ? (
                <div>
                  <h4 className="font-semibold mb-2">Pagamento à Vista</h4>
                  <div className="space-y-1 text-sm mb-3">
                    <p>Valor original: R$ {opcao.valor_original.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    <p className="text-green-600">
                      Desconto: {opcao.desconto_percentual}% (Economia: R$ {opcao.economia.toLocaleString('pt-BR', { minimumFractionDigits: 2 })})
                    </p>
                    <p className="font-bold text-lg">
                      Valor final: R$ {opcao.valor_final.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => processarPagamento('cartao', opcao.valor_final)}
                      disabled={processando}
                      className="bg-primary text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
                    >
                      <CreditCard size={16} />
                      Cartão
                    </button>
                    <button
                      onClick={() => processarPagamento('boleto', opcao.valor_final)}
                      disabled={processando}
                      className="bg-gray-700 text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
                    >
                      <FileText size={16} />
                      Boleto
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <h4 className="font-semibold mb-2">Pagamento Parcelado</h4>
                  <div className="space-y-1 text-sm mb-3">
                    <p>Valor original: R$ {opcao.valor_original.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    <p>{opcao.numero_parcelas}x de R$ {opcao.valor_parcela.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    <p className="text-red-600">Juros: R$ {opcao.juros_total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    <p className="font-bold text-lg">
                      Total: R$ {opcao.valor_total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => processarPagamento('cartao', opcao.valor_total, opcao.numero_parcelas)}
                      disabled={processando}
                      className="bg-primary text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
                    >
                      <CreditCard size={16} />
                      Cartão
                    </button>
                    <button
                      onClick={() => processarPagamento('boleto', opcao.valor_total, opcao.numero_parcelas)}
                      disabled={processando}
                      className="bg-gray-700 text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
                    >
                      <FileText size={16} />
                      Boleto
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
          <button
            onClick={() => {
              setMostrarOpcoes(false)
              setOpcoesPagamento(null)
            }}
            className="w-full text-gray-600 hover:text-gray-800 text-sm"
          >
            Voltar
          </button>
        </div>
      )}
    </div>
  )
}

export default AnuidadeCard


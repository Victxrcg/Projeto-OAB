import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { ArrowLeft, DollarSign, CreditCard, FileText, Loader2, CheckCircle, Lock, Copy } from 'lucide-react'

const fmt = (value) => Number(value || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

function gerarCodigoPix() {
  let code = '00020101021226900014br.gov.bcb.pix2568'
  for (let i = 0; i < 40; i++) code += Math.floor(Math.random() * 10)
  return code
}

function gerarCodigoBarras() {
  let code = '23793.38128 '
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 5; j++) code += Math.floor(Math.random() * 10)
    code += '.'
    for (let j = 0; j < 5; j++) code += Math.floor(Math.random() * 10)
    if (i < 3) code += ' '
  }
  return code
}

function PagamentoPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { api } = useAuth()

  const [anuidade, setAnuidade] = useState(null)
  const [loading, setLoading] = useState(true)
  const [processando, setProcessando] = useState(false)
  const [etapa, setEtapa] = useState('escolher')
  const [metodo, setMetodo] = useState(null)
  const [copiado, setCopiado] = useState(false)
  const [codigoPix] = useState(gerarCodigoPix)
  const [codigoBarras] = useState(gerarCodigoBarras)

  useEffect(() => { carregarAnuidade() }, [id])

  const carregarAnuidade = async () => {
    try { const r = await api.get(`/anuidades/${id}`); setAnuidade(r.data) }
    catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const valorTotal = anuidade?.valor_total_atualizado || anuidade?.valor_atual || 0
  const valorOriginal = anuidade?.valor_principal || anuidade?.valor_original || 0
  const valorParcela10x = valorTotal / 10
  const nomeMetodo = { pix: 'PIX', cartao: 'Cartão de Crédito', boleto: 'Boleto Bancário' }

  const escolherMetodo = (m) => { setMetodo(m); setEtapa('finalizar') }

  const confirmarPagamento = async () => {
    try {
      setProcessando(true)
      const endpoint = metodo === 'cartao' ? '/pagamentos/cartao' : '/pagamentos/boleto'
      await api.post(endpoint, { anuidade_id: Number(id), valor_pago: valorTotal, numero_parcelas: metodo === 'cartao' ? 10 : 1 })
      setEtapa('sucesso')
    } catch (e) { console.error(e); alert('Erro ao processar pagamento') }
    finally { setProcessando(false) }
  }

  const copiarCodigo = (codigo) => { navigator.clipboard.writeText(codigo); setCopiado(true); setTimeout(() => setCopiado(false), 2000) }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" size={48} /></div>

  if (etapa === 'sucesso') return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <CheckCircle size={64} className="text-green-500 mx-auto mb-6" />
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Pagamento realizado!</h2>
      <p className="text-gray-600 mb-8">Seu pagamento via <strong>{nomeMetodo[metodo]}</strong> foi processado com sucesso.</p>
      <button onClick={() => navigate('/dashboard')} className="bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">Voltar ao início</button>
    </div>
  )

  if (etapa === 'finalizar') return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={() => setEtapa('escolher')} className="flex items-center gap-2 text-primary font-medium mb-6 hover:text-blue-700 transition-colors border border-primary rounded-lg px-4 py-2">
        <ArrowLeft size={18} /> Voltar às opções
      </button>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Finalizar Pagamento</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Resumo */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-5">Resumo do Pedido</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Anuidade</span><span className="text-primary font-bold">{anuidade?.ano}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Forma de pagamento</span><span className="text-primary font-bold">{nomeMetodo[metodo]}</span></div>
            {metodo === 'cartao' && <div className="flex justify-between"><span className="text-gray-500">Parcelas</span><span className="text-gray-900 font-medium">10x de R$ {fmt(valorParcela10x)}</span></div>}
            <div className="border-t border-gray-200 pt-3 flex justify-between"><span className="font-bold text-gray-900">Total</span><span className="font-bold text-xl text-gray-900">R$ {fmt(valorTotal)}</span></div>
          </div>
          <div className="flex items-center gap-2 mt-6 text-green-600 text-sm"><Lock size={16} /><span>Pagamento 100% seguro</span></div>
        </div>

        {/* Detalhes do método */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          {metodo === 'pix' && (
            <div>
              <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-2"><Lock size={18} className="text-gray-400" /> Pagamento via PIX</h3>
              <p className="text-sm text-gray-500 mb-5">Escaneie o QR Code ou use o código PIX para pagar</p>
              <div className="flex justify-center mb-4">
                <div className="w-40 h-40 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <div className="text-center"><DollarSign size={32} className="text-gray-400 mx-auto mb-1" /><span className="text-xs text-gray-400">QR Code PIX</span></div>
                </div>
              </div>
              <p className="text-xs text-gray-400 text-center mb-4">Escaneie o QR Code com seu app do banco</p>
              <div className="mb-4">
                <label className="text-sm font-semibold text-gray-700 block mb-2">Código PIX</label>
                <div className="flex items-center gap-2">
                  <input type="text" readOnly value={codigoPix} className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-xs text-gray-700 font-mono truncate" />
                  <button onClick={() => copiarCodigo(codigoPix)} className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"><Copy size={16} className="text-gray-600" /></button>
                </div>
                {copiado && <p className="text-xs text-green-600 mt-1">Código copiado!</p>}
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-5">
                <p className="text-sm font-semibold text-gray-800 mb-2">Instruções de pagamento</p>
                <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
                  <li>Abra o app do seu banco</li><li>Selecione a opção PIX</li><li>Escaneie o QR Code ou cole o código</li><li>Confirme o pagamento</li>
                </ul>
              </div>
              <button onClick={confirmarPagamento} disabled={processando}
                className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {processando ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} />}
                {processando ? 'Processando...' : 'Pagamento realizado'}
              </button>
            </div>
          )}

          {metodo === 'cartao' && (
            <div>
              <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-2"><CreditCard size={18} className="text-primary" /> Pagamento com Cartão</h3>
              <p className="text-sm text-gray-500 mb-5">Preencha os dados do seu cartão de crédito</p>
              <div className="space-y-4 mb-6">
                <div><label className="text-sm font-medium text-gray-700 block mb-1">Número do Cartão</label><input type="text" placeholder="0000 0000 0000 0000" maxLength={19} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none" /></div>
                <div><label className="text-sm font-medium text-gray-700 block mb-1">Nome no Cartão</label><input type="text" placeholder="Como aparece no cartão" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-sm font-medium text-gray-700 block mb-1">Validade</label><input type="text" placeholder="MM/AA" maxLength={5} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none" /></div>
                  <div><label className="text-sm font-medium text-gray-700 block mb-1">CVV</label><input type="text" placeholder="000" maxLength={4} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none" /></div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Parcelas</label>
                  <select className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none">
                    <option>1x de R$ {fmt(valorTotal)} (à vista)</option><option>2x de R$ {fmt(valorTotal / 2)}</option><option>3x de R$ {fmt(valorTotal / 3)}</option><option>6x de R$ {fmt(valorTotal / 6)}</option><option>10x de R$ {fmt(valorParcela10x)}</option>
                  </select>
                </div>
              </div>
              <button onClick={confirmarPagamento} disabled={processando}
                className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {processando ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} />}
                {processando ? 'Processando...' : 'Confirmar Pagamento'}
              </button>
            </div>
          )}

          {metodo === 'boleto' && (
            <div>
              <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-2"><FileText size={18} className="text-gray-600" /> Boleto Bancário</h3>
              <p className="text-sm text-gray-500 mb-5">O boleto será gerado com vencimento para 5 dias úteis</p>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 mb-5">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Linha digitável</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-sm text-gray-800 font-mono break-all">{codigoBarras}</code>
                  <button onClick={() => copiarCodigo(codigoBarras)} className="p-2.5 bg-white hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors shrink-0"><Copy size={16} className="text-gray-600" /></button>
                </div>
                {copiado && <p className="text-xs text-green-600 mt-1">Código copiado!</p>}
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-5">
                <p className="text-sm font-semibold text-gray-800 mb-2">Instruções</p>
                <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
                  <li>Copie a linha digitável acima</li><li>Acesse o app do seu banco</li><li>Escolha pagar por boleto/código de barras</li><li>Cole o código e confirme o pagamento</li>
                </ul>
              </div>
              <button onClick={confirmarPagamento} disabled={processando}
                className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {processando ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} />}
                {processando ? 'Processando...' : 'Pagamento realizado'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-primary font-medium mb-6 hover:text-blue-700 transition-colors border border-primary rounded-lg px-4 py-2">
        <ArrowLeft size={18} /> Voltar
      </button>
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-8">
        <h2 className="text-lg font-bold text-gray-900">Anuidade {anuidade?.ano}</h2>
        <p className="text-sm text-gray-600 mt-1">Valor original: R$ {fmt(valorOriginal)} | Valor atualizado: <span className="font-semibold text-red-600">R$ {fmt(valorTotal)}</span></p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="relative bg-white rounded-xl border-2 border-gray-200 hover:border-green-500 p-6 cursor-pointer transition-all hover:shadow-lg flex flex-col items-center text-center" onClick={() => escolherMetodo('pix')}>
          <span className="absolute -top-3 left-4 bg-green-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded">Recomendado</span>
          <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center mb-4 mt-2"><DollarSign size={28} className="text-green-600" /></div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">PIX</h3>
          <p className="text-xs text-gray-500 mb-4">Pagamento instantâneo</p>
          <span className="text-xs text-gray-500">Valor Total</span>
          <span className="text-2xl font-bold text-gray-900 mb-4">R$ {fmt(valorTotal)}</span>
          <button className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors mt-auto">Realizar pagamento</button>
        </div>
        <div className="bg-white rounded-xl border-2 border-gray-200 hover:border-primary p-6 cursor-pointer transition-all hover:shadow-lg flex flex-col items-center text-center" onClick={() => escolherMetodo('cartao')}>
          <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-4"><CreditCard size={28} className="text-primary" /></div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">CARTÃO DE CRÉDITO</h3>
          <p className="text-xs text-gray-500 mb-4">Pague em até 10x sem juros</p>
          <span className="text-xs text-gray-500">Valor total</span>
          <span className="text-2xl font-bold text-gray-900 mb-2">R$ {fmt(valorTotal)}</span>
          <div className="text-primary text-sm font-semibold mb-1">Parcelamento</div>
          <div className="text-sm text-gray-700 font-medium mb-1">10x de R$ {fmt(valorParcela10x)}</div>
          <div className="text-xs text-gray-400 mb-4">Parcelas fixas &bull; Total: R$ {fmt(valorTotal)}</div>
          <button className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors mt-auto">Realizar pagamento</button>
        </div>
        <div className="bg-white rounded-xl border-2 border-gray-200 hover:border-primary p-6 cursor-pointer transition-all hover:shadow-lg flex flex-col items-center text-center" onClick={() => escolherMetodo('boleto')}>
          <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center mb-4"><FileText size={28} className="text-gray-600" /></div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">BOLETO BANCÁRIO</h3>
          <p className="text-xs text-gray-500 mb-4">Vencimento em 5 dias</p>
          <span className="text-xs text-gray-500">Valor total</span>
          <span className="text-2xl font-bold text-gray-900 mb-4">R$ {fmt(valorTotal)}</span>
          <button className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors mt-auto">Realizar pagamento</button>
        </div>
      </div>
    </div>
  )
}

export default PagamentoPage

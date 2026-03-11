import {
  MOCK_CPF_MARIA,
  mockAdvogadoMaria,
  mockAnuidades,
  mockAcordos,
  getMockAnuidadeById,
  getMockAcordoDetalhe,
} from './mockData'

/**
 * API mock que imita as respostas do backend para a Maria.
 * Usado quando VITE_USE_MOCK=true (não precisa do backend).
 */
export function createMockApi() {
  return {
    get(url) {
      if (url === '/auth/session') {
        const stored = sessionStorage.getItem('mock_advogado')
        const advogado = stored ? JSON.parse(stored) : null
        return Promise.resolve({
          data: advogado ? { autenticado: true, advogado } : { autenticado: false },
        })
      }
      if (url === '/anuidades') {
        return Promise.resolve({ data: { anuidades: mockAnuidades } })
      }
      if (url === '/acordos') {
        return Promise.resolve({ data: { acordos: mockAcordos } })
      }
      const acordoMatch = url.match(/^\/acordos\/(\d+)$/)
      if (acordoMatch) {
        const detalhe = getMockAcordoDetalhe(acordoMatch[1])
        if (detalhe) return Promise.resolve({ data: detalhe })
        return Promise.reject({ response: { status: 404, data: { erro: 'Acordo não encontrado' } } })
      }
      const match = url.match(/^\/anuidades\/(\d+)$/)
      if (match) {
        const anuidade = getMockAnuidadeById(match[1])
        if (anuidade) return Promise.resolve({ data: anuidade })
        return Promise.reject({ response: { status: 404, data: { erro: 'Anuidade não encontrada' } } })
      }
      return Promise.reject(new Error('Mock API: rota não mapeada'))
    },

    post(url, data) {
      if (url === '/cpf/verificar') {
        const cpf = String(data?.cpf || '').replace(/\D/g, '')
        return Promise.resolve({ data: { existe: cpf === MOCK_CPF_MARIA } })
      }
      if (url === '/auth/logout') {
        return Promise.resolve({ data: { mensagem: 'Logout realizado com sucesso' } })
      }
      if (url === '/pagamentos/cartao' || url === '/pagamentos/boleto') {
        return Promise.resolve({ data: { ok: true, mensagem: 'Pagamento processado' } })
      }
      return Promise.reject(new Error('Mock API: rota não mapeada'))
    },
  }
}

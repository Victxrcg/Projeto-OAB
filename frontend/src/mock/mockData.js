/**
 * Dados mock da advogada Maria para uso sem backend.
 * CPF de teste: 123.456.789-01 (11 dígitos: 12345678901)
 */

export const MOCK_CPF_MARIA = '12345678901'

export const mockAdvogadoMaria = {
  id: 1,
  nome_completo: 'Maria Silva',
  cpf: '12345678901',
  email: 'maria@email.com',
  telefone: '11987654321',
  numero_oab: '30143',
  data_cadastro: new Date().toISOString(),
  ativo: true,
}

export const mockAnuidades = [
  {
    id: 1,
    advogado_id: 1,
    ano: 2024,
    descricao_cobranca: 'Anuidade OAB 2024',
    numero_oab: '30143',
    valor_principal: 650.0,
    multa: 32.5,
    juros: 18.2,
    valor_total_atualizado: 700.7,
    data_vencimento_original: '2024-03-10',
    data_vencimento: '2024-03-10',
    status_debito: 'A receber',
    status: 'pendente',
    situacao_parcela: '1/1',
    desconto_maximo: 10.0,
    valor_original: 650.0,
    valor_atual: 700.7,
    data_criacao: new Date().toISOString(),
  },
  {
    id: 2,
    advogado_id: 1,
    ano: 2023,
    descricao_cobranca: 'Anuidade OAB 2023',
    numero_oab: '30143',
    valor_principal: 620.0,
    multa: 0,
    juros: 0,
    valor_total_atualizado: 620.0,
    data_vencimento_original: '2023-03-10',
    data_vencimento: '2023-03-10',
    status_debito: 'Quitado',
    status: 'pago',
    situacao_parcela: '1/1',
    desconto_maximo: 10.0,
    valor_original: 620.0,
    valor_atual: 620.0,
    data_criacao: new Date().toISOString(),
  },
]

export function getMockAnuidadeById(id) {
  const idNum = Number(id)
  return mockAnuidades.find((a) => a.id === idNum) || null
}

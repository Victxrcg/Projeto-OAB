/**
 * Dados mock da advogada Maria para uso sem backend.
 * CPF de teste: 123.456.789-01 (11 dígitos: 12345678901)
 */

export const MOCK_CPF_MARIA = '12345678901'

export const mockAdvogadoMaria = {
  id: 1,
  nome_completo: 'Maria Silva',
  cpf: '12345678901',
  email: 'maria.silva@email.com',
  telefone: '(67) 99999-1234',
  numero_oab: '30143',
  uf_oab: 'MS',
  data_cadastro: '2020-02-15T10:00:00.000Z',
  ativo: true,
  // Campos extras para futuras telas (ex.: perfil, comprovantes)
  endereco: 'Rua das Flores, 100',
  complemento: 'Sala 302',
  bairro: 'Centro',
  cidade: 'Campo Grande',
  uf: 'MS',
  cep: '79002-100',
  data_inscricao_oab: '2015-03-20',
}

export const mockAnuidades = [
  // --- Oportunidades (pendentes / vencidas) - aparecem no Dashboard ---
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
    data_criacao: '2024-01-15T08:00:00.000Z',
  },
  {
    id: 2,
    advogado_id: 1,
    ano: 2025,
    descricao_cobranca: 'Anuidade OAB 2025',
    numero_oab: '30143',
    valor_principal: 680.0,
    multa: 0,
    juros: 0,
    valor_total_atualizado: 680.0,
    data_vencimento_original: '2025-03-10',
    data_vencimento: '2025-03-10',
    status_debito: 'A receber',
    status: 'pendente',
    situacao_parcela: '1/1',
    desconto_maximo: 12.0,
    valor_original: 680.0,
    valor_atual: 680.0,
    data_criacao: '2025-01-10T08:00:00.000Z',
  },
  {
    id: 3,
    advogado_id: 1,
    ano: 2022,
    descricao_cobranca: 'Anuidade OAB 2022 - em atraso',
    numero_oab: '30143',
    valor_principal: 600.0,
    multa: 60.0,
    juros: 45.5,
    valor_total_atualizado: 705.5,
    data_vencimento_original: '2022-03-10',
    data_vencimento: '2022-03-10',
    status_debito: 'A receber',
    status: 'vencido',
    situacao_parcela: '1/1',
    desconto_maximo: 5.0,
    valor_original: 600.0,
    valor_atual: 705.5,
    data_criacao: '2022-01-10T08:00:00.000Z',
  },
  // --- Quitadas (para futura página "Quitações" / "Em andamento") ---
  {
    id: 4,
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
    data_criacao: '2023-01-12T08:00:00.000Z',
  },
  {
    id: 5,
    advogado_id: 1,
    ano: 2021,
    descricao_cobranca: 'Anuidade OAB 2021',
    numero_oab: '30143',
    valor_principal: 590.0,
    multa: 0,
    juros: 0,
    valor_total_atualizado: 590.0,
    data_vencimento_original: '2021-03-10',
    data_vencimento: '2021-03-10',
    status_debito: 'Quitado',
    status: 'pago',
    situacao_parcela: '1/1',
    desconto_maximo: 8.0,
    valor_original: 590.0,
    valor_atual: 590.0,
    data_criacao: '2021-01-08T08:00:00.000Z',
  },
]

export function getMockAnuidadeById(id) {
  const idNum = Number(id)
  return mockAnuidades.find((a) => a.id === idNum) || null
}

/**
 * Acordos da Maria: quitados (pagos) e em andamento (parcelamento).
 * Usado na página "Meus acordos".
 */
export const mockAcordos = [
  // --- Em andamento (parcelamento) ---
  {
    id: 101,
    advogado_id: 1,
    anuidade_id: 1,
    ano: 2024,
    descricao: 'Anuidade OAB 2024',
    status: 'em_andamento',
    forma_pagamento: 'cartao',
    forma_pagamento_label: 'Cartão de crédito',
    valor_total: 700.7,
    numero_parcelas: 10,
    parcelas_pagas: 4,
    valor_parcela: 70.07,
    data_acordo: '2024-03-15T14:00:00.000Z',
    proximo_vencimento: '2025-04-10',
    numero_oab: '30143',
  },
  // --- Quitados ---
  {
    id: 102,
    advogado_id: 1,
    anuidade_id: 4,
    ano: 2023,
    descricao: 'Anuidade OAB 2023',
    status: 'pago',
    forma_pagamento: 'pix',
    forma_pagamento_label: 'PIX',
    valor_total: 620.0,
    numero_parcelas: 1,
    parcelas_pagas: 1,
    valor_parcela: 620.0,
    data_acordo: '2023-03-10T10:30:00.000Z',
    data_quitacao: '2023-03-10T10:35:00.000Z',
    proximo_vencimento: null,
    numero_oab: '30143',
  },
  {
    id: 103,
    advogado_id: 1,
    anuidade_id: 5,
    ano: 2021,
    descricao: 'Anuidade OAB 2021',
    status: 'pago',
    forma_pagamento: 'boleto',
    forma_pagamento_label: 'Boleto bancário',
    valor_total: 590.0,
    numero_parcelas: 1,
    parcelas_pagas: 1,
    valor_parcela: 590.0,
    data_acordo: '2021-03-08T09:00:00.000Z',
    data_quitacao: '2021-03-12T16:00:00.000Z',
    proximo_vencimento: null,
    numero_oab: '30143',
  },
]

/** Gera parcelas para acordo em andamento (id 101). */
function gerarParcelasEmAndamento() {
  const total = 10
  const valorParcela = 70.07
  const parcelas = []
  for (let i = 1; i <= total; i++) {
    const vencimento = new Date(2024, 2 + i, 10) // 10/mar/2024 + i meses -> abr, mai, jun...
    let status = 'pendente'
    if (i <= 4) status = 'pago'
    else if (i === 5) status = 'vencido' // 5ª parcela vencida
    parcelas.push({
      numero: i,
      vencimento: vencimento.toISOString().slice(0, 10),
      valor: valorParcela,
      status,
    })
  }
  return parcelas
}

/**
 * Detalhe completo do acordo para a página "Detalhes do Acordo".
 * Inclui barra azul (matrícula, acordo, faturas, valor dívida, parcelas),
 * proposta negociada, resumo financeiro e lista de parcelas.
 */
export function getMockAcordoDetalhe(id) {
  const idNum = Number(id)
  const acordo = mockAcordos.find((a) => a.id === idNum)
  if (!acordo) return null

  const valorOriginal = acordo.valor_original ?? acordo.valor_total * 1.15
  const valorDesconto = Math.max(0, valorOriginal - acordo.valor_total)
  const valorPago = acordo.parcelas_pagas * (acordo.valor_parcela || 0)

  if (acordo.id === 101) {
    const parcelas = gerarParcelasEmAndamento()
    return {
      ...acordo,
      matricula: '17764134',
      numero_acordo: '18587',
      numero_faturas: 1,
      valor_divida: acordo.valor_total,
      proposta_tipo: 'Parcelado',
      valor_negociado: acordo.valor_total,
      valor_original: 850.0,
      valor_desconto: 149.3,
      valor_pago: 280.28,
      parcelas,
      termo_aceite: '#',
    }
  }

  if (acordo.status === 'pago') {
    return {
      ...acordo,
      matricula: '17764134',
      numero_acordo: String(10000 + idNum),
      numero_faturas: 1,
      valor_divida: acordo.valor_total,
      proposta_tipo: acordo.numero_parcelas > 1 ? 'Parcelado' : 'À vista',
      valor_negociado: acordo.valor_total,
      valor_original: valorOriginal,
      valor_desconto: valorDesconto,
      valor_pago: acordo.valor_total,
      parcelas: Array.from({ length: acordo.numero_parcelas }, (_, i) => ({
        numero: i + 1,
        vencimento: acordo.data_quitacao?.slice(0, 10) || acordo.data_acordo.slice(0, 10),
        valor: acordo.valor_parcela || acordo.valor_total,
        status: 'pago',
      })),
      termo_aceite: '#',
    }
  }

  return null
}

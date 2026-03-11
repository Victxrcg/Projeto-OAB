# Portal OAB - Documentação de Integração

## Visão Geral

O frontend é uma aplicação React (SPA) que consome uma API REST para exibir os débitos do advogado e permitir o autopagamento. Todos os dados fictícios usados na demonstração devem ser substituídos pelos dados reais do CRM.

---

## 1. Configuração da URL da API

### Modo mock (sem backend)

Para rodar o frontend **sem o backend**, use o modo mock com a advogada fictícia Maria.

No arquivo `.env` na raiz de `oab-frontend/`:

```
VITE_USE_MOCK=true
```

**CPF de teste da Maria:** `123.456.789-01` (11 dígitos: 12345678901)

Com o mock ativo, não é necessário subir o backend. O login com esse CPF abre o dashboard com anuidades de exemplo (2024 pendente e 2023 quitada) e o fluxo de pagamento funciona localmente.

Para voltar a usar o backend real, altere para `VITE_USE_MOCK=false` e suba o backend na porta 5000.

---

### Modo API real

O frontend lê a URL da API da variável de ambiente `VITE_API_URL`.

### Opção A: Variável de ambiente (antes do build)

Criar um arquivo `.env` na raiz do `oab-frontend/`:

```
VITE_API_URL=https://api.oab.org.br/v1
```

Depois rodar `npm run build`. A URL será embutida no bundle.

### Opção B: Proxy no PHP

Se a API do CRM não aceita CORS, o PHP pode atuar como proxy. Nesse caso manter `VITE_API_URL=/api` e configurar o servidor PHP para redirecionar `/api/*` para a API real do CRM.

---

## 2. Endpoints que o Frontend Consome

### 2.1 Autenticação por CPF

```
POST /auth/login
```

**Request:**
```json
{
  "cpf": "12345678901"
}
```

**Response (200):**
```json
{
  "mensagem": "Acesso realizado com sucesso",
  "advogado": {
    "id": 1,
    "nome_completo": "João Silva",
    "cpf": "12345678901",
    "email": "joao@email.com",
    "telefone": "11987654321",
    "numero_oab": "30143",
    "ativo": true
  }
}
```

**Response (404) - CPF não encontrado:**
```json
{
  "erro": "CPF não encontrado no sistema"
}
```

---

### 2.2 Verificar Sessão

```
GET /auth/session
```

**Response (200):**
```json
{
  "autenticado": true,
  "advogado": { ...mesmo formato acima... }
}
```

**Response (401):**
```json
{
  "autenticado": false
}
```

---

### 2.3 Logout

```
POST /auth/logout
```

**Response (200):**
```json
{
  "mensagem": "Logout realizado com sucesso"
}
```

---

### 2.4 Listar Débitos/Anuidades do Advogado

```
GET /anuidades
```

**Response (200):**
```json
{
  "anuidades": [
    {
      "id": 1,
      "advogado_id": 1,
      "ano": 2025,
      "descricao_cobranca": "Anuidade de 2025",
      "numero_oab": "30143",
      "valor_principal": 1221.79,
      "multa": 24.44,
      "juros": 12.22,
      "valor_total_atualizado": 1258.45,
      "data_vencimento_original": "2025-03-10",
      "status_debito": "A receber",
      "situacao_parcela": "5",
      "desconto_maximo": 20.0,
      "status": "pendente"
    }
  ]
}
```

---

### 2.5 Detalhe de um Débito

```
GET /anuidades/{id}
```

**Response (200):** mesmo formato de um item da lista acima.

---

### 2.6 Processar Pagamento (Cartão)

```
POST /pagamentos/cartao
```

**Request:**
```json
{
  "anuidade_id": 1,
  "valor_pago": 1258.45,
  "numero_parcelas": 10
}
```

**Response (201):**
```json
{
  "mensagem": "Pagamento processado com sucesso",
  "pagamento": {
    "id": 1,
    "anuidade_id": 1,
    "valor_pago": 1258.45,
    "forma_pagamento": "cartao",
    "numero_parcelas": 10,
    "status": "aprovado",
    "codigo_transacao": "CARD1A2B3C4D"
  }
}
```

---

### 2.7 Gerar Boleto / PIX

```
POST /pagamentos/boleto
```

**Request:**
```json
{
  "anuidade_id": 1,
  "valor_pago": 1258.45,
  "numero_parcelas": 1
}
```

**Response (201):**
```json
{
  "mensagem": "Boleto gerado com sucesso",
  "pagamento": {
    "id": 2,
    "anuidade_id": 1,
    "valor_pago": 1258.45,
    "forma_pagamento": "boleto",
    "numero_parcelas": 1,
    "status": "processando",
    "codigo_transacao": "BOL5E6F7G8H"
  }
}
```

---

## 3. Campos Exibidos no Frontend

| Campo no Frontend | Chave na API | Tipo | Exemplo |
|---|---|---|---|
| Descrição da Cobrança | `descricao_cobranca` | string | "Anuidade de 2025" |
| Número da OAB | `numero_oab` | string | "30143" |
| Valor Principal (R$) | `valor_principal` | float | 1221.79 |
| Multa (R$) | `multa` | float | 24.44 |
| Juros (R$) | `juros` | float | 12.22 |
| Valor Total Atualizado (R$) | `valor_total_atualizado` | float | 1258.45 |
| Data de Vencimento Original | `data_vencimento_original` | string (ISO) | "2025-03-10" |
| Status do Débito | `status_debito` | string | "A receber" / "Quitado" |
| Situação da Parcela | `situacao_parcela` | string | "5" |
| Status interno | `status` | string | "pendente" / "pago" / "vencido" |

---

## 4. Fluxo do Usuário

```
1. Advogado acessa o portal
2. Digita o CPF → POST /auth/login
3. Se CPF existe → redireciona para dashboard
4. Dashboard carrega → GET /anuidades
5. Exibe cards com dados de cada débito
6. Advogado clica "Ver Opções de Pagamento"
7. Escolhe PIX, Cartão ou Boleto
8. Tela de finalização com resumo + dados do método
9. Confirma → POST /pagamentos/cartao ou /pagamentos/boleto
10. Tela de sucesso
```

---

## 5. Como Fazer o Build

```bash
cd oab-frontend
npm install
npm run build
```

A pasta `dist/` gerada contém os arquivos estáticos (HTML, JS, CSS) que devem ser servidos pelo PHP.

---

## 6. Estrutura da pasta dist/

```
dist/
├── index.html          ← Página principal (SPA)
├── assets/
│   ├── index-xxxxx.js  ← Bundle JavaScript
│   ├── index-xxxxx.css ← Estilos
│   └── logo oab-xxxxx.png ← Logo
```

O `index.html` pode ser incluído dentro do `dashboard.php` ou o PHP pode redirecionar para ele.

---

## 7. Observações

- **CORS**: Se a API estiver em domínio diferente do frontend, configurar os headers CORS no servidor da API, ou usar proxy PHP.
- **Autenticação**: O frontend usa cookies de sessão (`withCredentials: true`). A API precisa suportar isso, ou adaptar para usar tokens (JWT).
- **Valores**: Todos os valores monetários são `float` em reais (R$). O frontend formata automaticamente.
- **Datas**: Formato ISO 8601 (`YYYY-MM-DD`). O frontend formata para `DD/MM/YYYY`.

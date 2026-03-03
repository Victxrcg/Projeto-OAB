# Portal da OAB

Sistema web para gerenciamento de anuidades de advogados, permitindo consulta de pendências e negociação de pagamento.

## Estrutura do Projeto

```
Projeto-OAB/
├── oab-backend/          # Backend Flask (Python)
├── oab-frontend/         # Frontend React (Vite)
└── oab-portal/           # Documentação
```

## Pré-requisitos

### Backend
- Python 3.11 ou superior
- pip

### Frontend
- Node.js 18 ou superior
- npm ou yarn

## Instalação e Execução

### 1. Backend

```bash
cd oab-backend
pip install -r requirements.txt
python src/main.py
```

O backend estará rodando em `http://localhost:5000`

### 2. Frontend

Em um novo terminal:

```bash
cd oab-frontend
npm install
npm run dev
```

O frontend estará rodando em `http://localhost:5173`

## Acesso ao Sistema

1. Acesse `http://localhost:5173`
2. Use um dos CPFs fictícios criados automaticamente
3. Senha padrão: `123456`

### Exemplos de CPF (dados fictícios):
- 12345678901
- 23456789012
- 34567890123
- ... (15 advogados no total)

## Funcionalidades

- ✅ Login por CPF
- ✅ Cadastro de novos advogados
- ✅ Visualização de anuidades pendentes
- ✅ Simulação de pagamento (à vista com desconto ou parcelado)
- ✅ Processamento de pagamento (cartão ou boleto)
- ✅ Histórico de pagamentos
- ✅ Dashboard com resumo de pendências

## Tecnologias

### Backend
- Flask
- SQLAlchemy
- SQLite
- Flask-CORS

### Frontend
- React 18
- Vite
- Tailwind CSS
- React Router
- Axios

## Documentação

Consulte os arquivos em `oab-portal/` para mais detalhes:
- `requisitos.md` - Requisitos funcionais e não funcionais
- `arquitetura.md` - Arquitetura técnica detalhada


# Portal da OAB - Arquitetura Técnica

## 1. Visão Geral da Arquitetura

O Portal da OAB seguirá uma arquitetura de aplicação web moderna, separando claramente o frontend (interface do usuário) do backend (lógica de negócio e dados).

```
┌─────────────────┐    HTTP/HTTPS    ┌─────────────────┐
│                 │ ◄──────────────► │                 │
│    Frontend     │                  │     Backend     │
│   (React.js)    │                  │    (Flask)      │
│                 │                  │                 │
└─────────────────┘                  └─────────────────┘
                                              │
                                              ▼
                                     ┌─────────────────┐
                                     │                 │
                                     │   Banco de      │
                                     │   Dados         │
                                     │   (SQLite)      │
                                     │                 │
                                     └─────────────────┘
```

## 2. Tecnologias Escolhidas

### 2.1 Frontend
- **React.js 18+:** Framework JavaScript moderno para interfaces reativas
- **Tailwind CSS:** Framework CSS utilitário para estilização rápida
- **Shadcn/ui:** Biblioteca de componentes React pré-construídos
- **Lucide React:** Biblioteca de ícones SVG
- **React Router:** Roteamento client-side
- **Axios/Fetch:** Cliente HTTP para comunicação com API

### 2.2 Backend
- **Flask:** Framework web Python minimalista e flexível
- **SQLAlchemy:** ORM para interação com banco de dados
- **Flask-CORS:** Middleware para permitir requisições cross-origin
- **Werkzeug:** Utilitários para segurança e hash de senhas
- **Python 3.11+:** Linguagem de programação

### 2.3 Banco de Dados
- **SQLite:** Banco de dados relacional leve para demonstração
- **Estrutura preparada para PostgreSQL/MySQL:** Para produção futura

## 3. Estrutura do Projeto

### 3.1 Backend (Flask)
```
oab-backend/
├── src/
│   ├── main.py                 # Aplicação principal
│   ├── models/
│   │   ├── __init__.py
│   │   ├── advogado.py         # Modelo do advogado
│   │   ├── anuidade.py         # Modelo da anuidade
│   │   └── pagamento.py        # Modelo de pagamento
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── auth.py             # Rotas de autenticação
│   │   ├── anuidades.py        # Rotas de anuidades
│   │   └── pagamentos.py       # Rotas de pagamento
│   ├── utils/
│   │   ├── __init__.py
│   │   ├── seed_data.py        # Dados fictícios
│   │   └── validators.py       # Validadores
│   └── database/
│       └── app.db              # Banco SQLite
├── requirements.txt            # Dependências Python
└── README.md                   # Documentação
```

### 3.2 Frontend (React)
```
oab-frontend/
├── src/
│   ├── components/
│   │   ├── ui/                 # Componentes base (shadcn/ui)
│   │   ├── Header.jsx          # Cabeçalho
│   │   ├── Footer.jsx          # Rodapé
│   │   ├── LoginPage.jsx       # Página de login
│   │   ├── RegisterPage.jsx    # Página de cadastro
│   │   ├── Dashboard.jsx       # Dashboard principal
│   │   └── AnuidadeCard.jsx    # Card de anuidade
│   ├── contexts/
│   │   └── AuthContext.jsx     # Contexto de autenticação
│   ├── hooks/
│   │   └── useApi.js           # Hook para API
│   ├── lib/
│   │   └── utils.js            # Utilitários
│   ├── App.jsx                 # Componente principal
│   ├── main.jsx                # Ponto de entrada
│   └── index.css               # Estilos globais
├── package.json                # Dependências Node.js
└── vite.config.js              # Configuração Vite
```

## 4. Modelo de Dados

### 4.1 Entidade Advogado
```sql
CREATE TABLE advogados (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome_completo VARCHAR(255) NOT NULL,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telefone VARCHAR(20),
    senha_hash VARCHAR(255) NOT NULL,
    numero_oab VARCHAR(20),
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
    ativo BOOLEAN DEFAULT TRUE
);
```

### 4.2 Entidade Anuidade
```sql
CREATE TABLE anuidades (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    advogado_id INTEGER NOT NULL,
    ano INTEGER NOT NULL,
    valor_original DECIMAL(10,2) NOT NULL,
    valor_atual DECIMAL(10,2) NOT NULL,
    data_vencimento DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'pendente',
    desconto_maximo DECIMAL(5,2) DEFAULT 0.00,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (advogado_id) REFERENCES advogados (id)
);
```

### 4.3 Entidade Pagamento
```sql
CREATE TABLE pagamentos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    anuidade_id INTEGER NOT NULL,
    valor_pago DECIMAL(10,2) NOT NULL,
    forma_pagamento VARCHAR(20) NOT NULL,
    numero_parcelas INTEGER DEFAULT 1,
    data_pagamento DATETIME DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'processando',
    codigo_transacao VARCHAR(100),
    FOREIGN KEY (anuidade_id) REFERENCES anuidades (id)
);
```

## 5. API Endpoints

### 5.1 Autenticação
- `POST /api/auth/login` - Login do advogado
- `POST /api/auth/register` - Cadastro de novo advogado
- `POST /api/auth/logout` - Logout
- `GET /api/auth/session` - Verificar sessão ativa

### 5.2 Anuidades
- `GET /api/anuidades` - Listar anuidades do advogado logado
- `GET /api/anuidades/{id}` - Detalhes de uma anuidade específica
- `POST /api/anuidades/{id}/simular` - Simular opções de pagamento

### 5.3 Pagamentos
- `POST /api/pagamentos/boleto` - Gerar boleto de pagamento
- `POST /api/pagamentos/cartao` - Processar pagamento no cartão
- `GET /api/pagamentos/historico` - Histórico de pagamentos

### 5.4 Utilitários
- `GET /api/health` - Health check da API
- `POST /api/cpf/verificar` - Verificar se CPF existe no sistema

## 6. Segurança

### 6.1 Autenticação
- Hash de senhas com Werkzeug
- Sessões baseadas em cookies seguros
- Validação de CPF no frontend e backend

### 6.2 Validação
- Validação de entrada em todas as rotas
- Sanitização de dados
- Proteção contra SQL injection (SQLAlchemy ORM)

### 6.3 CORS
- Configuração adequada para permitir frontend
- Headers de segurança apropriados

## 7. Deployment

### 7.1 Desenvolvimento
- Backend: Flask development server
- Frontend: Vite development server
- Banco: SQLite local

### 7.2 Produção (Demonstração)
- Backend: Implantação via Manus Deploy
- Frontend: Build estático via Manus Deploy
- Banco: SQLite (adequado para demonstração)

## 8. Dados Fictícios

### 8.1 Advogados de Exemplo
- 15 advogados com dados realistas
- CPFs válidos (mas fictícios)
- Diferentes situações de anuidade

### 8.2 Anuidades Variadas
- Anos: 2020-2024
- Valores: R$ 500,00 a R$ 2.000,00
- Status: pendente, pago, vencido
- Descontos: 10% a 50% para pagamento à vista

## 9. Performance e Escalabilidade

### 9.1 Frontend
- Lazy loading de componentes
- Otimização de bundle com Vite
- Cache de requisições API

### 9.2 Backend
- Índices no banco de dados
- Paginação de resultados
- Cache de sessões

## 10. Monitoramento

### 10.1 Logs
- Logs estruturados no backend
- Rastreamento de erros
- Métricas de performance

### 10.2 Health Checks
- Endpoint de saúde da API
- Verificação de conectividade do banco
- Status dos serviços


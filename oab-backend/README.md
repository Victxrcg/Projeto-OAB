# Portal OAB - Backend

Backend Flask para o Portal da OAB.

## Requisitos

- Python 3.11 ou superior
- pip

## Instalação

1. Instale as dependências:
```bash
pip install -r requirements.txt
```

## Execução

Execute o servidor Flask:

```bash
python src/main.py
```

O servidor estará disponível em `http://localhost:5000`

## Estrutura

- `src/main.py` - Aplicação principal Flask
- `src/models/` - Modelos de dados (Advogado, Anuidade, Pagamento)
- `src/routes/` - Rotas da API
- `src/utils/` - Utilitários (validadores, seed data)

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/cpf/verificar` - Verificar se CPF existe
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Cadastro
- `POST /api/auth/logout` - Logout
- `GET /api/auth/session` - Verificar sessão
- `GET /api/anuidades` - Listar anuidades
- `GET /api/anuidades/{id}` - Detalhes da anuidade
- `POST /api/anuidades/{id}/simular` - Simular pagamento
- `POST /api/pagamentos/boleto` - Gerar boleto
- `POST /api/pagamentos/cartao` - Processar cartão
- `GET /api/pagamentos/historico` - Histórico de pagamentos

## Dados Fictícios

O sistema cria automaticamente 15 advogados fictícios com anuidades quando iniciado pela primeira vez.

**Senha padrão para todos os usuários:** `123456`


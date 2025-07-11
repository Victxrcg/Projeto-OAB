# Portal da OAB - Requisitos e Especificações

## 1. Visão Geral
O Portal da OAB é um sistema web para gerenciamento de anuidades de advogados, permitindo que os profissionais consultem suas pendências e realizem negociações de pagamento de forma simples e eficiente.

## 2. Requisitos Funcionais

### 2.1 Autenticação e Cadastro
- **Login inicial:** Por CPF
- **Cadastro de nova conta:** Campos obrigatórios:
  - Nome Completo
  - CPF/CNPJ
  - E-mail
  - Telefone
  - Senha
  - Confirmação de Senha

### 2.2 Gestão de Anuidades
- Visualização de pendências de anuidade
- Exibição de valores em aberto
- Histórico de pagamentos
- Status das anuidades (em dia, em atraso, vencidas)

### 2.3 Opções de Negociação
- **Pagamento à vista:** Com desconto
- **Pagamento parcelado:** 
  - Cartão de crédito
  - Boleto bancário
- Geração de boletos para pagamento
- Cálculo automático de descontos e juros

### 2.4 Interface do Usuário
- Design moderno e limpo
- Responsivo para desktop e mobile
- Foco na experiência do advogado
- Navegação intuitiva

## 3. Requisitos Não Funcionais

### 3.1 Performance
- Tempo de resposta inferior a 3 segundos
- Suporte a múltiplos usuários simultâneos

### 3.2 Segurança
- Autenticação segura
- Criptografia de senhas
- Proteção contra ataques comuns

### 3.3 Compatibilidade
- Compatível com navegadores modernos
- Responsivo para dispositivos móveis

## 4. Arquitetura Técnica

### 4.1 Frontend
- **Tecnologia:** React.js
- **Estilização:** Tailwind CSS
- **Componentes:** Shadcn/ui
- **Ícones:** Lucide React

### 4.2 Backend
- **Tecnologia:** Flask (Python)
- **Banco de Dados:** SQLite (para demonstração)
- **API:** RESTful
- **Autenticação:** Session-based

### 4.3 Dados Fictícios
Para demonstração, serão criados:
- 10-15 advogados fictícios
- Anuidades de diferentes anos
- Valores variados de pendências
- Diferentes status de pagamento

## 5. Fluxo do Usuário

### 5.1 Primeiro Acesso
1. Usuário acessa o portal
2. Insere CPF
3. Sistema verifica se CPF existe
4. Se não existe, redireciona para cadastro
5. Usuário preenche formulário de cadastro
6. Sistema cria conta e faz login automático

### 5.2 Acesso Subsequente
1. Usuário acessa o portal
2. Insere CPF
3. Sistema verifica se CPF existe
4. Se existe, solicita senha
5. Usuário faz login e acessa dashboard

### 5.3 Negociação de Anuidade
1. Usuário visualiza pendências
2. Seleciona anuidade para negociar
3. Escolhe forma de pagamento (à vista ou parcelado)
4. Escolhe método (cartão ou boleto)
5. Sistema gera boleto ou processa pagamento
6. Usuário recebe confirmação

## 6. Identidade Visual

### 6.1 Cores
- **Azul:** #1e40af (primária)
- **Vermelho:** #dc2626 (secundária)
- **Branco:** #ffffff (fundo)
- **Cinza:** #6b7280 (texto secundário)

### 6.2 Tipografia
- **Fonte principal:** Inter ou similar
- **Tamanhos:** Hierarquia clara entre títulos e textos

### 6.3 Componentes
- Botões com bordas arredondadas
- Cards com sombras suaves
- Formulários limpos e espaçados
- Ícones consistentes

## 7. Integração Futura
- **CRM:** Preparado para integração com sistema de CRM existente
- **Gateway de Pagamento:** Estrutura para integração com processadores de pagamento
- **Sistema Financeiro:** APIs preparadas para integração com sistema contábil

## 8. Cronograma de Desenvolvimento
1. **Fase 1:** Coleta de requisitos ✓
2. **Fase 2:** Definição da arquitetura
3. **Fase 3:** Desenvolvimento do backend
4. **Fase 4:** Desenvolvimento do frontend
5. **Fase 5:** Testes e validação
6. **Fase 6:** Implantação e entrega


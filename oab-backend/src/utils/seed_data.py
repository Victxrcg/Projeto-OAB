from src.database import db
from src.models.advogado import Advogado
from src.models.anuidade import Anuidade
from src.models.pagamento import Pagamento
from datetime import date, datetime, timedelta
from decimal import Decimal
import random

def seed_database():
    """Popula o banco de dados com dados fictícios"""
    
    # Lista de nomes fictícios
    nomes = [
        ('João Silva', '12345678901', 'joao.silva@email.com', '11987654321'),
        ('Maria Santos', '23456789012', 'maria.santos@email.com', '11976543210'),
        ('Pedro Oliveira', '34567890123', 'pedro.oliveira@email.com', '11965432109'),
        ('Ana Costa', '45678901234', 'ana.costa@email.com', '11954321098'),
        ('Carlos Pereira', '56789012345', 'carlos.pereira@email.com', '11943210987'),
        ('Juliana Ferreira', '67890123456', 'juliana.ferreira@email.com', '11932109876'),
        ('Roberto Alves', '78901234567', 'roberto.alves@email.com', '11921098765'),
        ('Fernanda Lima', '89012345678', 'fernanda.lima@email.com', '11910987654'),
        ('Ricardo Souza', '90123456789', 'ricardo.souza@email.com', '11909876543'),
        ('Patricia Rocha', '01234567890', 'patricia.rocha@email.com', '11998765432'),
        ('Lucas Martins', '11223344556', 'lucas.martins@email.com', '11987654321'),
        ('Camila Barbosa', '22334455667', 'camila.barbosa@email.com', '11976543210'),
        ('Bruno Carvalho', '33445566778', 'bruno.carvalho@email.com', '11965432109'),
        ('Amanda Dias', '44556677889', 'amanda.dias@email.com', '11954321098'),
        ('Felipe Ribeiro', '55667788990', 'felipe.ribeiro@email.com', '11943210987'),
    ]
    
    # Criar advogados
    advogados = []
    for nome, cpf, email, telefone in nomes:
        advogado = Advogado(
            nome_completo=nome,
            cpf=cpf,
            email=email,
            telefone=telefone,
            numero_oab=f'SP{random.randint(100000, 999999)}'
        )
        advogado.set_senha('123456')  # Senha padrão para todos
        advogados.append(advogado)
        db.session.add(advogado)
    
    db.session.commit()
    
    # Criar anuidades
    anos = [2020, 2021, 2022, 2023, 2024]
    valores_base = [500.00, 750.00, 1000.00, 1250.00, 1500.00, 1750.00, 2000.00]
    status_opcoes = ['pendente', 'pendente', 'pendente', 'pago', 'vencido']
    
    for advogado in advogados:
        # Cada advogado terá 2-4 anuidades
        num_anuidades = random.randint(2, 4)
        anos_advogado = random.sample(anos, num_anuidades)
        
        for ano in anos_advogado:
            valor_original = Decimal(str(random.choice(valores_base)))
            status = random.choice(status_opcoes)
            
            # Calcular valor atual (com juros se vencido)
            if status == 'vencido':
                meses_atraso = random.randint(1, 24)
                juros = valor_original * Decimal('0.02') * meses_atraso  # 2% ao mês
                valor_atual = valor_original + juros
            elif status == 'pago':
                valor_atual = Decimal('0.00')
            else:
                meses_atraso = random.randint(0, 6)
                juros = valor_original * Decimal('0.02') * meses_atraso
                valor_atual = valor_original + juros
            
            # Data de vencimento
            data_vencimento = date(ano, 1, 31)
            
            # Desconto máximo (10% a 50%)
            desconto_maximo = Decimal(str(random.randint(10, 50)))
            
            anuidade = Anuidade(
                advogado_id=advogado.id,
                ano=ano,
                valor_original=valor_original,
                valor_atual=valor_atual,
                data_vencimento=data_vencimento,
                status=status,
                desconto_maximo=desconto_maximo
            )
            
            db.session.add(anuidade)
            
            # Se pago, criar registro de pagamento
            if status == 'pago':
                pagamento = Pagamento(
                    anuidade_id=anuidade.id,
                    valor_pago=valor_original,
                    forma_pagamento=random.choice(['cartao', 'boleto']),
                    numero_parcelas=random.choice([1, 3, 6]),
                    status='aprovado',
                    codigo_transacao=f'PAY{random.randint(100000, 999999)}',
                    data_pagamento=datetime.now() - timedelta(days=random.randint(1, 365))
                )
                db.session.add(pagamento)
    
    db.session.commit()
    print("✅ Dados fictícios criados com sucesso!")


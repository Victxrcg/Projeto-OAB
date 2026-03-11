from src.database import db
from src.models.advogado import Advogado
from src.models.anuidade import Anuidade
from src.models.pagamento import Pagamento
from datetime import date, datetime, timedelta
from decimal import Decimal
import random

def seed_database():
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
        ('Lucas Martins', '11223344556', 'lucas.martins@email.com', '11987654322'),
        ('Camila Barbosa', '22334455667', 'camila.barbosa@email.com', '11976543211'),
        ('Bruno Carvalho', '33445566778', 'bruno.carvalho@email.com', '11965432110'),
        ('Amanda Dias', '44556677889', 'amanda.dias@email.com', '11954321099'),
        ('Felipe Ribeiro', '55667788990', 'felipe.ribeiro@email.com', '11943210988'),
    ]
    
    advogados = []
    for nome, cpf, email, telefone in nomes:
        advogado = Advogado(nome_completo=nome, cpf=cpf, email=email, telefone=telefone,
                            numero_oab=f'{random.randint(10000, 99999)}')
        advogado.set_senha('123456')
        advogados.append(advogado)
        db.session.add(advogado)
    db.session.commit()
    
    anos = [2020, 2021, 2022, 2023, 2024, 2025]
    valores_base = [800.00, 950.00, 1100.00, 1221.79, 1350.00, 1500.00, 1750.00, 2000.00]
    
    for advogado in advogados:
        num_anuidades = random.randint(2, 5)
        anos_advogado = random.sample(anos, min(num_anuidades, len(anos)))
        
        for ano in anos_advogado:
            valor_principal = Decimal(str(random.choice(valores_base)))
            tipo = random.choice(['pendente', 'pendente', 'pendente', 'pago', 'vencido'])
            num_parcela = random.randint(1, 12)
            
            if tipo == 'vencido':
                meses_atraso = random.randint(1, 24)
                multa = (valor_principal * Decimal('0.02')).quantize(Decimal('0.01'))
                juros = (valor_principal * Decimal('0.01') * meses_atraso).quantize(Decimal('0.01'))
                valor_total = valor_principal + multa + juros
                status_debito = 'A receber'
                status = 'vencido'
            elif tipo == 'pago':
                multa = Decimal('0.00')
                juros = Decimal('0.00')
                valor_total = valor_principal
                status_debito = 'Quitado'
                status = 'pago'
            else:
                meses_atraso = random.randint(0, 6)
                if meses_atraso > 0:
                    multa = (valor_principal * Decimal('0.02')).quantize(Decimal('0.01'))
                    juros = (valor_principal * Decimal('0.01') * meses_atraso).quantize(Decimal('0.01'))
                else:
                    multa = Decimal('0.00')
                    juros = Decimal('0.00')
                valor_total = valor_principal + multa + juros
                status_debito = 'A receber'
                status = 'pendente'
            
            mes_venc = random.choice([1, 3, 6, 9])
            dia_venc = random.choice([10, 15, 20, 28])
            data_vencimento = date(ano, mes_venc, dia_venc)
            desconto_maximo = Decimal(str(random.randint(10, 50)))
            
            anuidade = Anuidade(
                advogado_id=advogado.id, ano=ano, descricao_cobranca=f'Anuidade de {ano}',
                valor_principal=valor_principal, multa=multa, juros=juros,
                valor_total_atualizado=valor_total, data_vencimento_original=data_vencimento,
                status_debito=status_debito, situacao_parcela=str(num_parcela),
                desconto_maximo=desconto_maximo, valor_original=valor_principal,
                valor_atual=valor_total if status != 'pago' else Decimal('0.00'),
                data_vencimento=data_vencimento, status=status
            )
            db.session.add(anuidade)
    
    db.session.commit()
    
    anuidades_pagas = Anuidade.query.filter_by(status='pago').all()
    for anuidade in anuidades_pagas:
        pagamento = Pagamento(
            anuidade_id=anuidade.id, valor_pago=float(anuidade.valor_principal),
            forma_pagamento=random.choice(['cartao', 'boleto', 'pix']),
            numero_parcelas=random.choice([1, 3, 6]), status='aprovado',
            codigo_transacao=f'PAY{random.randint(100000, 999999)}',
            data_pagamento=datetime.now() - timedelta(days=random.randint(1, 365))
        )
        db.session.add(pagamento)
    db.session.commit()
    print("Dados fictícios criados com sucesso!")

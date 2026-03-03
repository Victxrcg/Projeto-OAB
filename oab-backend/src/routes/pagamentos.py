from flask import Blueprint, request, jsonify, session
from src.main import db
from src.models.pagamento import Pagamento
from src.models.anuidade import Anuidade
from datetime import datetime
import secrets

pagamentos_bp = Blueprint('pagamentos', __name__)

def verificar_autenticacao():
    """Verifica se o usuário está autenticado"""
    advogado_id = session.get('advogado_id')
    if not advogado_id:
        return None
    return advogado_id

@pagamentos_bp.route('/boleto', methods=['POST'])
def gerar_boleto():
    """Gera boleto de pagamento"""
    advogado_id = verificar_autenticacao()
    
    if not advogado_id:
        return jsonify({'erro': 'Não autenticado'}), 401
    
    data = request.get_json()
    anuidade_id = data.get('anuidade_id')
    valor_pago = data.get('valor_pago')
    numero_parcelas = data.get('numero_parcelas', 1)
    
    if not anuidade_id or not valor_pago:
        return jsonify({'erro': 'Anuidade e valor são obrigatórios'}), 400
    
    anuidade = Anuidade.query.filter_by(id=anuidade_id, advogado_id=advogado_id).first()
    
    if not anuidade:
        return jsonify({'erro': 'Anuidade não encontrada'}), 404
    
    # Criar registro de pagamento
    pagamento = Pagamento(
        anuidade_id=anuidade_id,
        valor_pago=valor_pago,
        forma_pagamento='boleto',
        numero_parcelas=numero_parcelas,
        status='processando',
        codigo_transacao=f'BOL{secrets.token_hex(8).upper()}'
    )
    
    try:
        db.session.add(pagamento)
        db.session.commit()
        
        # Simular geração de boleto (em produção, integrar com gateway de pagamento)
        codigo_barras = f'34191.{secrets.token_hex(10)}.{secrets.token_hex(10)}.{secrets.token_hex(10)}.{secrets.token_hex(10)}'
        
        return jsonify({
            'mensagem': 'Boleto gerado com sucesso',
            'pagamento': pagamento.to_dict(),
            'boleto': {
                'codigo_barras': codigo_barras,
                'linha_digitavel': codigo_barras[:47],  # Simplificado
                'vencimento': (datetime.now().date().replace(day=datetime.now().day + 3)).isoformat(),
                'valor': float(valor_pago)
            }
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'erro': 'Erro ao gerar boleto'}), 500

@pagamentos_bp.route('/cartao', methods=['POST'])
def processar_cartao():
    """Processa pagamento com cartão de crédito"""
    advogado_id = verificar_autenticacao()
    
    if not advogado_id:
        return jsonify({'erro': 'Não autenticado'}), 401
    
    data = request.get_json()
    anuidade_id = data.get('anuidade_id')
    valor_pago = data.get('valor_pago')
    numero_parcelas = data.get('numero_parcelas', 1)
    
    if not anuidade_id or not valor_pago:
        return jsonify({'erro': 'Anuidade e valor são obrigatórios'}), 400
    
    anuidade = Anuidade.query.filter_by(id=anuidade_id, advogado_id=advogado_id).first()
    
    if not anuidade:
        return jsonify({'erro': 'Anuidade não encontrada'}), 404
    
    # Criar registro de pagamento
    pagamento = Pagamento(
        anuidade_id=anuidade_id,
        valor_pago=valor_pago,
        forma_pagamento='cartao',
        numero_parcelas=numero_parcelas,
        status='aprovado',  # Simulado - em produção, verificar com gateway
        codigo_transacao=f'CARD{secrets.token_hex(8).upper()}'
    )
    
    try:
        db.session.add(pagamento)
        
        # Atualizar status da anuidade
        anuidade.status = 'pago'
        anuidade.valor_atual = 0
        
        db.session.commit()
        
        return jsonify({
            'mensagem': 'Pagamento processado com sucesso',
            'pagamento': pagamento.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'erro': 'Erro ao processar pagamento'}), 500

@pagamentos_bp.route('/historico', methods=['GET'])
def historico_pagamentos():
    """Obtém histórico de pagamentos do advogado"""
    advogado_id = verificar_autenticacao()
    
    if not advogado_id:
        return jsonify({'erro': 'Não autenticado'}), 401
    
    # Buscar pagamentos através das anuidades do advogado
    anuidades = Anuidade.query.filter_by(advogado_id=advogado_id).all()
    anuidade_ids = [a.id for a in anuidades]
    
    pagamentos = Pagamento.query.filter(Pagamento.anuidade_id.in_(anuidade_ids)).order_by(Pagamento.data_pagamento.desc()).all()
    
    return jsonify({
        'pagamentos': [pagamento.to_dict() for pagamento in pagamentos]
    }), 200


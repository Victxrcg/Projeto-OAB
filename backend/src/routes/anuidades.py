from flask import Blueprint, request, jsonify, session
from src.database import db
from src.models.anuidade import Anuidade

anuidades_bp = Blueprint('anuidades', __name__)

def verificar_autenticacao():
    advogado_id = session.get('advogado_id')
    if not advogado_id:
        return None
    return advogado_id

@anuidades_bp.route('', methods=['GET'])
def listar_anuidades():
    advogado_id = verificar_autenticacao()
    if not advogado_id:
        return jsonify({'erro': 'Não autenticado'}), 401
    anuidades = Anuidade.query.filter_by(advogado_id=advogado_id).order_by(Anuidade.ano.desc()).all()
    return jsonify({'anuidades': [a.to_dict() for a in anuidades]}), 200

@anuidades_bp.route('/<int:anuidade_id>', methods=['GET'])
def obter_anuidade(anuidade_id):
    advogado_id = verificar_autenticacao()
    if not advogado_id:
        return jsonify({'erro': 'Não autenticado'}), 401
    anuidade = Anuidade.query.filter_by(id=anuidade_id, advogado_id=advogado_id).first()
    if not anuidade:
        return jsonify({'erro': 'Anuidade não encontrada'}), 404
    return jsonify(anuidade.to_dict()), 200

@anuidades_bp.route('/<int:anuidade_id>/simular', methods=['POST'])
def simular_pagamento(anuidade_id):
    advogado_id = verificar_autenticacao()
    if not advogado_id:
        return jsonify({'erro': 'Não autenticado'}), 401
    anuidade = Anuidade.query.filter_by(id=anuidade_id, advogado_id=advogado_id).first()
    if not anuidade:
        return jsonify({'erro': 'Anuidade não encontrada'}), 404
    
    data = request.get_json()
    forma = data.get('forma_pagamento', 'vista')
    parcelas = data.get('numero_parcelas', 1)
    valor_base = float(anuidade.valor_total_atualizado)
    opcoes = []
    
    if forma == 'vista':
        desconto = float(anuidade.desconto_maximo)
        valor_final = valor_base * (1 - desconto / 100)
        opcoes.append({
            'tipo': 'vista', 'valor_original': valor_base, 'desconto_percentual': desconto,
            'valor_final': round(valor_final, 2), 'economia': round(valor_base - valor_final, 2)
        })
    elif forma == 'parcelado':
        if parcelas < 2 or parcelas > 12:
            return jsonify({'erro': 'Parcelas entre 2 e 12'}), 400
        taxa = 0.02
        total = valor_base * (1 + taxa * parcelas)
        opcoes.append({
            'tipo': 'parcelado', 'numero_parcelas': parcelas, 'valor_original': valor_base,
            'taxa_juros_mensal': taxa * 100, 'valor_total': round(total, 2),
            'valor_parcela': round(total / parcelas, 2), 'juros_total': round(total - valor_base, 2)
        })
    
    return jsonify({'anuidade': anuidade.to_dict(), 'opcoes': opcoes}), 200

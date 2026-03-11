from flask import Blueprint, request, jsonify, session
from src.database import db
from src.models.advogado import Advogado
from src.utils.validators import validar_cpf, validar_email

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    cpf = data.get('cpf', '').replace('.', '').replace('-', '')
    
    if not cpf:
        return jsonify({'erro': 'CPF é obrigatório'}), 400
    if not validar_cpf(cpf):
        return jsonify({'erro': 'CPF inválido'}), 400
    
    advogado = Advogado.query.filter_by(cpf=cpf).first()
    if not advogado:
        return jsonify({'erro': 'CPF não encontrado no sistema'}), 404
    if not advogado.ativo:
        return jsonify({'erro': 'Conta desativada'}), 403
    
    session['advogado_id'] = advogado.id
    session.permanent = True
    return jsonify({'mensagem': 'Acesso realizado com sucesso', 'advogado': advogado.to_dict()}), 200

@auth_bp.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'mensagem': 'Logout realizado com sucesso'}), 200

@auth_bp.route('/session', methods=['GET'])
def get_session():
    advogado_id = session.get('advogado_id')
    if not advogado_id:
        return jsonify({'autenticado': False}), 401
    advogado = Advogado.query.get(advogado_id)
    if not advogado or not advogado.ativo:
        session.clear()
        return jsonify({'autenticado': False}), 401
    return jsonify({'autenticado': True, 'advogado': advogado.to_dict()}), 200

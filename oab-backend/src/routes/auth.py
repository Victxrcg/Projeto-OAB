from flask import Blueprint, request, jsonify, session
from src.main import db
from src.models.advogado import Advogado
from src.utils.validators import validar_cpf, validar_email

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    """Login do advogado"""
    data = request.get_json()
    
    cpf = data.get('cpf', '').replace('.', '').replace('-', '')
    senha = data.get('senha', '')
    
    if not cpf or not senha:
        return jsonify({'erro': 'CPF e senha são obrigatórios'}), 400
    
    if not validar_cpf(cpf):
        return jsonify({'erro': 'CPF inválido'}), 400
    
    advogado = Advogado.query.filter_by(cpf=cpf).first()
    
    if not advogado or not advogado.verificar_senha(senha):
        return jsonify({'erro': 'CPF ou senha incorretos'}), 401
    
    if not advogado.ativo:
        return jsonify({'erro': 'Conta desativada'}), 403
    
    # Criar sessão
    session['advogado_id'] = advogado.id
    session.permanent = True
    
    return jsonify({
        'mensagem': 'Login realizado com sucesso',
        'advogado': advogado.to_dict()
    }), 200

@auth_bp.route('/register', methods=['POST'])
def register():
    """Cadastro de novo advogado"""
    data = request.get_json()
    
    nome_completo = data.get('nome_completo', '').strip()
    cpf = data.get('cpf', '').replace('.', '').replace('-', '')
    email = data.get('email', '').strip().lower()
    telefone = data.get('telefone', '').strip()
    senha = data.get('senha', '')
    confirmar_senha = data.get('confirmar_senha', '')
    
    # Validações
    if not all([nome_completo, cpf, email, senha]):
        return jsonify({'erro': 'Todos os campos obrigatórios devem ser preenchidos'}), 400
    
    if senha != confirmar_senha:
        return jsonify({'erro': 'As senhas não coincidem'}), 400
    
    if len(senha) < 6:
        return jsonify({'erro': 'A senha deve ter no mínimo 6 caracteres'}), 400
    
    if not validar_cpf(cpf):
        return jsonify({'erro': 'CPF inválido'}), 400
    
    if not validar_email(email):
        return jsonify({'erro': 'E-mail inválido'}), 400
    
    # Verificar se CPF já existe
    if Advogado.query.filter_by(cpf=cpf).first():
        return jsonify({'erro': 'CPF já cadastrado'}), 409
    
    # Verificar se email já existe
    if Advogado.query.filter_by(email=email).first():
        return jsonify({'erro': 'E-mail já cadastrado'}), 409
    
    # Criar novo advogado
    advogado = Advogado(
        nome_completo=nome_completo,
        cpf=cpf,
        email=email,
        telefone=telefone
    )
    advogado.set_senha(senha)
    
    try:
        db.session.add(advogado)
        db.session.commit()
        
        # Criar sessão
        session['advogado_id'] = advogado.id
        session.permanent = True
        
        return jsonify({
            'mensagem': 'Cadastro realizado com sucesso',
            'advogado': advogado.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'erro': 'Erro ao cadastrar advogado'}), 500

@auth_bp.route('/logout', methods=['POST'])
def logout():
    """Logout do advogado"""
    session.clear()
    return jsonify({'mensagem': 'Logout realizado com sucesso'}), 200

@auth_bp.route('/session', methods=['GET'])
def get_session():
    """Verificar sessão ativa"""
    advogado_id = session.get('advogado_id')
    
    if not advogado_id:
        return jsonify({'autenticado': False}), 401
    
    advogado = Advogado.query.get(advogado_id)
    
    if not advogado or not advogado.ativo:
        session.clear()
        return jsonify({'autenticado': False}), 401
    
    return jsonify({
        'autenticado': True,
        'advogado': advogado.to_dict()
    }), 200


from src.database import db
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

class Advogado(db.Model):
    __tablename__ = 'advogados'
    
    id = db.Column(db.Integer, primary_key=True)
    nome_completo = db.Column(db.String(255), nullable=False)
    cpf = db.Column(db.String(14), unique=True, nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    telefone = db.Column(db.String(20))
    senha_hash = db.Column(db.String(255), nullable=False)
    numero_oab = db.Column(db.String(20))
    data_cadastro = db.Column(db.DateTime, default=datetime.utcnow)
    ativo = db.Column(db.Boolean, default=True)
    
    anuidades = db.relationship('Anuidade', backref='advogado', lazy=True, cascade='all, delete-orphan')
    
    def set_senha(self, senha):
        self.senha_hash = generate_password_hash(senha)
    
    def verificar_senha(self, senha):
        return check_password_hash(self.senha_hash, senha)
    
    def to_dict(self):
        return {
            'id': self.id,
            'nome_completo': self.nome_completo,
            'cpf': self.cpf,
            'email': self.email,
            'telefone': self.telefone,
            'numero_oab': self.numero_oab,
            'data_cadastro': self.data_cadastro.isoformat() if self.data_cadastro else None,
            'ativo': self.ativo
        }

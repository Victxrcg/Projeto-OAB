from src.database import db
from datetime import datetime, date
from decimal import Decimal

class Anuidade(db.Model):
    __tablename__ = 'anuidades'
    
    id = db.Column(db.Integer, primary_key=True)
    advogado_id = db.Column(db.Integer, db.ForeignKey('advogados.id'), nullable=False)
    ano = db.Column(db.Integer, nullable=False)
    valor_original = db.Column(db.Numeric(10, 2), nullable=False)
    valor_atual = db.Column(db.Numeric(10, 2), nullable=False)
    data_vencimento = db.Column(db.Date, nullable=False)
    status = db.Column(db.String(20), default='pendente')
    desconto_maximo = db.Column(db.Numeric(5, 2), default=0.00)
    data_criacao = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relacionamentos
    pagamentos = db.relationship('Pagamento', backref='anuidade', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        """Converte o objeto para dicionário"""
        return {
            'id': self.id,
            'advogado_id': self.advogado_id,
            'ano': self.ano,
            'valor_original': float(self.valor_original),
            'valor_atual': float(self.valor_atual),
            'data_vencimento': self.data_vencimento.isoformat() if self.data_vencimento else None,
            'status': self.status,
            'desconto_maximo': float(self.desconto_maximo),
            'data_criacao': self.data_criacao.isoformat() if self.data_criacao else None
        }


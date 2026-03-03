from src.database import db
from datetime import datetime, date
from decimal import Decimal

class Anuidade(db.Model):
    __tablename__ = 'anuidades'
    
    id = db.Column(db.Integer, primary_key=True)
    advogado_id = db.Column(db.Integer, db.ForeignKey('advogados.id'), nullable=False)
    ano = db.Column(db.Integer, nullable=False)
    descricao_cobranca = db.Column(db.String(255), nullable=False, default='Anuidade')
    valor_principal = db.Column(db.Numeric(10, 2), nullable=False)
    multa = db.Column(db.Numeric(10, 2), default=0.00)
    juros = db.Column(db.Numeric(10, 2), default=0.00)
    valor_total_atualizado = db.Column(db.Numeric(10, 2), nullable=False)
    data_vencimento_original = db.Column(db.Date, nullable=False)
    status_debito = db.Column(db.String(30), default='A receber')
    situacao_parcela = db.Column(db.String(30), default='1')
    desconto_maximo = db.Column(db.Numeric(5, 2), default=0.00)
    data_criacao = db.Column(db.DateTime, default=datetime.utcnow)
    
    valor_original = db.Column(db.Numeric(10, 2), nullable=True)
    valor_atual = db.Column(db.Numeric(10, 2), nullable=True)
    data_vencimento = db.Column(db.Date, nullable=True)
    status = db.Column(db.String(20), default='pendente')
    
    pagamentos = db.relationship('Pagamento', backref='anuidade', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'advogado_id': self.advogado_id,
            'ano': self.ano,
            'descricao_cobranca': self.descricao_cobranca,
            'numero_oab': self.advogado.numero_oab if self.advogado else None,
            'valor_principal': float(self.valor_principal),
            'multa': float(self.multa) if self.multa else 0.0,
            'juros': float(self.juros) if self.juros else 0.0,
            'valor_total_atualizado': float(self.valor_total_atualizado),
            'data_vencimento_original': self.data_vencimento_original.isoformat() if self.data_vencimento_original else None,
            'status_debito': self.status_debito,
            'situacao_parcela': self.situacao_parcela,
            'desconto_maximo': float(self.desconto_maximo) if self.desconto_maximo else 0.0,
            'valor_original': float(self.valor_principal),
            'valor_atual': float(self.valor_total_atualizado),
            'data_vencimento': self.data_vencimento_original.isoformat() if self.data_vencimento_original else None,
            'status': self.status or 'pendente',
            'data_criacao': self.data_criacao.isoformat() if self.data_criacao else None
        }

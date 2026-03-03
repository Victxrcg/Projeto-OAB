from src.database import db
from datetime import datetime
from decimal import Decimal

class Pagamento(db.Model):
    __tablename__ = 'pagamentos'
    
    id = db.Column(db.Integer, primary_key=True)
    anuidade_id = db.Column(db.Integer, db.ForeignKey('anuidades.id'), nullable=False)
    valor_pago = db.Column(db.Numeric(10, 2), nullable=False)
    forma_pagamento = db.Column(db.String(20), nullable=False)  # 'cartao', 'boleto'
    numero_parcelas = db.Column(db.Integer, default=1)
    data_pagamento = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(20), default='processando')  # 'processando', 'aprovado', 'rejeitado'
    codigo_transacao = db.Column(db.String(100))
    
    def to_dict(self):
        """Converte o objeto para dicionário"""
        return {
            'id': self.id,
            'anuidade_id': self.anuidade_id,
            'valor_pago': float(self.valor_pago),
            'forma_pagamento': self.forma_pagamento,
            'numero_parcelas': self.numero_parcelas,
            'data_pagamento': self.data_pagamento.isoformat() if self.data_pagamento else None,
            'status': self.status,
            'codigo_transacao': self.codigo_transacao
        }


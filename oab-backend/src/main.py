from flask import Flask
from flask_cors import CORS
import os
from src.database import db

def create_app():
    app = Flask(__name__)
    
    # Configurações
    app.config['SECRET_KEY'] = 'dev-secret-key-change-in-production'
    # Caminho do banco de dados relativo ao diretório do backend
    import os
    db_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'oab_portal.db')
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Habilitar CORS
    CORS(app, supports_credentials=True, origins=['http://localhost:5173', 'http://localhost:3000'])
    
    # Inicializar banco de dados
    db.init_app(app)
    
    # Registrar blueprints
    from src.routes.auth import auth_bp
    from src.routes.anuidades import anuidades_bp
    from src.routes.pagamentos import pagamentos_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(anuidades_bp, url_prefix='/api/anuidades')
    app.register_blueprint(pagamentos_bp, url_prefix='/api/pagamentos')
    
    # Health check
    @app.route('/api/health')
    def health():
        return {'status': 'ok', 'message': 'OAB Portal API is running'}, 200
    
    @app.route('/api/cpf/verificar', methods=['POST'])
    def verificar_cpf():
        from flask import request
        from src.models.advogado import Advogado
        
        data = request.get_json()
        cpf = data.get('cpf', '').replace('.', '').replace('-', '')
        
        advogado = Advogado.query.filter_by(cpf=cpf).first()
        
        return {
            'existe': advogado is not None,
            'requer_senha': advogado is not None
        }, 200
    
    # Criar tabelas
    with app.app_context():
        from src.models.advogado import Advogado
        from src.models.anuidade import Anuidade
        from src.models.pagamento import Pagamento
        
        db.create_all()
        
        # Popular dados fictícios se o banco estiver vazio
        if Advogado.query.count() == 0:
            from src.utils.seed_data import seed_database
            seed_database()
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5000)


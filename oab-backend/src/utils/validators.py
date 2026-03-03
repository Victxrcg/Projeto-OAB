import re

def validar_cpf(cpf):
    """Valida CPF (formato básico)"""
    cpf = cpf.replace('.', '').replace('-', '')
    
    if len(cpf) != 11:
        return False
    
    if cpf == cpf[0] * 11:  # Todos os dígitos iguais
        return False
    
    # Validação básica de dígitos verificadores (simplificada)
    # Em produção, implementar validação completa
    return True

def validar_email(email):
    """Valida formato de e-mail"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None


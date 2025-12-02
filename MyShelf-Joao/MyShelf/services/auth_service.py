from database.db import inserir_usuario, buscar_usuario_por_email
from models.usuario import Usuario

class AuthService:
    @staticmethod
    def registrar(nome, email, senha, telefone=None):
        if buscar_usuario_por_email(email):
            raise ValueError("E-mail já cadastrado.")
        user_id = inserir_usuario(nome, email, senha, telefone)
        return Usuario(nome, email, senha, telefone, id_=user_id)

    @staticmethod
    def login(email, senha):
        row = buscar_usuario_por_email(email)
        if not row:
            raise ValueError("Usuário não encontrado.")
        id_, nome, email_db, senha_db, telefone = row
        if senha != senha_db:
            raise ValueError("Senha inválida.")
        return Usuario(nome, email_db, senha_db, telefone, id_=id_)

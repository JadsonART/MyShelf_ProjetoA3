from database import Database

class Auth:
    def __init__(self):
        self.db = Database()

    def cadastrar(self, nome, email, senha):
        try:
            self.db.cur.execute(
                "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)",
                (nome, email, senha)
            )
            self.db.conn.commit()
            return True
        except:
            return False

    def login(self, email, senha):
        self.db.cur.execute(
            "SELECT id, nome FROM usuarios WHERE email = ? AND senha = ?",
            (email, senha)
        )
        return self.db.cur.fetchone()

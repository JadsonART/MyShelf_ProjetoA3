from database.db import (
    inserir_livro,
    buscar_livro_por_titulo,
    adicionar_livro_biblioteca,
    listar_biblioteca,
    remover_livro_biblioteca
)
from models.livro import Livro

class BibliotecaService:
    @staticmethod
    def adicionar_livro(usuario_id, titulo, autor, genero=None, isbn=None):
        # Evita duplicar livro no catálogo; reutiliza se mesmo título existir
        row = buscar_livro_por_titulo(titulo)
        livro_id = row[0] if row else inserir_livro(titulo, autor, genero, isbn)
        adicionar_livro_biblioteca(usuario_id, livro_id)
        return livro_id

    @staticmethod
    def listar(usuario_id):
        rows = listar_biblioteca(usuario_id)
        return [Livro(t, a, g) for (t, a, g) in rows]

    @staticmethod
    def remover(usuario_id, titulo):
        row = buscar_livro_por_titulo(titulo)
        if not row:
            return False
        livro_id = row[0]
        remover_livro_biblioteca(usuario_id, livro_id)
        return True

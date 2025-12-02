import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from models.biblioteca import Biblioteca
from models.livro import Livro
from models.usuario import Usuario


def test_biblioteca_criacao():
    """Testa criação de uma biblioteca"""
    u = Usuario(nome="João", email="joao@example.com", senha="segredo")
    b = Biblioteca(nome_biblioteca="Minha Biblioteca", usuario=u)
    assert b.nome == "Minha Biblioteca"
    assert b.usuario == u
    assert b.livros == []


def test_biblioteca_adicionar_remover_livros():
    """Testa adição e remoção de livros na biblioteca"""
    u = Usuario(nome="Ana", email="ana@example.com", senha="1234")
    b = Biblioteca(nome_biblioteca="Biblioteca da Ana", usuario=u)
    
    l1 = Livro(titulo="1984", autor="George Orwell", isbn="9780451524935")
    l2 = Livro(titulo="Dom Casmurro", autor="Machado de Assis", genero="Romance")
    
    # Adicionar livros
    b.adicionar_livro(l1)
    b.adicionar_livro(l2)
    assert len(b.livros) == 2
    assert l1 in b.livros
    assert l2 in b.livros
    
    # Remover livro
    b.remover_livro(l1)
    assert len(b.livros) == 1
    assert l1 not in b.livros
    assert l2 in b.livros


def test_biblioteca_listar_livros():
    """Testa listagem de livros em formato string"""
    u = Usuario(nome="Carlos", email="carlos@example.com", senha="senha123")
    b = Biblioteca(nome_biblioteca="Biblioteca do Carlos", usuario=u)
    
    l1 = Livro(titulo="O Cortiço", autor="Aluísio Azevedo", genero="Romance Naturalista")
    l2 = Livro(titulo="Memórias Póstumas de Brás Cubas", autor="Machado de Assis", genero="Romance")
    
    b.adicionar_livro(l1)
    b.adicionar_livro(l2)
    
    resultado = b.listar_livros()
    assert "O Cortiço" in resultado
    assert "Memórias Póstumas de Brás Cubas" in resultado
    assert "Aluísio Azevedo" in resultado

import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from models.usuario import Usuario
from models.livro import Livro


def test_usuario_criacao_e_repr():
    u = Usuario(nome="João", email="joao@example.com", senha="segredo")
    assert u.nome == "João"
    assert u.email == "joao@example.com"
    assert u.senha == "segredo"
    assert u.biblioteca == []
    assert u.lista_de_desejos == []
    r = repr(u)
    assert "João" in r
    assert "joao@example.com" in r


def test_adicionar_remover_biblioteca_e_desejos():
    u = Usuario(nome="Ana", email="ana@example.com", senha="1234")
    l1 = Livro(titulo="Livro A", autor="Autor A")
    l2 = Livro(titulo="Livro B", autor="Autor B")

    # adicionar à biblioteca
    u.adicionar_livro_biblioteca(l1)
    assert l1 in u.biblioteca

    # adicionar à lista de desejos
    u.adicionar_livro_lista_desejos(l2)
    assert l2 in u.lista_de_desejos

    # remover corretamente
    u.remover_livro_biblioteca(l1)
    assert l1 not in u.biblioteca

    u.remover_livro_lista_desejos(l2)
    assert l2 not in u.lista_de_desejos

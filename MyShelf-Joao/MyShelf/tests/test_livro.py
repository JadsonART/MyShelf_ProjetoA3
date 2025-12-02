import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from models.livro import Livro


def test_livro_criacao_e_repr_sem_isbn():
    l = Livro(titulo="Dom Casmurro", autor="Machado de Assis")
    assert l.titulo == "Dom Casmurro"
    assert l.autor == "Machado de Assis"
    assert l.isbn is None
    r = repr(l)
    assert "Dom Casmurro" in r
    assert "Machado de Assis" in r
    assert "isbn: None" in r


def test_livro_com_isbn():
    l = Livro(titulo="1984", autor="George Orwell", isbn="9780451524935")
    assert l.isbn == "9780451524935"
    r = repr(l)
    assert "1984" in r
    assert "George Orwell" in r
    assert "9780451524935" in r

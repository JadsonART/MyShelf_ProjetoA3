# Guia de Testes Unitários - MyShelf

## 📋 Visão Geral

Este projeto usa **pytest** para testes unitários. Os testes estão localizados em `tests/` e cobrem as entidades principais como `Usuario` e `Livro`.

## 🔧 Instalação

### 1. Ativar o ambiente virtual

**Windows PowerShell:**
```powershell
& 'C:/Users/Pichau/Desktop/MyShelf-Joao/.venv/Scripts/Activate.ps1'
```

**Linux/Mac:**
```bash
source .venv/bin/activate
```

### 2. Instalar pytest (se não tiver)

```bash
pip install pytest
```

## ▶️ Executar Testes

### Rodar todos os testes
```bash
pytest -q
```

### Rodar testes de um arquivo específico
```bash
pytest tests/test_usuario.py -v
pytest tests/test_livro.py -v
```

### Rodar um teste específico
```bash
pytest tests/test_usuario.py::test_usuario_criacao_e_repr -v
```

### Rodar com cobertura (coverage)
```bash
pip install pytest-cov
pytest --cov=models tests/ -v
```

## 📝 Estrutura dos Testes

### Testes de Usuario (`tests/test_usuario.py`)

```python
def test_usuario_criacao_e_repr():
    """Testa criação do usuário e representação em string"""
    u = Usuario(nome="João", email="joao@example.com", senha="segredo")
    assert u.nome == "João"
    assert u.email == "joao@example.com"
    assert u.biblioteca == []

def test_adicionar_remover_biblioteca_e_desejos():
    """Testa adição e remoção de livros na biblioteca e desejos"""
    u = Usuario(nome="Ana", email="ana@example.com", senha="1234")
    l1 = Livro(titulo="Livro A", autor="Autor A")
    
    u.adicionar_livro_biblioteca(l1)
    assert l1 in u.biblioteca
    
    u.remover_livro_biblioteca(l1)
    assert l1 not in u.biblioteca
```

### Testes de Livro (`tests/test_livro.py`)

```python
def test_livro_criacao_e_repr_sem_isbn():
    """Testa criação de livro sem ISBN"""
    l = Livro(titulo="Dom Casmurro", autor="Machado de Assis")
    assert l.titulo == "Dom Casmurro"
    assert l.isbn is None

def test_livro_com_isbn():
    """Testa livro com ISBN"""
    l = Livro(titulo="1984", autor="George Orwell", isbn="9780451524935")
    assert l.isbn == "9780451524935"
```

## 📌 Resultado Atual

Todos os testes estão **passando**:
```
4 passed in 0.08s
```

Testes implementados:
- ✅ `test_usuario.py` - 2 testes
- ✅ `test_livro.py` - 2 testes

## 🔗 Referências

- [Documentação pytest](https://docs.pytest.org/)
- [Pytest Best Practices](https://docs.pytest.org/en/stable/goodpractices.html)

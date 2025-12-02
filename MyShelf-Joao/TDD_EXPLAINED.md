# Test-Driven Development (TDD) - Aplicação Prática no MyShelf

## 📖 O que é TDD?

**TDD (Test-Driven Development)** é uma metodologia onde você escreve testes **antes** de implementar o código. O ciclo segue três fases:

```
1. RED    → Escrever um teste que falha
2. GREEN  → Escrever código mínimo para passar
3. REFACTOR → Melhorar sem quebrar testes
```

### Fluxo Visual

```
┌─────────────┐
│   RED       │  Escrever teste (falha)
│             │
└────┬────────┘
     │
     ▼
┌─────────────┐
│   GREEN     │  Implementar código mínimo
│             │
└────┬────────┘
     │
     ▼
┌─────────────┐
│ REFACTOR    │  Melhorar código
│             │
└────┬────────┘
     │
     ▼
   [Repetir]
```

## 🎯 Caso 1: Classe `Resenha`

### Contexto
Queremos adicionar a funcionalidade de usuários escreverem resenhas sobre livros com nota de 1-5 estrelas.

### Fase 1️⃣: RED (Testes Que Falham)

Primeiro, escrevemos os testes esperados:

```python
# tests/test_resenha.py
import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from models.resenha import Resenha
from models.usuario import Usuario
from models.livro import Livro


def test_resenha_criacao_basica():
    """RED: Classe Resenha não existe ainda"""
    usuario = Usuario(nome="Maria", email="maria@example.com", senha="123")
    livro = Livro(titulo="1984", autor="George Orwell")
    
    resenha = Resenha(usuario=usuario, livro=livro, nota=5, texto="Excelente livro!")
    
    assert resenha.usuario == usuario
    assert resenha.livro == livro
    assert resenha.nota == 5
    assert resenha.texto == "Excelente livro!"


def test_resenha_validacao_nota():
    """RED: Nota deve estar entre 1 e 5"""
    usuario = Usuario(nome="João", email="joao@example.com", senha="123")
    livro = Livro(titulo="Dom Casmurro", autor="Machado de Assis")
    
    # Nota válida
    resenha = Resenha(usuario=usuario, livro=livro, nota=4, texto="Bom livro")
    assert resenha.nota == 4
    
    # Nota inválida deve lançar erro
    try:
        resenha_invalida = Resenha(usuario=usuario, livro=livro, nota=6, texto="Inválido")
        assert False, "Deveria ter lançado ValueError"
    except ValueError as e:
        assert "entre 1 e 5" in str(e)


def test_resenha_data_criacao():
    """RED: Resenha deve ter timestamp de criação"""
    from datetime import datetime
    
    usuario = Usuario(nome="Ana", email="ana@example.com", senha="123")
    livro = Livro(titulo="O Cortiço", autor="Aluísio Azevedo")
    
    antes = datetime.now()
    resenha = Resenha(usuario=usuario, livro=livro, nota=3, texto="Bom")
    depois = datetime.now()
    
    assert antes <= resenha.data_criacao <= depois
```

Ao executar: `pytest tests/test_resenha.py` → ❌ **FALHA** (arquivo não existe)

### Fase 2️⃣: GREEN (Implementar o Mínimo)

Agora criamos a classe `Resenha` com o **mínimo necessário**:

```python
# models/resenha.py
from datetime import datetime


class Resenha:
    def __init__(self, usuario, livro, nota, texto):
        if not (1 <= nota <= 5):
            raise ValueError("Nota deve estar entre 1 e 5")
        
        self.usuario = usuario
        self.livro = livro
        self.nota = nota
        self.texto = texto
        self.data_criacao = datetime.now()
    
    def __repr__(self):
        return f"Resenha(livro={self.livro.titulo}, nota={self.nota}/5, usuario={self.usuario.nome})"
```

Ao executar: `pytest tests/test_resenha.py` → ✅ **PASSA**

### Fase 3️⃣: REFACTOR (Melhorias)

Agora podemos melhorar sem quebrar os testes:

```python
# models/resenha.py (versão melhorada)
from datetime import datetime


class Resenha:
    NOTA_MINIMA = 1
    NOTA_MAXIMA = 5
    
    def __init__(self, usuario, livro, nota, texto):
        self._validar_nota(nota)
        
        self.usuario = usuario
        self.livro = livro
        self.nota = nota
        self.texto = texto
        self.data_criacao = datetime.now()
    
    @staticmethod
    def _validar_nota(nota):
        """Valida se a nota está no intervalo permitido"""
        if not isinstance(nota, (int, float)):
            raise TypeError("Nota deve ser um número")
        if not (Resenha.NOTA_MINIMA <= nota <= Resenha.NOTA_MAXIMA):
            raise ValueError(
                f"Nota deve estar entre {Resenha.NOTA_MINIMA} e {Resenha.NOTA_MAXIMA}"
            )
    
    def estrelas(self):
        """Retorna representação visual em estrelas"""
        return "⭐" * int(self.nota)
    
    def __repr__(self):
        return f"Resenha(livro='{self.livro.titulo}', nota={self.nota}/5, user={self.usuario.nome})"
```

Testes continuam passando ✅

---

## 🎯 Caso 2: Classe `ListaConquistas`

### Contexto
Sistema de "achievements" - usuários desbloqueiam conquistas ao atingir marcos no app.

### Fase 1️⃣: RED (Testes)

```python
# tests/test_lista_conquistas.py
import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from models.lista_conquistas import ListaConquistas, Desbloqueio
from models.usuario import Usuario


def test_desbloqueio_criacao():
    """RED: Classe Desbloqueio não existe"""
    desbloqueio = Desbloqueio(
        id_="leitura_5",
        nome="Leitor Iniciante",
        descricao="Leia 5 livros",
        icone="📚"
    )
    
    assert desbloqueio.id_ == "leitura_5"
    assert desbloqueio.nome == "Leitor Iniciante"
    assert desbloqueio.descricao == "Leia 5 livros"
    assert desbloqueio.icone == "📚"


def test_lista_conquistas_criacao():
    """RED: Classe ListaConquistas não existe"""
    usuario = Usuario(nome="Pedro", email="pedro@example.com", senha="123")
    lista = ListaConquistas(usuario=usuario)
    
    assert lista.usuario == usuario
    assert lista.conquistas == []
    assert lista.total_conquistas() == 0


def test_desbloquear_conquista():
    """RED: Usuário desbloqueia conquista"""
    usuario = Usuario(nome="Sofia", email="sofia@example.com", senha="123")
    lista = ListaConquistas(usuario=usuario)
    
    conquista = Desbloqueio(
        id_="primeira_resenha",
        nome="Crítico",
        descricao="Escreva sua primeira resenha",
        icone="✍️"
    )
    
    lista.desbloquear(conquista)
    
    assert lista.total_conquistas() == 1
    assert conquista in lista.conquistas
    assert lista.tem_conquista("primeira_resenha") is True


def test_nao_desbloquear_duplicado():
    """RED: Não permitir desbloquear a mesma conquista 2 vezes"""
    usuario = Usuario(nome="Luis", email="luis@example.com", senha="123")
    lista = ListaConquistas(usuario=usuario)
    
    conquista = Desbloqueio(
        id_="colecionador",
        nome="Colecionador",
        descricao="Tenha 10 livros na biblioteca",
        icone="🏆"
    )
    
    lista.desbloquear(conquista)
    lista.desbloquear(conquista)  # Tentar desbloquear de novo
    
    assert lista.total_conquistas() == 1  # Deve ter apenas 1


def test_listar_conquistas():
    """RED: Listar conquistas desbloqueadas"""
    usuario = Usuario(nome="Helena", email="helena@example.com", senha="123")
    lista = ListaConquistas(usuario=usuario)
    
    c1 = Desbloqueio(id_="a", nome="Primeiro", descricao="desc1", icone="🔥")
    c2 = Desbloqueio(id_="b", nome="Segundo", descricao="desc2", icone="💎")
    
    lista.desbloquear(c1)
    lista.desbloquear(c2)
    
    resultado = lista.listar_conquistas()
    assert "Primeiro" in resultado
    assert "Segundo" in resultado
    assert "🔥" in resultado
    assert "💎" in resultado
```

Ao executar: `pytest tests/test_lista_desbloqueios.py` → ❌ **FALHA**

### Fase 2️⃣: GREEN (Implementação Mínima)

```python
# models/lista_conquistas.py

class Desbloqueio:
    def __init__(self, id_, nome, descricao, icone):
        self.id_ = id_
        self.nome = nome
        self.descricao = descricao
        self.icone = icone
    
    def __eq__(self, outro):
        return isinstance(outro, Desbloqueio) and self.id_ == outro.id_
    
    def __repr__(self):
        return f"{self.icone} {self.nome}"


class ListaConquistas:
    def __init__(self, usuario):
        self.usuario = usuario
        self.conquistas = []
    
    def desbloquear(self, conquista):
        """Desbloqueia uma conquista (não permite duplicatas)"""
        if conquista not in self.conquistas:
            self.conquistas.append(conquista)
    
    def total_conquistas(self):
        """Retorna a quantidade de conquistas"""
        return len(self.conquistas)
    
    def tem_conquista(self, id_conquista):
        """Verifica se possui uma conquista específica"""
        return any(c.id_ == id_conquista for c in self.conquistas)
    
    def listar_conquistas(self):
        """Retorna representação em string das conquistas"""
        if not self.conquistas:
            return "Nenhuma conquista ainda"
        return "\n".join(f"{c.icone} {c.nome} - {c.descricao}" for c in self.conquistas)
```

Ao executar: `pytest tests/test_lista_desbloqueios.py` → ✅ **PASSA**

### Fase 3️⃣: REFACTOR (Melhorias)

```python
# models/lista_conquistas.py (versão melhorada)
from datetime import datetime
from typing import Optional, List


class Desbloqueio:
    def __init__(self, id_: str, nome: str, descricao: str, icone: str):
        if not all([id_, nome, descricao, icone]):
            raise ValueError("Todos os campos são obrigatórios")
        
        self.id_ = id_
        self.nome = nome
        self.descricao = descricao
        self.icone = icone
        self.data_criacao = datetime.now()
    
    def __eq__(self, outro):
        return isinstance(outro, Desbloqueio) and self.id_ == outro.id_
    
    def __hash__(self):
        return hash(self.id_)
    
    def __repr__(self):
        return f"{self.icone} {self.nome}"


class ListaConquistas:
    def __init__(self, usuario):
        self.usuario = usuario
        self._conquistas: List[Desbloqueio] = []
    
    @property
    def conquistas(self) -> List[Desbloqueio]:
        """Propriedade para acessar conquistas"""
        return self._conquistas
    
    def desbloquear(self, conquista: Desbloqueio) -> bool:
        """Desbloqueia uma conquista. Retorna True se nova, False se já existia"""
        if conquista in self._conquistas:
            return False
        self._conquistas.append(conquista)
        return True
    
    def total_conquistas(self) -> int:
        """Retorna quantidade de conquistas"""
        return len(self._conquistas)
    
    def tem_conquista(self, id_conquista: str) -> bool:
        """Verifica se possui uma conquista específica"""
        return any(c.id_ == id_conquista for c in self._conquistas)
    
    def obter_conquista(self, id_conquista: str) -> Optional[Desbloqueio]:
        """Obtém conquista por ID"""
        for c in self._conquistas:
            if c.id_ == id_conquista:
                return c
        return None
    
    def listar_conquistas(self) -> str:
        """Retorna representação em string formatada"""
        if not self._conquistas:
            return "🎯 Nenhuma conquista ainda. Continue lendo!"
        
        linhas = [f"🏆 Conquistas ({self.total_conquistas()}):\n"]
        linhas.extend(f"  {c.icone} {c.nome}\n    └─ {c.descricao}" 
                     for c in self._conquistas)
        return "\n".join(linhas)
    
    def progresso_percentual(self, total_possiveis: int) -> float:
        """Calcula progresso em percentual"""
        if total_possiveis == 0:
            return 0.0
        return (self.total_conquistas() / total_possiveis) * 100
```

Testes continuam passando ✅

---

## 📊 Comparação: Desenvolvimento Tradicional vs TDD

### Desenvolvimento Tradicional (Sem TDD)

```
1. Implementar código
2. Testar manualmente
3. Encontrar bugs
4. Corrigir e testar novamente
5. Possível quebra de funcionalidades
```

❌ Problemas: Bugs descobertos tarde, refatoração arriscada, cobertura incerta

### Com TDD

```
1. Escrever testes (RED)
2. Implementar mínimo (GREEN)
3. Refatorar com segurança (REFACTOR)
4. Todos os testes passam sempre
```

✅ Vantagens: Bugs encontrados cedo, design melhor, refatoração segura, cobertura 100%

---

## 🎓 Benefícios Demonstrados

### 1. **Design Melhor**
- Classe `Resenha` com validação clara desde o início
- Classe `ListaDesbloqueios` com interface bem definida

### 2. **Documentação**
- Testes servem como exemplos de uso
- Cada teste documenta um comportamento esperado

### 3. **Segurança ao Refatorar**
- Mudamos a implementação interna (propriedade `_desbloqueios`)
- Testes continuam passando ✅

### 4. **Menos Bugs**
- Validações escritas antes do código
- Edge cases pensados antecipadamente

### 5. **Confiança**
- Ao refatorar, sabemos que nada quebrou
- Cada mudança é testada automaticamente


## 🔗 Referências

- [Test-Driven Development by Kent Beck](https://www.amazon.com/Test-Driven-Development-Kent-Beck/dp/0321146530)
- [Clean Code by Robert Martin](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882)
- [Pytest Documentation](https://docs.pytest.org/)


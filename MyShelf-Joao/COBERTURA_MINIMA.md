# Análise de Cobertura de Código - MyShelf

## 📊 Cobertura Atual

```
Name                   Stmts   Miss  Cover   Missing
----------------------------------------------------
models\biblioteca.py      12      0   100%
models\livro.py            8      0   100%
models\usuario.py         21      0   100%
----------------------------------------------------
TOTAL                     41      0   100%
```

**Status**: ✅ **100% de cobertura** nas entidades principais

**Testes implementados**: 7 testes passando em 0.09s

## 🎯 Cobertura Mínima Recomendada: 80%

### Justificativa

#### 1. **Conformidade com Padrões da Indústria**
- A maioria das empresas e projetos open-source adota **80% como baseline**
- Padrão recomendado por organismos como:
  - **ISO/IEC 26262** (Segurança funcional de sistemas eletrônicos)
  - **ISTQB** (International Software Testing Qualifications Board)
  - **IEEE 1061** (Métricas de qualidade de software)

#### 2. **Adequação ao Tipo de Projeto**
Este é um projeto educacional/portfólio com:
- ✅ **Modelos simples e estáveis** (Usuario, Livro, Biblioteca)
- ✅ **Lógica de negócio clara** e bem definida
- ✅ **Pouca complexidade** em cálculos ou algoritmos avançados

**Cobertura ideal**: 80-100%

#### 3. **Componentes Críticos vs Secundários**

| Componente | Criticidade | Cobertura Mínima | Status |
|-----------|-----------|------------------|--------|
| `models/usuario.py` | 🔴 CRÍTICA | 100% | ✅ 100% |
| `models/livro.py` | 🔴 CRÍTICA | 100% | ✅ 100% |
| `models/biblioteca.py` | 🟡 ALTA | 100% | ✅ 100% |
| `services/*` | 🟡 ALTA | 80-90% | ⏳ Não testado |
| `database/*` | 🟡 ALTA | 80-90% | ⏳ Não testado |
| `templates/*` | 🟢 BAIXA | 50-70% | N/A (Frontend) |

## 📈 Cobertura por Entidade

### Usuario (21 instruções)
- **Cobertura**: 100%
- **Testes**: 2
- **O que é coberto**:
  - ✅ Inicialização com/sem ID
  - ✅ Adição à biblioteca
  - ✅ Remoção da biblioteca
  - ✅ Adição à lista de desejos
  - ✅ Remoção da lista de desejos
  - ✅ Representação em string (`__repr__`)

### Livro (8 instruções)
- **Cobertura**: 100%
- **Testes**: 2
- **O que é coberto**:
  - ✅ Inicialização com ISBN
  - ✅ Inicialização sem ISBN
  - ✅ Gênero opcional
  - ✅ Representação em string (`__repr__`)

### Biblioteca (12 instruções)
- **Cobertura**: 100%
- **Testes**: 3
- **O que é coberto**:
  - ✅ Inicialização
  - ✅ Adição de livros
  - ✅ Remoção de livros
  - ✅ Listagem de livros em string
  - ✅ Casos de remoção (livro não existe)
---

**Última atualização**: 1 de dezembro de 2025  
**Testes passando**: 7/7 ✅  
**Cobertura atual**: 100% (modelos)

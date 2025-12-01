# -*- coding: utf-8 -*-
import sys
from database.db import inserir_livro, atualizar_capa_livro, criar_tabelas
from services.capa_livro_service import BookCoverService

# Criar tabelas se não existirem
criar_tabelas()

# Lista de livros com ISBNs válidos (best-sellers e clássicos)
livros_para_inserir = [
    # Clássicos
    ("O Cortiço", "Aluísio Azevedo", "Romance", "9788535914152"),
    ("Dom Casmurro", "Machado de Assis", "Romance", "9788525406617"),
    ("O Alienista", "Machado de Assis", "Ficção Científica", "9788535913896"),
    ("Grande Sertão: Veredas", "Guimarães Rosa", "Romance", "9788532526557"),
    ("Capitães da Areia", "Jorge Amado", "Romance", "9788535914627"),
    
    # Ficção Contemporânea
    ("A Culpa é das Estrelas", "John Green", "Romance Jovem", "9788532515599"),
    ("O Menino que Descobriu o Vento", "William Kamkwamba", "Não-Ficção", "9788532527197"),
    ("A Garota do Trem", "Paula Hawkins", "Suspense", "9788532529619"),
    ("O Código Da Vinci", "Dan Brown", "Suspense", "9788532527289"),
    ("O Senhor dos Anéis", "J.R.R. Tolkien", "Fantasia", "9788581888713"),
    
    # Ficção Científica
    ("Fundação", "Isaac Asimov", "Ficção Científica", "9788577807223"),
    ("1984", "George Orwell", "Ficção Científica", "9788535914849"),
    ("Neuromancer", "William Gibson", "Ficção Científica", "9788532528063"),
    ("Duna", "Frank Herbert", "Ficção Científica", "9788595086522"),
    
    # Mistério e Suspense
    ("Assassinato no Expresso do Oriente", "Agatha Christie", "Mistério", "9788532527272"),
    ("O Iluminado", "Stephen King", "Horror", "9788532529770"),
    ("O Silêncio dos Inocentes", "Thomas Harris", "Suspense", "9788532525032"),
    
    # Desenvolvimento Pessoal
    ("Hábitos Atômicos", "James Clear", "Desenvolvimento Pessoal", "9788550702636"),
    ("O Poder do Hábito", "Charles Duhigg", "Desenvolvimento Pessoal", "9788532618031"),
    ("Mindset", "Carol S. Dweck", "Desenvolvimento Pessoal", "9788550801728"),
    
    # Fantasia
    ("O Hobbit", "J.R.R. Tolkien", "Fantasia", "9788581888706"),
    ("Harry Potter e a Pedra Filosofal", "J.K. Rowling", "Fantasia", "9788532530787"),
    ("As Crônicas de Nárnia", "C.S. Lewis", "Fantasia", "9788588236752"),
    ("Percy Jackson e os Olimpianos", "Rick Riordan", "Fantasia Jovem", "9788532530265"),
    
    # Romance
    ("Orgulho e Preconceito", "Jane Austen", "Romance", "9788532519566"),
    ("Romeu e Julieta", "William Shakespeare", "Romance Clássico", "9788532524928"),
    ("O Diário de Anne Frank", "Anne Frank", "Memórias", "9788535925449"),
]

service = BookCoverService()
livros_inseridos = 0
capas_encontradas = 0

print("Iniciando insercao de livros e busca de capas...")
print("-" * 60)

for titulo, autor, genero, isbn in livros_para_inserir:
    try:
        # Insere o livro
        livro_id = inserir_livro(titulo, autor, genero, isbn)
        livros_inseridos += 1
        
        # Busca a capa
        url_capa = service.obter_capa(isbn, titulo, autor)
        
        if url_capa:
            atualizar_capa_livro(livro_id, url_capa)
            capas_encontradas += 1
            status = "[OK] Capa encontrada"
        else:
            status = "[AVISO] Capa nao encontrada"
        
        print(f"{status}: {titulo[:30]:30} | {autor[:20]:20} | ISBN: {isbn}")
        
    except Exception as e:
        if "UNIQUE constraint failed" in str(e):
            print(f"[SKIP] Ja existe: {titulo[:30]:30} | {autor[:20]:20}")
        else:
            print(f"[ERRO] Ao inserir {titulo}: {str(e)}")

print("-" * 60)
print(f"\nResumo:")
print(f"  Livros inseridos: {livros_inseridos}")
print(f"  Capas encontradas: {capas_encontradas}")
print(f"  Capas nao encontradas: {livros_inseridos - capas_encontradas}")

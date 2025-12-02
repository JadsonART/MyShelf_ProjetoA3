# -*- coding: utf-8 -*-
import sys
import time
from database.db import conectar, atualizar_capa_livro, criar_tabelas
from services.capa_livro_service import BookCoverService

# Criar tabelas se não existirem
criar_tabelas()

print("Atualizando capas de livros no banco de dados...")
print("-" * 70)

conn = conectar()
cur = conn.cursor()

# Busca todos os livros sem capa
cur.execute("SELECT id, titulo, autor, isbn FROM livros WHERE capa IS NULL OR capa = ''")
livros_sem_capa = cur.fetchall()

print(f"Encontrados {len(livros_sem_capa)} livros sem capa")
print("-" * 70)

capas_atualizadas = 0
capas_nao_encontradas = 0

for livro_id, titulo, autor, isbn in livros_sem_capa:
    print(f"\nBuscando capa para: {titulo[:40]}")
    print(f"  ISBN: {isbn}")
    print(f"  Autor: {autor[:40]}")
    
    try:
        # Tenta buscar a capa
        url_capa = BookCoverService.obter_capa(isbn=isbn, titulo=titulo, autor=autor)
        
        if url_capa:
            print(f"  URL: {url_capa[:60]}...")
            atualizar_capa_livro(livro_id, url_capa)
            capas_atualizadas += 1
            print(f"  Status: OK")
        else:
            capas_nao_encontradas += 1
            print(f"  Status: Nao encontrada")
        
        # Pequeno delay para não sobrecarregar as APIs
        time.sleep(1)
        
    except Exception as e:
        print(f"  ERRO: {str(e)}")
        capas_nao_encontradas += 1

conn.close()

print("\n" + "-" * 70)
print("Resumo:")
print(f"  Total de livros: {len(livros_sem_capa)}")
print(f"  Capas atualizadas: {capas_atualizadas}")
print(f"  Capas nao encontradas: {capas_nao_encontradas}")
print("-" * 70)

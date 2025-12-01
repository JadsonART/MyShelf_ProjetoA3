import sqlite3
from pathlib import Path

DB_NAME = "myshelf.db"

    # Garante que o arquivo de banco fique na raiz do projeto
def conectar():
    return sqlite3.connect(Path(DB_NAME))

def criar_tabelas():
    conn = conectar()
    cur = conn.cursor()

    cur.execute("""
    CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    senha TEXT NOT NULL,
    generos_preferidos TEXT
    )
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS livros (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    autor TEXT NOT NULL,
    genero TEXT,
    isbn TEXT,
    capa TEXT,
    UNIQUE(titulo, autor)
    )
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS biblioteca (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER,
    livro_id INTEGER,
    lido INTEGER DEFAULT 0,          -- 0 = não lido, 1 = lido
    lendo INTEGER DEFAULT 0,         -- 0 = não está lendo, 1 = está lendo
    FOREIGN KEY(usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY(livro_id) REFERENCES livros(id),
    UNIQUE(usuario_id, livro_id)
    )
    """)

    
    cur.execute("""
    CREATE TABLE IF NOT EXISTS lista_desejos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER,
    livro_id INTEGER,
    FOREIGN KEY(usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY(livro_id) REFERENCES livros(id),
    UNIQUE(usuario_id, livro_id)
    )
    """)


    conn.commit()
    conn.close()

def inserir_usuario(nome, email, senha):
    conn = conectar()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)",
        (nome, email, senha)
    )
    conn.commit()
    user_id = cur.lastrowid
    conn.close()
    return user_id

def buscar_usuario_por_email(email):
    conn = conectar()
    cur = conn.cursor()
    cur.execute("SELECT id, nome, email, senha, generos_preferidos FROM usuarios WHERE email = ?", (email,))
    row = cur.fetchone()
    conn.close()
    return row

def buscar_usuario_por_id(usuario_id):
    conn = conectar()
    cur = conn.cursor()
    cur.execute("SELECT id, nome, email, senha, generos_preferidos FROM usuarios WHERE id = ?", (usuario_id,))
    row = cur.fetchone()
    conn.close()
    return row

def atualizar_usuario(usuario_id, nome, email, senha, generos_preferidos=None):
    """Atualiza informações do usuário"""
    conn = conectar()
    cur = conn.cursor()
    
    generos_str = ",".join(generos_preferidos) if generos_preferidos else None
    
    cur.execute("""
        UPDATE usuarios 
        SET nome = ?, email = ?, senha = ?, generos_preferidos = ?
        WHERE id = ?
    """, (nome, email, senha, generos_str, usuario_id))
    
    conn.commit()
    conn.close()

def obter_generos_preferidos(usuario_id):
    """Obtém os gêneros preferidos do usuário"""
    conn = conectar()
    cur = conn.cursor()
    cur.execute("SELECT generos_preferidos FROM usuarios WHERE id = ?", (usuario_id,))
    row = cur.fetchone()
    conn.close()
    
    if row and row[0]:
        return row[0].split(",")
    return []

def atualizar_capa_livro(livro_id, url_capa):
    """Atualiza a URL da capa de um livro"""
    conn = conectar()
    cur = conn.cursor()
    cur.execute("UPDATE livros SET capa = ? WHERE id = ?", (url_capa, livro_id))
    conn.commit()
    conn.close()

def obter_livro_completo(livro_id):
    """Obtém informações completas do livro incluindo capa"""
    conn = conectar()
    cur = conn.cursor()
    cur.execute("SELECT id, titulo, autor, genero, isbn, capa FROM livros WHERE id = ?", (livro_id,))
    row = cur.fetchone()
    conn.close()
    return row

def inserir_livro(titulo, autor, genero=None, isbn=None):
    conn = conectar()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO livros (titulo, autor, genero, isbn) VALUES (?, ?, ?, ?)",
        (titulo, autor, genero, isbn)
    )
    conn.commit()
    livro_id = cur.lastrowid
    conn.close()
    return livro_id

def buscar_livro_por_titulo(titulo):
    conn = conectar()
    cur = conn.cursor()
    cur.execute("SELECT id, titulo, autor, genero, isbn FROM livros WHERE titulo = ?", (titulo,))
    row = cur.fetchone()
    conn.close()
    return row

def adicionar_livro_biblioteca(usuario_id, livro_id):
    conn = conectar()
    cur = conn.cursor()
    cur.execute(
        "INSERT OR IGNORE INTO biblioteca (usuario_id, livro_id) VALUES (?, ?)",
        (usuario_id, livro_id)
    )
    conn.commit()
    conn.close()

def listar_biblioteca(usuario_id):
    conn = conectar()
    cur = conn.cursor()
    cur.execute("""
    SELECT l.titulo, l.autor, l.genero
    FROM biblioteca b
    JOIN livros l ON b.livro_id = l.id
    WHERE b.usuario_id = ?
    ORDER BY l.titulo ASC
    """, (usuario_id,))
    rows = cur.fetchall()
    conn.close()
    return rows

def remover_livro_biblioteca(usuario_id, livro_id):
    conn = conectar()
    cur = conn.cursor()
    cur.execute("DELETE FROM biblioteca WHERE usuario_id = ? AND livro_id = ?", (usuario_id, livro_id))
    conn.commit()
    conn.close()
    
def inserir_livros_iniciais():
    conn = conectar()
    cur = conn.cursor()

    livros_iniciais = [
        ("O Hobbit", "J.R.R. Tolkien", "Fantasia", "9788595084742"),
        ("Sapiens", "Yuval Noah Harari", "História", "9788543801570"),
        ("Clean Code", "Robert C. Martin", "Tecnologia", "9780132350884"),
        ("Hábitos Atômicos", "James Clear", "Desenvolvimento Pessoal", "9788550807562"),
        ("Dom Casmurro", "Machado de Assis", "Literatura Brasileira", "9788525044648"),
        ("1984", "George Orwell", "Ficção", "9788535914849"),
        ("A Revolução dos Bichos", "George Orwell", "Ficção", "9788535909555"),
        ("O Pequeno Príncipe", "Antoine de Saint-Exupéry", "Infantil", "9786555521368"),
        ("A Arte da Guerra", "Sun Tzu", "Estratégia", "9786585849876"),
        ("Orgulho e Preconceito", "Jane Austen", "Romance", "9788503013734"),
        ("O Senhor dos Anéis", "J.R.R. Tolkien", "Fantasia", "9788533613407"),
        ("Harry Potter e a Pedra Filosofal", "J.K. Rowling", "Fantasia", "9788532511010"),
        ("O Código Da Vinci", "Dan Brown", "Suspense", "9788575421132"),
        ("A Menina que Roubava Livros", "Markus Zusak", "Drama", "9788598078175"),
        ("Cem Anos de Solidão", "Gabriel García Márquez", "Ficção", "9788535914840"),
        ("O Alquimista", "Paulo Coelho", "Ficção", "9788575420159"),
        ("Moby Dick", "Herman Melville", "Aventura", "9780142437247"),
        ("Crime e Castigo", "Fiódor Dostoiévski", "Romance", "9788537813134"),
        ("A Odisséia", "Homero", "Épico", "9780140268867"),
        ("O Apanhador no Campo de Centeio", "J.D. Salinger", "Romance", "9780316769488"),
        ("O Morro dos Ventos Uivantes", "Emily Brontë", "Clássico", "9788537813196"),
        ("A Metamorfose", "Franz Kafka", "Ficção", "9788537813127"),
        ("O Conde de Monte Cristo", "Alexandre Dumas", "Clássico", "9780140449266"),
        ("O Nome da Rosa", "Umberto Eco", "Histórico", "9788535908948")
    ]

    for titulo, autor, genero, isbn in livros_iniciais:
        cur.execute("""
            INSERT OR IGNORE INTO livros (titulo, autor, genero, isbn)
            VALUES (?, ?, ?, ?)
        """, (titulo, autor, genero, isbn))

    conn.commit()
    conn.close()
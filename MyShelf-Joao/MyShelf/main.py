from flask import flash, Flask, request, render_template, redirect, url_for, session
from database.db import criar_tabelas, inserir_livros_iniciais, conectar, buscar_usuario_por_id, atualizar_usuario, obter_generos_preferidos, atualizar_capa_livro, obter_livro_completo
from services.recomendacao_service import RecomendacaoService
from services.capa_livro_service import BookCoverService


app = Flask(__name__)


app.secret_key = "segredo_super_secreto"  # Necessário para sessõesa

# Inicializa banco
criar_tabelas()
inserir_livros_iniciais()



@app.route("/")
def home():
    return redirect(url_for("login"))

# Rota de registro
@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        nome = request.form["nome"]
        email = request.form["email"]
        senha = request.form["senha"]
        
        conn = conectar()
        cur = conn.cursor()
        
        try:
            cur.execute("INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)", (nome, email, senha))
            conn.commit()
            usuario_id = cur.lastrowid
            session["usuario_id"] = usuario_id
            return redirect(url_for("catalogo"))
        except:
            return render_template("register.html", erro="Email já cadastrado")
        finally:
            conn.close()
            
    return render_template("register.html")

# Rota de login
@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.form["email"]
        senha = request.form["senha"]
        
        conn = conectar()
        cur = conn.cursor()
        cur.execute("SELECT id, nome, senha FROM usuarios WHERE email = ?", (email,))
        usuario = cur.fetchone()
        conn.close()

        if usuario and usuario[2] == senha:
            session["usuario_id"] = usuario[0]
            return redirect(url_for("dashboard"))
        else:
            return render_template("login.html", erro="Usuário ou senha inválidos")

    return render_template("login.html")

# Tela principal do usuário, com estatísticas

@app.route("/dashboard")
def dashboard():
    usuario_id = session.get("usuario_id")
    if not usuario_id:
        return redirect(url_for("login"))

    conn = conectar()
    cur = conn.cursor()

    # Total de livros na biblioteca
    cur.execute("SELECT COUNT(*) FROM biblioteca WHERE usuario_id = ?", (usuario_id,))
    total_biblioteca = cur.fetchone()[0]

    # Quantos estão sendo lidos
    cur.execute("SELECT COUNT(*) FROM biblioteca WHERE usuario_id = ? AND lendo = 1", (usuario_id,))
    total_lendo = cur.fetchone()[0]

    # Quantos já foram lidos
    cur.execute("SELECT COUNT(*) FROM biblioteca WHERE usuario_id = ? AND lido = 1", (usuario_id,))
    total_lidos = cur.fetchone()[0]

    # Quantos estão na lista de desejos
    cur.execute("SELECT COUNT(*) FROM lista_desejos WHERE usuario_id = ?", (usuario_id,))
    total_desejos = cur.fetchone()[0]

    conn.close()

    return render_template("dashboard.html",
                           total_biblioteca=total_biblioteca,
                           total_lendo=total_lendo,
                           total_lidos=total_lidos,
                           total_desejos=total_desejos)

# Adicionar livro, Listar livros
@app.route("/biblioteca", methods=["GET", "POST"])
def biblioteca():
    usuario_id = session.get("usuario_id")
    if not usuario_id:
        return redirect(url_for("login"))

    if request.method == "POST":
        livro_id = request.form["livro_id"]
        conn = conectar()
        cur = conn.cursor()
        cur.execute("INSERT OR IGNORE INTO biblioteca (usuario_id, livro_id) VALUES (?, ?)", (usuario_id, livro_id))
        conn.commit()
        conn.close()

    conn = conectar()
    cur = conn.cursor()
    cur.execute("""
    SELECT l.titulo, l.autor, l.genero, b.lido, b.lendo, l.id
    FROM biblioteca b
    JOIN livros l ON b.livro_id = l.id
    WHERE b.usuario_id = ?
    """, (usuario_id,))
    livros = cur.fetchall()
    conn.close()

    return render_template("biblioteca.html", livros=livros)

# Adicionar Livro

@app.route("/biblioteca/adicionar", methods=["POST"])
def adicionar_livro():
    usuario_id = session.get("usuario_id")
    if not usuario_id:
        return redirect(url_for("login"))

    livro_id = request.form["livro_id"]

    conn = conectar()
    cur = conn.cursor()
    
    # Buscar título do livro
    cur.execute("SELECT titulo FROM livros WHERE id = ?", (livro_id,))
    livro = cur.fetchone()
    
    # Verificar se já está na biblioteca
    cur.execute("SELECT 1 FROM biblioteca WHERE usuario_id = ? AND livro_id = ?", (usuario_id, livro_id))
    existe = cur.fetchone()

    if existe:
        flash(f'O livro "{livro[0]}" já está na sua biblioteca!', "warning")
    else:
        cur.execute("INSERT INTO biblioteca (usuario_id, livro_id) VALUES (?, ?)", (usuario_id, livro_id))
        conn.commit()
        flash(f'O livro "{livro[0]}" foi adicionado à sua biblioteca!', "success")

    conn.close()
    return redirect(url_for("catalogo"))

# Remover livro

@app.route("/biblioteca/remover", methods=["POST"])
def remover_livro():
    usuario_id = session.get("usuario_id")
    if not usuario_id:
        return redirect(url_for("login"))

    livro_id = request.form["livro_id"]

    conn = conectar()
    cur = conn.cursor()
    
    # Buscar título do livro
    cur.execute("SELECT titulo FROM livros WHERE id = ?", (livro_id,))
    livro = cur.fetchone()
    
    # Remover da biblioteca
    cur.execute("SELECT titulo FROM livros WHERE id = ?", (livro_id,))
    livro = cur.fetchone()
    cur.execute("DELETE FROM biblioteca WHERE usuario_id = ? AND livro_id = ?", (usuario_id, livro_id))
    conn.commit()
    conn.close()
    
    if livro:
        flash(f'O livro "{livro[0]}" foi removido da sua biblioteca!', "danger")

    return redirect(url_for("biblioteca"))

# Status do livro (lido/lendo)

@app.route("/biblioteca/status", methods=["POST"])
def atualizar_status():
    usuario_id = session.get("usuario_id")
    if not usuario_id:
        return redirect(url_for("login"))

    livro_id = request.form["livro_id"]
    status = request.form["status"]  # "lido" ou "lendo"

    conn = conectar()
    cur = conn.cursor()

    if status == "lido":
        cur.execute("UPDATE biblioteca SET lido = 1, lendo = 0 WHERE usuario_id = ? AND livro_id = ?", (usuario_id, livro_id))
    elif status == "lendo":
        cur.execute("UPDATE biblioteca SET lendo = 1, lido = 0 WHERE usuario_id = ? AND livro_id = ?", (usuario_id, livro_id))

    conn.commit()
    conn.close()

    flash(f'Status do livro atualizado para "{status}"!', "info")
    return redirect(url_for("biblioteca"))

# Catálogo de livros

@app.route("/catalogo")
def catalogo():
    usuario_id = session.get("usuario_id")
    if not usuario_id:
        return redirect(url_for("login"))

    conn = conectar()
    cur = conn.cursor()
    cur.execute("SELECT id, titulo, autor, genero FROM livros ORDER BY titulo ASC")
    livros = cur.fetchall()
    conn.close()

    return render_template("catalogo.html", livros=livros)

# Lista de desejos

@app.route("/desejos", methods=["GET", "POST"])
def desejos():
    usuario_id = session.get("usuario_id")
    if not usuario_id:
        return redirect(url_for("login"))

    if request.method == "POST":
        livro_id = request.form["livro_id"]

        conn = conectar()
        cur = conn.cursor()

        # Verifica se já está na lista
        cur.execute("SELECT 1 FROM lista_desejos WHERE usuario_id = ? AND livro_id = ?", (usuario_id, livro_id))
        existe = cur.fetchone()

        if existe:
            cur.execute("SELECT titulo FROM livros WHERE id = ?", (livro_id,))
            livro = cur.fetchone()
            flash(f'O livro "{livro[0]}" já está na sua lista de desejos!', "warning")
        else:
            cur.execute("INSERT INTO lista_desejos (usuario_id, livro_id) VALUES (?, ?)", (usuario_id, livro_id))
            conn.commit()
            cur.execute("SELECT titulo FROM livros WHERE id = ?", (livro_id,))
            livro = cur.fetchone()
            flash(f'O livro "{livro[0]}" foi adicionado à sua lista de desejos!', "success")

        conn.close()
        return redirect(url_for("catalogo"))

    # Listar livros da lista de desejos
    conn = conectar()
    cur = conn.cursor()
    cur.execute("""
    SELECT l.titulo, l.autor, l.genero, l.id
    FROM lista_desejos d
    JOIN livros l ON d.livro_id = l.id
    WHERE d.usuario_id = ?
    """, (usuario_id,))
    livros = cur.fetchall()
    conn.close()

    return render_template("desejos.html", livros=livros)

# Remover livro da lista de desejos

@app.route("/desejos/remover", methods=["POST"])
def remover_desejo():
    usuario_id = session.get("usuario_id")
    if not usuario_id:
        return redirect(url_for("login"))

    livro_id = request.form["livro_id"]

    conn = conectar()
    cur = conn.cursor()
    cur.execute("SELECT titulo FROM livros WHERE id = ?", (livro_id,))
    livro = cur.fetchone()
    cur.execute("DELETE FROM lista_desejos WHERE usuario_id = ? AND livro_id = ?", (usuario_id, livro_id))
    conn.commit()
    conn.close()

    if livro:
        flash(f'O livro "{livro[0]}" foi removido da sua lista de desejos!', "danger")

    return redirect(url_for("desejos"))

# Buscar livros

@app.route("/buscar", methods=["GET", "POST"])
def buscar():
    usuario_id = session.get("usuario_id")
    if not usuario_id:
        return redirect(url_for("login"))

    titulo = None
    genero = None
    isbn = None
    autor = None
    resultados = []

    conn = conectar()
    cur = conn.cursor()

    # Buscar todos os gêneros distintos
    cur.execute("SELECT DISTINCT genero FROM livros ORDER BY genero")
    generos = [row[0] for row in cur.fetchall()]

    if request.method == "POST":
        titulo = request.form.get("titulo")
        genero = request.form.get("genero")
        isbn = request.form.get("isbn")
        autor = request.form.get("autor")

        query = "SELECT id, titulo, autor, genero, isbn FROM livros WHERE 1=1"
        params = []

        if titulo:
            query += " AND titulo LIKE ?"
            params.append(f"%{titulo}%")

        if genero and genero != "Todos":
            query += " AND LOWER(genero) = LOWER(?)"
            params.append(genero)

        if isbn:
            query += " AND isbn LIKE ?"
            params.append(f"%{isbn}%")

        if autor:
            query += " AND autor LIKE ?"
            params.append(f"%{autor}%")

        cur.execute(query, params)
        resultados = cur.fetchall()

    conn.close()

    return render_template("buscar.html",
                           resultados=resultados,
                           titulo=titulo,
                           genero=genero,
                           isbn=isbn,
                           autor=autor,
                           generos=generos)


# Recomendações de livros

@app.route("/recomendacoes")
def recomendacoes():
    usuario_id = session.get("usuario_id")
    if not usuario_id:
        return redirect(url_for("login"))
    
    # Obter recomendações personalizadas
    recomendacoes_lista = RecomendacaoService.obter_recomendacoes_personalizadas(usuario_id, limite=15)
    generos_favoritos = RecomendacaoService.obter_generos_favoritos(usuario_id)
    generos_preferidos = obter_generos_preferidos(usuario_id)
    
    return render_template("recomendacoes.html", 
                         recomendacoes=recomendacoes_lista,
                         generos_favoritos=generos_favoritos,
                         generos_preferidos=generos_preferidos)


@app.route("/recomendacoes/adicionar_biblioteca", methods=["POST"])
def recomendacoes_adicionar_biblioteca():
    usuario_id = session.get("usuario_id")
    if not usuario_id:
        return redirect(url_for("login"))

    livro_id = request.form["livro_id"]

    conn = conectar()
    cur = conn.cursor()

    # Verifica se já existe
    cur.execute("SELECT 1 FROM biblioteca WHERE usuario_id = ? AND livro_id = ?", (usuario_id, livro_id))
    existe = cur.fetchone()

    if existe:
        cur.execute("SELECT titulo FROM livros WHERE id = ?", (livro_id,))
        livro = cur.fetchone()
        flash(f'O livro "{livro[0]}" já está na sua biblioteca!', "warning")
    else:
        cur.execute("INSERT INTO biblioteca (usuario_id, livro_id) VALUES (?, ?)", (usuario_id, livro_id))
        conn.commit()
        cur.execute("SELECT titulo FROM livros WHERE id = ?", (livro_id,))
        livro = cur.fetchone()
        flash(f'O livro "{livro[0]}" foi adicionado à sua biblioteca!', "success")

    conn.close()
    return redirect(url_for("recomendacoes"))


@app.route("/recomendacoes/adicionar_desejos", methods=["POST"])
def recomendacoes_adicionar_desejos():
    usuario_id = session.get("usuario_id")
    if not usuario_id:
        return redirect(url_for("login"))

    livro_id = request.form["livro_id"]

    conn = conectar()
    cur = conn.cursor()

    cur.execute("SELECT 1 FROM lista_desejos WHERE usuario_id = ? AND livro_id = ?", (usuario_id, livro_id))
    existe = cur.fetchone()

    if existe:
        cur.execute("SELECT titulo FROM livros WHERE id = ?", (livro_id,))
        livro = cur.fetchone()
        flash(f'O livro "{livro[0]}" já está na sua lista de desejos!', "warning")
    else:
        cur.execute("INSERT INTO lista_desejos (usuario_id, livro_id) VALUES (?, ?)", (usuario_id, livro_id))
        conn.commit()
        cur.execute("SELECT titulo FROM livros WHERE id = ?", (livro_id,))
        livro = cur.fetchone()
        flash(f'O livro "{livro[0]}" foi adicionado à sua lista de desejos!', "success")

    conn.close()
    return redirect(url_for("recomendacoes"))


@app.route("/buscar/adicionar_biblioteca", methods=["POST"])
def buscar_adicionar_biblioteca():
    usuario_id = session.get("usuario_id")
    if not usuario_id:
        return redirect(url_for("login"))

    livro_id = request.form["livro_id"]

    conn = conectar()
    cur = conn.cursor()

    # Verifica se já existe
    cur.execute("SELECT 1 FROM biblioteca WHERE usuario_id = ? AND livro_id = ?", (usuario_id, livro_id))
    existe = cur.fetchone()

    if existe:
        cur.execute("SELECT titulo FROM livros WHERE id = ?", (livro_id,))
        livro = cur.fetchone()
        flash(f'O livro "{livro[0]}" já está na sua biblioteca!', "warning")
    else:
        cur.execute("INSERT INTO biblioteca (usuario_id, livro_id) VALUES (?, ?)", (usuario_id, livro_id))
        conn.commit()
        cur.execute("SELECT titulo FROM livros WHERE id = ?", (livro_id,))
        livro = cur.fetchone()
        flash(f'O livro "{livro[0]}" foi adicionado à sua biblioteca!', "success")

    conn.close()

    # Volta para a aba de busca
    return redirect(url_for("buscar"))


@app.route("/buscar/adicionar_desejos", methods=["POST"])
def buscar_adicionar_desejos():
    usuario_id = session.get("usuario_id")
    if not usuario_id:
        return redirect(url_for("login"))

    livro_id = request.form["livro_id"]

    conn = conectar()
    cur = conn.cursor()

    cur.execute("SELECT 1 FROM lista_desejos WHERE usuario_id = ? AND livro_id = ?", (usuario_id, livro_id))
    existe = cur.fetchone()

    if existe:
        cur.execute("SELECT titulo FROM livros WHERE id = ?", (livro_id,))
        livro = cur.fetchone()
        flash(f'O livro "{livro[0]}" já está na sua lista de desejos!', "warning")
    else:
        cur.execute("INSERT INTO lista_desejos (usuario_id, livro_id) VALUES (?, ?)", (usuario_id, livro_id))
        conn.commit()
        cur.execute("SELECT titulo FROM livros WHERE id = ?", (livro_id,))
        livro = cur.fetchone()
        flash(f'O livro "{livro[0]}" foi adicionado à sua lista de desejos!', "success")

    conn.close()

    # Volta para a aba de busca
    return redirect(url_for("buscar"))

                           
# Perfil do usuário

@app.route("/perfil", methods=["GET", "POST"])
def perfil():
    usuario_id = session.get("usuario_id")
    if not usuario_id:
        return redirect(url_for("login"))
    
    usuario = buscar_usuario_por_id(usuario_id)
    if not usuario:
        return redirect(url_for("login"))
    
    id_, nome, email, senha, generos_str = usuario
    generos_selecionados = obter_generos_preferidos(usuario_id)
    
    # Buscar todos os gêneros disponíveis
    conn = conectar()
    cur = conn.cursor()
    cur.execute("SELECT DISTINCT genero FROM livros ORDER BY genero")
    todos_generos = [row[0] for row in cur.fetchall()]
    conn.close()
    
    erro = None
    sucesso = None
    
    if request.method == "POST":
        novo_nome = request.form.get("nome", "").strip()
        novo_email = request.form.get("email", "").strip()
        nova_senha = request.form.get("senha", "").strip()
        generos_favoritos = request.form.getlist("generos")
        
        # Validações
        if not novo_nome:
            erro = "Nome não pode estar vazio"
        elif not novo_email:
            erro = "Email não pode estar vazio"
        elif not nova_senha:
            erro = "Senha não pode estar vazia"
        else:
            try:
                atualizar_usuario(usuario_id, novo_nome, novo_email, nova_senha, generos_favoritos)
                sucesso = "Perfil atualizado com sucesso!"
                nome = novo_nome
                email = novo_email
                senha = nova_senha
                generos_selecionados = generos_favoritos
            except Exception as e:
                erro = f"Erro ao atualizar: {str(e)}"
    
    return render_template("perfil.html",
                         nome=nome,
                         email=email,
                         todos_generos=todos_generos,
                         generos_selecionados=generos_selecionados,
                         erro=erro,
                         sucesso=sucesso)

                           
# Helper para obter URL de capa
@app.context_processor
def utility_processor():
    def obter_url_capa(livro_id, titulo, autor, isbn):
        """
        Retorna URL da capa de um livro.
        Tenta: banco de dados → API de capas → ícone padrão
        """
        try:
            # 1. Tenta buscar do banco de dados
            livro = obter_livro_completo(livro_id)
            if livro and livro[5]:  # índice 5 = capa
                return livro[5]
            
            # 2. Tenta buscar via API
            url_capa = BookCoverService.obter_capa(isbn=isbn, titulo=titulo, autor=autor)
            
            if url_capa:
                # Atualiza no banco para próximas vezes
                try:
                    atualizar_capa_livro(livro_id, url_capa)
                except:
                    pass  # Falha silenciosa
                return url_capa
        except Exception as e:
            print(f"Erro ao obter capa: {e}")
        
        # 3. Retorna ícone padrão
        return None
    
    return dict(obter_url_capa=obter_url_capa)

                           
# Rota de logout    
@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("login"))

if __name__ == "__main__":
    app.run(debug=True)
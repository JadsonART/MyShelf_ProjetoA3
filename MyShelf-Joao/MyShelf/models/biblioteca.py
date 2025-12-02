class Biblioteca:
    def __init__(self, nome_biblioteca, usuario):
        self.nome = nome_biblioteca
        self.usuario = usuario
        self.livros = []

    def adicionar_livro(self, livro):
        self.livros.append(livro)

    def remover_livro(self, livro):
        if livro in self.livros:
            self.livros.remove(livro)

    def listar_livros(self):
        return "\n".join(str(livro) for livro in self.livros)
class Usuario:
    def __init__(self, nome, email, senha, telefone=None, id_=None):
        self.id = id_
        self.nome = nome
        self.email = email
        self.senha = senha
        self.telefone = telefone
        self.biblioteca = []  # Lista para armazenar livros associados ao usuário
        self.lista_de_desejos = []  # Lista para armazenar livros na lista de desejos

    def adicionar_livro_biblioteca(self, livro):
        self.biblioteca.append(livro)

    def remover_livro_biblioteca(self, livro):
        if livro in self.biblioteca:
            self.biblioteca.remove(livro)

    def adicionar_livro_lista_desejos(self, livro):
        self.lista_de_desejos.append(livro)

    def remover_livro_lista_desejos(self, livro):
        if livro in self.lista_de_desejos:
            self.lista_de_desejos.remove(livro)

    def __repr__(self):
        return f"Usuario(id={self.id}, nome={self.nome}, email={self.email})"
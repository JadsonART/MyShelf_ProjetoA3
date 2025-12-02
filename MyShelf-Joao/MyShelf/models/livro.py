class Livro:
    def __init__(self, titulo, autor, genero=None, isbn=None):
        self.titulo = titulo
        self.autor = autor
        self.genero = genero
        self.isbn = isbn

    def __repr__(self):
        return f"Titulo: {self.titulo} - Autor: {self.autor} Genero: {self.genero} isbn: {self.isbn}"

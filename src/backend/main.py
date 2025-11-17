import customtkinter as ctk
from auth import Auth

ctk.set_appearance_mode("dark")

class App(ctk.CTk):
    def __init__(self):
        super().__init__()

        self.title("Sistema de Biblioteca")
        self.geometry("400x350")
        self.auth = Auth()

        self.tela_login()

    def limpar_tela(self):
        for widget in self.winfo_children():
            widget.destroy()

    def tela_login(self):
        self.limpar_tela()
        ctk.CTkLabel(self, text="Login", font=("Arial", 22)).pack(pady=20)

        self.email_login = ctk.CTkEntry(self, placeholder_text="Email")
        self.email_login.pack(pady=10, padx=40, fill="x")

        self.senha_login = ctk.CTkEntry(self, placeholder_text="Senha", show="*")
        self.senha_login.pack(pady=10, padx=40, fill="x")

        ctk.CTkButton(self, text="Entrar", command=self.login).pack(pady=15)
        ctk.CTkButton(self, text="Criar Conta", command=self.tela_cadastro).pack()

        self.msg = ctk.CTkLabel(self, text="")
        self.msg.pack(pady=10)

    def login(self):
        email = self.email_login.get()
        senha = self.senha_login.get()
        usuario = self.auth.login(email, senha)

        if usuario:
            self.msg.configure(text="Login realizado", text_color="green")
        else:
            self.msg.configure(text="Credenciais inválidas", text_color="red")

    def tela_cadastro(self):
        self.limpar_tela()
        ctk.CTkLabel(self, text="Cadastro", font=("Arial", 22)).pack(pady=20)

        self.nome_cad = ctk.CTkEntry(self, placeholder_text="Nome")
        self.nome_cad.pack(pady=10, padx=40, fill="x")

        self.email_cad = ctk.CTkEntry(self, placeholder_text="Email")
        self.email_cad.pack(pady=10, padx=40, fill="x")

        self.senha_cad = ctk.CTkEntry(self, placeholder_text="Senha", show="*")
        self.senha_cad.pack(pady=10, padx=40, fill="x")

        ctk.CTkButton(self, text="Cadastrar", command=self.cadastrar).pack(pady=15)
        ctk.CTkButton(self, text="Voltar", command=self.tela_login).pack()

        self.msg_cad = ctk.CTkLabel(self, text="")
        self.msg_cad.pack(pady=10)

    def cadastrar(self):
        nome = self.nome_cad.get()
        email = self.email_cad.get()
        senha = self.senha_cad.get()

        sucesso = self.auth.cadastrar(nome, email, senha)

        if sucesso:
            self.msg_cad.configure(text="Usuário registrado", text_color="green")
        else:
            self.msg_cad.configure(text="Email já cadastrado", text_color="red")


if __name__ == "__main__":
    App().mainloop()

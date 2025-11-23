-- Create profiles table for user data
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create genres table
CREATE TABLE IF NOT EXISTS public.generos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(50) NOT NULL UNIQUE,
  descricao TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create publishers table
CREATE TABLE IF NOT EXISTS public.editoras (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(100) NOT NULL,
  endereco VARCHAR(200),
  telefone VARCHAR(20),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create books table
CREATE TABLE IF NOT EXISTS public.livros (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo VARCHAR(200) NOT NULL,
  autor VARCHAR(100) NOT NULL,
  isbn VARCHAR(20),
  editora_id UUID REFERENCES public.editoras(id) ON DELETE SET NULL,
  ano_publicacao INTEGER,
  num_paginas INTEGER,
  sinopse TEXT,
  capa_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create book-genre relationship table
CREATE TABLE IF NOT EXISTS public.livros_generos (
  livro_id UUID REFERENCES public.livros(id) ON DELETE CASCADE,
  genero_id UUID REFERENCES public.generos(id) ON DELETE CASCADE,
  PRIMARY KEY (livro_id, genero_id)
);

-- Create user library table
CREATE TABLE IF NOT EXISTS public.biblioteca (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  livro_id UUID NOT NULL REFERENCES public.livros(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'quero_ler' CHECK (status IN ('lendo', 'lido', 'quero_ler', 'abandonado')),
  data_adicao TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(usuario_id, livro_id)
);

-- Create wishlist table
CREATE TABLE IF NOT EXISTS public.lista_desejos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  livro_id UUID NOT NULL REFERENCES public.livros(id) ON DELETE CASCADE,
  prioridade INTEGER DEFAULT 0,
  data_adicao TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(usuario_id, livro_id)
);

-- Create reading progress table
CREATE TABLE IF NOT EXISTS public.progresso_leitura (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  livro_id UUID NOT NULL REFERENCES public.livros(id) ON DELETE CASCADE,
  pagina_atual INTEGER DEFAULT 0,
  porcentagem DECIMAL(5,2) DEFAULT 0,
  data_inicio DATE,
  data_conclusao DATE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(usuario_id, livro_id)
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS public.resenhas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  livro_id UUID NOT NULL REFERENCES public.livros(id) ON DELETE CASCADE,
  titulo VARCHAR(200),
  conteudo TEXT NOT NULL,
  avaliacao INTEGER CHECK (avaliacao >= 1 AND avaliacao <= 5),
  visibilidade VARCHAR(10) DEFAULT 'privada' CHECK (visibilidade IN ('publica', 'privada')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(usuario_id, livro_id)
);

-- Create reading preferences table
CREATE TABLE IF NOT EXISTS public.preferencias_leitura (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  generos_favoritos UUID[] DEFAULT ARRAY[]::UUID[],
  autores_favoritos TEXT[] DEFAULT ARRAY[]::TEXT[],
  temas_interesse TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.editoras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.livros ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.livros_generos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.biblioteca ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lista_desejos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progresso_leitura ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resenhas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.preferencias_leitura ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- Genres and Publishers policies (public read, admin write)
CREATE POLICY "Anyone can view genres" ON public.generos FOR SELECT TO authenticated USING (true);
CREATE POLICY "Anyone can view publishers" ON public.editoras FOR SELECT TO authenticated USING (true);

-- Books policies (public read)
CREATE POLICY "Anyone can view books" ON public.livros FOR SELECT TO authenticated USING (true);
CREATE POLICY "Anyone can view book genres" ON public.livros_generos FOR SELECT TO authenticated USING (true);

-- Library policies
CREATE POLICY "Users can view own library" ON public.biblioteca FOR SELECT TO authenticated USING (auth.uid() = usuario_id);
CREATE POLICY "Users can add to own library" ON public.biblioteca FOR INSERT TO authenticated WITH CHECK (auth.uid() = usuario_id);
CREATE POLICY "Users can update own library" ON public.biblioteca FOR UPDATE TO authenticated USING (auth.uid() = usuario_id);
CREATE POLICY "Users can delete from own library" ON public.biblioteca FOR DELETE TO authenticated USING (auth.uid() = usuario_id);

-- Wishlist policies
CREATE POLICY "Users can view own wishlist" ON public.lista_desejos FOR SELECT TO authenticated USING (auth.uid() = usuario_id);
CREATE POLICY "Users can add to own wishlist" ON public.lista_desejos FOR INSERT TO authenticated WITH CHECK (auth.uid() = usuario_id);
CREATE POLICY "Users can update own wishlist" ON public.lista_desejos FOR UPDATE TO authenticated USING (auth.uid() = usuario_id);
CREATE POLICY "Users can delete from own wishlist" ON public.lista_desejos FOR DELETE TO authenticated USING (auth.uid() = usuario_id);

-- Progress policies
CREATE POLICY "Users can view own progress" ON public.progresso_leitura FOR SELECT TO authenticated USING (auth.uid() = usuario_id);
CREATE POLICY "Users can add own progress" ON public.progresso_leitura FOR INSERT TO authenticated WITH CHECK (auth.uid() = usuario_id);
CREATE POLICY "Users can update own progress" ON public.progresso_leitura FOR UPDATE TO authenticated USING (auth.uid() = usuario_id);
CREATE POLICY "Users can delete own progress" ON public.progresso_leitura FOR DELETE TO authenticated USING (auth.uid() = usuario_id);

-- Reviews policies
CREATE POLICY "Users can view public reviews" ON public.resenhas FOR SELECT TO authenticated USING (visibilidade = 'publica' OR auth.uid() = usuario_id);
CREATE POLICY "Users can create own reviews" ON public.resenhas FOR INSERT TO authenticated WITH CHECK (auth.uid() = usuario_id);
CREATE POLICY "Users can update own reviews" ON public.resenhas FOR UPDATE TO authenticated USING (auth.uid() = usuario_id);
CREATE POLICY "Users can delete own reviews" ON public.resenhas FOR DELETE TO authenticated USING (auth.uid() = usuario_id);

-- Preferences policies
CREATE POLICY "Users can view own preferences" ON public.preferencias_leitura FOR SELECT TO authenticated USING (auth.uid() = usuario_id);
CREATE POLICY "Users can create own preferences" ON public.preferencias_leitura FOR INSERT TO authenticated WITH CHECK (auth.uid() = usuario_id);
CREATE POLICY "Users can update own preferences" ON public.preferencias_leitura FOR UPDATE TO authenticated USING (auth.uid() = usuario_id);

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_progresso_updated_at BEFORE UPDATE ON public.progresso_leitura FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_resenhas_updated_at BEFORE UPDATE ON public.resenhas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_preferencias_updated_at BEFORE UPDATE ON public.preferencias_leitura FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some initial genres
INSERT INTO public.generos (nome, descricao) VALUES
  ('Ficção', 'Narrativas imaginárias e criativas'),
  ('Romance', 'Histórias de amor e relacionamentos'),
  ('Mistério', 'Histórias de suspense e investigação'),
  ('Fantasia', 'Mundos mágicos e imaginários'),
  ('Ficção Científica', 'Futurismo e tecnologia'),
  ('Terror', 'Histórias assustadoras'),
  ('Biografia', 'Histórias de vida real'),
  ('História', 'Eventos e períodos históricos'),
  ('Autoajuda', 'Desenvolvimento pessoal'),
  ('Negócios', 'Empreendedorismo e gestão')
ON CONFLICT (nome) DO NOTHING;
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, BookOpen, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

interface Book {
  id: string;
  titulo: string;
  autor: string;
  capa_url: string | null;
  num_paginas: number | null;
  sinopse: string | null;
}

const Buscar = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    setSearched(true);

    try {
      const { data, error } = await supabase
        .from('livros')
        .select('*')
        .or(`titulo.ilike.%${searchTerm}%,autor.ilike.%${searchTerm}%`)
        .limit(20);

      if (error) throw error;
      setBooks(data || []);
    } catch (error) {
      console.error('Error searching books:', error);
      toast.error('Erro ao buscar livros');
    } finally {
      setLoading(false);
    }
  };

  const addToLibrary = async (bookId: string) => {
    try {
      const { error } = await supabase.from('biblioteca').insert({
        usuario_id: user?.id,
        livro_id: bookId,
        status: 'quero_ler',
      });

      if (error) {
        if (error.code === '23505') {
          toast.error('Este livro já está na sua biblioteca');
        } else {
          throw error;
        }
      } else {
        toast.success('Livro adicionado à biblioteca!');
      }
    } catch (error) {
      console.error('Error adding to library:', error);
      toast.error('Erro ao adicionar livro');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Buscar Livros</h1>
        <p className="text-muted-foreground mt-1">
          Encontre livros por título ou autor
        </p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Digite o título ou autor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? 'Buscando...' : 'Buscar'}
        </Button>
      </form>

      {searched && books.length === 0 && !loading && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <BookOpen className="w-16 h-16 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">Nenhum livro encontrado</p>
            <p className="text-muted-foreground text-center">
              Tente buscar com outros termos
            </p>
          </CardContent>
        </Card>
      )}

      {books.length > 0 && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {books.length} {books.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}
          </p>
          <div className="grid gap-4">
            {books.map((book) => (
              <Card key={book.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <Link to={`/livro/${book.id}`} className="flex-shrink-0">
                      <div className="w-24 h-36 bg-muted rounded-lg overflow-hidden">
                        {book.capa_url ? (
                          <img
                            src={book.capa_url}
                            alt={book.titulo}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <BookOpen className="w-8 h-8 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link to={`/livro/${book.id}`}>
                        <h3 className="font-semibold text-lg mb-1 hover:text-primary transition-colors">
                          {book.titulo}
                        </h3>
                      </Link>
                      <p className="text-sm text-muted-foreground mb-2">{book.autor}</p>
                      {book.sinopse && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {book.sinopse}
                        </p>
                      )}
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => addToLibrary(book.id)}>
                          <Plus className="w-4 h-4 mr-1" />
                          Adicionar à Biblioteca
                        </Button>
                        <Button size="sm" variant="outline" asChild>
                          <Link to={`/livro/${book.id}`}>Ver Detalhes</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Buscar;

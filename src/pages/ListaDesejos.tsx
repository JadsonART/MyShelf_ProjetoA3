import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, BookOpen, Trash2, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

interface WishlistItem {
  id: string;
  prioridade: number;
  data_adicao: string;
  livros: {
    id: string;
    titulo: string;
    autor: string;
    capa_url: string | null;
  };
}

const ListaDesejos = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchWishlist();
    }
  }, [user]);

  const fetchWishlist = async () => {
    try {
      const { data, error } = await supabase
        .from('lista_desejos')
        .select(`
          id,
          prioridade,
          data_adicao,
          livros (
            id,
            titulo,
            autor,
            capa_url
          )
        `)
        .eq('usuario_id', user?.id)
        .order('prioridade', { ascending: false })
        .order('data_adicao', { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      toast.error('Erro ao carregar lista de desejos');
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (id: string) => {
    try {
      const { error } = await supabase
        .from('lista_desejos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setItems(items.filter((item) => item.id !== id));
      toast.success('Livro removido da lista de desejos');
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Erro ao remover livro');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">Carregando lista...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Lista de Desejos</h1>
          <p className="text-muted-foreground mt-1">
            {items.length} {items.length === 1 ? 'livro' : 'livros'} que você deseja ler
          </p>
        </div>
        <Button asChild>
          <Link to="/buscar">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Livro
          </Link>
        </Button>
      </div>

      {items.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Heart className="w-16 h-16 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">Lista de desejos vazia</p>
            <p className="text-muted-foreground text-center mb-4">
              Adicione livros que você deseja ler no futuro
            </p>
            <Button asChild>
              <Link to="/buscar">Buscar Livros</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {items.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
              <Link to={`/livro/${item.livros.id}`}>
                <div className="aspect-[2/3] bg-muted relative overflow-hidden">
                  {item.livros.capa_url ? (
                    <img
                      src={item.livros.capa_url}
                      alt={item.livros.titulo}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="w-12 h-12 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <Button
                      size="icon"
                      variant="destructive"
                      className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.preventDefault();
                        removeFromWishlist(item.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Link>
              <CardContent className="p-3">
                <Link to={`/livro/${item.livros.id}`}>
                  <h3 className="font-medium text-sm line-clamp-2 mb-1 hover:text-primary transition-colors">
                    {item.livros.titulo}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {item.livros.autor}
                  </p>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListaDesejos;

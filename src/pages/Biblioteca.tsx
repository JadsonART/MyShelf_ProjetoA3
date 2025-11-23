import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, BookOpen, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

interface BibliotecaItem {
  id: string;
  status: string;
  data_adicao: string;
  livros: {
    id: string;
    titulo: string;
    autor: string;
    capa_url: string | null;
    num_paginas: number | null;
  };
  progresso_leitura: Array<{
    pagina_atual: number;
    porcentagem: number;
  }>;
}

const Biblioteca = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<BibliotecaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('todos');

  useEffect(() => {
    if (user) {
      fetchBiblioteca();
    }
  }, [user]);

  const fetchBiblioteca = async () => {
    try {
      const { data: bibliotecaData, error: bibliotecaError } = await supabase
        .from('biblioteca')
        .select(`
          id,
          status,
          data_adicao,
          livro_id,
          livros (
            id,
            titulo,
            autor,
            capa_url,
            num_paginas
          )
        `)
        .eq('usuario_id', user?.id)
        .order('data_adicao', { ascending: false });

      if (bibliotecaError) throw bibliotecaError;

      // Fetch progress separately
      const { data: progressData, error: progressError } = await supabase
        .from('progresso_leitura')
        .select('livro_id, pagina_atual, porcentagem')
        .eq('usuario_id', user?.id);

      if (progressError) throw progressError;

      // Combine the data
      const combined = bibliotecaData?.map((item) => {
        const progress = progressData?.filter((p) => p.livro_id === item.livro_id) || [];
        return {
          ...item,
          progresso_leitura: progress,
        };
      });

      setItems(combined || []);
    } catch (error) {
      console.error('Error fetching biblioteca:', error);
      toast.error('Erro ao carregar biblioteca');
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter((item) => {
    if (activeTab === 'todos') return true;
    return item.status === activeTab;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'lendo':
        return <Clock className="w-4 h-4" />;
      case 'lido':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'quero_ler':
        return <BookOpen className="w-4 h-4" />;
      case 'abandonado':
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'lendo':
        return 'Lendo';
      case 'lido':
        return 'Lido';
      case 'quero_ler':
        return 'Quero Ler';
      case 'abandonado':
        return 'Abandonado';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">Carregando biblioteca...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Minha Biblioteca</h1>
          <p className="text-muted-foreground mt-1">
            {items.length} {items.length === 1 ? 'livro' : 'livros'} na sua coleção
          </p>
        </div>
        <Button asChild>
          <Link to="/buscar">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Livro
          </Link>
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="todos">Todos</TabsTrigger>
          <TabsTrigger value="lendo">Lendo</TabsTrigger>
          <TabsTrigger value="lido">Lidos</TabsTrigger>
          <TabsTrigger value="quero_ler">Quero Ler</TabsTrigger>
          <TabsTrigger value="abandonado">Abandonados</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredItems.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <BookOpen className="w-16 h-16 text-muted-foreground mb-4" />
                <p className="text-lg font-medium mb-2">Nenhum livro encontrado</p>
                <p className="text-muted-foreground text-center mb-4">
                  Comece adicionando livros à sua biblioteca
                </p>
                <Button asChild>
                  <Link to="/buscar">Buscar Livros</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredItems.map((item) => (
                <Link key={item.id} to={`/livro/${item.livros.id}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
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
                        <div className="bg-background/90 backdrop-blur-sm rounded-full p-1.5">
                          {getStatusIcon(item.status)}
                        </div>
                      </div>
                      {item.progresso_leitura[0] && item.progresso_leitura[0].porcentagem > 0 && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-background/50">
                          <div
                            className="h-full bg-primary transition-all"
                            style={{ width: `${item.progresso_leitura[0].porcentagem}%` }}
                          />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-3">
                      <h3 className="font-medium text-sm line-clamp-2 mb-1">
                        {item.livros.titulo}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {item.livros.autor}
                      </p>
                      <div className="flex items-center gap-1 mt-2">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                          {getStatusLabel(item.status)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Biblioteca;

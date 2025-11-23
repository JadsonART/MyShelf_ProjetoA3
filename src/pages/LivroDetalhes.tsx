import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { BookOpen, Heart, Star, ArrowLeft, Trash2 } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface Book {
  id: string;
  titulo: string;
  autor: string;
  capa_url: string | null;
  sinopse: string | null;
  num_paginas: number | null;
  ano_publicacao: number | null;
  isbn: string | null;
}

const LivroDetalhes = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [inLibrary, setInLibrary] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);
  const [status, setStatus] = useState('quero_ler');
  const [progress, setProgress] = useState({ pagina_atual: 0, porcentagem: 0 });
  const [review, setReview] = useState({ titulo: '', conteudo: '', avaliacao: 0, visibilidade: 'privada' });
  const [existingReview, setExistingReview] = useState<any>(null);

  useEffect(() => {
    if (id && user) {
      fetchBook();
      checkLibraryStatus();
      checkWishlistStatus();
      fetchProgress();
      fetchReview();
    }
  }, [id, user]);

  const fetchBook = async () => {
    try {
      const { data, error } = await supabase
        .from('livros')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setBook(data);
    } catch (error) {
      console.error('Error fetching book:', error);
      toast.error('Erro ao carregar livro');
    } finally {
      setLoading(false);
    }
  };

  const checkLibraryStatus = async () => {
    const { data } = await supabase
      .from('biblioteca')
      .select('status')
      .eq('usuario_id', user?.id)
      .eq('livro_id', id)
      .maybeSingle();

    if (data) {
      setInLibrary(true);
      setStatus(data.status);
    }
  };

  const checkWishlistStatus = async () => {
    const { data } = await supabase
      .from('lista_desejos')
      .select('id')
      .eq('usuario_id', user?.id)
      .eq('livro_id', id)
      .maybeSingle();

    setInWishlist(!!data);
  };

  const fetchProgress = async () => {
    const { data } = await supabase
      .from('progresso_leitura')
      .select('*')
      .eq('usuario_id', user?.id)
      .eq('livro_id', id)
      .maybeSingle();

    if (data) {
      setProgress({ pagina_atual: data.pagina_atual || 0, porcentagem: Number(data.porcentagem) || 0 });
    }
  };

  const fetchReview = async () => {
    const { data } = await supabase
      .from('resenhas')
      .select('*')
      .eq('usuario_id', user?.id)
      .eq('livro_id', id)
      .maybeSingle();

    if (data) {
      setExistingReview(data);
      setReview({
        titulo: data.titulo || '',
        conteudo: data.conteudo || '',
        avaliacao: data.avaliacao || 0,
        visibilidade: data.visibilidade || 'privada',
      });
    }
  };

  const addToLibrary = async () => {
    try {
      const { error } = await supabase.from('biblioteca').insert({
        usuario_id: user?.id,
        livro_id: id,
        status: 'quero_ler',
      });

      if (error) throw error;
      setInLibrary(true);
      toast.success('Adicionado à biblioteca!');
    } catch (error: any) {
      if (error.code === '23505') {
        toast.error('Livro já está na biblioteca');
      } else {
        toast.error('Erro ao adicionar à biblioteca');
      }
    }
  };

  const toggleWishlist = async () => {
    try {
      if (inWishlist) {
        await supabase
          .from('lista_desejos')
          .delete()
          .eq('usuario_id', user?.id)
          .eq('livro_id', id);
        setInWishlist(false);
        toast.success('Removido da lista de desejos');
      } else {
        await supabase.from('lista_desejos').insert({
          usuario_id: user?.id,
          livro_id: id,
        });
        setInWishlist(true);
        toast.success('Adicionado à lista de desejos!');
      }
    } catch (error: any) {
      toast.error('Erro ao atualizar lista de desejos');
    }
  };

  const updateStatus = async (newStatus: string) => {
    try {
      await supabase
        .from('biblioteca')
        .update({ status: newStatus })
        .eq('usuario_id', user?.id)
        .eq('livro_id', id);

      setStatus(newStatus);
      toast.success('Status atualizado!');
    } catch (error) {
      toast.error('Erro ao atualizar status');
    }
  };

  const updateProgress = async () => {
    try {
      const porcentagem = book?.num_paginas
        ? (progress.pagina_atual / book.num_paginas) * 100
        : 0;

      await supabase.from('progresso_leitura').upsert({
        usuario_id: user?.id,
        livro_id: id,
        pagina_atual: progress.pagina_atual,
        porcentagem,
      });

      setProgress({ ...progress, porcentagem });
      toast.success('Progresso atualizado!');
    } catch (error) {
      toast.error('Erro ao atualizar progresso');
    }
  };

  const saveReview = async () => {
    try {
      await supabase.from('resenhas').upsert({
        id: existingReview?.id,
        usuario_id: user?.id,
        livro_id: id,
        ...review,
      });

      toast.success('Resenha salva!');
      fetchReview();
    } catch (error) {
      toast.error('Erro ao salvar resenha');
    }
  };

  const deleteReview = async () => {
    try {
      await supabase
        .from('resenhas')
        .delete()
        .eq('id', existingReview?.id);

      setExistingReview(null);
      setReview({ titulo: '', conteudo: '', avaliacao: 0, visibilidade: 'privada' });
      toast.success('Resenha excluída!');
    } catch (error) {
      toast.error('Erro ao excluir resenha');
    }
  };

  if (loading || !book) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Button variant="ghost" onClick={() => navigate(-1)}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Voltar
      </Button>

      <div className="grid md:grid-cols-3 gap-6">
        <div>
          <Card className="overflow-hidden">
            <div className="aspect-[2/3] bg-muted">
              {book.capa_url ? (
                <img src={book.capa_url} alt={book.titulo} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <BookOpen className="w-16 h-16 text-muted-foreground" />
                </div>
              )}
            </div>
            <CardContent className="p-4 space-y-2">
              <Button className="w-full" onClick={inLibrary ? undefined : addToLibrary} disabled={inLibrary}>
                {inLibrary ? 'Na Biblioteca' : 'Adicionar à Biblioteca'}
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={toggleWishlist}
              >
                <Heart className={`w-4 h-4 mr-2 ${inWishlist ? 'fill-current' : ''}`} />
                {inWishlist ? 'Na Lista de Desejos' : 'Adicionar aos Desejos'}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{book.titulo}</h1>
            <p className="text-lg text-muted-foreground mb-4">{book.autor}</p>
            {book.sinopse && <p className="text-muted-foreground">{book.sinopse}</p>}
            <div className="flex gap-4 mt-4 text-sm text-muted-foreground">
              {book.ano_publicacao && <span>Ano: {book.ano_publicacao}</span>}
              {book.num_paginas && <span>{book.num_paginas} páginas</span>}
              {book.isbn && <span>ISBN: {book.isbn}</span>}
            </div>
          </div>

          {inLibrary && (
            <Tabs defaultValue="status" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="status">Status</TabsTrigger>
                <TabsTrigger value="progresso">Progresso</TabsTrigger>
                <TabsTrigger value="resenha">Resenha</TabsTrigger>
              </TabsList>

              <TabsContent value="status" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Status de Leitura</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Select value={status} onValueChange={updateStatus}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="quero_ler">Quero Ler</SelectItem>
                        <SelectItem value="lendo">Lendo</SelectItem>
                        <SelectItem value="lido">Lido</SelectItem>
                        <SelectItem value="abandonado">Abandonado</SelectItem>
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="progresso" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Progresso de Leitura</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Página Atual</Label>
                      <Input
                        type="number"
                        value={progress.pagina_atual}
                        onChange={(e) => setProgress({ ...progress, pagina_atual: Number(e.target.value) })}
                        max={book.num_paginas || undefined}
                      />
                    </div>
                    {progress.porcentagem > 0 && (
                      <div className="space-y-2">
                        <Label>Progresso: {progress.porcentagem.toFixed(1)}%</Label>
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ width: `${progress.porcentagem}%` }}
                          />
                        </div>
                      </div>
                    )}
                    <Button onClick={updateProgress}>Atualizar Progresso</Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="resenha" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Minha Resenha</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Avaliação</Label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Button
                            key={star}
                            variant="ghost"
                            size="sm"
                            onClick={() => setReview({ ...review, avaliacao: star })}
                          >
                            <Star
                              className={`w-5 h-5 ${
                                star <= review.avaliacao ? 'fill-yellow-400 text-yellow-400' : ''
                              }`}
                            />
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Título</Label>
                      <Input
                        value={review.titulo}
                        onChange={(e) => setReview({ ...review, titulo: e.target.value })}
                        placeholder="Título da resenha (opcional)"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Resenha</Label>
                      <Textarea
                        value={review.conteudo}
                        onChange={(e) => setReview({ ...review, conteudo: e.target.value })}
                        placeholder="Escreva sua resenha..."
                        rows={6}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Visibilidade</Label>
                      <Select value={review.visibilidade} onValueChange={(v) => setReview({ ...review, visibilidade: v })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="privada">Privada</SelectItem>
                          <SelectItem value="publica">Pública</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={saveReview}>Salvar Resenha</Button>
                      {existingReview && (
                        <Button variant="destructive" onClick={deleteReview}>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Excluir
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
};

export default LivroDetalhes;

import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Settings } from 'lucide-react';

interface Genre {
  id: string;
  nome: string;
  descricao: string | null;
}

const Preferencias = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      fetchGenres();
      fetchPreferences();
    }
  }, [user]);

  const fetchGenres = async () => {
    try {
      const { data, error } = await supabase
        .from('generos')
        .select('*')
        .order('nome');

      if (error) throw error;
      setGenres(data || []);
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  };

  const fetchPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('preferencias_leitura')
        .select('generos_favoritos')
        .eq('usuario_id', user?.id)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setSelectedGenres(data.generos_favoritos || []);
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
    }
  };

  const handleGenreToggle = (genreId: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genreId)
        ? prev.filter((id) => id !== genreId)
        : [...prev, genreId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('preferencias_leitura')
        .upsert({
          usuario_id: user?.id,
          generos_favoritos: selectedGenres,
        });

      if (error) throw error;
      toast.success('Preferências salvas com sucesso!');
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast.error('Erro ao salvar preferências');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Preferências de Leitura</h1>
        <p className="text-muted-foreground mt-1">
          Personalize sua experiência selecionando seus gêneros favoritos
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Gêneros Favoritos
          </CardTitle>
          <CardDescription>
            Selecione os gêneros que você mais gosta para receber recomendações personalizadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {genres.map((genre) => (
                <div key={genre.id} className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-secondary/50 transition-colors">
                  <Checkbox
                    id={genre.id}
                    checked={selectedGenres.includes(genre.id)}
                    onCheckedChange={() => handleGenreToggle(genre.id)}
                  />
                  <div className="flex-1">
                    <Label
                      htmlFor={genre.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {genre.nome}
                    </Label>
                    {genre.descricao && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {genre.descricao}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar Preferências'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Preferencias;

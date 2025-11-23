import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen, Library, Heart, Search, TrendingUp, Star } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-4">
            <BookOpen className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            MyShelf
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground">
            Organize sua biblioteca pessoal de forma simples e intuitiva
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button asChild size="lg" className="text-lg">
              <Link to="/auth">
                Começar Agora
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg">
              <Link to="/auth">
                Entrar
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <Library className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Biblioteca Pessoal</h3>
            <p className="text-muted-foreground">
              Organize todos os seus livros em um só lugar. Categorize, filtre e gerencie sua coleção digital.
            </p>
          </div>

          <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Progresso de Leitura</h3>
            <p className="text-muted-foreground">
              Acompanhe seu progresso em cada livro. Registre páginas lidas e visualize sua evolução.
            </p>
          </div>

          <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <Heart className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Lista de Desejos</h3>
            <p className="text-muted-foreground">
              Guarde os livros que você quer ler. Organize por prioridade e nunca esqueça suas próximas leituras.
            </p>
          </div>

          <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <Search className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Busca Avançada</h3>
            <p className="text-muted-foreground">
              Encontre qualquer livro rapidamente. Busque por título, autor ou gênero com filtros poderosos.
            </p>
          </div>

          <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <Star className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Resenhas e Avaliações</h3>
            <p className="text-muted-foreground">
              Escreva suas resenhas e avaliações. Compartilhe suas opiniões ou mantenha-as privadas.
            </p>
          </div>

          <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Recomendações</h3>
            <p className="text-muted-foreground">
              Receba sugestões personalizadas baseadas no seu histórico e preferências de leitura.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center space-y-6 bg-card rounded-3xl p-12 border border-border/50 shadow-2xl">
          <h2 className="text-3xl md:text-4xl font-bold">
            Pronto para organizar sua biblioteca?
          </h2>
          <p className="text-lg text-muted-foreground">
            Junte-se a milhares de leitores que já utilizam o MyShelf para gerenciar suas leituras.
          </p>
          <Button asChild size="lg" className="text-lg">
            <Link to="/auth">
              Criar Conta Grátis
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;

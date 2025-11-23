import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { BookOpen, Library, Heart, Search, User, LogOut, Settings } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const { signOut, user } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/biblioteca" className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xl font-bold">MyShelf</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-1">
            <Button
              asChild
              variant={isActive('/biblioteca') ? 'secondary' : 'ghost'}
              size="sm"
            >
              <Link to="/biblioteca">
                <Library className="w-4 h-4 mr-2" />
                Biblioteca
              </Link>
            </Button>
            <Button
              asChild
              variant={isActive('/lista-desejos') ? 'secondary' : 'ghost'}
              size="sm"
            >
              <Link to="/lista-desejos">
                <Heart className="w-4 h-4 mr-2" />
                Lista de Desejos
              </Link>
            </Button>
            <Button
              asChild
              variant={isActive('/buscar') ? 'secondary' : 'ghost'}
              size="sm"
            >
              <Link to="/buscar">
                <Search className="w-4 h-4 mr-2" />
                Buscar
              </Link>
            </Button>
          </nav>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <Link to="/perfil" className="cursor-pointer">
                  <User className="w-4 h-4 mr-2" />
                  Meu Perfil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/preferencias" className="cursor-pointer">
                  <Settings className="w-4 h-4 mr-2" />
                  Preferências
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOut} className="cursor-pointer text-destructive">
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur">
        <nav className="container flex items-center justify-around h-16">
          <Button
            asChild
            variant={isActive('/biblioteca') ? 'secondary' : 'ghost'}
            size="sm"
            className="flex-col h-auto py-2"
          >
            <Link to="/biblioteca">
              <Library className="w-5 h-5" />
              <span className="text-xs mt-1">Biblioteca</span>
            </Link>
          </Button>
          <Button
            asChild
            variant={isActive('/lista-desejos') ? 'secondary' : 'ghost'}
            size="sm"
            className="flex-col h-auto py-2"
          >
            <Link to="/lista-desejos">
              <Heart className="w-5 h-5" />
              <span className="text-xs mt-1">Desejos</span>
            </Link>
          </Button>
          <Button
            asChild
            variant={isActive('/buscar') ? 'secondary' : 'ghost'}
            size="sm"
            className="flex-col h-auto py-2"
          >
            <Link to="/buscar">
              <Search className="w-5 h-5" />
              <span className="text-xs mt-1">Buscar</span>
            </Link>
          </Button>
        </nav>
      </div>

      {/* Main Content */}
      <main className="container py-6 pb-20 md:pb-6">{children}</main>
    </div>
  );
};

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export default function Auth() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted pt-24">
      <div className="container mx-auto max-w-md">
        <Card className="shadow-lg border-border/60">
          <CardHeader>
            <CardTitle className="text-2xl">Bem-vindo ao MyShelf</CardTitle>
            <CardDescription>
              Gerencie sua biblioteca pessoal e descubra novas leituras.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="login">Entrar</TabsTrigger>
                <TabsTrigger value="signup">Criar Conta</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <LoginForm />
              </TabsContent>
              <TabsContent value="signup">
                <SignupForm />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!termsAccepted) {
      toast.error("Você deve aceitar os termos para continuar");
      return;
    }
    setLoading(true);
    try {
      await login({ email, password });
      toast.success("Login realizado com sucesso");
    } catch (e: any) {
      toast.error(e.message || "Erro ao entrar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="voce@exemplo.com"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="********"
        />
        <p className="text-xs text-muted-foreground">
          Para entrar é necessário criar uma conta.
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="terms"
          checked={termsAccepted}
          onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
        />
        <Label htmlFor="terms" className="text-sm font-normal cursor-pointer">
          Eu aceito os termos
        </Label>
      </div>
      <div>
        <Button
          type="submit"
          className="w-full"
          disabled={loading || !termsAccepted}
        >
          {loading ? "Entrando..." : "Entrar"}
        </Button>
      </div>
      <div className="text-right text-sm">
        <Link
          to="#"
          onClick={() =>
            toast.info("Enviaremos instruções se o e-mail existir.")
          }
          className="text-primary hover:underline"
        >
          Esqueci minha senha
        </Link>
      </div>
    </form>
  );
}

function SignupForm() {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const policy = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    if (!policy.test(password)) {
      toast.error(
        "A senha deve ter letra maiúscula, número e caractere especial (mín. 8).",
      );
      return;
    }
    setLoading(true);
    try {
      await register({ name, email, password, phone });
      toast.success("Conta criada com sucesso");
    } catch (e: any) {
      toast.error(e.message || "Erro ao cadastrar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Seu nome"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="voce@exemplo.com"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="********"
          />
          <p className="text-xs text-muted-foreground">
            Mínimo 8 caracteres, com letra maiúscula, número e caractere
            especial.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Telefone</Label>
          <Input
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(11) 99999-9999"
          />
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Criando conta..." : "Criar Conta"}
      </Button>
    </form>
  );
}


import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { ExternalLink, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export default function Admin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        const { data: adminData, error: adminError } = await supabase
          .from('admin_users')
          .select('*')
          .eq('profile_id', data.user.id)
          .single();

        if (adminError || !adminData) {
          await supabase.auth.signOut();
          throw new Error('Acesso não autorizado');
        }

        navigate('/admin/dashboard');
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro no login",
        description: error.message || "Credenciais inválidas",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Lock className="mx-auto h-12 w-12 text-primary" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Área Administrativa
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Acesso restrito a administradores
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Login Administrativo</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
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
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 space-y-4">
          <div className="text-sm text-center">
            <p className="font-medium text-gray-600 mb-2">Links Úteis:</p>
            <div className="space-y-2">
              <Link 
                to="/step-by-step" 
                className="flex items-center justify-center gap-2 text-primary hover:text-primary/80"
              >
                <ExternalLink className="h-4 w-4" />
                Progresso de Implementação
              </Link>
              <Link 
                to="/sitemap.xml" 
                className="flex items-center justify-center gap-2 text-primary hover:text-primary/80"
              >
                <ExternalLink className="h-4 w-4" />
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

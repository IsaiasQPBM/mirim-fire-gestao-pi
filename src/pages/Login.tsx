
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import CBMEPILogo from '@/components/CBMEPILogo';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Mock login functionality - in a real app, you would call an API here
    setTimeout(() => {
      setIsLoading(false);
      
      // Simple validation
      if (username && password) {
        // Mock roles for demonstration
        let role = 'student';
        
        if (username.includes('admin')) {
          role = 'admin';
        } else if (username.includes('instrutor')) {
          role = 'instructor';
        }
        
        // In a real app, we'd store these in a secure way
        localStorage.setItem('userName', username);
        localStorage.setItem('userRole', role);
        
        toast({
          title: 'Login realizado com sucesso',
          description: `Bem-vindo ao Sistema de Gestão do Pelotão Mirim do CBMEPI.`,
        });
        
        navigate('/dashboard');
      } else {
        toast({
          variant: 'destructive',
          title: 'Erro no login',
          description: 'Usuário ou senha incorretos. Tente novamente.',
        });
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cbmepi-orange to-cbmepi-red flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="mb-8 flex justify-center">
          <CBMEPILogo size="large" withText={true} />
        </div>
        
        <Card className="border-2 border-cbmepi-white/20 shadow-lg">
          <CardHeader className="text-center">
            <h1 className="text-2xl font-bold text-cbmepi-black">Sistema de Gestão</h1>
            <p className="text-gray-600">Pelotão Mirim do CBMEPI</p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Usuário</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Digite seu usuário"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="border-cbmepi-orange focus:ring-cbmepi-orange"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-cbmepi-orange focus:ring-cbmepi-orange"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-cbmepi-orange hover:bg-cbmepi-orange/90 text-white"
                disabled={isLoading}
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="flex justify-center border-t pt-4">
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} - Corpo de Bombeiros Militar do Estado do Piauí
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;

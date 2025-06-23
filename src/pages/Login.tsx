
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Target, Heart, Users, Shield } from 'lucide-react';
import CBMEPILogo from '@/components/CBMEPILogo';
import InfoCard from '@/components/InfoCard';
import Footer from '@/components/Footer';

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
          description: `Bem-vindo ao Sistema de Gestão do Projeto Bombeiro Mirim.`,
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

  const infoCards = [
    {
      title: "Nossa Missão",
      description: "Formar jovens cidadãos conscientes, disciplinados e comprometidos com a segurança e bem-estar da comunidade.",
      icon: Target
    },
    {
      title: "Nossos Valores",
      description: "Disciplina, respeito, solidariedade, coragem e responsabilidade social são os pilares que norteiam nossa formação.",
      icon: Heart
    },
    {
      title: "Objetivos",
      description: "Desenvolver habilidades de liderança, trabalho em equipe e conhecimentos básicos de segurança e primeiros socorros.",
      icon: Users
    },
    {
      title: "Compromisso",
      description: "Preparar os jovens para serem multiplicadores de conhecimento em prevenção e segurança em suas comunidades.",
      icon: Shield
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5A623] via-[#E8941A] to-cbmepi-red flex flex-col">
      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-6xl">
          
          {/* Logo e título centralizados */}
          <div className="text-center mb-8">
            <div className="mb-6 flex justify-center">
              <CBMEPILogo size="large" withText={true} />
            </div>
            
            <div className="text-white mb-8">
              <h1 className="text-4xl font-bold mb-4">Sistema de Gestão</h1>
              <p className="text-xl opacity-90">
                Projeto Bombeiro Mirim - CBMEPI
              </p>
            </div>
          </div>

          {/* Card de login centralizado */}
          <div className="flex justify-center mb-12">
            <div className="w-full max-w-md">
              <Card className="border-2 border-white/20 shadow-2xl backdrop-blur-sm bg-white/95">
                <CardHeader className="text-center">
                  <h2 className="text-2xl font-bold text-cbmepi-black">Acesso ao Sistema</h2>
                  <p className="text-gray-600">Digite suas credenciais para entrar</p>
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
                        className="border-[#F5A623] focus:ring-[#F5A623] focus:border-[#F5A623]"
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
                        className="border-[#F5A623] focus:ring-[#F5A623] focus:border-[#F5A623]"
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-[#F5A623] to-[#E8941A] hover:from-[#E8941A] hover:to-[#D6831A] text-white shadow-lg transition-all duration-300"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Entrando...' : 'Entrar'}
                    </Button>
                  </form>
                </CardContent>
                
                <CardFooter className="flex justify-center border-t pt-4">
                  <p className="text-xs text-gray-500 text-center">
                    ETI - Corpo de Bombeiros Militar do Estado do Piauí
                  </p>
                </CardFooter>
              </Card>
            </div>
          </div>

          {/* Cards informativos abaixo do login */}
          <div className="w-full max-w-4xl mx-auto">
            <div className="text-center mb-8 text-white">
              <h2 className="text-3xl font-bold mb-4">Sobre o Projeto</h2>
              <p className="text-lg opacity-90">
                Formando cidadãos conscientes e preparados para o futuro
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {infoCards.map((card, index) => (
                <div key={card.title} className={`animation-delay-${index * 100}`}>
                  <InfoCard
                    title={card.title}
                    description={card.description}
                    icon={card.icon}
                    gradient={true}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer className="bg-black/20 text-white border-white/20" />
    </div>
  );
};

export default Login;

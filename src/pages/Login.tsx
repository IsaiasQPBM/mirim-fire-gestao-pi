
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { Target, Heart, Users, Shield, AlertCircle, RefreshCw, Wrench } from 'lucide-react';
import CBMEPILogo from '@/components/CBMEPILogo';
import InfoCard from '@/components/InfoCard';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import { MigrationService } from '@/services/migration/migrationService';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);
  const [showAdminTools, setShowAdminTools] = useState(false);
  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const migrationService = new MigrationService();

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    console.log('🔐 Tentativa de login:', { email, password: '***' });
    
    try {
      const { error } = await signIn(email, password);
      
      if (!error) {
        console.log('✅ Login bem-sucedido, redirecionando...');
        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo ao sistema!",
        });
        navigate('/dashboard');
      } else {
        console.error('❌ Erro no login:', error);
        
        // Show specific error messages
        let errorMessage = 'Erro no login';
        if (error.includes('Invalid login credentials')) {
          errorMessage = 'Email ou senha incorretos. Verifique suas credenciais.';
        } else if (error.includes('Email not confirmed')) {
          errorMessage = 'Email não confirmado. Verifique sua caixa de entrada.';
        } else if (error.includes('Too many requests')) {
          errorMessage = 'Muitas tentativas. Aguarde alguns minutos e tente novamente.';
        }
        
        toast({
          variant: 'destructive',
          title: 'Erro no login',
          description: errorMessage,
        });

        // Show admin tools if it's the admin email
        if (email === 'erisman@admin.com') {
          setShowAdminTools(true);
        }
      }
    } catch (error) {
      console.error('💥 Erro crítico no login:', error);
      toast({
        variant: 'destructive',
        title: 'Erro crítico',
        description: 'Erro inesperado durante o login. Tente novamente.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDiagnoseAdmin = async () => {
    setIsDiagnosing(true);
    
    try {
      console.log('🔍 Iniciando diagnóstico do administrador...');
      const result = await migrationService.diagnoseAdminUser();
      
      toast({
        variant: result.success ? 'default' : 'destructive',
        title: result.success ? 'Diagnóstico Completo' : 'Problema Detectado',
        description: result.message,
      });
      
      console.log('📊 Resultado do diagnóstico:', result);
    } catch (error) {
      console.error('💥 Erro no diagnóstico:', error);
      toast({
        variant: 'destructive',
        title: 'Erro no diagnóstico',
        description: 'Falha ao executar diagnóstico do administrador.',
      });
    } finally {
      setIsDiagnosing(false);
    }
  };

  const handleCreateAdmin = async () => {
    setIsCreatingAdmin(true);
    
    try {
      console.log('👑 Criando usuário administrador...');
      const result = await migrationService.runAdminUserMigration();
      
      toast({
        variant: result.success ? 'default' : 'destructive',
        title: result.success ? 'Administrador Configurado' : 'Erro na Configuração',
        description: result.message,
      });
      
      console.log('📊 Resultado da criação:', result);
      
      if (result.success) {
        // Try to auto-login after creation
        setTimeout(() => {
          setEmail('erisman@admin.com');
          setPassword('admin');
        }, 1000);
      }
    } catch (error) {
      console.error('💥 Erro na criação do admin:', error);
      toast({
        variant: 'destructive',
        title: 'Erro na criação',
        description: 'Falha ao criar usuário administrador.',
      });
    } finally {
      setIsCreatingAdmin(false);
    }
  };

  const handleQuickAdminLogin = () => {
    setEmail('erisman@admin.com');
    setPassword('admin');
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
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left side - Login form */}
          <div className="w-full max-w-md mx-auto animate-fade-in">
            <div className="mb-8 flex justify-center">
              <CBMEPILogo size="large" withText={true} />
            </div>
            
            <Card className="border-2 border-white/20 shadow-2xl backdrop-blur-sm bg-white/95">
              <CardHeader className="text-center">
                <h1 className="text-2xl font-bold text-cbmepi-black">Sistema de Gestão</h1>
                <p className="text-gray-600">Projeto Bombeiro Mirim</p>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Digite seu email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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

                  {/* Quick admin login button */}
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-[#F5A623] text-[#F5A623] hover:bg-[#F5A623] hover:text-white"
                    onClick={handleQuickAdminLogin}
                  >
                    🚀 Login Rápido Admin
                  </Button>
                </form>

                {/* Admin diagnostic tools */}
                {showAdminTools && (
                  <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertCircle className="w-5 h-5 text-yellow-600" />
                      <h3 className="font-semibold text-yellow-800">Ferramentas de Diagnóstico Admin</h3>
                    </div>
                    
                    <div className="space-y-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={handleDiagnoseAdmin}
                        disabled={isDiagnosing}
                      >
                        {isDiagnosing ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Diagnosticando...
                          </>
                        ) : (
                          <>
                            🔍 Diagnosticar Problema
                          </>
                        )}
                      </Button>
                      
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={handleCreateAdmin}
                        disabled={isCreatingAdmin}
                      >
                        {isCreatingAdmin ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Configurando...
                          </>
                        ) : (
                          <>
                            <Wrench className="w-4 h-4 mr-2" />
                            Criar/Reparar Admin
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
              
              <CardFooter className="flex justify-center border-t pt-4">
                <p className="text-xs text-gray-500 text-center">
                  ETI - Corpo de Bombeiros Militar do Estado do Piauí
                </p>
              </CardFooter>
            </Card>
          </div>

          {/* Right side - Info cards */}
          <div className="w-full max-w-2xl mx-auto">
            <div className="text-center mb-8 text-white">
              <h2 className="text-3xl font-bold mb-4">Projeto Bombeiro Mirim</h2>
              <p className="text-lg opacity-90">
                Formando cidadãos conscientes e preparados para o futuro
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

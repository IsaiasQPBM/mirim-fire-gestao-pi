
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import CBMEPILogo from '@/components/CBMEPILogo';
import { 
  Home, 
  Search, 
  Users, 
  BookOpen, 
  FileText,
  MessageSquare, 
  AlertTriangle, 
  ArrowLeft
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const NotFound = () => {
  const location = useLocation();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = React.useState('');
  
  const quickLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Alunos', path: '/students', icon: Users },
    { name: 'Currículo', path: '/curriculum', icon: BookOpen },
    { name: 'Relatórios', path: '/reports', icon: FileText },
    { name: 'Mensagens', path: '/communications/messages', icon: MessageSquare },
  ];

  const handleReportIssue = () => {
    toast({
      title: "Problema reportado",
      description: `O erro na página ${location.pathname} foi reportado com sucesso.`,
      variant: "default",
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Em uma aplicação real, isso redirecionaria para resultados da busca
    toast({
      title: "Busca iniciada",
      description: `Buscando por "${searchQuery}"...`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-3xl w-full mx-auto">
        <div className="mb-8 flex justify-center">
          <CBMEPILogo size="medium" />
        </div>
        
        <Card className="border-2 border-orange-200 shadow-lg">
          <CardHeader className="text-center border-b pb-6">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-orange-100 rounded-full">
                <AlertTriangle size={48} className="text-cbmepi-orange" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-cbmepi-red">Página não encontrada</h1>
            <p className="text-gray-600 mt-2">
              A página que você está procurando ({location.pathname}) não existe ou foi movida.
            </p>
          </CardHeader>
          
          <CardContent className="pt-6">
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-cbmepi-black mb-4">Buscar conteúdo</h2>
              <form onSubmit={handleSearch} className="flex gap-2">
                <Input
                  type="search"
                  placeholder="Digite o que está procurando..."
                  className="flex-1"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button type="submit" className="bg-cbmepi-orange hover:bg-cbmepi-orange/90">
                  <Search className="mr-2 h-4 w-4" />
                  Buscar
                </Button>
              </form>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold text-cbmepi-black mb-4">Acessos rápidos</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {quickLinks.map((link) => (
                  <Button 
                    key={link.path} 
                    asChild 
                    variant="outline" 
                    className="flex justify-start border-orange-200 hover:bg-orange-50 hover:text-cbmepi-orange"
                  >
                    <Link to={link.path}>
                      <link.icon className="mr-2 h-4 w-4" />
                      {link.name}
                    </Link>
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col sm:flex-row gap-4 justify-between items-center border-t pt-6">
            <Button 
              variant="outline" 
              onClick={handleReportIssue}
              className="w-full sm:w-auto"
            >
              Reportar problema
            </Button>
            
            <Button 
              asChild 
              className="w-full sm:w-auto bg-cbmepi-orange hover:bg-cbmepi-orange/90"
            >
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar para a página inicial
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default NotFound;

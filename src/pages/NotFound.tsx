
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import CBMEPILogo from '@/components/CBMEPILogo';
import { useToast } from '@/hooks/use-toast';
import { Home, Search, ArrowLeft, AlertTriangle } from 'lucide-react';

const NotFound: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const userRole = localStorage.getItem('userRole') || 'visitor';

  // Determine if the user is logged in
  const isLoggedIn = Boolean(localStorage.getItem('userRole') && localStorage.getItem('userName'));

  // Suggest alternative paths based on the current path
  const suggestedPaths = React.useMemo(() => {
    const path = location.pathname;
    const suggestions = [];

    // Extract potential resource type from URL
    const segments = path.split('/').filter(Boolean);
    const possibleResource = segments.length > 0 ? segments[0] : '';

    // Common patterns
    if (possibleResource === 'disciplina' || possibleResource === 'disciplinas') {
      suggestions.push({ name: 'Disciplinas', path: '/disciplines' });
    }
    if (possibleResource === 'turma' || possibleResource === 'turmas') {
      suggestions.push({ name: 'Turmas', path: '/classes' });
    }
    if (possibleResource === 'curso' || possibleResource === 'cursos') {
      suggestions.push({ name: 'Cursos', path: '/courses' });
    }
    if (possibleResource === 'aluno' || possibleResource === 'alunos' || possibleResource === 'estudante' || possibleResource === 'estudantes') {
      suggestions.push({ name: 'Alunos', path: '/students' });
    }
    if (possibleResource === 'calendario' || possibleResource === 'agenda') {
      suggestions.push({ name: 'Calendário', path: '/calendar' });
    }
    if (possibleResource === 'aula' || possibleResource === 'aulas' || possibleResource === 'planejamento') {
      suggestions.push({ name: 'Planejamento de Aulas', path: '/lessons/planning' });
    }

    // Add standard navigation options based on role
    if (isLoggedIn) {
      suggestions.push({ name: 'Dashboard', path: '/dashboard' });
      
      if (userRole === 'admin' || userRole === 'instructor') {
        if (!suggestions.some(s => s.path === '/disciplines')) {
          suggestions.push({ name: 'Disciplinas', path: '/disciplines' });
        }
        if (!suggestions.some(s => s.path === '/classes')) {
          suggestions.push({ name: 'Turmas', path: '/classes' });
        }
      }
    } else {
      suggestions.push({ name: 'Página de Login', path: '/login' });
    }

    // Limit to 5 suggestions
    return suggestions.slice(0, 5);
  }, [location.pathname, userRole, isLoggedIn]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const searchInput = form.elements.namedItem('search') as HTMLInputElement;
    const query = searchInput.value.trim().toLowerCase();
    
    // Simple search routing
    if (query.includes('disciplina')) {
      navigate('/disciplines');
    } else if (query.includes('turma')) {
      navigate('/classes');
    } else if (query.includes('curso')) {
      navigate('/courses');
    } else if (query.includes('aluno') || query.includes('estudante')) {
      navigate('/students');
    } else if (query.includes('calendario') || query.includes('agenda')) {
      navigate('/calendar');
    } else if (query.includes('aula') || query.includes('planejamento')) {
      navigate('/lessons/planning');
    } else {
      // If no match, go to dashboard
      navigate('/dashboard');
    }
  };

  const handleReportIssue = () => {
    // Log the 404
    const notFoundLog = JSON.parse(localStorage.getItem('notFoundLog') || '[]');
    notFoundLog.push({
      path: location.pathname,
      timestamp: Date.now(),
      reported: true
    });
    localStorage.setItem('notFoundLog', JSON.stringify(notFoundLog));
    
    // Show confirmation
    toast({
      title: "Problema Reportado",
      description: `O problema de acesso à página ${location.pathname} foi registrado.`,
      variant: "default",
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="m-auto max-w-2xl w-full p-6">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <CBMEPILogo size="medium" withText={true} />
          </div>
          
          <AlertTriangle className="mx-auto h-16 w-16 text-cbmepi-orange mb-4" />
          <h1 className="text-4xl font-bold text-cbmepi-black mb-2">Página não encontrada</h1>
          <p className="text-gray-600 text-lg">
            A página que você está procurando não existe ou foi movida.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-cbmepi-black mb-4">Pesquisar no sistema</h2>
          <form onSubmit={handleSearch} className="flex space-x-2">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                name="search"
                type="text"
                placeholder="O que você está procurando?"
                className="pl-10 w-full"
              />
            </div>
            <Button type="submit" className="bg-cbmepi-orange hover:bg-cbmepi-orange/90 text-white">
              Buscar
            </Button>
          </form>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-cbmepi-black mb-4">Páginas sugeridas</h2>
          <div className="grid grid-cols-1 gap-2">
            {suggestedPaths.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center p-3 rounded-md hover:bg-gray-100 text-gray-700"
              >
                <ArrowLeft className="mr-3 h-4 w-4 text-cbmepi-orange" />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Button
            onClick={() => navigate(isLoggedIn ? '/dashboard' : '/')}
            className="bg-cbmepi-orange hover:bg-cbmepi-orange/90 text-white"
          >
            <Home className="mr-2 h-4 w-4" />
            {isLoggedIn ? 'Voltar para o Dashboard' : 'Ir para a página inicial'}
          </Button>
          
          <Button onClick={handleReportIssue} variant="outline">
            Reportar problema
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

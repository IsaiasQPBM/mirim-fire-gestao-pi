
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  NavigationMenu, 
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import { 
  Home,
  BookOpen,
  Users,
  FileText,
  MessageSquare,
  Bell,
  HelpCircle,
  Search
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface GlobalNavigationProps {
  userRole: 'admin' | 'instructor' | 'student';
}

const GlobalNavigation: React.FC<GlobalNavigationProps> = ({ userRole }) => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would redirect to search results
    console.log('Searching for:', searchQuery);
  };

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  return (
    <div className="bg-white border-b border-gray-200 py-2 px-4 flex items-center justify-between">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link to="/dashboard">
              <NavigationMenuLink 
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md",
                  isActive('/dashboard') 
                    ? "bg-cbmepi-orange text-white" 
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <Home className="mr-2 h-4 w-4" />
                <span>Início</span>
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>

          {(userRole === 'admin' || userRole === 'instructor') && (
            <>
              <NavigationMenuItem>
                <NavigationMenuTrigger 
                  className={cn(
                    "flex items-center text-sm font-medium",
                    (isActive('/courses') || isActive('/disciplines') || isActive('/classes') || isActive('/curriculum'))
                      ? "text-cbmepi-orange" 
                      : "text-gray-700"
                  )}
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  <span>Currículo</span>
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[200px] gap-1 p-2">
                    <li>
                      <Link to="/courses">
                        <NavigationMenuLink 
                          className={cn(
                            "flex items-center p-2 text-sm rounded-md",
                            isActive('/courses') ? "bg-orange-50 text-cbmepi-orange font-medium" : "text-gray-700 hover:bg-gray-100"
                          )}
                        >
                          Cursos
                        </NavigationMenuLink>
                      </Link>
                    </li>
                    <li>
                      <Link to="/disciplines">
                        <NavigationMenuLink 
                          className={cn(
                            "flex items-center p-2 text-sm rounded-md",
                            isActive('/disciplines') ? "bg-orange-50 text-cbmepi-orange font-medium" : "text-gray-700 hover:bg-gray-100"
                          )}
                        >
                          Disciplinas
                        </NavigationMenuLink>
                      </Link>
                    </li>
                    <li>
                      <Link to="/classes">
                        <NavigationMenuLink 
                          className={cn(
                            "flex items-center p-2 text-sm rounded-md",
                            isActive('/classes') ? "bg-orange-50 text-cbmepi-orange font-medium" : "text-gray-700 hover:bg-gray-100"
                          )}
                        >
                          Turmas
                        </NavigationMenuLink>
                      </Link>
                    </li>
                    <li>
                      <Link to="/curriculum">
                        <NavigationMenuLink 
                          className={cn(
                            "flex items-center p-2 text-sm rounded-md",
                            isActive('/curriculum') ? "bg-orange-50 text-cbmepi-orange font-medium" : "text-gray-700 hover:bg-gray-100"
                          )}
                        >
                          Grade Curricular
                        </NavigationMenuLink>
                      </Link>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger 
                  className={cn(
                    "flex items-center text-sm font-medium",
                    (isActive('/pedagogical'))
                      ? "text-cbmepi-orange" 
                      : "text-gray-700"
                  )}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  <span>Pedagógico</span>
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[220px] gap-1 p-2">
                    <li>
                      <Link to="/pedagogical/observations">
                        <NavigationMenuLink 
                          className={cn(
                            "flex items-center p-2 text-sm rounded-md",
                            isActive('/pedagogical/observations') ? "bg-orange-50 text-cbmepi-orange font-medium" : "text-gray-700 hover:bg-gray-100"
                          )}
                        >
                          Observações
                        </NavigationMenuLink>
                      </Link>
                    </li>
                    <li>
                      <Link to="/pedagogical/assessments">
                        <NavigationMenuLink 
                          className={cn(
                            "flex items-center p-2 text-sm rounded-md",
                            isActive('/pedagogical/assessments') ? "bg-orange-50 text-cbmepi-orange font-medium" : "text-gray-700 hover:bg-gray-100"
                          )}
                        >
                          Avaliações
                        </NavigationMenuLink>
                      </Link>
                    </li>
                    <li>
                      <Link to="/pedagogical/question-bank">
                        <NavigationMenuLink 
                          className={cn(
                            "flex items-center p-2 text-sm rounded-md",
                            isActive('/pedagogical/question-bank') ? "bg-orange-50 text-cbmepi-orange font-medium" : "text-gray-700 hover:bg-gray-100"
                          )}
                        >
                          Banco de Questões
                        </NavigationMenuLink>
                      </Link>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </>
          )}

          {userRole === 'student' && (
            <>
              <NavigationMenuItem>
                <Link to="/grades">
                  <NavigationMenuLink 
                    className={cn(
                      "flex items-center px-3 py-2 text-sm font-medium rounded-md",
                      isActive('/grades') 
                        ? "bg-cbmepi-orange text-white" 
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    <span>Notas</span>
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link to="/schedule">
                  <NavigationMenuLink 
                    className={cn(
                      "flex items-center px-3 py-2 text-sm font-medium rounded-md",
                      isActive('/schedule') 
                        ? "bg-cbmepi-orange text-white" 
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    <span>Cronograma</span>
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </>
          )}

          <NavigationMenuItem>
            <NavigationMenuTrigger 
              className={cn(
                "flex items-center text-sm font-medium",
                (isActive('/reports'))
                  ? "text-cbmepi-orange" 
                  : "text-gray-700"
              )}
            >
              <FileText className="mr-2 h-4 w-4" />
              <span>Relatórios</span>
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[250px] gap-1 p-2">
                <li>
                  <Link to="/reports/student-bulletin">
                    <NavigationMenuLink 
                      className="flex items-center p-2 text-sm rounded-md hover:bg-gray-100"
                    >
                      Boletim Individual
                    </NavigationMenuLink>
                  </Link>
                </li>
                {(userRole === 'admin' || userRole === 'instructor') && (
                  <>
                    <li>
                      <Link to="/reports/class-performance">
                        <NavigationMenuLink 
                          className="flex items-center p-2 text-sm rounded-md hover:bg-gray-100"
                        >
                          Desempenho por Turma
                        </NavigationMenuLink>
                      </Link>
                    </li>
                    <li>
                      <Link to="/reports/approval-stats">
                        <NavigationMenuLink 
                          className="flex items-center p-2 text-sm rounded-md hover:bg-gray-100"
                        >
                          Estatísticas de Aprovação
                        </NavigationMenuLink>
                      </Link>
                    </li>
                    <li>
                      <Link to="/reports/attendance">
                        <NavigationMenuLink 
                          className="flex items-center p-2 text-sm rounded-md hover:bg-gray-100"
                        >
                          Relatório de Frequência
                        </NavigationMenuLink>
                      </Link>
                    </li>
                    <li>
                      <Link to="/reports/comparative">
                        <NavigationMenuLink 
                          className="flex items-center p-2 text-sm rounded-md hover:bg-gray-100"
                        >
                          Análise Comparativa
                        </NavigationMenuLink>
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <Link to="/communication/messages">
              <NavigationMenuLink 
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md",
                  isActive('/communication') 
                    ? "bg-cbmepi-orange text-white" 
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                <span>Mensagens</span>
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <div className="flex items-center space-x-2">
        <form onSubmit={handleSearch} className="relative hidden md:block">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Buscar no sistema..."
            className="w-64 pl-8 h-9 bg-gray-50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
        <Link to="/help">
          <Button variant="ghost" size="icon">
            <HelpCircle className="h-5 w-5 text-gray-600" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default GlobalNavigation;

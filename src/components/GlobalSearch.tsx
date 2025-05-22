
import React, { useState, useEffect } from 'react';
import { Search, X, User, FileText, BookOpen, Calendar, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

// Types for search results
interface SearchResult {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  type: 'user' | 'course' | 'class' | 'document' | 'message' | 'report';
}

// Mock search results - in a real app, this would come from an API
const mockResults: SearchResult[] = [
  {
    id: 'user-1',
    title: 'Pedro Santos',
    description: 'Aluno - Turma A',
    icon: <User className="h-4 w-4" />,
    path: '/pedagogical/student/user-1',
    type: 'user'
  },
  {
    id: 'user-2',
    title: 'Maria Oliveira',
    description: 'Aluno - Turma B',
    icon: <User className="h-4 w-4" />,
    path: '/pedagogical/student/user-2',
    type: 'user'
  },
  {
    id: 'course-1',
    title: 'Bombeiro Mirim',
    description: 'Curso principal',
    icon: <BookOpen className="h-4 w-4" />,
    path: '/courses/course-1',
    type: 'course'
  },
  {
    id: 'class-1',
    title: 'Turma A - 2025',
    description: 'Bombeiro Mirim',
    icon: <User className="h-4 w-4" />,
    path: '/classes/class-1',
    type: 'class'
  },
  {
    id: 'report-1',
    title: 'Boletim Individual',
    description: 'Relatório de desempenho individual',
    icon: <FileText className="h-4 w-4" />,
    path: '/reports/student-bulletin',
    type: 'report'
  },
  {
    id: 'report-2',
    title: 'Relatório de Frequência',
    description: 'Acompanhamento de presença',
    icon: <Calendar className="h-4 w-4" />,
    path: '/reports/attendance',
    type: 'report'
  },
  {
    id: 'message-1',
    title: 'Instruções para a próxima aula',
    description: 'Mensagem do Instrutor Carlos',
    icon: <MessageSquare className="h-4 w-4" />,
    path: '/communication/messages',
    type: 'message'
  }
];

// Group types
const resultGroups = [
  { type: 'user', label: 'Usuários' },
  { type: 'course', label: 'Cursos' },
  { type: 'class', label: 'Turmas' },
  { type: 'report', label: 'Relatórios' },
  { type: 'message', label: 'Mensagens' }
];

interface GlobalSearchProps {
  variant?: 'default' | 'minimal';
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({ variant = 'default' }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Load recent searches from localStorage
  useEffect(() => {
    const savedRecentSearches = localStorage.getItem('recentSearches');
    if (savedRecentSearches) {
      try {
        const parsedSearches = JSON.parse(savedRecentSearches);
        setRecentSearches(parsedSearches.slice(0, 3)); // Show only the top 3 recent searches
      } catch (e) {
        console.error('Error parsing recent searches', e);
      }
    }
  }, []);

  // Search functionality
  const handleSearch = () => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    
    // Simulate API search with timeout
    setTimeout(() => {
      // Filter mock results based on query
      const filteredResults = mockResults.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) || 
        item.description.toLowerCase().includes(query.toLowerCase())
      );
      
      setResults(filteredResults);
      setIsSearching(false);
    }, 500);
  };

  // Clear search
  const clearSearch = () => {
    setQuery('');
    setResults([]);
  };

  // Navigate to result and record in recent searches
  const navigateToResult = (result: SearchResult) => {
    // Save to recent searches
    const updatedRecentSearches = [
      result,
      ...recentSearches.filter(item => item.id !== result.id)
    ].slice(0, 5);
    
    setRecentSearches(updatedRecentSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedRecentSearches));
    
    // Close dialog and navigate
    setIsOpen(false);
    navigate(result.path);
    
    // Show feedback
    toast({
      title: "Navegando para",
      description: result.title,
      duration: 2000,
    });
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K or Cmd+K to open search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      
      // Escape to close search
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Group results by type
  const groupedResults = resultGroups.map(group => ({
    ...group,
    items: results.filter(result => result.type === group.type)
  })).filter(group => group.items.length > 0);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {variant === 'minimal' ? (
          <Button variant="ghost" size="icon" className="text-gray-600">
            <Search className="h-5 w-5" />
          </Button>
        ) : (
          <div className="flex items-center relative rounded-md border border-input bg-white focus-within:ring-1 focus-within:ring-primary">
            <Search size={18} className="absolute left-3 text-gray-400" />
            <Input 
              readOnly
              onClick={() => setIsOpen(true)}
              placeholder={isMobile ? "Buscar..." : "Buscar no sistema... (Ctrl+K)"}
              className="pl-10 border-none rounded-md bg-transparent w-full h-9" 
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
              {!isMobile && <span>Ctrl+K</span>}
            </div>
          </div>
        )}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[600px] p-0">
        <div className="p-4 border-b">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar usuários, cursos, turmas, relatórios..."
                className="w-full pl-9 pr-8"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                autoFocus
              />
              {query && (
                <button 
                  className="absolute right-3 top-2.5"
                  onClick={clearSearch}
                >
                  <X className="h-4 w-4 text-gray-400" />
                </button>
              )}
            </div>
            <Button onClick={handleSearch} disabled={isSearching}>
              {isSearching ? 'Buscando...' : 'Buscar'}
            </Button>
          </div>
        </div>
        
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {/* No query entered yet */}
          {!query && recentSearches.length > 0 && (
            <div className="p-2">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Buscas recentes</h3>
              <div className="space-y-1">
                {recentSearches.map(item => (
                  <button
                    key={item.id}
                    className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 text-left"
                    onClick={() => navigateToResult(item)}
                  >
                    <div className="p-1 rounded-md bg-gray-100">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="text-xs text-gray-500">{item.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Search results */}
          {query && results.length === 0 && !isSearching && (
            <div className="flex flex-col items-center justify-center py-8">
              <FileText className="h-12 w-12 text-gray-300 mb-2" />
              <p className="text-gray-500">Nenhum resultado encontrado</p>
            </div>
          )}
          
          {query && isSearching && (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="animate-pulse rounded-full h-12 w-12 bg-gray-200 mb-2" />
              <p className="text-gray-500">Buscando...</p>
            </div>
          )}
          
          {query && !isSearching && groupedResults.map(group => (
            <div key={group.type} className="p-2">
              <h3 className="text-sm font-medium text-gray-500 mb-2">{group.label}</h3>
              <div className="space-y-1">
                {group.items.map(item => (
                  <button
                    key={item.id}
                    className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 text-left"
                    onClick={() => navigateToResult(item)}
                  >
                    <div className="p-1 rounded-md bg-gray-100">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="text-xs text-gray-500">{item.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-2 border-t text-xs text-center text-gray-500">
          Pressione <kbd className="px-1.5 py-0.5 bg-gray-100 rounded border">ESC</kbd> para fechar
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GlobalSearch;

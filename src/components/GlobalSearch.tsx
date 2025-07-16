
import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { SearchDialog } from './search/SearchDialog';
import { SearchResult } from './search/types';
// import { mockResults } from './search/mockData';

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
        setRecentSearches(parsedSearches.slice(0, 3));
      } catch (e) {
        console.error('Error parsing recent searches', e);
      }
    }
  }, []);

  // Search functionality
  const handleSearch = () => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    
    setTimeout(() => {
      // TODO: Integrar busca global com Supabase
      setResults([]);
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
    const updatedRecentSearches = [
      result,
      ...recentSearches.filter(item => item.id !== result.id)
    ].slice(0, 5);
    
    setRecentSearches(updatedRecentSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedRecentSearches));
    
    setIsOpen(false);
    navigate(result.path);
    
    toast({
      title: "Navegando para",
      description: result.title,
      duration: 2000,
    });
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <>
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
      </Dialog>

      <SearchDialog
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        query={query}
        onQueryChange={setQuery}
        results={results}
        recentSearches={recentSearches}
        isSearching={isSearching}
        onSearch={handleSearch}
        onClearSearch={clearSearch}
        onNavigateToResult={navigateToResult}
      />
    </>
  );
};

export default GlobalSearch;

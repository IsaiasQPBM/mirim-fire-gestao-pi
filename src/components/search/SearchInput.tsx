
import React from 'react';
import { Search, X } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchInputProps {
  query: string;
  onQueryChange: (query: string) => void;
  onSearch: () => void;
  onClearSearch: () => void;
  isSearching: boolean;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  query,
  onQueryChange,
  onSearch,
  onClearSearch,
  isSearching
}) => {
  return (
    <div className="p-4 border-b">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar usuários, cursos, turmas, relatórios..."
            className="w-full pl-9 pr-8"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSearch()}
            autoFocus
          />
          {query && (
            <button 
              className="absolute right-3 top-2.5"
              onClick={onClearSearch}
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
          )}
        </div>
        <Button onClick={onSearch} disabled={isSearching}>
          {isSearching ? 'Buscando...' : 'Buscar'}
        </Button>
      </div>
    </div>
  );
};


import React from 'react';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { SearchInput } from './SearchInput';
import { SearchResults } from './SearchResults';
import { RecentSearches } from './RecentSearches';
import { SearchResult } from './types';

interface SearchDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  query: string;
  onQueryChange: (query: string) => void;
  results: SearchResult[];
  recentSearches: SearchResult[];
  isSearching: boolean;
  onSearch: () => void;
  onClearSearch: () => void;
  onNavigateToResult: (result: SearchResult) => void;
}

export const SearchDialog: React.FC<SearchDialogProps> = ({
  isOpen,
  onOpenChange,
  query,
  onQueryChange,
  results,
  recentSearches,
  isSearching,
  onSearch,
  onClearSearch,
  onNavigateToResult
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0">
        <SearchInput
          query={query}
          onQueryChange={onQueryChange}
          onSearch={onSearch}
          onClearSearch={onClearSearch}
          isSearching={isSearching}
        />
        
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {!query && recentSearches.length > 0 && (
            <RecentSearches
              recentSearches={recentSearches}
              onNavigateToResult={onNavigateToResult}
            />
          )}
          
          <SearchResults
            query={query}
            results={results}
            isSearching={isSearching}
            onNavigateToResult={onNavigateToResult}
          />
        </div>
        
        <div className="p-2 border-t text-xs text-center text-gray-500">
          Pressione <kbd className="px-1.5 py-0.5 bg-gray-100 rounded border">ESC</kbd> para fechar
        </div>
      </DialogContent>
    </Dialog>
  );
};

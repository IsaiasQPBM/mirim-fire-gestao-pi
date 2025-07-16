
import React from 'react';
import { FileText } from 'lucide-react';
import { SearchResult } from './types';

interface SearchResultsProps {
  query: string;
  results: SearchResult[];
  isSearching: boolean;
  onNavigateToResult: (result: SearchResult) => void;
}

const resultGroups = [
  { type: 'user', label: 'Usuários' },
  { type: 'course', label: 'Cursos' },
  { type: 'class', label: 'Turmas' },
  { type: 'report', label: 'Relatórios' },
  { type: 'message', label: 'Mensagens' }
];

export const SearchResults: React.FC<SearchResultsProps> = ({
  query,
  results,
  isSearching,
  onNavigateToResult
}) => {
  if (!query) return null;

  if (results.length === 0 && !isSearching) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <FileText className="h-12 w-12 text-gray-300 mb-2" />
        <p className="text-gray-500">Nenhum resultado encontrado</p>
      </div>
    );
  }

  if (isSearching) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <div className="animate-pulse rounded-full h-12 w-12 bg-gray-200 mb-2" />
        <p className="text-gray-500">Buscando...</p>
      </div>
    );
  }

  const groupedResults = resultGroups.map(group => ({
    ...group,
    items: results.filter(result => result.type === group.type)
  })).filter(group => group.items.length > 0);

  return (
    <>
      {groupedResults.map(group => (
        <div key={group.type} className="p-2">
          <h3 className="text-sm font-medium text-gray-500 mb-2">{group.label}</h3>
          <div className="space-y-1">
            {group.items.map(item => (
              <button
                key={item.id}
                className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 text-left"
                onClick={() => onNavigateToResult(item)}
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
    </>
  );
};

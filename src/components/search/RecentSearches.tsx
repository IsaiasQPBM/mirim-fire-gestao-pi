
import React from 'react';
import { SearchResult } from './types';

interface RecentSearchesProps {
  recentSearches: SearchResult[];
  onNavigateToResult: (result: SearchResult) => void;
}

export const RecentSearches: React.FC<RecentSearchesProps> = ({
  recentSearches,
  onNavigateToResult
}) => {
  return (
    <div className="p-2">
      <h3 className="text-sm font-medium text-gray-500 mb-2">Buscas recentes</h3>
      <div className="space-y-1">
        {recentSearches.map(item => (
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
  );
};

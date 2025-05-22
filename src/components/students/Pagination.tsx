
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ 
  currentPage, 
  pageCount, 
  onPageChange 
}) => {
  const getPageNumbers = () => {
    // Always show first and last pages
    // Show 2 pages before and after current page
    // Use ellipsis for gaps
    
    const pages: (number | string)[] = [];
    
    if (pageCount <= 7) {
      // If few pages, show all
      for (let i = 1; i <= pageCount; i++) {
        pages.push(i);
      }
    } else {
      // Always add page 1
      pages.push(1);
      
      // Add ellipsis if needed
      if (currentPage > 3) {
        pages.push('...');
      }
      
      // Add pages around current page
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(pageCount - 1, currentPage + 1);
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      // Add ellipsis if needed
      if (currentPage < pageCount - 2) {
        pages.push('...');
      }
      
      // Always add last page
      pages.push(pageCount);
    }
    
    return pages;
  };
  
  return (
    <div className="flex items-center justify-center mt-6 gap-1">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      {getPageNumbers().map((page, index) => (
        typeof page === 'number' ? (
          <Button
            key={index}
            variant={currentPage === page ? 'default' : 'outline'}
            size="sm"
            onClick={() => onPageChange(page)}
            className={currentPage === page ? 'bg-cbmepi-orange hover:bg-cbmepi-orange/90' : ''}
          >
            {page}
          </Button>
        ) : (
          <span key={index} className="px-2">
            {page}
          </span>
        )
      ))}
      
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(Math.min(pageCount, currentPage + 1))}
        disabled={currentPage === pageCount}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

import { Button } from "../button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  // Função para gerar números das páginas visíveis
  const getVisiblePages = () => {
    const delta = 2; // Quantas páginas mostrar de cada lado
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); 
         i <= Math.min(totalPages - 1, currentPage + delta); 
         i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
      // Scroll para o topo da lista
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center space-x-2 mt-8">
      {/* Botão Anterior */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center cursor-pointer"
      >
        <ChevronLeft className="h-4 w-4 mr-1 cursor-pointer" />
        Anterior
      </Button>

      {/* Números das páginas */}
      <div className="flex space-x-1">
        {getVisiblePages().map((page, index) => (
          <div key={index}>
            {page === '...' ? (
              <span className="px-3 py-2 text-gray-500">...</span>
            ) : (
              <Button
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(page as number)}
                className={`
                  ${currentPage === page 
                    ? 'bg-blue-900 text-white' 
                    : 'hover:bg-gray-100'
                  }
                `}
              >
                {page}
              </Button>
            )}
          </div>
        ))}
      </div>

      {/* Botão Próximo */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center cursor-pointer"
      >
        Próximo
        <ChevronRight className="h-4 w-4 ml-1 cursor-pointer" />
      </Button>
    </div>
  );
}

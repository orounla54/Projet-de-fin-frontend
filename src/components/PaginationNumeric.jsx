import React from 'react';

function PaginationNumeric({ itemsPerPage, totalItems, paginate, currentPage }) {
  const pageNumbers = [];

  // Calculer le nombre total de pages
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // Limiter le nombre de pages affichées à 5
  const maxPagesToShow = 5;
  const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex justify-center">
      <nav className="flex" role="navigation" aria-label="Navigation">
        <div className="mr-2">
          <span className="inline-flex items-center justify-center rounded-lg leading-5 px-2.5 py-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 border border-gray-200 dark:border-gray-700/60 text-violet-500 shadow-sm">
            <span className="sr-only">Précédent</span><wbr />
            <a 
              onClick={() => currentPage > 1 && paginate(currentPage - 1)}
              href="#previous" 
              className={currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}
            >
              <svg className="fill-current" width="16" height="16" viewBox="0 0 16 16">
                <path d="M9.4 13.4l1.4-1.4-4-4 4-4-1.4-1.4L4 8z" />
              </svg>
            </a>
          </span>
        </div>
        <ul className="inline-flex text-sm font-medium -space-x-px rounded-lg shadow-sm">
          {pageNumbers.map(number => (
            <li key={number}>
              <a
                onClick={() => paginate(number)} // Appeler la fonction paginate
                className={`inline-flex items-center justify-center leading-5 px-3.5 py-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 border border-gray-200 dark:border-gray-700/60 ${currentPage === number ? 'text-violet-500' : 'text-gray-600 dark:text-gray-300'}`}
                href={`#${number}`} // Ajouter un href pour chaque numéro de page
              >
                {number}
              </a>
            </li>
          ))}
        </ul>
        <div className="ml-2">
          <a 
            onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
            href="#next" 
            className={`inline-flex items-center justify-center rounded-lg leading-5 px-2.5 py-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 border border-gray-200 dark:border-gray-700/60 text-violet-500 shadow-sm ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span className="sr-only">Suivant</span><wbr />
            <svg className="fill-current" width="16" height="16" viewBox="0 0 16 16">
              <path d="M6.6 13.4L5.2 12l4-4-4-4 1.4-1.4L12 8z" />
            </svg>
          </a>
        </div>
      </nav>
    </div>
  );
}

export default PaginationNumeric;

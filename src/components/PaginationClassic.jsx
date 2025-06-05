import React from 'react';

function PaginationClassic({ currentPage, itemsPerPage, totalItems, paginate }) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      {/* Navigation */}
      <nav className="mb-4 sm:mb-0 sm:order-1" role="navigation" aria-label="Navigation">
        <ul className="flex justify-center">
          {/* Previous Button */}
          <li className="ml-3 first:ml-0">
            <button
              className={`btn ${currentPage === 1 ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed' : 'hover:border-gray-300 dark:hover:border-gray-600 text-gray-800 dark:text-gray-300'}`}
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              &lt;- Précédent
            </button>
          </li>

          {/* Next Button */}
          <li className="ml-3 first:ml-0">
            <button
              className={`btn ${currentPage === totalPages ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed' : 'hover:border-gray-300 dark:hover:border-gray-600 text-gray-800 dark:text-gray-300'}`}
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Suivant -&gt;
            </button>
          </li>
        </ul>
      </nav>

      {/* Results Info */}
      <div className="text-sm text-gray-500 text-center sm:text-left">
        <span className="font-medium text-gray-600 dark:text-gray-300">{(currentPage - 1) * itemsPerPage + 1}</span> à <span className="font-medium text-gray-600 dark:text-gray-300">{Math.min(currentPage * itemsPerPage, totalItems)}</span> sur <span className="font-medium text-gray-600 dark:text-gray-300">{totalItems}</span> elements
      </div>
    </div>
  );
}

export default PaginationClassic;

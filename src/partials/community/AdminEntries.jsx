import React, { useState } from "react";
import ServicesItem from "../../components/ServicesItem";
import PaginationNumeric from "../../components/PaginationNumeric";

function AdminEntries({
  setKeyword,
  services,
  fetchData,
  error,
  setServicesCurrentIdInfo,
  servicesCurrentIdInfo,
  element
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currents = services.slice(indexOfFirst, indexOfLast);

  return (
    <>
      <div className="w-full">
        {/* Search form */}
        <div className="p-3 mb-5">
          <form className="relative">
            <label htmlFor="job-search" className="sr-only">
              Search
            </label>
            <input
              id="job-search"
              className="w-full bg-white form-input pl-9 dark:bg-gray-800"
              type="search"
              placeholder={`Rechercher un ${element}...`}
              onChange={async (e) => {
                await fetchData();
                setKeyword(e.target.value);
              }}
            />
            <button className="absolute inset-0 right-auto group" disabled>
              <svg
                className="ml-3 mr-2 text-gray-400 fill-current shrink-0 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M7 14c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zM7 2C4.243 2 2 4.243 2 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5z" />
                <path d="M15.707 14.293L13.314 11.9a8.019 8.019 0 01-1.414 1.414l2.393 2.393a.997.997 0 001.414 0 .999.999 0 000-1.414z" />
              </svg>
            </button>
          </form>
        </div>
        {/* Jobs header */}
        <div className="flex items-center justify-between p-3 mb-4">
          <div className="text-sm italic text-gray-500 dark:text-gray-400">
            {services?.length} {element} trouvé(e)s
          </div>
        </div>
        {/* Post 1 */}
        {error ? (
          <p className="text-xs text-center text-red-500">
            Erreur lors du chargement des données : {error}
          </p>
        ) : services && services.length > 0 ? (
          <>
            {currents.map((service) => (
              <>
                <ServicesItem
                  servicesCurrentIdInfo={servicesCurrentIdInfo}
                  service={service}
                  element={element}
                  setServicesCurrentIdInfo={setServicesCurrentIdInfo}
                />
              </>
            ))}
            {/* Pagination */}
            {services && services.length > itemsPerPage ? (
              <>
                <div className="mt-6">
                  <PaginationNumeric
                    itemsPerPage={itemsPerPage}
                    totalItems={services.length}
                    paginate={paginate}
                    currentPage={currentPage}
                  />
                </div>
              </>
            ) : (
              ""
            )}
          </>
        ) : (
          <>
            <p className="text-xs text-center">
              Aucune données pour l'instant😣...
            </p>
          </>
        )}
      </div>
    </>
  );
}

export default AdminEntries;

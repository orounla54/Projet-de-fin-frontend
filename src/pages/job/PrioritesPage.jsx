import React, { useEffect, useState } from "react";

import Sidebar from "../../partials/Sidebar";
import Header from "../../partials/Header";

import { useGetData } from "../../utils/Requests/RequestService";
import SpinnerLoading from "../../components/SpinnerLoading";

import ManagePriorite from "../../components/ManagePriorite";
import PrioritesSidebar from "../../partials/job/PrioritesSidebar";
import PaginationClassic from "../../components/PaginationClassic";
import DropdownSort from "../../components/DropdownSort";
import PrioriteListeItem from "../../partials/job/PrioriteListeItem";
import NoDataResponse from "../../components/NoDataResponse";

const formatPriorites = (data) => {
  return data.map((priorite) => ({
    ...priorite,
    responsables: priorite.responsables || [],
    services: priorite.services || [],
  }));
};

function PrioritesPage() {
  const [priorites, setPriorites] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [itemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [page, setPage] = useState("priorites");
  const [croissant, seCroissant] = useState(false);

  // Construire dynamiquement l'URL en fonction de l'existence de `filter`
  const queryParams = new URLSearchParams({
    keyword: keyword,
    croissant: croissant,
  }).toString();

  const { data, loading, error, fetchData } = useGetData(
    queryParams ? `priorites?${queryParams}` : null
  );

  useEffect(() => {
    if (data) {
      setPriorites(formatPriorites(data));
    }
  }, [data]);

  useEffect(() => {
    console.log(priorites); // ✅ Maintenant, priorites sera bien mis à jour avant d'être affiché
  }, [priorites]);

  const handleLabel = () => {
    if (page === "priorites") {
      return "Priorites";
    } else {
      return "Plan Strategique";
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currents = priorites.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-x-hidden overflow-y-auto">
        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="relative grow">
          {loading ? (
            <div className="absolute z-40 flex items-center justify-center w-full h-full bg-white dark:bg-gray-900">
              <SpinnerLoading />
            </div>
          ) : (
            <>
              {" "}
              <div className="w-full px-4 py-8 mx-auto sm:px-6 lg:px-8 max-w-9xl">
                <>
                  {/* Page header */}
                  <div className="flex items-center justify-between">
                    {/* Left: Title */}
                    <div className="mb-4 sm:mb-0">
                      <h1 className="text-2xl font-bold text-gray-800 xl:text-5xl md:text-4xl dark:text-gray-100">
                        {handleLabel()}
                      </h1>
                    </div>

                    {/* new*/}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setFeedbackModalOpen(true);
                      }}
                      className="text-gray-100 bg-gray-900 btn hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
                    >
                      Ajouter {handleLabel()}
                    </button>
                  </div>
                </>

                {/* Page content */}
                <div className="flex flex-col space-y-10 sm:flex-row sm:space-x-6 sm:space-y-0 md:flex-col md:space-x-0 md:space-y-10 xl:flex-row xl:space-x-6 xl:space-y-0 mt-9">
                  {/* Sidebar */}
                  <PrioritesSidebar />
                  {/*content */}
                  <div className="w-full p-4 mx-auto xl:max-w-screen-lg">
                    {/* Search form */}
                    <div className="mb-5 xl:mt-6">
                      <form className="relative">
                        <label htmlFor="job-search" className="sr-only">
                          Search
                        </label>
                        <input
                          id="job-search"
                          className="w-full bg-white form-input pl-9 dark:bg-gray-800"
                          type="search"
                          onChange={(e) => setKeyword(e.target.value)}
                          placeholder={`Rechercher le titre ou le mot-clé...`}
                        />
                        <button
                          className="absolute inset-0 right-auto group"
                          type="submit"
                          aria-label="Search"
                        >
                          <svg
                            className="ml-3 mr-2 text-gray-400 fill-current shrink-0 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400"
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                          >
                            <path d="M7 14c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zM7 2C4.243 2 2 4.243 2 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5z" />
                            <path d="M15.707 14.293L13.314 11.9a8.019 8.019 0 01-1.414 1.414l2.393 2.393a.997.997 0 001.414 0 .999.999 0 000-1.414z" />
                          </svg>
                        </button>
                      </form>
                    </div>

                    {/* Jobs header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-sm italic text-gray-500 dark:text-gray-400">
                        {priorites.length} {handleLabel()} trouvés
                      </div>
                      {/* Sort */}
                      <div className="text-xs">
                        <span>Afficher par ordre </span>
                        <DropdownSort
                          croissant={croissant}
                          seCroissant={seCroissant}
                          fetchData={fetchData}
                          align="right"
                        />
                      </div>
                    </div>
                    <div className="overflow-x-auto border border-gray-200 rounded-lg dark:border-gray-700/60 ">
                      <table className="w-full divide-y divide-gray-100 table-auto dark:text-gray-300 dark:divide-gray-700/60">
                        {error ? (
                          <li className="p-2 text-red-500 dark:text-red-400">
                            Une erreur s'est produite au niveau du serveur:{" "}
                            {error.message}
                          </li>
                        ) : (
                          <>
                            {Array.isArray(currents) && priorites.length > 0 ? (
                              currents.map((item) => {
                                return (
                                  <PrioriteListeItem
                                    key={item.id}
                                    id={item.id}
                                    libelle={item.libelle}
                                    description={item.description}
                                    dateInscription={item.dateInscription}
                                    status={item.status}
                                    new={item.new}
                                    progress={item.progress}
                                    code={item.code}
                                    typePriorite={item.typePriorite}
                                    objectifOperationnel={
                                      item.objectifOperationnel
                                    }
                                    responsables={item.responsables}
                                    services={item.services}
                                  />
                                );
                              })
                            ) : (
                              <>
                                <NoDataResponse keyword={keyword} />
                              </>
                            )}
                          </>
                        )}
                      </table>
                    </div>

                    {priorites.length > itemsPerPage && (
                      <PaginationClassic
                        currentPage={currentPage}
                        itemsPerPage={itemsPerPage}
                        totalItems={priorites.length}
                        paginate={handlePageChange}
                      />
                    )}
                  </div>
                </div>

                {/* formulaire new */}
                <ManagePriorite
                  fetchData={fetchData}
                  feedbackModalOpen={feedbackModalOpen}
                  setFeedbackModalOpen={setFeedbackModalOpen}
                />
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default PrioritesPage;

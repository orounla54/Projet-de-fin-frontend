import React, { useEffect, useState } from "react";

import Sidebar from "../../partials/Sidebar";
import Header from "../../partials/Header";
import { useGetData } from "../../utils/Requests/RequestService";
import PaginationClassic from "../../components/PaginationClassic";

import SpinnerLoading from "../../components/SpinnerLoading";
import AddSollicitations from "../../components/AddSollicitations";
import SearchForm from "../../partials/actions/SearchForm";
import SollicitationResponsableItem from "../../components/SollicitationResponsableItem";

function EmptyState() {
  const filterOptions = [
    { label: "Voir tout", value: "Tout" },
    { label: "Non démarré", value: "Non-démarré" },
    { label: "En cours de traitement", value: "En-cours de traitement" },
    { label: "Traitées", value: "Traitée" },
  ];

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [sollicitations, setSollicitations] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [select, setSelect] = useState("Tout");

  // Construire dynamiquement l'URL en fonction de l'existence de `filter`
  const queryParams = new URLSearchParams({
    keyword: keyword,
    status: select ? select : "Tout",
  }).toString();

  // Récupérer les sollicitations
  const { data, loading, error, fetchData } = useGetData(
    select !== "Tout"
      ? `sollicitations/responsable?${queryParams}`
      : `sollicitations/responsable?keyword=${keyword}`
  );

  //effectue la mise à jour de la page quand on a la data
  useEffect(() => {
    if (data) {
      setSollicitations(data);
    }
    console.log(sollicitations);
  }, [data]);

  useEffect(() => {
    setTotalItems(sollicitations.length);
  }, [sollicitations]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const current = sollicitations.slice(indexOfFirstItem, indexOfLastItem);
  const [totalItems, setTotalItems] = useState(null);

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        variant="v2"
      />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-x-hidden overflow-y-auto bg-white dark:bg-gray-900">
        {/*  Site header */}
        <Header
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          variant="v3"
        />

        <main className="relative grow">
          {loading ? (
            <div className="absolute z-40 flex items-center justify-center w-full h-full bg-white dark:bg-gray-900">
              <SpinnerLoading />
            </div>
          ) : (
            <>
              {" "}
              <AddSollicitations
                fetchData={fetchData}
                feedbackModalOpen={feedbackModalOpen}
                setFeedbackModalOpen={setFeedbackModalOpen}
              />
              {/* Page header */}
              <div className="px-4 py-8 border-b border-gray-200 sm:flex sm:justify-between sm:items-center sm:px-6 dark:border-gray-700/60">
                {/* Left: Title */}
                <div className="mb-4 sm:mb-0">
                  <h1 className="text-2xl font-bold text-gray-800 md:text-3xl dark:text-gray-100">
                    Vos sollicitations
                  </h1>
                </div>

                {/* Right: Actions */}
                <div className="grid justify-start grid-flow-col gap-2 sm:auto-cols-max sm:justify-end">
                  <SearchForm
                    setKeyword={setKeyword}
                    placeholder="Recherche..."
                    fetchData={() => {}}
                  />
                  {/* Nouveau button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFeedbackModalOpen(true);
                    }}
                    className="text-gray-100 bg-gray-900 btn hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
                  >
                    Nouveau
                  </button>
                </div>
              </div>
              {/* Filters */}
              <div className="my-4 ml-2 xl:pl-32">
                <ul className="flex flex-wrap -m-1">
                  {filterOptions.map((option) => (
                    <li key={option.value} className="m-1">
                      <button
                        onClick={() => {
                          setSelect(option.value);
                          setCurrentPage(1);
                        }}
                        className={`inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border shadow-sm transition
                                ${
                                  select === option.value
                                    ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-800 border-transparent"
                                    : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600"
                                }`}
                      >
                        {option.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              {sollicitations && sollicitations.length > 0 ? (
                <>
                  <div className="w-full px-4 py-8 mx-auto sm:px-6 lg:px-8 max-w-9xl">
                    <div className="max-w-6xl m-auto xl:w-full">
                      {current.length > 0 &&
                        current.map((sollicitation) => (
                          <>
                            {/* Posts */}
                            <div className="">
                              {/* Post */}
                              <SollicitationResponsableItem
                                fetchData={fetchData}
                                sollicitation={sollicitation}
                              />
                            </div>
                          </>
                        ))}
                    </div>
                    {/* Pagination */}
                    <div className="mt-6 xl:pl-32 xl:-translate-x-16">
                      <PaginationClassic
                        currentPage={currentPage}
                        itemsPerPage={itemsPerPage}
                        totalItems={totalItems}
                        paginate={handlePageChange}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {" "}
                  {/* Quand on a rien */}
                  <div className="w-full px-4 py-8 mx-auto sm:px-6 lg:px-8 max-w-9xl">
                    <div className="max-w-2xl m-auto mt-16">
                      <div className="px-4 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-gradient-to-t from-gray-200 to-gray-100 dark:from-gray-700 dark:to-gray-800">
                          <svg
                            className="w-5 h-6 fill-current"
                            viewBox="0 0 20 24"
                          >
                            <path
                              className="text-gray-500 dark:text-gray-600"
                              d="M10 10.562l9-5-8.514-4.73a1 1 0 00-.972 0L1 5.562l9 5z"
                            />
                            <path
                              className="text-gray-300 dark:text-gray-400"
                              d="M9 12.294l-9-5v10.412a1 1 0 00.514.874L9 23.294v-11z"
                            />
                            <path
                              className="text-gray-400 dark:text-gray-500"
                              d="M11 12.294v11l8.486-4.714a1 1 0 00.514-.874V7.295l-9 4.999z"
                            />
                          </svg>
                        </div>
                        {keyword || select !== "Tout" ? (
                          <p className="text-xs text-center">
                            Aucun résultat pour la recherche "{keyword}"
                          </p>
                        ) : (
                          <>
                            <h2 className="mb-2 text-2xl font-bold text-gray-800 dark:text-gray-100">
                              Vous n'avez pas encore émis de sollicitations
                            </h2>
                            <div className="mb-6 text-gray-600 dark:text-gray-300">
                              N'hésitez pas à soumettre une sollicitation à un
                              autre service si vous en avez besoin.
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setFeedbackModalOpen(true);
                              }}
                              className="text-gray-100 bg-gray-900 btn hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
                            >
                              Nouveau
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default EmptyState;

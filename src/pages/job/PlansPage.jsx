import React, { useEffect, useState } from "react";

import Sidebar from "../../partials/Sidebar";
import Header from "../../partials/Header";

import { useGetData } from "../../utils/Requests/RequestService";
import SpinnerLoading from "../../components/SpinnerLoading";
import PlansLeftNavigation from "../../components/PlansLeftNavigation";
import AddPlanStrategique from "../../components/AddPlanStrategique";
import PaginationNumeric from "../../components/PaginationNumeric";
import DropdownSort from "../../components/DropdownSort";

import PlanListItem from "../../partials/job/PlanListItem";
import Matrice from "./Matrice";
import ManageAxesStrategiqueToObjectifOpera from "../../components/ManageAxesStrategiqueToObjectifOpera";

function PlansPage() {
  const [plans, setPlans] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [itemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [page, setPage] = useState("plansStrategiques");
  const [croissant, seCroissant] = useState(false);

  // Construire dynamiquement l'URL en fonction de l'existence de `filter`
  const queryParams = new URLSearchParams({
    keyword: keyword,
    croissant: croissant,
  }).toString();

  const { data, loading, error, fetchData } = useGetData(
    page ? `${page}?${queryParams}` : null
  );

  useEffect(() => {
    if (data) {
      setPlans(data);
    }
  }, [data]);

  useEffect(() => {
    console.log(plans); // ✅ Maintenant, plans sera bien mis à jour avant d'être affiché
  }, [plans]);

  const handleLabel = () => {
    if (page === "axesStrategiques") {
      return "Axe Strategiques";
    } else if (page === "objectifsStrategiques") {
      return "Objectif strategique";
    } else if (page === "mesuresStrategiques") {
      return "Mesure Strategiques";
    } else if (page === "objectifsOperationnels") {
      return "Objectif operationnel";
    } else {
      return "Plan Strategique";
    }
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currents = plans.slice(indexOfFirst, indexOfLast);

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
              <div className="w-full px-4 py-8 mx-auto sm:px-6 lg:px-8 max-w-9xl">
                {page !== "Matrice" && (
                  <>
                    {/* Page header */}
                    <div className="sm:flex sm:justify-between sm:items-center">
                      {/* Left: Title */}
                      <div className="mb-4 sm:mb-0">
                        <h1 className="hidden font-bold text-gray-800 text-x5l md:text-4xl xl:block dark:text-gray-100">
                          {handleLabel()}
                        </h1>
                      </div>

                      {/* new*/}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setFeedbackModalOpen(true);
                        }}
                        className="hidden text-gray-100 bg-gray-900 btn xl:block hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
                      >
                        Ajouter {handleLabel()}
                      </button>
                    </div>
                  </>
                )}

                {/* Page content */}
                <div className="flex-1 md:flex sm:space-x-6 mt-9">
                  {/* Sidebar */}
                  <PlansLeftNavigation
                    setFeedbackModalOpen={setFeedbackModalOpen}
                    setPage={setPage}
                    page={page}
                    handleLabel={handleLabel}
                  />

                  {page !== "Matrice" ? (
                    <>
                      {/* Content Accueil*/}
                      <div className="w-full">
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
                            {plans.length} {handleLabel()} trouvés
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

                        {/* Jobs list */}
                        {loading ? (
                          <SpinnerLoading />
                        ) : (
                          <>
                            {error ? (
                              <li className="p-2 text-red-500 dark:text-red-400">
                                Une erreur s'est produite au niveau du serveur:{" "}
                                {error.message}
                              </li>
                            ) : (
                              <>
                                {Array.isArray(currents) && plans.length > 0 ? (
                                  currents.map((item) => {
                                    return (
                                      <PlanListItem
                                        link={true}
                                        key={item.id}
                                        id={item.id}
                                        libelle={item.libelle}
                                        description={item.description}
                                        dateInscription={item.dateInscription}
                                        type={item.type}
                                        status={item.status}
                                        new={item.new}
                                        progress={item.progress}
                                        page={page}
                                        parent={
                                          page === "axesStrategiques"
                                            ? item.planStrategique
                                            : page === "objectifsStrategiques"
                                            ? item.axeStrategique
                                            : page === "mesuresStrategiques"
                                            ? item.objectifStrategique
                                            : page === "objectifsOperationnels"
                                            ? item.mesure
                                            : ""
                                        }
                                      />
                                    );
                                  })
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
                                          {keyword !== "" ? (
                                            <p className="text-xs text-center">
                                              Aucun résultat pour la recherche "
                                              {keyword}"
                                            </p>
                                          ) : (
                                            <>
                                              <div className="mb-6 text-gray-600 dark:text-gray-300">
                                                Rien n'a été inscrire pour le
                                                moment.
                                              </div>
                                            </>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </>
                                )}
                              </>
                            )}
                          </>
                        )}
                        {/* Pagination */}
                        <div className="mt-6">
                          {plans.length > itemsPerPage && (
                            <PaginationNumeric
                              itemsPerPage={itemsPerPage}
                              totalItems={plans.length}
                              paginate={paginate}
                              currentPage={currentPage}
                            />
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <Matrice />
                  )}
                </div>

                {/* formulaire new */}
                {page === "plansStrategiques" ? (
                  <AddPlanStrategique
                    fetchData={fetchData}
                    feedbackModalOpen={feedbackModalOpen}
                    setFeedbackModalOpen={setFeedbackModalOpen}
                  />
                ) : (
                  <ManageAxesStrategiqueToObjectifOpera
                    fetchData={fetchData}
                    feedbackModalOpen={feedbackModalOpen}
                    setFeedbackModalOpen={setFeedbackModalOpen}
                    element={page}
                  />
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default PlansPage;

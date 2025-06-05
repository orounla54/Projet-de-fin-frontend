import React, { useCallback, useEffect, useState } from "react";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import SearchForm from "../partials/actions/SearchForm";
import DeleteButton from "../partials/actions/DeleteButton";
import FilterButton from "../components/DropdownFilter";
import PaginationClassic from "../components/PaginationClassic";
import { useGetData } from "../utils/Requests/RequestService";
import TachesTable from "../components/TachesTable";
import { useNavigate } from "react-router-dom";
import ButtonAddTache from "../components/ButtonAddTache";
import { useSuccessMessage } from "../utils/SuccessContext";
import Toast from "../components/Toast";
import axios from "axios";
import AuthService from "../utils/Auth/AuthServices";
import SpinnerLoading from "../components/SpinnerLoading";
import exportToExcel, { baseURL } from "../utils/DataFront/eventTypes";

function TachesFiltres() {
  const baseUrl = baseURL;
  const [taches, setTaches] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [filter, setFilter] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    setFilter(filter);
  }, [filter]);

  // console.log(filter);

  // Gestion du message de succès
  const { successMessage, setSuccessMessage } = useSuccessMessage();
  const [toastSuccessOpen, setToastSuccessOpen] = useState(true);

  useEffect(() => {
    if (successMessage) {
      setTimeout(() => setSuccessMessage(""), 3000); // Effacer le message après 3 secondes
    }
  }, [successMessage]);

  // Construire dynamiquement l'URL en fonction de l'existence de `filter`
  const queryParams = new URLSearchParams({
    keyword: keyword,
    ...(filter?.dateInscription && { dateInscription: filter.dateInscription }),
    ...(filter?.datePriseDecision && {
      datePriseDecision: filter.datePriseDecision,
    }),
    ...(filter?.deadline && { deadline: filter.deadline }),
    ...(filter?.dateDebut && { dateDebut: filter.dateDebut }),
    ...(filter?.dateFin && { dateFin: filter.dateFin }),
    ...(filter?.idStatus && { idStatusTache: filter.idStatus }),
  }).toString();

  const { data, loading, error, fetchData } = useGetData(
    `filter/taches?${queryParams}`
  );

  // console.log(filter);

  useEffect(() => {
    if (data) {
      setTaches(data);
    }
    console.log(taches);
  }, [data]);

  // Calculer les indices pour la pagination
  const indexOfLastProject = currentPage * itemsPerPage;
  const indexOfFirstProject = indexOfLastProject - itemsPerPage;
  const currentsTaches = taches.length > 0 && taches?.slice(indexOfFirstProject, indexOfLastProject);

  // Fonction de changement de page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Fonction de sélection optimisée
  const handleSelectedItems = (selectedItems) => {
    setSelectedItems([...selectedItems]);
  };

  const [selectAll, setSelectAll] = useState(false);
  const [isCheck, setIsCheck] = useState([]);

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    setIsCheck(!selectAll ? currentsTaches.map((tache) => tache.id) : []);
  };

  // Fonction pour supprimer les éléments sélectionnés
  const [deleteAllLoading, setDeleteAllLoading] = useState(false);
  const deleteAll = async (selectedItems) => {
    const token = AuthService.getAccessToken();
    if (!token) {
      console.error("Token non trouvé. Veuillez vous authentifier.");
      return;
    }

    setDeleteAllLoading(true); // Mise à jour du statut de chargement

    try {
      const deleteResults = await Promise.all(
        selectedItems.map(async (id) => {
          try {
            const response = await axios.delete(`${baseUrl}/taches/${id}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            console.log(`Tache avec ID ${id} supprimé :`, response);
            return { id, success: true }; // Retourner un résultat de suppression réussi
          } catch (err) {
            if (err.response && err.response.status === 404) {
              console.warn(`Tache avec ID ${id} déjà supprimé ou introuvable.`);
              return { id, success: true }; // Marque comme succès même si le projet est déjà supprimé
            }
            console.error(
              `Erreur lors de la suppression du projet avec ID ${id}`,
              err
            );
            return { id, success: false }; // Marque comme échec si une erreur autre que 404 survient
          }
        })
      );

      // Appeler fetchData pour actualiser la liste des taches
      await fetchData();
      console.log("Liste mise à jour avec succès après suppression");

      // Vider la liste des éléments sélectionnés après suppression
      handleSelectedItems([]); // Mettre à jour le state pour réinitialiser la sélection
    } catch (error) {
      console.error(
        "Erreur lors de la suppression de certains éléments :",
        error
      );
    } finally {
      setDeleteAllLoading(false); // S'assurer que le statut de chargement est mis à jour à la fin de l'opération
    }
    setIsCheck([]);
  };

  //handleExport pour excel
  const handleExport = () => {
    exportToExcel(currentsTaches, "Liste_de_tache.xlsx");
  };

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-x-hidden overflow-y-auto">
        {/* Site header */}
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
                {/* Page header */}
                <div className="relative mb-5 sm:flex sm:justify-between sm:items-center">
                  {/* success message  */}
                  {successMessage && (
                    <div className="absolute left-0 -top-20 z-60 ">
                      <Toast
                        type="success"
                        open={toastSuccessOpen}
                        setOpen={setToastSuccessOpen}
                      >
                        {successMessage}
                      </Toast>
                    </div>
                  )}
                  <div className="mb-4 sm:mb-0">
                    <h1 className="text-2xl font-bold text-gray-800 md:text-3xl dark:text-gray-100">
                      Matrice des taches
                    </h1>
                  </div>

                  {/* Actions */}
                  <div className="grid justify-start grid-flow-col gap-2 sm:auto-cols-max sm:justify-end">
                    <SearchForm
                      setKeyword={setKeyword}
                      placeholder="Recherche..."
                    />

                    <div>
                      <ButtonAddTache />
                    </div>
                  </div>
                </div>

                {/* More actions */}
                <div className="mb-5 sm:flex sm:justify-between sm:items-center">
                  <div className="mb-4 sm:mb-0"></div>

                  <div className="grid justify-start grid-flow-col gap-2 sm:auto-cols-max sm:justify-end">
                    {/* Delete button */}
                    {!deleteAllLoading ? (
                      <DeleteButton
                        deleteAll={deleteAll}
                        selectedItems={selectedItems}
                      />
                    ) : (
                      <SpinnerLoading />
                    )}

                    <div className="flex items-center gap-1">
                      {/* Filter button and formulaire de filtrage */}
                      <FilterButton
                        setFilter={setFilter}
                        filter={filter}
                        align="right"
                      />
                      <button
                        onClick={(e) => {
                          handleExport();
                        }}
                        className="btn p-2.5 bg-white dark:bg-gray-800 border-gray-200 hover:border-gray-300 dark:border-gray-700/60 dark:hover:border-gray-600 text-gray-400 dark:text-gray-500"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="size-4"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3.738 20.249a.75.75 0 0 1 .75-.75H14.99V5.56l-2.47 2.47a.75.75 0 0 1-1.06-1.061l3.75-3.75a.75.75 0 0 1 1.06 0l3.751 3.75a.75.75 0 0 1-1.06 1.06L16.49 5.56V20.25a.75.75 0 0 1-.75.75H4.487a.75.75 0 0 1-.75-.75Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                      {/* <button
                    onClick={(e) => {
                      // e.stopPropagation();
                      // setFeedbackModalOpen(true);
                    }}
                    className="btn p-2.5 bg-white dark:bg-gray-800 border-gray-200 hover:border-gray-300 dark:border-gray-700/60 dark:hover:border-gray-600 text-gray-400 dark:text-gray-500"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-4"
                    >
                      <path
                        fillRule="evenodd"
                        d="M20.24 3.75a.75.75 0 0 1-.75.75H8.989v13.939l2.47-2.47a.75.75 0 1 1 1.06 1.061l-3.75 3.75a.75.75 0 0 1-1.06 0l-3.751-3.75a.75.75 0 1 1 1.06-1.06l2.47 2.469V3.75a.75.75 0 0 1 .75-.75H19.49a.75.75 0 0 1 .75.75Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button> */}
                    </div>
                  </div>
                </div>

                {/* Table */}

                <TachesTable
                  loading={loading}
                  taches={currentsTaches}
                  selectedItems={handleSelectedItems}
                  refresh={fetchData}
                  error={error}
                  handleSelectAll={handleSelectAll}
                  selectAll={selectAll}
                  isCheck={isCheck}
                  setIsCheck={setIsCheck}
                  setSelectAll={setSelectAll}
                />

                {/* Pagination */}
                <div className="mt-8">
                  <PaginationClassic
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    totalItems={taches.length}
                    paginate={paginate}
                  />
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default TachesFiltres;

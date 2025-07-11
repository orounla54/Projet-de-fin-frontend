import React, { useCallback, useEffect, useState } from "react";

import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import SearchForm from "../partials/actions/SearchForm";
import DeleteButton from "../partials/actions/DeleteButton";
import FilterButton from "../components/DropdownFilter";
import InvoicesTable from "../partials/invoices/InvoicesTable";
import PaginationClassic from "../components/PaginationClassic";

import { useDeleteData, useGetData } from "../utils/Requests/RequestService";
import SpinnerLoading from "../components/SpinnerLoading";
import ButtonAddProjet from "../components/ButtonAddProjet";
import axios from "axios";
import AuthService from "../utils/Auth/AuthServices";
import { useSuccessMessage } from "../utils/SuccessContext";
import Toast from "../components/Toast";
import exportToExcel, { baseURL } from "../utils/DataFront/eventTypes";

function ProjetsFiltre() {
  const baseUrl = baseURL;
  const [projets, setProjets] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [filter, setFilter] = useState(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    setFilter(filter);
  }, [filter]);

  // console.log(filter);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

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
    ...(filter?.idStatus && { statut: filter.idStatus }),
  }).toString();

  // Récupérer les données avec les paramètres de filtre conditionnels
  const { data, loading, error, fetchData } = useGetData(
    queryParams ? `/projets/public?${queryParams}` : "/projets/public"
  );

  // console.log(filter);

  useEffect(() => {
    if (data) {
      setProjets(data);
    }
    // console.log(projets);
  }, [data]);

  // Calculer les indices pour la pagination
  const indexOfLastProject = currentPage * itemsPerPage;
  const indexOfFirstProject = indexOfLastProject - itemsPerPage;
  const currentProjects = projets.slice(
    indexOfFirstProject,
    indexOfLastProject
  );

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
    setIsCheck(!selectAll ? currentProjects.map((projet) => projet.id) : []);
  };

  // Fonction pour supprimer les éléments sélectionnés
  const [deleteAllLoading, setDeleteAllLoading] = useState(false);
  const { deleteData: deleteProjet } = useDeleteData('/projets');

  const deleteAll = async (selectedItems) => {
    setDeleteAllLoading(true);

    try {
      const deleteResults = await Promise.all(
        selectedItems.map(async (id) => {
          try {
            await deleteProjet(id);
            console.log(`Projet avec ID ${id} supprimé`);
            return { id, success: true };
          } catch (err) {
            console.error(`Erreur lors de la suppression du projet avec ID ${id}:`, err);
            return { id, success: false };
          }
        })
      );

      // Appeler fetchData pour actualiser la liste des projets
      await fetchData();
      console.log("Liste mise à jour avec succès après suppression");

      // Vider la liste des éléments sélectionnés après suppression
      handleSelectedItems([]);
      setSuccessMessage("Projets supprimés avec succès");
    } catch (error) {
      console.error("Erreur lors de la suppression de certains éléments :", error);
      setError("Erreur lors de la suppression des projets");
    } finally {
      setDeleteAllLoading(false);
      setIsCheck([]);
    }
  };

  //handleExport pour excel
  const handleExport = () => {
    exportToExcel(currentProjects, "Liste_de_projet.xlsx");
  };

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-x-hidden overflow-y-auto">
        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
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
              {/* Left: Title */}
              <div className="mb-4 sm:mb-0">
                <h1 className="text-2xl font-bold text-gray-800 md:text-3xl dark:text-gray-100">
                  Matrice des projets
                </h1>
              </div>

              {/* Right: Actions */}
              <div className="grid justify-start grid-flow-col gap-2 sm:auto-cols-max sm:justify-end">
                {/* Search form */}
                <SearchForm
                  fetchData={fetchData}
                  setKeyword={setKeyword}
                  placeholder="Recherche..."
                />
                {/* Create invoice button */}
                <ButtonAddProjet />
              </div>
            </div>

            {/* More actions */}
            <div className="mb-5 sm:flex sm:justify-between sm:items-center">
              {/* Left side */}
              <div className="mb-4 sm:mb-0"></div>

              {/* Right side */}
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
                      xmlns="http://www.w3.org/2000/svg"
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
                </div>
              </div>
            </div>

            {/* Table */}
            <InvoicesTable
              loading={loading}
              projets={currentProjects}
              selectedItems={handleSelectedItems}
              refreshList={fetchData}
              error={error}
              handleSelectAll={handleSelectAll}
              selectAll={selectAll}
              isCheck={isCheck}
              setIsCheck={setIsCheck}
              setSelectAll={setSelectAll}
            />

            {/* Pagination */}
            <div className="mt-8">
              {projets.length > 0 && (
                <PaginationClassic
                  currentPage={currentPage}
                  itemsPerPage={itemsPerPage}
                  totalItems={projets.length}
                  paginate={paginate}
                />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default ProjetsFiltre;

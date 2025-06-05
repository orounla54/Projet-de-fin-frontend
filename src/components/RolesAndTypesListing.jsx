import React, { useState } from "react";
import SearchForm from "../partials/actions/SearchForm";
import DeleteButton from "../partials/actions/DeleteButton";
import PaginationClassic from "./PaginationClassic";
import ServicesTable from "./ServicesTable";
import SpinnerLoading from "./SpinnerLoading";
import AuthService from "../utils/Auth/AuthServices";
import axios from "axios";
import { baseURL } from "../utils/DataFront/eventTypes";

function RolesAndTypesListing({
  datasResult,
  fetchData,
  setKeyword,
  setFeedbackModalOpen,
  element,
}) {
  const baseUrl = baseURL;
  const [selectedItems, setSelectedItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Calculer les indices pour la pagination
  const indexOfLastProject = currentPage * itemsPerPage;
  const indexOfFirstProject = indexOfLastProject - itemsPerPage;
  const current = datasResult?.slice(indexOfFirstProject, indexOfLastProject);

  // Fonction de changement de page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSelectedItems = (selectedItems) => {
    setSelectedItems([...selectedItems]);
  };

  const [selectAll, setSelectAll] = useState(false);
  const [isCheck, setIsCheck] = useState([]);

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    setIsCheck(!selectAll ? current.map((Service) => Service.id) : []);
  };

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
            const response = await axios.delete(
              `${baseUrl}/${
                element === "roles tache"
                  ? `roles/${id}`
                  : element === "roles plan"
                  ? `rolesPlan/${id}`
                  : element === "type priorite"
                  ? `typePriorites/${id}`
                  : `${element}/${id}`
              }`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            console.log(`${element} avec ID ${id} supprimé :`, response);
            return { id, success: true }; // Retourner un résultat de suppression réussi
          } catch (err) {
            if (err.response && err.response.status === 404) {
              console.warn(
                `${element} avec ID ${id} déjà supprimé ou introuvable.`
              );
              return { id, success: true }; // Marque comme succès même si le Service est déjà supprimé
            }
            console.error(
              `Erreur lors de la suppression du ${element} avec ID ${id}`,
              err
            );
            return { id, success: false }; // Marque comme échec si une erreur autre que 404 survient
          }
        })
      );

      // Appeler fetchData pour actualiser la liste des Services
      await fetchData();
      console.log("Liste mise à jour avec succès après suppression");

      // Vider la liste des éléments sélectionnés après suppression
      handleSelectedItems([]); // Mettre à jour le state pour réinitialiser la sélection
    } catch (error) {
      console.error(
        "Erreur lors de la suppression de certains éléments :",
        error
      );
      setDeleteAllSuccess(false);
    } finally {
      setDeleteAllLoading(false); // S'assurer que le statut de chargement est mis à jour à la fin de l'opération
    }
    setIsCheck([]);
  };

  return (
    <>
      <main className="grow">
        <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
          {/* Page header */}
          <div className="sm:flex sm:justify-between sm:items-center mb-5">
            {/* Left: Title */}
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
                {element === "roles tache"
                  ? "Roles Tache"
                  : element === "roles plan"
                  ? "Roles Plans"
                  : "Types Priorités"}{" "}
              </h1>
            </div>

            {/* Right: Actions */}
            <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
              {/* Search form */}
              <SearchForm
                fetchData={fetchData}
                setKeyword={setKeyword}
                placeholder="Recherche..."
              />
              {/* Create invoice button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setFeedbackModalOpen(true);
                }}
                className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
              >
                <svg
                  className="fill-current shrink-0 xs:hidden"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                >
                  <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                </svg>
                <span className="max-xs:sr-only">Nouveau</span>
              </button>
            </div>
          </div>

          {/* More actions */}
          <div className="sm:flex sm:justify-between sm:items-center mb-5">
            {/* Left side */}

            {/* Right side */}
            <div className="grid grid-flow-col sm:auto-cols-max justify-end sm:justify-end gap-2">
              {/* Delete button */}
              {!deleteAllLoading ? (
                <DeleteButton
                  deleteAll={deleteAll}
                  selectedItems={selectedItems}
                />
              ) : (
                <SpinnerLoading />
              )}
            </div>
          </div>

          {/* Table */}
          <ServicesTable
            services={current}
            selectedItems={handleSelectedItems}
            refreshList={fetchData}
            element={element}
            handleSelectAll={handleSelectAll}
            selectAll={selectAll}
            isCheck={isCheck}
            setIsCheck={setIsCheck}
            setSelectAll={setSelectAll}
            servicesLength={datasResult?.length}
          />

          {/* Pagination */}
          <div className="mt-8">
            {datasResult?.length > 0 && (
              <PaginationClassic
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                totalItems={datasResult?.length}
                paginate={paginate}
              />
            )}
          </div>
        </div>
      </main>
    </>
  );
}

export default RolesAndTypesListing;

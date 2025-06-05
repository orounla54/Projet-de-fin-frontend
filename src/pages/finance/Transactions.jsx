import React, { useEffect, useState } from "react";

import Sidebar from "../../partials/Sidebar";
import Header from "../../partials/Header";
import DeleteButton from "../../partials/actions/DeleteButton";
import SearchForm from "../../partials/actions/SearchForm";
import DropdownTransaction from "../../components/DropdownTransaction";
import TransactionsTable from "../../partials/finance/TransactionsTable";
import PaginationClassic from "../../components/PaginationClassic";
import { baseURL, eventTypes } from "../../utils/DataFront/eventTypes";
import AuthService from "../../utils/Auth/AuthServices";
import SpinnerLoading from "../../components/SpinnerLoading";
import { useGetData } from "../../utils/Requests/RequestService";
import AddTachesEvenementsDefaut from "../../components/AddTachesEvenementsDefaut";
import axios from "axios";

function Transactions() {
  const baseUrl = baseURL;
  const enventTypes = eventTypes;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);

  const [taches, setTaches] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [enventypeSelected, setEnventypeSelected] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Construire dynamiquement l'URL en fonction de l'existence de `filter`
  const queryParams = new URLSearchParams({
    keyword: keyword,
    enventType: enventypeSelected,
  }).toString();

  const { data, loading, error, fetchData } = useGetData(
    enventypeSelected
      ? `tachesParDefaut/evenements?${queryParams}`
      : `tachesParDefaut/evenements?keyword=${keyword}`
  );

  // Calculer les indices pour la pagination
  const indexOfLastProject = currentPage * itemsPerPage;
  const indexOfFirstProject = indexOfLastProject - itemsPerPage;
  const currentsTaches = taches.slice(indexOfFirstProject, indexOfLastProject);

  // Fonction de changement de page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSelectedItems = (selectedItems) => {
    setSelectedItems([...selectedItems]);
  };

  const [selectAll, setSelectAll] = useState(false);
  const [isCheck, setIsCheck] = useState([]);

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    setIsCheck(!selectAll ? currentsTaches.map((item) => item.id) : []);
  };

  useEffect(() => {
    if (data) {
      setTaches(data);
    }
    console.log(taches);
  }, [data]);

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
            const response = await axios.delete(
              `${baseUrl}/tachesParDefaut/evenements/${id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
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
            <div className="absolute z-40 flex items-center justify-center w-full h-full bg-white dark:bg-gray-800">
              <SpinnerLoading />
            </div>
          ) : (
            <>
              {" "}
              {/* Content */}
              <div className="w-full px-4 py-8 mx-auto sm:px-6 lg:px-8 max-w-9xl">
                {/* Page header */}
                <div className="mb-4 sm:flex sm:justify-between sm:items-center md:mb-2">
                  {/* Left: Title */}
                  <div className="mb-4 sm:mb-0">
                    <h1 className="text-xl font-bold text-gray-800 md:text-2xl dark:text-gray-100">
                      Evenements Taches par defaut
                    </h1>
                  </div>

                  {/* Right: Actions */}
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

                    {/* Search form */}
                    <div className="hidden sm:block">
                      <SearchForm
                        setKeyword={setKeyword}
                        placeholder="Recherche..."
                        fetchData={fetchData}
                      />
                    </div>

                    {/* Export button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setFeedbackModalOpen(true);
                      }}
                      className="text-gray-100 bg-gray-900 btn hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
                    >
                      Nouveau
                    </button>
                    <AddTachesEvenementsDefaut
                      feedbackModalOpen={feedbackModalOpen}
                      setFeedbackModalOpen={setFeedbackModalOpen}
                      fetchData={fetchData}
                    />
                  </div>
                </div>

                {/* Filters */}
                <div className="my-8">
                  <ul className="flex flex-wrap -m-1">
                    <li className="m-1">
                      <button
                        onClick={() => setEnventypeSelected("")}
                        className={`inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border shadow-sm  ${
                          enventypeSelected === ""
                            ? "dark:bg-gray-100 text-white dark:text-gray-800  border-transparent bg-gray-900"
                            : " border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 shadow-sm bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                        } transition`}
                      >
                        Tout
                      </button>
                    </li>
                    {enventTypes.length > 0 && (
                      <>
                        {enventTypes.map((item, index) => (
                          <li className="m-1" key={item.id}>
                            <button
                              onClick={() => setEnventypeSelected(item.name)}
                              className={`inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border shadow-sm  ${
                                enventypeSelected === item.name
                                  ? "dark:bg-gray-100 text-white dark:text-gray-800  border-transparent bg-gray-900"
                                  : " border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 shadow-sm bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                              } transition`}
                            >
                              {item.name}
                            </button>
                          </li>
                        ))}
                      </>
                    )}
                  </ul>
                </div>

                {/* Table */}
                <TransactionsTable
                  selectedItems={handleSelectedItems}
                  fetchData={fetchData}
                  error={error}
                  taches={currentsTaches}
                  handleSelectAll={handleSelectAll}
                  selectAll={selectAll}
                  isCheck={isCheck}
                  setIsCheck={setIsCheck}
                  setSelectAll={setSelectAll}
                />

                {/* Pagination */}
                <div className="mt-8">
                  {taches.length > 0 && (
                      <PaginationClassic
                        currentPage={currentPage}
                        itemsPerPage={itemsPerPage}
                        totalItems={taches.length}
                        paginate={paginate}
                      />
                  )}
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default Transactions;

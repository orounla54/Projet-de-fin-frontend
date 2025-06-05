import React, { useCallback, useEffect, useState } from "react";

import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import SearchForm from "../partials/actions/SearchForm";
import DeleteButton from "../partials/actions/DeleteButton";
import PaginationClassic from "../components/PaginationClassic";

import { useGetData } from "../utils/Requests/RequestService";
import TypesTacheTable from "../components/TypesTacheTable";
import { useLocation, useNavigate } from "react-router-dom";
import Toast from "../components/Toast";
import { useSuccessMessage } from "../utils/SuccessContext";

function TypesTachesFilter() {
  const [typesTache, setTypesTache] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  const navigate = useNavigate();

  // Gestion du message de succès
  const { successMessage, setSuccessMessage } = useSuccessMessage();

  useEffect(() => {
    if (successMessage) {
      setTimeout(() => setSuccessMessage(""), 3000); // Effacer le message après 3 secondes
    }
  }, [successMessage]);


  const [toastSuccessOpen, setToastSuccessOpen] = useState(true);

  const { data, loading, error, fetchData } = useGetData(
    `search/typesTaches?keyword=${keyword}`
  );

  useEffect(() => {
    if (data) {
      setTypesTache(data);
      console.log(data);
    }
  }, [data]);

  const indexOfLastProject = currentPage * itemsPerPage;
  const indexOfFirstProject = indexOfLastProject - itemsPerPage;
  const currentProjects = typesTache?.slice(
    indexOfFirstProject,
    indexOfLastProject
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const navigateAddTypesTaches = () => {
    navigate(`/nouveau/typetaches`);
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  // Utiliser useCallback pour optimiser la fonction de sélection
  const handleSelectedItems = useCallback((selectedItems) => {
    setSelectedItems([...selectedItems]);
  }, []);

  const deleteAll = (selectedItems) => {
    selectedItems.map((i) => {
      console.log(i);
    });
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
                <h1 className="text-xl font-bold text-gray-800 md:text-2xl dark:text-gray-100">
                  Matrice des types de taches
                </h1>
              </div>

              {/* Right: Actions */}
              <div className="grid justify-start grid-flow-col gap-2 sm:auto-cols-max sm:justify-end">
                {/* Search form */}
                <SearchForm
                  setKeyword={setKeyword}
                  placeholder="Recherche..."
                  fetchData={() => {

                  }}
                />
                {/* Create invoice button */}
                <button
                  onClick={() => navigateAddTypesTaches()}
                  className="text-gray-100 bg-gray-900 btn md:w-full hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
                >
                  <span className="ml-1 text-xs">Nouveau type taches</span>
                </button>
              </div>
            </div>

            {/* More actions */}
            <div className="mb-5 sm:flex sm:justify-between sm:items-center">
              {/* Left side */}
              <div className="mb-4 sm:mb-0"></div>

              {/* Right side */}
              <div className="grid justify-start grid-flow-col gap-2 sm:auto-cols-max sm:justify-end">
                {/* Delete button */}
                {/* <DeleteButton
                  deleteAll={deleteAll}
                  selectedItems={selectedItems}
                /> */}
              </div>
            </div>

            {/* Table */}
            <TypesTacheTable
              loading={loading}
              typesTache={currentProjects}
              selectedItems={handleSelectedItems}
              error={error}
              refreshList={fetchData}
            />

            {/* Pagination */}
            <div className="mt-8">
            {typesTache.length > 0 && (
              <PaginationClassic
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                totalItems={typesTache.length}
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

export default TypesTachesFilter;

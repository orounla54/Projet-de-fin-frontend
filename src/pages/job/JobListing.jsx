import React, { useEffect, useState } from "react";

import Sidebar from "../../partials/Sidebar";
import Header from "../../partials/Header";
import JobSidebar from "../../partials/job/JobSidebar";
import JobListItem from "../../partials/job/JobListItem";
import PaginationNumeric from "../../components/PaginationNumeric";

import { useGetData } from "../../utils/Requests/RequestService";
import SpinnerLoading from "../../components/SpinnerLoading";
import ButtonAddProjet from "../../components/ButtonAddProjet";
import Toast from "../../components/Toast";
import { useSuccessMessage } from "../../utils/SuccessContext";
import NoDataResponse from "../../components/NoDataResponse";

function JobListing() {
  const [projets, setProjets] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const { data, loading, error } = useGetData(
    `search/projets?keyword=${keyword}`
  );

  const [itemClicked, setItemClicked] = useState(0);

  //tache selected
  const {
    data: projet,
    loading: projetLoading,
    error: projetErr,
  } = useGetData(itemClicked ? `projets/${itemClicked}` : "");

  // Gestion du message de succès
  const { successMessage, setSuccessMessage } = useSuccessMessage();
  const [toastSuccessOpen, setToastSuccessOpen] = useState(true);

  useEffect(() => {
    if (successMessage) {
      setTimeout(() => setSuccessMessage(""), 3000); // Effacer le message après 3 secondes
    }
  }, [successMessage]);

  useEffect(() => {
    setCurrentPage(1);
    if (data) {
      setProjets(data);
      setItemClicked(data.length > 0 ? data[0].id : data.id);
      // console.log(projets);
    }
  }, [data]);

  const indexOfLastProject = currentPage * itemsPerPage;
  const indexOfFirstProject = indexOfLastProject - itemsPerPage;
  const currentProjects = projets.slice(
    indexOfFirstProject,
    indexOfLastProject
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const [sidebarOpen, setSidebarOpen] = useState(false);

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
                <div className="absolute left-0 -bot-20 z-60 ">
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
                  Projets
                </h1>
              </div>

              {/* Post a job button */}
              <div>
                <ButtonAddProjet />
              </div>
            </div>

            {/* Page content */}
            <div className="flex flex-col space-y-10 sm:flex-row lg:flex-row sm:space-y-0 sm:space-x-6 mt-9">
              {/* Sidebar */}
              <JobSidebar projet={projet} />

              {/* Content */}
              <div className="w-full">
                {/* Search form */}
                <div className="mb-5">
                  <form className="relative">
                    <label htmlFor="job-search" className="sr-only">
                      Search
                    </label>
                    <input
                      id="job-search"
                      className="w-full bg-white form-input pl-9 dark:bg-gray-800"
                      type="search"
                      placeholder="Rechercher un projet…"
                      onChange={(e) => setKeyword(e.target.value)}
                    />
                    <button
                      className="absolute inset-0 right-auto group"
                      disabled
                    >
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
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm italic text-gray-500 dark:text-gray-400">
                    {projets.length} projets trouvés
                  </div>
                </div>
                {/* Projets */}
                <div className="space-y-3">
                  {loading && <SpinnerLoading />}
                  {error && (
                    <li className="p-2 text-red-500 dark:text-red-400">
                      Une erreur s'est produite au niveau du serveur:{" "}
                      {error.message}
                    </li>
                  )}
                  {projets.length > 0 ? (
                    <>
                      {Array.isArray(currentProjects) &&
                        currentProjects.map((projet) => (
                          <JobListItem
                            key={projet.id}
                            id={projet.id}
                            libelle={projet.libelle}
                            description={projet.description}
                            status={projet.status}
                            dateInscription={projet.dateInscription}
                            deadline={projet.deadline}
                            newProjet={projet.newProjet}
                            setItemClicked={setItemClicked}
                            itemClicked={itemClicked}
                          />
                        ))}
                    </>
                  ) : (
                    <NoDataResponse keyword={keyword} />
                  )}

                </div>
                {/* Pagination */}
                <div className="mt-6">
                  {projets.length > 0 && (
                    <PaginationNumeric
                      itemsPerPage={itemsPerPage}
                      totalItems={projets.length}
                      paginate={paginate}
                      currentPage={currentPage}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default JobListing;

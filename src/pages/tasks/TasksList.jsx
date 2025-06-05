import React, { useEffect, useState } from "react";
import Sidebar from "../../partials/Sidebar";
import Header from "../../partials/Header";
import { useGetData } from "../../utils/Requests/RequestService";
import SpinnerLoading from "../../components/SpinnerLoading";
import { Link, useNavigate } from "react-router-dom";
import { useSuccessMessage } from "../../utils/SuccessContext";
import Toast from "../../components/Toast";
import TachesRespItems from "../../components/TachesRespItems";

function TasksList() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [taches, setTaches] = useState([]);
  const navigate = useNavigate();

  const [view, setView] = useState("tacheResponsable");
  const [enpointSwitch, setEnpointSwitch] = useState("");
  const [loadingSwitch, setLoadingSwitch] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [search, setSearch] = useState(false)

  const { data, loading, error, fetchData } = useGetData(`private/taches${enpointSwitch}?keyword=${keyword}`);

  const switchTache = async () => {
    await fetchData();
    setLoadingSwitch(true);
    if (view === "tacheResponsable") {
      setEnpointSwitch("/contributeur");
      setView("tacheContributeur");
    } else if (view === "tacheContributeur") {
      setEnpointSwitch("/collaborateur");
      setView("tacheCollaborateur");
    } else if (view === "tacheCollaborateur") {
      setEnpointSwitch("/beneficiaire");
      setView("tacheBeneficiaire");
    } else if (view === "tacheBeneficiaire") {
      setEnpointSwitch("");
      setView("tacheResponsable");
    }
    for (let index = 0; index < 1; index++) {
      
    }
    setLoadingSwitch(false);
  };

  useEffect(() => {
    if (data) {
      setTaches(data);
    }
    console.log(taches);
  }, [data]);

  // Gestion du message de succès
  const { successMessage, setSuccessMessage } = useSuccessMessage();
  const [toastSuccessOpen, setToastSuccessOpen] = useState(true);

  useEffect(() => {
    if (successMessage) {
      setTimeout(() => setSuccessMessage(""), 3000); // Effacer le message après 3 secondes
    }
  }, [successMessage]);

  // Filtrer les tâches par statut
  const tasksByStatus = {
    "Non démaré": taches.filter((task) => task.status === "Non-démarré"),
    "En cours": taches.filter((task) => task.status === "En-cours"),
    "Terminé": taches.filter((task) => task.status === "Terminé"),
  };

  const handleNavigate = () => {
    navigate(`/nouvelle/taches`);
  };

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-x-hidden overflow-y-auto">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="w-full px-4 py-8 mx-auto sm:px-6 lg:px-8 max-w-9xl">
            <div className="max-w-3xl mx-auto">
              <div className="relative mb-8 sm:flex sm:justify-between sm:items-center">
                {successMessage && (
                  <div className="absolute top-15 left-18 z-60 ">
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
                  <h1 className="text-xl font-bold text-gray-800 md:text-3xl dark:text-gray-100">
                    Vos taches {view === "tacheResponsable" ? "responsables" :
                      view === "tacheContributeur" ? "contributeur" :
                        view === "tacheCollaborateur" ? "collaborateur" :
                          view === "tacheBeneficiaire" ? "beneficiaire" : ""
                    }
                  </h1>
                </div>
                <div className="grid justify-start grid-flow-col gap-2 sm:auto-cols-max sm:justify-end">

                  <button
                    onClick={() => handleNavigate()}
                    className="text-gray-100 bg-gray-900 btn hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
                  >
                    Ajouter une tache
                  </button>
                  {search && (
                    <form className="relative">
                      <input
                        id="action-search"
                        onChange={async(e)=>{ 
                          setKeyword(e.target.value)
                          await fetchData();
                        }}
                        className="form-input text-xs pl-9 py-1.75 dark:bg-gray-800 focus:border-gray-300 w-full"
                        type="search"
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
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M7 14c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zM7 2C4.243 2 2 4.243 2 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5z" />
                          <path d="M15.707 14.293L13.314 11.9a8.019 8.019 0 01-1.414 1.414l2.393 2.393a.997.997 0 001.414 0 .999.999 0 000-1.414z" />
                        </svg>
                      </button>
                    </form>
                  )}
                  <button
                    className="btn px-2.5 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 disabled:border-gray-200 dark:disabled:border-gray-700 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-400 dark:disabled:text-gray-600 disabled:cursor-not-allowed"
                    onClick={() => {
                      setSearch(!search);
                    }}
                  >
                    <span className="sr-only">Next month</span>
                    <wbr />
                    <svg
                      className="text-gray-400 fill-current dark:text-gray-500"
                      width="16"
                      height="16"
                      viewBox="0 0 20 20"
                    >
                      <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clipRule="evenodd" />
                    </svg>
                  </button>

                  <button
                    className="btn px-2.5 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 disabled:border-gray-200 dark:disabled:border-gray-700 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-400 dark:disabled:text-gray-600 disabled:cursor-not-allowed"
                    onClick={() => {
                      setKeyword("");
                      setSearch(false);
                      switchTache();
                    }}
                  >
                    <span className="sr-only">Next month</span>
                    <wbr />
                    <svg
                      className="text-gray-400 fill-current dark:text-gray-500"
                      width="16"
                      height="16"
                      viewBox="0 0 18 18"
                    >
                      <path
                        fillRule="evenodd"
                        d="M2.24 6.8a.75.75 0 0 0 1.06-.04l1.95-2.1v8.59a.75.75 0 0 0 1.5 0V4.66l1.95 2.1a.75.75 0 1 0 1.1-1.02l-3.25-3.5a.75.75 0 0 0-1.1 0L2.2 5.74a.75.75 0 0 0 .04 1.06Zm8 6.4a.75.75 0 0 0-.04 1.06l3.25 3.5a.75.75 0 0 0 1.1 0l3.25-3.5a.75.75 0 1 0-1.1-1.02l-1.95 2.1V6.75a.75.75 0 0 0-1.5 0v8.59l-1.95-2.1a.75.75 0 0 0-1.06-.04Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Gestion des états de chargement et d'erreur */}
              {loading && <SpinnerLoading />}
              {loadingSwitch && <SpinnerLoading />}
              {error && (
                <p className="text-xs text-center text-red-500">
                  Erreur lors de la récupération des tâches : {error.message}
                </p>
              )}
              {taches.length === 0 && !loading && !error && (
                <p>Aucune tâche disponible.</p>
              )}

              {/* Affichage des groupes de tâches */}
              {!(loading || loadingSwitch) && Object.entries(tasksByStatus).map(
                ([status, tasks]) =>
                  tasks.length > 0 && (
                    <div key={status} className="mb-12">
                      <h2 className="mb-4 font-semibold text-gray-800 truncate grow dark:text-gray-100">
                        {status}{" "}
                        <span className="text-violet-500">
                          ({tasks.length})
                        </span>
                      </h2>
                      <div className="space-y-2">
                        {tasks.slice(0, 7).map((task) => (
                          <TachesRespItems key={task.id} task={task} />
                        ))}
                      </div>
                    </div>
                  )
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default TasksList;

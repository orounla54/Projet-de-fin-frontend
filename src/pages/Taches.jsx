import React, { use, useEffect, useState } from "react";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import CartItems from "../partials/ecommerce/CartItems";
import PaginationClassic from "../components/PaginationClassic";
import { useGetData, usePutData } from "../utils/Requests/RequestService";
import { useNavigate } from "react-router-dom";
import { useSuccessMessage } from "../utils/SuccessContext";
import Toast from "../components/Toast";
import DateRefactor from "../components/DateRefactor";
import SpinnerLoading from "../components/SpinnerLoading";

function Taches() {
  
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [active, setActive] = useState(1);
  const [activeEndpoint, setActiveEndpoint] = useState("");
  const [taches, setTaches] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [itemClicked, setItemClicked] = useState(0);
  const [tacheSelected, setTacheSelected] = useState({});
  const [loadingSwitch, setLoadingSwitch] = useState(false);


  const [privates, setPrivate] = useState(null);
  const [urgent, setUrgent] = useState(null);
  const [important, setImportant] = useState(null);
  

  const [totalItems, setTotalItems] = useState(null);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTaches = taches.slice(indexOfFirstItem, indexOfLastItem);

  // Gestion du message de succès
  const { successMessage, setSuccessMessage } = useSuccessMessage();
  const [toastSuccessOpen, setToastSuccessOpen] = useState(true);

  useEffect(() => {
    if (successMessage) {
      setTimeout(() => setSuccessMessage(""), 3000); // Effacer le message après 3 secondes
    }
  }, [successMessage]);

  const navigateAddTaches = () => {
    navigate("/nouvelle/taches");
  };

  const handleActive = (activeValue) => {
    setLoadingSwitch(true)
    setActive(activeValue);
    switch (activeValue) {
      case 2:
        setActiveEndpoint("private=1");
        break;
      case 3:
        setActiveEndpoint("important=1");
        break;
      case 4:
        setActiveEndpoint("urgent=1");
        break;
      default:
        setActiveEndpoint("");
    }
    setLoadingSwitch(false)
  };

  //taches liste
  const {
    data,
    loading,
    error,
    fetchData: fetchDataListe,
  } = useGetData(`taches/getAllforResp?${activeEndpoint}`);

  useEffect(() => {
    setCurrentPage(1);
    if (data) {
      setTaches(data);
      setItemClicked(data.length > 0 ? data[0].id : 0);
      console.log(data);
    }
  }, [data]);

  //tache selected
  const {
    data: tache,
    loading: tacheLoading,
    error: tacheErr,
    fetchData: fetchDataTacheView,
  } = useGetData(itemClicked ? `taches/${itemClicked}` : "");

  useEffect(() => {
    if (tache && Object.keys(tache).length > 0) {
      try {
        setTacheSelected(tache);
        setImportant(tache.important);
        setUrgent(tache.urgent);
        setPrivate(tache.private);
      } catch (error) {
        console.log("erreur lors de la récupération des données");
      }
    }
    // console.log(tacheSelected);
  }, [tache]);

  useEffect(() => {
    setTotalItems(taches.length);
  }, [taches]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [totalItems]);

  const statusColor = (status) => {
    switch (status) {
      case "Non-démaré":
        return "text-gray-400 dark:text-gray-100";
      case "En-cours":
        return "text-blue-300";
      case "Terminé":
        return "text-green-600";
      default:
        return "text-white bg-slate-400";
    }
  };

  //appel de la methode update pour cha,ger les etats des view
  const {
    response: responseUpdate,
    error: errorUpdate,
    loading: loadingUpdate,
    putData,
  } = usePutData(`taches/${tacheSelected.id}`);

  const handleUpdateState = async (contexte) => {
    // Création d'un objet pour la mise à jour dynamique
    const newState = {
      important: contexte === "important" ? (important ? 0 : 1) : important,
      urgent: contexte === "urgent" ? (urgent ? 0 : 1) : urgent,
      private: contexte === "private" ? (privates ? 0 : 1) : privates,
    };
  
    // Mise à jour des états locaux
    if (contexte === "important") setImportant(newState.important);
    if (contexte === "urgent") setUrgent(newState.urgent);
    if (contexte === "private") setPrivate(newState.private);
  
    // Envoi des données mises à jour via la requête PUT
    await putData({ [contexte]: newState[contexte] });
  
    // Mise à jour de la liste des tâches
    setTaches(
      taches.map((tache) =>
        tache.id === tacheSelected.id
          ? { ...tache, [contexte]: newState[contexte] }
          : tache
      )
    );
  
    // Rafraîchir les données
    await fetchDataTacheView();
  };
  

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="relative flex flex-col flex-1 overflow-x-hidden overflow-y-auto">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="relative grow">
          {loading || tacheLoading ? (
            <div className="absolute z-40 flex items-center justify-center w-full h-full bg-white dark:bg-gray-900">
              <SpinnerLoading />
            </div>
          ) : (
            <>
              {" "}
              <div className="px-4 py-8 sm:px-6 lg:px-8">
                <div className="flex flex-col justify-between mx-auto lg:flex-row lg:space-x-8 xl:space-x-16">
                  <div className="mb-6 lg:mb-0 lg:w-8/12">
                    <div className="flex items-center justify-between gap-6 mb-3 space-x-4">
                      <header className="mb-2">
                        {successMessage && (
                          <div className="absolute top-8 left-8 z-60 ">
                            <Toast
                              type="success"
                              open={toastSuccessOpen}
                              setOpen={setToastSuccessOpen}
                            >
                              {successMessage}
                            </Toast>
                          </div>
                        )}
                        <h1 className="mb-2 text-2xl font-bold text-gray-800 md:text-3xl dark:text-gray-100">
                          Taches
                        </h1>
                        <div className="flex space-x-2 text-sm font-medium text-gray-400 dark:text-gray-500">
                          <div className="mb-5">
                            <ul className="flex flex-wrap -m-1">
                              {[
                                { label: "Tout", id: 1 },
                                { label: "Privées", id: 2 },
                                { label: "Important", id: 3 },
                                { label: "Urgent", id: 4 },
                              ].map(({ label, id }) => (
                                <li className="m-1" key={id}>
                                  <button
                                    onClick={() => {
                                      handleActive(id);
                                    }}
                                    className={`inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 shadow-sm transition ${
                                      active === id
                                        ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-800"
                                        : "border border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                                    }`}
                                  >
                                    {label}
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </header>
                      <button
                        onClick={navigateAddTaches}
                        className="text-xs text-gray-100 bg-gray-900 btn hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
                      >
                        Nouvelle tâche
                      </button>
                    </div>

                    <CartItems
                      taches={currentTaches}
                      loading={loading}
                      loadingSwitch={loadingSwitch}
                      error={error}
                      setItemClicked={setItemClicked}
                      itemClicked={itemClicked}
                      tacheSelected={tacheSelected}
                      tacheLoading={tacheLoading}
                    />

                    <div className="mt-8">
                      {taches.length > 0 && (
                        <PaginationClassic
                          currentPage={currentPage}
                          itemsPerPage={itemsPerPage}
                          totalItems={totalItems}
                          paginate={handlePageChange}
                        />
                      )}
                    </div>
                  </div>

                  {taches.length > 0 ? (
                    <div className="lg:fixed lg:right-8 lg:top-28">
                      <div className="p-5 bg-white shadow-sm dark:bg-gray-800 rounded-xl lg:w-76 xl:w-80">
                        <div className="mb-2 font-semibold text-gray-800 dark:text-gray-100"></div>
                        <ul className="mb-4">
                          <li className="flex justify-between w-full py-3 text-xs border-b border-gray-200 dark:border-gray-700/60">
                            <div>Etat</div>
                            <div
                              className={`font-bold text-xs ${statusColor(
                                tacheSelected.status
                              )}`}
                            >
                              {tacheSelected.status
                                ? tacheSelected.status
                                : "Aucun etat enregistré"}
                            </div>
                          </li>
                          <li className="flex justify-between w-full py-3 text-xs border-b border-gray-200 dark:border-gray-700/60">
                            <div>Date debut</div>
                            <div className="text-xs font-medium text-gray-800 dark:text-gray-100">
                              {tacheSelected.dateDebut ? (
                                <DateRefactor date={tacheSelected.dateDebut} />
                              ) : (
                                "Aucune date enregistrée"
                              )}
                            </div>
                          </li>
                          <li className="flex justify-between w-full py-3 text-xs border-b border-gray-200 dark:border-gray-700/60">
                            <div>Date Fin</div>
                            <div className="text-xs font-medium text-gray-800 dark:text-gray-100">
                              {tacheSelected.dateFIn ? (
                                <DateRefactor date={tacheSelected.dateFIn} />
                              ) : (
                                "Aucune date enregistrée"
                              )}
                            </div>
                          </li>
                          <li className="flex justify-between w-full py-3 text-xs border-b border-gray-200 dark:border-gray-700/60">
                            <div>Deadline</div>
                            <div className="text-xs font-medium text-gray-800 dark:text-gray-100">
                              {tacheSelected.deadline ? (
                                <DateRefactor date={tacheSelected.deadline} />
                              ) : (
                                "Aucune date enregistrée"
                              )}
                            </div>
                          </li>
                          <li className="flex justify-between w-full py-3 text-xs border-b border-gray-200 dark:border-gray-700/60">
                            <div>Categorie</div>
                            <div className="text-xs font-medium text-gray-800 dark:text-gray-100">
                              {tacheSelected.categorie
                                ? tacheSelected.categorie
                                : "Aucune categorie enregistrée"}
                            </div>
                          </li>
                        </ul>
                        <div className="mb-6">
                          <div className="flex items-center justify-center gap-1">
                            {/* Importance */}
                            {tacheSelected.private ? (
                              <button
                                onClick={() => {
                                  handleUpdateState("private");
                                }}
                                title="Privée"
                                className="flex items-center justify-center text-xs"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  className="size-5 fill-blue-400"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M15.75 1.5a6.75 6.75 0 0 0-6.651 7.906c.067.39-.032.717-.221.906l-6.5 6.499a3 3 0 0 0-.878 2.121v2.818c0 .414.336.75.75.75H6a.75.75 0 0 0 .75-.75v-1.5h1.5A.75.75 0 0 0 9 19.5V18h1.5a.75.75 0 0 0 .53-.22l2.658-2.658c.19-.189.517-.288.906-.22A6.75 6.75 0 1 0 15.75 1.5Zm0 3a.75.75 0 0 0 0 1.5A2.25 2.25 0 0 1 18 8.25a.75.75 0 0 0 1.5 0 3.75 3.75 0 0 0-3.75-3.75Z"
                                    clipRule="evenodd"
                                  />
                                </svg>{" "}
                                Privée
                              </button>
                            ) : (
                              <button
                                title="publique"
                                className="flex items-center justify-center text-xs"
                                onClick={() => {
                                  handleUpdateState("private");
                                }}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  className="size-5 fill-blue-400"
                                >
                                  <path d="M15.75 8.25a.75.75 0 0 1 .75.75c0 1.12-.492 2.126-1.27 2.812a.75.75 0 1 1-.992-1.124A2.243 2.243 0 0 0 15 9a.75.75 0 0 1 .75-.75Z" />
                                  <path
                                    fillRule="evenodd"
                                    d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM4.575 15.6a8.25 8.25 0 0 0 9.348 4.425 1.966 1.966 0 0 0-1.84-1.275.983.983 0 0 1-.97-.822l-.073-.437c-.094-.565.25-1.11.8-1.267l.99-.282c.427-.123.783-.418.982-.816l.036-.073a1.453 1.453 0 0 1 2.328-.377L16.5 15h.628a2.25 2.25 0 0 1 1.983 1.186 8.25 8.25 0 0 0-6.345-12.4c.044.262.18.503.389.676l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 0 1-1.161.886l-.143.048a1.107 1.107 0 0 0-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 0 1-1.652.928l-.679-.906a1.125 1.125 0 0 0-1.906.172L4.575 15.6Z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                Publique
                              </button>
                            )}

                            {/* Confidentialité */}
                            {tacheSelected.important ? (
                              <button
                                title="Important"
                                className="flex items-center justify-center text-xs"
                                onClick={() => {
                                  handleUpdateState("important");
                                }}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  className="size-5 fill-yellow-500"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z"
                                    clipRule="evenodd"
                                  />
                                </svg>{" "}
                                Important
                              </button>
                            ) : (
                              <button
                                title="Pas important"
                                className="flex items-center justify-center text-xs"
                                onClick={() => {
                                  handleUpdateState("important");
                                }}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  className="size-5 fill-yellow-500"
                                >
                                  <path d="M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-18-18ZM20.25 5.507v11.561L5.853 2.671c.15-.043.306-.075.467-.094a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93ZM3.75 21V6.932l14.063 14.063L12 18.088l-7.165 3.583A.75.75 0 0 1 3.75 21Z" />
                                </svg>{" "}
                                Pas important
                              </button>
                            )}

                            {/* Urgence */}
                            {tacheSelected.urgent ? (
                              <button
                                title="Urgent"
                                className="flex items-center justify-center text-xs"
                                onClick={() => {
                                  handleUpdateState("urgent");
                                }}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  className="w-6 h-6 fill-orange-500"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18Zm1 5a1 1 0 1 0-2 0v4a1 1 0 1 0 2 0V8Zm-1 8.25a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5Z"
                                    clipRule="evenodd"
                                  />
                                </svg>{" "}
                                Urgent
                              </button>
                            ) : (
                              <button
                                title="Pas Urgent"
                                className="flex items-center justify-center text-xs"
                                onClick={() => {
                                  handleUpdateState("urgent");
                                }}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  className="size-5 fill-violet-400"
                                >
                                  <path d="M5.566 4.657A4.505 4.505 0 0 1 6.75 4.5h10.5c.41 0 .806.055 1.183.157A3 3 0 0 0 15.75 3h-7.5a3 3 0 0 0-2.684 1.657ZM2.25 12a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3v-6ZM5.25 7.5c-.41 0-.806.055-1.184.157A3 3 0 0 1 6.75 6h10.5a3 3 0 0 1 2.683 1.657A4.505 4.505 0 0 0 18.75 7.5H5.25Z" />
                                </svg>{" "}
                                Pas urgent
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="lg:fixed lg:right-8 lg:top-28">
                        <div className="p-5 bg-white shadow-sm dark:bg-gray-800 rounded-xl lg:w-76 xl:w-80">
                          <div className="mb-2 font-semibold text-gray-800 dark:text-gray-100">
                            Aucun element selectionner
                          </div>
                          <ul className="mb-4">
                            <li className="flex justify-between w-full py-3 text-xs border-b border-gray-200 dark:border-gray-700/60"></li>
                            <li className="flex justify-between w-full py-3 text-xs border-b border-gray-200 dark:border-gray-700/60"></li>
                            <li className="flex justify-between w-full py-3 text-xs border-b border-gray-200 dark:border-gray-700/60"></li>
                            <li className="flex justify-between w-full py-3 text-xs border-b border-gray-200 dark:border-gray-700/60"></li>
                          </ul>
                        </div>
                      </div>
                    </>
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

export default Taches;

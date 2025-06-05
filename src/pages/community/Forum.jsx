import React, { use, useEffect, useState } from "react";

import Sidebar from "../../partials/Sidebar";
import Header from "../../partials/Header";
import ForumLeftContent from "../../partials/community/ForumLeftContent";
import ForumEntries from "../../partials/community/ForumEntries";
import ForumRightContent from "../../partials/community/ForumRightContent";
import { useSuccessMessage } from "../../utils/SuccessContext";
import Toast from "../../components/Toast";
import TasksGroups from "../../partials/tasks/TasksGroups";
import Task01 from "../../partials/tasks/Task01";
import Task08 from "../../partials/tasks/Task08";
import { useGetData } from "../../utils/Requests/RequestService";
import SpinnerLoading from "../../components/SpinnerLoading";
import { Link } from "react-router-dom";
import TachesEnRetard from "../utility/TachesEnRetard";
import IndicateurDP from "../IndicateurDP";

function Forum() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  let [active, setActive] = useState(1);

  // Gestion du message de succès
  const { successMessage, setSuccessMessage } = useSuccessMessage();
  const [toastSuccessOpen, setToastSuccessOpen] = useState(true);
  const [page, setPage] = useState("Accueil");

  const [typeTaches, setTypeTaches] = useState([]);

  const [tachesToday, setTachesToday] = useState([]);
  const [tachesEncours, setTachesEncours] = useState([]);
  const [tachesTerminé, setTachesTerminé] = useState([]);
  const [tachesIU, setTachesIU] = useState([]);
  const [tachesEnRetard, setTachesEnRetard] = useState([]);

  const [eventsToday, setEventsToday] = useState([]);
  const [toggleViewTaskDay, setToggleViewTaskDay] = useState(true);
  const [sousPage, setSousPage] = useState("Accueil-All");

  //recuperation de la date d'aujourdhui
  // Obtenir la date du jour au format 'YYYY-MM-DD'
  const today = new Date().toISOString().split("T")[0]; // Exemple de sortie : '2024-06-11'

  const formattedDate = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(today));

  useEffect(() => {
    if (successMessage) {
      setTimeout(() => setSuccessMessage(""), 3000); // Effacer le message après 3 secondes
    }
  }, [successMessage]);

  const status = [
    { id: 1, libelle: "Non-démaré" },
    { id: 2, libelle: "En-cours" },
    { id: 3, libelle: "Terminé" },
  ];

  const toggleStatus = (id) => {
    setActive(id);
  };

  // Construire dynamiquement l'URL en fonction de l'existence de `filter`
  const conditionSousPage =
    sousPage !== "Accueil-All" && sousPage !== "Accueil-EnRetard";
  const queryParamsTypeTache = new URLSearchParams({
    idTypesTache: conditionSousPage && sousPage,
  }).toString();

  // get tache today
  const {
    data: dataT,
    loading: loadingT,
    error: errorT,
  } = useGetData(
    `filter/taches?dateDebut=${today}&${
      conditionSousPage && queryParamsTypeTache
    }`
  );

  useEffect(() => {
    if (dataT) {
      setTachesToday(dataT);
    }
    // console.log(tachesToday);
  });

  //get tache en cours
  const {
    data: dataE,
    loading: loadingE,
    error: errorE,
  } = useGetData(
    `filter/taches?idStatusTache=${2}&${
      conditionSousPage && queryParamsTypeTache
    }`
  );

  useEffect(() => {
    if (dataE) {
      setTachesEncours(dataE);
    }
    // console.log("encours");
    // console.log(tachesEncours);
  }, [dataE]);

  // get tache terminé
  const {
    data: dataTerminé,
    loading: loadingTerminé,
    error: errorTerminé,
  } = useGetData(
    `filter/taches?idStatusTache=${3}&${
      conditionSousPage && queryParamsTypeTache
    }`
  );

  useEffect(() => {
    if (dataTerminé) {
      setTachesTerminé(dataTerminé);
    }
  }, [dataTerminé]);

  // Construire event today dynamiquement l'URL en fonction de l'existence de `filter`
  const queryParams = new URLSearchParams({
    keyword: "",
    ...{ eventStart: today },
    ...{ croissant: true },
  }).toString();

  // get evenements today
  const {
    data: dataEventToday,
    loading: loadingTEventToday,
    error: errorEventToday,
  } = useGetData(`filter/evenements/occurence?${queryParams}`);

  useEffect(() => {
    if (dataEventToday) {
      const seen = new Map();

      // Parcourir pour trouver la première eventStart et la dernière eventEnd pour chaque occurenceEvent
      dataEventToday.forEach((event) => {
        const eventStartISO = new Date(event.eventStart).toISOString();
        const eventEndISO = new Date(event.eventEnd).toISOString();

        // Si l'occurenceEvent n'est pas encore dans le Map, on l'ajoute
        if (!seen.has(event.occurenceEvent)) {
          seen.set(event.occurenceEvent, {
            ...event,
            eventStart: eventStartISO, // Première occurenceStart
            eventEnd: eventEndISO, // Dernière occurenceEnd
          });
        } else {
          const currentEvent = seen.get(event.occurenceEvent);

          // Mettre à jour la première eventStart si nécessaire (pour le premier événement)
          if (new Date(event.eventStart) < new Date(currentEvent.eventStart)) {
            currentEvent.eventStart = eventStartISO;
          }

          // Mettre à jour la dernière eventEnd si nécessaire (pour le dernier événement)
          if (new Date(event.eventEnd) > new Date(currentEvent.eventEnd)) {
            currentEvent.eventEnd = eventEndISO;
          }
        }
      });
      // Créer le tableau final des événements uniques avec la première eventStart et la dernière eventEnd
      const uniqueEvents = Array.from(seen.values());

      // Mettre à jour l'état avec les événements uniques
      setEventsToday(uniqueEvents);
    }
    // Vous pouvez maintenant observer `eventsToday` dans un useEffect à part pour voir les changements
  }, [dataEventToday]);

  // Construire dynamiquement l'URL en fonction de l'existence de `filter`
  const queryParams1 = new URLSearchParams({
    keyword: "",
    important: true,
    urgent: true,
  }).toString();

  // get tache today
  const {
    data: dataIU,
    loading: loadingIU,
    error: errorIU,
  } = useGetData(`filter/taches?${queryParams1}`);

  useEffect(() => {
    if (dataIU) {
      // Filtrer les tâches avec un IdStatusTache différent de 3
      const filteredTaches = dataIU.filter(
        (tache) => tache.status !== "Terminé"
      );
      setTachesIU(filteredTaches);
    }
  }, [dataIU]);

  //get all type de taches
  const {
    data: dataTT,
    loading: loadingTT,
    error: errorTT,
  } = useGetData(`/typesTaches`);

  useEffect(() => {
    if (dataTT) {
      setTypeTaches(dataTT);
    }
  }, [dataTT]);

  //get taches rentard
  const {
    data: dataTR,
    loading: loadingTR,
    error: errorTR,
  } = useGetData(`filter/taches`);

  useEffect(() => {
    if (dataTR) {
      setTachesEnRetard(
        dataTR.filter(
          (tache) => tache.enRetard === 1 && tache.status !== "Terminé"
        )
      );
    }
  }, [dataTR]);

  const isLoading =
    loadingT ||
    loadingE ||
    loadingTerminé ||
    loadingTEventToday ||
    loadingIU ||
    loadingTT ||
    loadingTR;
  return (
    <div className="flex h-[100dvh] overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-x-hidden overflow-y-auto">
        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="relative grow">
          {isLoading ? (
            <div className="absolute z-40 flex items-center justify-center w-full h-full bg-white dark:bg-gray-900">
              <SpinnerLoading />
            </div>
          ) : (
            <></>
          )}
          <div className="w-full px-4 py-8 mx-auto sm:px-6 lg:px-8 md:py-0 max-w-9xl ">
            <div className="xl:flex ">
              {/* Left + Middle content */}
              <div className="flex-1 md:flex ">
                {/* Left content */}
                <ForumLeftContent
                  formattedDate={
                    formattedDate.charAt(0).toUpperCase() +
                    formattedDate.slice(1)
                  }
                  page={page}
                  setPage={setPage}
                />

                {/* Middle content */}
                {page === "Projets" ? (
                  <>
                    <div className="relative flex-1 md:ml-8 xl:mx-4 2xl:mx-8">
                      {successMessage && (
                        <div className="absolute left-0 -top-2 z-60 ">
                          <Toast
                            type="success"
                            open={toastSuccessOpen}
                            setOpen={setToastSuccessOpen}
                          >
                            {successMessage}
                          </Toast>
                        </div>
                      )}
                      <div className="md:py-8">
                        {/* Buttons group */}
                        <div className="mb-4">
                          <div className="flex flex-wrap w-full -space-x-px">
                            {status.map((item) => (
                              <button
                                key={item.id}
                                onClick={() => {
                                  toggleStatus(item.id);
                                }}
                                className={`btn grow bg-white dark:bg-gray-800 hover:text-violet-600 transition-colors duration-300 border-gray-200 dark:border-gray-700/60 ${
                                  active === item.id
                                    ? "text-violet-500 rounded-none first:rounded-l-lg last:rounded-r-lg"
                                    : "text-gray-600 dark:text-gray-300 rounded-none first:rounded-l-lg last:rounded-r-lg"
                                }`}
                              >
                                {item.libelle}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Forum Entries */}
                        <div className="space-y-2">
                          <ForumEntries status={active} />
                        </div>
                      </div>
                    </div>
                  </>
                ) : page === "PageIDP" ? (
                  <>
                    <IndicateurDP />
                  </>
                ) : (
                  <>
                    <div>
                      {/* // filter all or retard = deadline depassé */}
                      <div className="mt-10 mb-4 ">
                        <div className="w-full mb-4 border-b border-gray-200 dark:border-gray-700/60">
                          <ul className="flex -mx-4 overflow-x-scroll text-sm font-medium flex-nowrap sm:-mx-6 lg:-mx-8 no-scrollbar">
                            <li className="pb-3 mr-6 last:mr-0 first:pl-4 sm:first:pl-6 lg:first:pl-8 last:pr-4 sm:last:pr-6 lg:last:pr-8">
                              <Link
                                className={` ${
                                  sousPage === "Accueil-All"
                                    ? "text-violet-500 font-bold"
                                    : " text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                }  whitespace-nowrap`}
                                to="#0"
                                onClick={() => setSousPage("Accueil-All")}
                              >
                                Voir tout
                              </Link>
                            </li>
                            {errorTT && (
                              <p className="text-xs text-red-500">
                                Une erreur s'est produire dans la recuperation
                                dfes types de tache
                              </p>
                            )}
                            {loadingTT && <SpinnerLoading />}
                            {typeTaches && typeTaches.length > 0 ? (
                              <>
                                {typeTaches.map((type) => (
                                  <li
                                    key={type.id}
                                    className="pb-3 mr-6 last:mr-0 first:pl-4 sm:first:pl-6 lg:first:pl-8 last:pr-4 sm:last:pr-6 lg:last:pr-8"
                                  >
                                    <Link
                                      className={` ${
                                        sousPage === type.id
                                          ? "text-violet-500 font-bold"
                                          : " text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                      }  whitespace-nowrap`}
                                      to="#0"
                                      onClick={() => setSousPage(type.id)}
                                    >
                                      {type && type.libelle
                                        ? type.libelle
                                        : "Pas de libelle inscrit"}
                                    </Link>
                                  </li>
                                ))}
                              </>
                            ) : (
                              <></>
                            )}

                            <li className="pb-3 mr-6 last:mr-0 first:pl-4 sm:first:pl-6 lg:first:pl-8 last:pr-4 sm:last:pr-6 lg:last:pr-8">
                              <Link
                                className={` ${
                                  sousPage === "Accueil-EnRetard"
                                    ? "text-orange-400 text-xs font-bold bg-white dark:bg-gray-800 flex items-center px-2.5 rounded-lg whitespace-nowrap"
                                    : " text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                }  whitespace-nowrap`}
                                to="#0"
                                onClick={() => setSousPage("Accueil-EnRetard")}
                              >
                                En retard
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </div>

                      {/* Cards */}
                      {sousPage === "Accueil-EnRetard" ? (
                        <div className="w-full max-w-9xl mx-auto">
                          <TachesEnRetard tachesEnRetard={tachesEnRetard} />
                        </div>
                      ) : (
                        <>
                          <div className="grid grid-cols-12 mt-10 mb-4 gap-x-4 gap-y-8 sm:ml-4">
                            {/* Tasks column firts*/}
                            <TasksGroups
                              endpoint={`/nouvelle/taches`}
                              title={`Tache ${
                                toggleViewTaskDay
                                  ? " du jour"
                                  : " importante ou urgente"
                              }`}
                            >
                              {/* boutton set tache UI ou today */}
                              <div className="flex justify-start">
                                {tachesIU.length < 1 ? (
                                  <button
                                    onClick={() => {
                                      setToggleViewTaskDay(!toggleViewTaskDay);
                                    }}
                                    className={`text-xs font-bold text-white  
                                       ${
                                         toggleViewTaskDay
                                           ? " hover:w-32 w-28 bg-violet-400 hover:bg-violet-300"
                                           : " "
                                       } text-center transition-all duration-300 
                                        ease-in-out rounded-xl p-1`}
                                  >
                                    Tache
                                    {toggleViewTaskDay
                                      ? " du jour"
                                      : " importante ou urgente"}
                                  </button>
                                ) : (
                                  <>
                                    {" "}
                                    {sousPage === "Accueil-All" && (
                                      <>
                                        <button
                                          onClick={() => {
                                            setToggleViewTaskDay(
                                              !toggleViewTaskDay
                                            );
                                          }}
                                          className={`text-xs font-bold text-white  
                                       ${
                                         toggleViewTaskDay
                                           ? " hover:w-32 w-28 bg-violet-400 hover:bg-violet-300"
                                           : " hover:w-52 w-48 bg-red-500 hover:bg-red-600"
                                       } text-center transition-all duration-300 
                                        ease-in-out rounded-xl p-1`}
                                        >
                                          Tache
                                          {toggleViewTaskDay
                                            ? " du jour"
                                            : " importante ou urgente"}
                                        </button>{" "}
                                      </>
                                    )}
                                  </>
                                )}
                              </div>
                              {/* tache today ou ui */}
                              {toggleViewTaskDay ? (
                                <>
                                  {errorT ? (
                                    <span className="text-xs text-center text-red-500">
                                      Erreur lors de la récupération des
                                      données.
                                    </span>
                                  ) : loadingT ? (
                                    <span className="text-center">
                                      <SpinnerLoading />
                                    </span>
                                  ) : tachesToday.length > 0 ? (
                                    tachesToday
                                      .slice(0, 7)
                                      .map((tacheToday) => (
                                        <Task01 tache={tacheToday} />
                                      ))
                                  ) : (
                                    <span className="text-xs text-center text-gray-500">
                                      Aucune tâche prévue pour aujourd'hui.
                                    </span>
                                  )}
                                </>
                              ) : (
                                <>
                                  {errorIU ? (
                                    <span className="text-xs text-center text-red-500">
                                      Erreur lors de la récupération des
                                      données.
                                    </span>
                                  ) : loadingIU ? (
                                    <span className="text-center">
                                      <SpinnerLoading />
                                    </span>
                                  ) : tachesIU.length > 0 ? (
                                    <>
                                      {sousPage === "Accueil-All" &&
                                        tachesIU
                                          .slice(0, 7)
                                          .map((tache) => (
                                            <Task01 tache={tache} />
                                          ))}
                                    </>
                                  ) : (
                                    <span className="text-xs text-center text-gray-500">
                                      Aucune tâche prévue pour aujourd'hui.
                                    </span>
                                  )}
                                </>
                              )}
                            </TasksGroups>

                            {/* Tasks column en cours*/}
                            <TasksGroups title="En cours">
                              {" "}
                              {errorE ? (
                                <span className="text-xs text-center text-red-500">
                                  Erreur lors de la récupération des données.
                                </span>
                              ) : loadingE ? (
                                <span className="text-center">
                                  <SpinnerLoading />
                                </span>
                              ) : tachesEncours.length > 0 ? (
                                tachesEncours.slice(0, 7).map((tachesEn) => (
                                  <>
                                    <Task01 tache={tachesEn} sousTache={true} />
                                  </>
                                ))
                              ) : (
                                <span className="text-xs text-center text-gray-500">
                                  Aucune tâche en cours pour l'instant.
                                </span>
                              )}
                            </TasksGroups>

                            {/* Tasks column terminé*/}
                            <TasksGroups title="Recement terminé">
                              {" "}
                              {errorTerminé ? (
                                <span className="text-xs text-center text-red-500">
                                  Erreur lors de la récupération des données.
                                </span>
                              ) : loadingTerminé ? (
                                <span className="text-center">
                                  <SpinnerLoading />
                                </span>
                              ) : tachesTerminé.length > 0 ? (
                                tachesTerminé.slice(0, 7).map((tacheEn) => (
                                  <>
                                    <Task01 tache={tacheEn} sousTache={true} />
                                  </>
                                ))
                              ) : (
                                <span className="text-xs text-center text-gray-500">
                                  Aucune tâche en terminé pour l'instant.
                                </span>
                              )}
                            </TasksGroups>

                            {/* Tasks column events*/}
                            <TasksGroups title={`Evenement à venir`}>
                              <div className="flex justify-end">
                                <Link
                                  to={`/evenements/calendrier`}
                                  className={`text-xs font-bold text-white bg-violet-500 hover:bg-violet-400 
                                        hover:w-24 w-20 text-center transition-all duration-300 
                                        ease-in-out rounded-xl p-1`}
                                >
                                  Calendrier
                                </Link>{" "}
                              </div>
                              {errorEventToday ? (
                                <span className="text-xs text-center text-red-500">
                                  Erreur lors de la récupération des données.
                                </span>
                              ) : loadingTEventToday ? (
                                <span className="text-center">
                                  <SpinnerLoading />
                                </span>
                              ) : eventsToday.length > 0 ? (
                                eventsToday.slice(0, 7).map((event) => (
                                  <>
                                    <Task08 event={event} />
                                  </>
                                ))
                              ) : (
                                <span className="text-xs text-center text-gray-500">
                                  Aucun evenement planifier pour aujourd'hui.
                                </span>
                              )}
                            </TasksGroups>
                          </div>
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Right content */}
              {page === "Projets" ? (
                <>
                  <ForumRightContent />
                </>
              ) : (
                <></>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Forum;

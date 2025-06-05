import React, { useEffect, useState } from "react";
import SpinnerLoading from "../components/SpinnerLoading";
import Header from "../partials/Header";
import Sidebar from "../partials/Sidebar";
import { useGetData } from "../utils/Requests/RequestService";
import ShopCards01 from "../partials/ecommerce/ShopCards01";
import AddEvenements from "../components/AddEvenements";
import PaginationClassic from "../components/PaginationClassic";

//formay json
function formatEventsData(rawEvents) {
  return rawEvents.map((event) => {
    const formattedEvent = { ...event };

    // Convertir responsableEvent en objet JSON si c'est une chaîne
    if (
      formattedEvent.responsableEvent &&
      typeof formattedEvent.responsableEvent === "string"
    ) {
      try {
        formattedEvent.responsableEvent = JSON.parse(
          formattedEvent.responsableEvent
        );
      } catch (error) {
        console.error(
          "Erreur lors de la conversion de responsableEvent :",
          error
        );
      }
    }

    // Convertir responsablesAssocies en tableau JSON si c'est une chaîne
    if (
      formattedEvent.responsablesAssocies &&
      typeof formattedEvent.responsablesAssocies === "string"
    ) {
      try {
        formattedEvent.responsablesAssocies = JSON.parse(
          formattedEvent.responsablesAssocies
        );
      } catch (error) {
        console.error(
          "Erreur lors de la conversion de responsablesAssocies :",
          error
        );
      }
    }

    return formattedEvent;
  });
}

function EvenementsSociete() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [responsableLog, setResponsableLog] = useState();
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categorieIdSelect, setCategorieIdSelect] = useState(0);
  const [keyword, setKeyWord] = useState("");
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  //get responsable log
  const {
    data: responsable,
    error: responsableError,
    loading: responsableLoading,
  } = useGetData("responsables/log");

  const {
    data: categoriesData,
    error: categoriesError,
    loading: categoriesLoading,
  } = useGetData("categories/evenements?keyword=");

  useEffect(() => {
    if (responsable && categoriesData) {
      setResponsableLog(responsable);
      setCategories(categoriesData);
      // console.log(responsableLog);
      console.log(categories);
    }
  }, [responsable, categoriesData]);

  // Construire dynamiquement l'URL en fonction de l'existence de `filter`
  const queryParams = new URLSearchParams({
    keyword: keyword,
    idCategorieEvent: categorieIdSelect ? categorieIdSelect : 0,
  }).toString();

  //get evenement
  const { data, error, loading, fetchData } = useGetData(
    `societe/filter/evenements?${queryParams}`
  );

  useEffect(() => {
    if (data) {
      const seen = new Map();

      // Parcourir pour trouver la première eventStart et la dernière eventEnd pour chaque occurenceEvent
      data.forEach((event) => {
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
      const formattedEvents = formatEventsData(uniqueEvents);
      setEvents(formattedEvents);
      // console.log(events);
    }

    // Vous pouvez maintenant observer `eventsToday` dans un useEffect à part pour voir les changements
  }, [data]);

  useEffect(() => {
    setTotalItems(events.length);
  }, [events]);

  const isLoading = loading || responsableLoading;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const [totalItems, setTotalItems] = useState(null);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEvents = events.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="flex h-[100dvh] overflow-hidden relative">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-x-hidden overflow-y-auto">
        {/* Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className={`grow relative`}>
          <div className={`flex h-full`}>
            {isLoading ? (
              <div className="absolute z-40 flex items-center justify-center w-full h-full bg-white dark:bg-gray-900">
                <SpinnerLoading />
              </div>
            ) : (
              <>
                <div className="w-full px-4 py-8 mx-auto sm:px-6 lg:px-8 max-w-9xl">
                  {/* Page header */}
                  <div className="flex items-center justify-between mb-5">
                    {/* Title */}
                    <h1 className="text-xl font-bold text-gray-800 md:text-3xl dark:text-gray-100">
                      Evenements
                    </h1>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setFeedbackModalOpen(true);
                      }}
                      className="flex items-center justify-center mr-5 transition bg-white border border-gray-200 rounded-full shadow-sm w-7 h-7 dark:bg-gray-800 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-violet-500"
                    >
                      <span className="sr-only">Add new account</span>
                      <svg
                        className="fill-current"
                        width="14"
                        height="14"
                        viewBox="0 0 16 16"
                      >
                        <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                      </svg>
                    </button>
                  </div>
                  <AddEvenements
                    fetchData={fetchData}
                    setFeedbackModalOpen={setFeedbackModalOpen}
                    feedbackModalOpen={feedbackModalOpen}
                  />

                  {/* Search form */}
                  <div className="max-w-xl mb-5">
                    <form className="relative">
                      <label htmlFor="app-search" className="sr-only">
                        Recherche
                      </label>
                      <input
                        id="app-search"
                        className="w-full py-2.5 bg-white form-input pl-9 dark:bg-gray-800"
                        type="search"
                        placeholder="Rechercher un evenement..."
                        onChange={(e) => {
                          setKeyWord(e.target.value);
                        }}
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

                  {/* Filters */}
                  <div className="mb-4 border-b border-gray-200 dark:border-gray-700/60">
                    {categories.length > 0 ? (
                      <>
                        <ul className="flex -mx-4 overflow-x-scroll text-sm font-medium flex-nowrap sm:-mx-6 lg:-mx-8 no-scrollbar">
                          <li className="pb-3 mr-6 last:mr-0 first:pl-4 sm:first:pl-6 lg:first:pl-8 last:pr-4 sm:last:pr-6 lg:last:pr-8">
                            <button
                              className={`${
                                categorieIdSelect === 0 ? "text-violet-500" : ""
                              } whitespace-nowrap`}
                              onClick={async () => {
                                setCategorieIdSelect(0);
                                setKeyWord("");
                                setCurrentPage(1);
                              }}
                            >
                              Tout
                            </button>
                          </li>
                          {categories.map((categorie) => (
                            <li className="pb-3 mr-6 last:mr-0 first:pl-4 sm:first:pl-6 lg:first:pl-8 last:pr-4 sm:last:pr-6 lg:last:pr-8">
                              <button
                                className={`${
                                  categorieIdSelect === categorie.id
                                    ? "text-violet-500"
                                    : ""
                                } whitespace-nowrap`}
                                onClick={async () => {
                                  setCategorieIdSelect(categorie.id);
                                  setKeyWord("");
                                  setCurrentPage(1);
                                }}
                              >
                                {categorie?.libelle}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </>
                    ) : (
                      <></>
                    )}
                  </div>

                  <div>
                    {/* Cards 1 (Video Courses) */}
                    <div className="mt-8">
                      <h2 className="mb-5 text-xl font-bold leading-snug text-gray-800 dark:text-gray-100"></h2>
                      {error ? (
                        <>
                          {" "}
                          <p className="text-xs text-center text-red-500">
                            Erreur lors du chargement des données: {error}
                          </p>
                        </>
                      ) : (
                        <>
                          {" "}
                          {events && events.length > 0 ? (
                            <>
                              {" "}
                              <div className="grid grid-cols-12 gap-6">
                                <ShopCards01
                                  events={currentEvents}
                                  responsable={responsableLog}
                                />
                              </div>
                            </>
                          ) : (
                            <p className="text-xs text-center">
                              Aucun evenemnts ajouter pour le moment.
                            </p>
                          )}
                        </>
                      )}
                    </div>
                    {/* pagination */}
                    <div className="mt-8">
                      {events.length > 0 && (
                        <PaginationClassic
                          currentPage={currentPage}
                          itemsPerPage={itemsPerPage}
                          totalItems={totalItems}
                          paginate={handlePageChange}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default EvenementsSociete;

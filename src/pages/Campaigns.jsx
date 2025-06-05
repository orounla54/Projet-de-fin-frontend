import React, { useEffect, useState } from "react";

import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import SearchForm from "../partials/actions/SearchForm";
import FilterButton from "../components/DropdownFilterEvent";
import CampaignsCard from "../partials/campaigns/CampaignsCard";
import PaginationNumeric from "../components/PaginationNumeric";

import { useGetData } from "../utils/Requests/RequestService";
import SpinnerLoading from "../components/SpinnerLoading";
import { Link } from "react-router-dom";
import axios from "axios";
import { baseURL } from "../utils/DataFront/eventTypes";
import AuthService from "../utils/Auth/AuthServices";
import EvenementListing from "../components/EvenementListing";
import DeleteButton from "../partials/actions/DeleteButton";

function Campaigns() {
  const baseUrl = baseURL;
  console.log("rendu");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [events, setEvents] = useState([]);
  const [eventsListe, setEventsListe] = useState([]);
  const [filter, setFilter] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [listing, setListing] = useState(false);

  // Construire dynamiquement l'URL en fonction de l'existence de `filter`
  const queryParams = new URLSearchParams({
    keyword: keyword,
    ...(filter?.eventStart && { eventStart: filter.eventStart }),
    ...(filter?.eventEnd && { eventEnd: filter.eventEnd }),
    ...(filter?.status && { status: filter.status }),
  }).toString();

  // Récupérer les données avec les paramètres de filtre conditionnels
  const {
    data: dataListe,
    loading: loadingListe,
    error: errorListe,
    fetchData: fetchDataListe,
  } = useGetData(listing ? `filter/evenements?${queryParams}` : "");

  //effectue la mise à jour de la page quand on a la data
  useEffect(() => {
    setCurrentPage(1);
    if (dataListe) {
      setEventsListe(dataListe);
    }
    console.log(eventsListe);
  }, [dataListe]);

  // Construire dynamiquement l'URL en fonction de l'existence de `filter`
  const queryParams1 = new URLSearchParams({
    keyword: keyword,
    ...(filter?.eventStart && { eventStart: filter.eventStart }),
    ...(filter?.eventEnd && { eventEnd: filter.eventEnd }),
    ...(filter?.status && { status: filter.status }),
  }).toString();

  // Récupérer les données avec les paramètres de filtre conditionnels
  const { data, loading, error, fetchData } = useGetData(
    !listing ? `filter/evenements/occurence?${queryParams1}` : ""
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
      setEvents(uniqueEvents);
    }
    // Vous pouvez maintenant observer `eventsToday` dans un useEffect à part pour voir les changements
  }, [data]);

  const indexOfLastProject = currentPage * itemsPerPage;
  const indexOfFirstProject = indexOfLastProject - itemsPerPage;
  const currentEvents = listing
    ? eventsListe.slice(indexOfFirstProject, indexOfLastProject)
    : events.slice(indexOfFirstProject, indexOfLastProject);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const [selectedItems, setSelectedItems] = useState([]);

  // Fonction de sélection optimisée
  const handleSelectedItems = (selectedItems) => {
    setSelectedItems([...selectedItems]);
  };

  const [selectAll, setSelectAll] = useState(false);
  const [isCheck, setIsCheck] = useState([]);

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    setIsCheck(!selectAll ? currentEvents.map((event) => event.id) : []);
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
            const response = await axios.delete(`${baseUrl}/evenements/${id}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            console.log(`Tache avec ID ${id} supprimé :`, response);
            return { id, success: true }; // Retourner un résultat de suppression réussi
          } catch (err) {
            if (err.response && err.response.status === 404) {
              console.warn(
                `Evenement avec ID ${id} déjà supprimé ou introuvable.`
              );
              return { id, success: true }; // Marque comme succès même si le projet est déjà supprimé
            }
            console.error(
              `Erreur lors de la suppression de l'evenement avec ID ${id}`,
              err
            );
            return { id, success: false }; // Marque comme échec si une erreur autre que 404 survient
          }
        })
      );

      // Appeler fetchData pour actualiser la liste des taches
      await fetchData();
      await fetchDataListe();
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

  const [responsableLog, setResponsableLog] = useState({});

  const {
    data: respo,
    loading: loadingRespo,
    error: errorRespo,
    fetchData: fetchReso,
  } = useGetData(`/responsables/log`);
  
  useEffect(() => {
    if (respo) {
      setResponsableLog(respo);
    }
  }, [respo]);

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
            <div className="mb-8 sm:flex sm:justify-between sm:items-center">
              {/* Left: Title */}
              <div className="mb-4 sm:mb-0">
                <h1 className="text-2xl font-bold text-gray-800 md:text-3xl dark:text-gray-100">
                  Evenements
                </h1>
              </div>

              {/* Right: Actions */}
              <div className="grid justify-start grid-flow-col gap-2 sm:auto-cols-max sm:justify-end">
                {/* Search form */}
                <SearchForm
                  placeholder="Recherche..."
                  setKeyword={setKeyword}
                  fetchData={() => {
                    if (listing) {
                      fetchDataListe();
                    } else {
                      fetchData();
                    }
                  }}
                />
                <FilterButton pageEvent setFilter={setFilter} align="right" />
              </div>
            </div>

            {/* Filters */}
            <div className="mb-4 border-b border-gray-200 dark:border-gray-700/60">
              <ul className="flex py-3 -mx-4 overflow-x-scroll text-sm font-medium flex-nowrap sm:-mx-6 lg:-mx-8 no-scrollbar">
                <li className="pb-3 mr-6 last:mr-0 first:pl-4 sm:first:pl-6 lg:first:pl-8 last:pr-4 sm:last:pr-6 lg:last:pr-8">
                  <Link
                    onClick={() => setListing(!listing)}
                    className={`text-xs font-bold text-white bg-violet-500 hover:bg-violet-400 
                                        text-center transition-all duration-300 
                                        ease-in-out rounded-xl p-1 ${
                                          listing
                                            ? "w-24 hover:w-20 p-2"
                                            : " hover:w-24 hover:p-2 w-20"
                                        }`}
                  >
                    {"   "}Affichage sous forme de liste{"   "}
                  </Link>
                </li>
              </ul>
            </div>

            <div className="flex justify-end">
              {/* Delete button */}
              {!deleteAllLoading ? (
                <>
                  <DeleteButton
                    deleteAll={deleteAll}
                    selectedItems={selectedItems}
                  />
                </>
              ) : (
                <SpinnerLoading />
              )}
            </div>

            {/* Cards */}
            <div className="grid grid-cols-12 gap-6">
              {loading && (
                <div className="col-span-12 text-center text-violet-400">
                  <SpinnerLoading />
                </div>
              )}
              {Array.isArray(currentEvents) ? (
                currentEvents.length > 0 ? (
                  listing ? (
                    // Afficher quelque chose si 'listing' est vrai
                    <>
                      <EvenementListing
                        loading={loading}
                        events={currentEvents}
                        selectedItems={handleSelectedItems}
                        refresh={fetchData}
                        error={error}
                        handleSelectAll={handleSelectAll}
                        selectAll={selectAll}
                        setSelectAll={setSelectAll}
                        isCheck={isCheck}
                        setIsCheck={setIsCheck}
                        deleteAll={deleteAll}
                        responsableLog={responsableLog}
                      />
                    </>
                  ) : (
                    // Mapper les événements si 'listing' est faux
                    currentEvents.map((event) => (
                      <CampaignsCard
                        key={event.id}
                        id={event.id}
                        status={event.status}
                        isNew={event.new}
                        eventName={event.eventName}
                        description={event.description}
                        content={event.content}
                        eventStart={event.eventStart}
                        eventEnd={event.eventEnd}
                        enventType={event.enventType}
                      />
                    ))
                  )
                ) : (
                  // Aucun résultat trouvé
                  <div className="col-span-12 text-center text-violet-400">
                    Aucun résultat pour les paramètres entrés...
                  </div>
                )
              ) : (
                // Erreur de récupération des données
                <div className="col-span-12 text-center text-red-500">
                  Erreur lors de la récupération des données.
                </div>
              )}
            </div>

            {/* Pagination */}
            <div className="flex justify-end mt-8">
              {events.length > 10 ||
                (eventsListe.length > 10 && (
                  <PaginationNumeric
                    itemsPerPage={itemsPerPage}
                    totalItems={listing ? eventsListe.length : events.length}
                    paginate={paginate}
                    currentPage={currentPage}
                  />
                ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Campaigns;

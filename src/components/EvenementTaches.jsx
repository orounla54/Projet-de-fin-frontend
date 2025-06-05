import React, { useEffect, useState } from "react";
import { useGetData } from "../utils/Requests/RequestService";
import AddEvenementTache from "./AddEvenementTache";
import SpinnerLoading from "./SpinnerLoading";
import EvenementTacheItem from "./EvenementTacheItem";

const formatData = (data) => {
  return data.map((tache) => ({
    ...tache,
    responsables: tache.responsables ? JSON.parse(tache.responsables) : null,
  }));
};

function EvenementTaches({ event, responsableLog }) {
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [taches, setTaches] = useState([]);
  // Récupérer l'enevenement
  const { data, loading, error, fetchData } = useGetData(
    event ? `evenementsSociete/taches/${event?.id}` : ""
  );

  //effectue la mise à jour de la page quand on a la data
  useEffect(() => {
    if (data) {
      // const formattedData = formatData(data);
      setTaches(data);
      console.log(data);
    }
  }, [data]);

  return (
    <div className="xl:w-4/5 mb-8">
      <div className="flex items-center justify-between my-2">
        <h2 className="text-gray-800 dark:text-gray-100 font-semibold mb-2">
          Taches evenement
        </h2>
        {parseInt(responsableLog.id) === parseInt(event.idResponsable) && (
          <div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setFeedbackModalOpen(true);
              }}
              className="flex items-center justify-center transition bg-white border border-gray-200 rounded-full shadow-sm w-7 h-7 dark:bg-gray-800 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-violet-500"
            >
              <span className="sr-only">Add Task</span>
              <svg
                className="fill-current"
                width="14"
                height="14"
                viewBox="0 0 16 16"
              >
                <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
              </svg>
            </button>
            <AddEvenementTache
              feedbackModalOpen={feedbackModalOpen}
              setFeedbackModalOpen={setFeedbackModalOpen}
              event={event}
              fetchData={fetchData}
            />
          </div>
        )}
      </div>
      <div className="bg-white dark:bg-gray-900 p-4 border border-gray-200 dark:border-gray-700/60 rounded-lg shadow-sm">
        <ul className="space-y-3">
          {loading ? (
            <>
              <SpinnerLoading />
            </>
          ) : (
            <>
              {taches && taches.length > 0 ? (
                <>
                  {taches.map((tache, index) => (
                    <EvenementTacheItem
                      event={event}
                      fetchData={fetchData}
                      tache={tache}
                      responsableLog={responsableLog}
                    />
                  ))}
                </>
              ) : (
                <p className="text-xs text-center">
                  Aucune n'a été ajouter pour le moment📄.
                </p>
              )}
            </>
          )}
        </ul>
      </div>
    </div>
  );
}

export default EvenementTaches;

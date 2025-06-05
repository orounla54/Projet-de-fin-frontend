import React, { useEffect, useState } from "react";
import { useGetData } from "../utils/Requests/RequestService";
import SpinnerLoading from "./SpinnerLoading";
import EvenementFileConducteurItem from "./EvenementFileConducteurItem";
import AddFileConducteurEvenement from "./AddContributionEvenement";

function EvenementFilesConducteur({ event, slice, responsableLog }) {
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [filesConducteur, setFilesConducteur] = useState([]);
  // Récupérer l'enevenement
  const { data, loading, error, fetchData } = useGetData(
    event ? `filesConducteur/societe/evenements/${event?.id}` : ""
  );

  //effectue la mise à jour de la page quand on a la data
  useEffect(() => {
    if (data) {
      setFilesConducteur(data);
      console.log(filesConducteur);
    }
  }, [data]);

  return (
    <div className={`mb-4 ${!slice ? "xl:w-4/5" : ""}`}>
      <div className="flex items-center justify-between my-2">
        <h2 className="mb-2 font-semibold text-gray-800 dark:text-gray-100">
          Files conducteur
        </h2>
        <div>
          {parseInt(responsableLog.id, 10) ===
            parseInt(event.idResponsable, 10) && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setFeedbackModalOpen(true);
                }}
                className="flex items-center justify-center transition bg-white border border-gray-200 rounded-full shadow-sm w-7 h-7 dark:bg-gray-800 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-violet-500"
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
              <AddFileConducteurEvenement
                event={event}
                feedbackModalOpen={feedbackModalOpen}
                setFeedbackModalOpen={setFeedbackModalOpen}
                fetchData={fetchData}
              />
            </>
          )}
        </div>
      </div>

      <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-900 dark:border-gray-700/60">
        <ul className="space-y-3">
          {loading ? (
            <>
              <SpinnerLoading />
            </>
          ) : (
            <>
              {filesConducteur && filesConducteur.length > 0 ? (
                <>
                  {slice ? (
                    <>
                      {filesConducteur
                        .slice(0, 8)
                        .map((fileConducteur, index) => (
                          <EvenementFileConducteurItem
                            fileConducteur={fileConducteur}
                            index={index}
                            fetchData={fetchData}
                            event={event}
                            responsableLog={responsableLog}
                          />
                        ))}
                    </>
                  ) : (
                    <>
                      {" "}
                      {filesConducteur.map((fileConducteur, index) => (
                        <EvenementFileConducteurItem
                          fileConducteur={fileConducteur}
                          index={index}
                          fetchData={fetchData}
                          event={event}
                          responsableLog={responsableLog}
                        />
                      ))}
                    </>
                  )}
                </>
              ) : (
                <p className="text-xs text-center">
                  Rien n'a été ajouter pour le moment⏲️.
                </p>
              )}
            </>
          )}
        </ul>
      </div>
    </div>
  );
}

export default EvenementFilesConducteur;

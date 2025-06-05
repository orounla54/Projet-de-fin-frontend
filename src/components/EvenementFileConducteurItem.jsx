import React, { useState } from "react";
import DangerModal from "./DangerModal";
import AddFileConducteurEvenement from "./AddContributionEvenement";

function EvenementFileConducteurItem({ fileConducteur, fetchData, event, responsableLog }) {
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);

  //   console.log(fileConducteur)
  return (
    <li
      key={fileConducteur?.id}
      className="sm:flex sm:items-center sm:justify-between"
    >
      <div className="flex items-center text-sm sm:grow">
        {/* Icon */}
        <div
          className={`w-8 h-8 my-2 mr-3 rounded-full ${fileConducteur?.status === "Terminé"
              ? "bg-green-500"
              : fileConducteur?.status === "En-cours"
                ? "bg-yellow-500"
                : "bg-violet-500"
            }  shrink-0`}
        >
          <svg
            className="w-8 h-8 fill-current text-gray-50"
            viewBox="0 0 32 32"
          >
            <path d="M21 14a.75.75 0 0 1-.75-.75 1.5 1.5 0 0 0-1.5-1.5.75.75 0 1 1 0-1.5 1.5 1.5 0 0 0 1.5-1.5.75.75 0 1 1 1.5 0 1.5 1.5 0 0 0 1.5 1.5.75.75 0 1 1 0 1.5 1.5 1.5 0 0 0-1.5 1.5.75.75 0 0 1-.75.75Zm-7 10a1 1 0 0 1-1-1 4 4 0 0 0-4-4 1 1 0 0 1 0-2 4 4 0 0 0 4-4 1 1 0 0 1 2 0 4 4 0 0 0 4 4 1 1 0 0 1 0 2 4 4 0 0 0-4 4 1 1 0 0 1-1 1Z" />
          </svg>
        </div>
        {/* Position */}
        <div>
          <div className="font-medium text-gray-800 dark:text-gray-100">
            {fileConducteur?.libelle || "Aucun libelle entrer"}
            {fileConducteur?.description && (
              <p className="mb-2 text-xs text-justify text-gray-700 dark:text-gray-400">
                {fileConducteur?.description
                  .split("\n")
                  .map((paragraph, index) => (
                    <p key={index} className="mb-4">
                      {paragraph.trim()}
                    </p>
                  ))}
              </p>
            )}
          </div>
          {/* heure  */}
          <div className="flex items-center space-x-2 flex-nowrap whitespace-nowrap">
            <div>
              {fileConducteur?.date && fileConducteur?.heureDebut ? (
                new Date(`${fileConducteur.date.split('T')[0]}T${fileConducteur.heureDebut}`).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              ) : (
                <span>Heure de début non disponible</span>
              )}
            </div>
            <div className="text-gray-400 dark:text-gray-600">-</div>
            <div>
              {fileConducteur?.date && fileConducteur?.heureFin ? (
                new Date(`${fileConducteur.date.split('T')[0]}T${fileConducteur.heureFin}`).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              ) : (
                <span>Heure de fin non disponible</span>
              )}{" "}
              <span className="">Heure</span>
            </div>
          </div>
        </div>
      </div>
      {/* controles */}
      <div className="mt-2 sm:ml-2 sm:mt-0">
        {parseInt(responsableLog.id) === parseInt(event.idResponsable) && (
          <ul className="flex flex-wrap -m-1 sm:justify-end">
            <AddFileConducteurEvenement
              fileConducteur={fileConducteur}
              feedbackModalOpen={feedbackModalOpen}
              setFeedbackModalOpen={setFeedbackModalOpen}
              fetchData={fetchData}
              event={event}
            />
            <li className="m-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setFeedbackModalOpen(true);
                }}
                className="inline-flex items-center justify-center text-xs font-medium leading-5 rounded-full px-2.5 py-0.5 border border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 shadow-sm bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 transition"
              >
                Modifier
              </button>
            </li>
            <li className="m-1">
              <button className="inline-flex items-center justify-center text-xs font-medium leading-5 rounded-full px-2.5 py-0.5 border border-red-200 dark:border-red-700/60 hover:border-red-300 dark:hover:border-red-600 shadow-sm bg-white dark:bg-gray-800 text-red-500 dark:text-red-400 transition">
                <DangerModal
                  endpoint="filesConducteur"
                  idObjet={fileConducteur.id}
                  libelleObjet={fileConducteur.libelle}
                  refreshList={fetchData}
                />
              </button>
            </li>
          </ul>
        )}
      </div>
    </li>
  );
}

export default EvenementFileConducteurItem;

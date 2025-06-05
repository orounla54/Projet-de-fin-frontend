import React, { useState } from "react";
import { Link } from "react-router-dom";
import LibelleFormat from "./LibelleFormat";
import DangerModal from "./DangerModal";

function PreuvesDocuments({ documents, fetchData, page, idResponsableLog }) {
  const count = 7;
  const [visibleCount, setVisibleCount] = useState(count); // Nombre d'éléments affichés
  const [isExpanded, setIsExpanded] = useState(false); // État pour savoir si on affiche tous les éléments ou pas

  const toggleView = () => {
    if (isExpanded) {
      setVisibleCount(count); // Revenir à 3 éléments affichés
    } else {
      setVisibleCount(documents?.length); // Afficher tous les documents
    }
    setIsExpanded(!isExpanded); // Inverser l'état (Voir plus / Voir moins)
  };

  return (
    <div>
      {documents.length > 0 ? (
        documents?.slice(0, visibleCount).map((docs) => (
          <li
            className="relative flex items-center justify-center gap-2 py-2 group"
            key={docs?.id}
          >
            {" "}
            {page === "responsable" &&
              idResponsableLog === docs?.idResponsable && (
                <button
                  className="transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                  aria-hidden="true"
                >
                  <DangerModal
                    endpoint="documentsPreuves"
                    idObjet={docs?.id}
                    libelleObjet={docs?.libelle}
                    refreshList={() => {
                      fetchData();
                    }}
                  />
                </button>
              )}
            <div className="flex flex-col items-center justify-center gap-1 mb-1">
              <h5 className="font-bold text-center text-gray-800 dark:text-gray-100">
                <LibelleFormat libelle={docs?.libelle} length={200} />
              </h5>
              <div className="text-center">
                <Link
                  to={`${docs?.lien}`}
                  className="flex flex-wrap gap-1 text-xs"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-4 fill-violet-400"
                  >
                    <path
                      fillRule="evenodd"
                      d="M19.5 21a3 3 0 0 0 3-3V9a3 3 0 0 0-3-3h-5.379a.75.75 0 0 1-.53-.22L11.47 3.66A2.25 2.25 0 0 0 9.879 3H4.5a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h15Zm-6.75-10.5a.75.75 0 0 0-1.5 0v4.19l-1.72-1.72a.75.75 0 0 0-1.06 1.06l3 3a.75.75 0 0 0 1.06 0l3-3a.75.75 0 1 0-1.06-1.06l-1.72 1.72V10.5Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-bold underline">
                    Cliquer pour télécharger
                  </span>
                </Link>
              </div>
            </div>
          </li>
        ))
      ) : (
        <p className="my-2 text-xs text-center text-gray-500">
          Aucun documents ajoutés📄
        </p>
      )}

      {/* Bouton "Voir plus / Voir moins" */}
      {documents?.length > count && (
        <div className="flex justify-end mt-4">
          <button
            onClick={toggleView}
            className="inline-flex items-center justify-center text-xs font-medium leading-5 rounded-full px-2.5 py-0.5 border shadow-sm transition border-violet-200 dark:border-violet-700/60 hover:border-violet-300 dark:hover:border-violet-600 bg-violet-50 dark:bg-violet-900 text-violet-500 dark:text-violet-400"
          >
            {isExpanded ? "Voir moins" : "Voir plus"}
          </button>
        </div>
      )}
    </div>
  );
}

export default PreuvesDocuments;

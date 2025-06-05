import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import LibelleFormat from "./LibelleFormat";
import DescriptionFormat from "./DescriptionFormat";
import Avatar from "react-avatar";

function DiscussionsTacheItem({ discussion }) {
  const [responsables, setResponsables] = useState([]);

  const formatDate = (date) => {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate)) {
      return "Date invalide"; // Ou une autre valeur par défaut
    }

    const options = {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    };

    return new Intl.DateTimeFormat("fr-FR", options).format(parsedDate);
  };
  //responsable get
  useEffect(() => {
    if (discussion && discussion.responsables) {
      try {
        // Convertir en tableau d'objets
        // const responsablesParsed = JSON.parse(discussion.responsables);
        setResponsables(discussion.responsables);
      } catch (error) {
        console.error(
          "Erreur lors du parsing de discussion.Responsables:",
          error
        );
      }
    } else {
    }
    console.log(responsables);
  }, [discussion]);

  return (
    <>
      <article className="flex overflow-hidden bg-white shadow-sm dark:bg-gray-800 rounded-xl">
        {/* Content */}
        <div className="flex flex-col p-5 grow">
          <div className="grow">
            <div className="mb-2 text-sm font-semibold uppercase text-violet-500">
              {discussion && discussion.dateInscription
                ? formatDate(discussion.dateInscription)
                : "Aucune date inscrite"}
            </div>
            <Link
              className="inline-flex mb-2"
              to={`/discussions/${discussion.id}`}
            >
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                {discussion.libelle ? (
                  <LibelleFormat libelle={discussion.libelle} />
                ) : (
                  "Aucun libelle ajouté"
                )}
              </h3>
            </Link>
            <div className="text-sm">
              {discussion.description ? (
                <DescriptionFormat description={discussion.description} />
              ) : (
                ""
              )}
            </div>
          </div>
          {/* Footer */}
          <div className="flex items-center justify-between mt-3">
            {/* Tag */}
            <div className="text-xs inline-flex items-center font-medium border border-gray-200 dark:border-gray-700/60 text-gray-600 dark:text-gray-400 rounded-full text-center px-2.5 py-1">
              <svg
                className="w-4 h-3 mr-2 fill-gray-400 dark:fill-gray-500"
                viewBox="0 0 16 12"
              >
                <path d="m16 2-4 2.4V2a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7.6l4 2.4V2ZM2 10V2h8v8H2Z" />
              </svg>
              <span>Online Event</span>
            </div>
            {/* Avatars */}
            <div className="flex items-center space-x-2">
              <div className="flex -space-x-3 -ml-0.5">
                {Array.isArray(responsables) && responsables.length > 0
                  ? responsables.slice(0, 4).map((responsable, index) => (
                      <Avatar
                        name={`${responsable.nom} ${responsable.prenom}`}
                        round={true}
                        size="28"
                        src={responsable.photoProfileLien} // mLe lien de l'image
                      />
                    ))
                  : ""}
              </div>
              <div className="text-xs italic font-medium text-gray-400 dark:text-gray-500">
                {Array.isArray(responsables) && responsables.length > 4
                  ? responsables.length - 4 > 0
                    ? `+${responsables.length - 4}`
                    : ""
                  : ""}
              </div>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}

export default DiscussionsTacheItem;

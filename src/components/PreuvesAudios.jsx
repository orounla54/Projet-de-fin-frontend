import React, { useState } from "react";
import DangerModal from "./DangerModal";

function PreuvesAudios({ audios, fetchData, page, idResponsableLog }) {
  const count = 3;

  const [visibleCount, setVisibleCount] = useState(count); // Nombre d'éléments affichés
  const [isExpanded, setIsExpanded] = useState(false); // État pour savoir si on affiche tous les éléments ou pas

  const toggleView = () => {
    if (isExpanded) {
      setVisibleCount(count); // Revenir à 3 éléments affichés
    } else {
      setVisibleCount(audios.length); // Afficher tous les audios
    }
    setIsExpanded(!isExpanded); // Inverser l'état (Voir plus / Voir moins)
  };

  return (
    <div>
      {audios && audios.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 my-2">
          {audios?.slice(0, visibleCount).map((audio) => (
            <div className="group">
              <div key={audio?.id} className="flex flex-col items-center">
                <p className="mb-2 text-xs font-semibold text-gray-700 dark:text-gray-200">
                  {audio?.libelle}
                </p>
                <audio controls className="w-full" >
                  <source src={audio?.lien} type="audio/mp3" />
                  Votre navigateur ne supporte pas l'élément audio.
                </audio>
              </div>
              {page === "responsable" &&
                idResponsableLog === audio?.idResponsable && (
                  <div className="transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                    <DangerModal
                      endpoint="documentsPreuves"
                      idObjet={audio?.id}
                      libelleObjet={audio?.libelle}
                      refreshList={() => {
                        fetchData();
                      }}
                    />
                  </div>
                )}
            </div>
          ))}
        </div>
      ) : (
        <p className="my-2 text-xs text-center text-gray-500">
          Aucun audios ajoutés 🎵
        </p>
      )}

      {/* Bouton "Voir plus / Voir moins" */}
      {audios?.length > count && (
        <div className="flex justify-end mt-4">
          <button
            onClick={toggleView}
            className="inline-flex items-center justify-center text-xs font-medium leading-5 rounded-full px-2.5 py-0.5 border shadow-sm transition border-violet-200 dark:border-violet-700/60 hover:border-violet-300 dark:hover:border-violet-600 bg-violet-50 dark:bg-violet-900 text-violet-500 dark:text-violet-400"
          >
            {isExpanded ? "Masquer les Audios" : "Afficher les Audios"}
          </button>
        </div>
      )}
    </div>
  );
}

export default PreuvesAudios;

import React, { useState } from "react";
import DangerModal from "./DangerModal";

function PreuvesVideos({ videos, fetchData, page, idResponsableLog }) {
  const count = 2;

  const [visibleCount, setVisibleCount] = useState(count); // Nombre d'éléments affichés
  const [isExpanded, setIsExpanded] = useState(false); // État pour savoir si on affiche tous les éléments ou pas

  const toggleView = () => {
    if (isExpanded) {
      setVisibleCount(count); // Revenir à 3 éléments affichés
    } else {
      setVisibleCount(videos.length); // Afficher tous les videos
    }
    setIsExpanded(!isExpanded); // Inverser l'état (Voir plus / Voir moins)
  };

  return (
    <div>
      {videos && videos?.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 my-6 sm:grid-cols-2 xl:grid-cols-3">
          {videos?.slice(0, visibleCount).map((video) => (
            <div className="group">
              <div key={video?.id} className="flex flex-col items-center">
                <video controls className="w-full rounded-md shadow-md">
                  <source src={video?.lien} type="video/mp4" />
                  Votre navigateur ne supporte pas l'élément vidéo.
                </video>
              </div>
              {page === "responsable" &&
                idResponsableLog === video?.idResponsable && (
                  <div className="absolute transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                    <DangerModal
                      endpoint="documentsPreuves"
                      idObjet={video?.id}
                      libelleObjet={video?.libelle}
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
          Aucune video ajoutées📹
        </p>
      )}

      {/* Bouton "Voir plus / Voir moins" */}
      {videos?.length > count && (
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

export default PreuvesVideos;

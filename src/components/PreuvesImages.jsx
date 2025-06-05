import React, { useState } from "react";
import DangerModal from "./DangerModal";

function PreuvesImages({ images, fetchData, page, idResponsableLog }) {
  const count = 6;

  const [visibleCount, setVisibleCount] = useState(count); // Nombre d'éléments affichés
  const [isExpanded, setIsExpanded] = useState(false); // État pour savoir si on affiche tous les éléments ou pas

  const toggleView = () => {
    if (isExpanded) {
      setVisibleCount(count); // Revenir à 3 éléments affichés
    } else {
      setVisibleCount(images?.length); // Afficher tous les images
    }
    setIsExpanded(!isExpanded); // Inverser l'état (Voir plus / Voir moins)
  };

  return (
    <div>
      {images && images.length > 0 ? (
        <div className="my-2">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-4 sm:grid-cols-3">
            {images?.slice(0, visibleCount).map((img) => (
              <div className="group">
                <a href={img?.lien} key={img?.id}>
                  <img
                    className="w-full h-48 rounded-sm"
                    src={img?.lien}
                    alt={img?.libelle}
                  />
                </a>
                {page === "responsable" &&
                  idResponsableLog === img?.idResponsable && (
                    <div className="absolute z-20 h-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                      <DangerModal
                        endpoint="documentsPreuves"
                        idObjet={img?.id}
                        libelleObjet={img?.libelle}
                        refreshList={() => {
                          fetchData();
                        }}
                      />
                    </div>
                  )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="my-2 text-xs text-center text-gray-500">
          Aucune images ajoutées 🖼️
        </p>
      )}

      {/* Bouton "Voir plus / Voir moins" */}
      {images?.length > count && (
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

export default PreuvesImages;

import React, { useEffect, useState } from "react";
import SpinnerLoading from "../../components/SpinnerLoading";
import LibelleFormat from "../../components/LibelleFormat";
import DangerModal from "../../components/DangerModal";
import { useGetData, usePutData } from "../../utils/Requests/RequestService";
import axios from "axios";
import { baseURL } from "../../utils/DataFront/eventTypes";
import AuthService from "../../utils/Auth/AuthServices";

function DashboardCard11({
  sousTaches,
  sousTacheLoading,
  sousTacheError,
  setFeedbackModalOpen2,
  sousTachesFetch,
}) {
  const baseUrl = baseURL;

  const [loadingUpdateSousTache, setLoadingUpadateSousTache] = useState(false);
  const [errorUpdateSousTache, setErrorUpadateSousTache] = useState(null);
  const [idUpdate, setIdUpdate] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  // Fonction pour mettre à jour le statut
  const handleUpdateStatus = async (idTache, status) => {
    setIdUpdate(idTache);
    setLoadingUpadateSousTache(true);
    const accessToken = AuthService.getAccessToken();
    const newStatus = status === "Terminé" ? "Non-démarré" : "Terminé";

    try {
      const response = await axios.put(
        `${baseUrl}/sousTaches/${idTache}`,
        { status: newStatus },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      await sousTachesFetch(); // Rafraîchir la liste après la mise à jour réussie
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      setErrorUpadateSousTache(
        "Erreur lors de la mise à jour de la sous tache"
      );
    }
    setLoadingUpadateSousTache(false);
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
    <div className="col-span-full xl:col-span-6 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 flex justify-between items-center">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">
          Sous taches
        </h2>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setFeedbackModalOpen2(true);
          }}
          className="btn-sm bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
        >
          <svg
            className="fill-current text-gray-400 shrink-0"
            width="14"
            height="14"
            viewBox="0 0 16 16"
          >
            <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
          </svg>
          <span className="ml-2 text-xs">Nouvelle sous tache</span>
        </button>
      </header>
      <div className="p-3">
        {/* Card content */}
        {/* "Today" group */}
        <div>
          <header className="text-xs uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700 dark:bg-opacity-50 rounded-sm font-semibold p-2">
            .{" "}
            {errorUpdateSousTache ? (
              <span className="text-center text-red-500">
                {errorUpdateSousTache}
              </span>
            ) : (
              <></>
            )}
          </header>
          {/* Spinner pour le chargement */}
          {sousTacheLoading && <SpinnerLoading />}

          {/* Affichage des sous-tâches */}
          {sousTaches && sousTaches.length > 0 ? (
            <ul className="my-1">
              {sousTaches.map((sTache) => (
                <li key={sTache.id} className="flex px-2 items-center">
                  {/* Icône basée sur le statut */}
                  <button
                    onClick={() => handleUpdateStatus(sTache.id, sTache.status)}
                    className={`w-9 h-9 rounded-full shrink-0 my-2 mr-3 ${
                      sTache.status === "Terminé"
                        ? "bg-green-500"
                        : "bg-gray-200"
                    }`}
                  >
                    {loadingUpdateSousTache && sTache.id === idUpdate ? (
                      <SpinnerLoading />
                    ) : (
                      <svg
                        className="w-9 h-9 fill-current text-white"
                        viewBox="0 0 36 36"
                      >
                        <path d="M18.3 11.3l-1.4 1.4 4.3 4.3H11v2h10.2l-4.3 4.3 1.4 1.4L25 18z" />
                      </svg>
                    )}
                  </button>

                  {/* Contenu de la sous-tâche */}
                  <div className="grow flex items-center border-b border-gray-100 dark:border-gray-700/60 text-sm py-2">
                    <div className="grow flex justify-between items-center relative">
                      <div className="self-center mb-8">
                        {sTache.libelle && (
                          <a
                            className="font-medium text-gray-800 hover:text-gray-900 dark:text-gray-100 dark:hover:text-white"
                            href="#0"
                          >
                            {sTache.libelle}
                          </a>
                        )}
                      </div>
                      <div className="shrink-0 self-start justify-between w-full flex items-center -bottom-4 -right-2 absolute">
                        <span className="text-xs font-bold text-violet-500">
                          {sTache.responsableNom} {sTache.responsablePrenom}
                        </span>
                        <DangerModal
                          endpoint="sousTaches"
                          refreshList={sousTachesFetch}
                          idObjet={sTache.id}
                          libelleObjet={sTache.libelle}
                        />
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-4 text-xs text-center">
              Aucune sous-tâche ajoutée...
            </div>
          )}

          {/* Gestion des erreurs */}
          {sousTacheError && (
            <div className="mt-4 text-xs text-red-500">{sousTacheError}</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardCard11;

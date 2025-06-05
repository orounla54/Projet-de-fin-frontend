import React, { useState } from "react";
import DangerModal from "./DangerModal";
import AddEvenementTache from "./AddEvenementTache";
import Avatar from "react-avatar";
import axios from "axios";
import AuthService from "../utils/Auth/AuthServices";
import SpinnerLoading from "./SpinnerLoading";
import { baseURL } from "../utils/DataFront/eventTypes";
import DateRefactor from "./DateRefactor";
import DateRefactor1 from "./DateRefactor1";

function EvenementTacheItem({ tache, fetchData, event, responsableLog }) {
  const baseUrl = baseURL;

  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);

  //   console.log(tache)
  const [loading, setLoading] = useState(false);

  const onUpdateStatus = async (tache) => {
    if (!tache || !tache.id) {
      console.error("Tâche invalide ou ID manquant.");
      return;
    }

    setLoading(true);

    // Définition du nouveau statut
    let status;
    switch (tache.status) {
      case "Non-démarré":
        status = "En-cours";
        break;
      case "En-cours":
        status = "Terminé";
        break;
      default:
        status = "Non-démarré";
    }

    try {
      const baseDataObject = {
        status: status,
      };
      const accessToken = AuthService.getAccessToken();

      console.log("Données envoyées :", baseDataObject);

      await axios.put(
        `${baseUrl}/evenementsSociete/taches/${parseInt(tache.id, 10)}`,
        baseDataObject,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      await fetchData();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Erreur inattendue lors de la mise à jour de la tâche";
      console.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <li key={tache?.id} className="sm:flex sm:items-center sm:justify-between">
      <div className="flex items-center text-sm sm:grow">
        {/* Icon */}
        <button
          onClick={() => {
            onUpdateStatus(tache);
          }}
          className={`w-8 h-8 my-2 mr-3 rounded-full ${
            tache?.status === "Terminé"
              ? "bg-green-500"
              : tache?.status === "En-cours"
              ? "bg-yellow-500"
              : "bg-violet-500"
          }  shrink-0`}
        >
          {loading ? (
            <>
              <SpinnerLoading />
            </>
          ) : (
            <>
              <svg
                className="w-8 h-8 fill-current text-yellow-50"
                viewBox="0 0 32 32"
              >
                <path d="M21 14a.75.75 0 0 1-.75-.75 1.5 1.5 0 0 0-1.5-1.5.75.75 0 1 1 0-1.5 1.5 1.5 0 0 0 1.5-1.5.75.75 0 1 1 1.5 0 1.5 1.5 0 0 0 1.5 1.5.75.75 0 1 1 0 1.5 1.5 1.5 0 0 0-1.5 1.5.75.75 0 0 1-.75.75Zm-7 10a1 1 0 0 1-1-1 4 4 0 0 0-4-4 1 1 0 0 1 0-2 4 4 0 0 0 4-4 1 1 0 0 1 2 0 4 4 0 0 0 4 4 1 1 0 0 1 0 2 4 4 0 0 0-4 4 1 1 0 0 1-1 1Z" />
              </svg>
            </>
          )}
        </button>
        {/* Position */}
        <div>
          <div className="font-medium text-gray-800 dark:text-gray-100">
            {tache?.libelle || "Aucun libelle entrer"}
            {tache?.description && (
              <p className="mb-2 text-xs text-justify text-gray-700 dark:text-gray-400">
                {tache?.description.split("\n").map((paragraph, index) => (
                  <p key={index} className="mb-0.5">
                    {paragraph.trim()}
                  </p>
                ))}
              </p>
            )}
          </div>
          {/* heure  */}
          <div className="flex items-center space-x-2 flex-nowrap whitespace-nowrap">
            <div>
              <Avatar
                className="mr-2"
                name={`${tache?.responsables?.nom} ${tache?.responsables?.prenom}`}
                round={true}
                size="18"
                src={tache?.responsables?.image}
              />
              <span className="text-xs">
                <span className="font-semibold">
                  {tache?.responsables?.nom}
                </span>{" "}
                {tache?.responsables?.prenom}
              </span>
            </div>
            <div className="text-gray-400 dark:text-gray-600 flex items-center justify-center">
              .
            </div>
            <div><DateRefactor1 date={tache.dateInscription} /></div>
          </div>
        </div>
      </div>
      {/* controles */}
      <div className="mt-2 sm:ml-2 sm:mt-0">
        <ul className="flex flex-wrap -m-1 sm:justify-end">
          {parseInt(responsableLog.id) === parseInt(event.idResponsable) ||
          parseInt(responsableLog.id) === tache.idResponsable ? (
            <>
              <AddEvenementTache
                tache={tache}
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
            </>
          ) : (
            ""
          )}
          {parseInt(responsableLog.id) === parseInt(event.idResponsable) && (
            <li className="m-1">
              <button className="inline-flex items-center justify-center text-xs font-medium leading-5 rounded-full px-2.5 py-0.5 border border-red-200 dark:border-red-700/60 hover:border-red-300 dark:hover:border-red-600 shadow-sm bg-white dark:bg-gray-800 text-red-500 dark:text-red-400 transition">
                <DangerModal
                  endpoint="tachesEvenement"
                  idObjet={tache.id}
                  libelleObjet={tache.libelle}
                  refreshList={fetchData}
                />
              </button>
            </li>
          )}
        </ul>
      </div>
    </li>
  );
}

export default EvenementTacheItem;

import React, { useState } from "react";
import Avatar from "react-avatar";
import SpinnerLoading from "./SpinnerLoading";
import { baseURL } from "../utils/DataFront/eventTypes";
import AuthService from "../utils/Auth/AuthServices";
import axios from "axios";
import DateRefactor1 from "./DateRefactor1";

function EvenementSocieteDemandeItem({
  demande,
  fetchDataDemande,
  event,
  responsableLog,
}) {
  const baseUrl = baseURL;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const accepteDemande = async (idResponsable) => {
    const idEvent = event?.id;

    // console.log(idEvent, idResponsable)
    try {
      setLoading(true);
      // Récupération du token d'accès
      const accessToken = AuthService.getAccessToken();
      if (!accessToken) {
        throw new Error("Token d'accès manquant. Veuillez vous reconnecter.");
      }
      // Envoi de la requête PUT
      await axios.post(
        `${baseUrl}/accepteDemandeParticipation/societe/evenements/${idEvent}/responsables/${idResponsable}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      await fetchDataDemande();
    } catch (error) {
      console.error("Erreur lors de la modification de l'événement :", error);

      // Gestion des erreurs serveur et erreurs inattendues
      const errorMessage =
        error.response?.data?.message ||
        "Erreur inattendue lors de la modification de l'événement.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  console.log(demande);

  return (
    <li
      key={demande?.id}
      className="sm:flex sm:items-center sm:justify-between"
    >
      <div className="flex items-center text-sm sm:grow">
        {/* Icon */}
        <div className="w-8 h-8 my-2 mr-3 rounded-full shrink-0">
          <Avatar
            className="mr-2"
            name={`${demande?.responsable?.nom} ${demande?.responsable?.prenom}`}
            round={true}
            size="32"
            src={demande?.responsable?.image}
          />
        </div>
        {/* Position */}
        <div>
          <div className="font-medium text-gray-800 dark:text-gray-100">
            {demande?.responsable?.prenom} {demande?.responsable?.nom}
          </div>
          <div className="flex items-center space-x-2 flex-nowrap whitespace-nowrap">
            {demande?.responsable?.service && (
              <>
                <div>{demande?.responsable?.service}</div>
                <div className="text-gray-400 dark:text-gray-600">·</div>
              </>
            )}
            {demande?.responsable?.poste && (
              <>
                <div>{demande?.responsable?.poste}</div>
                <div className="text-gray-400 dark:text-gray-600">·</div>
              </>
            )}
            {demande?.responsable?.position && (
              <>
                <div>{demande?.responsable?.position}</div>
                <div className="text-gray-400 dark:text-gray-600">·</div>
              </>
            )}
            <div><DateRefactor1 date={demande?.dateInscription} /> </div>
          </div>
        </div>
      </div>
      {/* Tags */}
      <div className="mt-2 sm:ml-2 sm:mt-0">
        <ul className="flex flex-wrap -m-1 sm:justify-end">
          <li className="m-1">
            {parseInt(responsableLog.id) === parseInt(event.idResponsable) && (
              <button
                onClick={() => {
                  if (
                    parseInt(responsableLog.id) ===
                    parseInt(event.idResponsable)
                  ) {
                    accepteDemande(demande?.responsable?.id);
                  }
                }}
                className={`${
                  demande?.statusDemande === "Accepter" ? " enabled" : ""
                } inline-flex items-center justify-center text-xs font-medium leading-5 rounded-full px-2.5 py-0.5 border border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 shadow-sm bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 transition`}
              >
                {loading ? <SpinnerLoading /> : <>{demande?.statusDemande}</>}
              </button>
            )}
          </li>
          {demande?.new === 1 && (
            <li className="m-1">
              <button className="inline-flex items-center justify-center text-xs font-medium leading-5 rounded-full px-2.5 py-0.5 border border-green-200 dark:border-green-700/60 hover:border-green-300 dark:hover:border-green-600 shadow-sm bg-white dark:bg-gray-800 text-green-500 dark:text-green-400 transition">
                Nouveau
              </button>
            </li>
          )}
        </ul>
      </div>
    </li>
  );
}

export default EvenementSocieteDemandeItem;

import React, { useState } from "react";
import Avatar from "react-avatar";
import SpinnerLoading from "./SpinnerLoading";
import AuthService from "../utils/Auth/AuthServices";
import axios from "axios";
import { baseURL } from "../utils/DataFront/eventTypes";

function PrioritePagePiloteItem({
  responsable,
  fetchDataPilotes,
  priorite,
  page,
}) {
  const baseUrl = baseURL;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const removeresponsable = async (idResponsable) => {
    if (page === "manage") {
      const idpriorite = priorite?.id;
      // console.log(idpriorite, idResponsable)

      try {
        setLoading(true);
        // Récupération du token d'accès
        const accessToken = AuthService.getAccessToken();
        if (!accessToken) {
          throw new Error("Token d'accès manquant. Veuillez vous reconnecter.");
        }
        // Envoi de la requête PUT
        await axios.delete(
          `${baseUrl}/priorites/${idpriorite}/removeToResponsables/${idResponsable}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        await fetchDataPilotes();
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
    }
  };

  return (
    <li
      key={responsable?.id}
      className="sm:flex sm:items-center sm:justify-between"
    >
      <div className="flex items-center text-sm sm:grow">
        {/* Icon */}
        <div className="w-8 h-8 my-2 mr-3 rounded-full shrink-0">
          <Avatar
            className="mr-2"
            name={`${responsable?.nom} ${responsable?.prenom}`}
            round={true}
            size="32"
            src={responsable?.image}
          />
        </div>
        {/* Position */}
        <div>
          <div className="font-medium text-gray-800 dark:text-gray-100">
            {responsable?.prenom} {responsable?.nom}
          </div>
          <div className="flex flex-wrap items-center space-x-2 whitespace-nowrap">
            {responsable?.service && (
              <>
                <div>{responsable?.service}</div>
              </>
            )}
            {responsable?.poste && (
              <>
                <div className="text-gray-400 dark:text-gray-600">·</div>
                <div>{responsable?.poste}</div>
              </>
            )}
            {responsable?.position && (
              <>
                <div className="text-gray-400 dark:text-gray-600">·</div>
                <div>{responsable?.position}</div>
              </>
            )}
          </div>
        </div>
      </div>
      {/* Tags */}
      <div className="mt-2 sm:ml-2 sm:mt-0">
        <ul className="flex flex-wrap -m-1 sm:justify-end">
          <li className="m-1">
            <>
              <button
                onClick={() => {}}
                className={`inline-flex items-center justify-center text-xs font-medium leading-5 rounded-full px-2.5 py-0.5 border shadow-sm transition ${
                  responsable.role === "Pilote"
                    ? "border-violet-200 dark:border-violet-700/60 hover:border-violet-300 dark:hover:border-violet-600 bg-violet-50 dark:bg-violet-900 text-violet-500 dark:text-violet-400"
                    : "border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400"
                }`}
              >
                {responsable?.role}
              </button>
              {page === "manage" && (
                <button
                  onClick={() => {
                    removeresponsable(responsable?.id);
                  }}
                  className={`inline-flex ml-1 items-center justify-center text-xs font-medium leading-5 rounded-full px-2.5 py-0.5 border shadow-sm transition border-red-200 dark:border-red-700/60 hover:border-red-300 dark:hover:border-red-600 bg-white dark:bg-gray-800 text-red-500 dark:text-red-400`}
                >
                  {loading ? <SpinnerLoading deleteLoading /> : <>Retirer</>}
                </button>
              )}
            </>
          </li>
        </ul>
      </div>
    </li>
  );
}

export default PrioritePagePiloteItem;

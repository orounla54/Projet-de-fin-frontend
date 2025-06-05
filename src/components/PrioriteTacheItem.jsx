import React, { useState } from "react";
import DangerModal from "./DangerModal";
import Avatar from "react-avatar";
import axios from "axios";
import AuthService from "../utils/Auth/AuthServices";
import SpinnerLoading from "./SpinnerLoading";
import { baseURL } from "../utils/DataFront/eventTypes";
import DateRefactor1 from "./DateRefactor1";
import { Link } from "react-router-dom";
import DescriptionFormat from "./DescriptionFormat";

function PrioriteTacheItem({
  tache,
  fetchData,
  priorite,
  responsableLog,
  page,
  
}) {
  const baseUrl = baseURL;

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

    if (page === "responsable") {
      try {
        const baseDataObject = {
          status: status,
        };
        const accessToken = AuthService.getAccessToken();

        console.log("Données envoyées :", baseDataObject);

        await axios.put(
          `${baseUrl}/taches/${parseInt(tache.id, 10)}`,
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
    }
  };
  console.log(tache);

  return (
    <li key={tache?.id} className="sm:flex sm:items-center sm:justify-between">
      <div className="flex items-center text-sm sm:grow">
        {/* Icon */}
        <button
          onClick={() => {
            if (page === "responsable") {
              onUpdateStatus(tache);
            }
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
                className="w-8 h-8 fill-current text-gray-50"
                viewBox="0 0 32 32"
              >
                <path d="M21 14a.75.75 0 0 1-.75-.75 1.5 1.5 0 0 0-1.5-1.5.75.75 0 1 1 0-1.5 1.5 1.5 0 0 0 1.5-1.5.75.75 0 1 1 1.5 0 1.5 1.5 0 0 0 1.5 1.5.75.75 0 1 1 0 1.5 1.5 1.5 0 0 0-1.5 1.5.75.75 0 0 1-.75.75Zm-7 10a1 1 0 0 1-1-1 4 4 0 0 0-4-4 1 1 0 0 1 0-2 4 4 0 0 0 4-4 1 1 0 0 1 2 0 4 4 0 0 0 4 4 1 1 0 0 1 0 2 4 4 0 0 0-4 4 1 1 0 0 1-1 1Z" />
              </svg>
            </>
          )}
        </button>
        {/* Position */}
        <div>
          <div className="font-medium text-gray-800 transition dark:text-gray-200 dark:hover:text-gray-100 hover:text-violet-500">
            <Link to={page === "responsable" ? `/taches/${tache?.id}` : "#"}>
              {tache?.libelle || "Aucun libelle entrer"}
            </Link>
            {tache?.description && (
              <DescriptionFormat length={75} description={tache?.description} />
            )}
          </div>
          {/* heure  */}
          <div className="flex flex-wrap items-center space-x-2 whitespace-nowrap">
            <div>
              <div className="flex -ml-px -space-x-3 shrink-0">
                {tache?.responsablesJson &&
                tache?.responsablesJson.length > 0 ? (
                  tache?.responsablesJson.length === 1 ? (
                    // Cas où il y a un seul responsable
                    <div className="flex items-center space-x-1">
                      <Avatar
                        name={`${tache?.responsablesJson[0]?.nom} ${tache?.responsablesJson[0]?.prenom}`}
                        round={true}
                        size="18"
                        src={tache?.responsablesJson[0]?.photoProfileLien}
                      />
                      <span className="text-xs font-medium">
                        {`${tache?.responsablesJson[0]?.prenom} ${tache?.responsablesJson[0]?.nom}`}
                      </span>
                    </div>
                  ) : (
                    <>
                      <div className="flex -ml-px -space-x-3">
                        {tache?.responsablesJson
                          .slice(0, 3)
                          .map((responsable) => (
                            <span key={responsable?.id}>
                              <Avatar
                                name={`${responsable?.nom} ${responsable?.prenom}`}
                                round={true}
                                size="18"
                                src={responsable?.photoProfileLien}
                              />
                            </span>
                          ))}
                      </div>
                      <div className="text-xs italic font-medium text-gray-400 dark:text-gray-500">
                        {Array.isArray(tache?.responsablesJson) &&
                        tache?.responsablesJson.length > 3
                          ? tache?.responsablesJson.length - 3 > 0
                            ? `+${tache?.responsablesJson.length - 3}`
                            : ""
                          : ""}
                      </div>
                    </>
                  )
                ) : (
                  <span className="text-xs">
                    Aucun responsable pour cette tâche...
                  </span>
                )}
              </div>
            </div>
            {tache?.important === 1 && (
              <>
                <div className="text-gray-400 dark:text-gray-600">·</div>
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-4 fill-yellow-500"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z"
                    clipRule="evenodd"
                  />
                </svg>
              </>
            )}
            {tache?.urgent === 1 && (
              <>
                <div className="text-gray-400 dark:text-gray-600">·</div>
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-5 fill-orange-500"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18Zm1 5a1 1 0 1 0-2 0v4a1 1 0 1 0 2 0V8Zm-1 8.25a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5Z"
                    clipRule="evenodd"
                  />
                </svg>
              </>
            )}{" "}
            {tache?.private === 1 ? (
              <>
                <div className="text-gray-400 dark:text-gray-600">·</div>

                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="size-4 fill-blue-500"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 7a5 5 0 1 1 3.61 4.804l-1.903 1.903A1 1 0 0 1 9 14H8v1a1 1 0 0 1-1 1H6v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-2a1 1 0 0 1 .293-.707L8.196 8.39A5.002 5.002 0 0 1 8 7Zm5-3a.75.75 0 0 0 0 1.5A1.5 1.5 0 0 1 14.5 7 .75.75 0 0 0 16 7a3 3 0 0 0-3-3Z"
                    clipRule="evenodd"
                  />
                </svg>
              </>
            ) : (
              <>
                <div className="text-gray-400 dark:text-gray-600">·</div>
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="size-5 fill-blue-500"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-1.503.204A6.5 6.5 0 1 1 7.95 3.83L6.927 5.62a1.453 1.453 0 0 0 1.91 2.02l.175-.087a.5.5 0 0 1 .224-.053h.146a.5.5 0 0 1 .447.724l-.028.055a.4.4 0 0 1-.357.221h-.502a2.26 2.26 0 0 0-1.88 1.006l-.044.066a2.099 2.099 0 0 0 1.085 3.156.58.58 0 0 1 .397.547v1.05a1.175 1.175 0 0 0 2.093.734l1.611-2.014c.192-.24.296-.536.296-.842 0-.316.128-.624.353-.85a1.363 1.363 0 0 0 .173-1.716l-.464-.696a.369.369 0 0 1 .527-.499l.343.257c.316.237.738.275 1.091.098a.586.586 0 0 1 .677.11l1.297 1.297Z"
                    clipRule="evenodd"
                  />
                </svg>
              </>
            )}
            {tache?.enRetard === 1 && (
              <>
                <div className="text-gray-400 dark:text-gray-600">·</div>
                <svg
                  className="fill-current shrink-0"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                >
                  <path
                    className="text-orange-300"
                    d="M4 8H0v4.9c0 1 .7 1.9 1.7 2.1 1.2.2 2.3-.8 2.3-2V8z"
                  />
                  <path
                    className="text-orange-500"
                    d="M15 1H7c-.6 0-1 .4-1 1v11c0 .7-.2 1.4-.6 2H13c1.7 0 3-1.3 3-3V2c0-.6-.4-1-1-1z"
                  />
                </svg>
              </>
            )}{" "}
            <div className="text-gray-400 dark:text-gray-600">·</div>
            <div>
              <DateRefactor1 date={tache.dateInscription} />
            </div>
          </div>
        </div>
      </div>
      {/* controles */}
      <div className="relative mt-2 sm:ml-2 sm:mt-0 group">
        <ul className="flex flex-wrap -m-1 sm:justify-end">
          {tache?.responsablesJson.some(
            (responsable) =>
              parseInt(responsable?.id) === parseInt(responsableLog?.id) &&
              page === "responsable"
          ) ? (
            <>
              <li className="m-1">
                <Link
                  to={
                    page === "responsable"
                      ? `/modification/taches/${tache?.id}`
                      : "#"
                  }
                  className="inline-flex items-center justify-center text-xs font-medium leading-5 rounded-full px-2.5 py-0.5 border border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 shadow-sm bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 transition"
                >
                  Modifier
                </Link>
              </li>
            </>
          ) : (
            ""
          )}
          {tache?.newTaches === 1 && (
            <>
              <li className="m-1">
                <button className="inline-flex items-center justify-center text-xs font-medium leading-5 rounded-full px-2.5 py-0.5 border border-green-200 dark:border-green-700/60 hover:border-green-300 dark:hover:border-green-600 shadow-sm dark:bg-transparent text-green-500 dark:text-green-400 transition">
                  Nouveau
                </button>
              </li>
            </>
          )}{" "}
          {parseInt(responsableLog.id) === parseInt(tache.idResponsable) &&
            page === "responsable" && (
              <li className="absolute transition-opacity duration-300 opacity-0 -top-7 -right-4 group-hover:opacity-100">
                <DangerModal
                  endpoint="taches"
                  idObjet={tache.id}
                  libelleObjet={tache.libelle}
                  refreshList={fetchData}
                />
              </li>
            )}
        </ul>
      </div>
    </li>
  );
}

export default PrioriteTacheItem;

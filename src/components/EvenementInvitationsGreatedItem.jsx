import React, { useState } from "react";
import { baseURL } from "../utils/DataFront/eventTypes";
import AuthService from "../utils/Auth/AuthServices";
import axios from "axios";
import SpinnerLoading from "./SpinnerLoading";

function EvenementInvitationsGreatedItem({
  invitation,
  fetchData,
  event,
  responsableLog,
  repertoire
}) {
  const baseUrlBa = baseURL;

  const [loadingRepertoireAdd, setLoadingRepertoireAdd] = useState(false);

  const addInvitesToRepertoire = async () => {
    setLoadingRepertoireAdd(true);
    const accessToken = AuthService.getAccessToken();

    try {
      await axios.post(`${baseUrlBa}/repertoires`, invitation, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      await fetchData();
    } catch (error) {
      console.error("Erreur lors de l'ajout au répertoire :", error);
    } finally {
      setLoadingRepertoireAdd(false);
    }
  };
  //   console.log(invitation);
  const formateDate = (date) => {
    const inscriptionDate = new Date(date);
    const today = new Date();

    // Vérification si la date correspond à aujourd'hui
    const isToday =
      inscriptionDate.getDate() === today.getDate() &&
      inscriptionDate.getMonth() === today.getMonth() &&
      inscriptionDate.getFullYear() === today.getFullYear();

    if (isToday) {
      return `Aujourd'hui, ${inscriptionDate.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      })}`; // Affiche "Aujourd'hui, HH:mm"
    }

    // Sinon, formater avec la date et l'heure
    return inscriptionDate.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <li
      key={invitation?.id}
      className="sm:flex sm:items-center sm:justify-between"
    >
      <div className="flex items-center text-sm sm:grow">
        {/* Icon */}
        <div
          className={`w-8 h-8 my-2 mr-3 rounded-full ${
            invitation?.mailAutorisation ? "bg-green-500" : "bg-yellow-500"
          }  shrink-0`}
        >
          <svg
            className="w-8 h-8 fill-current text-gray-50"
            viewBox="0 0 32 32"
          >
            <path d="M21 14a.75.75 0 0 1-.75-.75 1.5 1.5 0 0 0-1.5-1.5.75.75 0 1 1 0-1.5 1.5 1.5 0 0 0 1.5-1.5.75.75 0 1 1 1.5 0 1.5 1.5 0 0 0 1.5 1.5.75.75 0 1 1 0 1.5 1.5 1.5 0 0 0-1.5 1.5.75.75 0 0 1-.75.75Zm-7 10a1 1 0 0 1-1-1 4 4 0 0 0-4-4 1 1 0 0 1 0-2 4 4 0 0 0 4-4 1 1 0 0 1 2 0 4 4 0 0 0 4 4 1 1 0 0 1 0 2 4 4 0 0 0-4 4 1 1 0 0 1-1 1Z" />
          </svg>
        </div>
        {/* Position */}
        <div>
          <div className=" text-gray-800 dark:text-gray-100">
            <span className="font-medium">
              {invitation?.prenom || "Aucun prenom inscrire"}
            </span>{" "}
            <span>{invitation?.nom || "Aucun nom inscrire"}</span>,{" "}
            <span>{invitation?.fonction || "Aucun nom inscrire"}</span>, à{" "}
            <span>{invitation?.societe}</span>
          </div>
          {/* heure  */}
          <div className="flex items-center space-x-2 flex-wrap whitespace-nowrap">
            <div>{formateDate(invitation?.dateInscription)}</div>
            <div className="text-gray-400 dark:text-gray-600 ">.</div>
            <div className="ml-1 flex items-center gap-0.5 ">
              <svg
                viewBox="0 0 16 16"
                fill="currentColor"
                className="size-3 fill-violet-500"
              >
                <path
                  fillRule="evenodd"
                  d="M11.89 4.111a5.5 5.5 0 1 0 0 7.778.75.75 0 1 1 1.06 1.061A7 7 0 1 1 15 8a2.5 2.5 0 0 1-4.083 1.935A3.5 3.5 0 1 1 11.5 8a1 1 0 0 0 2 0 5.48 5.48 0 0 0-1.61-3.889ZM10 8a2 2 0 1 0-4 0 2 2 0 0 0 4 0Z"
                  clipRule="evenodd"
                />
              </svg>
              <a
                className="text-sm font-medium whitespace-nowrap text-violet-500 hover:text-violet-600 dark:hover:text-violet-400"
                href={`mailto:${invitation?.email || "#"}`}
              >
                {invitation?.email}
              </a>
              {invitation?.email_secondaire && (
                <>
                  <svg
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="size-3 ml-1"
                  >
                    <path
                      fillRule="evenodd"
                      d="M11.89 4.111a5.5 5.5 0 1 0 0 7.778.75.75 0 1 1 1.06 1.061A7 7 0 1 1 15 8a2.5 2.5 0 0 1-4.083 1.935A3.5 3.5 0 1 1 11.5 8a1 1 0 0 0 2 0 5.48 5.48 0 0 0-1.61-3.889ZM10 8a2 2 0 1 0-4 0 2 2 0 0 0 4 0Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <a
                    className="text-sm font-medium whitespace-nowrap "
                    href={`mailto:${invitation?.email_secondaire || "#"}`}
                  >
                    {" "}
                    {invitation?.email_secondaire}
                  </a>
                </>
              )}
            </div>
            <div className="text-gray-400 dark:text-gray-600 ">.</div>
            <div>{invitation?.numero}</div>
            {invitation?.numero_secondaire && (
              <>
                <div className="text-gray-400 dark:text-gray-600 ">.</div>
                <div>{invitation?.numero}</div>
              </>
            )}
          </div>
        </div>
      </div>
      {/* controles */}
      {!repertoire.some(
        (item) =>
          item.email === invitation.email &&
          item.numero === invitation.numero &&
          item.numero_secondaire === invitation.numero_secondaire &&
          item.email_secondaire === invitation.email_secondaire
      ) && (
        <>
          {loadingRepertoireAdd ? (
            <SpinnerLoading />
          ) : (
            <>
              <div className="mt-2 sm:ml-2 sm:mt-0">
                {parseInt(responsableLog.id) ===
                  parseInt(event.idResponsable) && (
                  <ul className="flex flex-wrap -m-1 sm:justify-end">
                    <li className="m-1">
                      <button
                        onClick={(e) => {
                          addInvitesToRepertoire();
                        }}
                        className="inline-flex items-center justify-center text-xs font-medium leading-5 rounded-full px-2.5 py-0.5 border border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 shadow-sm bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 transition"
                      >
                        Ajouter au répertoire
                      </button>
                    </li>
                  </ul>
                )}
              </div>
            </>
          )}
        </>
      )}
    </li>
  );
}

export default EvenementInvitationsGreatedItem;

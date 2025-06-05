import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UserImage05 from "../images/user-32-05.jpg";
import Avatar from "react-avatar";
import LibelleFormat from "./LibelleFormat";

function TachesRespItems({ task }) {
  const [responsables, setResponsables] = useState([]);
  const [sousTaches, setSoustache] = useState([]);

  useEffect(() => {
    if (task && task?.responsablesJson) {
      try {
        // const parsedResponsables = JSON.parse(task?.responsablesJson).map(
        //   (item) => JSON.parse(item.responsable)
        // );
        setResponsables(task?.responsablesJson);
        // console.log(responsables);
      } catch (error) {
        console.error("Erreur de parsing JSON :", error);
      }
    } else {
      console.warn("responsablesJson est undefined");
    }
  }, [task]);

  useEffect(() => {
    if (task && task.SousTachesJson) {
      try {
        // const parsedSousTache = JSON.parse(task.SousTachesJson).map((item) =>
        //   JSON.parse(item.sousTache)
        // );
        setSoustache(task?.SousTachesJson);
        console.log(sousTaches);
      } catch (error) {
        console.error("Erreur de parsing JSON :", error);
      }
    } else {
      console.warn("sousTachesJson est undefined");
    }
  }, [task]);

  return (
    <div
      key={task.id}
      className="p-4 bg-white shadow-sm dark:bg-gray-800 rounded-xl"
      draggable="true"
    >
      <div className="sm:flex sm:justify-between sm:items-start">
        <div className="grow mt-0.5 mb-3 sm:mb-0 space-y-3">
          <div className="flex items-center">
            <button className="mr-2 cursor-move">
              <span className="sr-only">Drag</span>
              <svg
                className="w-3 h-3 fill-gray-400 dark:fill-gray-500"
                viewBox="0 0 12 12"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0 1h12v2H0V1Zm0 4h12v2H0V5Zm0 4h12v2H0V9Z"
                  fillRule="evenodd"
                />
              </svg>
            </button>
            <label className="flex items-center">
              {task && task.status === "Terminé" && (
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded-full form-checkbox peer"
                  defaultChecked={task.status === "Terminé"}
                  disabled
                />
              )}
              <span className="ml-2 font-medium text-gray-800 dark:text-gray-100">
                <Link to={`/taches/${task.id}`}>{task.libelle}</Link>
              </span>
            </label>
          </div>
          <ul className="pl-12 space-y-3">
            {sousTaches && sousTaches.length > 0 ? (
              <div>
                {sousTaches.slice(0, 7).map((sousTache, index) => (
                  <li className="mb-2" key={index}>
                    <label className="flex items-center ">
                      <input
                        type="checkbox"
                        className="w-5 h-5 rounded-full form-checkbox peer"
                        defaultChecked={sousTache.status === "Terminé"}
                        disabled
                      />
                      <span className="ml-3 text-sm text-gray-800 dark:text-gray-100">
                        {sousTache && sousTache.libelle ? (
                          <LibelleFormat libelle={sousTache.libelle} />
                        ) : (
                          "Pas de libelle ajouté..."
                        )}
                      </span>
                    </label>
                  </li>
                ))}
              </div>
            ) : (
              <div></div>
            )}
          </ul>
        </div>
        {/* Right side */}
        <div className="flex items-center justify-end space-x-3">
          {/* Avatars */}
          <div className="flex -ml-px -space-x-3 shrink-0">
            <a className="flex items-center gap-2" href="#0">
              <>
                {sousTaches.length < 1 && (
                  <div className="text-xs text-yellow-600">
                    {new Date(task.dateInscription).toLocaleDateString(
                      "fr-FR",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </div>
                )}
                <div className="flex -ml-px -space-x-3 shrink-0">
                  {responsables && responsables.length > 0 ? (
                    responsables.map((responsable) => (
                      <div>
                        <span key={responsable.id}>
                          <Avatar
                            name={`${responsable.nom} ${responsable.prenom}`}
                            round={true}
                            size="24"
                            src={responsable.photoProfileLien} // Le lien de l'image
                          />
                        </span>

                        {responsables.length < 2 && (
                          <span className="text-xs font-bold">{`${responsable.nom} ${responsable.prenom}`}</span>
                        )}
                      </div>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400">
                      Aucun responsable pour cette tache...
                    </span>
                  )}
                </div>
              </>
            </a>
          </div>
          {/* To-do info */}
          <div className="flex items-center gap-1 ml-3 text-gray-400 dark:text-gray-500">
            {/* Like button */}
            {task && task.important ? (
              <>
                <button className="flex items-center">
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-5 fill-yellow-500"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </>
            ) : (
              <></>
            )}

            {task && task.private ? (
              <>
                <button className="flex items-center">
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-5 fill-blue-400"
                  >
                    <path
                      fillRule="evenodd"
                      d="M15.75 1.5a6.75 6.75 0 0 0-6.651 7.906c.067.39-.032.717-.221.906l-6.5 6.499a3 3 0 0 0-.878 2.121v2.818c0 .414.336.75.75.75H6a.75.75 0 0 0 .75-.75v-1.5h1.5A.75.75 0 0 0 9 19.5V18h1.5a.75.75 0 0 0 .53-.22l2.658-2.658c.19-.189.517-.288.906-.22A6.75 6.75 0 1 0 15.75 1.5Zm0 3a.75.75 0 0 0 0 1.5A2.25 2.25 0 0 1 18 8.25a.75.75 0 0 0 1.5 0 3.75 3.75 0 0 0-3.75-3.75Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </>
            ) : (
              <>
                <button className="flex items-center">
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-5 fill-blue-400"
                  >
                    <path d="M15.75 8.25a.75.75 0 0 1 .75.75c0 1.12-.492 2.126-1.27 2.812a.75.75 0 1 1-.992-1.124A2.243 2.243 0 0 0 15 9a.75.75 0 0 1 .75-.75Z" />
                    <path
                      fillRule="evenodd"
                      d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM4.575 15.6a8.25 8.25 0 0 0 9.348 4.425 1.966 1.966 0 0 0-1.84-1.275.983.983 0 0 1-.97-.822l-.073-.437c-.094-.565.25-1.11.8-1.267l.99-.282c.427-.123.783-.418.982-.816l.036-.073a1.453 1.453 0 0 1 2.328-.377L16.5 15h.628a2.25 2.25 0 0 1 1.983 1.186 8.25 8.25 0 0 0-6.345-12.4c.044.262.18.503.389.676l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 0 1-1.161.886l-.143.048a1.107 1.107 0 0 0-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 0 1-1.652.928l-.679-.906a1.125 1.125 0 0 0-1.906.172L4.575 15.6Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </>
            )}
            {task && task.urgent ? (
              <>
                <button className="flex items-center">
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6 fill-orange-500"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18Zm1 5a1 1 0 1 0-2 0v4a1 1 0 1 0 2 0V8Zm-1 8.25a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TachesRespItems;

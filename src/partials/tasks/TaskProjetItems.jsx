import React, { useEffect, useState } from "react";
import LibelleFormat from "../../components/LibelleFormat";
import { useGetData } from "../../utils/Requests/RequestService";
import { Link } from "react-router-dom";
import Avatar from "react-avatar";
import AlertBadge from "../../components/AlertBadge";

function TaskProjetItems({ tache }) {
  const [responsables, setResponsables] = useState([]);
  const [sousTaches, setSoustache] = useState([]);
  const [imgsTache, setImgsTache] = useState([]);

  useEffect(() => {
    if (tache) {
      try {
        // Vérifier si responsablesJson existe et est une chaîne valide
        if (tache.responsablesJson) {
          const parsedResponsables = JSON.parse(tache.responsablesJson)
            .map((item) => {
              try {
                return JSON.parse(item.responsable);
              } catch (err) {
                console.error("Erreur de parsing pour un responsable :", err);
                return null; // Retourner null pour les responsables non valides
              }
            })
            .filter(Boolean); // Filtrer les valeurs null

          setResponsables(parsedResponsables);
          console.log("Responsables :", parsedResponsables);
        } else {
          console.warn("responsablesJson est undefined ou vide");
        }

        // Vérifier si SousTachesJson existe et est une chaîne valide
        if (tache.SousTachesJson) {
          const parsedSousTache = JSON.parse(tache.SousTachesJson)
            .map((item) => {
              try {
                return JSON.parse(item.sousTache);
              } catch (err) {
                console.error("Erreur de parsing pour une sous-tâche :", err);
                return null; // Retourner null pour les sous-tâches non valides
              }
            })
            .filter(Boolean); // Filtrer les valeurs null

          setSoustache(parsedSousTache);
          console.log("Sous-tâches :", parsedSousTache);
        } else {
          console.warn("SousTachesJson est undefined ou vide");
        }
      } catch (error) {
        console.error("Erreur générale de parsing JSON :", error);
      }
    }
  }, [tache]);
  //get imgs tache
  const { data: imagesTache } = useGetData(`ImgsTache/${tache.id}`);

  useEffect(() => {
    if (imagesTache) {
      setImgsTache(imagesTache.documents);
    }
  }, [imagesTache]);

  const totalSousTache = sousTaches.length; // Total des sous-tâches
  const totalSousTacheTerminé = sousTaches.filter(
    (e) => e.status === "Terminé"
  ).length; // Nombre de sous-tâches terminées;

  return (
    <article
      key={tache.id}
      className="py-4 border-b border-gray-200 dark:border-gray-700/60"
    >
      <header className="flex items-start mb-2">
        <div className="mt-2 mr-3">
          <svg
            className="shrink-0 fill-current"
            width="16"
            height="16"
            viewBox="0 0 16 16"
          >
            <path
              className={`${
                tache.enRetard === 1
                  ? "text-orange-300"
                  : tache.status === "Terminé"
                  ? "text-green-300"
                  : "text-violet-300"
              }`}
              d="M4 8H0v4.9c0 1 .7 1.9 1.7 2.1 1.2.2 2.3-.8 2.3-2V8z"
            />
            <path
              className={`${
                tache.enRetard === 1
                  ? "text-orange-500"
                  : tache.status === "Terminé"
                  ? "text-green-500"
                  : "text-violet-500"
              }`}
              d="M15 1H7c-.6 0-1 .4-1 1v11c0 .7-.2 1.4-.6 2H13c1.7 0 3-1.3 3-3V2c0-.6-.4-1-1-1z"
            />
          </svg>
        </div>
        <div className="flex gap-2 items-center justify-between w-full">
          <Link
            to={`/taches/${tache.id}`}
            className="text-xl leading-snug text-gray-800 dark:text-gray-100 font-bold"
          >
            {tache && tache.libelle ? (
              <>
                {tache.libelle && tache.libelle.length > 50
                  ? `${tache.libelle.slice(0, 50)}...`
                  : tache.libelle}
              </>
            ) : (
              "Aucun libelle ajouter..."
            )}
          </Link>
          <span className="text-xs">
            {tache && tache.status ? (
              <>
                {tache.status === "Non-démaré" ? (
                  <div className="text-xs inline-flex font-medium bg-gray-400/20 text-gray-500 dark:text-gray-400 rounded-full text-center px-2.5 py-1">
                    {tache.status}
                  </div>
                ) : tache.status === "En-cours" ? (
                  <div className="text-xs inline-flex font-medium bg-blue-500/20 text-blue-600 rounded-full text-center px-2.5 py-1">
                    {tache.status}
                  </div>
                ) : tache.status === "Terminé" ? (
                  <div className="text-xs inline-flex font-medium bg-green-500/20 text-green-600 rounded-full text-center px-2.5 py-1">
                    {tache.status}
                  </div>
                ) : (
                  ""
                )}
              </>
            ) : (
              "Aucun status..."
            )}
          </span>
        </div>
      </header>
      <div className="">
        <div className="mb-3 ">
          {tache && tache.description ? (
            <>
              {tache.description && tache.description.length > 200
                ? `${tache.description.slice(0, 220)}...`
                : tache.description}
            </>
          ) : (
            <span className="text-xs"></span>
          )}
        </div>
        {/* images */}
        {imgsTache && imgsTache.length > 0 ? (
          <>
            <div>
              <div className="grid grid-cols-3 gap-2 my-6">
                {imgsTache.slice(0, 3).map((img) => (
                  <>
                    <a className="block relative" href={img.lien}>
                      <img
                        className="w-full rounded-sm"
                        src={img.lien}
                        width="203"
                        height="152"
                        alt={img.libelle}
                      />
                    </a>
                  </>
                ))}
              </div>
            </div>
          </>
        ) : (
          <></>
        )}
        <div className="flex justify-between items-center">
          <ul className="flex flex-wrap">
            <li className="flex items-center after:block after:content-['·'] last:after:content-[''] after:text-sm after:text-gray-400 dark:after:text-gray-600 after:px-2">
              <a
                className={`${
                  tache.enRetard === 1
                    ? "text-orange-500 hover:text-orange-600 dark:hover:text-orange-400"
                    : tache.status === "Terminé"
                    ? "text-green-500 hover:text-green-600 dark:hover:text-green-400"
                    : "text-violet-500 hover:text-violet-600 dark:hover:text-violet-400"
                } text-sm font-medium`}
              >
                {/* Date */}
                {tache && tache.deadline ? (
                  <>
                    <div className="flex items-center ml-3">
                      <svg
                        className="shrink-0 fill-current mr-1.5"
                        width="14"
                        height="14"
                        viewBox="0 0 16 16"
                      >
                        <path d="M5 4a1 1 0 0 0 0 2h6a1 1 0 1 0 0-2H5Z" />
                        <path d="M4 0a4 4 0 0 0-4 4v8a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4V4a4 4 0 0 0-4-4H4ZM2 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4Z" />
                      </svg>
                      <div className="text-xs">
                        {new Date(tache.deadline).toLocaleDateString("fr-FR", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                  </>
                ) : (
                  <span
                    className={`${
                      tache.enRetard === 1
                        ? "text-orange-500 hover:text-orange-600 dark:hover:text-orange-400"
                        : tache.status === "Terminé"
                        ? "text-green-500 hover:text-green-600 dark:hover:text-green-400"
                        : "text-violet-500 hover:text-violet-600 dark:hover:text-violet-400"
                    } text-sm font-medium`}
                  >
                    Pas de deadline definie
                  </span>
                )}
              </a>
            </li>
            <li className="flex items-center after:block after:content-['·'] last:after:content-[''] after:text-sm after:text-gray-400 dark:after:text-gray-600 after:px-2">
              <a className="text-sm font-medium p-1 px-2 text-center ">
                {/* Right side */}
                <div className="flex items-center gap-1">
                  {/* Like button */}
                  {tache && tache.important ? (
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

                  {tache && tache.private ? (
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
                  {tache && tache.urgent ? (
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
              </a>
            </li>
            {totalSousTache > 0 && (
              <li className="flex items-center after:block after:content-['·'] last:after:content-[''] after:text-sm after:text-gray-400 dark:after:text-gray-600 after:px-2">
                <a
                  className="text-sm flex items-center font-medium text-violet-500 hover:text-violet-600 dark:hover:text-violet-400"
                  href="#0"
                >
                  {totalSousTache > 0 && (
                    <>
                      <svg
                        className={`shrink-0 fill-current mr-1.5 ${
                          totalSousTacheTerminé === totalSousTache
                            ? "text-green-500 dark:text-green-400"
                            : tache.enRetard === 0
                            ? "text-violet-500 dark:text-violet-400"
                            : "text-orange-500 dark:text-orange-400"
                        } text-xs`}
                        width="14"
                        height="14"
                        viewBox="0 0 16 16"
                      >
                        <path d="M6.974 14c-.3 0-.7-.2-.9-.5l-2.2-3.7-2.1 2.8c-.3.4-1 .5-1.4.2-.4-.3-.5-1-.2-1.4l3-4c.2-.3.5-.4.9-.4.3 0 .6.2.8.5l2 3.3 3.3-8.1c0-.4.4-.7.8-.7s.8.2.9.6l4 8c.2.5 0 1.1-.4 1.3-.5.2-1.1 0-1.3-.4l-3-6-3.2 7.9c-.2.4-.6.6-1 .6z" />
                      </svg>
                      <div
                        className={`text-gray-500 dark:text-gray-400 ${
                          totalSousTacheTerminé === totalSousTache
                            ? "text-green-500 dark:text-green-400"
                            : tache.enRetard === 0
                            ? "text-violet-500 dark:text-violet-400"
                            : "text-orange-500 dark:text-orange-400"
                        } text-xs`}
                      >
                        {totalSousTacheTerminé}/{totalSousTache}
                      </div>
                    </>
                  )}
                </a>
              </li>
            )}
            {tache.enRetard === 1 && (
              <li className="flex items-center after:block after:content-['·'] last:after:content-[''] after:text-sm after:text-gray-400 dark:after:text-gray-600 after:px-2">
                <AlertBadge />
              </li>
            )}
          </ul>
          <div className="flex shrink-0 -space-x-3 -ml-px">
            {responsables && responsables.length > 0 ? (
              responsables.map((responsable) => (
                <span key={responsable.id}>
                  <Avatar
                    name={`${responsable.nom} ${responsable.prenom}`}
                    round={true}
                    size="24"
                    src={responsable.photoProfileLien}
                  />
                </span>
              ))
            ) : (
              <span className="text-xs">
                Aucun responsable pour cette tache...
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export default TaskProjetItems;

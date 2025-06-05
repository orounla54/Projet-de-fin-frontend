import React, { use, useEffect, useState } from "react";

import UserImage01 from "../../images/user-28-07.jpg";
import UserImage02 from "../../images/user-28-11.jpg";
import { Link } from "react-router-dom";
import Avatar from "react-avatar";
import DescriptionFormat from "../../components/DescriptionFormat";
import LibelleFormat from "../../components/LibelleFormat";
import { useGetData } from "../../utils/Requests/RequestService";
import SpinnerLoading from "../../components/SpinnerLoading";

function Task01({ tache, sousTache }) {
  const [responsables, setResponsables] = useState([]);
  const [sousTaches, setSoustache] = useState([]);
  const [imgsTache, setImgsTache] = useState([]);
  console.log(tache);
  console.log(sousTache);

  useEffect(() => {
    if (tache && tache.responsablesJson) {
      try {
        // const parsedResponsables = JSON.parse(tache.responsablesJson).map(
        //   (item) => JSON.parse(item.responsable)
        // );
        setResponsables(tache.responsablesJson);
        // console.log(responsables);
      } catch (error) {
        console.error("Erreur de parsing JSON responsables :", error);
      }
    } else {
      // console.warn("responsablesJson est undefined");
    }
  }, [tache]);

  useEffect(() => {
    if (sousTache === true && tache.SousTachesJson) {
      try {
        // const parsedSousTache = JSON.parse(tache.SousTachesJson).map((item) =>
        //   JSON.parse(item.sousTache)
        // );
        setSoustache(tache.SousTachesJson);
        // console.log(sousTaches);
      } catch (error) {
        console.error("Erreur de parsing JSON :", error);
      }
    } else {
      // console.warn("sousTachesJson est undefined");
    }
  }, [sousTache]);
  //get imgs tache
  const {
    data: imagesTache,
    loading: imagesTacheLoading,
    error: imagesTacheError,
    fetchData: fetchDataIMG,
  } = useGetData(`ImgsTache/${tache.id}`);

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
    <div
      className="p-4 bg-white shadow-sm dark:bg-gray-800 rounded-xl"
      key={tache.id}
    >
      {/* Body */}
      <div className="mb-3">
        {/* Title */}
        <h2 className="flex items-center justify-between m-1 font-semibold text-gray-800 dark:text-gray-100">
          <Link to={`/taches/${tache.id}`}>
            {tache && tache.libelle ? (
              <LibelleFormat libelle={tache.libelle} />
            ) : (
              "Aucun libelle ajouté"
            )}
          </Link>
          <div className="flex items-center ml-3 text-gray-400 dark:text-gray-500 ">
            {totalSousTache > 0 && (
              <>
                <svg
                  className={`shrink-0 fill-current mr-1.5 ${totalSousTacheTerminé === totalSousTache
                      ? "text-green-500 dark:text-green-400"
                      : "text-gray-500 dark:text-gray-400"
                    } text-xs`}
                  width="14"
                  height="14"
                  viewBox="0 0 16 16"
                >
                  <path d="M6.974 14c-.3 0-.7-.2-.9-.5l-2.2-3.7-2.1 2.8c-.3.4-1 .5-1.4.2-.4-.3-.5-1-.2-1.4l3-4c.2-.3.5-.4.9-.4.3 0 .6.2.8.5l2 3.3 3.3-8.1c0-.4.4-.7.8-.7s.8.2.9.6l4 8c.2.5 0 1.1-.4 1.3-.5.2-1.1 0-1.3-.4l-3-6-3.2 7.9c-.2.4-.6.6-1 .6z" />
                </svg>
                <div
                  className={`text-gray-500 dark:text-gray-400 ${totalSousTacheTerminé === totalSousTache
                      ? "text-green-500 dark:text-green-400"
                      : "text-gray-500 dark:text-gray-400"
                    } text-xs`}
                >
                  {totalSousTacheTerminé}/{totalSousTache}
                </div>
              </>
            )}
          </div>
        </h2>
        {/* Content */}
        <div>
          <div className="mt-2 text-xs">
            {tache && tache.description ? (
              <DescriptionFormat description={tache.description} />
            ) : (
              "Aucune description ajouée..."
            )}
          </div>
          {/* sous taches */}
          {sousTache === true && (
            <>
              <ul className="mt-3">
                {sousTaches && sousTaches.length > 0 ? (
                  sousTaches.slice(0, 3).map((sTache, index) => (
                    <li
                      key={index}
                      className="flex items-center py-2 border-t border-gray-100 dark:border-gray-700/60"
                    >
                      <svg
                        className={`w-3 h-3 shrink-0 fill-current mr-2 ${sTache.status === "Terminé"
                            ? "text-green-500"
                            : "text-gray-400 dark:text-gray-500"
                          }`}
                        viewBox="0 0 12 12"
                      >
                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                      </svg>
                      <div
                        className={`text-xs ${sTache.status === "Terminé"
                            ? "text-gray-400 dark:text-gray-500 line-through"
                            : ""
                          }`}
                      >
                        {sTache.libelle ? (
                          <LibelleFormat libelle={sTache.libelle} />
                        ) : (
                          <span className="text-xs">
                            Aucun libellé ajouté...
                          </span>
                        )}
                      </div>
                    </li>
                  ))
                ) : (
                  <span className="text-xs font-bold">
                    Aucune sous-tâche ajoutée...
                  </span>
                )}
              </ul>
            </>
          )}
          {/* image taches */}
          {imagesTacheError && (
            <p className="text-xs text-rose-500">
              Erreur lors de la recuperation de l'image
            </p>
          )}
          {imagesTacheLoading && <SpinnerLoading />}
          {imgsTache && imgsTache.length > 0 ? (
            <>
              <div>
                <div className="grid grid-cols-1 gap-1 my-6 mx3">
                  {imgsTache.slice(0, 1).map((img) => (
                    <a
                      className="block"
                      href={img && img.lien}
                      key={img && img.id}
                    >
                      <img
                        className="w-full h-32 rounded-sm"
                        src={img.lien}
                        alt={img.libelle}
                      />
                    </a>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
        <div>
          {sousTache !== true ? (
            <>
              <div className="mt-3 text-xs">
                Ajouté par{" "}
                <a
                  className="font-medium text-violet-400 hover:underline"
                  href="#0"
                >
                  {tache && tache.creer_par ? tache.creer_par + "✨" : "😖"}
                </a>
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
      {/* Footer */}
      <div className="flex items-center justify-between">
        {/* Left side */}
        <>
          <div className="flex -ml-px -space-x-3 shrink-0">
            {responsables && responsables.length > 0 ? (
              responsables.slice(0, 3).map((responsable) => (
                <span key={responsable.id}>
                  <Avatar
                    name={`${responsable.nom} ${responsable.prenom}`}
                    round={true}
                    size="24"
                    src={responsable.photoProfileLien} // Le lien de l'image
                  />
                </span>
              ))
            ) : (
              <span className="text-xs">
                Aucun responsable pour cette tache...
              </span>
            )}
          </div>
        </>

        {/* Right side */}
        <div className="flex items-center gap-1">
          {/* Date */}

          {tache && tache.deadline ? (
            <>
              <div className="flex items-center ml-3 text-yellow-500">
                <svg
                  className="shrink-0 fill-current mr-1.5"
                  width="14"
                  height="14"
                  viewBox="0 0 16 16"
                >
                  <path d="M5 4a1 1 0 0 0 0 2h6a1 1 0 1 0 0-2H5Z" />
                  <path d="M4 0a4 4 0 0 0-4 4v8a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4V4a4 4 0 0 0-4-4H4ZM2 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4Z" />
                </svg>
                <div className="text-xs text-yellow-600">
                  {new Date(tache.deadline).toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </div>
              </div>
            </>
          ) : null}

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
      </div>
    </div>
  );
}

export default Task01;

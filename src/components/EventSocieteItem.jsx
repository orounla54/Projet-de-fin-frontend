import React, { useEffect, useState } from "react";
import ProfileBg from "../images/bgProfile.png";
import { Link } from "react-router-dom";
import Avatar from "react-avatar";
import { baseURL } from "../utils/DataFront/eventTypes";
import AuthService from "../utils/Auth/AuthServices";
import axios from "axios";
import SpinnerLoading from "./SpinnerLoading";
import { useGetData } from "../utils/Requests/RequestService";

// Fonction pour formater les données
const formatData = (demandes) => {
  return demandes.map((demande) => {
    const responsable = JSON.parse(demande.responsables); // Convertir la chaîne JSON en objet

    return {
      id: demande.id,
      idResponsable: demande.idResponsable,
      responsable: {
        id: responsable.id,
        nom: responsable.nom,
        prenom: responsable.prenom,
        email: responsable.email,
        image: responsable.image,
        position: responsable.position,
        service: responsable.service,
        poste: responsable.poste,
      },
      statusDemande: demande.statusDemande,
      formattedDate: new Date(demande.dateInscription).toLocaleDateString(
        "fr-FR",
        {
          year: "numeric",
          month: "short",
          day: "numeric",
        }
      ), // Formater la date
    };
  });
};

function EventSocieteItem({ event, responsable }) {
  const baseUrl = baseURL;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [demandes, setDemandes] = useState([]);

  const {
    data: dataDemandes,
    loading: loadingDemandes,
    error: errorDemandes,
    fetchData: fetchDataDemande,
  } = useGetData(
    `${event.id ? `demandeParticipation/societe/evenements/${event?.id}` : ""}`
  );

  useEffect(() => {
    if (dataDemandes) {
      // const formated = formatData(dataDemandes);
      setDemandes(dataDemandes);
      console.log(dataDemandes);
    }
  }, [dataDemandes]);

  const onDemandeParticipatio = async () => {
    const objet = {
      idEvenements: event.id,
      idResponsable: responsable.id,
    };

    // console.log("participe");
    // console.log(objet);
    try {
      setLoading(true);
      // Récupération du token d'accès
      const accessToken = AuthService.getAccessToken();
      if (!accessToken) {
        throw new Error("Token d'accès manquant. Veuillez vous reconnecter.");
      }
      // Envoi de la requête PUT
      await axios.post(
        `${baseUrl}/demandeParticipation/societe/evenements`,
        objet,
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

  const onAnnuleDemandeParticipatio = async () => {
    const objet = {
      idEvenements: event.id,
      idResponsable: responsable.id,
    };

    // console.log("Annule participe");
    // console.log(objet);
    try {
      setLoading(true);
      // Récupération du token d'accès
      const accessToken = AuthService.getAccessToken();
      if (!accessToken) {
        throw new Error("Token d'accès manquant. Veuillez vous reconnecter.");
      }
      // Envoi de la requête PUT
      await axios.post(
        `${baseUrl}/demandeAnnuleParticipation/societe/evenements`,
        objet,
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

  return (
    <div className="overflow-hidden bg-white shadow-sm col-span-full sm:col-span-6 xl:col-span-3 dark:bg-gray-800 rounded-xl">
      <div className="flex flex-col h-full">
        {/* Image */}
        <div className="relative">
          <img
            className="w-full h-48"
            src={event?.photoLien || ProfileBg}
            alt={event?.eventName}
          />
          {/* Like button */}
          <button className="absolute top-0 right-0 mt-4 mr-4">
            <div className="text-gray-100 bg-gray-900 rounded-full bg-opacity-60">
              <span className="sr-only">Like</span>
              <svg className="w-8 h-8 fill-current" viewBox="0 0 32 32">
                <path d="M22.682 11.318A4.485 4.485 0 0019.5 10a4.377 4.377 0 00-3.5 1.707A4.383 4.383 0 0012.5 10a4.5 4.5 0 00-3.182 7.682L16 24l6.682-6.318a4.5 4.5 0 000-6.364zm-1.4 4.933L16 21.247l-5.285-5A2.5 2.5 0 0112.5 12c1.437 0 2.312.681 3.5 2.625C17.187 12.681 18.062 12 19.5 12a2.5 2.5 0 011.785 4.251h-.003z" />
              </svg>
            </div>
          </button>
          <div className="absolute top-0 left-0 mt-4 ml-4">
            <div className="inline-flex items-center text-xs font-medium text-gray-100 dark:text-gray-300 bg-gray-900/60 dark:bg-gray-800/60 rounded-full text-center px-2 py-0.5">
              <svg
                className="w-3 h-3 mr-1 text-yellow-500 fill-current shrink-0"
                viewBox="0 0 12 12"
              >
                <path d="M11.953 4.29a.5.5 0 00-.454-.292H6.14L6.984.62A.5.5 0 006.12.173l-6 7a.5.5 0 00.379.825h5.359l-.844 3.38a.5.5 0 00.864.445l6-7a.5.5 0 00.075-.534z" />
              </svg>
              <span>Popular</span>
            </div>
          </div>
        </div>
        {/* Card Content */}
        <div className="flex flex-col p-5 grow">
          {/* Card body */}
          <div className="grow">
            {/* Header */}
            <header className="mb-3">
              <Link
                to={`/societe/evenements/${event?.id}`}
                className="text-lg font-semibold text-gray-800 dark:text-gray-100"
              >
                {event?.eventName}
              </Link>
            </header>
            {/* Rating and price */}
            <div className="flex flex-wrap items-center justify-between my-6 mb-4">
              {/* Stars */}
              <div className="flex items-center space-x-1">
                <span className="block mr-1 shrink-0">
                  <Avatar
                    src={event?.responsableEvent?.image}
                    name={event?.creer_par}
                    round={true}
                    size="26"
                  />
                </span>
                <div className="flex items-center gap-1 text-xs whitespace-nowrap">
                  <p
                    className="font-semibold text-gray-800 dark:text-gray-100"
                    href="#0"
                  >
                    {event.creer_par}
                  </p>
                </div>
              </div>
              {/* Price */}
              <div>
                {event?.new === 1 && (
                  <div className="inline-flex text-xs font-medium bg-green-500/20 text-green-700 rounded-full text-center px-2 py-0.5">
                    Nouveau
                  </div>
                )}
                <div
                  className={`inline-flex text-xs font-medium rounded-full text-center px-2 py-0.5 ml-1 ${
                    event?.status === "Terminé"
                      ? "bg-green-500/20 text-green-700"
                      : event?.status === "En-cours"
                      ? " bg-yellow-500/20 text-yellow-700"
                      : "bg-blue-500/20 text-blue-600"
                  }`}
                >
                  {event?.status}
                </div>
              </div>
            </div>
            {/* Features list */}
            <ul className="mb-5 space-y-2 text-sm dark:text-gray-300">
              <li className="flex items-center">
                <svg
                  className="mr-3 text-gray-400 fill-current dark:text-gray-500 shrink-0"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                >
                  <path d="M7 7a1 1 0 1 1 0 2H1a1 1 0 1 1 0-2h6Zm8-5a1 1 0 0 1 0 2H1a1 1 0 1 1 0-2h14ZM5 12a1 1 0 0 1 0 2H1a1 1 0 0 1 0-2h4Z" />
                </svg>
                <div>{event?.categorie}</div>
              </li>
              <li className="flex items-center">
                <svg
                  className="mr-3 text-gray-400 fill-current dark:text-gray-500 shrink-0"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                >
                  <path d="M4.17 14H3a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3h1.17A3.001 3.001 0 0 1 7 0h6a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3.001 3.001 0 0 1-2.83-2ZM4 4H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h1V4Zm10 9V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1Z" />
                </svg>
                <div>{event?.enventType}</div>
              </li>
              <li className="flex items-center">
                <svg
                  className="mr-3 text-gray-400 fill-current dark:text-gray-500 shrink-0"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                >
                  <path d="M4.798 10.509a3.202 3.202 0 1 1 0-6.404 3.202 3.202 0 0 1 0 6.404Zm0-1.83a1.372 1.372 0 1 0 0-2.745 1.372 1.372 0 0 0 0 2.745Zm6.404-.915a3.202 3.202 0 1 1 0-6.404 3.202 3.202 0 0 1 0 6.404Zm0-1.83a1.372 1.372 0 1 0 0-2.744 1.372 1.372 0 0 0 0 2.744ZM9.335 11.11a.915.915 0 0 1-1.07-1.484 5.033 5.033 0 0 1 7.681 2.41.915.915 0 0 1-1.724.609 3.204 3.204 0 0 0-4.887-1.535Zm-7.558 4.28a.915.915 0 0 1-1.725-.61 5.033 5.033 0 0 1 9.49 0 .915.915 0 0 1-1.724.61 3.204 3.204 0 0 0-6.04 0Z" />
                </svg>
                <div className="flex items-center gap-1">
                  {" "}
                  <div className="flex -ml-px -space-x-3">
                    {event?.responsablesAssocies
                      .slice(0, 4)
                      .map((responsable) => (
                        <span key={responsable.id}>
                          <Avatar
                            name={`${responsable.nom} ${responsable.prenom}`}
                            round={true}
                            size="20"
                            src={responsable.image} // Le lien de l'image
                          />
                        </span>
                      ))}
                  </div>
                  {/* Nombre restant de responsables */}
                  {event.responsablesAssocies.length > 4 && (
                    <div className="text-xs italic font-medium text-gray-400 dark:text-gray-500">
                      +{event?.responsablesAssocies?.length - 4}
                    </div>
                  )}{" "}
                  Parcipant(s)
                </div>
              </li>
              <li className="flex items-center">
                <svg
                  className="mr-3 text-gray-400 fill-current dark:text-gray-500 shrink-0"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                >
                  <path d="M5 4a1 1 0 0 0 0 2h6a1 1 0 1 0 0-2H5Z" />
                  <path d="M4 0a4 4 0 0 0-4 4v8a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4V4a4 4 0 0 0-4-4H4ZM2 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4Z" />
                </svg>

                <div>
                  {" "}
                  {event.eventStart && (
                    <span>
                      {new Date(event.eventStart).toLocaleDateString("fr-FR", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                      {new Date(event.eventEnd).getDate() !==
                        new Date(event.eventStart).getDate() && (
                        <>
                          {" "}
                          -{" "}
                          {new Date(event.eventEnd).toLocaleDateString(
                            "fr-FR",
                            {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                            }
                          )}
                        </>
                      )}
                      ,{" "}
                      {new Date(event.eventStart).toLocaleTimeString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })}
                      {event.eventEnd && (
                        <span>
                          {" "}
                          -{" "}
                          {new Date(event.eventEnd).toLocaleTimeString(
                            "fr-FR",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: false,
                            }
                          )}
                        </span>
                      )}
                    </span>
                  )}
                </div>
              </li>
              {event.NbrePlace && (
                <li className="flex items-center">
                  {event.placesDisponibles < 1 ? (
                    <>
                      {" "}
                      <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="mr-0.5 size-5 text-gray-400 fill-current dark:text-gray-500 shrink-0"
                      >
                        <path d="M10.5 1.875a1.125 1.125 0 0 1 2.25 0v8.219c.517.162 1.02.382 1.5.659V3.375a1.125 1.125 0 0 1 2.25 0v10.937a4.505 4.505 0 0 0-3.25 2.373 8.963 8.963 0 0 1 4-.935A.75.75 0 0 0 18 15v-2.266a3.368 3.368 0 0 1 .988-2.37 1.125 1.125 0 0 1 1.591 1.59 1.118 1.118 0 0 0-.329.79v3.006h-.005a6 6 0 0 1-1.752 4.007l-1.736 1.736a6 6 0 0 1-4.242 1.757H10.5a7.5 7.5 0 0 1-7.5-7.5V6.375a1.125 1.125 0 0 1 2.25 0v5.519c.46-.452.965-.832 1.5-1.141V3.375a1.125 1.125 0 0 1 2.25 0v6.526c.495-.1.997-.151 1.5-.151V1.875Z" />
                      </svg>
                    </>
                  ) : (
                    <>
                      {" "}
                      <svg
                        className="-mr-0.5 text-gray-400 fill-current dark:text-gray-500 shrink-0"
                        width="30"
                        height="30"
                        viewBox="0 0 30 30"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.5 3.75A1.5 1.5 0 0 0 6 5.25v13.5a1.5 1.5 0 0 0 1.5 1.5h6a1.5 1.5 0 0 0 1.5-1.5V15a.75.75 0 0 1 1.5 0v3.75a3 3 0 0 1-3 3h-6a3 3 0 0 1-3-3V5.25a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3V9A.75.75 0 0 1 15 9V5.25a1.5 1.5 0 0 0-1.5-1.5h-6Zm5.03 4.72a.75.75 0 0 1 0 1.06l-1.72 1.72h10.94a.75.75 0 0 1 0 1.5H10.81l1.72 1.72a.75.75 0 1 1-1.06 1.06l-3-3a.75.75 0 0 1 0-1.06l3-3a.75.75 0 0 1 1.06 0Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </>
                  )}

                  <div>
                    {" "}
                    <>
                      <div className="inline-flex items-center justify-center gap-1">
                        Place disponible{"  "}
                        <div
                          className={`font-bold ${
                            event.placesDisponibles === 0
                              ? "text-violet-400"
                              : event.placesDisponibles < event.NbrePlace
                              ? "text-green-400"
                              : ""
                          }`}
                        >
                          <span className="text-gray-400">
                            {event.placesDisponibles}
                          </span>{" "}
                          / <span>{event.NbrePlace}</span>
                        </div>
                      </div>
                    </>
                  </div>
                </li>
              )}{" "}
            </ul>
          </div>
          {/* Card footer */}
          <div>
            <div className="w-full text-center">
              {event?.responsablesAssocies?.some(
                (responsableE) => responsableE?.id === responsable?.id
              ) ? (
                <button
                  className="flex items-center justify-center w-full text-gray-100 bg-gray-900 cursor-not-allowed btn-sm hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
                  disabled
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-6 fill-green-700"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              ) : (
                <button
                  onClick={async () => {
                    if (
                      demandes?.some(
                        (demande) => demande.responsable?.id === responsable.id
                      )
                    ) {
                      await onAnnuleDemandeParticipatio();
                    } else {
                      await onDemandeParticipatio();
                    }
                  }}
                  className={`text-center flex items-center justify-center w-full text-gray-100 bg-gray-900 btn-sm hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white ${
                    event?.status === "Terminé" ||
                    event.NbrePlace === event.placesDisponibles
                      ? "enabled cursor-not-allowed"
                      : ""
                  }`}
                  disabled={
                    event?.status === "Terminé" ||
                    event.NbrePlace === event.placesDisponibles
                  }
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <SpinnerLoading />
                    </div>
                  ) : (
                    <>
                      {demandes?.some(
                        (demande) => demande.responsable?.id === responsable.id
                      ) ? (
                        <div className="flex items-center">
                          <svg
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="size-6 fill-blue-600"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903h-3.183a.75.75 0 1 0 0 1.5h4.992a.75.75 0 0 0 .75-.75V4.356a.75.75 0 0 0-1.5 0v3.18l-1.9-1.9A9 9 0 0 0 3.306 9.67a.75.75 0 1 0 1.45.388Zm15.408 3.352a.75.75 0 0 0-.919.53 7.5 7.5 0 0 1-12.548 3.364l-1.902-1.903h3.183a.75.75 0 0 0 0-1.5H2.984a.75.75 0 0 0-.75.75v4.992a.75.75 0 0 0 1.5 0v-3.18l1.9 1.9a9 9 0 0 0 15.059-4.035.75.75 0 0 0-.53-.918Z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      ) : (
                        <div className="">
                          {event?.status === "Terminé"
                            ? "Terminé"
                            : event.NbrePlace === event.placesDisponibles
                            ? "Complet"
                            : "Participer"}
                        </div>
                      )}
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventSocieteItem;

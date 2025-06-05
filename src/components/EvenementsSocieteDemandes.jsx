import React, { useEffect, useState } from "react";
import { baseURL } from "../utils/DataFront/eventTypes";
import { useGetData } from "../utils/Requests/RequestService";
import AuthService from "../utils/Auth/AuthServices";
import axios from "axios";
import SpinnerLoading from "./SpinnerLoading";
import EvenementSocieteDemandeItem from "./EvenementSocieteDemandeItem";
import EvenementSocieteResponsableItem from "./EvenementSocieteResponsableItem";
import AddResponsablesToEvent from "./AddResponsablesToEvent";

const formatData = (demandes) => {
  return demandes.map((demande) => {
    const responsable = JSON.parse(demande.responsables); // Convertir la chaîne JSON en objet

    return {
      new: demande.new,
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
      formattedDate: (() => {
        const inscriptionDate = new Date(demande.dateInscription);
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
      })(),
      // Formater la date
    };
  });
};

function EvenementsSocieteDemandes({
  event,
  responsable,
  setNewDemande,
  fetchData,
  sousPage,
  responsableLog,
}) {
  const baseUrl = baseURL;
  const [demandes, setDemandes] = useState([]);
  const [responsables, setResponsables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [feedbackModalOpenAddResponsable, setFeedbackModalOpenAddResponsable] =
    useState(false);

  const {
    data: dataDemandes,
    loading: loadingDemandes,
    error: errorDemandes,
    fetchData: fetchDataDemande,
  } = useGetData(
    `${
      event.id
        ? `${
            sousPage === "Demandes"
              ? `demandeParticipation/societe/evenements/`
              : "/responsables/societe/evenements/"
          }${event?.id}`
        : ""
    }`
  );

  useEffect(() => {
    if (dataDemandes && sousPage === "Demandes") {
      // const formated = formatData(dataDemandes);
      const formated = dataDemandes;
      formated.map((e) => {
        if (e.new === 1) {
          setNewDemande(true);
        }
      });
      setDemandes(formated);
      // console.log(formated);
    } else {
      setResponsables(dataDemandes);
      // console.log(responsables);
    }
  }, [dataDemandes]);

  const onDemandeParticipatio = async () => {
    const objet = {
      idEvenements: event?.id,
      idResponsable: responsable?.id,
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
      idEvenements: event?.id,
      idResponsable: responsable?.id,
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
    <div className="mb-4 xl:w-4/5">
      <div className="flex items-center justify-between my-2">
        <h2 className="mb-2 font-semibold text-gray-800 dark:text-gray-100">
          {sousPage}
        </h2>
        {parseInt(responsableLog.id) === parseInt(event.idResponsable) && (
          <>
            {sousPage !== "Demandes" && (
              <>
                <AddResponsablesToEvent
                  feedbackModalOpen={feedbackModalOpenAddResponsable}
                  setFeedbackModalOpen={setFeedbackModalOpenAddResponsable}
                  fetchData={() => {
                    fetchData();
                    fetchDataDemande();
                  }}
                  event={event}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setFeedbackModalOpenAddResponsable(true);
                  }}
                  className="flex items-center justify-center transition bg-white border border-gray-200 rounded-full shadow-sm w-7 h-7 dark:bg-gray-800 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-violet-500"
                >
                  <span className="sr-only">Add new account</span>
                  <svg
                    className="fill-current"
                    width="14"
                    height="14"
                    viewBox="0 0 16 16"
                  >
                    <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                  </svg>
                </button>
              </>
            )}
          </>
        )}

        {/* boutton  */}
        {sousPage === "Demandes" && (
          <div>
            <>
              {event?.responsablesAssocies?.some(
                (responsableE) => responsableE?.id === responsable?.id
              ) ? (
                <button
                  className="flex items-center justify-center w-full text-gray-100 cursor-not-allowed btn-sm hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
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
                  className={`text-center flex items-center justify-center w-full text-gray-100 btn-sm hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white ${
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
            </>
          </div>
        )}
      </div>
      <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-900 dark:border-gray-700/60">
        <ul className="space-y-3">
          {/* Item */}
          {sousPage === "Demandes" ? (
            <>
              {" "}
              {loadingDemandes ? (
                <SpinnerLoading />
              ) : (
                <>
                  {demandes && demandes.length > 0 ? (
                    <>
                      {demandes.length > 0 &&
                        demandes?.map((demande) => (
                          <>
                            {event?.idResponsable !==
                              demande.responsable.id && (
                              <EvenementSocieteDemandeItem
                                demande={demande}
                                event={event}
                                responsableLog={responsableLog}
                                fetchDataDemande={() => {
                                  fetchDataDemande();
                                  fetchData();
                                }}
                              />
                            )}
                          </>
                        ))}
                    </>
                  ) : (
                    <p className="text-xs text-center">
                      Aucune demande réçu pour le moment.
                    </p>
                  )}
                </>
              )}
            </>
          ) : (
            <>
              {loading ? (
                <>
                  <SpinnerLoading />
                </>
              ) : (
                <>
                  <>
                    {responsables && responsables.length > 0 ? (
                      <>
                        {responsables.length > 0 &&
                          responsables
                            ?.sort((a, b) =>
                              a.id === event?.idResponsable
                                ? -1
                                : b.id === event?.idResponsable
                                ? 1
                                : 0
                            )
                            ?.map((resp) => (
                              <EvenementSocieteResponsableItem
                                key={resp.id} // Ajoutez une clé unique ici pour chaque élément
                                responsable={resp}
                                event={event}
                                fetchDataDemande={() => {
                                  fetchDataDemande();
                                  fetchData();
                                }}
                                responsableLog={responsableLog}
                              />
                            ))}
                      </>
                    ) : (
                      <p className="text-xs text-center">
                        Aucune demande réçu pour le moment.
                      </p>
                    )}
                  </>
                </>
              )}
            </>
          )}
        </ul>
      </div>
    </div>
  );
}

export default EvenementsSocieteDemandes;

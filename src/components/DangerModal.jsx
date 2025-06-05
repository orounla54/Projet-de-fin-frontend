import React, { useState, useEffect } from "react";
import ModalBlank from "./ModalBlank"; // Assurez-vous que le chemin est correct
import LibelleFormat from "./LibelleFormat";
import { useDeleteData } from "../utils/Requests/RequestService";
import { useSuccessMessage } from "../utils/SuccessContext";
import SpinnerLoading from "./SpinnerLoading";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { socketBaseURL } from "../utils/DataFront/eventTypes";

function DangerModal(props) {
  const socket = io(socketBaseURL);
  const [dangerModalOpen, setDangerModalOpen] = useState(false);
  const [endpoint, setEndpoint] = useState("");
  const navigate = useNavigate();

  const { setSuccessMessage } = useSuccessMessage();

  // Définir l'endpoint basé sur props.endpoint
  useEffect(() => {
    switch (props.endpoint) {
      case "projets":
        setEndpoint("projets");
        break;
      case "taches":
        setEndpoint("taches");
        break;
      case "typesTaches":
        setEndpoint("typesTaches");
        break;
      case "observations":
        setEndpoint("observations");
        break;

      case "evenements":
        setEndpoint("evenements");
        break;
      case "sousTaches":
        setEndpoint("sousTaches");
        break;
      case "imagesTache":
        setEndpoint("ImgsTache");
        break;
      case "discussions":
        setEndpoint("discussions");
        break;
      case "medias":
        setEndpoint("mediaDiscu");
        break;
      case "messages":
        setEndpoint("messages");
        break;
      case "services":
        setEndpoint("services");
        break;
      case "postes":
        setEndpoint("postes");
        break;
      case "positions":
        setEndpoint("positions");
        break;
      case "responsables":
        setEndpoint("responsables");
        break;
      case "tachesEvenementParDefaut":
        setEndpoint("tachesParDefaut/evenements");
        break;
      case "filesConducteur":
        setEndpoint("filesConducteur/societe/evenements");
        break;
      case "tachesEvenement":
        setEndpoint("evenementsSociete/taches");
        break;
      case "sollicitations":
        setEndpoint("sollicitations");
        break;
      case "categories":
        setEndpoint("categories");
        break;
      case "roles tache":
        setEndpoint("roles");
        break;
      case "roles plan":
        setEndpoint("rolesPlan");
        break;
      case "type priorite":
        setEndpoint("typePriorites");
        break;
      case "plansStrategiques":
        setEndpoint("plansStrategiques");
        break;
      case "axesStrategiques":
        setEndpoint("axesStrategiques");
        break;
      case "objectifsStrategiques":
        setEndpoint("objectifsStrategiques");
        break;
      case "mesuresStrategiques":
        setEndpoint("mesuresStrategiques");
        break;
      case "objectifsOperationnels":
        setEndpoint("objectifsOperationnels");
        break;
      case "priorites":
        setEndpoint("priorites");
        break;
      case "preuves":
        setEndpoint("preuves");
      case "documentsPreuves":
        setEndpoint("documentsPreuves");
        break;
      case "documentsPreuvesDocs":
        setEndpoint("documentsPreuves");
        break;
      case "responsable_deleteTache":
        setEndpoint(`tache/${props.tache.id}/deleteResp`);
        break;
      default:
        setEndpoint(null);
    }
  }, [props.endpoint]);

  // Hook personnalisé pour supprimer un objet
  const { response, error, loading, deleteData } = useDeleteData(
    endpoint ? `${endpoint}` : ""
  );

  // Fonction de suppression d'objet
  const deleteObjet = async () => {
    try {
      await deleteData(props.idObjet);

      setDangerModalOpen(false);
      if (props.refreshList) {
        await props.refreshList(); // Appel pour rafraîchir la liste si la fonction est fournie en prop
      }
      setSuccessMessage(
        props.endpoint === "responsable_deleteTache"
          ? "Responsable retirer avec succès"
          : "Element supprimer avec succès"
      );
      if (props.endpoint === "discussions") {
        navigate(-1);
      }

      if (props.endpoint === "messages" || props.endpoint === "medias") {
        socket.emit("deleteMessage", props.discussionCurrent);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  };

  return (
    <div className="">
      {/* Bouton pour ouvrir le modal */}
      <button
        className="text-red-500 rounded-full hover:text-red-600"
        aria-controls="danger-modal"
        onClick={(e) => {
          e.stopPropagation();
          setDangerModalOpen(true);
        }}
      >
        {props.endpoint === "responsable_deleteTache" ? (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="size-4"
            >
              <path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM2.046 15.253c-.058.468.172.92.57 1.175A9.953 9.953 0 0 0 8 18c1.982 0 3.83-.578 5.384-1.573.398-.254.628-.707.57-1.175a6.001 6.001 0 0 0-11.908 0ZM12.75 7.75a.75.75 0 0 0 0 1.5h5.5a.75.75 0 0 0 0-1.5h-5.5Z" />
            </svg>
          </>
        ) : props.endpoint === "filesConducteur" ||
          props.endpoint === "tachesEvenement" ? (
          "Supprimer"
        ) : props.endpoint === "plansStrategiques" ||
          props.endpoint === "axesStrategiques" ||
          props.endpoint === "priorites" ||
          props.endpoint === "objectifsStrategiques" ||
          props.endpoint === "objectifsOperationnels" ||
          props.endpoint === "mesuresStrategiques" ? (
          <>
            <svg
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="size-5 "
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
              />
            </svg>
          </>
        ) : props.endpoint === "sollicitations" ? (
          "Retirer"
        ) : (
          <>
            <svg className="w-8 h-8 fill-current" viewBox="0 0 32 32">
              <path d="M13 15h2v6h-2zM17 15h2v6h-2z" />
              <path d="M20 9c0-.6-.4-1-1-1h-6c-.6 0-1 .4-1 1v2H8v2h1v10c0 .6.4 1 1 1h12c.6 0 1-.4 1-1V13h1v-2h-4V9zm-6 1h4v1h-4v-1zm7 3v9H11v-9h10z" />
            </svg>
          </>
        )}
      </button>

      {/* Modal de confirmation */}
      <ModalBlank
        id="danger-modal"
        modalOpen={dangerModalOpen}
        setModalOpen={setDangerModalOpen}
        endpoint={props.endpoint}
      >
        <div className="flex p-5 space-x-4 text-wrap">
          {/* Icon */}
          <div className="flex items-center justify-center bg-gray-100 rounded-full w-7 h-7 shrink-0 dark:bg-gray-700">
            <svg
              className="text-red-500 fill-current shrink-0"
              width="16"
              height="16"
              viewBox="0 0 16 16"
            >
              <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 12c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm1-3H7V4h2v5z" />
            </svg>
          </div>
          {/* Content */}
          <div>
            {/* Modal header */}
            <div className="mb-2">
              <div className="text-sm font-bold text-gray-800 dark:text-gray-100">
                {props.endpoint !== "responsable_deleteTache"
                  ? "Voulez-vous vraiment effectuer cette suppression?"
                  : "Voulez vous vraiment retirer le cette personne de la tache?"}
              </div>
            </div>
            {/* Modal content */}
            <div className="mb-10 text-sm">
              <div className="mt-8 space-y-2 text-center">
                <span>
                  <LibelleFormat libelle={props.libelleObjet} />
                </span>
              </div>
            </div>
            {/* Modal footer */}
            <div className="flex flex-wrap justify-end space-x-2">
              <button
                className="text-gray-800 border-gray-200 btn-sm dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 dark:text-gray-300"
                onClick={() => setDangerModalOpen(false)}
              >
                Annuler
              </button>
              <button
                onClick={deleteObjet}
                className="text-white bg-red-500 btn-sm hover:bg-red-600"
                disabled={loading}
              >
                {loading ? (
                  <SpinnerLoading deleteLoading={true} />
                ) : props.endpoint === "responsable_deleteTache" ? (
                  "Retirer"
                ) : (
                  "Supprimer"
                )}
              </button>
            </div>
            {error && (
              <p className="mt-2 text-xs text-red-500">
                Erreur : {error.message}
              </p>
            )}
          </div>
        </div>
      </ModalBlank>
    </div>
  );
}

export default DangerModal;

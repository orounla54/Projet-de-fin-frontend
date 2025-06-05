import React, { useState, useEffect } from "react";
import ModalBlank from "./ModalBlank"; // Assurez-vous que le chemin est correct
import LibelleFormat from "./LibelleFormat";
import { useDeleteData } from "../utils/Requests/RequestService";
import { useSuccessMessage } from "../utils/SuccessContext";
import { useNavigate } from "react-router-dom";
import SpinnerLoading from "./SpinnerLoading";

function DangerModalEvent(props) {
  const [dangerModalOpen, setDangerModalOpen] = useState(false);
  const [endpoint, setEndpoint] = useState("");

  const { setSuccessMessage } = useSuccessMessage();
  const navigate = useNavigate();

  // Définir l'endpoint basé sur props.endpoint
  useEffect(() => {
    switch (props.endpoint) {
      case "evenements":
        setEndpoint("evenements");
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
      navigate(-1);
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  };

  return (
    <div className="">
      {/* Bouton pour ouvrir le modal */}
      <button
        className="text-red-500 hover:text-red-600 shrink-0 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 shadow-sm"
        aria-controls="danger-modal"
        onClick={(e) => {
          e.stopPropagation();
          setDangerModalOpen(true);
        }}
      >
        <span className="sr-only">Delete</span>
        <svg className="w-8 h-8 fill-current" viewBox="0 0 32 32">
          <path d="M13 15h2v6h-2zM17 15h2v6h-2z" />
          <path d="M20 9c0-.6-.4-1-1-1h-6c-.6 0-1 .4-1 1v2H8v2h1v10c0 .6.4 1 1 1h12c.6 0 1-.4 1-1V13h1v-2h-4V9zm-6 1h4v1h-4v-1zm7 3v9H11v-9h10z" />
        </svg>
      </button>

      {/* Modal de confirmation */}
      <ModalBlank
        id="danger-modal"
        modalOpen={dangerModalOpen}
        setModalOpen={setDangerModalOpen}
      >
        <div className="p-5 flex text-wrap space-x-4">
          {/* Icon */}
          <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 bg-gray-100 dark:bg-gray-700">
            <svg
              className="shrink-0 fill-current text-red-500"
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
              <div className="text-sm font-bold text-gray-800 dark:text-gray-100 flex flex-wrap">
                Voulez-vous vraiment effectuer cette suppression?
              </div>
            </div>
            {/* Modal content */}
            <div className="text-sm mb-10">
              <div className="space-y-2 mt-8">
                <span>
                  <LibelleFormat libelle={props.libelleObjet} />
                </span>
              </div>
            </div>
            {/* Modal footer */}
            <div className="flex flex-wrap justify-end space-x-2">
              <button
                className="btn-sm border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-gray-800 dark:text-gray-300"
                onClick={() => setDangerModalOpen(false)}
              >
                Annuler
              </button>
              <button
                onClick={deleteObjet}
                className="btn-sm bg-red-500 hover:bg-red-600 text-white"
                disabled={loading}
              >
                {loading ? <SpinnerLoading /> : "Supprimer"}
              </button>
            </div>
            {error && (
              <p className="text-red-500 text-xs mt-2">
                Erreur : {error.message}
              </p>
            )}
          </div>
        </div>
      </ModalBlank>
    </div>
  );
}

export default DangerModalEvent;

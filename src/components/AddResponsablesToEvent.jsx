import React, { useEffect, useState } from "react";
import { baseURL, eventTypes } from "../utils/DataFront/eventTypes";
import { useForm } from "react-hook-form";
import axios from "axios";
import AuthService from "../utils/Auth/AuthServices";
import ModalBasic from "./ModalBasic";
import { useGetData } from "../utils/Requests/RequestService";

function AddResponsablesToEvent({
  fetchData,
  feedbackModalOpen,
  setFeedbackModalOpen,
  event,
}) {
  const { pathname } = location;
  const baseUrl = baseURL;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [responsables, setResponsables] = useState([]);
  const [services, setServices] = useState([]);
  const [serviceSelectId, setServiceSelectId] = useState();
  const [responsablesAllSelect, setResponsablesAllSelect] = useState([]);

  const {
    data: servicesData,
    loading: servicesLoading,
    error: servicesError,
  } = useGetData(`/services/forUpdate`);

  // Construire dynamiquement l'URL en fonction de l'existence de `filter`
  const queryParams = new URLSearchParams({
    keyword: "",
    idService: serviceSelectId ? serviceSelectId : "",
  }).toString();

  // Récupérer les données avec les paramètres de filtre conditionnels
  const {
    data,
    loading: loadingResp,
    error: errorResp,
  } = useGetData(`filter/responsables?${queryParams}`);
  useEffect(() => {
    if (data) {
      setResponsables(data);
    }
  }, [data]);

  //chargement des selects
  useEffect(() => {
    if (servicesData) {
      setServices(servicesData);
      setServiceSelectId(servicesData?.[0]?.id);
    }
  }, [servicesData]);

  // Gestion des changements dans la liste
  const handleSelectChange = (event) => {
    const selectedIds = Array.from(event.target.selectedOptions, (option) =>
      parseInt(option.value)
    );

    setResponsablesAllSelect((prev) => {
      // Crée une nouvelle liste en ajoutant ou en supprimant des éléments selon la sélection
      const updatedSet = new Set(prev);
      selectedIds.forEach((id) => {
        if (updatedSet.has(id)) {
          updatedSet.delete(id); // Supprime si déjà présent (désélection)
        } else {
          updatedSet.add(id); // Ajoute si absent (nouvelle sélection)
        }
      });
      return Array.from(updatedSet); // Retourne un tableau
    });
    // console.log(responsablesAllSelect)
  };

  const methods = useForm();

  const { handleSubmit, reset } = methods;

  const clearForm = () => {
    reset(); // Réinitialisation des valeurs
    setResponsablesAllSelect(null);
    setError("")
  };

  const onSubmit = async (data) => {
    setLoading(true); // Active le chargement
    console.log(data)


    // Créer une copie de data avec les champs formatés
    const baseDataObject = {
      responsables: data.responsables,
      eventId: event?.id,
    };
    console.log(baseDataObject);
    try {
      const accessToken = AuthService.getAccessToken();

      // Envoyer la requête
      await axios.post(`${baseUrl}/addResponsablesOnEventSociete/societe/evenements`, baseDataObject, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      clearForm(); // Réinitialise le formulaire
      setFeedbackModalOpen(false); // Ferme le modal après succès
      console.log("Particiants ajoutés avec succès.");
      await fetchData();
    } catch (error) {
      // Gère les erreurs et affiche le message approprié
      const errorMessage =
        error.response && error.response.data
          ? error.response.data.message // Message d'erreur spécifique renvoyé par le serveur
          : "Erreur inattendue lors de l'ajout de l'événement.";
      setError(errorMessage);
    } finally {
      setLoading(false); // Désactive le chargement
    }
  };

  return (
    <div className="relative">
      <ModalBasic
        id="feedback-modal"
        modalOpen={feedbackModalOpen}
        setModalOpen={setFeedbackModalOpen}
        title="Ajout de participant"
      >
        {/* Formulaire d'ajout d'evenement*/}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="px-5 py-4">
            <div className="text-sm">
              <div className="mb-3 font-medium text-gray-800 dark:text-gray-100">
                Ajouter un participant à l'evenement
              </div>

              {error && (
                <p className="text-xs text-center text-red-500">{error}</p>
              )}
            </div>

            <div className="space-y-3">
              {/* Nom de l'événement et type */}
              <div className="flex items-center justify-between gap-2 mb-5">
                <div className="relative w-1/2">
                  <label
                    htmlFor="responsables"
                    className="block text-sm font-medium mb-1"
                  >
                    Services
                  </label>
                  <select
                    className={`form-input w-full`}
                    onChange={(e) => {
                      setServiceSelectId(e.target.value);
                    }}
                  >
                    {services.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.libelle}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="relative w-1/2">
                  <label
                    htmlFor="responsables"
                    className="block text-sm font-medium mb-1"
                  >
                    Participants<span className="text-red-500">*</span>
                  </label>
                  <select
                    {...methods.register("responsables", {
                      required: "Vous devez sélectionner un participant",
                    })}
                    className={`form-input w-full ${
                      methods.formState.errors.responsables
                        ? "border border-red-500"
                        : ""
                    }`}
                    multiple
                    value={responsablesAllSelect} // Utilisez `value` pour une gestion réactive
                    onChange={(e) => handleSelectChange(e)}
                    size={1}
                  >
                    {responsables.map((responsable) => (
                      <option key={responsable.id} value={responsable.id}>
                        {responsable.nom} {responsable.prenom}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Footer du modal */}
          <div className="px-5 py-4 border-t border-gray-200 dark:border-gray-700/60">
            <div className="flex flex-wrap justify-end space-x-2">
              <ul className="flex items-center justify-between gap-2">
                <li>
                  <button
                    type="button"
                    className="text-red-500 bg-white border-gray-200 btn-xs dark:bg-gray-800 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600"
                    onClick={() => clearForm()}
                  >
                    Nettoyer
                  </button>
                </li>
                <li>
                  <button
                    type="submit"
                    className="bg-white border-gray-200 btn dark:bg-gray-800 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600"
                  >
                    {loading ? (
                      <>
                        <svg
                          className="fill-current animate-spin shrink-0"
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                        >
                          <path d="M8 16a7.928 7.928 0 01-3.428-.77l.857-1.807A6.006 6.006 0 0014 8c0-3.309-2.691-6-6-6a6.006 6.006 0 00-5.422 8.572l-1.806.859A7.929 7.929 0 010 8c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
                        </svg>
                      </>
                    ) : (
                      <svg
                        className="fill-current text-violet-500 shrink-0"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                      >
                        <path d="M14.3 2.3L5 11.6 1.7 8.3c-.4-.4-1-.4-1.4 0-.4.4-.4 1 0 1.4l4 4c.2.2.4.3.7.3.3 0 .5-.1.7-.3l10-10c.4-.4.4-1 0-1.4-.4-.4-1-.4-1.4 0z" />
                      </svg>
                    )}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </form>
      </ModalBasic>
    </div>
  );
}

export default AddResponsablesToEvent;

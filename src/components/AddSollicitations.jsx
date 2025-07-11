import React, { useEffect, useState } from "react";
import { baseURL, eventTypes } from "../utils/DataFront/eventTypes";
import { useForm } from "react-hook-form";
import axios from "axios";
import AuthService from "../utils/Auth/AuthServices";
import ModalBasic from "./ModalBasic";
import { useGetData } from "../utils/Requests/RequestService";

function AddSollicitations({
  fetchData,
  feedbackModalOpen,
  setFeedbackModalOpen,
  sollicitation,
}) {
  const baseUrl = baseURL;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [services, setServices] = useState([]);

  const [toggleImportant, setToggleImportant] = useState(
    sollicitation ? sollicitation.important : false
  );
  const [toggleUrgent, setToggleUrgent] = useState(
    sollicitation ? sollicitation.urgent : false
  );

  // Récupérer les sollicitations
  const {
    data,
    loading: loadingServices,
    error: errorServices,
  } = useGetData(`services/forUpdate`);

  //effectue la mise à jour de la page quand on a la data
  useEffect(() => {
    if (data) {
      setServices(data);
    }
    // console.log(services);
  }, [data]);

  const methods = useForm({
    defaultValues: {
      libelle: "",
      description: "",
      idService: "",
      urgent: false,
      important: false,
    },
  });

  //   console.log(services);

  useEffect(() => {
    if (sollicitation) {
      methods.setValue("libelle", sollicitation.libelle);
      methods.setValue("description", sollicitation.description);
      methods.setValue("idService", sollicitation.idService);
    }
  }, [sollicitation, methods]);

  const { handleSubmit, reset } = methods;

  const clearForm = () => {
    reset(); // Réinitialisation des valeurs
    setError("");
  };

  const onSubmit = async (data) => {
    setLoading(true); // Active le chargement
    // console.log(data)

    // Créer une copie de data avec les champs formatés
    const baseDataObject = {
      ...data,
      urgent: toggleImportant,
      important: toggleUrgent,
      idService: parseInt(data.idService),
    };

    console.log(baseDataObject);
    try {
      const accessToken = AuthService.getAccessToken();

      // Envoyer la requête
      if (sollicitation) {
        await axios.put(
          `${baseUrl}/sollicitations/${sollicitation?.id}`,
          baseDataObject,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
      } else {
        await axios.post(`${baseUrl}/sollicitations`, baseDataObject, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });
      }

      clearForm(); // Réinitialise le formulaire
      setFeedbackModalOpen(false); // Ferme le modal après succès
      console.log("sollicitation ajoutée avec succès.");
      await fetchData();
    } catch (error) {
      // Gère les erreurs et affiche le message approprié
      const errorMessage =
        error.response && error.response.data
          ? error.response.data.message // Message d'erreur spécifique renvoyé par le serveur
          : "Erreur inattendue lors de l'ajout ou la modification de la sollicitation";
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
        title="Formulaire de sollicitation"
      >
        {/* Formulaire d'ajout d'evenement*/}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="px-5 py-4">
            <div className="text-sm">
              <div className="mb-3 font-medium text-gray-800 dark:text-gray-100">
                {sollicitation
                  ? `Modification de ${sollicitation.libelle}`
                  : `Soumission d'une nouvelle sollicitation `}
              </div>

              {error && (
                <p className="text-xs text-center text-red-500">{error}</p>
              )}
            </div>

            <div className="space-y-3">
              {/* Nom de l'événement et type */}
              <div className="flex items-center justify-between gap-2 mb-5">
                <div className="relative w-3/5">
                  <label
                    htmlFor="libelle"
                    className={`block mb-1 text-sm  font-medium`}
                  >
                    Libellé <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...methods.register("libelle", {
                      required: "Ce champ est requis",
                      maxLength: {
                        value: 300,
                        message: "Nombre de caractères trop grand",
                      },
                    })}
                    className={`form-input w-full ${
                      methods.formState.errors.libelle
                        ? "border border-red-500"
                        : ""
                    }`}
                    type="text"
                    placeholder="Libellé de la sollicitation"
                  />
                  {methods.formState.errors.libelle && (
                    <p className="absolute left-0 text-xs text-red-500 -bottom-5">
                      {methods.formState.errors.libelle.message}
                    </p>
                  )}
                </div>
                <div className="relative w-2/5">
                  <label
                    htmlFor="idService"
                    className="block text-sm font-medium mb-1"
                  >
                    Service <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...methods.register("idService", {
                      required: {
                        value: true,
                        message: "Ce champ est requis",
                      },
                    })}
                    className={`form-select w-full ${
                      methods.formState.errors.idService
                        ? "border border-red-500"
                        : ""
                    }`}
                  >
                    {services.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.libelle}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {/* Description */}
              <div className="relative mb-5">
                <label
                  htmlFor="description"
                  className="block mb-1 text-sm font-medium"
                >
                  Description
                </label>
                <textarea
                  {...methods.register("description", {
                    maxLength: {
                      value: 2500,
                      message: "Nombre de caractères trop grand",
                    },
                  })}
                  className={`form-input w-full ${
                    methods.formState.errors.description
                      ? "border border-red-500"
                      : ""
                  }`}
                  placeholder="Description de la sollicitation"
                />
                {methods.formState.errors.description && (
                  <p className="absolute left-0 text-xs text-red-500 -bottom-5">
                    {methods.formState.errors.description.message}
                  </p>
                )}
              </div>
              {/* Checkboxes */}
              {!sollicitation && (
                <div className="flex flex-wrap gap-5 justify-start mt-10">
                  <div>
                    <label
                      htmlFor="important"
                      className="block text-sm font-medium mb-1"
                    >
                      Important
                    </label>
                    <div className="form-switch">
                      <input
                        type="checkbox"
                        id="switch-important"
                        className="sr-only"
                        checked={toggleImportant}
                        {...methods.register("important")}
                        onChange={() => setToggleImportant(!toggleImportant)}
                      />
                      <label
                        className="bg-gray-400 dark:bg-gray-700"
                        htmlFor="switch-important"
                      >
                        <span
                          className="bg-white shadow-sm"
                          aria-hidden="true"
                        ></span>
                      </label>
                    </div>
                    <div className="text-sm text-gray-400 dark:text-gray-500 italic ml-2">
                      {toggleImportant ? "Oui" : "Non"}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="urgent"
                      className="block text-sm font-medium mb-1"
                    >
                      Urgent
                    </label>
                    <div className="form-switch">
                      <input
                        type="checkbox"
                        id="switch-urgent"
                        className="sr-only"
                        checked={toggleUrgent}
                        {...methods.register("urgent")}
                        onChange={() => setToggleUrgent(!toggleUrgent)}
                      />
                      <label
                        className="bg-gray-400 dark:bg-gray-700"
                        htmlFor="switch-urgent"
                      >
                        <span
                          className="bg-white shadow-sm"
                          aria-hidden="true"
                        ></span>
                      </label>
                    </div>
                    <div className="text-sm text-gray-400 dark:text-gray-500 italic ml-2">
                      {toggleUrgent ? "Oui" : "Non"}
                    </div>
                  </div>
                </div>
              )}
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

export default AddSollicitations;

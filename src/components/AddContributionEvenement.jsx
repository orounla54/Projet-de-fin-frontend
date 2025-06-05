import React, { useEffect, useState } from "react";
import { baseURL } from "../utils/DataFront/eventTypes";
import { useForm } from "react-hook-form";
import axios from "axios";
import AuthService from "../utils/Auth/AuthServices";
import ModalBasic from "./ModalBasic";

function AddFileConducteurEvenement({
  fetchData,
  feedbackModalOpen,
  setFeedbackModalOpen,
  event,
  fileConducteur,
}) {
  const baseUrl = baseURL;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const methods = useForm({
    defaultValues: {
      libelle: "",
      description: "",
      date: "",
      heureDebut: "",
      heureFin: "",
    },
  });

  useEffect(() => {
    if (fileConducteur) {
      methods.setValue("libelle", fileConducteur.libelle);
      methods.setValue("description", fileConducteur.description);
      // Formater l'heure au format HH:mm:ss
      methods.setValue(
        "heureDebut",
        new Date(fileConducteur.heureDebut).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
      methods.setValue(
        "heureFin",
        new Date(fileConducteur.heureFin).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    }
  }, [fileConducteur, methods]);

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
      date: new Date(event?.eventStart),
      heureDebut:
        data.heureDebut.length === 5
          ? data.heureDebut + ":00"
          : data.heureDebut,
      heureFin:
        data.heureFin.length === 5 ? data.heureFin + ":00" : data.heureFin,
    };

    //convertisseur pour verif
    const toDate = (timeString) => {
      const [hours, minutes, seconds] = timeString.split(":").map(Number);
      return new Date(1970, 0, 1, hours, minutes, seconds); // Date fictive pour ne comparer que l'heure
    };

    const heureDebutDate = toDate(baseDataObject.heureDebut);
    const heureFinDate = toDate(baseDataObject.heureFin);

    const verifTime = heureDebutDate < heureFinDate;

    if (verifTime) {
      console.log(baseDataObject);
      try {
        const accessToken = AuthService.getAccessToken();

        // Envoyer la requête
        if (fileConducteur) {
          await axios.put(
            `${baseUrl}/fileConducteur/${fileConducteur?.id}/societe/evenements`,
            baseDataObject,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
        } else {
          await axios.post(
            `${baseUrl}/addFileConducteur/societe/evenements/${event?.id}`,
            baseDataObject,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
        }

        clearForm(); // Réinitialise le formulaire
        setFeedbackModalOpen(false); // Ferme le modal après succès
        console.log("File conducteur ajoutés avec succès.");
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
    } else {
      setError("L'heure de debut n'est pas inferieur à l'heure de fin");
      setLoading(false); // Désactive le chargement
    }
  };

  return (
    <div className="relative">
      <ModalBasic
        id="feedback-modal"
        modalOpen={feedbackModalOpen}
        setModalOpen={setFeedbackModalOpen}
        title="Formulaire file conducteur"
      >
        {/* Formulaire d'ajout d'evenement*/}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="px-5 py-4">
            <div className="text-sm">
              <div className="mb-3 font-medium text-gray-800 dark:text-gray-100">
              {fileConducteur ? `Modification de ${fileConducteur.libelle}` : `Ajouter un file conducteur à ${event?.eventName}`} 
              </div>

              {error && (
                <p className="text-xs text-center text-red-500">{error}</p>
              )}
            </div>

            <div className="space-y-3">
              {/* Nom de l'événement et type */}
              <div className="flex items-center justify-between gap-2 mb-5">
                <div className="relative w-full">
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
                        value: 250,
                        message: "Nombre de caractères trop grand",
                      },
                    })}
                    className={`form-input w-full ${
                      methods.formState.errors.libelle
                        ? "border border-red-500"
                        : ""
                    }`}
                    type="text"
                    placeholder="Libellé de l'événement"
                  />
                  {methods.formState.errors.libelle && (
                    <p className="absolute left-0 text-xs text-red-500 -bottom-5">
                      {methods.formState.errors.libelle.message}
                    </p>
                  )}
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
                      value: 400,
                      message: "Nombre de caractères trop grand",
                    },
                  })}
                  className={`form-input w-full ${
                    methods.formState.errors.description
                      ? "border border-red-500"
                      : ""
                  }`}
                  placeholder="Description de l'événement"
                />
                {methods.formState.errors.description && (
                  <p className="absolute left-0 text-xs text-red-500 -bottom-5">
                    {methods.formState.errors.description.message}
                  </p>
                )}
              </div>

              {/* Dates de début et de fin */}
              <div className="grid gap-4 mb-5 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="heureDebut"
                    className="block mb-1 text-sm font-medium"
                  >
                    Heure de début
                  </label>
                  <input
                    {...methods.register("heureDebut", {
                      required: "Ce champ est requis",
                    })}
                    type="time"
                    className={`form-input w-full ${
                      methods.formState.errors.heureDebut
                        ? "border border-red-500"
                        : ""
                    }`}
                  />
                  {methods.formState.errors.heureDebut && (
                    <p className="absolute left-0 text-xs text-red-500 -bottom-5">
                      {methods.formState.errors.heureDebut.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="heureFin"
                    className="block mb-1 text-sm font-medium"
                  >
                    Heure de fin
                  </label>
                  <input
                    {...methods.register("heureFin", {
                      required: "Ce champ est requis",
                    })}
                    type="time"
                    className={`form-input w-full ${
                      methods.formState.errors.heureFin
                        ? "border border-red-500"
                        : ""
                    }`}
                  />
                  {methods.formState.errors.heureFin && (
                    <p className="absolute left-0 text-xs text-red-500 -bottom-5">
                      {methods.formState.errors.heureFin.message}
                    </p>
                  )}
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

export default AddFileConducteurEvenement;

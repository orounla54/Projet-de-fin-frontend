import React, { use, useEffect, useState } from "react";
import ModalBasic from "../ModalBasic";
import { baseURL, eventTypes } from "../../utils/DataFront/eventTypes";
import AuthService from "../../utils/Auth/AuthServices";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useGetData } from "../../utils/Requests/RequestService";

function FormulaireEvent({
  event,
  feedbackModalOpen,
  setFeedbackModalOpen,
  fetchData,
  fetchDataListe,
}) {
  const { pathname } = location;
  const baseUrl = baseURL;
  const [loadingAddEvent, setLoadingAddEvent] = useState(false);
  const [errorAddEvent, setErrorAddEvent] = useState(null);

  const [eventTypesList, setEventTypesList] = useState([]);
  const [togglePrivate, setTogglePrivate] = useState(event.private);

  const eventCurrent = Object.keys(event).length > 0;
  const [categories, setCategories] = useState([]);
 
  const {
    data: dataCategories,
    loading: loadingCategories,
    error: errorCategories,
  } = useGetData(`categories/evenements?keyword=`);

  useEffect(() => {
    // Utiliser les données importées directement
    setEventTypesList(eventTypes); // Ajouter directement les données statiques dans le state
    if (dataCategories) {
      setCategories(dataCategories);
    }
  }, [dataCategories]);

  const methods = useForm({
    defaultValues: {
      eventName: eventCurrent ? event.eventName : "",
      description: eventCurrent ? event.description : "",
      location: eventCurrent ? event.location : "",
      date: eventCurrent
        ? new Date(event.eventStart).toISOString().split("T")[0]
        : "",
      eventStart: eventCurrent
        ? new Date(event.eventStart).toTimeString().slice(0, 5)
        : "",
      eventEnd: eventCurrent
        ? new Date(event.eventEnd).toTimeString().slice(0, 5)
        : "",
      enventType: eventCurrent ? event.enventType : "", // Correction ici
      idCategorieEvent: null,
      NbrePlace: null,
    },
  });
  
  // Utiliser useEffect pour synchroniser les toggle avec les valeurs de `tache`
  useEffect(() => {
    if (event) {
      setTogglePrivate(eventCurrent ? event.private : false);
    }
  }, [event]);

  const { handleSubmit, reset } = methods;

  // Synchronisation des responsables par défaut
  useEffect(() => {
    if (eventCurrent) {
      methods.setValue("eventName", event.eventName);
      methods.setValue("description", event.description);
      methods.setValue("location", event.location);
      methods.setValue(
        "date",
        new Date(event.eventStart).toISOString().split("T")[0]
      );
      methods.setValue(
        "eventStart",
        new Date(event.eventStart).toTimeString().slice(0, 5)
      );
      methods.setValue(
        "eventEnd",
        new Date(event.eventEnd).toTimeString().slice(0, 5)
      );
      methods.setValue("enventType", event.enventType);
      methods.setValue("idCategorieEvent", event.idCategorieEvent);
      methods.setValue("NbrePlace", event.NbrePlace);
    }
  }, [eventCurrent, methods, categories, eventTypesList]);

  const clearForm = () => {
    reset(); // Réinitialisation des valeurs
  };

  const onSubmit = async (data) => {
    setLoadingAddEvent(true); // Active le chargement

    try {
      // Création de l'objet avec les champs formatés
      const baseDataObject = {
        ...data,
        eventStart: `${data.date} ${data.eventStart}`,
        eventEnd: `${data.date} ${data.eventEnd}`,
        idCategorieEvent: parseInt(data.idCategorieEvent),
      };

      // console.log("Données envoyées :", baseDataObject);

      // Récupération du token d'accès
      const accessToken = AuthService.getAccessToken();
      if (!accessToken) {
        throw new Error("Token d'accès manquant. Veuillez vous reconnecter.");
      }

      // Envoi de la requête PUT
      await axios.put(`${baseUrl}/evenements/${event.id}`, baseDataObject, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setFeedbackModalOpen(false); // Ferme le modal après succès
      console.log("Événement modifié avec succès.");
      await fetchDataListe();
      await fetchData(); // Rafraîchit les données
    } catch (error) {
      console.error("Erreur lors de la modification de l'événement :", error);

      // Gestion des erreurs serveur et erreurs inattendues
      const errorMessage =
        error.response?.data?.message ||
        "Erreur inattendue lors de la modification de l'événement.";
      setErrorAddEvent(errorMessage);
    } finally {
      setLoadingAddEvent(false); // Désactive le chargement
    }
  };

  return (
    <ModalBasic
      id="feedback-modal"
      modalOpen={feedbackModalOpen}
      setModalOpen={setFeedbackModalOpen}
      title="Modification d'un evenement"
    >
      {/* Formulaire d'ajout d'evenement*/}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="px-5 py-4">
          <div className="text-sm">
            <div className="mb-3 font-medium text-gray-800 dark:text-gray-100">
              Modifier l'événement{" "}
              <span className="text-violet-500">{event.eventName}</span>
            </div>

            {errorAddEvent && (
              <p className="text-xs text-center text-red-500">
                {errorAddEvent}
              </p>
            )}
          </div>

          <div className="space-y-3">
            {/* Nom de l'événement et type */}
            <div className="flex items-center justify-between gap-2 mb-5">
              <div className="relative w-3/5">
                <label
                  htmlFor="eventName"
                  className="block mb-1 text-sm font-medium"
                >
                  Libellé <span className="text-red-500">*</span>
                </label>
                <input
                  {...methods.register("eventName", {
                    required: "Ce champ est requis",
                    maxLength: {
                      value: 150,
                      message: "Nombre de caractères trop grand",
                    },
                  })}
                  className={`form-input w-full ${
                    methods.formState.errors.eventName
                      ? "border border-red-500"
                      : ""
                  }`}
                  type="text"
                  placeholder="Libellé de l'événement"
                />
                {methods.formState.errors.eventName && (
                  <p className="absolute left-0 text-xs text-red-500 -bottom-5">
                    {methods.formState.errors.eventName.message}
                  </p>
                )}
              </div>

              <div className="relative w-2/5">
                <label
                  htmlFor="enventType"
                  className={`block mb-1 ${
                    pathname.includes("/societe")
                      ? "text-xs"
                      : "text-sm font-medium"
                  }  `}
                >
                  Type d'événement <span className="text-red-500">*</span>
                </label>
                <select
                  {...methods.register("enventType", {
                    required: "Ce champ est requis",
                  })}
                  className={`form-input w-full ${
                    methods.formState.errors.enventType
                      ? "border border-red-500"
                      : ""
                  }`}
                >
                  <option value="">-- Sélectionnez un type --</option>
                  {eventTypesList.map((type) => (
                    <option key={type.id} value={type.name}>
                      {type.name}
                    </option>
                  ))}
                </select>
                {methods.formState.errors.enventType && (
                  <p className="absolute left-0 text-xs text-red-500 -bottom-5">
                    {methods.formState.errors.enventType.message}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between gap-2 mb-5">

              {pathname.includes("/societe") && (
                <div className="relative w-3/5">
                  <label
                    htmlFor="idCategorieEvent"
                    className="block mb-1 text-xs font-medium"
                  >
                    Categories <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...methods.register("idCategorieEvent", {
                      required: "Ce champ est requis",
                    })}
                    className={`form-input w-full ${
                      methods.formState.errors.idCategorieEvent
                        ? "border border-red-500"
                        : ""
                    }`}
                  >
                    <option value="">-- Sélectionnez la categories --</option>
                    {categories.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.libelle}
                      </option>
                    ))}
                  </select>
                  {methods.formState.errors.idCategorieEvent && (
                    <p className="absolute left-0 text-xs text-red-500 -bottom-5">
                      {methods.formState.errors.idCategorieEvent.message}
                    </p>
                  )}
                </div>
              )}
              {pathname.includes("/societe") && (
                  <div className="relative w-2/5">
                    <label
                      htmlFor="idCategorieEvent"
                      className="block mb-1 text-sm font-medium"
                    >
                     Nombre de Participations <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      {...methods.register("NbrePlace", {
                        required: "Ce champ est requis",
                      })}
                      className={`form-input w-full ${
                        methods.formState.errors.NbrePlace
                          ? "border border-red-500"
                          : ""
                      }`}
                    />
                    {methods.formState.errors.NbrePlace && (
                      <p className="absolute left-0 text-xs text-red-500 -bottom-5">
                        {methods.formState.errors.NbrePlace.message}
                      </p>
                    )}
                  </div>
                )}
            </div>

            {/* location */}
            <div className="relative mb-5">
              <label
                htmlFor="location"
                className="block mb-1 text-sm font-medium"
              >
                Emplacement-Lieux
              </label>
              <input
                {...methods.register("location", {
                  maxLength: {
                    value: 700,
                    message: "Nombre de caractères trop grand",
                  },
                })}
                className={`form-input w-full ${
                  methods.formState.errors.location
                    ? "border border-red-500"
                    : ""
                }`}
                placeholder="Entrez le lieux de l'événement"
              />
              {methods.formState.errors.location && (
                <p className="absolute left-0 text-xs text-red-500 -bottom-5">
                  {methods.formState.errors.location.message}
                </p>
              )}
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
                    value: 2000,
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
            <div className="grid gap-4 mb-5 md:grid-cols-3">
              <div>
                <label
                  htmlFor="date"
                  className="block mb-1 text-sm font-medium"
                >
                  Date
                </label>
                <input
                  {...methods.register("date", {
                    required: "Ce champ est requis",
                  })}
                  type="date"
                  className={`form-input w-full ${
                    methods.formState.errors.dateStart
                      ? "border border-red-500"
                      : ""
                  }`}
                />
                {methods.formState.errors.date && (
                  <p className="absolute left-0 text-xs text-red-500 -bottom-5">
                    {methods.formState.errors.date.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="eventStart"
                  className="block mb-1 text-sm font-medium"
                >
                  Heure de début
                </label>
                <input
                  {...methods.register("eventStart", {
                    required: "Ce champ est requis",
                  })}
                  type="time"
                  className={`form-input w-full ${
                    methods.formState.errors.eventStart
                      ? "border border-red-500"
                      : ""
                  }`}
                />
                {methods.formState.errors.eventStart && (
                  <p className="absolute left-0 text-xs text-red-500 -bottom-5">
                    {methods.formState.errors.eventStart.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="eventEnd"
                  className="block mb-1 text-sm font-medium"
                >
                  Heure de fin
                </label>
                <input
                  {...methods.register("eventEnd", {
                    required: "Ce champ est requis",
                  })}
                  type="time"
                  className={`form-input w-full ${
                    methods.formState.errors.eventEnd
                      ? "border border-red-500"
                      : ""
                  }`}
                />
                {methods.formState.errors.eventEnd && (
                  <p className="absolute left-0 text-xs text-red-500 -bottom-5">
                    {methods.formState.errors.eventEnd.message}
                  </p>
                )}
              </div>
            </div>
          </div>
          {!pathname.includes("/societe") && (
            <div className="flex items-center justify-center gap-2">
              <label
                htmlFor="private"
                className="block mb-1 text-sm font-medium"
              >
                Privé
              </label>
              <div className="form-switch">
                <input
                  type="checkbox"
                  id="switch-private"
                  className="sr-only"
                  checked={togglePrivate}
                  {...methods.register("private")}
                  onChange={() => setTogglePrivate(!togglePrivate)}
                />
                <label
                  className="bg-gray-400 dark:bg-gray-700"
                  htmlFor="switch-private"
                >
                  <span
                    className="bg-white shadow-sm"
                    aria-hidden="true"
                  ></span>
                </label>
              </div>
              <div className="ml-2 text-sm italic text-gray-400 dark:text-gray-500">
                {togglePrivate ? "Oui" : "Non"}
              </div>
            </div>
          )}
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
                  {loadingAddEvent ? (
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
  );
}

export default FormulaireEvent;

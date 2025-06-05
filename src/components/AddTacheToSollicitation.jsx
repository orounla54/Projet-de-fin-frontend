import React, { useEffect, useState } from "react";
import { baseURL, eventTypes } from "../utils/DataFront/eventTypes";
import { useForm } from "react-hook-form";
import axios from "axios";
import AuthService from "../utils/Auth/AuthServices";
import ModalBasic from "./ModalBasic";
import { useGetData } from "../utils/Requests/RequestService";
import SpinnerLoading from "./SpinnerLoading";

function AddTacheToSollicitation({
  fetchData,
  feedbackModalOpen,
  setFeedbackModalOpen,
  sollicitation,
  tache,
  priorite
}) {
  const baseUrl = baseURL;

  const [togglePrivate, setTogglePrivate] = useState(false);
  const [toggleImportant, setToggleImportant] = useState(false);
  const [toggleUrgent, setToggleUrgent] = useState(false);

  const [keyword, setKeyword] = useState("");
  const [projets, setProjets] = useState([]);
  const [responsables, setResponsables] = useState([]);
  const [responsablesAutre, setResponsablesAutre] = useState([]);
  const [serviceSelectId, setServiceSelectId] = useState();
  const [typesTaches, setTypesTaches] = useState([]);
  const [msgError, setMsgError] = useState();

  const [responsablesSelect, setResponsablesSelect] = useState([]);
  const [responsablesAllSelect, setResponsablesAllSelect] = useState([]);
  const tacheExiste = Object.keys(tache).length > 0;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [services, setServices] = useState([]);

  const methods = useForm({
    defaultValues: {
      libelle: tacheExiste ? tache.libelle : "",
      Responsable_Prin: tacheExiste ? tache.Responsable_Prin : "",
      description: tacheExiste ? tache.description : "",
      categorie: tacheExiste ? tache.categorie : "",
      datePriseDecision: tacheExiste ? tache.datePriseDecision : "",
      dateDebut: tacheExiste ? tache.dateDebut : "",
      dateFin: tacheExiste ? tache.dateFin : "",
      deadline: tacheExiste ? tache.deadline : "", // Assurez-vous que cette valeur est une chaîne vide si tache.deadline est indéfini
      idStatusTache: tacheExiste ? tache.idStatusTache : 1,
      idTypesTache: tacheExiste ? tache.idTypesTache : 0,
      idProjet: tacheExiste ? tache.idProjet : null,
      private: false,
      important: false,
      urgent: false,
      responsables: tacheExiste ? tache.Responsables || [] : [], // Valeur par défaut pour responsables
    },
  });

  const { handleSubmit, reset } = methods;

  // Synchronisation des responsables par défaut
  useEffect(() => {
    if (tacheExiste && responsablesSelect.length > 0) {
      const responsablesIds = responsablesSelect.map((r) => r.id);
      methods.setValue("responsables", responsablesIds);
    }
  }, [tacheExiste, responsablesSelect, methods]);

  useEffect(() => {
    if (tacheExiste) {
      // Définir les champs simples
      const simpleFields = [
        "libelle",
        "Responsable_Prin",
        "description",
        "categorie",
        "idTypesTache",
        "idStatusTache",
        "idProjet",
        "responsables",
      ];

      simpleFields.forEach((field) => {
        if (tache[field] !== undefined) {
          methods.setValue(field, tache[field]);
        }
      });

      methods.setValue("private", togglePrivate);
      methods.setValue("important", toggleImportant);
      methods.setValue("urgent", toggleUrgent);
      methods.setValue("responsables", responsablesAllSelect);
      // Fonction utilitaire pour formater les dates
      const formatDate = (date) =>
        date ? new Date(date).toISOString().split("T")[0] : "";

      // Définir les champs de date avec vérification
      const dateFields = {
        datePriseDecision: tache.datePriseDecision,
        dateDebut: tache.dateDebut,
        dateFin: tache.dateFin,
        deadline: tache.deadline,
      };

      Object.entries(dateFields).forEach(([key, value]) => {
        methods.setValue(key, formatDate(value));
      });
    }
  }, [tacheExiste, tache, methods]);

  // Utiliser useEffect pour synchroniser les toggle avec les valeurs de `tache`
  useEffect(() => {
    if (tacheExiste) {
      setTogglePrivate(tache.private);
      setToggleImportant(tache.important);
      setToggleUrgent(tache.urgent);
    }
  }, [tacheExiste]);

  useEffect(() => {
    if (tache?.Responsables) {
      try {
        const parsedResponsables = JSON.parse(tache.Responsables);
        setResponsablesSelect(parsedResponsables);
        setResponsablesAllSelect(
          parsedResponsables.map((r) => {
            return parseInt(r.id);
          })
        );
      } catch (error) {
        console.error(
          "Erreur lors de l'analyse de la chaîne JSON des responsables :",
          error
        );
      }
    }
    // console.log(responsablesSelect);
  }, [tache]);

  const [statusTaches, setStatusTaches] = useState([
    { id: 1, name: "Non-démarré" },
    { id: 2, name: "En-cours" },
    { id: 3, name: "Terminé" },
  ]);

  // Construire dynamiquement l'URL en fonction de l'existence de `filter`
  const queryParams = new URLSearchParams({
    keyword: keyword,
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
      setResponsablesAutre(data);
    }
  }, [data]);

  const {
    data: servicesData,
    loading: servicesLoading,
    error: servicesError,
  } = useGetData(`/services/forUpdate`);

  // Met à jour les etats
  const {
    data: projetsData,
    loading: projetsLoading,
    error: projetsError,
  } = useGetData(`/projets`);

  const {
    data: responsablesData,
    loading: responsablesLoading,
    error: responsablesError,
  } = useGetData(`/responsables`);

  const {
    data: typesTachesData,
    loading: typesTachesLoading,
    error: typesTachesError,
  } = useGetData(`/typesTaches`);

  //chargement des selects
  useEffect(() => {
    if (projetsData) {
      setProjets(projetsData);
    }
    if (responsablesData) {
      setResponsables(responsablesData);
    }
    if (servicesData) {
      setServices(servicesData);
      setServiceSelectId(servicesData?.[0]?.id);
    }
    if (typesTachesData) {
      setTypesTaches(typesTachesData);
    }
  }, [projetsData, responsablesData, typesTachesData, servicesData]);

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

  const clearForm = () => {
    reset(); // Réinitialisation des valeurs
    setError("");
    setResponsablesAllSelect(null);
  };

  const onSubmit = async (data) => {
    setLoading(true); // Active le chargement
    // console.log(data)

    try {
      // Gérer `responsablesArray` correctement
      const responsablesArray = Array.isArray(data.responsables)
        ? data.responsables.includes(data.Responsable_Prin)
          ? [...responsablesAllSelect]
          : [...responsablesAllSelect, data.Responsable_Prin]
        : [
            ...JSON.parse(data.responsables || "[]").filter(
              (responsable) => responsable !== data.Responsable_Prin
            ),
            data.Responsable_Prin,
          ];

      // Créer l'objet avec les conversions
      const IdDataConvers = {
        ...data,
        idStatusTache: parseInt(data.idStatusTache, 10),
        idTypesTache: parseInt(data.idTypesTache, 10),
        idProjet: parseInt(data.idProjet, 10),
        responsables: responsablesArray.map((responsable) =>
          parseInt(responsable, 10)
        ),
        datePriseDecision: data.datePriseDecision
          ? new Date(data.datePriseDecision)
          : null,
        dateDebut: data.dateDebut ? new Date(data.dateDebut) : null,
        dateFin: data.dateFin ? new Date(data.dateFin) : null,
        deadline: data.deadline ? new Date(data.deadline) : null,
        idSollicitation: sollicitation?.id || null,
        idPriorite: priorite?.id || null,
      };
      const accessToken = AuthService.getAccessToken();

      // Envoyer la requête
      if (tacheExiste) {
        await axios.put(`${baseUrl}/taches/${tache?.id}`, IdDataConvers, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });
      } else {
        await axios.post(`${baseUrl}/taches`, IdDataConvers, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });
      }

      clearForm(); // Réinitialise le formulaire
      setFeedbackModalOpen(false); // Ferme le modal après succès
      console.log("Tache ajoutée avec succès.");
      await fetchData();
    } catch (error) {
      // Gère les erreurs et affiche le message approprié
      const errorMessage =
        error.response && error.response.data
          ? error.response.data.message // Message d'erreur spécifique renvoyé par le serveur
          : "Erreur inattendue lors de l'ajout ou la modification de la tache";
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
        title="Formulaire de tache"
      >
        {/* Formulaire d'ajout d'evenement*/}
        <form onSubmit={handleSubmit(onSubmit)} className="">
          <div className="w-full px-2 py-4 mx-auto sm:px-4 lg:px-6">
            <h1 className="mb-8 text-xl font-bold text-gray-800 md:text-xl dark:text-gray-100">
              {tacheExiste ? (
                <>
                  Modification de la tache:{" "}
                  <span className="underline">{tache.libelle} </span>{" "}
                </>
              ) : (
                `Ajout de tache à ${sollicitation?.libelle}`
              )}
            </h1>

            {/* Libelle et type tache */}
            <div className="flex items-center justify-between gap-2 mb-5">
              <div className="relative w-3/5">
                <label
                  htmlFor="libelle"
                  className="block mb-1 text-sm font-medium"
                >
                  Libelle <span className="text-red-500">*</span>
                </label>
                <input
                  {...methods.register("libelle", {
                    required: "Libelle est requis",
                    maxLength: {
                      value: 250, // Par exemple, 1000 caractères
                      message: "Nombre de caractere trop grand",
                    },
                  })}
                  className={`form-input w-full ${
                    methods.formState.errors.libelle
                      ? "border border-red-500"
                      : ""
                  }`}
                  type="text"
                  placeholder="Libelle de la tâche"
                />
                {methods.formState.errors.libelle && (
                  <p className="absolute left-0 text-xs text-red-500 -bottom-5">
                    {methods.formState.errors.libelle.message}
                  </p>
                )}
              </div>

              <div className="relative w-2/5">
                <label
                  htmlFor="idTypesTache"
                  className="block mb-1 text-sm font-medium"
                >
                  Type de Tâche <span className="text-red-500">*</span>
                </label>

                {typesTachesLoading && <SpinnerLoading />}
                <select
                  {...methods.register("idTypesTache", {
                    required: "Le type de tâche est requis",
                  })}
                  className={`form-input w-full ${
                    methods.formState.errors.idTypesTache
                      ? "border border-red-500"
                      : ""
                  }`}
                >
                  <option value="">-- Sélectionnez un type de tâche --</option>
                  {typesTaches.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.libelle}
                    </option>
                  ))}
                </select>
                {methods.formState.errors.idTypesTache && ( // Correction ici
                  <p className="absolute left-0 text-xs text-red-500 sm:-bottom-9 md:-bottom-5">
                    {methods.formState.errors.idTypesTache.message}
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
                    value: 1500, // Par exemple, 1000 caractères
                    message: "Nombre de caractere trop grand",
                  },
                })}
                className={`form-input w-full ${
                  methods.formState.errors.description
                    ? "border border-red-500"
                    : ""
                }`}
                placeholder="Description de la tâche"
              />
              {methods.formState.errors.description && (
                <p className="absolute left-0 text-xs text-red-500 sm:-bottom-9 md:-bottom-5">
                  {methods.formState.errors.description.message}
                </p>
              )}
            </div>

            {/* Responsables */}
            <div className="flex justify-between gap-2 mb-5">
              <div className="relative w-1/1">
                <label
                  htmlFor="Responsable_Prin"
                  className="block mb-1 text-sm font-medium"
                >
                  Responsables principale{" "}
                  <span className="text-red-500">*</span>
                </label>
                <select
                  {...methods.register("Responsable_Prin", {
                    required:
                      "Vous devez sélectionner un responsable principale",
                  })}
                  className={`form-input w-full ${
                    methods.formState.errors.Responsable_Prin
                      ? "border border-red-500"
                      : ""
                  }`}
                  defaultValue={
                    tacheExiste
                      ? tacheExiste.Responsable_Prin // Préselection des responsables
                      : ""
                  }
                >
                  {responsables.map((responsable) => (
                    <option key={responsable.id} value={`${responsable.id}`}>
                      {responsable.nom} {responsable.prenom}
                    </option>
                  ))}
                </select>
                {methods.formState.errors.Responsable_Prin && (
                  <p className="absolute w-48 text-xs text-red-500 top-6 left-52 sm:-bottom-9 md:-bottom-5">
                    {methods.formState.errors.Responsable_Prin.message}
                  </p>
                )}
              </div>
            </div>

            {/* Autre Responsables */}
            <div className="flex justify-between gap-2 mb-5">
              <div className="relative w-1/2">
                <label
                  htmlFor="services"
                  className="block mb-1 text-sm font-medium"
                >
                  Services<span className="text-gray-500">*</span>
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
                  onDoubleClick={() => {
                    clearForm();
                  }}
                  htmlFor="responsables"
                  className="block mb-1 text-sm font-medium"
                >
                  Autres Responsables<span className="text-gray-500">*</span>
                </label>
                <select
                  {...methods.register("responsables")}
                  className={`form-input w-full ${
                    methods.formState.errors.responsables
                      ? "border border-red-500"
                      : ""
                  }`}
                  multiple
                  size={1}
                  value={responsablesAllSelect} // Utilisez `value` pour une gestion réactive
                  onChange={(e) => handleSelectChange(e)}
                >
                  {responsablesAutre.map((responsable) => (
                    <option key={responsable.id} value={responsable.id}>
                      {responsable.nom} {responsable.prenom}
                    </option>
                  ))}
                </select>
                <p className="absolute left-0 text-xs text-slate-500 sm:-bottom-10 md:-bottom-10">
                  Choisir un autre responsable n'est pas requis
                </p>
              </div>
            </div>

            {/* Catégorie */}
            <div className="relative mb-5">
              <label
                htmlFor="categorie"
                className="block mb-1 text-sm font-medium"
              >
                Catégorie
              </label>
              <input
                {...methods.register("categorie", {
                  maxLength: {
                    value: 50,
                    message: "La catégorie ne peut pas dépasser 50 caractères", // Exemple de validation de longueur
                  },
                })}
                className={`form-input w-full ${
                  methods.formState.errors.categorie
                    ? "border border-red-500"
                    : ""
                }`}
                type="text"
                placeholder="Entrez la catégorie de la tâche"
              />
              {methods.formState.errors.categorie && (
                <p className="absolute left-0 text-xs text-red-500 sm:-bottom-9 md:-bottom-5">
                  {methods.formState.errors.categorie.message}
                </p>
              )}
            </div>

            {/* Dates */}
            <div className="grid gap-4 mb-5 md:grid-cols-2">
              {/* Datepicker pour la plage de dates */}

              <div>
                <label
                  htmlFor="dateDebut"
                  className="block mb-1 text-sm font-medium"
                >
                  Date du debut
                </label>
                <input
                  {...methods.register("dateDebut")}
                  type="date"
                  className="w-full form-input"
                />
              </div>

              <div>
                <label
                  htmlFor="dateFin"
                  className="block mb-1 text-sm font-medium"
                >
                  Date de fin
                </label>
                <input
                  {...methods.register("dateFin")}
                  type="date"
                  className="w-full form-input"
                />
              </div>

              <div>
                <label
                  htmlFor="datePriseDecision"
                  className="block mb-1 text-sm font-medium"
                >
                  Date de prise de décision
                </label>
                <input
                  {...methods.register("datePriseDecision")}
                  type="date"
                  className="w-full form-input"
                />
              </div>

              {/* Deadline */}
              <div>
                <label
                  htmlFor="deadline"
                  className="block mb-1 text-sm font-medium"
                >
                  Deadline
                </label>
                <input
                  {...methods.register("deadline")}
                  type="date"
                  className="w-full form-input"
                />
              </div>
            </div>

            {/* Status & Type */}
            <div className="flex gap-5 mb-5 md:grid-cols-2">
              <div className="w-2/5">
                <label
                  htmlFor="idStatusTache"
                  className="block mb-1 text-sm font-medium"
                >
                  Status de la Tâche
                </label>
                <select
                  {...methods.register("idStatusTache")}
                  className="w-full form-select"
                >
                  {statusTaches.map((statusTache) => (
                    <option key={statusTache.id} value={statusTache.id}>
                      {statusTache.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Projet */}
              <div className="relative w-3/5">
                <label
                  htmlFor="idProjet"
                  className="block mb-1 text-sm font-medium"
                >
                  Projet <span className="text-slate-500">*</span>
                </label>
                <select
                  {...methods.register("idProjet")}
                  className="w-full form-select"
                >
                  <option value="">-- Sélectionnez le projet --</option>
                  {projets.map((projet) => (
                    <option key={projet.id} value={projet.id}>
                      {projet.libelle && projet.libelle.length > 40
                        ? `${projet.libelle.slice(0, 40)}...`
                        : projet.libelle}
                    </option>
                  ))}
                </select>{" "}
                <p className="absolute left-0 text-xs text-slate-500 sm:-bottom-9 md:-bottom-5">
                  Choisie un projet n'est pas requis
                </p>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="flex flex-wrap gap-5 mt-10 justify-evenly">
              <div>
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

              <div>
                <label
                  htmlFor="important"
                  className="block mb-1 text-sm font-medium"
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
                <div className="ml-2 text-sm italic text-gray-400 dark:text-gray-500">
                  {toggleImportant ? "Oui" : "Non"}
                </div>
              </div>

              <div>
                <label
                  htmlFor="urgent"
                  className="block mb-1 text-sm font-medium"
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
                <div className="ml-2 text-sm italic text-gray-400 dark:text-gray-500">
                  {toggleUrgent ? "Oui" : "Non"}
                </div>
              </div>
            </div>

            {/* bouton de validadion */}
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
          </div>
        </form>
      </ModalBasic>
    </div>
  );
}

export default AddTacheToSollicitation;

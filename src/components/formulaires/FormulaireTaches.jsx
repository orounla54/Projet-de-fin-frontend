import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import {
  useGetData,
  usePostData,
  usePutData,
} from "../../utils/Requests/RequestService";
import SpinnerLoading from "../SpinnerLoading";
import { Link, useNavigate } from "react-router-dom";
import { useSuccessMessage } from "../../utils/SuccessContext";

function FormulaireTaches({ tache }) {
  const [togglePrivate, setTogglePrivate] = useState(false);
  const [toggleImportant, setToggleImportant] = useState(false);
  const [toggleUrgent, setToggleUrgent] = useState(false);

  const [keyword, setKeyword] = useState("");
  const [projets, setProjets] = useState([]);
  const [responsables, setResponsables] = useState([]);
  const [responsablesAutre, setResponsablesAutre] = useState([]);
  const [services, setServices] = useState([]);
  const [serviceSelectId, setServiceSelectId] = useState();
  const [typesTaches, setTypesTaches] = useState([]);
  const [msgError, setMsgError] = useState();

  const [responsablesSelect, setResponsablesSelect] = useState([]);
  const [responsablesAllSelect, setResponsablesAllSelect] = useState([]);
  const tacheExiste = Object.keys(tache).length > 0;
  // console.log(tache);

  //utilisation du contexte concernant le success message
  const { setSuccessMessage } = useSuccessMessage();
  const navigate = useNavigate();

  //apprel de ma fonction post
  const {
    response: postResponse,
    error: postError,
    loading: postLoading,
    postData,
  } = usePostData(`taches`);

  //apprel de ma fonction update
  const {
    response: putResponse,
    error: putError,
    loading: putLoading,
    putData,
  } = usePutData(`taches/${tache.id}`);

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

  const { handleSubmit, control, setValue } = methods;

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
      setTogglePrivate(tache?.private);
      setToggleImportant(tache?.important);
      setToggleUrgent(tache?.urgent);
    }
  }, [tacheExiste]);

  useEffect(() => {
    if (tache?.Responsables) {
      try {
        // const parsedResponsables = JSON.parse(tache.Responsables);
        setResponsablesSelect(tache?.Responsables);
        setResponsablesAllSelect(
          tache?.Responsables.map((r) => {
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
    data: servicesData,
    loading: servicesLoading,
    error: servicesError,
  } = useGetData(`/services/forUpdate`);

  const {
    data: typesTachesData,
    loading: typesTachesLoading,
    error: typesTachesError,
  } = useGetData(`/typesTaches`);

  // Construire dynamiquement l'URL en fonction de l'existence de `filter`
  const queryParams = new URLSearchParams({
    keyword: keyword,
    idService: serviceSelectId ? serviceSelectId : "",
  }).toString();

  // Récupérer les données avec les paramètres de filtre conditionnels
  const { data, loading, error } = useGetData(
    `filter/responsables?${queryParams}`
  );
  useEffect(() => {
    if (data) {
      setResponsablesAutre(data);
    }
  }, [data]);

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

  // Fonction de soumission du formulaire
  const onSubmit = async (data) => {
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
      };

      console.log("Form Data:", IdDataConvers);

      // Si tache existe, vous mettez à jour la tâche, sinon vous créez une nouvelle tâche
      if (tacheExiste) {
        // Appelez votre fonction pour mettre à jour la tâche
        await putData(IdDataConvers);
        setSuccessMessage("Tâche mise à jour avec succès 👌!");
      } else {
        // Appelez votre fonction pour créer une nouvelle tâche
        await postData(IdDataConvers); // Assurez-vous que postData est la fonction fournie par le hook usePostData pour envoyer les données
        setSuccessMessage("Tâche créée avec succès 👌!");
      }

      // Rediriger l'utilisateur après la soumission
      if (!postLoading && !putLoading) {
        navigate(-1);
      } // Retour à la page précédente
    } catch (error) {
      console.error("Erreur lors de la soumission du formulaire:", error);
      setMsgError("Erreur lors de la soumission du formulaire");
    }
  };

  const clearForm = () => {
    setResponsablesAllSelect(null)
  };

  return (
    <>
      {projetsLoading ||
      responsablesLoading ||
      servicesLoading ||
      loading ||
      typesTachesLoading ? (
        <div className="absolute z-40 flex items-center justify-center w-full h-full bg-white dark:bg-gray-800">
          <SpinnerLoading />
        </div>
      ) : (
        <></>
      )}
      {postLoading || putLoading ? (
        <div className="flex items-center justify-center h-full w-full">
          <SpinnerLoading />
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="m-2">
          <Link
            className="btn-sm px-3 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-gray-800 dark:text-gray-300"
            onClick={() => navigate(-1)}
          >
            <svg
              className="fill-current text-gray-400 dark:text-gray-500 mr-2"
              width="7"
              height="12"
              viewBox="0 0 7 12"
            >
              <path d="M5.4.6 6.8 2l-4 4 4 4-1.4 1.4L0 6z" />
            </svg>
            <span>Retour</span>
          </Link>
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold mb-8">
              {tacheExiste ? (
                <>
                  Modification de la tache:{" "}
                  <span className="underline">{tache.libelle} </span>{" "}
                </>
              ) : (
                "Formulaire des Tâches"
              )}
            </h1>

            {/* Libelle et type tache */}
            <div className="flex items-center justify-between gap-2 mb-5">
              <div className="w-3/5 relative">
                <label
                  htmlFor="libelle"
                  className="block text-sm font-medium mb-1"
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
                  <p className="text-red-500 text-xs absolute -bottom-5 left-0">
                    {methods.formState.errors.libelle.message}
                  </p>
                )}
              </div>

              <div className="w-2/5 relative">
                <label
                  htmlFor="idTypesTache"
                  className="block text-sm font-medium mb-1"
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
                  {typesTaches?.length > 0 && typesTaches?.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.libelle}
                    </option>
                  ))}
                </select>
                {methods.formState.errors.idTypesTache && ( // Correction ici
                  <p className="text-red-500 text-xs absolute sm:-bottom-9 left-0 md:-bottom-5">
                    {methods.formState.errors.idTypesTache.message}
                  </p>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="relative mb-5">
              <label
                htmlFor="description"
                className="block text-sm font-medium mb-1"
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
                <p className="text-red-500 text-xs sm:-bottom-9 left-0 md:-bottom-5 absolute">
                  {methods.formState.errors.description.message}
                </p>
              )}
            </div>

            {/* Responsables */}
            <div className="mb-5 flex gap-2 justify-between">
              <div className="w-1/3 relative">
                <label
                  htmlFor="Responsable_Prin"
                  className="block text-sm font-medium mb-1"
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
                  <p className="text-red-500 text-xs sm:-bottom-9 left-0 md:-bottom-5 absolute">
                    {methods.formState.errors.Responsable_Prin.message}
                  </p>
                )}
              </div>

              <div className="w-1/3 relative">
                <label
                  htmlFor="services"
                  className="block text-sm font-medium mb-1"
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

              <div className="w-1/3 relative">
                <label
                  onDoubleClick={() => {clearForm()}}
                  htmlFor="responsables"
                  className="block text-sm font-medium mb-1"
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
                <p className="text-slate-500 text-xs sm:-bottom-9 left-0 md:-bottom-5 absolute">
                  Choisir un autre responsable n'est pas requis
                </p>
              </div>
            </div>

            {/* Catégorie */}
            <div className="relative mb-5">
              <label
                htmlFor="categorie"
                className="block text-sm font-medium mb-1"
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
                <p className="text-red-500 text-xs sm:-bottom-9 left-0 md:-bottom-5 absolute">
                  {methods.formState.errors.categorie.message}
                </p>
              )}
            </div>

            {/* Dates */}
            <div className="grid gap-4 md:grid-cols-3 mb-5">
              {/* Datepicker pour la plage de dates */}

              <div>
                <label
                  htmlFor="dateDebut"
                  className="block text-sm font-medium mb-1"
                >
                  Date du debut
                </label>
                <input
                  {...methods.register("dateDebut")}
                  type="date"
                  className="form-input w-full"
                />
              </div>

              <div>
                <label
                  htmlFor="dateFin"
                  className="block text-sm font-medium mb-1"
                >
                  Date de fin
                </label>
                <input
                  {...methods.register("dateFin")}
                  type="date"
                  className="form-input w-full"
                />
              </div>

              <div>
                <label
                  htmlFor="datePriseDecision"
                  className="block text-sm font-medium mb-1"
                >
                  Date de prise de décision
                </label>
                <input
                  {...methods.register("datePriseDecision")}
                  type="date"
                  className="form-input w-full"
                />
              </div>

              {/* Deadline */}
              <div>
                <label
                  htmlFor="deadline"
                  className="block text-sm font-medium mb-1"
                >
                  Deadline
                </label>
                <input
                  {...methods.register("deadline")}
                  type="date"
                  className="form-input w-full"
                />
              </div>
            </div>

            {/* Status & Type */}
            <div className="flex gap-5 md:grid-cols-2 mb-5">
              <div className="w-2/5">
                <label
                  htmlFor="idStatusTache"
                  className="block text-sm font-medium mb-1"
                >
                  Status de la Tâche
                </label>
                <select
                  {...methods.register("idStatusTache")}
                  className="form-select w-full"
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
                  className="block text-sm font-medium mb-1"
                >
                  Projet <span className="text-slate-500">*</span>
                </label>
                <select
                  {...methods.register("idProjet")}
                  className="form-select w-full"
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
                <p className="text-slate-500 text-xs sm:-bottom-9 left-0 md:-bottom-5 absolute">
                  Choisie un projet n'est pas requis
                </p>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="flex flex-wrap gap-5 justify-evenly mt-10">
              <div>
                <label
                  htmlFor="private"
                  className="block text-sm font-medium mb-1"
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
                <div className="text-sm text-gray-400 dark:text-gray-500 italic ml-2">
                  {togglePrivate ? "Oui" : "Non"}
                </div>
              </div>

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

            {/* bouton de validadion */}
            <button
              type="submit"
              className="mt-4 px-6 py-1.5 bg-violet-500 hover:bg-violet-600 transition-colors duration-300 text-white font-bold rounded-lg"
            >
              {tacheExiste ? "Modifier" : "Ajouter"}
            </button>
          </div>
        </form>
      )}
    </>
  );
}

export default FormulaireTaches;

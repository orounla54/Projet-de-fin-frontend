import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { usePostData, usePutData, useGetData } from "../../utils/Requests/RequestService";
import SpinnerLoading from "../SpinnerLoading";
import { Link, useNavigate } from "react-router-dom";
import { useSuccessMessage } from "../../utils/SuccessContext";

function FormulaireProjets({ projet }) {
  const navigate = useNavigate();
  const { setSuccessMessage } = useSuccessMessage();

  const projetExiste = Object.keys(projet).length > 0;

  // Récupération des postes pour la liste déroulante
  const {
    data: postes,
    loading: postesLoading,
    error: postesError,
    getData: getPostes,
  } = useGetData("postes");

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getPostes();
        console.log("Postes chargés:", postes);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      }
    };
    fetchData();
  }, []);

  // Log pour vérifier l'état des données
  useEffect(() => {
    console.log("État des données:", {
      postes,
      postesLoading,
      postesError
    });
  }, [postes, postesLoading, postesError]);

  const {
    response: postResponse,
    error: postError,
    loading: postLoading,
    postData,
  } = usePostData(`projets`);

  const {
    response: putResponse,
    error: putError,
    loading: putLoading,
    putData,
  } = usePutData(`projets/${projet.id}`);

  const methods = useForm({
    defaultValues: {
      nom: projetExiste ? projet.nom : "",
      description: projetExiste ? projet.description : "",
      dateDebut: projetExiste ? projet.dateDebut : "",
      dateFin: projetExiste ? projet.dateFin : "",
      budget: projetExiste ? projet.budget?.prevu || 0 : 0,
      progression: projetExiste ? projet.progression : 0,
      statut: projetExiste ? projet.statut : "planifie",
      responsable: projetExiste ? projet.responsable : "",
    },
  });

  const { handleSubmit, control, setValue } = methods;

  useEffect(() => {
    if (projetExiste) {
      methods.setValue("nom", projet.nom);
      methods.setValue("description", projet.description);
      methods.setValue("budget", projet.budget);
      methods.setValue("progression", projet.progression);
      methods.setValue("statut", projet.statut);
      methods.setValue("responsable", projet.responsable);
  
      const formatDate = (date) => {
        return date ? new Date(date).toISOString().split("T")[0] : "";
      };
  
      methods.setValue("dateDebut", formatDate(projet.dateDebut));
      methods.setValue("dateFin", formatDate(projet.dateFin));
    }
  }, [projetExiste, projet, methods]);

  const [msgError, setMsgError] = useState("");

  const onSubmit = async (data) => {
    try {
      const formData = {
        ...data,
        dateDebut: new Date(data.dateDebut),
        dateFin: new Date(data.dateFin),
        budget: Number(data.budget),
        progression: Number(data.progression),
      };

      console.log("Données envoyées au serveur:", formData);
      
      if (projetExiste) {
        const response = await putData(formData);
        console.log("Réponse du serveur (modification):", response);
        if (response.error) {
          throw new Error(response.error);
        }
        setSuccessMessage("Projet modifié avec succès 👌!");
      } else {
        const response = await postData(formData);
        console.log("Réponse du serveur (création):", response);
        if (response.error) {
          throw new Error(response.error);
        }
        setSuccessMessage("Projet créé avec succès 👌!");
      }

      if (!postLoading && !putLoading) {
        navigate(-1);
      }
    } catch (error) {
      console.error("Erreur détaillée:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      setMsgError(
        error.response?.data?.message || 
        error.message || 
        "Erreur lors de la soumission du formulaire"
      );
    }
  };

  if (postesLoading) {
    return <SpinnerLoading />;
  }

  return (
    <FormProvider {...methods}>
      {postLoading || putLoading || postesLoading ? (
        <div className="flex items-center justify-center h-full w-full">
          <SpinnerLoading />
        </div>
      ) : (
        <form onSubmit={methods.handleSubmit(onSubmit)} className="m-2">
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
              Formulaire des Projets
            </h1>

            {/* Nom du projet */}
            <div className="flex items-center justify-between gap-2 mb-5 flex-wrap">
              <div className="w-full relative">
                <label
                  htmlFor="nom"
                  className="block text-sm font-medium mb-1"
                >
                  Nom du projet <span className="text-red-500">*</span>
                </label>
                <input
                  {...methods.register("nom", {
                    required: "Le nom du projet est requis",
                    maxLength: {
                      value: 250,
                      message: "Le nom est trop long",
                    },
                  })}
                  className={`form-input w-full ${
                    methods.formState.errors.nom ? "border border-red-500" : ""
                  }`}
                  type="text"
                  placeholder="Nom du projet"
                />
                {methods.formState.errors.nom && (
                  <p className="text-red-500 text-xs absolute -bottom-5 left-0">
                    {methods.formState.errors.nom.message}
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
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                {...methods.register("description", {
                  required: "La description est requise",
                  maxLength: {
                    value: 2500,
                    message: "La description est trop longue",
                  },
                })}
                className={`form-input w-full ${
                  methods.formState.errors.description ? "border border-red-500" : ""
                }`}
                placeholder="Description du projet"
              />
              {methods.formState.errors.description && (
                <p className="text-red-500 text-xs sm:-bottom-9 left-0 md:-bottom-5 absolute">
                  {methods.formState.errors.description.message}
                </p>
              )}
            </div>

            {/* Budget et Progression */}
            <div className="grid gap-4 md:grid-cols-2 mb-5">
              <div>
                <label
                  htmlFor="budget"
                  className="block text-sm font-medium mb-1"
                >
                  Budget <span className="text-red-500">*</span>
                </label>
                <input
                  {...methods.register("budget", {
                    required: "Le budget est requis",
                    min: {
                      value: 0,
                      message: "Le budget doit être positif",
                    },
                  })}
                  type="number"
                  className={`form-input w-full ${
                    methods.formState.errors.budget ? "border border-red-500" : ""
                  }`}
                  placeholder="Budget du projet"
                />
                {methods.formState.errors.budget && (
                  <p className="text-red-500 text-xs absolute -bottom-5 left-0">
                    {methods.formState.errors.budget.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="progression"
                  className="block text-sm font-medium mb-1"
                >
                  Progression (%) <span className="text-red-500">*</span>
                </label>
                <input
                  {...methods.register("progression", {
                    required: "La progression est requise",
                    min: {
                      value: 0,
                      message: "La progression doit être entre 0 et 100",
                    },
                    max: {
                      value: 100,
                      message: "La progression doit être entre 0 et 100",
                    },
                  })}
                  type="number"
                  className={`form-input w-full ${
                    methods.formState.errors.progression ? "border border-red-500" : ""
                  }`}
                  placeholder="Progression du projet"
                />
                {methods.formState.errors.progression && (
                  <p className="text-red-500 text-xs absolute -bottom-5 left-0">
                    {methods.formState.errors.progression.message}
                  </p>
                )}
              </div>
            </div>

            {/* Dates */}
            <div className="grid gap-4 md:grid-cols-2 mb-5">
              <div>
                <label
                  htmlFor="dateDebut"
                  className="block text-sm font-medium mb-1"
                >
                  Date de début <span className="text-red-500">*</span>
                </label>
                <input
                  {...methods.register("dateDebut", {
                    required: "La date de début est requise",
                  })}
                  type="date"
                  className={`form-input w-full ${
                    methods.formState.errors.dateDebut ? "border border-red-500" : ""
                  }`}
                />
                {methods.formState.errors.dateDebut && (
                  <p className="text-red-500 text-xs absolute -bottom-5 left-0">
                    {methods.formState.errors.dateDebut.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="dateFin"
                  className="block text-sm font-medium mb-1"
                >
                  Date de fin <span className="text-red-500">*</span>
                </label>
                <input
                  {...methods.register("dateFin", {
                    required: "La date de fin est requise",
                  })}
                  type="date"
                  className={`form-input w-full ${
                    methods.formState.errors.dateFin ? "border border-red-500" : ""
                  }`}
                />
                {methods.formState.errors.dateFin && (
                  <p className="text-red-500 text-xs absolute -bottom-5 left-0">
                    {methods.formState.errors.dateFin.message}
                  </p>
                )}
              </div>
            </div>

            {/* Responsable */}
            <div className="mb-5">
              <label
                htmlFor="responsable"
                className="block text-sm font-medium mb-1"
              >
                Responsable <span className="text-red-500">*</span>
              </label>
              <select
                {...methods.register("responsable", {
                  required: "Le responsable est requis",
                })}
                className={`form-select w-full ${
                  methods.formState.errors.responsable ? "border border-red-500" : ""
                }`}
              >
                <option value="">Sélectionner un responsable</option>
                {Array.isArray(postes) && postes.length > 0 ? (
                  postes.map((poste) => (
                    <option key={poste._id} value={poste._id}>
                      {poste.nom}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    Aucun poste disponible
                  </option>
                )}
              </select>
              {methods.formState.errors.responsable && (
                <p className="text-red-500 text-xs absolute -bottom-5 left-0">
                  {methods.formState.errors.responsable.message}
                </p>
              )}
              {postesError && (
                <p className="text-red-500 text-xs mt-1">
                  Erreur lors du chargement des postes
                </p>
              )}
            </div>

            {/* Statut */}
            <div className="mb-5">
              <label
                htmlFor="statut"
                className="block text-sm font-medium mb-1"
              >
                Statut <span className="text-red-500">*</span>
              </label>
              <select
                {...methods.register("statut", {
                  required: "Le statut est requis",
                })}
                className={`form-select w-full ${
                  methods.formState.errors.statut ? "border border-red-500" : ""
                }`}
              >
                <option value="planifie">Planifié</option>
                <option value="en_cours">En cours</option>
                <option value="termine">Terminé</option>
                <option value="annule">Annulé</option>
              </select>
              {methods.formState.errors.statut && (
                <p className="text-red-500 text-xs absolute -bottom-5 left-0">
                  {methods.formState.errors.statut.message}
                </p>
              )}
            </div>

            {/* Bouton de soumission */}
            <div className="flex justify-end mt-6">
              <button
                type="submit"
                className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
              >
                {projetExiste ? "Modifier" : "Créer"} le projet
              </button>
            </div>

            {msgError && (
              <div className="text-red-500 text-sm mt-2">{msgError}</div>
            )}
          </div>
        </form>
      )}
    </FormProvider>
  );
}

export default FormulaireProjets;

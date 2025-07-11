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

  // Récupération des utilisateurs pour la liste déroulante des responsables
  const {
    data: users,
    loading: usersLoading,
    error: usersError,
    fetchData: fetchUsers,
  } = useGetData("/api/users/actifs");

  // Récupération des services
  const {
    data: services,
    loading: servicesLoading,
    error: servicesError,
    fetchData: fetchServices,
  } = useGetData("/api/services/forUpdate");

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchUsers();
        await fetchServices();
        console.log("Données chargées:", { users, services });
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      }
    };
    fetchData();
  }, []);

  // Log pour vérifier l'état des données
  useEffect(() => {
    console.log("État des données:", {
      users,
      usersLoading,
      usersError,
      services,
      servicesLoading,
      servicesError
    });
  }, [users, usersLoading, usersError, services, servicesLoading, servicesError]);

  const {
    response: postResponse,
    error: postError,
    loading: postLoading,
    postData,
  } = usePostData(`/api/projets/public`);

  const {
    response: putResponse,
    error: putError,
    loading: putLoading,
    putData,
  } = usePutData(`/api/projets/${projet.id}`);

  const methods = useForm({
    defaultValues: {
      titre: projetExiste ? projet.titre : "",
      description: projetExiste ? projet.description : "",
      dateDebut: projetExiste ? projet.dateDebut : "",
      dateFin: projetExiste ? projet.dateFin : "",
      budget: projetExiste ? projet.budget?.prevu || 0 : 0,
      statut: projetExiste ? projet.statut : "planifié",
      responsable: projetExiste ? projet.responsable : "",
      service: projetExiste ? projet.service : "",
    },
  });

  const { handleSubmit, control, setValue } = methods;

  useEffect(() => {
    if (projetExiste) {
      methods.setValue("titre", projet.titre);
      methods.setValue("description", projet.description);
      methods.setValue("budget", projet.budget?.prevu || 0);
      methods.setValue("statut", projet.statut);
      methods.setValue("responsable", projet.responsable);
      methods.setValue("service", projet.service);
  
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
        titre: data.titre,
        description: data.description,
        dateDebut: new Date(data.dateDebut),
        dateFin: new Date(data.dateFin),
        budget: {
          prevu: Number(data.budget),
          devise: 'EUR'
        },
        statut: data.statut,
        responsable: data.responsable,
        service: data.service,
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

  if (usersLoading || servicesLoading) {
    return <SpinnerLoading />;
  }

  return (
    <FormProvider {...methods}>
      {postLoading || putLoading || usersLoading || servicesLoading ? (
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

            {/* Titre du projet */}
            <div className="flex items-center justify-between gap-2 mb-5 flex-wrap">
              <div className="w-full relative">
                <label
                  htmlFor="titre"
                  className="block text-sm font-medium mb-1"
                >
                  Titre du projet <span className="text-red-500">*</span>
                </label>
                <input
                  {...methods.register("titre", {
                    required: "Le titre du projet est requis",
                    maxLength: {
                      value: 250,
                      message: "Le titre est trop long",
                    },
                  })}
                  className={`form-input w-full ${
                    methods.formState.errors.titre ? "border border-red-500" : ""
                  }`}
                  type="text"
                  placeholder="Titre du projet"
                />
                {methods.formState.errors.titre && (
                  <p className="text-red-500 text-xs absolute -bottom-5 left-0">
                    {methods.formState.errors.titre.message}
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

            {/* Budget */}
            <div className="mb-5">
              <label
                htmlFor="budget"
                className="block text-sm font-medium mb-1"
              >
                Budget prévu <span className="text-red-500">*</span>
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

            {/* Service */}
            <div className="mb-5">
              <label
                htmlFor="service"
                className="block text-sm font-medium mb-1"
              >
                Service <span className="text-red-500">*</span>
              </label>
              <select
                {...methods.register("service", {
                  required: "Le service est requis",
                })}
                className={`form-select w-full ${
                  methods.formState.errors.service ? "border border-red-500" : ""
                }`}
              >
                <option value="">Sélectionner un service</option>
                {Array.isArray(services) && services.length > 0 ? (
                  (Array.isArray(services.data) ? services.data : services).map((service) => (
                    <option key={service._id || service.id} value={service._id || service.id}>
                      {service.nom}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    Aucun service disponible
                  </option>
                )}
              </select>
              {methods.formState.errors.service && (
                <p className="text-red-500 text-xs absolute -bottom-5 left-0">
                  {methods.formState.errors.service.message}
                </p>
              )}
              {servicesError && (
                <p className="text-red-500 text-xs mt-1">
                  Erreur lors du chargement des services
                </p>
              )}
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
                {Array.isArray(users) && users.length > 0 ? (
                  (Array.isArray(users.data) ? users.data : users).map((user) => (
                    <option key={user._id || user.id} value={user._id || user.id}>
                      {user.nom} {user.prenom}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    Aucun utilisateur disponible
                  </option>
                )}
              </select>
              {methods.formState.errors.responsable && (
                <p className="text-red-500 text-xs absolute -bottom-5 left-0">
                  {methods.formState.errors.responsable.message}
                </p>
              )}
              {usersError && (
                <p className="text-red-500 text-xs mt-1">
                  Erreur lors du chargement des utilisateurs
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
                <option value="planifié">Planifié</option>
                <option value="en cours">En cours</option>
                <option value="terminé">Terminé</option>
                <option value="suspendu">Suspendu</option>
                <option value="annulé">Annulé</option>
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

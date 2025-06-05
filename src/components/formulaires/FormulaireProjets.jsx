import React, { useEffect, useState } from "react";
import { useForm, FormProvider, set } from "react-hook-form";
import { usePostData, usePutData } from "../../utils/Requests/RequestService";
import SpinnerLoading from "../SpinnerLoading";
import { Link, useNavigate } from "react-router-dom";
import { useSuccessMessage } from "../../utils/SuccessContext";

function FormulaireProjets({ projet }) {
  const navigate = useNavigate();
  //utilisation du contexte concernant le success message
  const { setSuccessMessage } = useSuccessMessage();

  const projetExiste = Object.keys(projet).length > 0;

  //apprel de ma fonction post
  const {
    response: postResponse,
    error: postError,
    loading: postLoading,
    postData,
  } = usePostData(`projets`);

  //apprel de ma fonction update
  const {
    response: putResponse,
    error: putError,
    loading: putLoading,
    putData,
  } = usePutData(`projets/${projet.id}`);

  const methods = useForm({
    defaultValues: {
      libelle: projetExiste ? projet.libelle : "",
      description: projetExiste ? projet.description : "",
      datePriseDecision: projetExiste ? projet.datePriseDecision : "",
      dateDebut: projetExiste ? projet.dateDebut : "",
      dateFin: projetExiste ? projet.dateFin : "",
      deadline: projetExiste ? projet.deadline : "",
    },
  });

  const { handleSubmit, control, setValue } = methods;
  //charger les default value
  useEffect(() => {
    if (projetExiste) {
      methods.setValue("libelle", projet.libelle);
      methods.setValue("description", projet.description);
  
      // Fonction utilitaire pour formater les dates
      const formatDate = (date) => {
        return date ? new Date(date).toISOString().split("T")[0] : "";
      };
  
      // Appliquer le formatage pour chaque date
      methods.setValue("datePriseDecision", formatDate(projet.datePriseDecision));
      methods.setValue("dateDebut", formatDate(projet.dateDebut));
      methods.setValue("dateFin", formatDate(projet.dateFin));
      methods.setValue("deadline", formatDate(projet.deadline));
    }
  }, [projetExiste, projet, methods]);
  

  const [msgError, setMsgError] = useState("");

  // Met à jour les etats

  const onSubmit =async (data) => {
    try {
      const dateDataConvert = {
        ...data,
        datePriseDecision: new Date(data.datePriseDecision), // Convertir en objet Date
        dateDebut: new Date(data.dateDebut), // Convertir en objet Date
        dateFin: new Date(data.dateFin), // Convertir en objet Date
        deadline: new Date(data.deadline), // Convertir en objet Date
      };
      console.log("Form Data:", dateDataConvert);
      if (projetExiste) {
       await putData(dateDataConvert);
        setSuccessMessage("Projet modifiée avec succès 👌!");
        console.log("put");
      } else {
        // // Appeler la fonction de votre hook avec les données du formulaire
       await postData(dateDataConvert); // Assurez-vous que postData est la fonction fournie par le hook usePostData pour envoyer les données
        setSuccessMessage("Projet enregistrée avec succès 👌!");
        console.log("post");
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

  return (
    <FormProvider {...methods}>
      {postLoading || putLoading ? (
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

            {/* Libelle projet */}
            <div className="flex items-center justify-between gap-2 mb-5 flex-wrap">
              <div className="w-full relative">
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
                  placeholder="Libelle de projet"
                  defaultValue={projet.libelle}
                />
                {methods.formState.errors.libelle && (
                  <p className="text-red-500 text-xs absolute -bottom-5 left-0">
                    {methods.formState.errors.libelle.message}
                  </p>
                )}
              </div>
            </div>

            {/* description  projet */}
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
                    value: 2500, // Par exemple, 1000 caractères
                    message: "Nombre de caractere trop grand",
                  },
                })}
                className={`form-input w-full ${
                  methods.formState.errors.description
                    ? "border border-red-500"
                    : ""
                }`}
                placeholder="Description du projet"
                defaultValue={projet.description}
              />
              {methods.formState.errors.description && (
                <p className="text-red-500 text-xs sm:-bottom-9 left-0 md:-bottom-5 absolute">
                  {methods.formState.errors.description.message}
                </p>
              )}
            </div>

            {/* Dates */}
            <div className="grid gap-4 md:grid-cols-2 mb-5">
              {/* Datepicker pour la plage de dates */}

              <div>
                <label
                  htmlFor="datePriseDecision"
                  className="block text-sm font-medium mb-1 md:text-xs"
                >
                  Date de prise de décision
                </label>
                <input
                  {...methods.register("datePriseDecision")}
                  type="date"
                  className="form-input w-full"
                />
              </div>

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

            {/* Dates */}
            <div className="grid gap-4 md:grid-cols-2 mb-5">
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
            </div>

            {/* bouton de validadion */}
            <button
              type="submit"
              className="mt-4 px-6 py-1.5 bg-violet-500 hover:bg-violet-600 transition-colors duration-300 text-white font-bold rounded-lg"
            >
              {projetExiste ? "Modifier" : "Valider"}
            </button>
          </div>
        </form>
      )}
    </FormProvider>
  );
}

export default FormulaireProjets;

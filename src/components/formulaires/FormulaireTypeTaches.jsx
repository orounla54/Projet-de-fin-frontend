import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { usePostData } from "../../utils/Requests/RequestService";
import SpinnerLoading from "../SpinnerLoading";
import { Link, useNavigate } from "react-router-dom";
import { useSuccessMessage } from "../../utils/SuccessContext";

function FormulaireTypeTaches() {
  const navigate = useNavigate();
  
  //utilisation du contexte concernant le success message
  const { setSuccessMessage } = useSuccessMessage();

  const methods = useForm({
    defaultValues: {
      libelle: "",
    },
  });

  //apprel de ma fonction post
  const {
    response: postResponse,
    error: postError,
    loading: postLoading,
    postData,
  } = usePostData(`typesTaches`);

  const [msgError, setMsgError] = useState("");

  // Met à jour les etats
  const onSubmit = async (data) => {
    try {
      await postData(data); // Attendre que postData termine correctement
      setSuccessMessage("Type Tâche enregistrée avec succès !")
      navigate(-1);
    } catch (error) {
      setMsgError("Erreur lors de la création du type tache.");
    }
  };

  return (
    <FormProvider {...methods}>
      {postLoading ? (
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
              Formulaire Type Tache
            </h1>

            {/* Libelle et type tache */}
            <div className="flex items-center justify-between gap-2 mb-5 flex-wrap">
              <div className="w-4/5 relative">
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
                      value: 50, // Par exemple, 1000 caractères
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
                />
                {methods.formState.errors.libelle && (
                  <p className="text-red-500 text-xs absolute -bottom-5 left-0">
                    {methods.formState.errors.libelle.message}
                  </p>
                )}
              </div>
            </div>

            {/* bouton de validadion */}
            <button
              type="submit"
              className="mt-4 px-6 py-1.5 bg-violet-500 hover:bg-violet-600 transition-colors duration-300 text-white font-bold rounded-lg"
            >
              Valider
            </button>
          </div>
        </form>
      )}
    </FormProvider>
  );
}

export default FormulaireTypeTaches;

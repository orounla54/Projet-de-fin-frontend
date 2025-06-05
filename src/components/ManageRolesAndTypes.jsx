import React, { useState } from "react";
import { useForm } from "react-hook-form";
import AuthService from "../utils/Auth/AuthServices";
import { baseURL } from "../utils/DataFront/eventTypes";
import ModalBasic from "./ModalBasic";
import SpinnerLoading from "./SpinnerLoading";
import axios from "axios";

function ManageRolesAndTypes({
  fetchData,
  feedbackModalOpen,
  setFeedbackModalOpen,
  element,
}) {
  const baseUrl = baseURL;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const methods = useForm({
    defaultValues: {
      libelle: "",
      description: "",
      infoSup: "",
    },
  });

  const { handleSubmit, reset } = methods;
  const clearForm = () => reset();
  const onSubmit = async (data) => {
    setLoading(true);
    const formattedData = {
      ...data,
    };
    // console.log(formattedData);

    try {
      const accessToken = AuthService.getAccessToken();
      if (element === "roles tache") {
        await axios.post(`${baseUrl}/roles`, formattedData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });
      } else if (element === "roles plan") {
        await axios.post(`${baseUrl}/rolesPlan`, formattedData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });
      } else if (element === "type priorite") {
        await axios.post(`${baseUrl}/typePriorites`, formattedData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });
      } 

      reset();
      await fetchData();
      setFeedbackModalOpen(false);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Erreur inattendue lors de l'ajout ou la modification."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <ModalBasic
        id="feedback-modal"
        modalOpen={feedbackModalOpen}
        setModalOpen={setFeedbackModalOpen}
        title={`Ajout de ${element}`}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="px-5 py-4">
            <div className="text-sm">
              <div className="mb-3 font-medium text-gray-800 dark:text-gray-100">
                Ajout de {element}
              </div>
              {error && (
                <p className="text-xs text-center text-red-500">{error}</p>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2 mb-5">
                <div className={`relative w-full`}>
                  <label
                    htmlFor="libelle"
                    className="block mb-1 text-sm font-medium"
                  >
                    Libellé <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...methods.register("libelle", {
                      required: "Ce champ est requis",
                      maxLength: {
                        value: 290,
                        message: "Nombre de caractères trop grand",
                      },
                    })}
                    className={`form-input w-full ${
                      methods.formState.errors.libelle
                        ? "border border-red-500"
                        : ""
                    }`}
                    type="text"
                    placeholder={`Libellé  `}
                  />
                  {methods.formState.errors.libelle && (
                    <p className="absolute left-0 text-xs text-red-500 -bottom-5">
                      {methods.formState.errors.libelle.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="px-5 py-4 border-t border-gray-200 dark:border-gray-700/60">
            <div className="flex flex-wrap justify-end space-x-2">
              <button
                type="button"
                className="text-red-500 bg-white border-gray-200 btn-xs dark:bg-gray-800 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600"
                onClick={clearForm}
              >
                Nettoyer
              </button>
              <button
                type="submit"
                className="bg-white border-gray-200 btn dark:bg-gray-800 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600"
                disabled={loading}
              >
                {loading ? <SpinnerLoading /> : "Ajouter"}
              </button>
            </div>
          </div>
        </form>
      </ModalBasic>
    </div>
  );
}

export default ManageRolesAndTypes;

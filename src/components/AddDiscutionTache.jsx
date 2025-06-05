import React, { useEffect, useState } from "react";
import AuthService from "../utils/Auth/AuthServices";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useGetData } from "../utils/Requests/RequestService";
import SpinnerLoading from "./SpinnerLoading";
import LibelleFormat from "./LibelleFormat";
import ModalBasic from "./ModalBasic";
import axios from "axios";
import { baseURL } from "../utils/DataFront/eventTypes";

function AddDiscutionTache({
  tache,
  fetchData,
  feedbackModalOpen,
  setFeedbackModalOpen,
  discussion,
  
}) {
  const baseUrl = baseURL;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [taches, setTaches] = useState([]);

  // console.log(tache)
  const discutionExiste = discussion ;

  const {
    data: tachesData,
    loading: tachesLoading,
    error: tachesError,
  } = useGetData(tache ? "" : `private/taches`);

  useEffect(() => {
    if (tachesData && !tache) {
      setTaches(tachesData);
    }
  }, [tachesData]);

  const methods = useForm({
    defaultValues: {
      libelle: discutionExiste ? discussion.libelle : "",
      description: discutionExiste ? discussion.description : "",
      idTache: tache?.id || null,
    },
  });

  useEffect(() => {
    if (discutionExiste) {
      methods.setValue("libelle", discussion.libelle);
      methods.setValue("description", discussion.description);
      methods.setValue("idTache", tache.id);
    }
  }, [discutionExiste, tache, methods]);

  const { handleSubmit, reset } = methods;

  const clearForm = () => reset();

  const onSubmit = async (data) => {
    setLoading(true);
    const formattedData = {
      ...data,
      idTache: tache?.id || data.idTache,
    };
    console.log(formattedData);

    try {
      const accessToken = AuthService.getAccessToken();
      if (discutionExiste) {
        await axios.put(`${baseUrl}/discussions/${discussion?.id}`, formattedData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });
      } else {
        await axios.post(`${baseUrl}/discussions`, formattedData, {
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
          "Erreur inattendue lors de l'ajout ou la modification de la discussion."
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
        title={`${discutionExiste ? "Modification" : "Ajout"} d'une discussion`}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="px-5 py-4">
            <div className="text-sm">
              <div className="mb-3 font-medium text-gray-800 dark:text-gray-100">
                {discutionExiste ? "Modification" : "Ajout"} de discussion
              </div>
              {error && (
                <p className="text-xs text-center text-red-500">{error}</p>
              )}
              {!tache && tachesError && (
                <p className="text-xs text-center text-red-500">
                  {tachesError}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2 mb-5">
                <div className={`relative ${tache ? "w-full" : "w-3/5"}`}>
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
                    placeholder="Libellé de la discussion"
                  />
                  {methods.formState.errors.libelle && (
                    <p className="absolute left-0 text-xs text-red-500 -bottom-5">
                      {methods.formState.errors.libelle.message}
                    </p>
                  )}
                </div>
                {!tache && (
                  <div className="relative w-2/5">
                    <label
                      htmlFor="idTache"
                      className="block mb-1 text-sm font-medium"
                    >
                      Tâche <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...methods.register("idTache", {
                        required: !tache && "Ce champ est requis",
                      })}
                      className={`form-input w-full ${
                        methods.formState.errors.idTache
                          ? "border border-red-500"
                          : ""
                      }`}
                    >
                      <option value="">-- Sélectionnez une tâche --</option>
                      {tachesLoading && (
                        <option>Chargement des tâches...</option>
                      )}
                      {!tachesLoading &&
                        Array.isArray(taches) &&
                        taches.slice(0, 10).map((task) => (
                          <option key={task?.id} value={task?.id}>
                            <LibelleFormat libelle={task?.libelle} />
                          </option>
                        ))}
                    </select>
                    {methods.formState.errors.idTache && (
                      <p className="absolute left-0 text-xs text-red-500 -bottom-5">
                        {methods.formState.errors.idTache.message}
                      </p>
                    )}
                  </div>
                )}
              </div>

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
                      value: 1900,
                      message: "Nombre de caractères trop grand",
                    },
                  })}
                  className={`form-input w-full ${
                    methods.formState.errors.description
                      ? "border border-red-500"
                      : ""
                  }`}
                  placeholder="Description de la discussion"
                />
                {methods.formState.errors.description && (
                  <p className="absolute left-0 text-xs text-red-500 -bottom-5">
                    {methods.formState.errors.description.message}
                  </p>
                )}
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
                {loading ? <SpinnerLoading /> : 
                discutionExiste ? "Modifier" : "Ajouter"}
              </button>
            </div>
          </div>
        </form>
      </ModalBasic>
    </div>
  ); 
}

export default AddDiscutionTache;

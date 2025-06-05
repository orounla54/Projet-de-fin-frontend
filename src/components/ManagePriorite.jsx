import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import AuthService from "../utils/Auth/AuthServices";
import { baseURL } from "../utils/DataFront/eventTypes";
import ModalBasic from "./ModalBasic";
import SpinnerLoading from "./SpinnerLoading";
import axios from "axios";
import { useGetData } from "../utils/Requests/RequestService";

function ManagePriorite({
  fetchData,
  feedbackModalOpen,
  setFeedbackModalOpen,
  priorite,
  idObjectifOperationnel,
}) {
  const baseUrl = baseURL;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [type, setType] = useState([]);
  const [objectif, setObjectif] = useState([]);

  const {
    data: dataGetData,
    loading: dataGetLoading,
    error: dataGetError,
  } = useGetData(`objectifsOperationnels?keyword=`);

  const {
    data: typeData,
    loading: typeLoading,
    error: typeError,
  } = useGetData(`typePriorites?keyword=`);

  useEffect(() => {
    if (dataGetData) {
      setObjectif(dataGetData);
    }
  }, [dataGetData]);

  useEffect(() => {
    if (typeData) {
      setType(typeData);
    }
  }, [typeData]);

  const methods = useForm({
    defaultValues: {
      libelle: "",
      description: "",
      infoSup: "",
      idObjectifOperationnel: idObjectifOperationnel ? idObjectifOperationnel : "",
      idTypePriorite: "",
    },
  });
  
  useEffect(() => {
    if (priorite) {
      methods.reset({
        libelle: priorite?.libelle || "",
        description: priorite?.description || "",
        code: priorite?.code || "",
        idObjectifOperationnel: priorite?.idObjectifOperationnel || "",
        idTypePriorite: priorite?.idTypePriorite || "",
      });
    }
  }, [priorite, methods]);

  const { handleSubmit, reset } = methods;
  const clearForm = () => reset();

  const onSubmit = async (data) => {
    setLoading(true);
    const formattedData = {
      ...data,
      idObjectifOperationnel: idObjectifOperationnel ? idObjectifOperationnel : data.idObjectifOperationnel
    };
    // console.log(formattedData);

    try {
      const accessToken = AuthService.getAccessToken();

      if (priorite) {
        await axios.put(
          `${baseUrl}/priorites/${parseInt(priorite?.id, 10)}`,
          formattedData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
      } else {
        await axios.post(`${baseUrl}/priorites`, formattedData, {
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
        title={`Formulaire priorites`}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="px-5 py-4">
            <div className="text-sm">
              <div className="mb-3 font-medium text-gray-800 dark:text-gray-100">
                {priorite ? (
                  <p>
                    Modification de{" "}
                    <span className="font-semibold">{priorite?.libelle}</span>
                  </p>
                ) : (
                  "Ajout d'une priorite"
                )}
              </div>
              {error && (
                <p className="text-xs text-center text-red-500">{error}</p>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2 mb-5">
                <div className={`relative w-3/5`}>
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
                <div className={`relative w-2/5`}>
                  <label
                    htmlFor="code"
                    className="block mb-1 text-sm font-medium"
                  >
                    Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...methods.register("code", {
                      required: "Ce champ est requis",
                      maxLength: {
                        value: 290,
                        message: "Nombre de caractères trop grand",
                      },
                    })}
                    className={`form-input w-full ${
                      methods.formState.errors.code
                        ? "border border-red-500"
                        : ""
                    }`}
                    type="text"
                    placeholder={`Code  `}
                  />
                  {methods.formState.errors.code && (
                    <p className="absolute left-0 text-xs text-red-500 -bottom-5">
                      {methods.formState.errors.code.message}
                    </p>
                  )}
                </div>
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
                      value: 4000,
                      message: "Nombre de caractères trop grand",
                    },
                  })}
                  className={`form-input w-full ${
                    methods.formState.errors.description
                      ? "border border-red-500"
                      : ""
                  }`}
                  placeholder="Description "
                />
                {methods.formState.errors.description && (
                  <p className="absolute left-0 text-xs text-red-500 -bottom-5">
                    {methods.formState.errors.description.message}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between gap-2 mb-5">
                {!idObjectifOperationnel && (
                  <div className={`relative ${idObjectifOperationnel ? "" : " w-1/2"}`}>
                    <label
                      htmlFor="idObjectifOperationnel"
                      className="block mb-1 text-sm font-medium"
                    >
                      Objectif Operationnel
                      <span className="text-red-500">*</span>
                    </label>

                    <select
                      {...methods.register("idObjectifOperationnel", {
                        required: "Ce champ est requis",
                      })}
                      className={`form-input w-full ${
                        methods.formState.errors.idObjectifOperationnel
                          ? "border border-red-500"
                          : ""
                      }`}
                    >
                      <option value="">Sélectionnez une option</option>
                      {objectif.map((index) => (
                        <option key={index.id} value={index.id}>
                          {index.libelle}
                        </option>
                      ))}
                    </select>
                    {methods.formState.errors.idObjectifOperationnel && ( // Correction ici
                      <p className="absolute left-0 text-xs text-red-500 sm:-bottom-9 md:-bottom-5">
                        {
                          methods.formState.errors.idObjectifOperationnel
                            .message
                        }
                      </p>
                    )}
                  </div>
                )}
                <div className={`relative ${idObjectifOperationnel ? "w-full" : " w-1/2"}`}>
                  <label
                    htmlFor="idTypePriorite"
                    className="block mb-1 text-sm font-medium"
                  >
                    Type Priorite
                    <span className="text-red-500">*</span>
                  </label>

                  <select
                    {...methods.register("idTypePriorite", {
                      required: "Ce champ est requis",
                    })}
                    className={`form-input w-full ${
                      methods.formState.errors.idTypePriorite
                        ? "border border-red-500"
                        : ""
                    }`}
                  >
                    <option value="">Sélectionnez une option</option>
                    {type.map((index) => (
                      <option key={index.id} value={index.id}>
                        {index.libelle}
                      </option>
                    ))}
                  </select>
                  {methods.formState.errors.idTypePriorite && ( // Correction ici
                    <p className="absolute left-0 text-xs text-red-500 sm:-bottom-9 md:-bottom-5">
                      {methods.formState.errors.idTypePriorite.message}
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
                {loading ? (
                  <SpinnerLoading />
                ) : (
                  <>{priorite ? "Modifier" : "Ajouter"}</>
                )}
              </button>
            </div>
          </div>
        </form>
      </ModalBasic>
    </div>
  );
}

export default ManagePriorite;

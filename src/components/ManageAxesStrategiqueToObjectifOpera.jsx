import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import AuthService from "../utils/Auth/AuthServices";
import { baseURL } from "../utils/DataFront/eventTypes";
import ModalBasic from "./ModalBasic";
import SpinnerLoading from "./SpinnerLoading";
import axios from "axios";
import { useGetData } from "../utils/Requests/RequestService";

function ManageAxesStrategiqueToObjectifOpera({
  fetchData,
  feedbackModalOpen,
  setFeedbackModalOpen,
  dataElement,
  element,
  idParent,
}) {
  const baseUrl = baseURL;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [parent, setParent] = useState([]);

  const handleEnpointParent = () => {
    if (element === "axesStrategiques") {
      return "plansStrategiques";
    } else if (element === "objectifsStrategiques") {
      return "axesStrategiques";
    } else if (element === "mesuresStrategiques") {
      return "objectifsStrategiques";
    } else if (element === "objectifsOperationnels") {
      return "mesuresStrategiques";
    }
  };

  const labelParent = () => {
    if (element === "axesStrategiques") {
      return "Plan strategique";
    } else if (element === "objectifsStrategiques") {
      return "Axe strategique";
    } else if (element === "mesuresStrategiques") {
      return "Objectif strategique";
    } else if (element === "objectifsOperationnels") {
      return "Mesure Strategiques";
    }
  };

  const label = () => {
    if (element === "axesStrategiques") {
      return "Axe strategique";
    } else if (element === "objectifsStrategiques") {
      return "Objectif strategique";
    } else if (element === "mesuresStrategiques") {
      return "Mesure strategique";
    } else if (element === "objectifsOperationnels") {
      return "Objectifs operationnel";
    } else {
      return "Priorites";
    }
  };

  const {
    data: dataGetData,
    loading: dataGetLoading,
    error: dataGetError,
  } = useGetData(!idParent ? `${handleEnpointParent()}?keyword=` : "");

  useEffect(() => {
    if (dataGetData) {
      setParent(dataGetData);
    }
  }, [dataGetData]);

  const methods = useForm({
    defaultValues: {
      libelle: "",
      description: "",
      infoSup: "",
      idParent: idParent ? idParent : "",
    },
  });

  useEffect(() => {
    if (dataElement) {
      methods.reset({
        libelle: dataElement?.libelle || "",
        description: dataElement?.description || "",
        infoSup: dataElement?.infoSup || "",
        idParent:
          element === "axesStrategiques"
            ? dataElement?.idPlanStrategique || ""
            : element === "objectifsStrategiques"
            ? dataElement?.idAxeStrategique || ""
            : element === "mesuresStrategiques"
            ? dataElement?.idObjectifStrategique || ""
            : dataElement?.idMesure || "",
      });
    }
  }, [dataElement, methods]);

  const { handleSubmit, reset } = methods;
  const clearForm = () => reset();

  const onSubmit = async (data) => {
    setLoading(true);
    const formattedData = {
      ...data,
      idParent: idParent ? idParent : data.idParent,
    };
    // console.log(formattedData);

    try {
      const accessToken = AuthService.getAccessToken();

      if (dataElement) {
        await axios.put(
          `${baseUrl}/${element}/${parseInt(dataElement?.id, 10)}`,
          formattedData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
      } else {
        await axios.post(`${baseUrl}/${element}`, formattedData, {
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
        title={`Formulaire ${label()}`}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="px-5 py-4">
            <div className="text-sm">
              <div className="mb-3 font-medium text-gray-800 dark:text-gray-100">
                {dataElement ? (
                  <p>
                    Modification de{" "}
                    <span className="font-semibold">
                      {dataElement?.libelle}
                    </span>
                  </p>
                ) : (
                  label()
                )}
              </div>
              {error && (
                <p className="text-xs text-center text-red-500">{error}</p>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2 mb-5">
                <div className={`relative ${idParent ? " w-full" : "w-3/5"}`}>
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

                {!idParent && (
                  <div className="relative w-2/5">
                    <label
                      htmlFor="idParent"
                      className="block mb-1 text-sm font-medium"
                    >
                      {labelParent()}
                      <span className="text-red-500">*</span>
                    </label>

                    <select
                      {...methods.register("idParent", {
                        required: "Ce champ est requis",
                      })}
                      className={`form-input w-full ${
                        methods.formState.errors.idParent
                          ? "border border-red-500"
                          : ""
                      }`}
                    >
                      <option value="">Sélectionnez une option</option>
                      {parent.map((index) => (
                        <option key={index.id} value={index.id}>
                          {index.libelle}
                        </option>
                      ))}
                    </select>
                    {methods.formState.errors.idParent && ( // Correction ici
                      <p className="absolute left-0 text-xs text-red-500 sm:-bottom-9 md:-bottom-5">
                        {methods.formState.errors.idParent.message}
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
              <div className="relative mb-5">
                <label
                  htmlFor="infoSup"
                  className="block mb-1 text-sm font-medium"
                >
                  Information supplementaire
                </label>
                <textarea
                  {...methods.register("infoSup", {
                    maxLength: {
                      value: 1900,
                      message: "Nombre de caractères trop grand",
                    },
                  })}
                  className={`form-input w-full ${
                    methods.formState.errors.infoSup
                      ? "border border-red-500"
                      : ""
                  }`}
                  placeholder="Information supplementaire "
                />
                {methods.formState.errors.infoSup && (
                  <p className="absolute left-0 text-xs text-red-500 -bottom-5">
                    {methods.formState.errors.infoSup.message}
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
                {loading ? (
                  <SpinnerLoading />
                ) : (
                  <>{dataElement ? "Modifier" : "Ajouter"}</>
                )}
              </button>
            </div>
          </div>
        </form>
      </ModalBasic>
    </div>
  );
}

export default ManageAxesStrategiqueToObjectifOpera;

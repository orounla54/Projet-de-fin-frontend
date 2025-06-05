import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import AuthService from "../utils/Auth/AuthServices";
import { baseURL } from "../utils/DataFront/eventTypes";
import ModalBasic from "./ModalBasic";
import SpinnerLoading from "./SpinnerLoading";
import axios from "axios";
import { useGetData } from "../utils/Requests/RequestService";

function UpdateResponsableForm({
  fetchData,
  feedbackModalOpen,
  setFeedbackModalOpen,
  responsable,
  idPosition,
  idPoste,
  idService,
}) {
  const baseUrl = baseURL;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [services, setServices] = useState([]);
  const [positions, setPositions] = useState([]);
  const [postes, setPostes] = useState([]);

  const {
    data: servicesData,
    loading: servicesLoading,
    error: servicesError,
  } = useGetData(`services/forUpdate`);

  const {
    data: postesData,
    loading: postesLoading,
    error: postesError,
  } = useGetData(`postes/forUpdate`);

  const {
    data: positionsData,
    loading: positionsLoading,
    error: positionsError,
  } = useGetData(`positions/forUpdate`);

  useEffect(() => {
    if (servicesData) {
      setServices(servicesData);
    }
    if (postesData) {
      setPostes(postesData);
    }
    if (positionsData) {
      setPositions(positionsData);
    }
  }, [servicesData, postesData, positionsData]);

  const methods = useForm({
    defaultValues: {
      idService: idService,
      idPoste: idPoste,
      idPosition: idPosition,
    },
  });

  const { handleSubmit, reset } = methods;
  const clearForm = () => reset();

  useEffect(() => {
    if (idService && idPosition && idPoste) {
      methods.setValue("idService", idService);
      methods.setValue("idPosition", idPosition);
      methods.setValue("idPoste", idPoste);
    }
  }, [responsable, idPosition, idPoste, idService]);

  const onSubmit = async (data) => {
    setLoading(true);
    const formattedData = {
      idService: parseInt(data.idService),
      idPoste: parseInt(data.idPoste),
      idPosition: parseInt(data.idPosition),
    };
    // console.log(formattedData);

    try {
      const accessToken = AuthService.getAccessToken();
      await axios.put(
        `${baseUrl}/relations/responsables/${responsable?.id}`,
        formattedData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

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
        title={`Modification`}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="px-5 py-4">
            <div className="text-sm">
              {error && (
                <p className="text-xs text-center text-red-500">{error}</p>
              )}
              {servicesError ||
                postesError ||
                (positionsError && (
                  <p className="text-xs text-center text-red-500">
                    Erreur lors du chargement des données
                  </p>
                ))}
            </div>
            <div className="flex items-center justify-center">
              {servicesLoading ||
                postesLoading ||
                (positionsLoading && (
                  <>
                    <SpinnerLoading />
                  </>
                ))}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2 mb-5">
                <div className={`relative w-1/2`}>
                  <label
                    htmlFor="libelle"
                    className="block mb-1 text-sm font-medium"
                  >
                    Nom <span className="text-gray-500">*</span>
                  </label>
                  <input
                    defaultValue={responsable?.nom}
                    id="name"
                    className="w-full form-input"
                    type="text"
                    disabled
                  />
                </div>
                <div className={`relative w-1/2`}>
                  <label
                    htmlFor="libelle"
                    className="block mb-1 text-sm font-medium"
                  >
                    Prenom <span className="text-gray-500">*</span>
                  </label>
                  <input
                    defaultValue={responsable?.prenom}
                    id="name"
                    className="w-full form-input"
                    type="text"
                    disabled
                  />
                </div>
              </div>
              <div className="flex items-center justify-between gap-2 mb-5">
                <div className={`relative w-1/3`}>
                  <label
                    htmlFor="libelle"
                    className="block mb-1 text-sm font-medium"
                  >
                    Services
                  </label>
                  <select
                    {...methods.register("idService")}
                    className={`form-input w-full ${
                      methods.formState.errors.idService
                        ? "border border-red-500"
                        : ""
                    }`}
                  >
                    <option value="">-- Sélectionnez un service --</option>
                    {services.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.libelle}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={`relative w-1/3`}>
                  <label
                    htmlFor="libelle"
                    className="block mb-1 text-sm font-medium"
                  >
                    Postes
                  </label>
                  <select
                    {...methods.register("idPoste")}
                    className={`form-input w-full ${
                      methods.formState.errors.idPoste
                        ? "border border-red-500"
                        : ""
                    }`}
                  >
                    <option value="">-- Sélectionnez le poste --</option>
                    {postes.map((poste) => (
                      <option key={poste.id} value={poste.id}>
                        {poste.libelle}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={`relative w-1/3`}>
                  <label
                    htmlFor="libelle"
                    className="block mb-1 text-sm font-medium"
                  >
                    Postes
                  </label>
                  <select
                    {...methods.register("idPosition")}
                    className={`form-input w-full ${
                      methods.formState.errors.idPosition
                        ? "border border-red-500"
                        : ""
                    }`}
                  >
                    <option value="">-- Sélectionnez la position --</option>
                    {positions.map((position) => (
                      <option key={position.id} value={position.id}>
                        {position.libelle}
                      </option>
                    ))}
                  </select>
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
                {loading ? <SpinnerLoading /> : "Valider"}
              </button>
            </div>
          </div>
        </form>
      </ModalBasic>
    </div>
  );
}

export default UpdateResponsableForm;

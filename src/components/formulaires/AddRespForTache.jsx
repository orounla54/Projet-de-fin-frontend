import React, { useEffect, useState } from "react";
import { useGetData } from "../../utils/Requests/RequestService";
import ModalBasic from "../ModalBasic";
import { useForm } from "react-hook-form";
import SpinnerLoading from "../SpinnerLoading";
import AuthService from "../../utils/Auth/AuthServices";
import { baseURL } from "../../utils/DataFront/eventTypes";
import axios from "axios";

function AddRespForTache({ tache, fetchTache, responsablesActu }) {
  
  const baseUrl = baseURL;

  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [responsables, setResponsables] = useState([]);
  const [roles, setRoles] = useState([]);

  const [errordSubmit, setErrorSubmit] = useState(null);
  const [loadingSubmit, setLoadingSubmit] = useState(null);

  const {
    data: responsablesData,
    loading: responsablesLoading,
    error: responsablesError,
    fetchData: fetchResponsables,
  } = useGetData(`responsables`);

  //chargement des selects
  useEffect(() => {
    // console.log(responsablesData)
    if (responsablesData && responsablesActu) {
      // Filtrage des responsables non liés
      const soustraitRespActu = responsablesData.filter((resp) => {
        // Convertir les ID en nombre pour une comparaison correcte
        const isLinked = responsablesActu.some((respActu) => {
          return parseInt(respActu.id, 10) === resp.id;
        });
        return !isLinked; // Garder seulement ceux qui ne sont pas liés
      });

      // Mise à jour du state
      setResponsables(soustraitRespActu);
    }
  }, [responsablesData]);

  //roles get for formulaire
  const {
    data: rolesData,
    loading: loadingRoles,
    error: errorRoles,
  } = useGetData(`/roles`);

  useEffect(() => {
    if (rolesData && Array.isArray(rolesData)) {
      // Filtrage des rôles
      const filteredRoles = rolesData.filter((role) => {
        return (
          role.libelle !== "Responsable" && role.libelle !== "Roles pas définie"
        ); // Utiliser Number si nécessaire
      });
      setRoles(filteredRoles);
    }
  }, [rolesData, tache]);

  //add sous taches for tache
  const methods = useForm({
    defaultValues: {
      idRole: "",
      responsables: [],
    },
  });

  const { handleSubmit, reset } = methods;

  const clearForm = () => {
    setErrorSubmit(null);
    reset(); // Réinitialisation des valeurs
  };

  // Fonction de soumission du formulaire
  const onSubmit = async (data) => {
    setLoadingSubmit(true);
    try {
      // Gérer la conversion des responsables correctement
      const responsablesArray = Array.isArray(data.responsables)
        ? [...data.responsables]
        : JSON.parse(data.responsables || "[]");

      if (!Array.isArray(responsablesArray)) {
        throw new Error("Le champ 'responsables' doit être un tableau valide.");
      }

      // Créer l'objet avec les conversions nécessaires
      const IdDataConvers = {
        ...data,
        idTache: parseInt(tache && tache.id),
        idRole: parseInt(data.idRole),
        responsables: responsablesArray.map((responsable) =>
          parseInt(responsable, 10)
        ),
      };
      const accessToken = AuthService.getAccessToken();

      // Effectuer la requête HTTP
      const response = await axios.post(
        `${baseUrl}/addResp/tache`,
        IdDataConvers,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Réinitialiser le formulaire et mettre à jour les données
      for (let index = 0; index <5; index++) {
        await fetchTache();
      }
      await fetchResponsables();
      setFeedbackModalOpen(false);
      // reset();
    } catch (error) {
      console.error("Erreur lors de la soumission du formulaire:", error);

      // Gestion spécifique des erreurs
      if (error.response) {
        setErrorSubmit(
          `Erreur serveur: ${
            error.response.data.message || "Une erreur s'est produite."
          }`
        );
      } else if (error.message) {
        setErrorSubmit(`Erreur de conversion: ${error.message}`);
      } else {
        setErrorSubmit("Erreur lors de l'ajout du responsable");
      }
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setFeedbackModalOpen(true);
        }}
        className="flex items-center justify-center transition bg-white border border-gray-200 rounded-full shadow-sm w-7 h-7 dark:bg-gray-800 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-violet-500"
      >
        <span className="sr-only">Add new account</span>
        <svg
          className="fill-current"
          width="14"
          height="14"
          viewBox="0 0 16 16"
        >
          <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
        </svg>
      </button>
      <ModalBasic
        id="feedback-modal"
        modalOpen={feedbackModalOpen}
        setModalOpen={setFeedbackModalOpen}
        title="Autre responsable"
      >
        {/* Modal content */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="px-5 py-4">
            <div className="text-sm">
              <div className="mb-3 font-medium text-gray-800 dark:text-gray-100">
                Ajout de responsable
              </div>

              {errordSubmit && (
                <p className="text-xs text-center text-red-500">
                  {errordSubmit}
                </p>
              )}
            </div>

            <div className="flex gap-1 m-2 ">
              <div className="relative w-1/2">
                <label
                  htmlFor="responsables"
                  className="block mb-1 text-sm font-medium"
                >
                  Responsables <span className="text-red-500">*</span>
                </label>
                {responsablesLoading && <SpinnerLoading />}
                <select
                  {...methods.register("responsables", {
                    required: "Vous devez attribuer à quelqu'un",
                  })}
                  multiple
                  defaultValue={[]}
                  className={`form-input w-full ${
                    methods.formState.errors.responsables
                      ? "border border-red-500"
                      : ""
                  }`}
                >
                  {responsables.map((responsable) => (
                    <option key={responsable.id} value={responsable.id}>
                      {responsable.nom} {responsable.prenom}
                    </option>
                  ))}
                </select>
                {methods.formState.errors.responsables && (
                  <p className="absolute left-0 text-xs text-red-500 sm:-bottom-10 md:-bottom-5">
                    {methods.formState.errors.responsables.message}
                  </p>
                )}
              </div>
              <div className="relative w-1/2">
                <label
                  htmlFor="idRole"
                  className="block mb-1 text-sm font-medium"
                >
                  Role <span className="text-red-500">*</span>
                </label>
                {loadingRoles && <SpinnerLoading />}
                <select
                  {...methods.register("idRole", {
                    required: "Choisie un role est obligatoire",
                  })}
                  className={`form-input w-full ${
                    methods.formState.errors.idRole
                      ? "border border-red-500"
                      : ""
                  }`}
                >
                  {" "}
                  <option value={null}>Choisissez le role</option>
                  {roles.map((role) => (
                    <option key={role.id} value={`${role.id}`}>
                      {role.libelle}
                    </option>
                  ))}
                </select>
                {methods.formState.errors.idRole && (
                  <p className="absolute left-0 text-xs text-red-500 sm:-bottom-10 md:-bottom-5">
                    {methods.formState.errors.idRole.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Footer du modal */}
          <div className="px-5 py-4">
            <div className="flex flex-wrap justify-end space-x-2">
              <ul className="flex items-center justify-between gap-2">
                <li>
                  <button
                    type="button"
                    className="text-red-500 bg-white border-gray-200 btn-xs dark:bg-gray-800 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600"
                    onClick={() => clearForm()}
                  >
                    Nettoyer
                  </button>
                </li>
                <li>
                  <button
                    type="submit"
                    className="bg-white border-gray-200 btn dark:bg-gray-800 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600"
                  >
                    {loadingSubmit ? (
                      <>
                        <svg
                          className="fill-current animate-spin shrink-0"
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                        >
                          <path d="M8 16a7.928 7.928 0 01-3.428-.77l.857-1.807A6.006 6.006 0 0014 8c0-3.309-2.691-6-6-6a6.006 6.006 0 00-5.422 8.572l-1.806.859A7.929 7.929 0 010 8c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
                        </svg>
                      </>
                    ) : (
                      <svg
                        className="fill-current text-violet-500 shrink-0"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                      >
                        <path d="M14.3 2.3L5 11.6 1.7 8.3c-.4-.4-1-.4-1.4 0-.4.4-.4 1 0 1.4l4 4c.2.2.4.3.7.3.3 0 .5-.1.7-.3l10-10c.4-.4.4-1 0-1.4-.4-.4-1-.4-1.4 0z" />
                      </svg>
                    )}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </form>
      </ModalBasic>
    </div>
  );
}

export default AddRespForTache;

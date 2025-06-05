import React, { useEffect, useState } from "react";
import ModalBasic from "../ModalBasic";
import SpinnerLoading from "../SpinnerLoading";
import axios from "axios";
import AuthService from "../../utils/Auth/AuthServices";
import { useForm } from "react-hook-form";
import { baseURL } from "../../utils/DataFront/eventTypes";

function AddDocsToPreuves({
  fetchData,
  setFeedbackModalOpen,
  feedbackModalOpen,
  idPreuve,
}) {
  const baseUrl = baseURL;
  const [errorSaveFiles, setErrorSaveFiles] = useState("");
  const [loadingSaveFiles, setLoadingaveFiles] = useState(false);

  //add imaages for taches
  const methods = useForm({
    defaultValues: {
      fichiers: "",
      idPriorite: idPreuve ? idPreuve : "",
    },
  });

  const {
    register: registerIMG,
    handleSubmit: handleSubmitIMG,
    formState: { errors: errorsIMG },
    reset,
  } = methods;

  const onSubmit = async (data) => {
    setLoadingaveFiles(true);
    setErrorSaveFiles("");

    try {
      const formData = new FormData();

      // Ajout de l'id de preuve
      formData.append("idPreuve", idPreuve || "");

      // Ajout des fichiers
      Array.from(data.fichiers).forEach((file) => {
        formData.append("fichiers", file);
      });

      console.log("Données envoyées :", formData);

      // Récupérer le token d'accès
      const accessToken = AuthService.getAccessToken();

      const response = await axios.post(
        `${baseUrl}/preuves/${idPreuve}/documents`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setFeedbackModalOpen(false);
      await fetchData();
      reset();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Erreur inattendue lors de l'ajout de preuves ou de fichier. Veuillez réessayer.";
      setErrorSaveFiles(errorMessage);
      console.error(error);
    } finally {
      setLoadingaveFiles(false);
    }
  };

  const clearForm = () => {
    reset();
    setFeedbackModalOpen(false);
  };

  return (
    <div>
      {" "}
      <ModalBasic
        id="feedback-modal"
        modalOpen={feedbackModalOpen}
        setModalOpen={setFeedbackModalOpen}
        title="Documents preuves de realisation"
      >
        <>
          <form
            onSubmit={handleSubmitIMG(onSubmit)}
            className="px-5 py-2 space-y-4"
          >
            {errorSaveFiles && (
              <p className="text-xs text-center text-red-500">
                {errorSaveFiles}
              </p>
            )}
            <div className="flex justify-center px-6 py-10 mt-2 border border-dashed rounded-lg border-violet-500">
              <div className="text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="mx-auto text-gray-300 size-12"
                >
                  <path
                    fillRule="evenodd"
                    d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="flex mt-4 text-xs text-gray-600">
                  <label
                    htmlFor="file-upload" // L'élément <label> cible le <input> via son id
                    className="relative font-semibold cursor-pointer text-violet-400 hover:text-violet-600"
                  >
                    <span>Charger une ou plusieurs preuves</span>{" "}
                    {/* Clique sur ce texte pour ouvrir la fenêtre de fichiers */}
                    {/* L'élément input est caché avec la classe 'sr-only' mais il est toujours interactif */}
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="" // Cache l'input sr-only
                      {...registerIMG("fichiers", {
                        required: "Au moins un fichier est requis",
                        validate: {
                          fileCount: (files) =>
                            files.length <= 10 ||
                            "Vous ne pouvez télécharger que jusqu'à 10 fichiers",
                          fileSize: (files) =>
                            Array.from(files).every(
                              (file) => file.size <= 50 * 1024 * 1024
                            ) || "Chaque fichier doit être de 50 Mo maximum",
                        },
                      })}
                      multiple
                    />
                  </label>
                  <p className="pl-1">Chaque ne doit pas dépasser les 50Mo</p>
                </div>
              </div>
            </div>

            <div>
              {methods.formState.errors.fichiers && (
                <p className="text-xs text-center text-red-500">
                  {methods.formState.errors.fichiers.message}
                </p>
              )}
            </div>

            <div className="flex justify-end pt-4 space-x-2 border-t border-gray-200 dark:border-gray-700/60">
              <button
                type="button"
                className="text-gray-800 border-gray-200 btn-sm dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 dark:text-gray-300"
                onClick={() => {
                  clearForm();
                }}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="text-gray-100 bg-gray-900 btn-sm hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
              >
                {loadingSaveFiles ? (
                  <>
                    <SpinnerLoading />
                  </>
                ) : (
                  "Valider"
                )}
              </button>
            </div>
          </form>
        </>
      </ModalBasic>
    </div>
  );
}

export default AddDocsToPreuves;

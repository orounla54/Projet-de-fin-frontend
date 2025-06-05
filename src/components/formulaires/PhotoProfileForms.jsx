import React, { useState } from "react";
import ModalBasic from "../ModalBasic";
import SpinnerLoading from "../SpinnerLoading";
import axios from "axios";
import AuthService from "../../utils/Auth/AuthServices";
import { useForm } from "react-hook-form";
import { baseURL } from "../../utils/DataFront/eventTypes";

function PhotoProfileForms({fetchData, setFeedbackModalOpen, feedbackModalOpen, id}) {
      const baseUrl = baseURL;
      const { pathname } = location;
      const [errorSaveFiles, setErrorSaveFiles] = useState("");
      const [loadingSaveFiles, setLoadingaveFiles] = useState(false);
  //add imaages for taches
  const methodsIMG = useForm({
    defaultValues: {
      fichiers: "",
    },
  });

  const {
    register: registerIMG,
    handleSubmit: handleSubmitIMG,
    formState: { errors: errorsIMG },
    reset: resetIMG,
  } = methodsIMG;

  const onSubmitIMG = async (data) => {
    setLoadingaveFiles(true);
    setErrorSaveFiles("");

    const formData = new FormData();
    Array.from(data.fichiers).forEach((file) => {
      formData.append("fichiers", file);
    });

    try {
      const accessToken = AuthService.getAccessToken();
      const response = await axios.post(
        `${baseUrl}/${(pathname.includes('/evenements') ? 'evenements/addPhoto' : 'photo/responsables')}/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setFeedbackModalOpen(false);
      await fetchData();
      resetIMG();
    } catch (error) {
      const errorMessage =
        error.response && error.response.data
          ? error.response.data.message // Message d'erreur spécifique renvoyé par le serveur
          : "Erreur inattendue lors de l'ajout de fichier veillez reesayez. ";

      setErrorSaveFiles(errorMessage);
      console.log(error);
    } finally {
      setLoadingaveFiles(false);
    }
  };
  return (
    <div>
      {" "}
      <ModalBasic
        id="feedback-modal"
        modalOpen={feedbackModalOpen}
        setModalOpen={setFeedbackModalOpen}
        title="Téléchargement d'image"
      >
        <>
          <form
            onSubmit={handleSubmitIMG(onSubmitIMG)}
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
                    <span>{pathname.includes('/evenements') ? "Charger l'image" : "Charger la photo de profile"}</span>{" "}
                    {/* Clique sur ce texte pour ouvrir la fenêtre de fichiers */}
                    {/* L'élément input est caché avec la classe 'sr-only' mais il est toujours interactif */}
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only" // Cache l'input
                      {...registerIMG("fichiers", {
                        required: "Un fichier est requis",
                        validate: {
                          fileCount: (files) =>
                            files.length <= 10 ||
                            "Vous ne pouvez télécharger que jusqu'à 10 fichiers",
                          fileSize: (files) =>
                            Array.from(files).every(
                              (file) => file.size <= 5 * 1024 * 1024
                            ) || "Chaque fichier doit être de 5 Mo maximum",
                          fileType: (files) =>
                            Array.from(files).every((file) =>
                              ["image/jpeg", "image/jpg", "image/png"].includes(
                                file.type
                              )
                            ) ||
                            "Seuls les fichiers JPEG, JPG ou PNG sont autorisés",
                        },
                      })}
                      multiple
                      accept="image/jpeg, image/jpg, image/png"
                    />
                  </label>
                  <p className="pl-1">
                   La photo ne doit pas dépasser les 5Mo
                  </p>
                </div>
                <p className="text-gray-600 text-xs/5">PNG, JPG, Autres</p>
              </div>
            </div>

            <div>
              {methodsIMG.formState.errors.fichiers && (
                <p className="text-sm text-red-500">
                  {methodsIMG.formState.errors.fichiers.message}
                </p>
              )}
            </div>

            <div className="flex justify-end pt-4 space-x-2 border-t border-gray-200 dark:border-gray-700/60">
              <button
                type="button"
                className="text-gray-800 border-gray-200 btn-sm dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 dark:text-gray-300"
                onClick={() => setFeedbackModalOpen(false)}
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

export default PhotoProfileForms;

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { baseURL } from "../../utils/DataFront/eventTypes";
import AuthService from "../../utils/Auth/AuthServices";
import axios from "axios";
import { useSuccessMessage } from "../../utils/SuccessContext";
import useSocket from "../../utils/useSocket";

function MessagesFooter({ fetchData, discussionCurrent, responsableLog }) {
  const { socket, isConnected } = useSocket();


  const baseUrl = baseURL;
  let typingTimeout; // Variable globale pour le timeout
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { successMessage, setSuccessMessage } = useSuccessMessage();

  const methods = useForm({
    defaultValues: {
      libelle: "",
      idTache: discussionCurrent?.idTache,
      idDiscussion: discussionCurrent?.id,
      idResponsable: responsableLog?.id,
    },
  });
  const { handleSubmit, reset, formState } = methods;
  const { errors } = formState;

  //onSubmit for message
  const onSubmit = async (data) => {
    const formData = new FormData(); // Initialiser formData
    setLoading(true);
    setError(null);

    try {
      if (data.fichiers?.length > 0) {
        Array.from(data.fichiers).forEach((file) => {
          formData.append("fichiers", file);
        });

        const formattedData = {
          ...data,
          idResponsable: responsableLog?.id || data.idResponsable,
          idDiscussion: discussionCurrent?.id || data.idDiscussion,
        };

        Object.keys(formattedData).forEach((key) => {
          formData.append(key, formattedData[key]);
        });

        // console.log("formData", formData);

        const accessToken = AuthService.getAccessToken();

        await axios.post(`${baseUrl}/newMedia`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setSuccessMessage("Medias envoyés avec succès !");
      } else {
        if (data.libelle === "") {
        } else {
          const formattedData = {
            ...data,
            idTache: discussionCurrent?.idTache || data.idTache,
            idDiscussion: discussionCurrent?.id || data.idDiscussion,
          };

          // console.log("formData", formattedData);

          const accessToken = AuthService.getAccessToken();

          await axios.post(`${baseUrl}/messages`, formattedData, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          });
        }
      }
      reset({ libelle: "", fichiers: [] });
      await fetchData();
      // Envoyer le message via Socket.IO
      socket.emit("newMessage", discussionCurrent);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Erreur inattendue lors de l'ajout ou la modification de la discussion."
      );
    } finally {
      setLoading(false);
    }
  };

  const onEcriture = (responsable) => {
    let responsables = [];

    responsables.push(responsable);

    // Émettre un événement indiquant que l'utilisateur commence à écrire
    socket.emit("ecritureNew", responsables, discussionCurrent);

    // Effacer tout timeout précédent
    clearTimeout(typingTimeout);

    // Définir un délai pour indiquer que l'utilisateur a arrêté d'écrire
    typingTimeout = setTimeout(() => {
      socket.emit("finEcriture", responsables, discussionCurrent); // Indiquer que l'utilisateur a fini d'écrire
    }, 2000); // Par exemple, après 2 secondes d'inactivité
  };

  return (
    <div className="sticky bottom-0">
      <div className="flex items-center justify-between h-16 px-4 bg-white border-t border-gray-200 dark:bg-gray-900 dark:border-gray-700/60 sm:px-6 md:px-5">
        {/* Plus button */}

        {/* Message input */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex grow">
          <div className="flex items-center justify-center text-xs text-gray-600 ">
            <label
              htmlFor="file-upload" // L'élément <label> cible le <input> via son id
              className="mr-3 text-gray-400 cursor-pointer shrink-0 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400"
            >
              <span className="sr-only">Add</span>
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12C23.98 5.38 18.62.02 12 0zm6 13h-5v5h-2v-5H6v-2h5V6h2v5h5v2z" />
              </svg>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only" // Cache l'input
                {...methods.register("fichiers", {
                  validate: {
                    fileCount: (files) =>
                      files.length <= 10 ||
                      "Vous ne pouvez télécharger que jusqu'à 10 fichiers",
                    fileSize: (files) =>
                      Array.from(files).every((file) =>
                        ["image/jpeg", "image/jpg", "image/png"].includes(
                          file.type
                        )
                          ? file.size <= 5 * 1024 * 1024 // 5 Mo pour les images
                          : [
                              "video/mp4",
                              "video/avi",
                              "video/mkv",
                              "video/quicktime",
                            ].includes(file.type)
                          ? file.size <= 50 * 1024 * 1024 // 50 Mo pour les vidéos
                          : false
                      ) ||
                      "Chaque fichier doit respecter les limites de taille (5 Mo pour les images, 50 Mo pour les vidéos)",
                    fileType: (files) =>
                      Array.from(files).every((file) =>
                        [
                          "image/jpeg",
                          "image/jpg",
                          "image/png",
                          "video/mp4",
                          "video/avi",
                          "video/mkv",
                          "video/quicktime",
                        ].includes(file.type)
                      ) ||
                      "Seuls les fichiers JPEG, JPG, PNG, MP4, AVI, MKV ou MOV sont autorisés",
                  },
                })}
                multiple
                accept="image/jpeg, image/jpg, image/png, video/mp4, video/avi, video/mkv, video/quicktime"
              />
            </label>
          </div>

          <div className="mr-3 grow">
            {/* <label htmlFor="libelle" className="sr-only">
              Type a message
            </label> */}
            <textarea
              {...methods.register("libelle", {
                // required: "Champ requis",
                validate: (value) => {
                  const regex = /<[^>]*>/g; // Détecte les balises HTML
                  return (
                    !regex.test(value) ||
                    "Les balises HTML ne sont pas autorisées"
                  );
                },
              })}
              id="libelle"
              className={`w-full h-10 resize-none placeholder-gray-500 bg-gray-100 border-transparent form-input dark:bg-gray-800 dark:border-transparent focus:bg-white dark:focus:bg-gray-800 ${
                errors.libelle ? "border border-red-500" : ""
              }`}
              type="text"
              placeholder="Aa"
              onChange={() => {
                onEcriture(responsableLog);
              }}
            />
          </div>
          <button
            disabled={loading}
            type="submit"
            className="h-10 text-gray-100 bg-gray-900 btn hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white whitespace-nowrap"
          >
            Envoyer -&gt;
          </button>
        </form>
      </div>
    </div>
  );
}

export default MessagesFooter;

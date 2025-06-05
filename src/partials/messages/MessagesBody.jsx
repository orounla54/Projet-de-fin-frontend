import React, { Fragment, useEffect, useState } from "react";
import Avatar from "react-avatar";
import SpinnerLoading from "../../components/SpinnerLoading";
import { Link } from "react-router-dom";
import DangerModal from "../../components/DangerModal";
import useSocket from "../../utils/useSocket";

function formatDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString("fr-FR", options);
}

function Message({ message, isCurrentUser, fetchData, discussionCurrent }) {
  // État pour suivre le survol de chaque image individuellement
  const [hoveredIndex, setHoveredIndex] = useState(false);

  return (
    <div
      className={`flex items-start ${
        isCurrentUser ? "justify-end" : ""
      } mb-4 last:mb-0`}
    >
      {!isCurrentUser && message.responsable && (
        <Avatar
          name={`${message.responsable.nom} ${message.responsable.prenom}`}
          round={true}
          size="34"
          className="mr-1"
          src={message.responsable.photoProfileLien} // Le lien de l'image
        />
      )}
      <div>
        <div className="flex">
          <div
            className={`p-3 mb-1 text-sm rounded-lg text-justify ${
              isCurrentUser
                ? "text-white bg-violet-500 rounded-tr-none"
                : "text-gray-800 bg-gray-200 rounded-tl-none dark:bg-gray-800 dark:text-gray-100"
            }`}
          >
            {message.libelle &&
              message.libelle.split("\n").map((paragraph, index) => (
                <p key={index} className="mb-2">
                  {paragraph.trim()}
                </p>
              ))}
          </div>
          {isCurrentUser && (
            <>
              {hoveredIndex && (
                <div className="">
                  <DangerModal
                    endpoint="messages"
                    refreshList={fetchData}
                    idObjet={message?.id}
                    libelleObjet={message?.libelle}
                    discussionCurrent={discussionCurrent}
                  />
                </div>
              )}
            </>
          )}
        </div>
        <div className="text-xs font-medium text-gray-500">
          {new Date(message.dateInscription).toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })}
        </div>
      </div>
      {isCurrentUser && (
        <div onDoubleClick={() => setHoveredIndex(!hoveredIndex)}>
          <Avatar
            name={`${message.responsable.nom} ${message.responsable.prenom}`}
            round={true}
            size="34"
            className="ml-0.5 cursor-pointer"
            src={message.responsable.photoProfileLien} // Le lien de l'image
          />
        </div>
      )}
    </div>
  );
}

function MediaMessage({ media, isCurrentUser }) {
  return (
    <div
      className={`flex items-start ${
        isCurrentUser ? "justify-end" : ""
      } mb-4 last:mb-0`}
    >
      {!isCurrentUser && media.responsable && (
        <Avatar
          name={`${media.responsable.nom} ${media.responsable.prenom}`}
          round={true}
          size="34"
          className="mr-1"
          src={media.responsable.photoProfileLien} // Le lien de l'image
        />
      )}
      <div>
        <div className="flex items-center gap-1">
          {isCurrentUser && (
            <Link
              to={media.lien}
              className="p-1.5 rounded-full border border-gray-200 dark:border-gray-700/60 ml-4 hover:bg-white dark:hover:bg-gray-800 transition"
            >
              <span className="sr-only">Download</span>
              <svg
                className="text-gray-400 fill-current shrink-0 dark:text-gray-500"
                width="16"
                height="16"
                viewBox="0 0 16 16"
              >
                <path d="M15 15H1a1 1 0 01-1-1V2a1 1 0 011-1h4v2H2v10h12V3h-3V1h4a1 1 0 011 1v12a1 1 0 01-1 1zM9 7h3l-4 4-4-4h3V1h2v6z" />
              </svg>
            </Link>
          )}
          {media.typeMedia === "image" ? (
            <img
              src={media.lien}
              alt={media.libelle}
              className="w-full max-w-xs rounded-lg shadow-md"
            />
          ) : media.typeMedia === "video" ? (
            <video controls className="w-full max-w-xs rounded-lg shadow-md">
              <source src={media.lien} type="video/mp4" />
              Votre navigateur ne supporte pas le lecteur vidéo.
            </video>
          ) : null}
          {!isCurrentUser && (
            <Link
              to={media.lien}
              className="p-1.5 rounded-full border border-gray-200 dark:border-gray-700/60 ml-4 hover:bg-white dark:hover:bg-gray-800 transition"
            >
              <span className="sr-only">Download</span>
              <svg
                className="text-gray-400 fill-current shrink-0 dark:text-gray-500"
                width="16"
                height="16"
                viewBox="0 0 16 16"
              >
                <path d="M15 15H1a1 1 0 01-1-1V2a1 1 0 011-1h4v2H2v10h12V3h-3V1h4a1 1 0 011 1v12a1 1 0 01-1 1zM9 7h3l-4 4-4-4h3V1h2v6z" />
              </svg>
            </Link>
          )}
        </div>
        <div className="mt-1 text-xs font-medium text-gray-500">
          {new Date(media.dateInscription).toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })}
        </div>
      </div>

      {isCurrentUser && (
        <Avatar
          name={`${media.responsable.nom} ${media.responsable.prenom}`}
          round={true}
          size="34"
          className="ml-1"
          src={media.responsable.photoProfileLien} // Le lien de l'image
        />
      )}
    </div>
  );
}

function MessagesBody({
  responsableLog,
  messages,
  error,
  data,
  loading,
  medias,
  fetchData,
  discussionCurrent,
}) {
  const [responsablesEcrire, setResponsablesEcrire] = useState([]);

  const { socket, isConnected } =  useSocket();

  console.log(discussionCurrent);
  console.log(messages);
  console.log(responsableLog);

  // Fusionner les messages et les médias
  const combinedItems = [
    ...messages.map((msg) => ({ ...msg, type: "message" })),
    ...medias.map((media) => ({ ...media, type: "media" })),
  ].sort((a, b) => new Date(a.dateInscription) - new Date(b.dateInscription));

  useEffect(() => {
    if (!socket || !isConnected || !discussionCurrent) return;

    // Rejoindre la discussion dès que le socket et la discussion actuelle sont disponibles
    socket.emit("joinDiscussion", discussionCurrent?.id);

    // Écouter les messages ou médias reçus
    socket.on("messageReceived", async (idDiscussion) => {
      if (idDiscussion === discussionCurrent?.id) {
        // Ajouter le nouveau message aux messages existants uniquement pour la discussion en cours
        await fetchData();
      }
    });

    return () => {
      socket.off("messageReceived");
    };
  }, [discussionCurrent, socket, isConnected, fetchData]);

  useEffect(() => {
    if (!socket || !isConnected || !discussionCurrent) return;

    // Écouter les messages supprimés
    socket.on("messageDeleted", async (idDiscussion) => {
      if (idDiscussion === discussionCurrent?.id) {
        // Rafraîchir les messages après suppression
        await fetchData();
      }
    });

    return () => {
      socket.off("messageDeleted");
    };
  }, [discussionCurrent, socket, isConnected, fetchData]);
  
  useEffect(() => {
    if (!socket || !isConnected || !discussionCurrent) return;


    socket.on("ecritureNewAnimation", (responsables) => {
      // Ajouter les responsables qui écrivent (éviter les doublons)
      setResponsablesEcrire((prev) => {
        const nouveauxEcrivains = responsables.filter(
          (r) => !prev.some((prevR) => prevR.id === r.id)
        );
        return [...prev, ...nouveauxEcrivains];
      });
    });

    socket.on("utilisateurStopEcrit", (responsables) => {
      // Supprimer les responsables qui n'écrivent plus
      setResponsablesEcrire((prev) =>
        prev.filter((r) => !responsables.some((stopR) => stopR.id === r.id))
      );
    });

    return () => {
      socket.off("ecritureNewAnimation");
    };
  }, [discussionCurrent ,socket, isConnected]);

  return (
    <div className="px-4 py-6 grow sm:px-6 md:px-5">
      {error && !data && (
        <p className="text-xs text-center text-red-500">
          Une erreur s'est produite lors du chargement des messages 🤒...
        </p>
      )}
      {loading ? (
        <div className="flex items-center justify-center w-full h-full">
          <SpinnerLoading />
        </div>
      ) : combinedItems.length > 0 ? (
        combinedItems.map((item, index) => {
          const isCurrentUser =
            parseInt(item?.responsable?.id, 10) === parseInt(responsableLog?.id, 10);

          // Vérifier si la date est différente de l'élément précédent
          const currentDate = formatDate(item.dateInscription);
          const previousDate =
            index > 0
              ? formatDate(combinedItems[index - 1].dateInscription)
              : null;

          return (
            <Fragment key={item.id}>
              {currentDate !== previousDate && (
                <div className="flex justify-center">
                  <div className="inline-flex items-center justify-center text-xs text-gray-600 dark:text-gray-400 font-medium px-2.5 py-1 bg-white dark:bg-gray-700 shadow-sm rounded-full my-5">
                    {currentDate}
                  </div>
                </div>
              )}
              {item.type === "message" ? (
                <Message
                  fetchData={fetchData}
                  message={item}
                  isCurrentUser={isCurrentUser}
                  discussionCurrent={discussionCurrent}
                />
              ) : (
                <MediaMessage media={item} isCurrentUser={isCurrentUser} />
              )}
            </Fragment>
          );
        })
      ) : (
        <p className="text-xs text-center">Aucun contenu à afficher 😣...</p>
      )}
      <div className="flex items-start mb-4 last:mb-0">
        {/* Affichage des avatars des utilisateurs qui écrivent, sauf l'utilisateur connecté */}
        {responsablesEcrire?.length > 0 &&
          responsablesEcrire
            .filter((responsable) => responsable.id !== responsableLog?.id) // Exclure l'utilisateur connecté
            .map((responsable) => (
              <div key={responsable.id}>
                <Avatar
                  name={`${responsable.nom} ${responsable.prenom}`}
                  round={true}
                  size="34"
                  className="mr-1 cursor-pointer"
                  src={responsable.photoProfileLien} // Le lien de l'image
                />
              </div>
            ))}

        {/* Animation affichée uniquement si l'un des responsables écrit et si l'utilisateur connecté n'écrit pas */}
        {responsablesEcrire?.length > 0 &&
          responsablesEcrire.some(
            (responsable) => responsable.id !== responsableLog?.id
          ) && (
            <div>
              <div className="p-3 mb-1 text-sm text-gray-800 bg-gray-200 rounded-lg rounded-tl-none dark:bg-gray-800 dark:text-gray-100">
                <svg
                  className="text-gray-400 fill-current dark:text-gray-500"
                  viewBox="0 0 15 3"
                  width="15"
                  height="3"
                >
                  <circle cx="1.5" cy="1.5" r="1.5">
                    <animate
                      attributeName="opacity"
                      dur="1s"
                      values="0;1;0"
                      repeatCount="indefinite"
                      begin="0.1"
                    />
                  </circle>
                  <circle cx="7.5" cy="1.5" r="1.5">
                    <animate
                      attributeName="opacity"
                      dur="1s"
                      values="0;1;0"
                      repeatCount="indefinite"
                      begin="0.2"
                    />
                  </circle>
                  <circle cx="13.5" cy="1.5" r="1.5">
                    <animate
                      attributeName="opacity"
                      dur="1s"
                      values="0;1;0"
                      repeatCount="indefinite"
                      begin="0.3"
                    />
                  </circle>
                </svg>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}

export default MessagesBody;

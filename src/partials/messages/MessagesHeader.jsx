import React, { useEffect, useState } from "react";

import Avatar from "react-avatar";
import DangerModal from "../../components/DangerModal";

function MessagesHeader({
  msgSidebarOpen,
  setMsgSidebarOpen,
  fetchDiscussionCurrent,
  discussionCurrent,
  fetchDiscussions,
  setNewsModalOpen,
  setFeedbackModalOpen,
  responsableLog,
}) {
  const [responsables, setResponsables] = useState([]);

  // console.log(discussionCurrent);
  // console.log(responsableLog);

  useEffect(() => {
    if (discussionCurrent && discussionCurrent.responsablesJ) {
      try {
        // Parse seulement une fois et utilisez directement l'objet ou tableau résultant
        // const parsedResponsables = JSON.parse(discussionCurrent.responsablesJ);
        setResponsables(discussionCurrent?.responsablesJ);
        // console.log(responsables);
      } catch (error) {
        console.error("Erreur de parsing JSON :", error);
      }
    } else {
      // console.warn("responsablesJ est undefined");
    }
  }, [discussionCurrent]);

  return (
    <div className="sticky z-60 top-16">
      <div className="flex items-center justify-between before:absolute before:inset-0 before:backdrop-blur-md before:bg-gray-50/90 dark:before:bg-[#151D2C]/90 before:-z-10 border-b border-gray-200 dark:border-gray-700/60 px-4 sm:px-6 md:px-5 h-16">
        {/* People */}
        <div className="flex items-center">
          {/* Close button */}
          <button
            className="mr-4 text-gray-400 md:hidden hover:text-gray-500"
            onClick={() => setMsgSidebarOpen(!msgSidebarOpen)}
            aria-controls="messages-sidebar"
            aria-expanded={msgSidebarOpen}
          >
            <span className="sr-only">Close sidebar</span>
            <svg
              className="w-6 h-6 fill-current"
              viewBox="0 0 24 24"
            >
              <path d="M10.7 18.7l1.4-1.4L7.8 13H20v-2H7.8l4.3-4.3-1.4-1.4L4 12z" />
            </svg>
          </button>
          {/* People list */}
          <div className="flex -ml-px -space-x-3">
            {responsables && responsables.length > 0 ? (
              responsables.slice(0, 5).map((responsable) => (
                <span>
                  <Avatar
                    name={`${responsable.nom} ${responsable.prenom}`}
                    round={true}
                    size="24"
                    src={responsable.photoProfileLien} // Le lien de l'image
                  
                  />
                </span>
              ))
            ) : (
              <span className="text-xs">😐Aucun responsable..</span>
            )}
          </div>
          <div className="text-xs italic font-medium text-gray-400 dark:text-gray-500">
            {Array.isArray(responsables) && responsables.length > 5
              ? responsables.length - 5 > 0
                ? `+${responsables.length - 5}`
                : ""
              : ""}
          </div>
        </div>
        {/* Buttons on the right side */}
        <div className="relative flex items-center justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setNewsModalOpen(true);
            }}
            className="p-1.5 shrink-0 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 shadow-sm ml-2"
          >
            <svg
              className="text-gray-400 fill-current dark:text-gray-500"
              width="16"
              height="16"
              viewBox="0 0 16 16"
            >
              <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 12c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm1-3H7V4h2v5z" />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setFeedbackModalOpen(true);
            }}
            className="p-1.5 shrink-0 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 shadow-sm ml-2"
          >
            <svg
              className="text-gray-400 fill-current dark:text-gray-500"
              width="16"
              height="16"
              viewBox="0 0 16 16"
            >
              <path d="M11.7.3c-.4-.4-1-.4-1.4 0l-10 10c-.2.2-.3.4-.3.7v4c0 .6.4 1 1 1h4c.3 0 .5-.1.7-.3l10-10c.4-.4.4-1 0-1.4l-4-4zM4.6 14H2v-2.6l6-6L10.6 8l-6 6zM12 6.6L9.4 4 11 2.4 13.6 5 12 6.6z" />
            </svg>
          </button>
          {responsables && responsableLog && (
            <>
              {responsables.map((responsable) => (
                <>
                  {parseInt(responsable?.id) === responsableLog?.id &&
                    responsable?.role === "Responsable" && (
                      <>
                        <div className="flex items-center justify-center w-8 h-8 pt-1.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 ml-2">
                          <DangerModal
                            endpoint="discussions"
                            refreshList={() => {
                              fetchDiscussionCurrent();
                              fetchDiscussions();
                            }}
                            idObjet={discussionCurrent?.id}
                            libelleObjet={discussionCurrent?.libelle}
                          />{" "}
                        </div>
                      </>
                    )}
                </>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default MessagesHeader;

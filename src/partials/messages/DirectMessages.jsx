import React, { useState, useEffect } from "react";
import Avatar from "react-avatar";
import { Link } from "react-router-dom";
import LibelleFormat from "../../components/LibelleFormat";

function DirectMessages({
  setMsgSidebarOpen,
  discussions,
  idDiscussionCurrent,
}) {
  const [parsedDiscussions, setParsedDiscussions] = useState([]);

  useEffect(() => {
    if (discussions && Array.isArray(discussions)) {
      try {
        // Parse les responsables pour chaque discussion
        const updatedDiscussions = discussions.map((discussion) => ({
          ...discussion,
          responsables: discussion.responsables
            ? discussion.responsables
            : [],
        }));
        setParsedDiscussions(updatedDiscussions);
      } catch (error) {
        console.error("Erreur de parsing JSON :", error);
      }
    } else {
      console.warn("Discussions est undefined ou n'est pas un tableau");
    }
  }, [discussions]);

  return (
    <div className="mt-4">
      <div className="mb-3 text-xs font-semibold text-gray-400 uppercase dark:text-gray-500">
        Direct messages
      </div>
      <ul className="mb-6">
        {parsedDiscussions.length > 0 &&
          parsedDiscussions.map((discussion) => {
            const isActive = idDiscussionCurrent === discussion.id;

            return (
              <li key={discussion.id} className="-mx-2">
                <Link
                  to={`/discussions/${discussion.id}`}
                  className={`flex items-center justify-between w-full p-2 rounded-lg ${
                    isActive
                      ? "bg-[linear-gradient(135deg,var(--tw-gradient-stops))] from-violet-500/[0.12] dark:from-violet-500/[0.24] to-violet-500/[0.04]"
                      : ""
                  }`}
                  onClick={() => setMsgSidebarOpen(false)}
                >
                  <div className="flex items-center truncate">
                    <Avatar
                      className="mr-2"
                      name={discussion.libelle}
                      round={true}
                      size="26"
                    />
                    <div className="truncate">
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-100">
                        {discussion.libelle}
                      </span>
                      <p className="text-xs">
                        <LibelleFormat libelle={discussion.dernierMessage} />
                      </p>
                    </div>
                  </div>

                  {/* Unread count */}
                  <div className="flex items-center ml-2">
                    {discussion.unreadCount && (
                      <div className="inline-flex px-2 text-xs font-medium leading-5 text-center text-white rounded-full bg-violet-400">
                        <span>{discussion.unreadCount || 0}</span>
                      </div>
                    )}
                  </div>

                  {/* Affichage des responsables */}
                  <div className="flex -ml-px -space-x-3">
                    {discussion.responsables.slice(0, 2).map((responsable) => (
                      <span  key={responsable.id}>
                        <Avatar
                          name={`${responsable.nom} ${responsable.prenom}`}
                          round={true}
                          size="20"
                          src={responsable.photoProfileLien} // Le lien de l'image
                        />
                      </span>
                    ))}
                  </div>

                  {/* Nombre restant de responsables */}
                  {discussion.responsables.length > 2 && (
                    <div className="text-xs italic font-medium text-gray-400 dark:text-gray-500">
                      +{discussion.responsables.length - 2}
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
      </ul>
    </div>
  );
}

export default DirectMessages;

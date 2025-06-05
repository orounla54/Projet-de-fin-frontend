import React, { useEffect, useState } from "react";

import UserImage01 from "../../images/avatar-01.jpg";
import UserImage02 from "../../images/avatar-02.jpg";
import UserImage03 from "../../images/avatar-03.jpg";
import UserImage04 from "../../images/avatar-04.jpg";
import UserImage05 from "../../images/avatar-05.jpg";
import UserImage06 from "../../images/avatar-06.jpg";
import ButtonAddProjet from "../../components/ButtonAddProjet";
import { Link } from "react-router-dom";
import { useGetData } from "../../utils/Requests/RequestService";

function ForumRightContent() {
  const status = [
    { id: 1, libelle: "Non-démaré" },
    { id: 2, libelle: "En-cours" },
    { id: 3, libelle: "Terminé" },
  ];

  const [tachesRecentes, setTachesRecentes] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const { data, loading, error } = useGetData(
    `filter/taches?idStatusTache=${2}`
  );

  useEffect(() => {
    if (data) {
      setTachesRecentes(data);
      setErrorMessage(null);
    }
    if (error) {
      setErrorMessage(
        "Une erreur s'est produite lors du chargement des projets."
      );
    }
  }, [data, error]);

  return (
    <div className="w-full hidden xl:block xl:w-72">
      <div className="lg:sticky lg:top-16 lg:h-[calc(100dvh-64px)] lg:overflow-x-hidden lg:overflow-y-auto no-scrollbar">
        <div className="md:py-8">
          {/* Button */}
          <div className="mb-6">
            <ButtonAddProjet />
          </div>

          {/* Blocks */}
          <div className="space-y-4">
            {/* Block 1 */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl">
              <div className="text-sm font-bold text-gray-400 dark:text-gray-500 mb-4">
                Taches en cours
                <span className="text-sm font-bold text-violet-600 m-2 relative">
                  {tachesRecentes.length > 7 ? "7" : tachesRecentes.length}
                  <span className="text-xs absolute">
                    {tachesRecentes.length > 7 && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="size-4"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </span>
                </span>
              </div>
              <ul>
                {/* Event 1 */}
                {tachesRecentes.slice(0, 7).map((tacheRecente) => (
                  <li
                    className="relative pb-4 last-of-type:pb-0"
                    key={tacheRecente.id}
                  >
                    <Link to={`/taches/${tacheRecente.id}`}>
                      <div className="pl-6">
                        <div className="text-sm font-bold text-violet-600 mb-0.5">
                          {tacheRecente.libelle.slice(0, 25)}
                        </div>
                        <div className="text-sm mb-2">
                          <span
                            className="text-sm font-medium text-gray-800 hover:text-gray-900 dark:text-gray-100 dark:hover:text-white"
                            href="#0"
                          >
                            {tacheRecente.description.length > 25
                              ? `${tacheRecente.description.slice(0, 25)}...`
                              : tacheRecente.description}
                          </span>
                        </div>
                        {/* Avatars */}
                        <div className="flex items-center space-x-2">
                          <div className="flex -space-x-3 -ml-0.5">
                            <span className="text-xs">
                              {tacheRecente.responsables}
                            </span>
                          </div>
                          <div className="text-xs font-medium text-gray-400 dark:text-gray-500 italic"></div>
                        </div>
                      </div>
                      {/* Timeline element */}
                      <div aria-hidden="true">
                        <div className="absolute top-0.5 -bottom-1 left-0.5 ml-px w-0.5 bg-gray-200 dark:bg-gray-700" />
                        <div className="absolute top-0.5 left-0 -ml-0.5 w-3 h-3 rounded-full bg-gray-400 dark:bg-gray-500 border-2 border-white dark:border-gray-800" />
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-4">
                <Link
                  to="/taches"
                  className="btn-sm w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-gray-800 dark:text-gray-300"
                >
                  Voir tout
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForumRightContent;

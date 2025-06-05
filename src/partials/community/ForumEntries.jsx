import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import UserAvatar from "../../images/user-avatar-32.png";
import { useGetData } from "../../utils/Requests/RequestService";
import SpinnerLoading from "../../components/SpinnerLoading";
import DateRefactor from "../../components/DateRefactor";
import SpinnerCligne from "../../components/SpinnerCligne";
import LibelleFormat from "../../components/LibelleFormat";
import DescriptionFormat from "../../components/DescriptionFormat";
import Avatar from "react-avatar";
import DateRefactor1 from "../../components/DateRefactor1";

function ForumEntries({ status }) {
  const [projets, setProjets] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  const { data, error, loading, fetchData } = useGetData(
    `filter/projets?idStatusProjet=${status}&keyword=${""}`
  );
  // console.log(data);

  useEffect(() => {
    if (data) {
      setProjets(data);
      setErrorMessage(null);
    }
    if (error) {
      setErrorMessage(
        "Une erreur s'est produite lors du chargement des projets."
      );
    }
  }, [data, error]);

  useEffect(() => {
    fetchData();
  }, [status]);

  return (
    <>
      {/* Post 1 */}
      {loading ? (
        <SpinnerLoading />
      ) : errorMessage ? (
        <div className="text-center text-red-500">{errorMessage}</div>
      ) : projets.length === 0 ? (
        <div className="text-center text-gray-500">
          Aucun projet disponible.
        </div>
      ) : (
        projets.slice(0, 7).map((projet) => (
          <article
            key={projet.id}
            className="p-4 bg-white shadow-sm dark:bg-gray-800 rounded-xl md:p-5"
          >
            <div className="flex flex-row items-start space-x-4">
              {/* Avatar */}
              <div className="mb-4 shrink-0 md:mb-0">
                {projet && (
                  <Avatar name={`${projet.libelle}`} round={true} size="38" />
                )}
              </div>

              {/* Content */}
              <div className="relative grow">
                {/* Title */}
                <h2 className="mb-2 text-base font-semibold text-gray-800 transition-colors duration-300 dark:text-gray-100 hover:text-violet-600 md:text-lg">
                  <Link to={`/projets/${projet.id}`}>
                    <LibelleFormat libelle={projet.libelle} />
                  </Link>
                </h2>

                {/* Description */}
                <div className="text-sm md:text-base">
                  <DescriptionFormat description={projet.description} />
                </div>

                {/* Footer */}
                <footer className={`flex ${projet.deadline && "flex-col items-center"} md:flex-row  md:items-center text-sm mt-4`}>
                  <div className="flex items-center mb-2 md:mb-0">
                    {projet && projet.deadline && (
                      <div className="flex items-center gap-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="size-6 text-violet-500"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                          />
                        </svg>
                        <span className="font-bold text-violet-500">
                          {new Date(projet.deadline).toLocaleDateString(
                            "fr-FR",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </span>
                      </div>
                    )}
                  </div>

                  <span className={`text-gray-500 mt-1 md:mt-0 ${projet.deadline && "md:ml-36"}`} >
                    <DateRefactor1 date={projet.dateInscription} />
                  </span>
                </footer>
              </div>

              {/* Upvote button */}
              <div className="mt-4 shrink-0 md:mt-0 md:ml-4">
                <button className="flex flex-col items-center justify-center w-12 h-12 text-xs font-semibold text-center rounded-lg shadow-violet-500/20">
                  {status === 3 ? (
                    <span className="">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="size-6"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 1.5H5.625c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5Zm6.61 10.936a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 14.47a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                          clipRule="evenodd"
                        />
                        <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
                      </svg>
                    </span>
                  ) : status === 2 ? (
                    <span className="">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="size-6"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12 5.25c1.213 0 2.415.046 3.605.135a3.256 3.256 0 0 1 3.01 3.01c.044.583.077 1.17.1 1.759L17.03 8.47a.75.75 0 1 0-1.06 1.06l3 3a.75.75 0 0 0 1.06 0l3-3a.75.75 0 0 0-1.06-1.06l-1.752 1.751c-.023-.65-.06-1.296-.108-1.939a4.756 4.756 0 0 0-4.392-4.392 49.422 49.422 0 0 0-7.436 0A4.756 4.756 0 0 0 3.89 8.282c-.017.224-.033.447-.046.672a.75.75 0 1 0 1.497.092c.013-.217.028-.434.044-.651a3.256 3.256 0 0 1 3.01-3.01c1.19-.09 2.392-.135 3.605-.135Zm-6.97 6.22a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 1 0 1.06 1.06l1.752-1.751c.023.65.06 1.296.108 1.939a4.756 4.756 0 0 0 4.392 4.392 49.413 49.413 0 0 0 7.436 0 4.756 4.756 0 0 0 4.392-4.392c.017-.223.032-.447.046-.672a.75.75 0 0 0-1.497-.092c-.013.217-.028.434-.044.651a3.256 3.256 0 0 1-3.01 3.01 47.953 47.953 0 0 1-7.21 0 3.256 3.256 0 0 1-3.01-3.01 47.759 47.759 0 0 1-.1-1.759L6.97 15.53a.75.75 0 0 0 1.06-1.06l-3-3Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  ) : (
                    <span className="">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="size-6"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6.912 3a3 3 0 0 0-2.868 2.118l-2.411 7.838a3 3 0 0 0-.133.882V18a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3v-4.162c0-.299-.045-.596-.133-.882l-2.412-7.838A3 3 0 0 0 17.088 3H6.912Zm13.823 9.75-2.213-7.191A1.5 1.5 0 0 0 17.088 4.5H6.912a1.5 1.5 0 0 0-1.434 1.059L3.265 12.75H6.11a3 3 0 0 1 2.684 1.658l.256.513a1.5 1.5 0 0 0 1.342.829h3.218a1.5 1.5 0 0 0 1.342-.83l.256-.512a3 3 0 0 1 2.684-1.658h2.844Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  )}
                </button>
              </div>
            </div>
          </article>
        ))
      )}
    </>
  );
}

export default ForumEntries;

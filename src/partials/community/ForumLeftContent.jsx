import React from "react";
import { Link } from "react-router-dom";
import ButtonAddProjet from "../../components/ButtonAddProjet";
import ButtonAddTache from "../../components/ButtonAddTache";

function ForumLeftContent({ page, setPage, formattedDate }) {
  return (
    <div className="w-full md:w-60 mb-8 md:mb-0">
      <div className="md:sticky md:top-16 md:h-[calc(100dvh-64px)] md:overflow-x-hidden md:overflow-y-auto no-scrollbar">
        <div className="md:py-8">
          <div className="flex justify-between items-center md:block">
            {/* Title */}
            <header className="mb-6">
              <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
                {page && page === "Projets" ? "Projets récents" : "Accueil"}
              </h1>
            </header>

            {/* Button */}
            <div className="xl:hidden mb-6">
              {page && page === "Projets" ? (
                <ButtonAddProjet />
              ) : (
                <ButtonAddTache />
              )}
            </div>
          </div>

          {/* Links */}
          <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase mb-3 md:sr-only">
            Menu
          </div>
          <div className="flex flex-nowrap overflow-x-scroll no-scrollbar md:block md:overflow-auto px-4 md:space-y-3 -mx-4">
            {/* Group 1 */}
            <div className="">
              <ul className="flex flex-nowrap md:block mr-3 md:mr-0 mb-3 overflow-x-scroll no-scrollbar md:overflow-auto px-4 md:space-y-3 -mx-4">
                <li className="mr-0.5 md:mr-0 md:mb-0.5 cursor-pointer">
                  <a
                    className={`flex items-center px-2.5 py-2 rounded-lg whitespace-nowrap ${
                      page === "Accueil" && "bg-white dark:bg-gray-800"
                    }`}
                    onClick={() => setPage("Accueil")}
                  >
                    <svg
                      className={`shrink-0 fill-current mr-2 ${
                        page === "Accueil" && "text-violet-500 "
                      }`}
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                    >
                      <path d="M4.904 10.114a.98.98 0 0 1 0-1.961h5.886a.98.98 0 0 1 0 1.961H4.904ZM2.863 5.166a1.962 1.962 0 0 0-.901 1.651v5.26c0 1.083.878 1.961 1.961 1.961h7.85a1.962 1.962 0 0 0 1.961-1.961v-5.26c0-.668-.34-1.29-.901-1.65L7.848 1.961 2.863 5.166ZM6.786.312a1.962 1.962 0 0 1 2.123 0l4.985 3.204a3.923 3.923 0 0 1 1.802 3.301v5.26A3.923 3.923 0 0 1 11.772 16H3.923A3.923 3.923 0 0 1 0 12.077v-5.26c0-1.335.679-2.579 1.802-3.3L6.786.311Z" />
                    </svg>
                    <span
                      className={`text-sm font-bold ${
                        page === "Accueil" && "text-violet-500 "
                      }`}
                    >
                      Accueil
                    </span>
                  </a>
                </li>
                <li className="mr-0.5 md:mr-0 md:mb-0.5 cursor-pointer">
                  <a
                    className={`flex items-center px-2.5 py-2 rounded-lg whitespace-nowrap  ${
                      page === "Projets" && "bg-white dark:bg-gray-800"
                    }`}
                    onClick={() => setPage("Projets")}
                  >
                    <span
                      className={`text-sm font-bold ${
                        page === "Projets" && "text-violet-500 "
                      }`}
                    >
                      Projets récent
                    </span>
                  </a>
                </li>
                <li className="mr-0.5 md:mr-0 md:mb-0.5 cursor-pointer">
                  <a
                    className={`flex items-center px-2.5 py-2 rounded-lg whitespace-nowrap  ${
                      page === "PageIDP" && "bg-white dark:bg-gray-800"
                    }`}
                    onClick={() => setPage("PageIDP")}
                  >
                    <span
                      className={`text-sm font-bold ${
                        page === "PageIDP" && "text-violet-500 "
                      }`}
                    >
                      Indicateur de performance
                    </span>
                  </a>
                </li>
                <li className="mr-0.5 md:mr-0 md:mb-0.5">
                  <Link
                    className="flex items-center px-2.5 py-2 rounded-lg whitespace-nowrap"
                    to="projets"
                  >
                    <svg
                      className={`shrink-0 fill-current text-gray-400 dark:text-gray-500" }`}
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                    >
                      <path d="M7.586 9H1a1 1 0 1 1 0-2h6.586L6.293 5.707a1 1 0 0 1 1.414-1.414l3 3a1 1 0 0 1 0 1.414l-3 3a1 1 0 1 1-1.414-1.414L7.586 9ZM3.075 4.572a1 1 0 1 1-1.64-1.144 8 8 0 1 1 0 9.144 1 1 0 0 1 1.64-1.144 6 6 0 1 0 0-6.856Z" />
                    </svg>
                    <span className="text-sm ml-2 font-bold text-gray-600 dark:text-gray-300">
                      Projets
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    className="flex items-center px-2.5 py-2 rounded-lg whitespace-nowrap"
                    to="taches"
                  >
                    <svg
                      className={`shrink-0 fill-current "text-gray-400 dark:text-gray-500}`}
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                    >
                      <path d="M6.753 2.659a1 1 0 0 0-1.506-1.317L2.451 4.537l-.744-.744A1 1 0 1 0 .293 5.207l1.5 1.5a1 1 0 0 0 1.46-.048l3.5-4ZM6.753 10.659a1 1 0 1 0-1.506-1.317l-2.796 3.195-.744-.744a1 1 0 0 0-1.414 1.414l1.5 1.5a1 1 0 0 0 1.46-.049l3.5-4ZM8 4.5a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2H9a1 1 0 0 1-1-1ZM9 11.5a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2H9Z" />
                    </svg>
                    <span className="text-sm ml-2 font-bold text-gray-600 dark:text-gray-300">
                      Taches
                    </span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="relative bg-[linear-gradient(135deg,var(--tw-gradient-stops))] from-violet-500/[0.12] dark:from-violet-500/[0.24] to-violet-500/[0.04] rounded-lg p-5">
          <div className="absolute bottom-0 -mb-3">
            <svg
              width="44"
              height="42"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
            >
              <defs>
                <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="ill-b">
                  <stop stopColor="#B7ACFF" offset="0%" />
                  <stop stopColor="#9C8CFF" offset="100%" />
                </linearGradient>
                <linearGradient
                  x1="50%"
                  y1="24.537%"
                  x2="50%"
                  y2="100%"
                  id="ill-c"
                >
                  <stop stopColor="#4634B1" offset="0%" />
                  <stop stopColor="#4634B1" stopOpacity="0" offset="100%" />
                </linearGradient>
                <path id="ill-a" d="m20 0 20 40-20-6.25L0 40z" />
              </defs>
              <g
                transform="scale(-1 1) rotate(-51 -11.267 67.017)"
                fill="none"
                fillRule="evenodd"
              >
                <mask id="ill-d" fill="#fff">
                  <use xlinkHref="#ill-a" />
                </mask>
                <use fill="url(#ill-b)" xlinkHref="#ill-a" />
                <path
                  fill="url(#ill-c)"
                  mask="url(#ill-d)"
                  d="M20.586-7.913h25v47.5h-25z"
                />
              </g>
            </svg>
          </div>
          <div className="relative">
            <div className="text-sm font-medium text-gray-800 dark:text-violet-200 mb-2">
              Remember to keep track of your job research.
              <br />
              <br />
            </div>
            <div className="text-right text-sm font-bold w-28 m-4 dark:text-violet-300">
              {formattedDate}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForumLeftContent;

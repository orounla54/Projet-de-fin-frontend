import React from "react";
import { Link } from "react-router-dom";
import ButtonAddProjet from "../../components/ButtonAddProjet";
import ButtonAddTache from "../../components/ButtonAddTache";

function AdminLeftContent({ page, setPage, setFeedbackModalOpen, element }) {
  const displayText = () => {
    if (page === "listing") {
      return `Liste ${element}`;
    }
  
    if (page === "ServicesIDP") {
      return "Performances services";
    }
  
    const elementText = {
      services: "Services",
      postes: "Postes",
      positions: "Positions",
    };
  
    return elementText[element] || "";
  };
  return (
    <div className="w-full mb-8 md:w-60 md:mb-0">
      <div className="md:sticky md:top-16 md:h-[calc(100dvh-64px)] md:overflow-x-hidden md:overflow-y-auto no-scrollbar">
        <div className="md:py-8">
          <div className="flex items-center justify-between md:block">
            {/* Title */}
            <header className="mb-6">
              <h1 className="text-2xl font-bold text-gray-800 md:text-3xl dark:text-gray-100">
                {displayText()}
              </h1>
            </header>

            {/* Button */}
            <div className="mb-6 xl:hidden">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setFeedbackModalOpen(true);
                }}
                className="text-gray-100 bg-gray-900 btn md:w-full hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="size-6">
                  <path
                    fillRule="evenodd"
                    d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
                    clipRule="evenodd"
                  />
                </svg>

                <span className="ml-1">Nouveau</span>
              </button>
            </div>
          </div>

          {/* Links */}
          <div className="mb-3 text-xs font-semibold text-gray-400 uppercase dark:text-gray-500 md:sr-only">
            Menu
          </div>
          <div className="flex px-4 -mx-4 overflow-x-scroll flex-nowrap no-scrollbar md:block md:overflow-auto md:space-y-3">
            {/* Group 1 */}
            <div className="">
              <ul className="flex px-4 mb-3 mr-3 -mx-4 overflow-x-scroll flex-nowrap md:block md:mr-0 no-scrollbar md:overflow-auto md:space-y-3">
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
                      {element === "services"
                        ? "Services"
                        : element === "postes"
                        ? "Postes"
                        : element === "positions"
                        ? "Positions"
                        : ""}
                    </span>
                  </a>
                </li>
                <li className="mr-0.5 md:mr-0 md:mb-0.5 cursor-pointer">
                  <a
                    className={`flex items-center px-2.5 py-2 rounded-lg whitespace-nowrap  ${
                      page === "listing" && "bg-white dark:bg-gray-800"
                    }`}
                    onClick={() => setPage("listing")}
                  >
                    <svg
                      className={`shrink-0 fill-current mr-2 ${
                        page === "listing" && "text-violet-500 "
                      }`}
                      width="16"
                      height="16"
                      viewBox="0 0 18 18"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75H12a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z"
                        clipRule="evenodd"
                      />
                    </svg>

                    <span
                      className={`text-sm font-bold ${
                        page === "listing" && "text-violet-500 "
                      }`}
                    >
                      Liste {element}
                    </span>
                  </a>
                </li>
                {element === "services" && (
                  <li className="mr-0.5 md:mr-0 md:mb-0.5 cursor-pointer">
                    <a
                      className={`flex items-center px-2.5 py-2 rounded-lg whitespace-nowrap  ${
                        page === "ServicesIDP" && "bg-white dark:bg-gray-800"
                      }`}
                      onClick={() => setPage("ServicesIDP")}
                    >
                      <svg
                        className={`shrink-0 fill-current mr-2 ${
                          page === "ServicesIDP" && "text-violet-500 "
                        }`}
                        width="22"
                        height="22"
                        viewBox="0 0 25 25"
                      >
                        <path
                          fillRule="evenodd"
                          d="M2.25 13.5a8.25 8.25 0 0 1 8.25-8.25.75.75 0 0 1 .75.75v6.75H18a.75.75 0 0 1 .75.75 8.25 8.25 0 0 1-16.5 0Z"
                          clipRule="evenodd"
                        />
                        <path
                          fillRule="evenodd"
                          d="M12.75 3a.75.75 0 0 1 .75-.75 8.25 8.25 0 0 1 8.25 8.25.75.75 0 0 1-.75.75h-7.5a.75.75 0 0 1-.75-.75V3Z"
                          clipRule="evenodd"
                        />
                      </svg>

                      <span
                        className={`text-sm font-bold ${
                          page === "ServicesIDP" && "text-violet-500 "
                        }`}
                      >
                        Performances services
                      </span>
                    </a>
                  </li>
                )}
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
            <div className="mb-2 text-sm font-medium text-gray-800 dark:text-violet-200">
              Page d'administrations des {element}
              <br />
              <br />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLeftContent;

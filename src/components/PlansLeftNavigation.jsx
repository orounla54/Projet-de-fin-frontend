import React from "react";
import AfficheViolet from "./AfficheViolet";

function PlansLeftNavigation({
  setFeedbackModalOpen,
  page,
  setPage,
  handleLabel,
}) {
  return (
    <div className="w-full md:w-64 mb-8 md:mb-0">
      <div className="md:sticky md:top-16 md:h-[calc(100dvh-64px)] md:overflow-x-hidden md:overflow-y-auto no-scrollbar">
        <div className="md:py-8">
          {page !== "Matrice" && (
            <>
              <div className="flex justify-between items-center md:block">
                {/* Title */}
                <header className="mb-6">
                  <h1 className="text-2xl xl:hidden md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
                    {handleLabel()}
                  </h1>
                </header>

                {/* Button */}
                <div className="mb-6 xl:hidden">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFeedbackModalOpen(true);
                    }}
                    className="btn md:w-full bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
                  >
                    Nouveau
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Links */}
          <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase mb-3 md:sr-only">
            Menu
          </div>
          <div className="flex flex-nowrap overflow-x-scroll no-scrollbar md:block md:overflow-auto px-4 md:space-y-3 -mx-4">
            {/* Group 1 */}
            <div>
              <ul className="flex flex-nowrap md:block mr-3 md:mr-0 mb-3 overflow-x-scroll no-scrollbar md:overflow-auto px-4 md:space-y-3 -mx-4">
                <li className="mr-0.5 md:mr-0 md:mb-0.5 cursor-pointer">
                  <a
                    className={`flex items-center px-2.5 py-2 rounded-lg whitespace-nowrap ${
                      page === "plansStrategiques" &&
                      "bg-white dark:bg-gray-800"
                    }`}
                    onClick={() => setPage("plansStrategiques")}
                  >
                    <svg
                      className={`shrink-0 fill-current mr-2 ${
                        page === "plansStrategiques" && "text-violet-500 "
                      }`}
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                    >
                      <path d="M4.904 10.114a.98.98 0 0 1 0-1.961h5.886a.98.98 0 0 1 0 1.961H4.904ZM2.863 5.166a1.962 1.962 0 0 0-.901 1.651v5.26c0 1.083.878 1.961 1.961 1.961h7.85a1.962 1.962 0 0 0 1.961-1.961v-5.26c0-.668-.34-1.29-.901-1.65L7.848 1.961 2.863 5.166ZM6.786.312a1.962 1.962 0 0 1 2.123 0l4.985 3.204a3.923 3.923 0 0 1 1.802 3.301v5.26A3.923 3.923 0 0 1 11.772 16H3.923A3.923 3.923 0 0 1 0 12.077v-5.26c0-1.335.679-2.579 1.802-3.3L6.786.311Z" />
                    </svg>
                    <span
                      className={`text-sm font-bold ${
                        page === "plansStrategiques" && "text-violet-500 "
                      }`}
                    >
                      Accueil
                    </span>
                  </a>
                </li>
                <li className="mr-0.5 md:mr-0 md:mb-0.5 cursor-pointer">
                  <a
                    className={`flex items-center px-2.5 py-2 rounded-lg whitespace-nowrap ${
                      page === "axesStrategiques" && "bg-white dark:bg-gray-800"
                    }`}
                    onClick={() => setPage("axesStrategiques")}
                  >
                    <svg
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.75}
                      stroke="currentColor"
                      className={`shrink-0 size-5 fill-current mr-2 ${
                        page === "axesStrategiques" && "text-violet-500 "
                      }`}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 9V4.5M9 9H4.5M9 9 3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5 5.25 5.25"
                      />
                    </svg>

                    <span
                      className={`text-sm font-bold ${
                        page === "axesStrategiques" && "text-violet-500 "
                      }`}
                    >
                      Axes strategiques
                    </span>
                  </a>
                </li>
                <li className="mr-0.5 md:mr-0 md:mb-0.5 cursor-pointer">
                  <a
                    className={`flex items-center px-2.5 py-2 rounded-lg whitespace-nowrap ${
                      page === "objectifsStrategiques" &&
                      "bg-white dark:bg-gray-800"
                    }`}
                    onClick={() => setPage("objectifsStrategiques")}
                  >
                    <svg
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.9}
                      stroke="currentColor"
                      className={`size-5 shrink-0 fill-current mr-2 ${
                        page === "objectifsStrategiques" && "text-violet-500 "
                      }`}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
                      />
                    </svg>

                    <span
                      className={`text-sm font-bold ${
                        page === "objectifsStrategiques" && "text-violet-500 "
                      }`}
                    >
                      Objectifs strategiques
                    </span>
                  </a>
                </li>
                <li className="mr-0.5 md:mr-0 md:mb-0.5 cursor-pointer">
                  <a
                    className={`flex items-center px-2.5 py-2 rounded-lg whitespace-nowrap ${
                      page === "mesuresStrategiques" &&
                      "bg-white dark:bg-gray-800"
                    }`}
                    onClick={() => setPage("mesuresStrategiques")}
                  >
                    <svg
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.9}
                      stroke="currentColor"
                      className={`size-5 shrink-0 fill-current mr-2 ${
                        page === "mesuresStrategiques" && "text-violet-500 "
                      }`}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
                      />
                    </svg>

                    <span
                      className={`text-sm font-bold ${
                        page === "mesuresStrategiques" && "text-violet-500 "
                      }`}
                    >
                      Mesures strategiques
                    </span>
                  </a>
                </li>
                <li className="mr-0.5 md:mr-0 md:mb-0.5 cursor-pointer">
                  <a
                    className={`flex items-center px-2.5 py-2 rounded-lg whitespace-nowrap ${
                      page === "objectifsOperationnels" &&
                      "bg-white dark:bg-gray-800"
                    }`}
                    onClick={() => setPage("objectifsOperationnels")}
                  >
                    <svg
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className={`size-5 shrink-0 fill-current mr-2 ${
                        page === "objectifsOperationnels" && "text-violet-500 "
                      }`}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12"
                      />
                    </svg>

                    <span
                      className={`text-sm font-bold ${
                        page === "objectifsOperationnels" && "text-violet-500 "
                      }`}
                    >
                      Objectifs operationnels
                    </span>
                  </a>
                </li>
                <li className="mr-0.5 md:mr-0 md:mb-0.5 cursor-pointer">
                  <a
                    className={`flex items-center px-2.5 py-2 rounded-lg whitespace-nowrap ${
                      page === "Matrice" && "bg-white dark:bg-gray-800"
                    }`}
                    onClick={() => setPage("Matrice")}
                  >
                    <svg
                      className={`shrink-0 fill-current mr-2 ${
                        page === "Matrice" && "text-violet-500 "
                      }`}
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                    >
                      <path d="M5 9a1 1 0 1 1 0-2h6a1 1 0 0 1 0 2H5ZM1 4a1 1 0 1 1 0-2h14a1 1 0 0 1 0 2H1Zm0 10a1 1 0 0 1 0-2h14a1 1 0 0 1 0 2H1Z" />
                    </svg>
                    <span
                      className={`text-sm font-bold ${
                        page === "Matrice" && "text-violet-500 "
                      }`}
                    >
                      Matrice
                    </span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <AfficheViolet />
        </div>
      </div>
    </div>
  );
}

export default PlansLeftNavigation;

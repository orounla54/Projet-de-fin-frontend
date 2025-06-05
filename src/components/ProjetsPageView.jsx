import React from "react";
import DateRefactor1 from "./DateRefactor1";

function ProjetsPageView({projet}) {
  return (
    <div className="bg-white dark:bg-gray-800 p-5 shadow-sm rounded-xl my-5">
      <ul className="space-y-2 sm:flex justify-evenly sm:space-y-0 sm:space-x-2 lg:space-y-2 lg:space-x-0 lg:flex-col mb-4">
        <li>
          <button className="w-full h-full text-left py-3 px-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 shadow-sm transition">
            <div className="flex flex-wrap items-center justify-between mb-0.5">
              <span className="font-bold text-xs text-gray-800 dark:text-gray-100">
                Date prise de decision
              </span>
            </div>
            <div className="text-xs">
              {projet && projet.datePriseDecision ? (
                <DateRefactor1 date={projet.datePriseDecision} />
              ) : (
                "Aucune date inscrite"
              )}
            </div>
          </button>
        </li>
        <li>
          <button className="w-full h-full text-left py-3 px-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 shadow-sm transition">
            <div className="flex flex-wrap items-center justify-between mb-0.5">
              <span className="font-bold text-xs text-gray-800 dark:text-gray-100">
                Date debut
              </span>
            </div>
            <div className="text-xs">
              {projet && projet.dateDebut ? (
                <DateRefactor1 date={projet.dateDebut} />
              ) : (
                "Aucune date inscrite"
              )}
            </div>
          </button>
        </li>
        <li>
          <button className="w-full h-full text-left py-3 px-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 shadow-sm transition">
            <div className="flex flex-wrap items-center justify-between mb-0.5">
              <span className="font-bold text-xs text-gray-800 dark:text-gray-100">
                Date fin
              </span>
            </div>
            <div className="text-xs">
              {projet && projet.dateFin ? (
                <DateRefactor1 date={projet.dateFin} />
              ) : (
                "Aucune date inscrite"
              )}
            </div>
          </button>
        </li>
        <li>
          <button className="w-full h-full text-left py-3 px-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 shadow-sm transition">
            <div className="flex flex-wrap items-center justify-between mb-0.5">
              <span className="font-bold text-xs text-gray-800 dark:text-gray-100">
                Deadline projet
              </span>
            </div>
            <div className="text-xs">
              {projet && projet.deadline ? (
                <DateRefactor1 date={projet.deadline} />
              ) : (
                "Aucune date inscrite"
              )}
            </div>
          </button>
        </li>
      </ul>
    </div>
  );
}

export default ProjetsPageView;

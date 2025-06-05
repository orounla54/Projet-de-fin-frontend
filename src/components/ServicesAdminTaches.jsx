import React from "react";
import ServicesAdminTache from "./ServicesAdminTache";

function ServicesAdminTaches({ taches }) {
  return (
    <>
      {" "}
      <div className="p-4 bg-white dark:bg-gray-800 rounded-xl">
        <div className="mb-4 text-xs font-semibold text-gray-400 uppercase dark:text-gray-500">
          Taches du services
        </div>
        <ul>
          {/* Event 1 */}
          {taches.length > 0 && (
            taches.slice(0, 10).map((tache) => (
                <ServicesAdminTache tache={tache} />
            ))
          )}
        </ul>
      </div>
    </>
  );
}

export default ServicesAdminTaches;

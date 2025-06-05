import React, { useState } from "react";
import LibelleFormat from "../../components/LibelleFormat";
import DescriptionFormat from "../../components/DescriptionFormat";
import { Link } from "react-router-dom";
import TaskEnRetardArticle from "../../partials/tasks/TaskEnRetardArticle";

function TachesEnRetard({ tachesEnRetard }) {

  const [sliceListe, setSliceListe] = useState(true);
  

  return (
    <main className="grow">
      <div className="sm:px-6 lg:px-16 py-8 w-full max-w-9xl mx-auto">
        {/* Posts */}
        <div>
          <h2 className="text-2xl text-gray-800 dark:text-gray-100 font-bold mb-4">
            Liste des taches en retard
          </h2>
          {/* Post */}
          {tachesEnRetard && tachesEnRetard.length > 0 ? (
            <>
              {tachesEnRetard
                .slice(0, sliceListe ? 10 : tachesEnRetard.length)
                .map((tache) => (
                    <TaskEnRetardArticle tache={tache} />
                ))}
            </>
          ) : (
            <></>
          )}
        </div>

        {/* Pagination */}
        <div className="mt-6">
          <div className="flex justify-end">
            <a
              className="btn bg-white cursor-pointer dark:bg-gray-800 border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-gray-800 dark:text-gray-300"
              onClick={() => {
                console.log("SLICE :" + sliceListe);
                setSliceListe(!sliceListe);
              }}
            >
              {sliceListe ? "Etendre la liste" : "Voir les plus recents"}
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}

export default TachesEnRetard;

import React from "react";

import SpinnerLoading from "./SpinnerLoading";
import DiscussionsTacheItem from "./DiscussionsTacheItem";

function DiscussionTacheItems({ discussions, loading, error }) {
  return (
    <>
      <div>
        {loading && (
          <div className="flex items-center justify-center">
            <SpinnerLoading />
          </div>
        )}
        {error && (
          <div className="flex items-center justify-center">
            <p className="text-xs text-center text-red-500 dark:text-red-400">
              Une erreur est survenue lors de la recuperation des données.
              Veuillez réessayer ...
            </p>
          </div>
        )}
      </div>
      {/* Item 1 */}
      {discussions && discussions.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {discussions.map((discussion, index) => (
            <>
              <DiscussionsTacheItem
                key={discussions ? discussion.id : index}
                discussion={discussion}
              />
            </>
          ))}
        </div>
      ) : error ? (
        <div className="flex items-center justify-center">
          <p className="text-xs text-center text-red-500 dark:text-red-400">
            Une erreur est survenue lors de la recuperation des données.
            Veuillez réessayer ...
          </p>
        </div>
      ) : (
        <div className="flex items-center justify-center w-full">
          <p className="text-xs text-center text-gray-500 dark:text-gray-400">
            Aucune discution ajoutée pour l'instant...
          </p>
        </div>
      )}
    </>
  );
}

export default DiscussionTacheItems;

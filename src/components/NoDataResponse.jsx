import React from "react";

function NoDataResponse({ keyword }) {
  return (
    <div className="w-full px-4 py-8 mx-auto sm:px-6 lg:px-8 max-w-9xl">
      <div className="max-w-2xl m-auto mt-16">
        <div className="px-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-gradient-to-t from-gray-200 to-gray-100 dark:from-gray-700 dark:to-gray-800">
            <svg className="w-5 h-6 fill-current" viewBox="0 0 20 24">
              <path
                className="text-gray-500 dark:text-gray-600"
                d="M10 10.562l9-5-8.514-4.73a1 1 0 00-.972 0L1 5.562l9 5z"
              />
              <path
                className="text-gray-300 dark:text-gray-400"
                d="M9 12.294l-9-5v10.412a1 1 0 00.514.874L9 23.294v-11z"
              />
              <path
                className="text-gray-400 dark:text-gray-500"
                d="M11 12.294v11l8.486-4.714a1 1 0 00.514-.874V7.295l-9 4.999z"
              />
            </svg>
          </div>
          {keyword !== "" ? (
            <p className="text-xs text-center">
              Aucun résultat pour la recherche "{keyword}"
            </p>
          ) : (
            <>
              <div className="mb-6 text-gray-600 dark:text-gray-300">
                Rien n'a été inscrire pour le moment.
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default NoDataResponse;

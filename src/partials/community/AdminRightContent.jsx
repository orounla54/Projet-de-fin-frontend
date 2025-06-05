import React from "react";

import ServicesAdminTaches from "../../components/ServicesAdminTaches";
import SpinnerLoading from "../../components/SpinnerLoading";
import { Link } from "react-router-dom";
import PostesResponsablesItem from "../../components/PostesResponsablesItem";

function AdminRightContent({
  setFeedbackModalOpen,
  taches,
  errorCurrent,
  loadingCurrent,
  element,
  responsables
}) {
  return (
    <div className="hidden w-full xl:block xl:w-72">
      <div className="lg:sticky lg:top-16 lg:h-[calc(100dvh-64px)] lg:overflow-x-hidden lg:overflow-y-auto no-scrollbar">
        <div className="md:py-8">
          {/* Button */}
          <div className="mb-6">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setFeedbackModalOpen(true);
              }}
              className="flex items-center justify-center w-full gap-1 text-gray-100 bg-gray-900 btn hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-6">
                <path
                  fillRule="evenodd"
                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Nouveau</span>
            </button>
          </div>

          {/* Blocks */}
          <div className="space-y-4">
            {/* Block 1 */}
            {errorCurrent && (
              <p className="text-xs text-center text-red-500">{errorCurrent}</p>
            )}
            {loadingCurrent ? (
              <>
                <SpinnerLoading />
              </>
            ) : (
              element === "services" &&
              taches &&
              taches.length > 0 && <ServicesAdminTaches taches={taches} />
            )}

            {/* Block 2 */}
            {responsables && responsables.length > 0 && (
              <div className="p-4 bg-white dark:bg-gray-800 rounded-xl">
                <div className="mb-4 text-xs font-semibold text-gray-400 uppercase dark:text-gray-500">
                  Responsables
                </div>
                <ul className="space-y-3">
                  {responsables && responsables.length > 0 && (
                    responsables.map((responsable) => (
                      <PostesResponsablesItem element={element} responsable={responsable} />
                    ))
                  )}

                </ul>
                <div className="mt-4">
                  <Link
                    to={`/administration/responsables`}
                    className="w-full text-gray-800 bg-white border-gray-200 btn-sm dark:bg-gray-800 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 dark:text-gray-300"
                  >
                    Voir tout
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminRightContent;

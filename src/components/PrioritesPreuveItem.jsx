import React, { useEffect, useState } from "react";
import DangerModal from "./DangerModal";
import DateRefactor1 from "./DateRefactor1";
import DescriptionFormat from "./DescriptionFormat";
import AddPreuvesToPriorites from "./formulaires/AddPreuvesToPriorites";
import PrioritesPreuvesDocuments from "./PrioritesPreuvesDocuments";

function PrioritesPreuveItem({
  preuve,
  priorite,
  responsableLog,
  page,
  fetchData,
}) {
  const [feedbackModalOpenUpdate, setFeedbackModalOpenUpdate] = useState(false);

  return (
    <li key={preuve?.id} className="sm:flex sm:items-center sm:justify-between">
      <div className="w-full p-4 pt-5 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-900 dark:border-gray-700/60">
        <div className="relative flex items-center justify-start group">
          {priorite?.responsables.some(
            (responsable) =>
              parseInt(responsable.id) === parseInt(responsableLog?.id) &&
              page === "responsable"
          ) && (
            <div className="absolute flex items-center justify-between transition-opacity duration-300 opacity-0 group-hover:opacity-100 -top-6 -left-2">
              <div className="">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setFeedbackModalOpenUpdate(true);
                  }}
                  className="flex items-center justify-center w-5 h-5 transition rounded-full shadow-sm text-violet-500"
                >
                  <svg
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="size-5"
                  >
                    <path d="m5.433 13.917 1.262-3.155A4 4 0 0 1 7.58 9.42l6.92-6.918a2.121 2.121 0 0 1 3 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 0 1-.65-.65Z" />
                    <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0 0 10 3H4.75A2.75 2.75 0 0 0 2 5.75v9.5A2.75 2.75 0 0 0 4.75 18h9.5A2.75 2.75 0 0 0 17 15.25V10a.75.75 0 0 0-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5Z" />
                  </svg>
                </button>
                <AddPreuvesToPriorites
                  fetchData={fetchData}
                  setFeedbackModalOpen={setFeedbackModalOpenUpdate}
                  feedbackModalOpen={feedbackModalOpenUpdate}
                  preuve={preuve}
                />
              </div>
              <div className="pt-1">
                <DangerModal
                  endpoint="documentsPreuves"
                  idObjet={preuve?.id}
                  libelleObjet={preuve?.libelle}
                  refreshList={() => {
                    fetchData();
                    fetchDataPreuves();
                  }}
                />
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-between">
          <div className="font-medium text-gray-800 transition dark:text-gray-200 ">
            {preuve?.libelle || "Aucun libelle"}
          </div>
          <div className="text-xs">
            <DateRefactor1 date={preuve.dateInscription} />
          </div>
        </div>
        {preuve?.description && (
          <div>
            <DescriptionFormat description={preuve?.description} length={200} />
          </div>
        )}
        <div className={`${!preuve?.description && "mt-8"}`}>
          <PrioritesPreuvesDocuments
            priorite={priorite}
            responsableLog={responsableLog}
            preuve={preuve}
            page={page}
          />
        </div>
      </div>
    </li>
  );
}

export default PrioritesPreuveItem;

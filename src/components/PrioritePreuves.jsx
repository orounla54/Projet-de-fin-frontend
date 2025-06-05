import React, { useEffect, useState } from "react";
import { useGetData } from "../utils/Requests/RequestService";
import SpinnerLoading from "./SpinnerLoading";
import PrioritesPreuveItem from "./PrioritesPreuveItem";
import AddPreuvesToPriorites from "./formulaires/AddPreuvesToPriorites";

const formatData = (data) => {
  return data.map((preuve) => ({
    ...preuve,
  }));
};

function PrioritePreuves({ priorite, responsableLog, page, slice }) {
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [preuves, setPreuves] = useState([]);

  // Récupérer l'enevenement
  const { data, loading, error, fetchData } = useGetData(
    priorite ? `priorites/${priorite?.id}/preuves` : ""
  );

  //   console.log(priorite?.responsables)
  //   console.log(responsableLog)

  //effectue la mise à jour de la page quand on a la data
  useEffect(() => {
    if (data) {
      //   const formattedData = formatData(data);
      setPreuves(data);
      console.log(data);
    }
  }, [data]);

  useEffect(() => {
    console.log(preuves);
  }, [preuves]);

  return (
    <div className={`mb-2 ${slice ? "" : " xl:w-4/5"}`}>
      <div className="flex items-center justify-between my-2">
        <h2 className="mb-2 font-semibold text-gray-800 dark:text-gray-100">
          Preuves
        </h2>
        {priorite?.responsables.some(
          (responsable) =>
            parseInt(responsable.id) === parseInt(responsableLog?.id) &&
            page === "responsable"
        ) && (
          <div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setFeedbackModalOpen(true);
              }}
              className="flex items-center justify-center transition bg-white border border-gray-200 rounded-full shadow-sm w-7 h-7 dark:bg-gray-800 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-violet-500"
            >
              <span className="sr-only">Add Task</span>
              <svg
                className="fill-current"
                width="14"
                height="14"
                viewBox="0 0 16 16"
              >
                <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
              </svg>
            </button>
            <AddPreuvesToPriorites
              fetchData={fetchData}
              setFeedbackModalOpen={setFeedbackModalOpen}
              feedbackModalOpen={feedbackModalOpen}
              priorite={priorite}
            />
          </div>
        )}
      </div>
      <ul className="space-y-3">
        {loading ? (
          <>
            <SpinnerLoading />
          </>
        ) : (
          <>
            {preuves && preuves.length > 0 ? (
              <>
                {preuves
                  .slice(0, slice ? 7 : preuves.length)
                  .map((preuve, index) => (
                    <PrioritesPreuveItem
                      priorite={priorite}
                      fetchData={fetchData}
                      preuve={preuve}
                      responsableLog={responsableLog}
                      page={page}
                    />
                  ))}
              </>
            ) : (
              <div className="w-full p-4 pt-5 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-900 dark:border-gray-700/60">
                <p className="text-xs text-center">
                  Aucune preuve n'a été ajoutée pour le moment📄.
                </p>
              </div>
            )}
          </>
        )}
      </ul>
    </div>
  );
}

export default PrioritePreuves;

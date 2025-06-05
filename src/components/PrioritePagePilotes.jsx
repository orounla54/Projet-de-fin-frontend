import React, { useEffect, useState } from "react";
import { useGetData } from "../utils/Requests/RequestService";
import SpinnerLoading from "./SpinnerLoading";
import PrioritePagePiloteItem from "./PrioritePagePiloteItem";
import AddPiloteToPriorite from "./AddPiloteToPriorite";

const formatData = (Pilotes) => {
  return Pilotes.map((demande) => {
    const responsable = demande.responsables; // Convertir la chaîne JSON en objet

    return {
      new: demande.new,
      id: demande.id,
      idResponsable: demande.idResponsable,
      responsable: {
        id: responsable.id,
        nom: responsable.nom,
        prenom: responsable.prenom,
        email: responsable.email,
        image: responsable.image,
        position: responsable.position,
        service: responsable.service,
        poste: responsable.poste,
      },
      statusDemande: demande.statusDemande,
      formattedDate: (() => {
        const inscriptionDate = new Date(demande.dateInscription);
        const today = new Date();

        // Vérification si la date correspond à aujourd'hui
        const isToday =
          inscriptionDate.getDate() === today.getDate() &&
          inscriptionDate.getMonth() === today.getMonth() &&
          inscriptionDate.getFullYear() === today.getFullYear();

        if (isToday) {
          return `Aujourd'hui, ${inscriptionDate.toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
          })}`; // Affiche "Aujourd'hui, HH:mm"
        }

        // Sinon, formater avec la date et l'heure
        return inscriptionDate.toLocaleDateString("fr-FR", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      })(),
      // Formater la date
    };
  });
};

function PrioritePagePilotes({ priorite, sousPage, page }) {
  const [responsables, setResponsables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);

  const {
    data: dataPilotes,
    loading: loadingPilotes,
    error: errorPilotes,
    fetchData: fetchDataPilotes,
  } = useGetData(
    `${priorite ? `${"priorites/"}${priorite?.id}/responsables` : ""}`
  );

  useEffect(() => {
    if (dataPilotes) {
      // const formated = formatData(dataDemandes);
      setResponsables(dataPilotes);
      console.log(responsables);
    }
  }, [dataPilotes]);

  return (
    <div className="mb-4 xl:w-4/5">
      <div className="flex items-center justify-between my-2">
        <h2 className="mb-2 font-semibold text-gray-800 dark:text-gray-100">
          Pilotes
        </h2>
        {page === "manage" && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setFeedbackModalOpen(true);
              }}
              className="flex items-center justify-center transition bg-white border border-gray-200 rounded-full shadow-sm w-7 h-7 dark:bg-gray-800 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-violet-500"
            >
              <span className="sr-only">Add new account</span>
              <svg
                className="fill-current"
                width="14"
                height="14"
                viewBox="0 0 16 16"
              >
                <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
              </svg>
            </button>
          </>
        )}
      </div>
      {page === "manage" && (
        <AddPiloteToPriorite
          fetchData={fetchDataPilotes}
          feedbackModalOpen={feedbackModalOpen}
          setFeedbackModalOpen={setFeedbackModalOpen}
          priorite={priorite}
        />
      )}
      <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-900 dark:border-gray-700/60">
        <ul className="space-y-3">
          <>
            {loadingPilotes ? (
              <>
                <SpinnerLoading />
              </>
            ) : (
              <>
                <>
                  {responsables && responsables.length > 0 ? (
                    <>
                      {responsables.length > 0 &&
                        responsables
                          .sort((a, b) => (a.role === "Pilote" ? -1 : 1))
                          .map((resp) => (
                            <PrioritePagePiloteItem
                              key={resp.id} // Ajoutez une clé unique ici pour chaque élément
                              responsable={resp}
                              priorite={priorite}
                              page={page}
                              fetchDataPilotes={() => {
                                fetchDataPilotes();
                              }}
                            />
                          ))}
                    </>
                  ) : (
                    <p className="text-xs text-center">
                      Aucune pilote ajouté pour le moment.
                    </p>
                  )}
                </>
              </>
            )}
          </>
        </ul>
      </div>
    </div>
  );
}

export default PrioritePagePilotes;

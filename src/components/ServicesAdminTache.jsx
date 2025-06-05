import React, { useEffect, useState } from "react";
import LibelleFormat from "./LibelleFormat";
import { useGetData } from "../utils/Requests/RequestService";
import Avatar from "react-avatar";
import { Link } from "react-router-dom";
import DescriptionFormat from "./DescriptionFormat";
import SpinnerLoading from "./SpinnerLoading";

function ServicesAdminTache({ tache }) {
  const [responsables, setResponsables] = useState([]);

  // Récupérer les données avec les paramètres de filtre conditionnels
  const { data, loading, error, fetchData } = useGetData(
    `taches/${tache?.id}/responsables?`
  );

  //   console.log(data)

  useEffect(() => {
    if (data && data.Responsables) {
      try {
        const parsedData = JSON.parse(data.Responsables); // Convertit la chaîne JSON
        setResponsables(parsedData);
      } catch (error) {
        console.error("Erreur lors du parsing JSON :", error);
      }
    } else {
      console.warn("Aucune donnée à analyser.");
    }
  }, [data]); // Dépendance uniquement sur `data`

  // useEffect(() => {
  //   console.log(responsables); // Affiche les responsables chaque fois qu'ils changent
  // }, [responsables]); // Dépendance sur `responsables`

  const formatDate = (date) => {
    const formattedDate = new Date(date);
    const options = {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    };
    return formattedDate.toLocaleDateString("fr-FR", options); // 'en-GB' pour le format jour/mois/année
  };

  return (
    <>
      <li className="relative pb-4 last-of-type:pb-0">
        <div className="pl-6">
          <div className="text-xs font-medium uppercase text-violet-600 mb-0.5">
            {formatDate(tache?.dateInscription)}
          </div>
          <div className="mb-2 text-sm">
            <Link
              className="font-medium text-gray-800 hover:text-gray-900 dark:text-gray-100 dark:hover:text-white"
              to={`/taches/${tache?.id}`}
            >
              {tache?.libelle && (
                <LibelleFormat lenght={40} libelle={tache.libelle} />
              )}
            </Link>
            <p className="text-xs text-gray-700 hover:text-gray-800 dark:text-gray-400 ">
              {tache?.description && (
                <DescriptionFormat
                  lenght={50}
                  description={tache.description}
                />
              )}
            </p>
          </div>
          {/* Avatars */}
          <div className="flex items-center space-x-2">
            <div className="flex -space-x-3 -ml-0.5">
              {loading ? (
                <SpinnerLoading />
              ) : (
                <>
                  {responsables.slice(0, 4).map((responsable) => (
                    <span key={responsable.id}>
                      <Avatar
                        name={`${responsable.nom} ${responsable.prenom}`}
                        round={true}
                        size="20"
                        src={responsable.photoProfileLien} // Le lien de l'image
                      />
                    </span>
                  ))}
                </>
              )}
            </div>
            <>
              {responsables.length > 4 && (
                <div className="text-xs italic font-medium text-gray-400 dark:text-gray-500">
                  +{responsables.length - 4}
                </div>
              )} 
            </>
          </div>
        </div>
        {/* Timeline element */}
        <div aria-hidden="true">
          <div className="absolute top-0.5 -bottom-1 left-0.5 ml-px w-0.5 bg-gray-200 dark:bg-gray-700" />
          <div className="absolute top-0.5 left-0 -ml-0.5 w-3 h-3 rounded-full bg-gray-400 dark:bg-gray-500 border-2 border-white dark:border-gray-800" />
        </div>
      </li>
    </>
  );
}

export default ServicesAdminTache;

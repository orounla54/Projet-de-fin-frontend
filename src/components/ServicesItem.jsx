import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import LibelleFormat from "./LibelleFormat";
import DescriptionFormat from "./DescriptionFormat";
import DateRefactor1 from "./DateRefactor1";

function ServicesItem({ service, setServicesCurrentIdInfo, servicesCurrentIdInfo, element }) {
  const [serviceJson, setServiceJson] = useState({
    postes: [],
    responsables: [],
  });

  useEffect(() => {
    try {
      // Conversion des chaînes JSON en objets
      const postesJson = service.postes ? JSON.parse(service.postes) : [];
      const responsablesJson = service.responsables
        ? JSON.parse(service.responsables)
        : [];

      // Mise à jour de l'état avec les données converties
      setServiceJson({ postes: postesJson, responsables: responsablesJson });
    } catch (error) {
      console.error("Erreur lors de la conversion JSON :", error);
    }
    console.log(serviceJson);
  }, [service]);

  return (
    <div>
      <article className="p-5 m-3 bg-white shadow-sm dark:bg-gray-800 rounded-xl">
        <div className="flex space-x-4 flex-start">
          {/* Content */}
          <div className="grow">
            {/* Title */}
            <h2 className="mb-2 font-semibold text-gray-800 dark:text-gray-100">
              {service?.libelle ? (
                <Link to={`/administration/services/${service?.id || ""}`}>
                  <LibelleFormat lenght={60} libelle={service.libelle} />
                </Link>
              ) : (
                ""
              )}
            </h2>
            {service?.description ? (
              <p className="mb-2 text-xs text-gray-800 dark:text-gray-400">
                <DescriptionFormat description={service.description} />
              </p>
            ) : (
              ""
            )}
            {/* Footer */}
            <footer className="flex flex-wrap text-sm">
              <div className="flex items-center after:block after:content-['·'] last:after:content-[''] after:text-sm after:text-gray-400 dark:after:text-gray-600 after:px-2">
                <button
                  onClick={() => {
                    setServicesCurrentIdInfo(service.id);
                  }}
                  className={`font-medium ${
                    servicesCurrentIdInfo === service.id
                      ? "text-violet-500 hover:text-violet-600 dark:hover:text-violet-400"
                      : "text-gray-500 hover:text-gray-600 dark:hover:text-gray-400"
                  } `}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-5"
                  >
                    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                    <path
                      fillRule="evenodd"
                      d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
              <div className="flex items-center after:block after:content-['·'] last:after:content-[''] after:text-sm after:text-gray-400 dark:after:text-gray-600 after:px-2">
                <span className="flex items-center gap-1 text-gray-400">
                  {serviceJson?.responsables?.length || 0} Responable(s) 🧑‍💻
                </span>
              </div>
              {element === "services" && (
                <div className="flex items-center after:block after:content-['·'] last:after:content-[''] after:text-sm after:text-gray-400 dark:after:text-gray-600 after:px-2">
                  <span className="text-gray-400">
                    {serviceJson?.postes?.length || 0} Poste(s)💼
                  </span>
                </div>
              )}
              {service?.dateInscription ? (
                <>
                  <div className="flex items-center after:block after:content-['·'] last:after:content-[''] after:text-sm after:text-gray-400 dark:after:text-gray-600 after:px-2">
                    <span className="font-semibold text-gray-400">
                      {<DateRefactor1 date={service?.dateInscription} />}
                    </span>
                  </div>
                </>
              ) : (
                ""
              )}
            </footer>
          </div>
        </div>
      </article>
    </div>
  );
}

export default ServicesItem;

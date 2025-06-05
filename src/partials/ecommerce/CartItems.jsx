import React from "react";
import SpinnerLoading from "../../components/SpinnerLoading";
import { Link } from "react-router-dom";
import AlertBadge from "../../components/AlertBadge";
import NewBadge from "../../components/NewBadge";
import LibelleFormat from "../../components/LibelleFormat";
import DescriptionFormat from "../../components/DescriptionFormat";

function CartItems({
  taches,
  loading,
  error,
  setItemClicked,
  itemClicked,
  tacheSelected,
  tacheLoading,
  loadingSwitch
}) {
  const currentTime = new Date().getTime() / 1000;
  const conditionAffAlert = (tache) => {
    return (
      new Date(tache.deadline).getTime() / 1000 < currentTime &&
      tache.idStatusTache !== "Terminé"
    );
  };

  return (
    <>
      <ul className="">
        {error ? (
          <span className="text-center text-red-500">
            {"Erreur lors de la récupération des données."}
          </span>
        ) : loading || loadingSwitch ? (
          <span className="text-center">
            <SpinnerLoading />
          </span>
        ) : taches.length === 0 ? (
          <span className="text-center text-gray-500">
            Aucune tâche de ce type trouvé.
          </span>
        ) : (
          taches.map((tache) => (
            <li
              key={tache.id}
              className="sm:flex gap-1 items-center border-b border-gray-200 dark:border-gray-700/ relative "
            >
              {itemClicked === tache.id ? (
                <></>
              ) : (
                <>
                  <input
                    onClick={() => {
                      setItemClicked(null);
                      setItemClicked(tache.id);
                    }}
                    checked={itemClicked === tache.id ? true : false}
                    type="checkbox"
                    className={`w-0.5/12 cursor-pointer rounded-full bg-slate-200 dark:bg-gray-500 border-none top-10 left-1 absolute `}
                  />
                </>
              )}

              <div
                className={`grow pl-6 p-3 ${
                  itemClicked === tache.id
                    ? " rounded-lg bg-gray-50 dark:bg-slate-800  dark:my-2"
                    : ""
                }`}
              >
                <Link to={`/taches/${tache.id}`}>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1">
                    <LibelleFormat libelle={tache.libelle} />
                  </h3>
                </Link>
                <div className="text-sm mb-2">
                  {tache.description ? (
                    <DescriptionFormat description={tache.description} />
                  ) : (
                    "Aucune description ajoutée pour cette tache.."
                  )}
                </div>
                <br />
                {/* Product meta */}
                <div className="flex flex-wrap justify-between items-center">
                  {/* Example attributes like priority, deadline, etc. */}
                  <div className="flex flex-wrap items-center space-x-2 mr-2">
                    {tacheLoading ? (
                      <SpinnerLoading />
                    ) : itemClicked === tache?.id ? (
                      <div>
                        {tacheSelected.important === 1 && (
                          <div className="inline-flex text-xs font-medium bg-yellow-500/20 text-yellow-700 rounded-full text-center px-2 py-0.5">
                            Important
                          </div>
                        )}
                        {tacheSelected.urgent === 1 && (
                          <div className="inline-flex text-xs font-medium bg-red-500/20 text-red-700 rounded-full text-center px-2 py-0.5">
                            Urgent
                          </div>
                        )}
                        {tacheSelected.private === 1 && (
                          <div className="inline-flex text-xs font-medium bg-blue-500/20 text-blue-700 rounded-full text-center px-2 py-0.5">
                            Privé
                          </div>
                        )}
                      </div>
                    ) : (
                      <div>
                        {tache.important === 1 && (
                          <div className="inline-flex text-xs font-medium bg-yellow-500/20 text-yellow-700 rounded-full text-center px-2 py-0.5">
                            Important
                          </div>
                        )}
                        {tache.urgent === 1 && (
                          <div className="inline-flex text-xs font-medium bg-red-500/20 text-red-700 rounded-full text-center px-2 py-0.5">
                            Urgent
                          </div>
                        )}
                        {tache.private === 1 && (
                          <div className="inline-flex text-xs font-medium bg-blue-500/20 text-blue-700 rounded-full text-center px-2 py-0.5">
                            Privé
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="absolute top-2 right-3">
                <div className="flex">
                  {tache.newTaches === 1 && (
                    <>
                      <NewBadge />
                    </>
                  )}
                  {conditionAffAlert(tache) && tache.deadline ? (
                    <AlertBadge />
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </li>
          ))
        )}
      </ul>
    </>
  );
}

export default CartItems;

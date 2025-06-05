import React, { useState, useEffect } from "react";
import SpinnerLoading from "../components/SpinnerLoading";
import TacheItem from "./TacheItem";

function TachesTable({
  selectedItems,
  taches,
  loading,
  refresh,
  error,
  handleSelectAll,
  selectAll,
  isCheck,
  setIsCheck,
  setSelectAll,
}) {
  const handleClick = (e) => {
    const { id, checked } = e.target;
    const itemId = parseInt(id, 10); // Conversion en nombre pour garantir la compatibilité

    setSelectAll(false);
    setIsCheck((prevCheck) =>
      checked
        ? [...prevCheck, itemId]
        : prevCheck.filter((item) => item !== itemId)
    );
  };

  useEffect(() => {
    selectedItems(isCheck);
  }, [isCheck]);

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl relative">
      <header className="px-5 py-4">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">
          Taches trouvées
        </h2>
      </header>
      <div>
        {/* Table */}
        <div className="overflow-x-auto ">
          <table className="table-auto text-center w-full dark:text-gray-300">
            {/* Table header */}
            <thead className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20 border-t border-b border-gray-100 dark:border-gray-700/60">
              <tr>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-px">
                  <div className="flex items-center">
                    <label className="inline-flex">
                      <span className="sr-only">Tout selectionner</span>
                      <input
                        className="form-checkbox"
                        type="checkbox"
                        checked={selectAll}
                        onChange={handleSelectAll}
                      />
                    </label>
                  </div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap text-center">
                  <div className="font-semibold text-left">Libelle</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap text-center">
                  <div className="font-semibold text-left">
                    Type de la tache
                  </div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap text-center">
                  <div className="font-semibold text-center">
                    Responsable(s)
                  </div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-center">Date d'ajout</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-center">
                    Date prise de décision
                  </div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-center">Date début</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-center">Date fin</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-center">Deadline</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-center">Status</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-center">Actions</div>
                </th>
              </tr>
            </thead>
            {/* Table body */}
            <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700/60">
              {error ? (
                <tr>
                  <td colSpan="4" className="text-center text-red-500">
                    {"Erreur lors de la récupération des données."}
                  </td>
                </tr>
              ) : loading ? (
                <tr>
                  <td colSpan="9" className="text-center">
                    <SpinnerLoading />
                  </td>
                </tr>
              ) : taches.length === 0 ? (
                <tr>
                  <td colSpan="9" className="p-4 text-center text-violet-400">
                    Aucun resultat pour les parametres entrer...
                  </td>
                </tr>
              ) : (
                (Array.isArray(taches) ? taches : []).map((tache) => (
                  <TacheItem
                    id={tache.id}
                    key={tache.id}
                    libelle={tache.libelle}
                    typeTache={tache.typeTache}
                    Responsables={tache.Responsables}
                    dateInscription={tache.dateInscription}
                    datePriseDecision={tache.datePriseDecision}
                    dateDebut={tache.dateDebut}
                    dateFin={tache.dateFin}
                    deadline={tache.deadline}
                    status={tache.status}
                    newTache={tache.newTache}
                    refresh={refresh}
                    handleClick={handleClick}
                    isChecked={isCheck.includes(tache.id)}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TachesTable;

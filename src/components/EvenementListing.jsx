import React, { useState, useEffect } from "react";
import SpinnerLoading from "../components/SpinnerLoading";
import EvenementsItems from "./EvenementsItems";
import DeleteButton from "../partials/actions/DeleteButton";

function EvenementListing({
  selectedItems,
  events,
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
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl relative col-span-12 mt-8">
      <header className="px-5 py-4 flex justify-between items-center">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">
          Evenements trouvées
        </h2>
       
      </header>
      <div>
        {/* Table */}
        <div className="overflow-x-auto ">
          <table className="table-auto w-full dark:text-gray-300">
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
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Libelle</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold  text-left">
                    Type d'evenement
                  </div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap ">
                  <div className="font-semibold  text-left">Ajouter par</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold  text-center">Date d'ajout</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold  text-center">Date</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold center">Status</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold center">Actions</div>
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
              ) : (
                events.map((event) => (
                  <EvenementsItems
                    id={event.id}
                    key={event.id}
                    libelle={event.eventName}
                    type={event.enventType}
                    creer_par={event.creer_par}
                    dateInscription={event.dateInscription}
                    date={event.eventStart}
                    status={event.status}
                    refresh={refresh}
                    handleClick={handleClick}
                    isChecked={isCheck.includes(event.id)}
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

export default EvenementListing;

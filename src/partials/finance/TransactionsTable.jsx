import React, { useState, useEffect } from "react";
import TransactionItem from "./TransactionsTableItem";

function TransactionsTable({
  selectedItems,
  taches,
  fetchData,
  error,
  handleSelectAll,
  selectAll,
  isCheck,
  setIsCheck,
  setSelectAll,
}) {
  const handleClick = (e) => {
    const { id, checked } = e.target;
    setSelectAll(false);
    setIsCheck([...isCheck, parseInt(id)]);
    if (!checked) {
      setIsCheck(isCheck.filter((item) => item !== parseInt(id)));
    }
  };

  useEffect(() => {
    selectedItems(isCheck);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCheck]);

  return (
    <div className="bg-white dark:bg-gray-900">
      <div>
        {/* Table */}
        <div className="overflow-x-auto ">
          <table className="table-auto w-full dark:text-gray-300">
            {/* Table header */}
            <thead className="text-xs font-semibold uppercase text-gray-500 border-t border-b border-gray-200 dark:border-gray-700/60">
              <tr>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-px">
                  <div className="flex items-center">
                    <label className="inline-flex">
                      <span className="sr-only">Tout Selectionner</span>
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
                  <div className="font-semibold text-left">
                    Libelle & Description
                  </div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Date d'ajout</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">
                    Type d'evenement
                  </div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-right">Actions</div>
                </th>
              </tr>
            </thead>
            {/* Table body */}
            <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700/60 border-b border-gray-200 dark:border-gray-700/60">
              {error ? (
                <tr>
                  <td colSpan="5" className="text-center text-xs text-red-500">
                    Erreur lors de la récupération des données.
                  </td>
                </tr>
              ) : taches.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-xs text-violet-400">
                    Aucune tache trouver...
                  </td>
                </tr>
              ) : (
                taches.map((tache) => (
                  <TransactionItem
                    key={tache.id}
                    id={tache.id}
                    libelle={tache.libelle}
                    description={tache.description}
                    dateInscription={tache.dateInscription}
                    status={tache.status}
                    enventType={tache.enventType}
                    handleClick={handleClick}
                    isChecked={isCheck.includes(tache.id)}
                    fetchData={fetchData}
                    tache={tache}
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

export default TransactionsTable;

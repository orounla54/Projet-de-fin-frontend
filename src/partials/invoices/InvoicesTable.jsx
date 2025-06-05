import React, { useState, useEffect } from "react";
import Invoices from "./InvoicesTableItem";
import SpinnerLoading from "../../components/SpinnerLoading";

function InvoicesTable({
  selectedItems,
  projets,
  loading,
  refreshList,
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
          Projets trouvés
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
              {error && (
                <tr>
                  <td colSpan="9" className="text-center text-red-500">
                    {"Erreur lors de la récupération des données."}
                  </td>
                </tr>
              )}

              {projets.length === 0 && (
                <tr className="">
                  <td colSpan="9" className="p-4 text-center text-violet-400">
                    Aucun resultat pour les parametres entrer...
                  </td>
                </tr>
              )}

              {loading ? (
                <tr>
                  <td colSpan="9" className="text-center">
                    <SpinnerLoading />
                  </td>
                </tr>
              ) : (
                projets.map((projet) => (
                  <Invoices
                    id={projet.id}
                    key={projet.id}
                    libelle={projet.libelle}
                    dateInscription={projet.dateInscription}
                    datePriseDecision={projet.datePriseDecision}
                    dateDebut={projet.dateDebut}
                    dateFin={projet.dateFin}
                    deadline={projet.deadline}
                    status={projet.status}
                    newProjet={projet.newProjet}
                    handleClick={handleClick}
                    isChecked={isCheck.includes(projet.id)}
                    refreshList={refreshList}
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

export default InvoicesTable;

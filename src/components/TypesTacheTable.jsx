import React, { useState, useEffect } from "react";
import SpinnerLoading from "./SpinnerLoading";
import TypeTacheItem from "./TypeTacheItem";

function TypesTacheTable({ selectedItems, typesTache, loading, error, refreshList }) {
  const [selectAll, setSelectAll] = useState(false);
  const [isCheck, setIsCheck] = useState([]);

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    setIsCheck(!selectAll ? typesTache.map((projet) => projet.id) : []);
  };

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
  }, [isCheck, selectedItems]);

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl relative">
      <header className="px-5 py-4">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">
         
          Types de tache trouvés
        </h2>
      </header>
      <div>
        {/* Table */}
        <div className="overflow-x-auto ">
          <table className="table-auto text-center w-full dark:text-gray-300">
            {/* Table header */}
            <thead className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20 border-t border-b border-gray-100 dark:border-gray-700/60">
              <tr>
                {/* <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-px">
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
                </th> */}
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap text-center">
                  <div className="font-semibold text-left">Libelle</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Date d'ajout</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Actions</div>
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
                  <td colSpan="4" className="text-center">
                    <SpinnerLoading />
                  </td>
                </tr>
              ) : typesTache.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center text-gray-500">
                    Aucun type de tâche trouvé.
                  </td>
                </tr>
              ) : (
                typesTache.map((projet) => (
                  <TypeTacheItem
                    id={projet.id}
                    key={projet.id}
                    libelle={projet.libelle}
                    dateInscription={projet.dateInscription}
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

export default TypesTacheTable;

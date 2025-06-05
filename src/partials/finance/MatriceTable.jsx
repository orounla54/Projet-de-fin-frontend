import React, { useState, useEffect } from "react";
import MatriceItem from "./MatriceItem";
import SpinnerLoading from "../../components/SpinnerLoading";

function MatriceTable({
  selectedItems,
  items,
  error,
  handleSelectAll,
  selectAll,
  isCheck,
  setIsCheck,
  setSelectAll,
  loading,
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
          <table className="w-full table-auto dark:text-gray-300">
            {/* Table header */}
            <thead className="text-xs font-semibold text-gray-500 uppercase border-t border-b border-gray-200 dark:border-gray-700/60">
              <tr>
                <th className="w-px px-2 py-3 first:pl-5 last:pr-5 whitespace-nowrap">
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
                <th className="px-2 py-3 first:pl-5 last:pr-5 whitespace-nowrap">
                  <div className="font-semibold text-left">Evolution</div>
                </th>
                <th className="px-2 py-3 first:pl-5 last:pr-5 whitespace-nowrap">
                  <div className="font-semibold text-left">Status</div>
                </th>
                <th className="px-2 py-3 first:pl-5 last:pr-5 whitespace-nowrap">
                  <div className="font-semibold text-left">
                    PLAN STRATEGIQUE
                  </div>
                </th>
                <th className="px-2 py-3 first:pl-5 last:pr-5 whitespace-nowrap">
                  <div className="font-semibold text-left">AXES</div>
                </th>
                <th className="px-2 py-3 first:pl-5 last:pr-5 whitespace-nowrap">
                  <div className="font-semibold text-left">
                    OBJECTIFS STRATEGIQUE
                  </div>
                </th>
                <th className="px-2 py-3 first:pl-5 last:pr-5 whitespace-nowrap">
                  <div className="font-semibold text-left">MESURES</div>
                </th>
                <th className="px-2 py-3 first:pl-5 last:pr-5 whitespace-nowrap">
                  <div className="font-semibold text-left">
                    OBJECTIF OPERATIONNEL
                  </div>
                </th>
                <th className="px-2 py-3 first:pl-5 last:pr-5 whitespace-nowrap">
                  <div className="font-semibold text-left">CODE PRIORITE</div>
                </th>
                <th className="px-2 py-3 first:pl-5 last:pr-5 whitespace-nowrap">
                  <div className="font-semibold text-left">PRIORITE</div>
                </th>
                <th className="px-2 py-3 first:pl-5 last:pr-5 whitespace-nowrap">
                  <div className="font-semibold text-left">
                    TYPE DE PRIORITE
                  </div>
                </th>
                <th className="px-2 py-3 first:pl-5 last:pr-5 whitespace-nowrap">
                  <div className="font-semibold text-left">
                    NOMBRE TACHES TERMINEES
                  </div>
                </th>
                <th className="px-2 py-3 first:pl-5 last:pr-5 whitespace-nowrap">
                  <div className="font-semibold text-left">Responsables</div>
                </th>
                <th className="px-2 py-3 first:pl-5 last:pr-5 whitespace-nowrap">
                  <div className="font-semibold text-left">
                    Services responsable
                  </div>
                </th>
              </tr>
            </thead>
            {/* Table body */}
            <tbody className="text-sm border-b border-gray-200 divide-y divide-gray-100 dark:divide-gray-700/60 dark:border-gray-700/60">
              {loading ? (
                <tr>
                  <td colSpan="12" className="p-4 text-center">
                    <div className="flex items-center justify-center">
                      <SpinnerLoading />
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan="12"
                    className="p-4 text-xs text-center text-red-500"
                  >
                    Erreur lors de la récupération des données.
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td
                    colSpan="12"
                    className="p-4 text-xs text-center text-violet-400"
                  >
                    Aucun élément trouvé...
                  </td>
                </tr>
              ) : (
                items.map((item, index) => (
                  <MatriceItem
                    key={index}
                    id={item.id}
                    status={item.status}
                    planStrategique={item.planStrategique}
                    axe={item.axe}
                    objectifs_Strategiques={item.objectifs_Strategiques}
                    mesures={item.mesures}
                    objectifs_Operationnels={item.objectifs_Operationnels}
                    idPriorites={item.idPriorites}
                    priorites={item.priorites}
                    codePriorites={item.codePriorites}
                    nombreTachePriorites={item.nombreTachePriorites}
                    typePriorites={item.typePriorites}
                    handleClick={handleClick}
                    isChecked={isCheck.includes(item.id)}
                    progress={item.progress}
                    responsables={item.responsables}
                    services={item.services}
                    nombreTachesAjoutées={item.nombreTachesAjoutées}
                    nombreTachesTerminees={item.nombreTachesTerminees}
                    
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

export default MatriceTable;

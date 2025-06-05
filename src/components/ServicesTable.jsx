import React, { useState, useEffect } from "react";
import ServicesTableItem from "./ServicesTableItem";

function ServicesTable({
  selectedItems,
  services,
  refreshList,
  handleSelectAll,
  selectAll,
  isCheck,
  setIsCheck,
  setSelectAll,
  servicesLength,
  element,
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
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl relative">
      <header className="px-5 py-4">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">
          {element === "services"
            ? "Services"
            : element === "postes"
            ? "Postes"
            : element === "positions"
            ? "Positions"
            : element === "roles tache"
            ? "Roles"
            : element === "roles plan"
            ? "Roles"
            : element === "type priorite"
            ? "Types"
            : "Categories"}{" "}
          <span className="text-gray-400 dark:text-gray-500 font-medium">
            {servicesLength}
          </span>
        </h2>
      </header>
      <div>
        {/* Table */}
        <div className="overflow-x-auto">
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
                {element !== "categories" ||
                  element !== "roles tache" ||
                  element !== "roles plan" ||
                  (element !== "type priorite" && (
                    <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                      <div className="font-semibold text-left">Description</div>
                    </th>
                  ))}
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Date d'ajout</div>
                </th>

                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Action</div>
                </th>
              </tr>
            </thead>
            {/* Table body */}
            <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700/60">
              {services?.map((service) => {
                return (
                  <ServicesTableItem
                    key={service.id}
                    id={service.id}
                    element={element}
                    libelle={service.libelle}
                    description={service.description}
                    dateInscription={service.dateInscription}
                    handleClick={handleClick}
                    isChecked={isCheck.includes(service.id)}
                    refreshList={refreshList}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ServicesTable;

import React, { useState, useEffect } from "react";
import Customer from "./CustomersTableItem";


function CustomersTable({ sollicitations, current, fetchData }) {
  return (
    <div className="relative bg-white shadow-sm dark:bg-gray-800 rounded-xl">
      <header className="px-5 py-4">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">
          Sollicitations{" "}
          <span className="font-medium text-gray-400 dark:text-gray-500">
            {sollicitations?.length}
          </span>
        </h2>
      </header>
      <div>
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto dark:text-gray-300">
            {/* Table header */}
            <thead className="text-xs font-semibold text-gray-500 uppercase border-t border-b border-gray-100 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20 dark:border-gray-700/60">
              <tr>
                <th className="w-px px-2 py-3 first:pl-5 last:pr-5 whitespace-nowrap">
                  <span className="sr-only">Favourite</span>
                </th>
                <th className="px-2 py-3 first:pl-5 last:pr-5 whitespace-nowrap">
                  <div className="font-semibold text-left">Emetteur</div>
                </th>
                <th className="px-2 py-3 first:pl-5 last:pr-5 whitespace-nowrap">
                  <div className="font-semibold text-left">Email</div>
                </th>
                <th className="px-2 py-3 first:pl-5 last:pr-5 whitespace-nowrap">
                  <div className="font-semibold text-left">Libelle</div>
                </th>
                <th className="px-2 py-3 first:pl-5 last:pr-5 whitespace-nowrap">
                  <div className="font-semibold">Status</div>
                </th>
                <th className="px-2 py-3 first:pl-5 last:pr-5 whitespace-nowrap">
                  <div className="font-semibold text-left"></div>
                </th>
                <th className="px-2 py-3 first:pl-5 last:pr-5 whitespace-nowrap">
                  <div className="font-semibold text-left">Date d'ajout</div>
                </th>
                <th className="px-2 py-3 first:pl-5 last:pr-5 whitespace-nowrap">
                  <span className="sr-only">Menu</span>
                </th>
                <th className="px-2 py-3 first:pl-5 last:pr-5 whitespace-nowrap">
                  <span className="sr-only"></span>
                </th>
              </tr>
            </thead>
            {/* Table body */}
            <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700/60">
              {current && current.length > 0 ? (
                <>
                  {current.length > 0 &&
                    current.map((sollicitation) => (
                      <Customer
                        key={sollicitation.id}
                        id={sollicitation.id}
                        image={sollicitation?.responsable?.image}
                        name={`${sollicitation?.responsable?.nom} ${sollicitation?.responsable?.prenom}`}
                        email={sollicitation?.responsable?.email}
                        dateInscription={sollicitation?.dateInscription}
                        status={sollicitation?.status}
                        new={sollicitation?.new}
                        satisfaire={sollicitation?.satisfaire}
                        libelle={sollicitation?.libelle}
                        description={sollicitation?.description}
                        important={sollicitation?.important}
                        urgent={sollicitation?.urgent}
                        sollicitation={sollicitation}
                        fetchData={fetchData}
                      />
                    ))}
                </>
              ) : (
                <>
                  <tr>
                    <td
                      colSpan={9}
                      className="px-2 py-3 text-xs text-center first:pl- 5 last:pr-5 whitespace-nowrap"
                    >
                      Aucune sollicitation😣
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default CustomersTable;

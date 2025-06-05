import React, { useState } from "react";

import LibelleFormat from "./LibelleFormat";
import ImportantBadge from "./ImportantBadge";
import UrgentBagde from "./UrgentBagde";
import { Link, useNavigate } from "react-router-dom";

function TachesItem(props) {
  const navigate = useNavigate();

  const navigateToTache = (idTache) => {
    navigate(`/taches/${idTache}`)
  }
  return (
    <>
      {/* Group 1 */}
      <div>
        <div className="space-y-2">
          {/* Task */}
          <div
            className="bg-white flex items-center dark:bg-gray-800 shadow-sm rounded-xl p-4 "
          >
            <div className="sm:flex sm:justify-between sm:items-start">
              {/* Left side */}
              <div className="grow mt-0.5 mb-3 sm:mb-0 space-y-3">
                <div className="flex items-center">
                  {/* Drag span */}
                  <span className="cursor-move mr-2">
                    <span className="sr-only">Drag</span>
                    <svg
                      className="w-3 h-3 fill-gray-400 dark:fill-gray-500"
                      viexbox="0 0 12 12"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0 1h12v2H0V1Zm0 4h12v2H0V5Zm0 4h12v2H0V9Z"
                        fillRule="evenodd"
                      />
                    </svg>
                  </span>
                  {/* Checkbox span */}
                    <button onClick={() => navigateToTache(props.id)} className="text-sm text-gray-800 dark:text-gray-100 peer-checked:line-through ml-2">
                      {" "}
                      {props.libelle && props.libelle.length > 30
                        ? `${props.libelle.slice(0, 30)}...`
                        : props.libelle}
                    </button>
                    
                </div>
              </div>
              {/* Right side */}
              <div className="flex items-center justify-end ml-4">
                {/* Like span */}
                <div className="flex items-center justify-center space-x-1 ">
                  {props.important && <ImportantBadge />}
                  {props.urgent && <UrgentBagde />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TachesItem;

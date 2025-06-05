import React, { useState } from "react";
import DangerModal from "../../components/DangerModal";
import AddTachesEvenementsDefaut from "../../components/AddTachesEvenementsDefaut";
import CircleProgress from "../../charts/CircleProgress";
import LibelleFormat from "../../components/LibelleFormat";
import Avatar from "react-avatar";
import { Link } from "react-router-dom";

function MatriceItem(props) {
  const statusColor = (status) => {
    switch (status) {
      case "Terminé":
        return "bg-green-500/20 text-green-700";
      case "En-cours":
        return "bg-yellow-500/20 text-yellow-700";
      default:
        return "bg-gray-400/20 text-gray-500 dark:text-gray-400";
    }
  };

  return (
    <tr>
      <td className="w-px px-2 py-3 first:pl-5 last:pr-5 whitespace-nowrap">
        <div className="flex items-center">
          <label className="inline-flex">
            <span className="sr-only">Select</span>
            <input
              id={props.id}
              className="form-checkbox"
              type="checkbox"
              onChange={props.handleClick}
              checked={props.isChecked}
            />
          </label>
        </div>
      </td>
      <td className="px-2 py-3 first:pl-5 last:pr-5 whitespace-nowrap md:w-1/2">
        <div className={`flex items-center`}>
          <CircleProgress width="40" height="40" value={props.progress} />
        </div>
      </td>
      <td className="px-2 py-3 first:pl-5 last:pr-5 whitespace-nowrap">
        <div
          className={`text-xs inline-flex rounded-full text-center px-2 py-1 ${statusColor(
            props.status
          )}`}
        >
          {props.status}
        </div>
      </td>
      <td className="w-px px-2 py-3 font-semibold first:pl-5 last:pr-5 whitespace-nowrap text-violet-400">
        {props?.planStrategique || ""}
      </td>
      <td className="w-px px-2 py-3 font-semibold first:pl-5 last:pr-5 whitespace-nowrap text-violet-400">
        {props?.axe || ""}
      </td>
      <td className="w-px px-2 py-3 font-semibold first:pl-5 last:pr-5 whitespace-nowrap text-violet-400">
        {props?.objectifs_Strategiques || ""}
      </td>
      <td className="w-px px-2 py-3 font-semibold first:pl-5 last:pr-5 whitespace-nowrap text-violet-400">
        {props?.mesures || ""}
      </td>
      <td className="w-px px-2 py-3 font-semibold first:pl-5 last:pr-5 whitespace-nowrap text-violet-400">
        {props?.objectifs_Operationnels || ""}
      </td>
      <td className="w-px px-2 py-3 first:pl-5 last:pr-5 whitespace-nowrap">
        {props?.codePriorites || ""}
      </td>
      <td className="w-px px-2 py-3 font-semibold fontse first:pl-5 last:pr-5 whitespace-nowrap">
        <Link to={`/plans/manage/priorites/${props?.idPriorites}`}>
          {props?.priorites || ""}
        </Link>
      </td>
      <td className="w-px px-2 py-3 first:pl-5 last:pr-5 whitespace-nowrap">
        {props?.typePriorites || ""}
      </td>
      <td className="w-px px-2 py-3 first:pl-5 last:pr-5 whitespace-nowrap">
        {props?.nombreTachesAjoutées > 0 ? (
          <div className="flex items-center ml-3 text-gray-400 dark:text-gray-500 ">
            <svg
              className={`shrink-0 fill-current mr-1.5 ${
                props?.nombreTachesAjoutées === props?.nombreTachesTerminees
                  ? "text-green-500 dark:text-green-400"
                  : "text-gray-500 dark:text-gray-400"
              } text-xs`}
              width="14"
              height="14"
              viewBox="0 0 16 16"
            >
              <path d="M6.974 14c-.3 0-.7-.2-.9-.5l-2.2-3.7-2.1 2.8c-.3.4-1 .5-1.4.2-.4-.3-.5-1-.2-1.4l3-4c.2-.3.5-.4.9-.4.3 0 .6.2.8.5l2 3.3 3.3-8.1c0-.4.4-.7.8-.7s.8.2.9.6l4 8c.2.5 0 1.1-.4 1.3-.5.2-1.1 0-1.3-.4l-3-6-3.2 7.9c-.2.4-.6.6-1 .6z" />
            </svg>
            <div
              className={`text-gray-500 dark:text-gray-400 ${
                props?.nombreTachesAjoutées === props?.nombreTachesTerminees
                  ? "text-green-500 dark:text-green-400"
                  : "text-gray-500 dark:text-gray-400"
              } text-xs`}
            >
              {props?.nombreTachesTerminees}/{props?.nombreTachesAjoutées}
            </div>
          </div>
        ) : (
          <span className="text-xs font-semibold text-center">
            Aucune tache ajoutée{" "}
          </span>
        )}
      </td>
      <td className="flex items-center w-px gap-1 px-2 py-3 first:pl-5 last:pr-5 whitespace-nowrap">
        <div className="flex -ml-px -space-x-2 sm:ml-4">
          {props.responsables.length === 1 ? (
            <div className="relative flex items-center gap-2">
              {props.responsables[0].role === "Pilote" && (
                <svg
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="absolute -top-1 -left-1.5 size-3 fill-blue-500"
                >
                  <path
                    fillRule="evenodd"
                    d="M15 8c0 .982-.472 1.854-1.202 2.402a2.995 2.995 0 0 1-.848 2.547 2.995 2.995 0 0 1-2.548.849A2.996 2.996 0 0 1 8 15a2.996 2.996 0 0 1-2.402-1.202 2.995 2.995 0 0 1-2.547-.848 2.995 2.995 0 0 1-.849-2.548A2.996 2.996 0 0 1 1 8c0-.982.472-1.854 1.202-2.402a2.995 2.995 0 0 1 .848-2.547 2.995 2.995 0 0 1 2.548-.849A2.995 2.995 0 0 1 8 1c.982 0 1.854.472 2.402 1.202a2.995 2.995 0 0 1 2.547.848c.695.695.978 1.645.849 2.548A2.996 2.996 0 0 1 15 8Zm-3.291-2.843a.75.75 0 0 1 .135 1.052l-4.25 5.5a.75.75 0 0 1-1.151.043l-2.25-2.5a.75.75 0 1 1 1.114-1.004l1.65 1.832 3.7-4.789a.75.75 0 0 1 1.052-.134Z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              <Avatar
                name={`${props.responsables[0].nom} ${props.responsables[0].prenom}`}
                round={true}
                size="24"
                src={props.responsables[0].image} // Le lien de l'image
              />
              <span className="text-sm font-medium">
                {props.responsables[0].nom} {props.responsables[0].prenom}
              </span>
            </div>
          ) : (
            <div className="flex">
              {props.responsables.slice(0, 3).map((responsable) => (
                <span className="relative" key={responsable.id}>
                  {responsable.role === "Pilote" && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      className="absolute -top-1 -left-1.5 size-3 fill-blue-500"
                    >
                      <path
                        fillRule="evenodd"
                        d="M15 8c0 .982-.472 1.854-1.202 2.402a2.995 2.995 0 0 1-.848 2.547 2.995 2.995 0 0 1-2.548.849A2.996 2.996 0 0 1 8 15a2.996 2.996 0 0 1-2.402-1.202 2.995 2.995 0 0 1-2.547-.848 2.995 2.995 0 0 1-.849-2.548A2.996 2.996 0 0 1 1 8c0-.982.472-1.854 1.202-2.402a2.995 2.995 0 0 1 .848-2.547 2.995 2.995 0 0 1 2.548-.849A2.995 2.995 0 0 1 8 1c.982 0 1.854.472 2.402 1.202a2.995 2.995 0 0 1 2.547.848c.695.695.978 1.645.849 2.548A2.996 2.996 0 0 1 15 8Zm-3.291-2.843a.75.75 0 0 1 .135 1.052l-4.25 5.5a.75.75 0 0 1-1.151.043l-2.25-2.5a.75.75 0 1 1 1.114-1.004l1.65 1.832 3.7-4.789a.75.75 0 0 1 1.052-.134Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  <Avatar
                    name={`${responsable.nom} ${responsable.prenom}`}
                    round={true}
                    size="24"
                    src={responsable.image} // Le lien de l'image
                  />
                </span>
              ))}
            </div>
          )}
        </div>
        {/* Nombre restant de responsables */}
        {props.responsables.length > 3 && (
          <div className="text-xs italic font-medium text-gray-400 dark:text-gray-500">
            +{props.responsables.length - 3}
          </div>
        )}
      </td>
      <td className="w-px px-2 py-3 first:pl-5 last:pr-5 whitespace-nowrap">
        {props.services && props.services.length > 0 && (
          <div className="mt-2 text-xs font-semibold text-violet-400">
            <LibelleFormat length={50} libelle={props.service} />
            {props.services.map((service, index) => (
              <span key={service.id}>
                {service.service}
                {index < props.services.length - 1 && ", "}
              </span>
            ))}
          </div>
        )}
      </td>
    </tr>
  );
}

export default MatriceItem;

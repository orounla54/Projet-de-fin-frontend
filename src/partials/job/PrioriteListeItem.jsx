import React, { useState } from "react";
import { Link } from "react-router-dom";
import CircleProgress from "../../charts/CircleProgress";
import LibelleFormat from "../../components/LibelleFormat";
import DateRefactor1 from "../../components/DateRefactor1";
import DescriptionFormat from "../../components/DescriptionFormat";
import Avatar from "react-avatar";

function PrioriteListeItem(props) {
  const [open, setOpen] = useState(false);

  return (
    <tbody className="text-sm">
      <tr>
        <td className="px-2 py-3 first:pl-5 last:pr-5 whitespace-nowrap">
          <div className="flex items-center text-gray-800">
            <div className="flex items-center justify-center w-10 h-10 mr-2 rounded-full shrink-0 sm:mr-3">
              <CircleProgress width="55" height="55" value={props.progress} />
            </div>
            <Link
              className="inline-flex font-semibold text-gray-800 dark:text-gray-100"
              to={`/plans/manage/priorites/${props?.id}`}
            >
              <LibelleFormat lenght={70} libelle={props.libelle} />
            </Link>
          </div>
        </td>

        <td className="px-2 py-3 first:pl-5 last:pr-5 whitespace-nowrap">
          <div className="font-semibold text-left">{props?.code || "Rien"}</div>
        </td>
        <td className="px-2 py-3 first:pl-5 last:pr-5 whitespace-nowrap">
          <div className="text-left">{props?.typePriorite || "Rien"}</div>
        </td>
        <td className="px-2 py-3 first:pl-5 last:pr-5 whitespace-nowrap">
          <div className="font-semibold text-left text-violet-600 dark:text-violet-400">
            {props?.objectifOperationnel || "Rien"}
          </div>
        </td>
        <td className="px-2 py-3 first:pl-5 last:pr-5 whitespace-nowrap">
          <div className="flex -ml-px -space-x-3 sm:ml-4">
            {props.responsables.map((responsable) => (
              <span className={`relative`} key={responsable.id}>
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
        </td>
        <td className="px-2 py-3 first:pl-5 last:pr-5 whitespace-nowrap">
          <div className="flex gap-1 text-left">
            {" "}
            {props?.services && props.services.length > 0 && (
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
          </div>
        </td>
        <td className="px-2 py-3 first:pl-5 last:pr-5 whitespace-nowrap">
          <div className="text-left">
            {" "}
            <DateRefactor1 date={props.dateInscription} />
          </div>
        </td>
        <td className="px-2 py-3 first:pl-5 last:pr-5 whitespace-nowrap">
          <div className="flex gap-1 text-left">
            {props.new === 1 && (
              <div
                className={`text-xs bg-green-500/20 text-green-700 inline-flex font-medium rounded-full text-center  px-2 py-1 `}
              >
                Nouveau
              </div>
            )}
            {props.status && (
              <div
                className={`text-xs inline-flex rounded-full text-center px-2.5 py-1 ${
                  props.status === "En-cours"
                    ? "bg-yellow-500/20 text-yellow-700"
                    : props.status === "Terminé"
                    ? "bg-green-500/20 text-green-700"
                    : "bg-gray-500/20 text-gray-500 dark:text-gray-400"
                }`}
              >
                {props.status}
              </div>
            )}
          </div>
        </td>
        <td className="w-px px-2 py-3 first:pl-5 last:pr-5 whitespace-nowrap">
          <div className="flex items-center">
            <button
              className={`text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 ${
                open && "rotate-180"
              }`}
              aria-expanded={open}
              onClick={() => setOpen(!open)}
              aria-controls={`description-${props.id}`}
            >
              <span className="sr-only">Menu</span>
              <svg className="w-8 h-8 fill-current" viewBox="0 0 32 32">
                <path d="M16 20l-5.4-5.4 1.4-1.4 4 4 4-4 1.4 1.4z" />
              </svg>
            </button>
          </div>
        </td>
      </tr>
      <tr
        id={`description-${props.id}`}
        role="region"
        className={`${!open && "hidden"}`}
      >
        <td colSpan="10" className="px-2 py-3 first:pl-5 last:pr-5">
          <div className="bg-gray-50 dark:bg-gray-950/[0.15] dark:text-gray-400 p-3 -mt-3">
            <div className="mb-3 text-sm">
              <div className="mb-1 font-medium text-gray-800 dark:text-gray-100">
                <Link
                  className="inline-flex font-semibold text-gray-800 dark:text-gray-100"
                  to={`/plans/priorites/${props?.id}`}
                >
                  <LibelleFormat lenght={70} libelle={props.libelle} />
                </Link>
              </div>
              {props.description && (
                <div className="text-sm">
                  <DescriptionFormat
                    justify={false}
                    length={70}
                    description={props.description}
                  />
                </div>
              )}
            </div>
          </div>
        </td>
      </tr>
    </tbody>
  );
}

export default PrioriteListeItem;

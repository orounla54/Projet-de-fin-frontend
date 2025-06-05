import React from "react";
import { Link } from "react-router-dom";
import CircleProgress from "../../charts/CircleProgress";
import LibelleFormat from "../../components/LibelleFormat";
import DateRefactor1 from "../../components/DateRefactor1";
import DescriptionFormat from "../../components/DescriptionFormat";
import Avatar from "react-avatar";

function PrioriteResItem(props) {
  return (
    <div
      className={`bg-white dark:bg-gray-800 shadow-sm rounded-xl px-5 py-4 my-3`}
    >
      <div className="items-center justify-between space-x-2 space-y-4 md:flex md:space-y-0">
        {/* Left side */}
        <div className="flex items-start space-x-3 md:space-x-4">
          <div className="flex items-center justify-center mt-1 shrink-0">
            <CircleProgress width="50" height="50" value={props.progress} />
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex items-center justify-between gap-2">
              <Link
                className="inline-flex font-semibold text-gray-800 dark:text-gray-100"
                to={`/plans/priorites/${props?.id}`}
              >
                <LibelleFormat lenght={50} libelle={props.libelle} />
              </Link>
              <div className="flex items-center gap-1">
                <div className="flex -ml-px -space-x-3 sm:ml-4">
                  {props.responsables.slice(0, 3).map((responsable) => (
                    <span className={`relative`} key={responsable.id}>
                      {responsable.role === "Pilote" && (
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
                        name={`${responsable.nom} ${responsable.prenom}`}
                        round={true}
                        size="24"
                        src={responsable.image} // Le lien de l'image
                      />
                    </span>
                  ))}
                </div>
                {/* Nombre restant de responsables */}
                {props.responsables.length > 3 && (
                  <div className="text-xs italic font-medium text-gray-400 dark:text-gray-500">
                    +{props.responsables.length - 3}
                  </div>
                )}
              </div>
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
            <div className="flex items-center">
              {props.code && (
                <div className="mt-2 text-sm font-semibold text-violet-400">
                  <LibelleFormat lenght={50} libelle={props.code} />
                </div>
              )}{" "}
              <div className="mx-2 text-gray-400 dark:text-gray-600">·</div>
              {props.services && props.services.length > 0 && (
                <div className="mt-2 text-sm font-semibold text-violet-400">
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
          </div>
        </div>
        {/* Right side */}
        <div className="flex flex-wrap items-center justify-center gap-1 pl-10 space-x-2 md:pl-0">
          {props.typePriorite && (
            <div
              className={`text-xs inline-flex rounded-full text-center px-2.5 py-1 ${
                props.typePriorite === "Projet"
                  ? "bg-yellow-500/20 text-yellow-700"
                  : props.typePriorite === "Action"
                  ? "bg-blue-500/20 text-blue-700"
                  : "bg-green-500/20 text-green-700"
              }`}
            >
              {props.typePriorite}
            </div>
          )}
          {props.new === 1 && (
            <div
              className={`text-xs bg-green-500/20 text-green-700 inline-flex font-medium rounded-full text-center  px-2 py-1 `}
            >
              Nouveau
            </div>
          )}
          <div className="text-xs italic text-gray-500 dark:text-gray-400 whitespace-nowrap">
            <DateRefactor1 date={props.dateInscription} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrioriteResItem;

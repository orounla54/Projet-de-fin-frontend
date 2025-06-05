import React from "react";
import { Link } from "react-router-dom";
import SpinnerCligne from "../../components/SpinnerCligne";
import LibelleFormat from "../../components/LibelleFormat";
import Avatar from "react-avatar";

function JobListItem(props) {
  // condition mise à jour
  const currentTime = new Date().getTime() / 1000;
  const conditionAffAlert =
    new Date(props.deadline).getTime() / 1000 < currentTime;

  return (
    <div
      className={`${props.itemClicked === props.id ? "bg-white dark:bg-gray-700" : "bg-slate-50 dark:bg-gray-800"} shadow-sm rounded-xl px-5 py-4 relative`}
    >
      <div className="flex items-center justify-between space-x-2 space-y-2">
        {/* Left side */}
        <div className="flex items-start space-x-3 md:space-x-4">
          <button
            onClick={() => {
              props.setItemClicked(props.id);
            }}
            className="mt-1 w-9 h-9 shrink-0"
          >
            {props.libelle && (
              <Avatar name={`${props.libelle}`} round={true} size="32" />
            )}
          </button>

          <div>
            <Link
              className="inline-flex font-semibold text-gray-800 dark:text-gray-100"
              to={`/projets/${props.id}`}
            >
              <LibelleFormat lenght={60} libelle={props.libelle} />
              {/* Correction de la balise <a> non fermée */}
              {/* <a> */}
            </Link>
            <div className="text-sm">
              {props.description && props.description.length > 100
                ? `${props.description.slice(0, 100)}...`
                : props.description}
            </div>
          </div>
        </div>
        {/* Right side */}
        <div className="flex items-end justify-center pl-10 space-x-4 md:pl-0">
          {props.deadline && (
            <div
              className={`text-xs flex items-center font-medium rounded-full text-center px-2.5 py-1 ${
                conditionAffAlert && "bg-yellow-500/20 text-yellow-700"
              }`}
            >
              <span className="flex items-center px-2 ">
                {conditionAffAlert && (
                  <div className="relative">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-4 h-4"
                    >
                      <path d="M5.85 3.5a.75.75 0 0 0-1.117-1 9.719 9.719 0 0 0-2.348 4.876.75.75 0 0 0 1.479.248A8.219 8.219 0 0 1 5.85 3.5ZM19.267 2.5a.75.75 0 1 0-1.118 1 8.22 8.22 0 0 1 1.987 4.124.75.75 0 0 0 1.48-.248A9.72 9.72 0 0 0 19.266 2.5Z" />
                      <path
                        fillRule="evenodd"
                        d="M12 2.25A6.75 6.75 0 0 0 5.25 9v.75a8.217 8.217 0 0 1-2.119 5.52.75.75 0 0 0 .298 1.206c1.544.57 3.16.99 4.831 1.243a3.75 3.75 0 1 0 7.48 0 24.583 24.583 0 0 0 4.83-1.244.75.75 0 0 0 .298-1.205 8.217 8.217 0 0 1-2.118-5.52V9A6.75 6.75 0 0 0 12 2.25ZM9.75 18c0-.034 0-.067.002-.1a25.05 25.05 0 0 0 4.496 0l.002.1a2.25 2.25 0 1 1-4.5 0Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </span>
            </div>
          )}
          <div className="absolute w-20 text-xs font-bold top-2 right-2">
            {new Date(props.dateInscription).toLocaleDateString("fr-FR", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </div>
        </div>
      </div>
      {props.newProjet === 1 && (
        <>
          <div
            className={`text-xs absolute top-2 left-0 inline-flex font-medium rounded text-center px-1 py-3/4`}
          >
            <SpinnerCligne />
          </div>
        </>
      )}
    </div>
  );
}

export default JobListItem;

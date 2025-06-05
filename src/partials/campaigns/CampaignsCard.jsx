import React from "react";
import { Link } from "react-router-dom";
import SpinnerCligne from "../../components/SpinnerCligne";

function CampaignsCard(props) {
 
  const typeColor = (status) => {
    switch (status) {
      case "Terminé": //Terminé
        return "bg-green-500/20 text-green-700";
      case "En-cours": //En-cours
        return "bg-yellow-500/20 text-yellow-700";
      case "Non-démaré": //Non-démaré
        return "bg-blue-500/20 text-blue-700";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400";
    }
  };

  const categoryIcon = (category) => {
    switch (category) {
      case "Evenement":
        return (
          <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-red-500">
            <svg
              className="w-6 h-6 fill-current text-white"
              viewBox="0 0 36 36"
            >
              <path d="M25 24H11a1 1 0 01-1-1v-5h2v4h12v-4h2v5a1 1 0 01-1 1zM14 13h8v2h-8z" />
            </svg>
          </div>
        );
      case "Activitée":
        return (
          <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-green-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5 fill-current text-white"
            >
              <path
                fillRule="evenodd"
                d="M4.5 2A2.5 2.5 0 0 0 2 4.5v3.879a2.5 2.5 0 0 0 .732 1.767l7.5 7.5a2.5 2.5 0 0 0 3.536 0l3.878-3.878a2.5 2.5 0 0 0 0-3.536l-7.5-7.5A2.5 2.5 0 0 0 8.38 2H4.5ZM5 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        );
      case "Reunion":
        return (
          <div className="w-w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-sky-500">
            <svg
              className="w-9 h-9 fill-current text-white"
              viewBox="0 0 36 36"
            >
              <path d="M23 11v2.085c-2.841.401-4.41 2.462-5.8 4.315-1.449 1.932-2.7 3.6-5.2 3.6h-1v2h1c3.5 0 5.253-2.338 6.8-4.4 1.449-1.932 2.7-3.6 5.2-3.6h3l-4-4zM15.406 16.455c.066-.087.125-.162.194-.254.314-.419.656-.872 1.033-1.33C15.475 13.802 14.038 13 12 13h-1v2h1c1.471 0 2.505.586 3.406 1.455zM24 21c-1.471 0-2.505-.586-3.406-1.455-.066.087-.125.162-.194.254-.316.422-.656.873-1.028 1.328.959.878 2.108 1.573 3.628 1.788V25l4-4h-3z" />
            </svg>
          </div>
        );
      case "Rendez-vous":
        return (
          <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-violet-500">
            <svg
              className="w-6 h-6 fill-current text-white"
              viewBox="0 0 36 36"
            >
              <path d="M18 10c-4.4 0-8 3.1-8 7s3.6 7 8 7h.6l5.4 2v-4.4c1.2-1.2 2-2.8 2-4.6 0-3.9-3.6-7-8-7zm4 10.8v2.3L18.9 22H18c-3.3 0-6-2.2-6-5s2.7-5 6-5 6 2.2 6 5c0 2.2-2 3.8-2 3.8z" />
            </svg>
          </div>
        );
      case "Séminaire":
        return (
          <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-orange-500">
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6"
            >
              <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A8.237 8.237 0 0 1 6 18.75c1.995 0 3.823.707 5.25 1.886V4.533ZM12.75 20.636A8.214 8.214 0 0 1 18 18.75c.966 0 1.89.166 2.75.47a.75.75 0 0 0 1-.708V4.262a.75.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533v16.103Z" />
            </svg>
          </div>
        );
      case "Autre":
        return (
          <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-yellow-500">
            <svg
              className="w-6 h-6 fill-current text-white"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M3 10a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM8.5 10a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM15.5 8.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z" />
            </svg>
          </div>
        );
      default:
        return <div></div>;
    }
  };

  return (
    <div className="col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      <div className="flex flex-col h-full p-4 ">
        <header className="relative">
          <div className="flex justify-end">
            {categoryIcon(props.enventType)}
          </div>
          {props.isNew === 1 && (
            <div className="flex justify-between items-center absolute -top-2 -left-2">
              <SpinnerCligne />
            </div>
          )}
        </header>
        <div className="grow mt-2 flex flex-col justify-between">
          <Link
            className="inline-flex text-gray-800 dark:text-gray-100 hover:text-gray-900 dark:hover:text-white mb-1"
            to={`/evenements/${props.id}`}
          >
            <h2 className="text-lg leading-snug font-semibold">
              {props.eventName}
            </h2>
          </Link>
          <div className="text-sm">
            {props.description && props.description.length > 145
              ? `${props.description.slice(0, 145)}...`
              : props.description}
          </div>
        </div>
        <footer className="mt-5">
          <div className="text-xs font-medium text-gray-500 mb-2">
            {props.eventStart && (
              <span>
                {new Date(props.eventStart).toLocaleDateString("fr-FR", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
                {new Date(props.eventEnd).getDate() !==
                  new Date(props.eventStart).getDate() && (
                  <>
                    {" "}
                    -{" "}
                    {new Date(props.eventEnd).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </>
                )}
                ,{" "}
                {new Date(props.eventStart).toLocaleTimeString("fr-FR", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}
                {props.eventEnd && (
                  <span>
                    {" "}
                    -{" "}
                    {new Date(props.eventEnd).toLocaleTimeString("fr-FR", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}
                  </span>
                )}
              </span>
            )}
          </div>
          <div className="flex justify-between items-center">
            <div>
              <div
                className={`text-xs inline-flex font-medium rounded-full text-center px-2.5 py-1 ${typeColor(
                  props.status
                )}`}
              >
                {props.status}
              </div>
            </div>
            <div>
              <Link
                className="text-sm font-medium text-violet-500 hover:text-violet-600 dark:hover:text-violet-400"
                to={`/evenements/${props.id}`}
              >
                Voir -&gt;
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default CampaignsCard;

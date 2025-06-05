import React, { useEffect, useState } from "react";

import UserAvatar from "../../images/user-avatar-80.png";
import Avatar from "react-avatar";
import LibelleFormat from "../../components/LibelleFormat";
import DescriptionFormat from "../../components/DescriptionFormat";
import { Link } from "react-router-dom";

// Fonction pour formater les données
const formatData = (data) => {
  return {
    ...data,
    responsables: JSON.parse(data.responsableEvent || {}),
  };
};

function Task08({ event }) {
  const categoryIcon = (category) => {
    switch (category) {
      case "Evenement":
        return (
          <div className="border-8 border-white dark:border-gray-900 w-14 h-14 rounded-full flex items-center justify-center shrink-0   bg-red-500">
            <svg
              className="w-16 h-16 fill-current text-white"
              viewBox="0 0 36 36"
            >
              <path d="M25 24H11a1 1 0 01-1-1v-5h2v4h12v-4h2v5a1 1 0 01-1 1zM14 13h8v2h-8z" />
            </svg>
          </div>
        );
      case "Activitée":
        return (
          <div className="border-8 border-white dark:border-gray-900 w-14 h-14 rounded-full flex items-center justify-center shrink-0 bg-green-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-6 h-6 fill-current text-white"
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
          <div className="border-8 border-white dark:border-gray-900 w-14 h-14 rounded-full flex items-center justify-center shrink-0   bg-sky-500">
            <svg
              className="w-16 h-16 fill-current text-white"
              viewBox="0 0 36 36"
            >
              <path d="M23 11v2.085c-2.841.401-4.41 2.462-5.8 4.315-1.449 1.932-2.7 3.6-5.2 3.6h-1v2h1c3.5 0 5.253-2.338 6.8-4.4 1.449-1.932 2.7-3.6 5.2-3.6h3l-4-4zM15.406 16.455c.066-.087.125-.162.194-.254.314-.419.656-.872 1.033-1.33C15.475 13.802 14.038 13 12 13h-1v2h1c1.471 0 2.505.586 3.406 1.455zM24 21c-1.471 0-2.505-.586-3.406-1.455-.066.087-.125.162-.194.254-.316.422-.656.873-1.028 1.328.959.878 2.108 1.573 3.628 1.788V25l4-4h-3z" />
            </svg>
          </div>
        );
      case "Rendez-vous":
        return (
          <div className="border-8 border-white dark:border-gray-900 w-14 h-14 rounded-full flex items-center justify-center shrink-0   bg-violet-500">
            <svg
              className="w-14 h-14 fill-current text-white"
              viewBox="0 0 36 36"
            >
              <path d="M18 10c-4.4 0-8 3.1-8 7s3.6 7 8 7h.6l5.4 2v-4.4c1.2-1.2 2-2.8 2-4.6 0-3.9-3.6-7-8-7zm4 10.8v2.3L18.9 22H18c-3.3 0-6-2.2-6-5s2.7-5 6-5 6 2.2 6 5c0 2.2-2 3.8-2 3.8z" />
            </svg>
          </div>
        );
      case "Autre":
        return (
          <div className="border-8 border-white dark:border-gray-900 w-10 h-10 rounded-full flex items-center justify-center shrink-0   bg-yellow-500">
            <svg
              className="w-10 h-10 fill-current text-white"
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
  const [eventFormat, setEventFormat] = useState();

  useEffect(() => {
    if (event) {
      setEventFormat(event);
      // setEventFormat(formatData(event));
    }
    console.log(event)
  }, [event]);
  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl p-4">
      {/* Body */}
      <div className="mb-3">
        {/* Title */}
        <div className="flex items-center mb-2">
          <div className="flex shrink-0 -space-x-3 -ml-px mr-2">
            <a className="block" href="#0">
              {eventFormat && eventFormat.responsableEvent
                ? (
                  <Avatar src={eventFormat?.responsableEvent
                    ?.image} name={`${eventFormat?.responsableEvent
                      ?.nom} ${eventFormat?.responsableEvent
                        ?.prenom}`} round={true} size="28" />
                ) : (
                  <>
                    <img
                      className="rounded-full border-2 border-white dark:border-gray-800 box-content"
                      src={UserAvatar}
                      width="28"
                      height="28"
                      alt="User 12"
                    />
                  </>
                )}
            </a>
          </div>
          <div className="grow">
            <a
              className="inline-flex text-gray-800 dark:text-gray-100 hover:text-gray-900 dark:hover:text-white"
              href="#0"
            >
              <h3 className="font-semibold text-sm text-gray-800 dark:text-gray-100">
                {event && event.eventName ? (
                  <Link
                    to={`/evenements/calendrier?dateQuery=${new Date(
                      event.eventStart
                    ).toISOString()}`}
                  >
                    <LibelleFormat libelle={event.eventName} />
                  </Link>
                ) : (
                  <span className="text-xs">
                    Pas de libelle ajouté pour cet evenement...
                  </span>
                )}
              </h3>
            </a>
            <div className="text-xs font-medium text-gray-500">
              {new Date(event.dateInscription).toLocaleDateString("fr-FR", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </div>
          </div>
        </div>
        {/* Content */}
        <div className="flex flex-col justify-between gap-2">
          <div className="text-xs mb-4">
            {event && event.description ? (
              <>
                <DescriptionFormat description={event.description} /> 🔥
              </>
            ) : (
              <span className="text-xs">
                Pas de description ajouté pour cet evenement...
              </span>
            )}
          </div>
          <span className="text-xs font-bold text-violet-500 text-right">
            {" "}
            {new Date(event.eventStart).toLocaleDateString("fr-FR", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
            {new Date(event.eventEnd).getDate() !==
              new Date(event.eventStart).getDate() && (
                <>
                  {" "}
                  -{" "}
                  {new Date(event.eventEnd).toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </>
              )}
          </span>
        </div>
      </div>
      {/* Footer */}
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div></div>
        {/* Right side */}
        <div className="flex items-center">
          {/* Replies button */}
          <button className="flex items-center text-gray-400 dark:text-gray-500 hover:text-violet-500  dark:hover:text-violet-500 ">
            {event.enventType ? (
              categoryIcon(event.enventType)
            ) : (
              <img
                className="rounded-full w-20 h-20   border-4 border-white dark:border-gray-900"
                src={UserAvatar}
                alt="Avatar"
              />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Task08;

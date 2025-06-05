import React, { useEffect, useState } from "react";

import ProfileImage from "../../images/user-avatar-32.png";

import UserAvatar from "../../images/user-avatar-80.png";

import { Link } from "react-router-dom";
import SpinnerLoading from "../../components/SpinnerLoading";

function ProfileSidebar({
  profileSidebarOpen,
  setProfileSidebarOpen,
  event,
  dataListe,
  setKeyword,
  loadingListe,
  errorListe,
}) {
  const [eventsListe, setEventsListe] = useState([]);
  // const [idCurrent, setIdCurrent] = useState(null);

  // useEffect(() => {
  //   if (event) {
  //     setIdCurrent(event.id);
  //   }
  // }, [event]);

  const categoryIcon = (category) => {
    switch (category) {
      case "Evenement":
        return (
          <div className="border-4 border-white dark:border-gray-900 w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-red-500">
            <svg
              className="w-8 h-8 fill-current text-white"
              viewBox="0 0 36 36"
            >
              <path d="M25 24H11a1 1 0 01-1-1v-5h2v4h12v-4h2v5a1 1 0 01-1 1zM14 13h8v2h-8z" />
            </svg>
          </div>
        );
      case "Activitée":
        return (
          <div className="border-4 border-white dark:border-gray-900 w-10 h-10 rounded-full flex items-center justify-center shrink-0  bg-green-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4 fill-current text-white"
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
          <div className="border-4 border-white dark:border-gray-900 w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-sky-500">
            <svg
              className="w-8 h-8 fill-current text-white"
              viewBox="0 0 36 36"
            >
              <path d="M23 11v2.085c-2.841.401-4.41 2.462-5.8 4.315-1.449 1.932-2.7 3.6-5.2 3.6h-1v2h1c3.5 0 5.253-2.338 6.8-4.4 1.449-1.932 2.7-3.6 5.2-3.6h3l-4-4zM15.406 16.455c.066-.087.125-.162.194-.254.314-.419.656-.872 1.033-1.33C15.475 13.802 14.038 13 12 13h-1v2h1c1.471 0 2.505.586 3.406 1.455zM24 21c-1.471 0-2.505-.586-3.406-1.455-.066.087-.125.162-.194.254-.316.422-.656.873-1.028 1.328.959.878 2.108 1.573 3.628 1.788V25l4-4h-3z" />
            </svg>
          </div>
        );
      case "Rendez-vous":
        return (
          <div className="border-4 border-white dark:border-gray-900 w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-violet-500">
            <svg
              className="w-8 h-8 fill-current text-white"
              viewBox="0 0 36 36"
            >
              <path d="M18 10c-4.4 0-8 3.1-8 7s3.6 7 8 7h.6l5.4 2v-4.4c1.2-1.2 2-2.8 2-4.6 0-3.9-3.6-7-8-7zm4 10.8v2.3L18.9 22H18c-3.3 0-6-2.2-6-5s2.7-5 6-5 6 2.2 6 5c0 2.2-2 3.8-2 3.8z" />
            </svg>
          </div>
        );
      case "Séminaire":
        return (
          <div className="border-4 border-white dark:border-gray-900 w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-orange-500">
            <svg
              fill="currentColor"
              className="w-8 h-8 fill-current text-white"
              viewBox="0 0 36 36"
            >
              <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A8.237 8.237 0 0 1 6 18.75c1.995 0 3.823.707 5.25 1.886V4.533ZM12.75 20.636A8.214 8.214 0 0 1 18 18.75c.966 0 1.89.166 2.75.47a.75.75 0 0 0 1-.708V4.262a.75.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533v16.103Z" />
            </svg>
          </div>
        );
      case "Autre":
        return (
          <div className="border-4 border-white dark:border-gray-900 w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-yellow-500">
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

  //effectue la mise à jour de la page quand on a la data

  useEffect(() => {
    if (dataListe) {
      setEventsListe(dataListe);
    }
    // console.log(eventsListe);
  }, [dataListe]);

  return (
    <div
      id="profile-sidebar"
      className={`absolute z-20 top-0 bottom-0 w-full md:w-auto md:static md:top-auto md:bottom-auto -mr-px md:translate-x-0 transition-transform duration-200 ease-in-out ${
        profileSidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="sticky top-16 bg-white dark:bg-[#151D2C] overflow-x-hidden overflow-y-auto no-scrollbar shrink-0 border-r border-gray-200 dark:border-gray-700/60 md:w-[18rem] xl:w-[20rem] h-[calc(100dvh-64px)]">
        {/* Profile group */}
        <div>
          {/* Group header */}
          <div className="sticky top-0 z-10">
            <div className="flex items-center bg-white dark:bg-[#151D2C] border-b border-gray-200 dark:border-gray-700/60 px-5 h-16">
              <div className="w-full flex items-center justify-between">
                {/* Profile image */}
                <div className="relative">
                  <div className="grow flex items-center truncate">
                    <img
                      className="w-8 h-8 rounded-full mr-2"
                      src={ProfileImage}
                      width="32"
                      height="32"
                      alt="Group 01"
                    />
                    <div className="truncate">
                      <span className="font-semibold text-gray-800 dark:text-gray-100 text-xs">
                        Liste evenement
                      </span>
                    </div>
                  </div>
                </div>
                {/* Add button */}
                <Link
                  to={`/evenements/calendrier`}
                  className="p-1.5 shrink-0 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 shadow-sm ml-2"
                >
                  <svg
                    className="fill-current text-violet-500"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                  >
                    <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1Z" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
          {/* Group body */}
          <div className="px-5 py-4">
            {/* Search form */}
            <form className="relative">
              <label htmlFor="profile-search" className="sr-only">
                Search
              </label>
              <input
                onChange={(e) => setKeyword(e.target.value)}
                id="profile-search"
                className="form-input w-full pl-9 bg-white dark:bg-gray-800"
                type="search"
                placeholder="Recherche..."
              />
              <button
                className="absolute inset-0 right-auto group"
                type="submit"
                aria-label="Search"
              >
                <svg
                  className="shrink-0 fill-current text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400 ml-3 mr-2"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M7 14c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zM7 2C4.243 2 2 4.243 2 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5z" />
                  <path d="M15.707 14.293L13.314 11.9a8.019 8.019 0 01-1.414 1.414l2.393 2.393a.997.997 0 001.414 0 .999.999 0 000-1.414z" />
                </svg>
              </button>
            </form>
            {/* Team members */}
            <div className="">
              <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase my-2">
                Evenements
              </div>
              <ul className="mb-6">
                {errorListe && (
                  <tr>
                    <td colSpan="4" className="text-center text-red-500">
                      {"Erreur lors de la récupération des données."}
                    </td>
                  </tr>
                )}
                {loadingListe && <SpinnerLoading />}
                {eventsListe && eventsListe.length > 0 ? (
                  <ul>
                    {eventsListe.map((eventL) => (
                      <li
                        key={eventL.id}
                        className={`w-full h-12 p-1 rounded-lg ${
                          eventL.id === event.id
                            ? "bg-[linear-gradient(135deg,var(--tw-gradient-stops))] from-violet-500/[0.12] dark:from-violet-500/[0.24] to-violet-500/[0.04]"
                            : ""
                        }`}
                      >
                        <Link
                          to={`/evenements/${eventL.id}`}
                          onClick={() => setProfileSidebarOpen(false)}
                        >
                          <div className="flex items-center truncate">
                            <div className="relative mr-1">
                              {eventL.enventType ? (
                                categoryIcon(eventL.enventType)
                              ) : (
                                <img
                                  className="w-8 h-8 rounded-full"
                                  src={UserAvatar}
                                  width="32"
                                  height="32"
                                  alt="User 06"
                                />
                              )}
                            </div>
                            <div className="truncate">
                              <span className="text-sm font-medium text-gray-800 dark:text-gray-100">
                                {eventL.eventName
                                  ? eventL.eventName
                                  : "Aucun libellé ajouté..."}
                              </span>
                            </div>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center text-xs text-gray-500">
                    Aucun événement disponible
                  </div>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileSidebar;

import React, { useState, useEffect, useRef } from "react";

import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import SpinnerLoading from "../components/SpinnerLoading";
import { useSuccessMessage } from "../utils/SuccessContext";
import { useGetData } from "../utils/Requests/RequestService";
import { Link, useLocation, useNavigate } from "react-router-dom";
import DropdownCalendrier from "../components/DropdownCalendrier";
import AddEvenements from "../components/AddEvenements";

function useQuery() {
  const { search } = useLocation();
  return new URLSearchParams(search);
}

function Calendar() {
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const { pathname } = location;

  const query = useQuery();
  const dateQuery = query.get("dateQuery");

  // Tente de parser la date, sinon utilise `new Date()`
  const parsedDate =
    dateQuery && !isNaN(new Date(dateQuery).getTime())
      ? new Date(dateQuery)
      : null;

  // Assurez-vous que `today` est un objet `Date`
  const today = parsedDate || new Date();
  const todayDay = new Date();

  // console.log("Mois :", today.getMonth()); // Affiche le mois (0 = Janvier, 11 = Décembre)

  const monthNames = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];

  const dayNames = [
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
  ];

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [month, setMonth] = useState(today.getMonth());
  const navigate = useNavigate();

  const [year, setYear] = useState(today.getFullYear());
  const [daysInMonth, setDaysInMonth] = useState([]);
  const [startingBlankDays, setStartingBlankDays] = useState([]);
  const [endingBlankDays, setEndingBlankDays] = useState([]);
  const [loadingDate, setLoadingDate] = useState(false);

  const [endpoint, setEndpoint] = useState("forCalendrier/evenements");

  const navigateToEventPage = (id) => {
    navigate(`/evenements/${id}`);
  };

  const [events, setEvents] = useState([]);

  const { data, loading, error, fetchData } = useGetData(`${endpoint}`);

  const transformEventData = (apiData) => {
    return apiData.map((event) => ({
      eventStart: new Date(event.eventStart),
      eventEnd: new Date(event.eventEnd),
      eventName: event.eventName,
      description: event.description,
      enventType: event.enventType,
      id: event.id,
      idTache: event.idTache || "Non assigné",
      creerPar: event.creer_par || "Inconnu",
    }));
  };

  useEffect(() => {
    if (data) {
      const transformedEvents = transformEventData(
        data.length > 0 ? data : []
      ); // Transformer les données
      setEvents(transformedEvents); // Mettre à jour le state avec les événements transformés
    }
    // console.log(events); // Afficher le state mis à jour
  }, [data]);

  const isToday = (date) => {
    const day = new Date(year, month, date);
    return todayDay.toDateString() === day.toDateString() ? true : false;
  };

  const getEvents = (date) => {
    return events.filter(
      (e) =>
        new Date(e.eventStart).toDateString() ===
        new Date(year, month, date).toDateString()
    );
  };

  const eventColor = (eventType) => {
    switch (eventType) {
      case "Reunion":
        return "text-white bg-sky-500";
      case "Rendez-vous":
        return "text-white bg-violet-500";
      case "Activitée":
        return "text-white bg-green-500";
      case "Evenement":
        return "text-white bg-red-500";
      case "Séminaire":
        return "text-white bg-orange-500";
      case "Autre":
        return "text-white bg-yellow-500";
      default:
        return "text-white bg-slate-400";
    }
  };

  const getDays = () => {
    setLoadingDate(true);
    const days = new Date(year, month + 1, 0).getDate();

    // starting empty cells (previous month)
    const startingDayOfWeek = new Date(year, month).getDay();
    let startingBlankDaysArray = [];
    for (let i = 1; i <= startingDayOfWeek; i++) {
      startingBlankDaysArray.push(i);
    }

    // ending empty cells (next month)
    const endingDayOfWeek = new Date(year, month + 1, 0).getDay();
    let endingBlankDaysArray = [];
    for (let i = 1; i < 7 - endingDayOfWeek; i++) {
      endingBlankDaysArray.push(i);
    }

    // current month cells
    let daysArray = [];
    for (let i = 1; i <= days; i++) {
      daysArray.push(i);
    }

    setStartingBlankDays(startingBlankDaysArray);
    setEndingBlankDays(endingBlankDaysArray);
    setDaysInMonth(daysArray);
    setLoadingDate(false);
  };

  useEffect(() => {
    getDays();
  }, [month]);

  const [itemsDaysView, setItemsDaysView] = useState(false);
  const [eventsDay, setEventsDay] = useState([]);

  // de navigation vers la page des evenements avec en reguete une date precise
  const handleNavigateEvent = (day) => {
    setItemsDaysView(false);
    setItemsDaysView(!itemsDaysView);
    setEventsDay(getEvents(day));
  };

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-x-hidden overflow-y-auto">
        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="relative grow">
          {loading ? (
            <div className="absolute z-40 flex items-center justify-center w-full h-full bg-white dark:bg-gray-900">
              <SpinnerLoading />
            </div>
          ) : (
            <>
              {" "}
              <div className="w-full px-4 py-8 mx-auto sm:px-6 lg:px-8 max-w-9xl">
                <Link
                  className="px-3 text-gray-800 bg-white border-gray-200 btn-sm mb-7 dark:bg-gray-800 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 dark:text-gray-300"
                  onClick={() => navigate(-1)}
                >
                  <svg
                    className="mr-2 text-gray-400 fill-current dark:text-gray-500"
                    width="7"
                    height="12"
                    viewBox="0 0 7 12"
                  >
                    <path d="M5.4.6 6.8 2l-4 4 4 4-1.4 1.4L0 6z" />
                  </svg>
                  <span>Retour</span>
                </Link>
                {/* Page header */}
                <div className="mb-4 sm:flex sm:justify-between sm:items-center">
                  {/* Left: Title */}
                  <div className="mb-4 sm:mb-0">
                    <h1 className="text-2xl font-bold text-gray-800 md:text-3xl dark:text-gray-100">
                      <span>{`${monthNames[((month % 12) + 12) % 12]} ${
                        year + Math.floor(month / 12)
                      }`}</span>
                    </h1>
                  </div>

                  {/* Right: Actions */}
                  <div className="grid justify-start grid-flow-col gap-2 sm:auto-cols-max sm:justify-end">
                    {/* Previous month button */}
                    <button
                      className="btn px-2.5 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 disabled:border-gray-200 dark:disabled:border-gray-700 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-400 dark:disabled:text-gray-600 disabled:cursor-not-allowed"
                      // disabled={month === 0 ? true : false}
                      onClick={() => {
                        setMonth(month - 1);
                        setItemsDaysView(false);
                        // getDays();
                      }}
                    >
                      <span className="sr-only">Previous month</span>
                      <wbr />
                      <svg
                        className="text-gray-400 fill-current dark:text-gray-500"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                      >
                        <path d="M9.4 13.4l1.4-1.4-4-4 4-4-1.4-1.4L4 8z" />
                      </svg>
                    </button>

                    {/* Next month button */}
                    <button
                      className="btn px-2.5 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 disabled:border-gray-200 dark:disabled:border-gray-700 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-400 dark:disabled:text-gray-600 disabled:cursor-not-allowed"
                      // disabled={month === 11 ? true : false}
                      onClick={() => {
                        setMonth(month + 1);
                        setItemsDaysView(false);
                        // getDays();
                      }}
                    >
                      <span className="sr-only">Next month</span>
                      <wbr />
                      <svg
                        className="text-gray-400 fill-current dark:text-gray-500"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                      >
                        <path d="M6.6 13.4L5.2 12l4-4-4-4 1.4-1.4L12 8z" />
                      </svg>
                    </button>

                    <hr className="w-px h-full mx-1 bg-gray-200 border-none dark:bg-gray-700/60" />

                    {/* Create event button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setFeedbackModalOpen(true);
                      }}
                      className="text-xs text-gray-100 bg-gray-900 btn hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
                    >
                      Ajouter un événement
                    </button>

                    <AddEvenements
                      fetchData={fetchData}
                      setFeedbackModalOpen={setFeedbackModalOpen}
                      feedbackModalOpen={feedbackModalOpen}
                    />
                  </div>
                </div>

                {/* Filters and view buttons */}
                <div className="mb-4 sm:flex sm:justify-between sm:items-center">
                  {/* Filters  */}
                  <div className="mb-4 mr-2 sm:mb-0">
                    <ul className="flex flex-wrap items-center -m-1">
                      <li className="m-1">
                        <button className="text-gray-500 bg-white border-gray-200 btn-sm dark:bg-gray-800 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 dark:text-gray-400">
                          <div className="w-1 h-3.5 bg-sky-500 shrink-0"></div>
                          <span className="ml-1.5">Reunion</span>
                        </button>
                      </li>
                      <li className="m-1">
                        <button className="text-gray-500 bg-white border-gray-200 btn-sm dark:bg-gray-800 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 dark:text-gray-400">
                          <div className="w-1 h-3.5 bg-green-500 shrink-0"></div>
                          <span className="ml-1.5">Activitée</span>
                        </button>
                      </li>
                      <li className="m-1">
                        <button className="text-gray-500 bg-white border-gray-200 btn-sm dark:bg-gray-800 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 dark:text-gray-400">
                          <div className="w-1 h-3.5 bg-violet-500 shrink-0"></div>
                          <span className="ml-1.5">Rendez-vous</span>
                        </button>
                      </li>
                      <li className="m-1">
                        <button className="text-gray-500 bg-white border-gray-200 btn-sm dark:bg-gray-800 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 dark:text-gray-400">
                          <div className="w-1 h-3.5 bg-red-500 shrink-0"></div>
                          <span className="ml-1.5">Evenement</span>
                        </button>
                      </li>
                      {pathname.includes("/societe") && (
                        <li className="m-1">
                          <button className="text-gray-500 bg-white border-gray-200 btn-sm dark:bg-gray-800 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 dark:text-gray-400">
                            <div className="w-1 h-3.5 bg-orange-500 shrink-0"></div>
                            <span className="ml-1.5">Séminaire</span>
                          </button>
                        </li>
                      )}
                      <li className="m-1">
                        <button className="text-gray-500 bg-white border-gray-200 btn-sm dark:bg-gray-800 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 dark:text-gray-400">
                          <div className="w-1 h-3.5 bg-yellow-500 shrink-0"></div>
                          <span className="ml-1.5">Autre</span>
                        </button>
                      </li>
                      {/* <li className="m-1">
                    <button className="bg-white border-gray-200 btn-sm dark:bg-gray-800 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-violet-500">
                      +Add New
                    </button>
                  </li> */}
                    </ul>
                  </div>

                  {/* View buttons (requires custom integration) */}
                  {/* <div className="flex -space-x-px flex-nowrap">
                <button className="bg-white border-gray-200 rounded-none btn dark:bg-gray-800 dark:border-gray-700/60 text-violet-500 first:rounded-l-lg last:rounded-r-lg">
                  Month
                </button>
                <button className="text-gray-600 bg-white border-gray-200 rounded-none btn dark:bg-gray-800 dark:border-gray-700/60 hover:bg-gray-50 dark:hover:bg-gray-900 dark:text-gray-300 first:rounded-l-lg last:rounded-r-lg">
                  Week
                </button>
                <button className="text-gray-600 bg-white border-gray-200 rounded-none btn dark:bg-gray-800 dark:border-gray-700/60 hover:bg-gray-50 dark:hover:bg-gray-900 dark:text-gray-300 first:rounded-l-lg last:rounded-r-lg">
                  Day
                </button>
              </div> */}
                </div>

                {/* CalendarEntreprise table */}
                <div className="overflow-hidden bg-white shadow dark:bg-gray-800 rounded-xl">
                  {/* Days of the week */}
                  {loadingDate ? (
                    <SpinnerLoading />
                  ) : (
                    <>
                      <div className="grid grid-cols-7 gap-px border-b border-gray-200 dark:border-gray-700/60">
                        {dayNames.map((day) => {
                          return (
                            <div className="px-1 py-3" key={day}>
                              <div className="text-sm font-medium text-center text-gray-500 lg:hidden">
                                {day.substring(0, 3)}
                              </div>
                              <div className="hidden text-sm font-medium text-center text-gray-500 dark:text-gray-400 lg:block">
                                {day}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Day cells */}
                      <div className="absolute z-20">
                        <DropdownCalendrier
                          day={today}
                          eventsDay={eventsDay}
                          itemsDaysView={itemsDaysView}
                          setItemsDaysView={setItemsDaysView}
                        />
                      </div>
                      <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700/60">
                        {/* Diagonal stripes pattern */}
                        <svg className="sr-only">
                          <defs>
                            <pattern
                              id="stripes"
                              patternUnits="userSpaceOnUse"
                              width="5"
                              height="5"
                              patternTransform="rotate(135)"
                            >
                              <line
                                className="text-gray-200 opacity-50 stroke-current dark:text-gray-700"
                                x1="0"
                                y="0"
                                x2="0"
                                y2="5"
                                strokeWidth="2"
                              />
                            </pattern>
                          </defs>
                        </svg>
                        {/* Empty cells (previous month) */}
                        {startingBlankDays.map((blankday) => {
                          return (
                            <div
                              className="h-20 bg-gray-50 dark:bg-gray-800 sm:h-28 lg:h-36"
                              key={blankday}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="100%"
                                height="100%"
                              >
                                <rect
                                  width="100%"
                                  height="100%"
                                  fill="url(#stripes)"
                                />
                              </svg>
                            </div>
                          );
                        })}

                        {/* Days of the current month */}
                        {daysInMonth.map((day) => {
                          return (
                            <div
                              className="relative h-20 overflow-hidden bg-white dark:bg-gray-800 sm:h-28 lg:h-36"
                              key={day}
                            >
                              <div className="flex flex-col justify-between h-full">
                                {/* Events */}
                                <div className="grow flex flex-col relative p-0.5 sm:p-1.5 overflow-hidden  overflow-x-hidden ">
                                  {/* <div className="grow flex flex-col relative p-0.5 sm:p-1.5 overflow-hidden  overflow-x-hidden overflow-y-auto no-scrollbar"> */}
                                  {getEvents(day).map((event) => (
                                    <button
                                      className="relative w-full mb-1 text-left"
                                      key={event.id}
                                      onClick={() =>
                                        navigateToEventPage(event.id)
                                      }
                                    >
                                      <div
                                        className={`px-2 py-0.5 rounded-lg overflow-hidden ${eventColor(
                                          event.enventType
                                        )}`}
                                      >
                                        {/* Event name */}
                                        <div className="text-xs font-semibold truncate">
                                          {event.eventName}
                                        </div>
                                        {/* Event time */}
                                        <div className="hidden text-xs uppercase truncate sm:block">
                                          {/* Start date */}
                                          {event.eventStart && (
                                            <span>
                                              {event.eventStart.toLocaleTimeString(
                                                [],
                                                {
                                                  hour24: true,
                                                  hour: "numeric",
                                                  minute: "numeric",
                                                }
                                              )}
                                            </span>
                                          )}
                                          {/* End date */}
                                          {event.eventEnd && (
                                            <span>
                                              {" "}
                                              -{" "}
                                              <span>
                                                {event.eventEnd.toLocaleTimeString(
                                                  [],
                                                  {
                                                    hour24: true,
                                                    hour: "numeric",
                                                    minute: "numeric",
                                                  }
                                                )}
                                              </span>
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </button>
                                  ))}

                                  <div
                                    className="absolute bottom-0 left-0 right-0 h-4 pointer-events-none bg-gradient-to-t from-white dark:from-gray-800 to-transparent"
                                    aria-hidden="true"
                                  ></div>
                                </div>
                                {/* Cell footer */}
                                {/* More button (if more than 2 events) */}
                                {/* Day number */}
                                <div className="flex justify-between items-center p-0.5 sm:p-1.5">
                                  {getEvents(day).length > 2 && (
                                    <>
                                      <button
                                        onClick={() => {
                                          handleNavigateEvent(day);
                                        }}
                                        className="text-xs text-gray-500 dark:text-gray-300 font-medium whitespace-nowrap text-center sm:py-0.5 px-0.5 sm:px-2 border border-gray-200 dark:border-gray-700/60 rounded-lg"
                                      >
                                        <span className="md:hidden">+</span>
                                        <span>
                                          {getEvents(day).length - 2}
                                        </span>{" "}
                                        <span className="hidden md:inline">
                                          Plus +
                                        </span>
                                      </button>
                                    </>
                                  )}
                                </div>
                                <button
                                  className={`inline-flex ml-auto w-6 h-6 items-center justify-center text-xs sm:text-sm dark:text-gray-300 font-medium text-center rounded-full hover:bg-violet-100 dark:hover:bg-gray-600 ${
                                    isToday(day) &&
                                    "text-violet-500 dark:text-violet-400"
                                  }`}
                                >
                                  {day}
                                </button>
                              </div>
                            </div>
                          );
                        })}

                        {/* Empty cells (next month) */}
                        {endingBlankDays.map((blankday) => {
                          return (
                            <div
                              className="h-20 bg-gray-50 dark:bg-gray-800 sm:h-28 lg:h-36"
                              key={blankday}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="100%"
                                height="100%"
                              >
                                <rect
                                  width="100%"
                                  height="100%"
                                  fill="url(#stripes)"
                                />
                              </svg>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default Calendar;

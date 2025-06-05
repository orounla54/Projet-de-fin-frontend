import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Transition from "../utils/Transition";
import { data } from "autoprefixer";
import LibelleFormat from "./LibelleFormat";

function DropdownCalendrier({
  align,
  itemsDaysView,
  setItemsDaysView,
  eventsDay,
  day,
}) {
  const trigger = useRef(null);
  const dropdown = useRef(null);

  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!dropdown.current || !trigger.current) return;
      if (
        !itemsDaysView ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      ) {
        return;
      }
      setItemsDaysView(false);
    };
  
    document.addEventListener("click", clickHandler);
  
    return () => document.removeEventListener("click", clickHandler);
  }, [itemsDaysView]); // Ajout de la dépendance

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!itemsDaysView || keyCode !== 27) return;
      setItemsDaysView(false);
    };
  
    document.addEventListener("keydown", keyHandler);
  
    return () => document.removeEventListener("keydown", keyHandler);
  }, [itemsDaysView]); // Ajout de la dépendance

  return (
    <div className="relative inline-flex ml-24 mt-10">
      <Transition
        className={`origin-top-right z-10 absolute top-full -mr-48 sm:mr-0 min-w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/60 py-1.5 rounded-lg shadow-lg overflow-hidden mt-1 ${
          align === "right" ? "right-0" : "left-0"
        }`}
        show={itemsDaysView}
        enter="transition ease-out duration-200 transform"
        enterStart="opacity-0 -translate-y-2"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-out duration-200"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
      >
        <div
          ref={dropdown}
          onFocus={() => setItemsDaysView(true)}
          onBlur={() => setItemsDaysView(false)}
        >
          <ul>
            {eventsDay && eventsDay.length > 0 ? (
              eventsDay.map((event) => (
                <>
                  <li key={event.id} className="border-b border-gray-200 dark:border-gray-700/60 last:border-0">
                    <Link
                      className="block py-2 px-4 hover:bg-gray-50 dark:hover:bg-gray-700/20"
                      to={`/evenements/${event.id}`}
                      onClick={() => setItemsDaysView(!itemsDaysView)}
                    >
                      <span className="block text-sm mb-2">
                        <span className="font-semibold text-gray-600 dark:text-gray-100">
                          {event && event.eventName ? (
                            <>
                              📣 <LibelleFormat libelle={event.eventName} />
                            </>
                          ) : (
                            "Aucun libelle ajouté"
                          )}
                        </span>{" "}
                        <span className="text-xs">
                          {event && event.description ? (
                            <>
                              <LibelleFormat libelle={event.description} />
                            </>
                          ) : (
                            "Aucune description ajoutée..."
                          )}
                        </span>
                      </span>
                      <span className="block text-xs font-medium text-gray-400 dark:text-gray-500">
                        {event && event.eventStart ? (
                          <>
                            <div className="text-xs">
                              {new Date(event.eventStart).toLocaleDateString(
                                "fr-FR",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                }
                              )}{", "}
                              {event.eventStart && (
                                <span className="font-bold">
                                  {event.eventStart.toLocaleTimeString([], {
                                    hour24: true,
                                    hour: "numeric",
                                    minute: "numeric",
                                  })}
                                </span>
                              )}
                              {/* End date */}
                              {event.eventEnd && (
                                <span>
                                  {" "}
                                  -{" "}
                                  <span className="font-bold">
                                    {event.eventEnd.toLocaleTimeString([], {
                                      hour24: true,
                                      hour: "numeric",
                                      minute: "numeric",
                                    })}
                                  </span>
                                </span>
                              )}
                            </div>
                          </>
                        ) : (
                          <></>
                        )}
                      </span>
                    </Link>
                  </li>
                </>
              ))
            ) : (
              <span className="text-xs text-center text-violet-400">
                Pas d'evenements pour cette date
              </span>
            )}
          </ul>
        </div>
      </Transition>
    </div>
  );
}

export default DropdownCalendrier;

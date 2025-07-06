import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Transition from "../utils/Transition";

import { useAuth } from "../utils/Auth/AuthContext";
import { useGetData } from "../utils/Requests/RequestService";
import SpinnerLoading from "./SpinnerLoading";
import Avatar from "react-avatar";

function DropdownProfile({ align }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const trigger = useRef(null);
  const dropdown = useRef(null);
  const { logout, user: responsable } = useAuth();

  //logout function
  const logoutF = async (id) => {
    setDropdownOpen(!dropdownOpen);
    await logout();
  };

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  return (
    <div className="relative inline-flex">
      <button
        ref={trigger}
        className="inline-flex items-center justify-center group"
        aria-haspopup="true"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-expanded={dropdownOpen}
      >
        {responsable && (
          <Avatar
            name={`${responsable.nom} ${responsable.prenom}`}
            round={true}
            src={responsable.photoProfileLien} // Le lien de l'image
            size="32"
          />
        )}
        <div className="flex items-centertruncate">
          <span className="ml-2 text-sm font-medium text-gray-600 truncate dark:text-gray-100 group-hover:text-gray-800 dark:group-hover:text-white">
            <span className="text-xs ">
              {responsable && `${responsable.email}`}
            </span>
          </span>
          <svg
            className="w-3 h-3 ml-1 text-gray-400 fill-current shrink-0 dark:text-gray-500"
            viewBox="0 0 12 12"
          >
            <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
          </svg>
        </div>
      </button>

      <Transition
        className={`origin-top-right z-10 absolute top-full min-w-44 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/60 py-1.5 rounded-lg shadow-lg overflow-hidden mt-1 ${
          align === "right" ? "right-0" : "left-0"
        }`}
        show={dropdownOpen}
        enter="transition ease-out duration-200 transform"
        enterStart="opacity-0 -translate-y-2"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-out duration-200"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
      >
        <div
          ref={dropdown}
          onFocus={() => setDropdownOpen(true)}
          onBlur={() => setDropdownOpen(false)}
        >
          <div className="pt-0.5 pb-2 px-3 mb-1 border-b border-gray-200 dark:border-gray-700/60">
            <div className="font-medium text-gray-800 dark:text-gray-100">
              {responsable && `${responsable.nom} ${responsable.prenom}`}
            </div>
            <div className="text-xs italic text-gray-500 dark:text-gray-400">
              {responsable && `${responsable?.postes || responsable.poste}`}
            </div>
          </div>
          <ul>
            {/* <li>
              <Link
                className="flex items-center px-3 py-1 text-xs font-medium text-violet-500 hover:text-violet-600 dark:hover:text-violet-400"
                onClick={() =>{console.log('Mot de passe oublier....')}}
              >
                Mot de passe oublier ?
              </Link>
            </li> */}
            <li>
              <Link
                className="flex items-center px-3 py-1 text-sm font-medium text-violet-500 hover:text-violet-600 dark:hover:text-violet-400"
                onClick={() => logoutF()}
              >
                Déconnexion
              </Link>
            </li>
          </ul>
        </div>
      </Transition>
    </div>
  );
}

export default DropdownProfile;

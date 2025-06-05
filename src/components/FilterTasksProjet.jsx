import React from "react";
import { set } from "react-hook-form";

function FilterTasksProjet({ setFilter, filter, setKeyword }) {
  return (
    <ul className="flex flex-wrap -m-1">
      <li className="m-1">
        <button
          onClick={() => {
            setFilter({
              all: true,
              important: false,
              urgent: false,
              enRetard: false,
              search: false,
            });
          }}
          className={`inline-flex items-center justify-center text-xs font-medium leading-5 rounded-full px-3 py-1 border border-transparent shadow-sm ${
            filter.all
              ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-800"
              : "bg-white text-gray-500 dark:bg-gray-800 dark:text-gray-400"
          } transition`}
        >
          Tout les taches
        </button>
      </li>
      <li className="m-1">
        <button
          onClick={() => {
            setFilter({
              all: false,
              important: true,
              urgent: false,
              enRetard: false,
              search: false,
            });
          }}
          className={`inline-flex items-center justify-center text-xs font-medium leading-5 rounded-full px-3 py-1 border border-transparent shadow-sm ${
            filter.important
              ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-800"
              : "bg-white text-gray-500 dark:bg-gray-800 dark:text-gray-400"
          } transition`}
        >
          important
        </button>
      </li>
      <li className="m-1">
        <button
          onClick={() => {
            setFilter({
              all: false,
              important: false,
              urgent: true,
              enRetard: false,
              search: false,
            });
          }}
          className={`inline-flex items-center justify-center text-xs font-medium leading-5 rounded-full px-3 py-1 border border-transparent shadow-sm ${
            filter.urgent
              ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-800"
              : "bg-white text-gray-500 dark:bg-gray-800 dark:text-gray-400"
          } transition`}
        >
          urgent
        </button>
      </li>
      <li className="m-1">
        <button
          onClick={() => {
            setFilter({
              all: false,
              important: false,
              urgent: false,
              enRetard: true,
              search: false,
            });
          }}
          className={`inline-flex items-center justify-center text-xs font-medium leading-5 rounded-full px-3 py-1 border border-transparent shadow-sm ${
            filter.enRetard
              ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-800"
              : "bg-white text-gray-500 dark:bg-gray-800 dark:text-gray-400"
          } transition`}
        >
          En retard
        </button>
      </li>
      <li className="m-1">
        <button
          onClick={() => {
            setFilter({
              all: false,
              important: false,
              urgent: false,
              enRetard: false,
              search: !filter.search,
            });
          }}
          className={`inline-flex items-center justify-center text-xs font-medium leading-5 rounded-full px-3 py-1 border border-transparent shadow-sm ${
            filter.search
              ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-800"
              : "bg-white text-gray-500 dark:bg-gray-800 dark:text-gray-400"
          } transition`}
        >
          {!filter.search && (
            <svg
              className="ml-3 mr-2 text-gray-400 fill-current shrink-0 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M7 14c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zM7 2C4.243 2 2 4.243 2 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5z" />
              <path d="M15.707 14.293L13.314 11.9a8.019 8.019 0 01-1.414 1.414l2.393 2.393a.997.997 0 001.414 0 .999.999 0 000-1.414z" />
            </svg>
          )}
          Recherche
        </button>
      </li>
      {filter.search && (
        <li className="text-xs">
          <form className="relative">
            <label htmlFor="action-search" className="sr-only">
              Search
            </label>
            <input
              id="action-search"
              onChange={(e) => setKeyword(e.target.value)}
              className="form-input text-xs pl-9 py-1.75 dark:bg-gray-800 focus:border-gray-300 w-full"
              type="search"
            />
            <button
              className="absolute inset-0 right-auto group"
              type="submit"
              aria-label="Search"
            >
              <svg
                className="ml-3 mr-2 text-gray-400 fill-current shrink-0 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400"
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
        </li>
      )}
    </ul>
  );
}

export default FilterTasksProjet;

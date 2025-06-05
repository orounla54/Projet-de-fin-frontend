import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Transition from "../utils/Transition";
import { useGetData } from "../utils/Requests/RequestService";
import SpinnerLoading from "./SpinnerLoading";

function ModalSearch({ id, searchId, modalOpen, setModalOpen }) {
  const modalContent = useRef(null);
  const searchInput = useRef(null);
  const [keyword, setKeyword] = useState("");
  const [resultats, setResultats] = useState([]);

  const { data, loading, error, fetchData } = useGetData(
    `/search/taches?keyword=${keyword}`
  );

  useEffect(() => {
    setResultats(data);
    // console.log("###RESULT VISIONNE####");
    // console.log(resultats);
    // console.log("###RESULT VISIONNE####");
  }, [data]);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!modalOpen || modalContent.current.contains(target)) return;
      setModalOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!modalOpen || keyCode !== 27) return;
      setModalOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  useEffect(() => {
    modalOpen && searchInput.current.focus();
  }, [modalOpen]);

  return (
    <>
      {/* Modal backdrop */}
      <Transition
        className="fixed inset-0 z-50 transition-opacity bg-gray-900 bg-opacity-30"
        show={modalOpen}
        enter="transition ease-out duration-200"
        enterStart="opacity-0"
        enterEnd="opacity-100"
        leave="transition ease-out duration-100"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
        aria-hidden="true"
      />
      {/* Modal dialog */}
      <Transition
        id={id}
        className="fixed inset-0 z-50 flex items-start justify-center px-4 mb-4 overflow-hidden top-20 sm:px-6"
        role="dialog"
        aria-modal="true"
        show={modalOpen}
        enter="transition ease-in-out duration-200"
        enterStart="opacity-0 translate-y-4"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-in-out duration-200"
        leaveStart="opacity-100 translate-y-0"
        leaveEnd="opacity-0 translate-y-4"
      >
        <div
          ref={modalContent}
          className="w-full max-w-2xl max-h-full overflow-auto bg-white border border-transparent rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700/60"
        >
          {/* Search form */}
          <form className="border-b border-gray-200 dark:border-gray-700/60">
            <div className="relative">
              <label htmlFor={searchId} className="sr-only">
                Search
              </label>
              <input
                id={searchId}
                className="w-full py-3 pl-10 pr-4 placeholder-gray-400 bg-white border-0 appearance-none dark:text-gray-300 dark:bg-gray-800 focus:ring-transparent dark:placeholder-gray-500"
                type="search"
                placeholder="Rechercher une tache ici..."
                ref={searchInput}
                onChange={async (e) => {
                  await fetchData();
                  setKeyword(e.target.value);
                }}
              />
              <button
                className="absolute inset-0 right-auto group"
                aria-label="Search"
                disabled
              >
                <svg
                  className="ml-4 mr-2 text-gray-400 fill-current shrink-0 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M7 14c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zM7 2C4.243 2 2 4.243 2 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5z" />
                  <path d="M15.707 14.293L13.314 11.9a8.019 8.019 0 01-1.414 1.414l2.393 2.393a.997.997 0 001.414 0 .999.999 0 000-1.414z" />
                </svg>
              </button>
            </div>
          </form>
          <div className="px-2 py-4">
            {/* Result searches */}
            <div className="mb-3 last:mb-0">
              <div className="px-2 mb-2 text-xs font-semibold text-gray-400 uppercase dark:text-gray-500">
                Resultats
              </div>
              <ul className="text-sm">
                {loading ? (
                  <SpinnerLoading />
                ) : error ? (
                  <li className="p-2 text-red-500 dark:text-red-400">
                    Une erreur s'est produite : {error.message}
                  </li>
                ) : Array.isArray(resultats) && resultats.length > 0 ? (
                  resultats.slice(0, 7).map((resultat, index) => (
                    <li key={index}>
                      <Link
                        className="flex items-center p-2 text-gray-800 rounded-lg dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700/20"
                        to={`/taches/${resultat.id}`}
                        onClick={() => setModalOpen(!modalOpen)}
                      >
                        <svg
                          className="mr-3 text-gray-400 fill-current dark:text-gray-500 shrink-0"
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                        >
                          <path d="M15.707 14.293v.001a1 1 0 01-1.414 1.414L11.185 12.6A6.935 6.935 0 017 14a7.016 7.016 0 01-5.173-2.308l-1.537 1.3L0 8l4.873 1.12-1.521 1.285a4.971 4.971 0 008.59-2.835l1.979.454a6.971 6.971 0 01-1.321 3.157l3.107 3.112zM14 6L9.127 4.88l1.521-1.28a4.971 4.971 0 00-8.59 2.83L.084 5.976a6.977 6.977 0 0112.089-3.668l1.537-1.3L14 6z" />
                        </svg>
                        <span>{resultat.libelle}</span>
                      </Link>
                    </li>
                  ))
                ) : (
                  <li className="p-2 text-gray-500 dark:text-gray-400">
                    Aucun résultat trouvé...
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </Transition>
    </>
  );
}

export default ModalSearch;

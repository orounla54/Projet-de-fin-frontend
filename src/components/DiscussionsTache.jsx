import React, { useEffect, useState } from "react";
import SearchForm from "../partials/actions/SearchForm";
import DiscussionTacheItems from "./DiscussionTacheItems";
import PaginationNumeric from "./PaginationNumeric";
import { useGetData } from "../utils/Requests/RequestService";
import AddDiscutionTache from "./AddDiscutionTache";

function DiscussionsTache({ tache, sizeTitle }) {
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [discussionsTache, setDiscussionsTache] = useState([]);
  const [search, setSearch] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  // Construire dynamiquement l'URL en fonction de l'existence de `filter`
  const queryParams = new URLSearchParams({
    keyword: keyword,
  }).toString();

  // Récupérer les données avec les paramètres de filtre conditionnels
  const { data, loading, error, fetchData } = useGetData(
    `discussions${tache?.id ? "/tache/"+ tache?.id : ""}?${queryParams}`
  );

  useEffect(() => {
    if (data) {
      setDiscussionsTache(data);
    }
    console.log(discussionsTache);
  }, [tache, data]);

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const current = discussionsTache.slice(indexOfFirst, indexOfLast);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      {/* Page header */}
      <div className="mb-5">
        {/* Left: Title */}
        <div className="mb-4 sm:mb-0">
          <h1
            className={`${
              sizeTitle ? "text-2xl md:text-2xl " : "text-lg md:text-lg "
            }font-bold text-gray-800  dark:text-gray-100`}
          >
            Discussions
          </h1>
        </div>

        {/* Right: Actions */}
        <div className="grid grid-flow-col gap-2 lg:justify-end sm:auto-cols-max">
          {/* Search form */}
          {search && (
            <SearchForm
              fetchData={fetchData}
              setKeyword={setKeyword}
              placeholder="Recherche..."
            />
          )}
          <button
            className="btn px-2.5 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 disabled:border-gray-200 dark:disabled:border-gray-700 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-400 dark:disabled:text-gray-600 disabled:cursor-not-allowed"
            onClick={() => {
              setSearch(!search);
            }}
          >
            <span className="sr-only">Next month</span>
            <wbr />
            <svg
              className="text-gray-400 fill-current dark:text-gray-500"
              width="16"
              height="16"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          {/* Add meetup button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setFeedbackModalOpen(true);
            }}
            className="text-gray-100 bg-gray-900 btn hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
          >
            <svg
              className="fill-current shrink-0 xs:hidden"
              width="16"
              height="16"
              viewBox="0 0 16 16"
            >
              <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
            </svg>
            <span className="max-xs:sr-only">Ajouter</span>
          </button>
          <AddDiscutionTache
            feedbackModalOpen={feedbackModalOpen}
            setFeedbackModalOpen={setFeedbackModalOpen}
            tache={tache}
            fetchData={fetchData}
          />
        </div>
        <div className="mb-4 text-sm italic text-gray-500 dark:text-gray-400">
          {discussionsTache ? discussionsTache.length : 0} Discussions
        </div>
        <div className="flex items-center justify-start mb-4">
          {discussionsTache && discussionsTache.length > itemsPerPage && (
            <PaginationNumeric
              itemsPerPage={itemsPerPage}
              totalItems={discussionsTache.length}
              paginate={paginate}
              currentPage={currentPage}
            />
          )}
        </div>

        {/* Content */}
        <DiscussionTacheItems
          error={error}
          loading={loading}
          discussions={discussionsTache}
        />

        <div className="flex items-center justify-end mt-8">
          {discussionsTache && discussionsTache.length > itemsPerPage && (
            <PaginationNumeric
              itemsPerPage={itemsPerPage}
              totalItems={discussionsTache.length}
              paginate={paginate}
              currentPage={currentPage}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default DiscussionsTache;

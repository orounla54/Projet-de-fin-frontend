import React, { useState } from "react";
import ChannelMenu from "./ChannelMenu";
import DirectMessages from "./DirectMessages";
import Channels from "./Channels";
import AddDiscutionTache from "../../components/AddDiscutionTache";

function MessagesSidebar({
  msgSidebarOpen,
  setMsgSidebarOpen,
  discussions,
  idDiscussionCurrent,
  DiscussionsError,
  setKeyword,
  setFeedbackModalOpen,
  fetchDiscussions,
}) {

  // console.log("MessagesSidebar discussions", discussions);

  return (
    <div
      id="messages-sidebar"
      className={`absolute z-20 top-0 bottom-0 w-full md:w-auto md:static md:top-auto md:bottom-auto -mr-px md:translate-x-0 transition-transform duration-200 ease-in-out ${
        msgSidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="sticky top-16 bg-white dark:bg-[#151D2C] overflow-x-hidden overflow-y-auto no-scrollbar shrink-0 border-r border-gray-200 dark:border-gray-700/60 md:w-[18rem] xl:w-[20rem] h-[calc(100dvh-64px)]">
        {/* #Marketing group */}
        <div>
          {/* Group header */}
          <div className="sticky top-0 z-10">
            <div className="flex items-center bg-white dark:bg-[#151D2C] border-b border-gray-200 dark:border-gray-700/60 px-5 h-16">
              <div className="flex items-center justify-between w-full">
                {/* Channel menu */}
                <ChannelMenu />
                {/* Edit button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setFeedbackModalOpen(true);
                  }}
                  className="p-1.5 shrink-0 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 shadow-sm ml-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-4"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          {/* Group body */}
          <div className="px-5 py-4">
            {/* Search form */}
            <form className="relative">
              <label htmlFor="msg-search" className="sr-only">
                Search
              </label>
              <input
                id="msg-search"
                className="w-full bg-white form-input pl-9 dark:bg-gray-800"
                type="search"
                placeholder="Rechercher.."
                onChange={async (e) => {
                  await fetchDiscussions();
                  setKeyword(e.target.value);
                }}
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
            {/* Direct messages */}
            {DiscussionsError ? (
              <div className="mt-5 text-center text-gray-500 dark:text-gray-400">
                <p className="text-xs text-center text-red-500">
                  Erreur lors du chargement des discussions
                </p>
              </div>
            ) : (
              ""
            )}
            {discussions.length > 0 ? (
              <DirectMessages
                msgSidebarOpen={msgSidebarOpen}
                setMsgSidebarOpen={setMsgSidebarOpen}
                discussions={discussions}
                idDiscussionCurrent={idDiscussionCurrent}
              />
            ) : (
              <div className="mt-5 text-xs text-center text-gray-500 dark:text-gray-400">
                <p>Aucune discussion trouvée...</p>
              </div>
            )}
            {/* Channels */}
            <Channels
              msgSidebarOpen={msgSidebarOpen}
              setMsgSidebarOpen={setMsgSidebarOpen}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MessagesSidebar;

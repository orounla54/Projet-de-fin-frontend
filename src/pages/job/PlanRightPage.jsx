import React from "react";

function PlanRightPage({ handleLabel, handleLabelE, sousPage, setSousPage }) {
  return (
    <div className="w-full mb-8 md:mb-0">
      <div className="md:sticky md:top-16 md:overflow-x-hidden md:overflow-y-auto no-scrollbar">
        <div className="md:py-8">
          {/* Links */}
          <div className="flex px-4 -mx-4 overflow-x-scroll flex-nowrap no-scrollbar md:block md:overflow-auto md:space-y-3">
            {/* Group 1 */}
            <div>
              <ul className="flex mr-3 flex-nowrap md:block md:mr-0">
                <li className="mr-0.5 md:mr-0 md:mb-0.5 cursor-pointer">
                  <a
                    className={`flex items-center justify-end px-2.5 py-2 rounded-lg whitespace-nowrap ${
                      sousPage === "home" ? "bg-white dark:bg-gray-800" : ""
                    } `}
                    onClick={() => setSousPage("home")}
                  >
                    <span
                      className={`text-sm font-bold ${
                        sousPage === "home"
                          ? "text-gray-900 dark:text-gray-100"
                          : "text-gray-500 dark:text-gray-400"
                      } `}
                    >
                      {handleLabelE()}
                    </span>
                  </a>
                </li>
                <li className="mr-0.5 md:mr-0 md:mb-0.5 cursor-pointer">
                  <a
                    className={`flex items-center justify-end px-2.5 py-2 rounded-lg whitespace-nowrap ${
                      sousPage === "child1" ? "bg-white dark:bg-gray-800" : ""
                    } `}
                    onClick={() => setSousPage("child1")}
                  >
                    <span
                      className={`text-sm font-bold ${
                        sousPage === "child1"
                          ? "text-gray-900 dark:text-gray-100"
                          : "text-gray-500 dark:text-gray-400"
                      } `}
                    >
                      {handleLabel()}
                    </span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlanRightPage;

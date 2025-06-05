import React from "react";

import LibelleFormat from "../../components/LibelleFormat";
import { Link } from "react-router-dom";
import Avatar from "react-avatar";
import SpinnerLoading from "../../components/SpinnerLoading";

function AnalyticsCard11({
  topConstributionTask,
  responsable,
  taskContributionError,
  taskContributionLoading,
}) {
  return (
    <div className="bg-white shadow-sm col-span-full dark:bg-gray-800 rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">
          Top contribution
        </h2>
      </header>
      <div className="p-3">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto dark:text-gray-300">
            {/* Table header */}
            <thead className="text-xs text-gray-400 uppercase rounded-sm dark:text-gray-500 bg-gray-50 dark:bg-gray-700 dark:bg-opacity-50">
              <tr>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-left">Libelle</div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-left">Responsables</div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-center">Categorie</div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-center">Type</div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-center">CR</div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-center">
                    Total sous taches
                  </div>
                </th>
              </tr>
            </thead>
            {/* Table body */}
            <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700/60">
              {/* Row */}
              {taskContributionError && (
                <>
                  <tr>
                    <td
                      colSpan="6"
                      className="p-2 text-center text-gray-500 dark:text-gray-400"
                    >
                      <p className="text-xs text-red-500">
                        error lors de la recuperation des données..
                      </p>
                    </td>
                  </tr>
                </>
              )}
              {taskContributionLoading && (
                <>
                  {" "}
                  <tr>
                    <td
                      colSpan="6"
                      className="p-2 text-center text-gray-500 dark:text-gray-400"
                    >
                      <SpinnerLoading />
                    </td>
                  </tr>
                </>
              )}
              {topConstributionTask && topConstributionTask.length > 0 ? (
                <>
                  {topConstributionTask.slice(0, 5).map((task, index) => (
                    <tr>
                      <td className="p-2 whitespace-nowrap">
                        <div className="flex items-center">
                          {!(
                            responsable &&
                            responsable.id === parseInt(task.Responsable_Prin)
                          ) ? (
                            <>
                              <div className="mr-2 bg-green-500 rounded-full shrink-0 sm:mr-3">
                                <svg
                                  className="text-white fill-current w-9 h-9"
                                  viewBox="0 0 36 36"
                                >
                                  <path d="M11 22.012a1 1 0 01-.707-1.707l4.5-4.5a1 1 0 011.414 0l3.293 3.293 4.793-4.793a1 1 0 111.414 1.414l-5.5 5.5a1 1 0 01-1.414 0L15.5 17.926l-3.793 3.793a1 1 0 01-.707.293z" />
                                </svg>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="mr-2 rounded-full shrink-0 sm:mr-3 bg-violet-500">
                                <svg
                                  className="text-white fill-current w-9 h-9"
                                  viewBox="0 0 36 36"
                                >
                                  <path d="M24.446 19.335a2.5 2.5 0 00-3.522 3.194c-.845.63-1.87.97-2.924.971a4.979 4.979 0 01-1.113-.135 4.436 4.436 0 01-1.343 1.682 6.91 6.91 0 006.9-1.165 2.5 2.5 0 002-4.547h.002zM20.431 11.938a2.5 2.5 0 10-.4 2.014 5.027 5.027 0 012.723 3.078c.148-.018.297-.028.446-.03a4.5 4.5 0 011.7.334 7.023 7.023 0 00-4.469-5.396zM14.969 20.25a2.49 2.49 0 00-1.932-1.234A4.624 4.624 0 0113 18.5a4.97 4.97 0 011.348-3.391 4.456 4.456 0 01-.788-2.016A6.989 6.989 0 0011 18.5c.003.391.04.781.11 1.166a2.5 2.5 0 103.859.584z" />
                                </svg>
                              </div>
                            </>
                          )}

                          <div className="mr-1 font-medium text-gray-800 dark:text-gray-100">
                            {task && task.libelle ? (
                              <Link to={`/taches/${task && task.id}`}>
                                <LibelleFormat libelle={task.libelle} />
                              </Link>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <div className="flex -ml-px -space-x-3 shrink-0">
                          {task && task.Responsables ? (
                            <>
                              {task.Responsables.map((responsable, index) => (
                                <a className="block" href="#0">
                                  <Avatar
                                    name={`${responsable.nom} ${responsable.prenom}`}
                                    round={true}
                                    size="26"
                                    src={responsable.photoProfileLien} // Le lien de l'image
                                  />
                                </a>
                              ))}
                            </>
                          ) : (
                            <></>
                          )}
                        </div>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <div className="flex items-center text-xs font-bold">
                          {task && task.categorie ? (
                            <>
                              <LibelleFormat libelle={task.categorie} />
                            </>
                          ) : (
                            <span className="text-xs">
                              Aucune catégorie ajoutée
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <div className="text-xs font-bold text-center">
                          {task && task.typeTache ? (
                            <>
                              <LibelleFormat libelle={task.typeTache} />
                            </>
                          ) : (
                            <span className="text-xs">Aucun type ajoutée</span>
                          )}
                        </div>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <div className="flex items-center justify-center text-lg text-center">
                          {/* Like button */}
                          {task && task.important ? (
                            <>
                              <button className="flex items-center">
                                <svg
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  className="size-5 fill-yellow-500"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </button>
                            </>
                          ) : (
                            <></>
                          )}
                          {task && task.private ? (
                            <>
                              <button className="flex items-center">
                                <svg
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  className="size-5 fill-blue-400"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M15.75 1.5a6.75 6.75 0 0 0-6.651 7.906c.067.39-.032.717-.221.906l-6.5 6.499a3 3 0 0 0-.878 2.121v2.818c0 .414.336.75.75.75H6a.75.75 0 0 0 .75-.75v-1.5h1.5A.75.75 0 0 0 9 19.5V18h1.5a.75.75 0 0 0 .53-.22l2.658-2.658c.19-.189.517-.288.906-.22A6.75 6.75 0 1 0 15.75 1.5Zm0 3a.75.75 0 0 0 0 1.5A2.25 2.25 0 0 1 18 8.25a.75.75 0 0 0 1.5 0 3.75 3.75 0 0 0-3.75-3.75Z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </button>
                            </>
                          ) : (
                            <>
                              <button className="flex items-center">
                                <svg
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  className="size-5 fill-blue-400"
                                >
                                  <path d="M15.75 8.25a.75.75 0 0 1 .75.75c0 1.12-.492 2.126-1.27 2.812a.75.75 0 1 1-.992-1.124A2.243 2.243 0 0 0 15 9a.75.75 0 0 1 .75-.75Z" />
                                  <path
                                    fillRule="evenodd"
                                    d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM4.575 15.6a8.25 8.25 0 0 0 9.348 4.425 1.966 1.966 0 0 0-1.84-1.275.983.983 0 0 1-.97-.822l-.073-.437c-.094-.565.25-1.11.8-1.267l.99-.282c.427-.123.783-.418.982-.816l.036-.073a1.453 1.453 0 0 1 2.328-.377L16.5 15h.628a2.25 2.25 0 0 1 1.983 1.186 8.25 8.25 0 0 0-6.345-12.4c.044.262.18.503.389.676l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 0 1-1.161.886l-.143.048a1.107 1.107 0 0 0-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 0 1-1.652.928l-.679-.906a1.125 1.125 0 0 0-1.906.172L4.575 15.6Z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </button>
                            </>
                          )}
                          {task && task.urgent ? (
                            <>
                              <button className="flex items-center">
                                <svg
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  className="w-6 h-6 fill-orange-500"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18Zm1 5a1 1 0 1 0-2 0v4a1 1 0 1 0 2 0V8Zm-1 8.25a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5Z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </button>
                            </>
                          ) : (
                            <></>
                          )}
                        </div>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <div className="text-center">
                          {task && task.sousTaches ? (
                            <>{task.sousTaches.length}</>
                          ) : (
                            <></>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </>
              ) : (
                <>
                  <tr>
                    <td
                      colSpan="6"
                      className="p-2 text-center text-gray-500 dark:text-gray-400"
                    >
                      <p className="text-xs text-violet-500">
                        Aucune données ou données invalide..
                      </p>
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsCard11;

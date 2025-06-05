import React, { useEffect, useState } from "react";

import Sidebar from "../../partials/Sidebar";
import Header from "../../partials/Header";
import { useGetData } from "../../utils/Requests/RequestService";
import SpinnerLoading from "../../components/SpinnerLoading";
import PaginationNumeric from "../../components/PaginationNumeric";
import CompanyBg from "../../images/company-bg.jpg";
import Avatar from "react-avatar";
import NoDataResponse from "../../components/NoDataResponse";
import PrioriteResItem from "../../partials/job/PrioriteResItem";


const formatPriorites = (data) => {
  return data.map((priorite) => ({
    ...priorite,
    responsables: priorite.responsables || "[]",
    services: priorite.services || "[]",
  }));
};

function PrioritesResp_Servi({ endpoint }) {
  const [priorites, setPriorites] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [itemsPerPage] = useState(21);
  const [currentPage, setCurrentPage] = useState(1);
  const [dataGeting, setResponsable] = useState();

  // Construire dynamiquement l'URL en fonction de l'existence de `filter`
  const queryParams = new URLSearchParams({
    keyword: keyword,
  }).toString();

  const {
    data: dataGet,
    error: responsableError,
    loading: dataGetoading,
  } = useGetData(
    endpoint === "priorites/service"
      ? "service/responsables/log"
      : "responsables/log"
  );

  const { data, loading, error, fetchData } = useGetData(
    endpoint ? `${endpoint}?${queryParams}` : null
  );

  useEffect(() => {
    if (data && dataGet) {
      setPriorites(formatPriorites(data));
      setResponsable(dataGet);
    }
  }, [data, dataGet]);

  useEffect(() => {
    console.log(dataGeting);
    console.log(priorites); // ✅ Maintenant, priorites sera bien mis à jour avant d'être affiché
  }, [priorites, dataGeting]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currents = priorites.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Filtrer les tâches par statut
  const priotitesByStatus = {
    "Non démarré": priorites.filter((item) => item.status === "Non-démarré"),
    "En cours": priorites.filter((item) => item.status === "En-cours"),
    Terminé: priorites.filter((item) => item.status === "Terminé"),
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
          {loading || dataGetoading ? (
            <div className="absolute z-40 flex items-center justify-center w-full h-full bg-white dark:bg-gray-900">
              <SpinnerLoading />
            </div>
          ) : (
            <>
              {" "}
              {/* Profile background */}
              <div className="bg-gray-200 dark:bg-gray-900">
                {endpoint === "priorites/service" && (
                  <img
                    className="object-cover w-full h-full"
                    src={CompanyBg}
                    width="2560"
                    height="440"
                    alt="Company background"
                  />
                )}
              </div>
              {/* Header */}
              <header className="pb-6 text-center border-b border-gray-200 bg-white/30 dark:bg-gray-800/30 dark:border-gray-700/60">
                <div className="w-full px-4 sm:px-6 lg:px-8">
                  <div className="max-w-3xl mx-auto">
                    {/* Avatar */}
                    <div
                      className={`mb-2 ${
                        endpoint === "priorites/service" ? "-mt-12" : ""
                      }`}
                    >
                      <div
                        className={`inline-flex ${
                          endpoint === "priorites/service" ? "-mt-1" : "mt-5"
                        } -ml-1 sm:mb-0`}
                      >
                        {endpoint === "priorites/service" ? (
                          <Avatar
                            name={`${dataGeting?.libelle}`}
                            round={true}
                            size="104"
                          />
                        ) : (
                          <Avatar
                            name={`${dataGeting?.nom} ${dataGeting?.prenom}`}
                            round={true}
                            src={dataGeting?.photoProfileLien} // Le lien de l'image
                            size="104"
                          />
                        )}
                      </div>
                    </div>

                    {/* Company name and info */}
                    <div className="mb-4">
                      <h2 className="mb-2 text-2xl font-bold text-gray-800 dark:text-gray-100">
                        {endpoint === "priorites/service" ? (
                          <> {dataGeting?.libelle}</>
                        ) : (
                          <>
                            {dataGeting?.nom} {dataGeting?.prenom}
                          </>
                        )}
                      </h2>
                      <p>
                        We're building a financial superapp that combines all
                        the best tools into one place 🚀
                      </p>
                    </div>

                    {/* Meta */}
                    {endpoint === "priorites/service" ? (
                      <> </>
                    ) : (
                      <div className="inline-flex flex-wrap justify-center space-x-4 sm:justify-start">
                        <div className="flex items-center">
                          <svg
                            className="text-gray-400 fill-current shrink-0 dark:text-gray-500"
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                          >
                            <path d="M8 8.992a2 2 0 1 1-.002-3.998A2 2 0 0 1 8 8.992Zm-.7 6.694c-.1-.1-4.2-3.696-4.2-3.796C1.7 10.69 1 8.892 1 6.994 1 3.097 4.1 0 8 0s7 3.097 7 6.994c0 1.898-.7 3.697-2.1 4.996-.1.1-4.1 3.696-4.2 3.796-.4.3-1 .3-1.4-.1Zm-2.7-4.995L8 13.688l3.4-2.997c1-1 1.6-2.198 1.6-3.597 0-2.798-2.2-4.996-5-4.996S3 4.196 3 6.994c0 1.399.6 2.698 1.6 3.697 0-.1 0-.1 0 0Z" />
                          </svg>
                          <span className="ml-2 text-sm font-medium text-gray-500 whitespace-nowrap dark:text-gray-400">
                            {dataGeting?.service}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <svg
                            className="text-gray-400 fill-current shrink-0 dark:text-gray-500"
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                          >
                            <path d="M11 0c1.3 0 2.6.5 3.5 1.5 1 .9 1.5 2.2 1.5 3.5 0 1.3-.5 2.6-1.4 3.5l-1.2 1.2c-.2.2-.5.3-.7.3-.2 0-.5-.1-.7-.3-.4-.4-.4-1 0-1.4l1.1-1.2c.6-.5.9-1.3.9-2.1s-.3-1.6-.9-2.2C12 1.7 10 1.7 8.9 2.8L7.7 4c-.4.4-1 .4-1.4 0-.4-.4-.4-1 0-1.4l1.2-1.1C8.4.5 9.7 0 11 0ZM8.3 12c.4-.4 1-.5 1.4-.1.4.4.4 1 0 1.4l-1.2 1.2C7.6 15.5 6.3 16 5 16c-1.3 0-2.6-.5-3.5-1.5C.5 13.6 0 12.3 0 11c0-1.3.5-2.6 1.5-3.5l1.1-1.2c.4-.4 1-.4 1.4 0 .4.4.4 1 0 1.4L2.9 8.9c-.6.5-.9 1.3-.9 2.1s.3 1.6.9 2.2c1.1 1.1 3.1 1.1 4.2 0L8.3 12Zm1.1-6.8c.4-.4 1-.4 1.4 0 .4.4.4 1 0 1.4l-4.2 4.2c-.2.2-.5.3-.7.3-.2 0-.5-.1-.7-.3-.4-.4-.4-1 0-1.4l4.2-4.2Z" />
                          </svg>
                          <a
                            className="ml-2 text-sm font-medium whitespace-nowrap text-violet-500 hover:text-violet-600 dark:hover:text-violet-400"
                            href="#0"
                          >
                            revolut.com
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </header>
              {/* Page content */}
              <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                  <div className="grid justify-start grid-flow-col gap-2 mb-6 sm:auto-cols-max sm:justify-end">
                    <form className="relative">
                      <input
                        id="action-search"
                        onChange={async (e) => {
                          setKeyword(e.target.value);
                          await fetchData();
                        }}
                        className="form-input text-xs pl-9 py-1.75 dark:bg-gray-800 focus:border-gray-300 w-60"
                        type="search"
                        placeholder="Rechercher le titre ou le mot-clé..."
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
                  </div>

                  {/*content */}
                  <div className="space-y-6">
                    {error ? (
                      <p className="text-xs text-center text-red-500">
                        Erreur lors de la récupération des données :{" "}
                        {error.message}
                      </p>
                    ) : priorites.length < 1 ? (
                      <NoDataResponse keyword={keyword} />
                    ) : (
                      <>
                        {Object.entries(priotitesByStatus).map(
                          ([status, priotites]) =>
                            priotites.length > 0 && (
                              <div key={status} className="mb-12">
                                <h2 className="mb-4 font-semibold text-gray-800 truncate grow dark:text-gray-100">
                                  {status}{" "}
                                  <span className="text-violet-500">
                                    ({priotites.length})
                                  </span>
                                </h2>
                                <div className="space-y-2">
                                  {priotites.map((item) => (
                                    <PrioriteResItem
                                      key={item.id}
                                      id={item.id}
                                      libelle={item.libelle}
                                      description={item.description}
                                      dateInscription={item.dateInscription}
                                      typePriorite={item.typePriorite}
                                      status={item.status}
                                      new={item.new}
                                      progress={item.progress}
                                      code={item.code}
                                      responsables={item.responsables}
                                      services={item.services}
                                    />
                                  ))}
                                </div>
                              </div>
                            )
                        )}
                      </>
                    )}
                    {priorites.length > itemsPerPage && (
                      <div className="flex justify-end pt-2">
                        <PaginationNumeric
                          currentPage={currentPage}
                          itemsPerPage={itemsPerPage}
                          totalItems={priorites.length}
                          paginate={paginate}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default PrioritesResp_Servi;

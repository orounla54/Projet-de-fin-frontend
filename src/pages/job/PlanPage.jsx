import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../partials/Sidebar";
import Header from "../../partials/Header";
import { useGetData } from "../../utils/Requests/RequestService";

import Image06 from "../../images/company-icon-01.svg";
import SpinnerLoading from "../../components/SpinnerLoading";
import PlanRightPage from "./PlanRightPage";
import DateRefactor1 from "../../components/DateRefactor1";
import AddPlanStrategique from "../../components/AddPlanStrategique";
import ManageAxesStrategiqueToObjectifOpera from "../../components/ManageAxesStrategiqueToObjectifOpera";
import DescriptionFormat from "../../components/DescriptionFormat";
import CircleProgress from "../../charts/CircleProgress";
import PlanChild from "./PlanChild";
import DangerModal from "../../components/DangerModal";

function PlanPage({ page }) {
  const handleLabel = () => {
    if (page === "axesStrategiques") {
      return "Objectifs strategique";
    } else if (page === "objectifsStrategiques") {
      return "Mesures strategique";
    } else if (page === "mesuresStrategiques") {
      return "Objectifs operationnel";
    } else if (page === "objectifsOperationnels") {
      return "Priorites";
    } else {
      return "Axes strategique";
    }
  };

  const handleLabelE = () => {
    if (page === "axesStrategiques") {
      return "Axe strategique";
    } else if (page === "objectifsStrategiques") {
      return "Objectif strategique";
    } else if (page === "mesuresStrategiques") {
      return "Mesures strategique";
    } else if (page === "objectifsOperationnels") {
      return "Objectif operationnel ";
    } else {
      return "Plan strategique";
    }
  };

  const { id } = useParams();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [element, setElement] = useState();
  const [sousPage, setSousPage] = useState("home");

  // Récupère les données via le hook personnalisé
  const { data, loading, error, fetchData } = useGetData(
    id ? `${page}/${id}` : ""
  );

  useEffect(() => {
    if (data) {
      setElement(data);
    }
  }, [data]);

  useEffect(() => {
    console.log(element); // ✅ Maintenant, plans sera bien mis à jour avant d'être affiché
  }, [element]);

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="relative flex flex-col flex-1 overflow-x-hidden overflow-y-auto">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="relative grow">
          {loading ? (
            <div className="absolute z-40 flex items-center justify-center w-full h-full bg-white dark:bg-gray-900">
              <SpinnerLoading />
            </div>
          ) : (
            <>
              <div className="w-full py-8 sm:px-6 lg:px-8">
                {/* Page content */}
                <div className="flex flex-col mx-auto max-w-7xl lg:flex-row lg:space-x-4 xl:space-x-8">
                  {/* Content */}
                  <div className="relative mx-4 lg:w-4/5 xl:w-3/4">
                    <div className="mb-6">
                      <button
                        className="px-3 text-gray-800 bg-white border-gray-200 btn-sm dark:bg-gray-800 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 dark:text-gray-300"
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
                      </button>
                    </div>
                    <div className="flex flex-wrap justify-between">
                      <div className="mb-2 text-sm italic text-gray-500 dark:text-gray-400">
                        Ajouter le{" "}
                        <DateRefactor1 date={element?.dateInscription} />
                      </div>
                      <Link
                        to={`/plans${
                          page === "axesStrategiques"
                            ? ""
                            : page === "objectifsStrategiques"
                            ? "/axesStrategiques"
                            : page === "mesuresStrategiques"
                            ? "/objectifsStrategiques"
                            : page === "objectifsOperationnels"
                            ? "/mesuresStrategiques"
                            : ""
                        }/${
                          page === "axesStrategiques"
                            ? element?.idPlanStrategique
                            : page === "objectifsStrategiques"
                            ? element?.idAxeStrategique
                            : page === "mesuresStrategiques"
                            ? element?.idObjectifStrategique
                            : page === "objectifsOperationnels"
                            ? element?.idMesure
                            : ""
                        }`}
                        className="items-center text-xs font-semibold uppercase text-violet-400"
                      >
                        {page === "axesStrategiques"
                          ? element?.planStrategique
                          : page === "objectifsStrategiques"
                          ? element?.axeStrategique
                          : page === "mesuresStrategiques"
                          ? element?.objectifStrategique
                          : page === "objectifsOperationnels"
                          ? element?.mesure
                          : ""}
                      </Link>
                    </div>
                    <header className="mb-4">
                      {/* Title */}
                      <h1 className="text-2xl font-bold text-gray-800 md:text-3xl dark:text-gray-100">
                        {element?.libelle}
                      </h1>
                    </header>

                    {/* Company information (mobile) */}
                    <div className=" lg:hidden">
                      <div className="p-5 mb-6 bg-white shadow-lg dark:bg-gray-800 rounded-xl">
                        <div className="mb-6 text-center">
                          <div className="inline-flex mb-3">
                            <CircleProgress
                              width="64"
                              height="64"
                              value={element?.progress}
                            />
                          </div>
                          <div className="mb-1 text-lg font-bold text-gray-800 dark:text-gray-100">
                            Progressions
                          </div>
                        </div>
                        <div className="space-y-2 sm:flex sm:space-y-0 sm:space-x-2">
                          <button className="w-full text-gray-100 bg-gray-900 btn hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white">
                            Apply Today -&gt;
                          </button>
                        </div>
                      </div>
                      <PlanRightPage
                        handleLabel={handleLabel}
                        handleLabelE={handleLabelE}
                        sousPage={sousPage}
                        setSousPage={setSousPage}
                      />
                    </div>

                    {/* Tags */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex flex-wrap items-center -m-1">
                        {element?.status && (
                          <div
                            className={`text-xs inline-flex rounded-full text-center px-2.5 py-1 ${
                              element?.status === "En-cours"
                                ? "bg-yellow-500/20 text-yellow-700"
                                : element?.status === "Terminé"
                                ? "bg-green-500/20 text-green-700"
                                : "bg-gray-500/20 text-gray-500 dark:text-gray-400"
                            }`}
                          >
                            {element?.status}
                          </div>
                        )}
                        {element?.new === 1 && (
                          <div
                            className={`text-xs bg-green-500/20 text-green-700 inline-flex font-medium rounded-full text-center  px-2 py-1 `}
                          >
                            Nouveau
                          </div>
                        )}
                      </div>
                      <div className="m-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setFeedbackModalOpen(true);
                          }}
                          className="btn-xs text-xs border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-gray-800 dark:text-gray-300 px-2.5 py-1 rounded-full shadow-none"
                        >
                          Modifier
                        </button>
                      </div>
                    </div>

                    <hr className="my-6 border-t border-gray-100 dark:border-gray-700/60" />
                    {sousPage === "home" ? (
                      <>
                        <div>
                          {/* The Description */}
                          <div>
                            <h2 className="mb-2 text-xl font-bold leading-snug text-gray-800 dark:text-gray-100">
                              Description
                            </h2>
                            <div className="space-y-6">
                              <DescriptionFormat
                                length={2500}
                                description={element?.description}
                              />
                            </div>
                          </div>

                          {/* Information supplementaire */}
                          {element?.infoSup && (
                            <>
                              <hr className="my-6 border-t border-gray-100 dark:border-gray-700/60" />
                              <div>
                                <h2 className="mb-2 text-xl font-bold leading-snug text-gray-800 dark:text-gray-100">
                                  Information supplementaire
                                </h2>
                                <div className="">
                                  {element?.infoSup &&
                                    element?.infoSup
                                      .split("\n")
                                      .map((paragraph, index) => (
                                        <p key={index} className="mb-2">
                                          {paragraph.trim()}
                                        </p>
                                      ))}
                                </div>
                              </div>
                            </>
                          )}

                          <hr className="my-6 border-t border-gray-100 dark:border-gray-700/60" />

                          {/* Apply section */}
                          <div className="mt-6">
                            <p className="mb-6 italic text-red-500">
                              Cliquez sur le bouton pour supprimer
                            </p>
                            <div className="flex items-center justify-between">
                              {/* Apply button */}
                              <button className="flex items-center justify-center border-2 border-red-500 bg-gray-50 dark:bg-gray-900 btn dark:hover:bg-gray-800 whitespace-nowrap">
                                <DangerModal
                                  refreshList={() => {
                                    navigate(-1);
                                  }}
                                  endpoint={page}
                                  idObjet={element?.id}
                                  libelleObjet={element?.libelle}
                                />
                              </button>
                              {/* Share */}
                              <div className="flex items-center">
                                <div className="mr-4 text-sm italic text-gray-500 dark:text-gray-400">
                                  Share:
                                </div>
                                <div className="flex items-center space-x-3">
                                  <button className="text-gray-400 dark:text-gray-500 hover:text-violet-500 dark:hover:text-violet-500">
                                    <span className="sr-only">Share on X</span>
                                    <svg
                                      className="fill-current"
                                      width="16"
                                      height="16"
                                      viewBox="0 0 16 16"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path d="M16 15h-4.938l-3.865-4.892L2.77 15H.316L6.05 8.658 0 1h5.063l3.496 4.476L12.601 1h2.454L9.697 6.932 16 15Zm-4.26-1.421h1.36L4.323 2.347H2.865l8.875 11.232Z" />
                                    </svg>
                                  </button>
                                  <button className="text-gray-400 dark:text-gray-500 hover:text-violet-500 dark:hover:text-violet-500">
                                    <span className="sr-only">
                                      Share on Facebook
                                    </span>
                                    <svg
                                      className="fill-current"
                                      width="16"
                                      height="16"
                                      viewBox="0 0 16 16"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path d="M6.023 16 6 9H3V6h3V4c0-2.7 1.672-4 4.08-4 1.153 0 2.144.086 2.433.124v2.821h-1.67c-1.31 0-1.563.623-1.563 1.536V6H13l-1 3H9.28v7H6.023Z" />
                                    </svg>
                                  </button>
                                  <button className="text-gray-400 dark:text-gray-500 hover:text-violet-500 dark:hover:text-violet-500">
                                    <span className="sr-only">
                                      Share on Linkedin
                                    </span>
                                    <svg
                                      className="fill-current"
                                      width="16"
                                      height="16"
                                      viewBox="0 0 16 16"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path d="M0 1.146C0 .514.53 0 1.182 0h13.635C15.471 0 16 .513 16 1.146v13.708c0 .633-.53 1.146-1.183 1.146H1.182C.53 16 0 15.487 0 14.854V1.146ZM4.862 13.39V6.187H2.468v7.203h2.394ZM3.666 5.203c.834 0 1.354-.553 1.354-1.244-.016-.707-.52-1.245-1.338-1.245-.82 0-1.355.538-1.355 1.245 0 .691.52 1.244 1.323 1.244h.015Zm2.522 8.187h2.394V9.368c0-.215.015-.43.078-.584.173-.43.567-.876 1.229-.876.866 0 1.213.66 1.213 1.629v3.853h2.394V9.26c0-2.213-1.181-3.242-2.756-3.242-1.292 0-1.86.722-2.174 1.213h.016V6.187H6.188c.03.676 0 7.203 0 7.203Z" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <PlanChild element={element} page={page} />
                      </>
                    )}
                  </div>

                  {/* Sidebar */}
                  <div className="hidden space-y-4 lg:block">
                    {/* Company information (desktop) */}
                    <div className="p-5 bg-white shadow-sm dark:bg-gray-800 rounded-xl lg:w-72 xl:w-80">
                      <div className="mb-6 text-center">
                        <div className="inline-flex mb-3">
                          <CircleProgress
                            width="64"
                            height="64"
                            value={element?.progress}
                          />
                        </div>
                        <div className="mb-1 text-lg font-bold text-gray-800 dark:text-gray-100">
                          Progressions
                        </div>
                      </div>
                      <div className="space-y-2">
                        <button className="w-full text-gray-100 bg-gray-900 btn hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white">
                          Apply Today -&gt;
                        </button>
                      </div>
                    </div>
                    <PlanRightPage
                      handleLabel={handleLabel}
                      handleLabelE={handleLabelE}
                      sousPage={sousPage}
                      setSousPage={setSousPage}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
        {page === "plansStrategiques" ? (
          <AddPlanStrategique
            fetchData={fetchData}
            feedbackModalOpen={feedbackModalOpen}
            setFeedbackModalOpen={setFeedbackModalOpen}
            planStrategique={element}
          />
        ) : (
          <ManageAxesStrategiqueToObjectifOpera
            fetchData={fetchData}
            feedbackModalOpen={feedbackModalOpen}
            setFeedbackModalOpen={setFeedbackModalOpen}
            element={page}
            dataElement={element}
          />
        )}
      </div>
    </div>
  );
}

export default PlanPage;

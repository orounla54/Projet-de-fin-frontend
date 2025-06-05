import React, { useEffect, useState } from "react";

import Sidebar from "../../partials/Sidebar";
import Header from "../../partials/Header";
import { useGetData } from "../../utils/Requests/RequestService";
import SpinnerLoading from "../../components/SpinnerLoading";
import { useNavigate, useParams } from "react-router-dom";
import CircleProgress from "../../charts/CircleProgress";

import ManagePriorite from "../../components/ManagePriorite";
import DangerModal from "../../components/DangerModal";
import LibelleFormat from "../../components/LibelleFormat";
import Avatar from "react-avatar";
import DateRefactor1 from "../../components/DateRefactor1";
import DescriptionFormat from "../../components/DescriptionFormat";
import { baseURL } from "../../utils/DataFront/eventTypes";
import AuthService from "../../utils/Auth/AuthServices";
import PrioritePagePilotes from "../../components/PrioritePagePilotes";
import PrioriteTaches from "../../components/PrioriteTaches";
import axios from "axios";
import PrioritePreuves from "../../components/PrioritePreuves";

const formatPriorite = (priorite) => {
  return {
    ...priorite,
    responsables: priorite.responsables || [], // Convertir en tableau d'objets
    services: priorite.services || [], // Convertir en tableau d'objets
  };
};

function PrioritePage({ page }) {
  const { id } = useParams();
  const baseUrl = baseURL;

  const [loadingStatusP, setLoadingStatusP] = useState(false);
  const [priorites, setPriorites] = useState();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const navigate = useNavigate();
  const [sousPage, setSousPage] = useState("Principal");
  const [responsableLog, setResponsableLog] = useState({});

  const {
    data: respo,
    loading: loadingRespo,
    error: errorRespo,
    fetchData: fetchReso,
  } = useGetData(`/responsables/log`);

  useEffect(() => {
    if (respo) {
      setResponsableLog(respo);
    }
    // console.log(responsableLog);
  }, [respo]);

  const { data, loading, error, fetchData } = useGetData(
    id ? `priorites/${id}` : null
  );

  useEffect(() => {
    if (data) {
      setPriorites(formatPriorite(data));
    }
  }, [data]);

  useEffect(() => {
    console.log(priorites); // ✅ Maintenant, priorites sera bien mis à jour avant d'être affiché
  }, [priorites]);

  const onUpdateStatus = async (priorite) => {
    setLoadingStatusP(true);

    if (!priorite || !priorite.id) {
      console.error("Priorite invalide ou ID manquant.");
      setLoadingStatusP(false);

      return;
    }

    if (priorite.status === "Non-démarré") {
      console.warn("Priorite Non démarré.");
      setLoadingStatusP(false);

      return;
    }

    // Définition du nouveau statut
    let status;
    switch (priorite.status) {
      case "En-cours":
        status = "Terminé";
        break;
      default:
        status = "En-cours";
    }

    try {
      const baseDataObject = {
        status: status,
      };
      const accessToken = AuthService.getAccessToken();

      console.log("Données envoyées :", baseDataObject);

      await axios.put(
        `${baseUrl}/priorites/${parseInt(priorite.id, 10)}`,
        baseDataObject,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      await fetchData();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Erreur inattendue lors de la mise à jour de la tâche";
      console.error(errorMessage);
    } finally {
      setLoadingStatusP(false);
    }
  };

  const typeColor = (status) => {
    switch (status) {
      case "Terminé": //Terminé
        return "bg-green-500/20 text-green-700";
      case "En-cours": //En-cours
        return "bg-yellow-500/20 text-yellow-700";
      case "Non-démaré": //Non-démaré
        return "bg-blue-500/20 text-blue-700";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400";
    }
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
          {loading || loadingRespo ? (
            <div className="absolute z-40 flex items-center justify-center w-full h-full bg-white dark:bg-gray-900">
              <SpinnerLoading />
            </div>
          ) : (
            <>
              {" "}
              {/* Content */}
              <div className="relative px-4 pb-8 sm:px-6">
                {/* Pre-header */}
                <div className="pb-6 sm:mb-3">
                  <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-between sm:items-end">
                    {/* Avatar */}
                    <div className="flex flex-col items-center gap-3 mt-10 mb-4 -ml-1 sm:mb-0 sm:flex-row sm:items-end">
                      <CircleProgress
                        width="80"
                        height="80"
                        value={priorites?.progress}
                      />
                      <div className="text-center sm:text-left">
                        {/* Name */}
                        <div className="inline-flex items-start mb-2">
                          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                            {(
                              <LibelleFormat
                                lenght={60}
                                libelle={priorites?.libelle}
                              />
                            ) || "Aucun libelle ajouter"}
                          </h1>
                          <svg
                            className="ml-2 text-yellow-500 fill-current shrink-0"
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                          >
                            <path d="M13 6a.75.75 0 0 1-.75-.75 1.5 1.5 0 0 0-1.5-1.5.75.75 0 1 1 0-1.5 1.5 1.5 0 0 0 1.5-1.5.75.75 0 1 1 1.5 0 1.5 1.5 0 0 0 1.5 1.5.75.75 0 1 1 0 1.5 1.5 1.5 0 0 0-1.5 1.5A.75.75 0 0 1 13 6ZM6 16a1 1 0 0 1-1-1 4 4 0 0 0-4-4 1 1 0 0 1 0-2 4 4 0 0 0 4-4 1 1 0 1 1 2 0 4 4 0 0 0 4 4 1 1 0 0 1 0 2 4 4 0 0 0-4 4 1 1 0 0 1-1 1Z" />
                          </svg>
                        </div>
                        {/* Bio */}
                        {priorites?.libelle.length > 60 && (
                          <div className="mb-3 text-sm">
                            {priorites?.libelle}
                          </div>
                        )}
                        {/* Meta */}
                        <div className="flex flex-wrap justify-center space-x-4 sm:justify-start">
                          <div className="flex items-center">
                            <svg
                              className="text-gray-400 fill-current shrink-0 dark:text-gray-500"
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                            >
                              <path d="M8 8.992a2 2 0 1 1-.002-3.998A2 2 0 0 1 8 8.992Zm-.7 6.694c-.1-.1-4.2-3.696-4.2-3.796C1.7 10.69 1 8.892 1 6.994 1 3.097 4.1 0 8 0s7 3.097 7 6.994c0 1.898-.7 3.697-2.1 4.996-.1.1-4.1 3.696-4.2 3.796-.4.3-1 .3-1.4-.1Zm-2.7-4.995L8 13.688l3.4-2.997c1-1 1.6-2.198 1.6-3.597 0-2.798-2.2-4.996-5-4.996S3 4.196 3 6.994c0 1.399.6 2.698 1.6 3.697 0-.1 0-.1 0 0Z" />
                            </svg>
                            <span className="ml-1 text-sm font-medium text-gray-500 whitespace-nowrap dark:text-gray-400">
                              {priorites?.services &&
                              priorites?.services.length > 0 ? (
                                <div className="text-xs font-semibold ">
                                  <LibelleFormat
                                    length={50}
                                    libelle={priorites.service}
                                  />
                                  {priorites?.services.map((service, index) => (
                                    <span key={service.id}>
                                      {service.service}
                                      {index < priorites?.services.length - 1 &&
                                        ", "}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                "Attribuer à aucun service"
                              )}
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
                            {priorites?.responsables
                              .filter(
                                (responsable) => responsable.role === "Pilote"
                              ) // Filtrer uniquement les pilotes
                              .slice(0, 1) // Prendre les 3 premiers pilotes
                              .map((responsable) => (
                                <span className="relative" key={responsable.id}>
                                  <Avatar
                                    className="ml-1"
                                    name={`${responsable.nom} ${responsable.prenom}`}
                                    round={true}
                                    size="24"
                                    src={responsable.image} // Le lien de l'image
                                  />
                                  <a
                                    className="ml-2 text-sm font-medium whitespace-nowrap text-violet-500 hover:text-violet-600 dark:hover:text-violet-400"
                                    href={`mailto:${responsable?.email || "#"}`}
                                  >
                                    {responsable.email}
                                  </a>
                                </span>
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Actions */}
                    <div className="flex space-x-2 sm:mb-2">
                      {page === "manage" && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setFeedbackModalOpen(true);
                            }}
                            className="p-1.5 shrink-0 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 shadow-sm"
                          >
                            <svg
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="text-gray-400 fill-current size-4"
                            >
                              <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                              <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
                            </svg>
                          </button>
                          <button className="px-1 pt-1 bg-white border border-red-300 rounded-lg shadow-sm shrink-0 dark:bg-gray-800 dark:border-red-700/60 hover:border-red-300 dark:hover:border-red-600">
                            <DangerModal
                              refreshList={() => {
                                navigate(-1);
                              }}
                              endpoint="priorites"
                              idObjet={priorites?.id}
                              libelleObjet={priorites?.libelle}
                            />
                          </button>
                        </>
                      )}
                      {page === "responsable" && (
                        <>
                          <button
                            onClick={() => {
                              onUpdateStatus(priorites);
                            }}
                            className={`text-white ${
                              priorites?.status === "Terminé"
                                ? "hover:bg-green-500 dark:hover:bg-green-400 bg-green-400 dark:bg-green-600"
                                : "bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800  dark:hover:bg-white"
                            } btn-sm `}
                          >
                            {priorites?.status === "Terminé" ? (
                              <>
                                <svg
                                  className="shrink-0 fill-white"
                                  width="11"
                                  height="8"
                                  viewBox="0 0 11 8"
                                >
                                  <path d="m.457 4.516.969-.99 2.516 2.481L9.266.702l.985.99-6.309 6.284z" />
                                </svg>
                              </>
                            ) : priorites?.status === "En-cours" ? (
                              <>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                  className="size-5 fill-blue-400"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M15.312 11.424a5.5 5.5 0 0 1-9.201 2.466l-.312-.311h2.433a.75.75 0 0 0 0-1.5H3.989a.75.75 0 0 0-.75.75v4.242a.75.75 0 0 0 1.5 0v-2.43l.31.31a7 7 0 0 0 11.712-3.138.75.75 0 0 0-1.449-.39Zm1.23-3.723a.75.75 0 0 0 .219-.53V2.929a.75.75 0 0 0-1.5 0V5.36l-.31-.31A7 7 0 0 0 3.239 8.188a.75.75 0 1 0 1.448.389A5.5 5.5 0 0 1 13.89 6.11l.311.31h-2.432a.75.75 0 0 0 0 1.5h4.243a.75.75 0 0 0 .53-.219Z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </>
                            ) : (
                              <></>
                            )}
                            <span className="">
                              {loadingStatusP ? (
                                <SpinnerLoading />
                              ) : (
                                <>{priorites?.status}</>
                              )}
                            </span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="relative my-6">
                  <div
                    className="absolute bottom-0 w-full h-px bg-gray-200 dark:bg-gray-700/60"
                    aria-hidden="true"
                  ></div>
                  <ul className="relative flex -mx-4 overflow-x-scroll text-sm font-medium flex-nowrap sm:-mx-6 lg:-mx-8 no-scrollbar">
                    <li className="mr-6 last:mr-0 first:pl-4 sm:first:pl-6 lg:first:pl-8 last:pr-4 sm:last:pr-6 lg:last:pr-8">
                      <button
                        className={`block pb-3${
                          sousPage === "Principal"
                            ? " text-violet-500 border-violet-500 border-b-2 "
                            : "text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        } whitespace-nowrap`}
                        onClick={() => setSousPage("Principal")}
                      >
                        General
                      </button>
                    </li>
                    <li className="mr-6 last:mr-0 first:pl-4 sm:first:pl-6 lg:first:pl-8 last:pr-4 sm:last:pr-6 lg:last:pr-8">
                      <button
                        className={`block pb-3${
                          sousPage === "pilotes"
                            ? " text-violet-500 border-violet-500 border-b-2 "
                            : "text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        } whitespace-nowrap`}
                        onClick={() => setSousPage("pilotes")}
                      >
                        Pilotes de la priorite
                      </button>
                    </li>
                    <li className="mr-6 last:mr-0 first:pl-4 sm:first:pl-6 lg:first:pl-8 last:pr-4 sm:last:pr-6 lg:last:pr-8">
                      <button
                        className={`block pb-3${
                          sousPage === "taches"
                            ? " text-violet-500 border-violet-500 border-b-2 "
                            : "text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        } whitespace-nowrap`}
                        onClick={() => setSousPage("taches")}
                      >
                        Taches de la priorite
                      </button>
                    </li>
                    <li className="mr-6 last:mr-0 first:pl-4 sm:first:pl-6 lg:first:pl-8 last:pr-4 sm:last:pr-6 lg:last:pr-8">
                      <button
                        className={`block pb-3${
                          sousPage === "preuves"
                            ? " text-violet-500 border-violet-500 border-b-2 "
                            : "text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        } whitespace-nowrap`}
                        onClick={() => setSousPage("preuves")}
                      >
                        Preuves realisations
                      </button>
                    </li>
                  </ul>
                </div>

                <div className="flex flex-col xl:flex-row xl:space-x-8">
                  {sousPage === "Principal" ? (
                    <>
                      {/* Main content */}
                      <div className="flex-1 mb-8 space-y-5 xl:mb-0">
                        <div className="p-4 mb-2 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-900 dark:border-gray-700/60">
                          <ul className="space-y-3">
                            {/* Item */}
                            <li className="sm:flex sm:items-center sm:justify-between">
                              {/* Icon */}
                              <div className="flex items-center text-sm sm:grow">
                                {priorites?.typePriorite === "Projet" ? (
                                  <>
                                    {/* Icon */}
                                    <div className="w-8 h-8 my-2 mr-3 rounded-full shrink-0 bg-violet-500">
                                      <svg
                                        className="w-8 h-8 fill-current text-violet-50"
                                        viewBox="0 0 32 32"
                                      >
                                        <path d="M8.994 20.006a1 1 0 0 1-.707-1.707l4.5-4.5a1 1 0 0 1 1.414 0l3.293 3.293 4.793-4.793a1 1 0 1 1 1.414 1.414l-5.5 5.5a1 1 0 0 1-1.414 0l-3.293-3.293L9.7 19.713a1 1 0 0 1-.707.293Z" />
                                      </svg>
                                    </div>
                                  </>
                                ) : priorites?.typePriorite === "Action" ? (
                                  <>
                                    {/* Icon */}
                                    <div className="w-8 h-8 my-2 mr-3 bg-yellow-500 rounded-full shrink-0">
                                      <svg
                                        className="w-8 h-8 fill-current text-yellow-50"
                                        viewBox="0 0 32 32"
                                      >
                                        <path d="M21 14a.75.75 0 0 1-.75-.75 1.5 1.5 0 0 0-1.5-1.5.75.75 0 1 1 0-1.5 1.5 1.5 0 0 0 1.5-1.5.75.75 0 1 1 1.5 0 1.5 1.5 0 0 0 1.5 1.5.75.75 0 1 1 0 1.5 1.5 1.5 0 0 0-1.5 1.5.75.75 0 0 1-.75.75Zm-7 10a1 1 0 0 1-1-1 4 4 0 0 0-4-4 1 1 0 0 1 0-2 4 4 0 0 0 4-4 1 1 0 0 1 2 0 4 4 0 0 0 4 4 1 1 0 0 1 0 2 4 4 0 0 0-4 4 1 1 0 0 1-1 1Z" />
                                      </svg>
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    {/* Icon */}
                                    <div className="flex items-center justify-center w-8 h-8 my-2 mr-3 bg-green-500 rounded-full shrink-0">
                                      <svg
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.73}
                                        stroke="currentColor"
                                        className="size-5 text-violet-50"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"
                                        />
                                      </svg>
                                    </div>
                                  </>
                                )}
                                {/* Position */}
                                <div>
                                  <div className="font-medium text-gray-800 dark:text-gray-100">
                                    Product Designer
                                  </div>
                                  <div className="flex items-center space-x-2 flex-nowrap whitespace-nowrap">
                                    <div className="font-semibold">
                                      {priorites?.code}
                                    </div>
                                    <div className="text-gray-400 dark:text-gray-600">
                                      ·
                                    </div>
                                    <div>
                                      <DateRefactor1
                                        date={priorites?.dateInscription}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {/* Tags */}
                              <div className="mt-2 sm:ml-2 sm:mt-0">
                                <ul className="flex flex-wrap -m-1 sm:justify-end">
                                  <li className="m-1">
                                    <button className="inline-flex items-center justify-center text-xs font-medium leading-5 rounded-full px-2.5 py-0.5 border border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 shadow-sm bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 transition">
                                      {priorites?.typePriorite}
                                    </button>
                                  </li>
                                  <li className="m-1">
                                    <button
                                      className={`inline-flex items-center justify-center text-xs font-medium leading-5 rounded-full px-2.5 py-0.5 transition ${typeColor(
                                        priorites?.status
                                      )}`}
                                    >
                                      {priorites?.status}
                                    </button>
                                  </li>
                                </ul>
                              </div>
                            </li>
                          </ul>
                        </div>
                        {/* About Me */}
                        <div>
                          <h2 className="mb-2 font-semibold text-gray-800 dark:text-gray-100">
                            Description
                          </h2>
                          <div className="space-y-2 text-sm">
                            {priorites?.description ? (
                              <>
                                <DescriptionFormat
                                  length={2500}
                                  description={priorites?.description}
                                />
                              </>
                            ) : (
                              "Aucune description ajouter"
                            )}
                          </div>
                        </div>
                        {priorites?.infoSup && (
                          <div>
                            <h2 className="mb-2 font-semibold text-gray-800 dark:text-gray-100">
                              Information supplementaire
                            </h2>
                            <div className="space-y-2 text-sm">
                              {priorites?.infoSup &&
                                priorites?.infoSup
                                  .split("\n")
                                  .map((paragraph, index) => (
                                    <p key={index} className="mb-2">
                                      {paragraph.trim()}
                                    </p>
                                  ))}
                            </div>
                          </div>
                        )}

                        <div className="w-full">
                          <PrioriteTaches
                            priorite={priorites}
                            responsableLog={responsableLog}
                            page={page}
                            slice
                          />
                        </div>
                      </div>
                    </>
                  ) : sousPage === "pilotes" ? (
                    <>
                      <PrioritePagePilotes page={page} priorite={priorites} />
                    </>
                  ) : sousPage === "taches" ? (
                    <>
                      <PrioriteTaches
                        priorite={priorites}
                        responsableLog={responsableLog}
                        page={page}
                      />
                    </>
                  ) : sousPage === "preuves" ? (
                      <PrioritePreuves
                        priorite={priorites}
                        responsableLog={responsableLog}
                        page={page}
                      />
                  ) : (
                    <></>
                  )}

                  {/* Sidebar */}
                  <aside className="space-y-3 xl:min-w-72 xl:w-72">
                    <div className="space-y-3 ">
                      <div className="text-sm">
                        <h3 className="font-medium text-gray-800 dark:text-gray-100">
                          Code
                        </h3>
                        <div className="font-semibold text-violet-400">
                          {priorites?.code}
                        </div>
                      </div>
                      <div className="text-sm">
                        <h3 className="font-medium text-gray-800 dark:text-gray-100">
                          Objectif opérationnel
                        </h3>
                        <div className="font-semibold text-violet-400">
                          {priorites?.objectifOperationnel}
                        </div>
                      </div>
                      <div className="text-sm">
                        <h3 className="font-medium text-gray-800 dark:text-gray-100">
                          Type
                        </h3>
                        <div>{priorites?.typePriorite}</div>
                      </div>
                      <div className="text-sm">
                        <h3 className="font-medium text-gray-800 dark:text-gray-100">
                          Email pilote
                        </h3>
                        <div>
                          {priorites?.responsables
                            .filter(
                              (responsable) => responsable.role === "Pilote"
                            ) // Filtrer uniquement les pilotes
                            .slice(0, 1) // Prendre les 3 premiers pilotes
                            .map((responsable) => (
                              <span className="relative" key={responsable.id}>
                                <a
                                  className="text-sm font-medium whitespace-nowrap "
                                  href={`mailto:${responsable?.email || "#"}`}
                                >
                                  {responsable.email}
                                </a>
                              </span>
                            ))}
                        </div>
                      </div>
                      <div className="text-sm">
                        <h3 className="font-medium text-gray-800 dark:text-gray-100">
                          Date d'ajout
                        </h3>
                        <div>
                          <DateRefactor1 date={priorites?.dateInscription} />{" "}
                        </div>
                      </div>
                    </div>

                    {sousPage !== "pilotes" && (
                      <>
                        {/* Pilote */}
                        <div className="pt-2 dark:bg-gray-900 rounded-xl xl:mr-10">
                          <div className="mb-4 text-xs font-semibold text-gray-400 uppercase dark:text-gray-500">
                            Pilotes associés
                          </div>
                          <ul className="space-y-3">
                            {priorites?.responsables.length > 0 ? (
                              <>
                                {priorites?.responsables
                                  .sort((a, b) =>
                                    a.role === "Pilote" ? -1 : 1
                                  ) // Met les pilotes en premier
                                  .map((responsable) => (
                                    <li key={responsable.id}>
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center grow">
                                          <div className="relative mr-3">
                                            <Avatar
                                              className="ml-1"
                                              name={`${responsable.nom} ${responsable.prenom}`}
                                              round={true}
                                              size="32"
                                              src={responsable.image} // Le lien de l'image
                                            />
                                          </div>
                                          <div className="flex gap-1 truncate">
                                            <span className="text-sm font-medium text-gray-800 dark:text-gray-100">
                                              {responsable.prenom}{" "}
                                              {responsable.nom}
                                            </span>
                                            {responsable.role !== "Pilote" && (
                                              <>
                                                <div className="text-gray-400 dark:text-gray-600">
                                                  ·
                                                </div>
                                                <span className="text-sm text-gray-800 dark:text-gray-100">
                                                  {responsable.role}
                                                </span>
                                              </>
                                            )}
                                          </div>
                                        </div>
                                        {responsable.role === "Pilote" && (
                                          <button className="ml-2 inline-flex items-center justify-center text-xs font-medium leading-5 rounded-full px-2.5 py-0.5 border shadow-sm transition border-violet-200 dark:border-violet-700/60 hover:border-violet-300 dark:hover:border-violet-600 bg-violet-50 dark:bg-violet-900 text-violet-500 dark:text-violet-400">
                                            Pilote
                                          </button>
                                        )}
                                      </div>
                                    </li>
                                  ))}
                              </>
                            ) : (
                              <p className="text-xs">Aucun pilote ajouté</p>
                            )}
                          </ul>
                          {priorites?.responsables.length > 0 && (
                            <div className="mt-4">
                              <button
                                onClick={() => setSousPage("pilotes")}
                                className="w-full text-gray-800 bg-white border-gray-200 btn-sm dark:bg-gray-800 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 dark:text-gray-300"
                              >
                                Tout voir
                              </button>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </aside>
                </div>
              </div>
              <ManagePriorite
                fetchData={fetchData}
                feedbackModalOpen={feedbackModalOpen}
                setFeedbackModalOpen={setFeedbackModalOpen}
                priorite={priorites}
              />
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default PrioritePage;

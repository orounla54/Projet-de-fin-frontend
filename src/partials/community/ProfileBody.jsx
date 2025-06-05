import React, { useState } from "react";

import ProfileBg from "../../images/bgProfile.png";
import UserAvatar from "../../images/user-avatar-80.png";
import DangerModalEvent from "../../components/DangerModalEvent";
import FormulaireEvent from "../../components/formulaires/FormulaireEvent";
import LibelleFormat from "../../components/LibelleFormat";
import Avatar from "react-avatar";
import Icon02 from "../../images/icon-02.svg";
import Icon03 from "../../images/icon-03.svg";
import PhotoProfileForms from "../../components/formulaires/PhotoProfileForms";
import EvenementsSocieteDemandes from "../../components/EvenementsSocieteDemandes";
import AddResponsablesToEvent from "../../components/AddResponsablesToEvent";
import EvenementFilesConducteur from "../../components/EvenementFilesConducteur";
import EvenementTaches from "../../components/EvenementTaches";
import EvenementInvitationsGreated from "../../components/EvenementInvitationsGreated";
import DescriptionFormat from "../../components/DescriptionFormat";

function ProfileBody({
  profileSidebarOpen,
  setProfileSidebarOpen,
  event,
  fetchData,
  fetchDataListe,
  responsableLog,
  responsableEvent,
}) {
  const { pathname } = location;
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [feedbackModalOpenAddResponsable, setFeedbackModalOpenAddResponsable] =
    useState(false);
  const [feedbackModalOpenAddPhoto, setFeedbackModalOpenAddPhoto] =
    useState(false);
  const [page, setPage] = useState("Principal");
  const [newDemande, setNewDemande] = useState(false);

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

  const categoryIcon = (category) => {
    switch (category) {
      case "Evenement":
        return (
          <div className="flex items-center justify-center w-20 h-20 m-6 bg-red-500 border-8 border-white rounded-full dark:border-gray-900 shrink-0">
            <svg
              className="w-16 h-16 text-white fill-current"
              viewBox="0 0 36 36"
            >
              <path d="M25 24H11a1 1 0 01-1-1v-5h2v4h12v-4h2v5a1 1 0 01-1 1zM14 13h8v2h-8z" />
            </svg>
          </div>
        );
      case "Activitée":
        return (
          <div className="flex items-center justify-center w-20 h-20 m-6 bg-green-500 border-8 border-white rounded-full dark:border-gray-900 shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-8 h-8 text-white fill-current"
            >
              <path
                fillRule="evenodd"
                d="M4.5 2A2.5 2.5 0 0 0 2 4.5v3.879a2.5 2.5 0 0 0 .732 1.767l7.5 7.5a2.5 2.5 0 0 0 3.536 0l3.878-3.878a2.5 2.5 0 0 0 0-3.536l-7.5-7.5A2.5 2.5 0 0 0 8.38 2H4.5ZM5 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        );
      case "Reunion":
        return (
          <div className="flex items-center justify-center w-20 h-20 m-6 border-8 border-white rounded-full dark:border-gray-900 shrink-0 bg-sky-500">
            <svg
              className="w-16 h-16 text-white fill-current"
              viewBox="0 0 36 36"
            >
              <path d="M23 11v2.085c-2.841.401-4.41 2.462-5.8 4.315-1.449 1.932-2.7 3.6-5.2 3.6h-1v2h1c3.5 0 5.253-2.338 6.8-4.4 1.449-1.932 2.7-3.6 5.2-3.6h3l-4-4zM15.406 16.455c.066-.087.125-.162.194-.254.314-.419.656-.872 1.033-1.33C15.475 13.802 14.038 13 12 13h-1v2h1c1.471 0 2.505.586 3.406 1.455zM24 21c-1.471 0-2.505-.586-3.406-1.455-.066.087-.125.162-.194.254-.316.422-.656.873-1.028 1.328.959.878 2.108 1.573 3.628 1.788V25l4-4h-3z" />
            </svg>
          </div>
        );
      case "Rendez-vous":
        return (
          <div className="flex items-center justify-center w-20 h-20 m-6 border-8 border-white rounded-full dark:border-gray-900 shrink-0 bg-violet-500">
            <svg
              className="text-white fill-current w-14 h-14"
              viewBox="0 0 36 36"
            >
              <path d="M18 10c-4.4 0-8 3.1-8 7s3.6 7 8 7h.6l5.4 2v-4.4c1.2-1.2 2-2.8 2-4.6 0-3.9-3.6-7-8-7zm4 10.8v2.3L18.9 22H18c-3.3 0-6-2.2-6-5s2.7-5 6-5 6 2.2 6 5c0 2.2-2 3.8-2 3.8z" />
            </svg>
          </div>
        );
      case "Séminaire":
        return (
          <div className="flex items-center justify-center w-20 h-20 m-6 bg-orange-500 border-8 border-white rounded-full dark:border-gray-900 shrink-0">
            <svg
              className="w-14 h-14 fill-current text-white flex items-center justify-center ml-3.5 mt-3.5"
              viewBox="0 0 36 36"
            >
              <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A8.237 8.237 0 0 1 6 18.75c1.995 0 3.823.707 5.25 1.886V4.533ZM12.75 20.636A8.214 8.214 0 0 1 18 18.75c.966 0 1.89.166 2.75.47a.75.75 0 0 0 1-.708V4.262a.75.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533v16.103Z" />
            </svg>
          </div>
        );
      case "Autre":
        return (
          <div className="flex items-center justify-center w-20 h-20 m-6 bg-yellow-500 border-8 border-white rounded-full dark:border-gray-900 shrink-0">
            <svg
              className="w-10 h-10 text-white fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M3 10a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM8.5 10a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM15.5 8.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z" />
            </svg>
          </div>
        );
      default:
        return <div></div>;
    }
  };

  const categoryIcon1 = (category) => {
    switch (category) {
      case "Evenement":
        return (
          <div className="flex items-center justify-center w-10 h-10 bg-red-500 border-4 border-white rounded-full dark:border-gray-900 shrink-0">
            <svg
              className="w-8 h-8 text-white fill-current"
              viewBox="0 0 36 36"
            >
              <path d="M25 24H11a1 1 0 01-1-1v-5h2v4h12v-4h2v5a1 1 0 01-1 1zM14 13h8v2h-8z" />
            </svg>
          </div>
        );
      case "Activitée":
        return (
          <div className="flex items-center justify-center w-10 h-10 bg-green-500 border-4 border-white rounded-full dark:border-gray-900 shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4 text-white fill-current"
            >
              <path
                fillRule="evenodd"
                d="M4.5 2A2.5 2.5 0 0 0 2 4.5v3.879a2.5 2.5 0 0 0 .732 1.767l7.5 7.5a2.5 2.5 0 0 0 3.536 0l3.878-3.878a2.5 2.5 0 0 0 0-3.536l-7.5-7.5A2.5 2.5 0 0 0 8.38 2H4.5ZM5 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        );
      case "Reunion":
        return (
          <div className="flex items-center justify-center w-10 h-10 border-4 border-white rounded-full dark:border-gray-900 shrink-0 bg-sky-500">
            <svg
              className="w-8 h-8 text-white fill-current"
              viewBox="0 0 36 36"
            >
              <path d="M23 11v2.085c-2.841.401-4.41 2.462-5.8 4.315-1.449 1.932-2.7 3.6-5.2 3.6h-1v2h1c3.5 0 5.253-2.338 6.8-4.4 1.449-1.932 2.7-3.6 5.2-3.6h3l-4-4zM15.406 16.455c.066-.087.125-.162.194-.254.314-.419.656-.872 1.033-1.33C15.475 13.802 14.038 13 12 13h-1v2h1c1.471 0 2.505.586 3.406 1.455zM24 21c-1.471 0-2.505-.586-3.406-1.455-.066.087-.125.162-.194.254-.316.422-.656.873-1.028 1.328.959.878 2.108 1.573 3.628 1.788V25l4-4h-3z" />
            </svg>
          </div>
        );
      case "Rendez-vous":
        return (
          <div className="flex items-center justify-center w-10 h-10 border-4 border-white rounded-full dark:border-gray-900 shrink-0 bg-violet-500">
            <svg
              className="w-8 h-8 text-white fill-current"
              viewBox="0 0 36 36"
            >
              <path d="M18 10c-4.4 0-8 3.1-8 7s3.6 7 8 7h.6l5.4 2v-4.4c1.2-1.2 2-2.8 2-4.6 0-3.9-3.6-7-8-7zm4 10.8v2.3L18.9 22H18c-3.3 0-6-2.2-6-5s2.7-5 6-5 6 2.2 6 5c0 2.2-2 3.8-2 3.8z" />
            </svg>
          </div>
        );
      case "Séminaire":
        return (
          <div className="flex items-center justify-center w-10 h-10 bg-orange-500 border-4 border-white rounded-full dark:border-gray-900 shrink-0">
            <svg
              className="w-8 h-8 mt-2 ml-2 text-white fill-current"
              viewBox="0 0 36 36"
            >
              <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A8.237 8.237 0 0 1 6 18.75c1.995 0 3.823.707 5.25 1.886V4.533ZM12.75 20.636A8.214 8.214 0 0 1 18 18.75c.966 0 1.89.166 2.75.47a.75.75 0 0 0 1-.708V4.262a.75.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533v16.103Z" />
            </svg>
          </div>
        );
      case "Autre":
        return (
          <div className="flex items-center justify-center w-10 h-10 bg-yellow-500 border-4 border-white rounded-full dark:border-gray-900 shrink-0">
            <svg
              className="w-6 h-6 text-white fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M3 10a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM8.5 10a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM15.5 8.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z" />
            </svg>
          </div>
        );
      default:
        return <div></div>;
    }
  };

  const participants = event?.responsablesAssocies?.filter(
    (participant) => participant.id !== responsableEvent?.id
  );

  return (
    <div
      className={`grow flex flex-col md:translate-x-0 transition-transform duration-300 ease-in-out ${
        profileSidebarOpen ? "translate-x-1/3" : "translate-x-0"
      }`}
    >
      {/* Profile background */}
      <div className="relative h-56 bg-gray-200 dark:bg-gray-900">
        {event?.photoLien ? (
          <img
            className="object-cover w-full h-full"
            src={event.photoLien}
            width="979"
            height="220"
            alt="Profile background"
          />
        ) : (
          <img
            className="object-cover w-full h-full"
            src={ProfileBg}
            width="979"
            height="220"
            alt="Profile background"
          />
        )}

        {!pathname.includes("/societe") && (
          <button
            className="absolute text-white md:hidden top-4 left-4 sm:left-6 opacity-80 hover:opacity-100"
            onClick={() => setProfileSidebarOpen(!profileSidebarOpen)}
            aria-controls="profile-sidebar"
            aria-expanded={profileSidebarOpen}
          >
            <span className="sr-only">Close sidebar</span>
            <svg
              className="w-6 h-6 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10.7 18.7l1.4-1.4L7.8 13H20v-2H7.8l4.3-4.3-1.4-1.4L4 12z" />
            </svg>
          </button>
        )}
      </div>

      {/* Content */}
      <div className="relative px-4 pb-8 sm:px-6">
        {/* Pre-header */}
        <div className="mb-6 -mt-16 sm:mb-3">
          <PhotoProfileForms
            id={event?.id}
            setFeedbackModalOpen={setFeedbackModalOpenAddPhoto}
            feedbackModalOpen={feedbackModalOpenAddPhoto}
            fetchData={fetchData}
          />
          <div className="flex flex-col items-center sm:flex-row sm:justify-between sm:items-end">
            {/* Avatar */}
            <div className="inline-flex mb-4 -mt-1 -ml-1 sm:mb-0">
              {event.enventType ? (
                <button
                  onDoubleClick={(e) => {
                    if (responsableLog.id === event.idResponsable) {
                      e.stopPropagation();
                      setFeedbackModalOpenAddPhoto(true);
                    }
                  }}
                >
                  {categoryIcon(event.enventType)}
                </button>
              ) : (
                <img
                  className="w-20 h-20 m-6 border-4 border-white rounded-full dark:border-gray-900"
                  src={UserAvatar}
                  alt="Avatar"
                />
              )}
            </div>
            {/* Actions */}
            <div className="flex items-center justify-center gap-1 ml-20 sm:justify-evenly">
              <div className="relative flex items-center justify-center space-x-2 sm:mb-2">
                {responsableLog &&
                  responsableLog.id === event.idResponsable && (
                    <DangerModalEvent
                      endpoint="evenements"
                      idObjet={event.id}
                      libelleObjet={event.eventName}
                    />
                  )}
                <button
                  className={`absolute top-1 -left-24  text-xs inline-flex rounded-full text-center p-1 ${typeColor(
                    event.status
                  )}`}
                >
                  {event.status}
                </button>
              </div>

              {responsableLog && responsableLog.id === event.idResponsable ? (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFeedbackModalOpen(true);
                    }}
                    className="mb-1 bg-white border-gray-200 btn sm:mb-3 dark:bg-gray-800 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600"
                  >
                    <svg
                      className="text-gray-400 fill-current dark:text-gray-500 shrink-0"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                    >
                      <path d="M11.7.3c-.4-.4-1-.4-1.4 0l-10 10c-.2.2-.3.4-.3.7v4c0 .6.4 1 1 1h4c.3 0 .5-.1.7-.3l10-10c.4-.4.4-1 0-1.4l-4-4zM4.6 14H2v-2.6l6-6L10.6 8l-6 6zM12 6.6L9.4 4 11 2.4 13.6 5 12 6.6z" />
                    </svg>
                  </button>
                  {responsableLog.id === event.idResponsable && (
                    <FormulaireEvent
                      fetchDataListe={fetchDataListe}
                      fetchData={fetchData}
                      event={event}
                      feedbackModalOpen={feedbackModalOpen}
                      setFeedbackModalOpen={setFeedbackModalOpen}
                    />
                  )}
                </>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>

        {/* Header */}
        <header className="mb-6 text-center sm:text-left">
          {/* Name */}
          <div className="inline-flex items-start mb-2">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              {event.eventName ? event.eventName : ""}
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

          {pathname.includes("/societe") && (
            <div className="mb-3 text-sm">
              Cet événement mettra en lumière des aspects importants et
              fascinants des&nbsp;
              <span className="font-bold">{event?.categorie || "..."}</span>,
              offrant une occasion unique de découvrir et d'explorer ce domaine
              en profondeur.
            </div>
          )}

          {/* Meta */}
          <div className="flex flex-wrap justify-center space-x-4 sm:justify-start">
            <div className="flex items-center">
              <>
                <svg
                  className="text-gray-400 fill-current shrink-0 dark:text-gray-500"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 8.992a2 2 0 1 1-.002-3.998A2 2 0 0 1 8 8.992Zm-.7 6.694c-.1-.1-4.2-3.696-4.2-3.796C1.7 10.69 1 8.892 1 6.994 1 3.097 4.1 0 8 0s7 3.097 7 6.994c0 1.898-.7 3.697-2.1 4.996-.1.1-4.1 3.696-4.2 3.796-.4.3-1 .3-1.4-.1Zm-2.7-4.995L8 13.688l3.4-2.997c1-1 1.6-2.198 1.6-3.597 0-2.798-2.2-4.996-5-4.996S3 4.196 3 6.994c0 1.399.6 2.698 1.6 3.697 0-.1 0-.1 0 0Z" />
                </svg>
                <span className="ml-2 text-sm font-medium text-gray-500 whitespace-nowrap dark:text-gray-400">
                  {event?.location || "Lieux pas encore decider"}
                </span>
              </>
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
              <Avatar
                className="mx-1"
                src={event?.responsableEvent?.image}
                name={event.creer_par}
                round={true}
                size="26"
              />
              <a
                className="ml-1 text-sm font-medium whitespace-nowrap text-violet-500 hover:text-violet-600 dark:hover:text-violet-400"
                href={`mailto:${event?.responsableEvent?.email || "#"}`}
              >
                {event?.responsableEvent?.email || event?.creer_par || ""}
              </a>
            </div>
          </div>
        </header>

        {/* Tabs */}
        <div className="relative mb-6">
          <div
            className="absolute bottom-0 w-full h-px bg-gray-200 dark:bg-gray-700/60"
            aria-hidden="true"
          ></div>
          <ul className="relative flex -mx-4 overflow-x-scroll text-sm font-medium flex-nowrap sm:-mx-6 lg:-mx-8 no-scrollbar">
            <li className="mr-6 last:mr-0 first:pl-4 sm:first:pl-6 lg:first:pl-8 last:pr-4 sm:last:pr-6 lg:last:pr-8">
              <button
                className={`block pb-3${
                  page === "Principal"
                    ? " text-violet-500 border-violet-500 border-b-2 "
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                } whitespace-nowrap`}
                onClick={() => setPage("Principal")}
              >
                General
              </button>
            </li>
            {pathname.includes("/societe") && (
              <>
                <li className="mr-6 last:mr-0 first:pl-4 sm:first:pl-6 lg:first:pl-8 last:pr-4 sm:last:pr-6 lg:last:pr-8">
                  <button
                    className={`block pb-3 ${
                      page === "Files"
                        ? " text-violet-500 border-violet-500 border-b-2"
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 "
                    } whitespace-nowrap`}
                    onClick={() => setPage("Files")}
                  >
                    File conducteur
                  </button>
                </li>
                <li className="mr-6 last:mr-0 first:pl-4 sm:first:pl-6 lg:first:pl-8 last:pr-4 sm:last:pr-6 lg:last:pr-8">
                  <button
                    className={`block pb-3 ${
                      page === "Tache"
                        ? " text-violet-500 border-violet-500 border-b-2"
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 "
                    } whitespace-nowrap`}
                    onClick={() => setPage("Tache")}
                  >
                    Tache evenement
                  </button>
                </li>
                <li className="mr-6 last:mr-0 first:pl-4 sm:first:pl-6 lg:first:pl-8 last:pr-4 sm:last:pr-6 lg:last:pr-8">
                  <button
                    className={`block pb-3 relative ${
                      page === "Demandes"
                        ? " text-violet-500 border-violet-500 border-b-2 "
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    } whitespace-nowrap`}
                    onClick={() => setPage("Demandes")}
                  >
                    Demande de participations
                    {newDemande && (
                      <span className="absolute top-0 -right-3">
                        <svg
                          viewBox="0 0 16 16"
                          fill="currentColor"
                          className="size-3 fill-green-600"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12 5a4 4 0 0 0-8 0v2.379a1.5 1.5 0 0 1-.44 1.06L2.294 9.707a1 1 0 0 0-.293.707V11a1 1 0 0 0 1 1h2a3 3 0 1 0 6 0h2a1 1 0 0 0 1-1v-.586a1 1 0 0 0-.293-.707L12.44 8.44A1.5 1.5 0 0 1 12 7.38V5Zm-5.5 7a1.5 1.5 0 0 0 3 0h-3Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                    )}
                  </button>
                </li>
                <li className="mr-6 last:mr-0 first:pl-4 sm:first:pl-6 lg:first:pl-8 last:pr-4 sm:last:pr-6 lg:last:pr-8">
                  <button
                    className={`block pb-3${
                      page === "Participants"
                        ? " text-violet-500 border-violet-500 border-b-2 "
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    } whitespace-nowrap`}
                    onClick={() => setPage("Participants")}
                  >
                    Participants
                  </button>
                </li>
                <li className="mr-6 last:mr-0 first:pl-4 sm:first:pl-6 lg:first:pl-8 last:pr-4 sm:last:pr-6 lg:last:pr-8">
                  <button
                    className={`block pb-3${
                      page === "Invités"
                        ? " text-violet-500 border-violet-500 border-b-2 "
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    } whitespace-nowrap`}
                    onClick={() => setPage("Invités")}
                  >
                    Invitations acceptées
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Profile content */}
        <div className="flex flex-col xl:flex-row xl:space-x-8">
          {/* Main content */}
          {page === "Principal" ? (
            <>
              <div className="flex-1 mb-8 space-y-5 xl:mb-0">
                {/* About Me */}
                <div className="mb-4">
                  {event && event.description && (
                    <>
                      <h2 className="mb-2 text-xl font-semibold text-gray-800 dark:text-gray-100">
                        Descriptions
                      </h2>
                      <div className="space-y-2 text-sm text-justify">
                        {event.description ? (
                          <DescriptionFormat
                            length={1005}
                            description={event.description}
                          />
                        ) : (
                          <p>Aucune description faite sur cet événement...</p>
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* Work History */}
                <div>
                  <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-900 dark:border-gray-700/60">
                    <ul className="space-y-3">
                      {/* Item */}
                      <li className="sm:flex sm:items-center sm:justify-between">
                        <div className="flex items-center text-sm sm:grow">
                          {/* Icon */}
                          {event.enventType && categoryIcon1(event.enventType)}

                          {/* Position */}
                          <div>
                            <div className="font-medium text-gray-800 dark:text-gray-100">
                              {event.eventName ? (
                                <LibelleFormat libelle={event.eventName} />
                              ) : (
                                "Aucun nom d'evenement"
                              )}
                            </div>
                            {event.eventStart && (
                              <span>
                                {new Date(event.eventStart).toLocaleDateString(
                                  "fr-FR",
                                  {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  }
                                )}
                                ,{" "}
                                {new Date(event.eventStart).toLocaleTimeString(
                                  "fr-FR",
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: false,
                                  }
                                )}
                                {event.eventEnd && (
                                  <span>
                                    {" "}
                                    -{" "}
                                    {new Date(
                                      event.eventEnd
                                    ).toLocaleTimeString("fr-FR", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      hour12: false,
                                    })}
                                  </span>
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                        {/* Tags */}
                        <div className="mt-2 sm:ml-2 sm:mt-0">
                          <ul className="flex flex-wrap -m-1 sm:justify-end">
                            <li className="m-1">
                              {event.enventType && (
                                <>
                                  <button className="inline-flex items-center justify-center text-xs font-medium leading-5 rounded-full px-2.5 py-0.5 border border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 shadow-sm bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 transition">
                                    {event.enventType}
                                  </button>
                                </>
                              )}
                            </li>{" "}
                            {pathname.includes("/societe") && (
                              <li className="m-1">
                                {event.NbrePlace && (
                                  <>
                                    <button className="inline-flex items-center gap-1 justify-center text-xs font-medium leading-5 rounded-full px-2.5 py-0.5 border border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 shadow-sm bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 transition">
                                      Place disponible{" "}
                                      <div
                                        className={`font-bold ${
                                          event.placesDisponibles === 0
                                            ? "text-violet-400"
                                            : event.placesDisponibles <
                                              event.NbrePlace
                                            ? "text-green-400"
                                            : ""
                                        }`}
                                      >
                                        <span className="text-gray-400">
                                          {event.placesDisponibles}
                                        </span>{" "}
                                        / <span>{event.NbrePlace}</span>
                                      </div>
                                    </button>
                                  </>
                                )}
                              </li>
                            )}
                            <li className="m-1">
                              <>
                                <button className="inline-flex items-center justify-center text-xs font-medium leading-5 rounded-full px-2.5 py-0.5 border border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 shadow-sm bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 transition">
                                  {event.private ? (
                                    <span className="text-blue-500">
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
                                    </span>
                                  ) : (
                                    <span className="text-green-500">
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
                                    </span>
                                  )}
                                </button>
                              </>
                            </li>
                          </ul>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>

                {pathname.includes("/societe") && (
                  <>
                    {/* Departments */}
                    <div>
                      <div className="flex items-center justify-between my-2">
                        <h2 className="mb-2 font-semibold text-gray-800 dark:text-gray-100">
                          Responsable et participants
                        </h2>
                        {responsableLog.id === event.idResponsable && (
                          <>
                            <AddResponsablesToEvent
                              feedbackModalOpen={
                                feedbackModalOpenAddResponsable
                              }
                              setFeedbackModalOpen={
                                setFeedbackModalOpenAddResponsable
                              }
                              fetchData={fetchData}
                              event={event}
                            />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setFeedbackModalOpenAddResponsable(true);
                              }}
                              className="flex items-center justify-center transition bg-white border border-gray-200 rounded-full shadow-sm w-7 h-7 dark:bg-gray-800 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-violet-500"
                            >
                              <span className="sr-only">Add new account</span>
                              <svg
                                className="fill-current"
                                width="14"
                                height="14"
                                viewBox="0 0 16 16"
                              >
                                <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                              </svg>
                            </button>
                          </>
                        )}
                      </div>
                      {/* Cards responsables & participants */}
                      <div className="grid gap-4 xl:grid-cols-2">
                        {/* Card */}
                        <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-900 dark:border-gray-700/60">
                          {/* Card header */}
                          <div className="flex items-center mb-2 truncate grow">
                            <div className="flex items-center justify-center w-8 h-8 mr-2 bg-gray-700 rounded-full shrink-0">
                              <img
                                className="ml-1"
                                src={Icon03}
                                width="14"
                                height="14"
                                alt="Icon 03"
                              />
                            </div>
                            <div className="truncate">
                              <span className="text-sm font-medium text-gray-800 dark:text-gray-100">
                                Responsable de l'événement
                              </span>
                            </div>
                          </div>
                          {/* Card content */}
                          <div className="mb-3 text-sm">
                            Pour toute information ou assistance concernant cet
                            événement, veuillez contacter le responsable
                            directement par email 📧.
                          </div>
                          {/* Card footer */}
                          <div className="flex items-center justify-between">
                            {/* Avatars group */}
                            <div className="flex -space-x-3 -ml-0.5">
                              <div>
                                <>
                                  <span className="flex items-center gap-2">
                                    <Avatar
                                      name={`${event.responsableEvent?.nom} ${event.responsableEvent?.prenom}`}
                                      src={event.responsableEvent?.image}
                                      round={true}
                                      size="26"
                                      className="box-content border-white border-1 dark:border-gray-800"
                                    />
                                    <span className="text-xs">
                                      <span className="font-semibold">
                                        {event.responsableEvent?.nom}{" "}
                                        {event.responsableEvent?.prenom},{" "}
                                      </span>
                                      {event.responsableEvent?.position} au{" "}
                                      {event.responsableEvent?.service}
                                    </span>
                                  </span>
                                </>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-900 dark:border-gray-700/60">
                          {/* Card header */}
                          <div className="flex items-center mb-2 truncate grow">
                            <div className="flex items-center justify-center w-8 h-8 mr-2 bg-gray-700 rounded-full shrink-0">
                              <img
                                className="ml-1"
                                src={Icon02}
                                width="14"
                                height="14"
                                alt="Icon 02"
                              />
                            </div>
                            <div className="truncate">
                              <span className="text-sm font-medium text-gray-800 dark:text-gray-100">
                                Participants de l'événement
                              </span>
                            </div>
                          </div>
                          {/* Card content */}
                          <div className="mb-3 text-xs">
                            <p>
                              Pour toute information ou assistance concernant
                              cet événement, vous pouvez également contacter
                              directement les participants via leurs coordonnées
                              personnelles. Ils seront ravis de vous aider à
                              toute étape de l'événement.
                            </p>
                            <p className="mt-2 text-gray-600">
                              Si vous avez des questions supplémentaires,
                              n'hésitez pas à vous rapprocher de l'un des
                              participants ou du responsable pour obtenir plus
                              de détails.
                            </p>
                          </div>
                          {/* Card footer */}
                          <div className="flex items-center justify-between">
                            {/* Avatars group */}
                            <div className="flex -space-x-3 -ml-0.5 ">
                              <div>
                                {participants?.length > 0 ? (
                                  <>
                                    {participants
                                      .slice(0, 2)
                                      .map((responsable, index) => (
                                        <span
                                          key={index}
                                          className="flex items-center gap-2 my-2"
                                        >
                                          <Avatar
                                            name={`${responsable?.nom} ${responsable?.prenom}`}
                                            src={responsable?.image}
                                            round={true}
                                            size="26"
                                            className="box-content border-white border-1 dark:border-gray-800"
                                          />
                                          <span className="text-xs">
                                            <span className="font-semibold">
                                              {responsable?.nom}{" "}
                                              {responsable?.prenom},{" "}
                                            </span>
                                            {responsable?.position} au{" "}
                                            {responsable?.service}
                                          </span>
                                        </span>
                                      ))}
                                    {participants.length > 2 && (
                                      <div className="text-xs italic font-medium text-gray-400 dark:text-gray-500">
                                        +{participants?.length - 2} Participants
                                      </div>
                                    )}
                                  </>
                                ) : (
                                  <p className="text-xs text-gray-500">
                                    Aucun participant associé à cet événement
                                    pour le moment.
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* File conducteur */}
                    <EvenementFilesConducteur
                      responsableLog={responsableLog}
                      event={event}
                      slice
                    />

                    {/*invitations */}
                    <EvenementInvitationsGreated
                      responsableLog={responsableLog}
                      event={event}
                      slice
                    />
                  </>
                )}
              </div>
            </>
          ) : page === "Tache" ? (
            <>
              <EvenementTaches event={event} responsableLog={responsableLog} />
            </>
          ) : page === "Files" ? (
            <>
              <EvenementFilesConducteur
                event={event}
                responsableLog={responsableLog}
              />
            </>
          ) : page === "Demandes" ? (
            <>
              <EvenementsSocieteDemandes
                responsable={responsableLog}
                event={event}
                setNewDemande={setNewDemande}
                fetchData={fetchData}
                sousPage={page}
                responsableLog={responsableLog}
              />
            </>
          ) : page === "Participants" ? (
            <EvenementsSocieteDemandes
              responsable={responsableLog}
              event={event}
              setNewDemande={setNewDemande}
              fetchData={fetchData}
              sousPage={page}
              responsableLog={responsableLog}
            />
          ) : page === "Invités" ? (
            <EvenementInvitationsGreated
              responsableLog={responsableLog}
              event={event}
            />
          ) : (
            <></>
          )}

          {/* Sidebar */}
          <aside className="space-y-3 xl:min-w-56 xl:w-56">
            <div className="text-sm">
              <h3 className="font-medium text-gray-800 dark:text-gray-100">
                Titre
              </h3>
              <div className="text-xs">
                {event.eventName ? (
                  <LibelleFormat libelle={event.eventName} />
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="text-sm">
              {event.location && (
                <>
                  <h3 className="font-medium text-gray-800 dark:text-gray-100">
                    Lieux
                  </h3>
                  <div>{event.location ? event.location : ""}</div>
                </>
              )}
            </div>
            <div className="text-sm">
              <h3 className="font-medium text-gray-800 dark:text-gray-100">
                Ajouter par:
              </h3>
              <div>{event.creer_par ? event.creer_par : ""}</div>
            </div>
            <div className="text-sm">
              <h3 className="font-medium text-gray-800 dark:text-gray-100">
                Ajouter le
              </h3>
              <div>
                {event.dateInscription
                  ? new Date(event.dateInscription).toLocaleDateString(
                      "fr-FR",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }
                    )
                  : ""}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default ProfileBody;

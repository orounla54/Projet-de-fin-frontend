import React, { useState } from "react";
import DangerModal from "../../components/DangerModal";
import AddTachesEvenementsDefaut from "../../components/AddTachesEvenementsDefaut";
import DescriptionFormat from "../../components/DescriptionFormat";
import DateRefactor1 from "../../components/DateRefactor1";

function TransactionsTableItem(props) {
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);

  const statusColor = (status) => {
    switch (status) {
      case "Evenement":
        return "bg-red-500/20 text-red-700";
      case "Activitée":
        return "bg-green-500/20 text-green-700";
      case "Reunion":
        return "bg-sky-500/20 text-sky-700";
      case "Rendez-vous":
        return "bg-violet-500/20 text-violet-700";
      case "Séminaire":
        return "bg-orange-500/20 text-orange-700";
      case "Autre":
        return "bg-yellow-500/20 text-yellow-700";
      default:
        return "bg-gray-400/20 text-gray-500 dark:text-gray-400";
    }
  };

  const categoryIcon = (category) => {
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

  return (
    <tr>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-px">
        <div className="flex items-center">
          <label className="inline-flex">
            <span className="sr-only">Select</span>
            <input
              id={props.id}
              className="form-checkbox"
              type="checkbox"
              onChange={props.handleClick}
              checked={props.isChecked}
            />
          </label>
        </div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap md:w-1/2">
        <div className={`flex items-center`}>
          <div className="w-9 h-9 shrink-0 mr-2 sm:mr-3">
            {props.enventType && categoryIcon(props.enventType)}
          </div>
          <div className="flex flex-col flex-wrap">
            <div className="font-medium text-gray-800 dark:text-gray-100">
              {props.libelle}
            </div>
            {props?.description && (
              <p className="text-xs text-justify">
                {props.description ? (
                  <>
                    <DescriptionFormat description={props.description} />
                  </>
                ) : (
                  <></>
                )}
              </p>
            )}
          </div>
        </div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div className="text-left text-xs">
          <DateRefactor1 date={props.dateInscription} />
        </div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div className="text-center">
          <div
            className={`text-xs inline-flex font-medium rounded-full text-center px-2.5 py-1 ${statusColor(
              props.enventType
            )}`}
          >
            {props.enventType}
          </div>
        </div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-px">
        <div className={`text-right font-medium flex gap-1 items-center`}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setFeedbackModalOpen(true);
            }}
            className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 rounded-full"
          >
            <span className="sr-only">Edit</span>
            <svg className="w-8 h-8 fill-current" viewBox="0 0 32 32">
              <path d="M19.7 8.3c-.4-.4-1-.4-1.4 0l-10 10c-.2.2-.3.4-.3.7v4c0 .6.4 1 1 1h4c.3 0 .5-.1.7-.3l10-10c.4-.4.4-1 0-1.4l-4-4zM12.6 22H10v-2.6l6-6 2.6 2.6-6 6zm7.4-7.4L17.4 12l1.6-1.6 2.6 2.6-1.6 1.6z" />
            </svg>
          </button>
          <DangerModal
            refreshList={props.fetchData}
            endpoint={"tachesEvenementParDefaut"}
            idObjet={props.id}
            libelleObjet={props.libelle}
          />
        </div>
        <AddTachesEvenementsDefaut
          fetchData={props.fetchData}
          feedbackModalOpen={feedbackModalOpen}
          setFeedbackModalOpen={setFeedbackModalOpen}
          tacheDefaultEvent={props.tache}
        />
      </td>
    </tr>
  );
}

export default TransactionsTableItem;

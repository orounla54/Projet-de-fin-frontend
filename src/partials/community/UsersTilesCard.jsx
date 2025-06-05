import React, { useState } from "react";
import { Link } from "react-router-dom";
import EditMenu from "../../components/DropdownEditMenu";
import Avatar from "react-avatar";
import DangerModal from "../../components/DangerModal";
import UpdateResponsableForm from "../../components/UpdateResponsableForm";

function UsersTilesCard(props) {
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);

  return (
    <div className="col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      <div className="flex flex-col h-full">
        {/* Card top */}
        <div className="grow p-5">
          <div className="flex justify-between items-start">
            {/* Image + name */}
            <header>
              <div className="flex mb-2">
                <Link className="relative inline-flex items-start mr-5">
                  <div
                    className="absolute top-0 right-0 -mr-2 bg-white dark:bg-gray-700 rounded-full shadow"
                    aria-hidden="true"
                  >
                    <svg
                      className="w-8 h-8 fill-current text-yellow-500"
                      viewBox="0 0 32 32"
                    >
                      <path d="M21 14.077a.75.75 0 01-.75-.75 1.5 1.5 0 00-1.5-1.5.75.75 0 110-1.5 1.5 1.5 0 001.5-1.5.75.75 0 111.5 0 1.5 1.5 0 001.5 1.5.75.75 0 010 1.5 1.5 1.5 0 00-1.5 1.5.75.75 0 01-.75.75zM14 24.077a1 1 0 01-1-1 4 4 0 00-4-4 1 1 0 110-2 4 4 0 004-4 1 1 0 012 0 4 4 0 004 4 1 1 0 010 2 4 4 0 00-4 4 1 1 0 01-1 1z" />
                    </svg>
                  </div>
                  <Avatar
                    name={props.name}
                    round={true}
                    size="64"
                    src={props.image}
                  />
                </Link>
                <div className="mt-1 pr-1">
                  <Link className="inline-flex text-gray-800 dark:text-gray-100 hover:text-gray-900 dark:hover:text-white">
                    <h2 className="text-xl leading-snug justify-center font-semibold">
                      {props.name}
                    </h2>
                  </Link>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-400 dark:text-gray-500 -mt-0.5 mr-1">
                      -&gt;
                    </span>{" "}
                    <span className="text-xs font-bold">
                      {props.email ? `@${props.email}` : ""}
                    </span>
                  </div>
                </div>
              </div>
            </header>
            {/* Menu button */}

            <EditMenu align="right" className="relative inline-flex shrink-0">
              <li>
                <Link
                  onClick={(e) => {
                    e.stopPropagation();
                    setFeedbackModalOpen(true);
                  }}
                  className="font-medium text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200 flex py-1 px-3"
                >
                  Modifier
                </Link>
              </li>
              <li className="flex items-center">
                <Link className="font-medium text-sm text-red-500 hover:text-red-600 flex py-1 px-3">
                  Remove
                </Link>
                <DangerModal
                  endpoint="responsables"
                  idObjet={props.id}
                  refreshList={props.fetchData}
                  libelleObjet={props.name}
                />
              </li>
            </EditMenu>
          </div>
          <UpdateResponsableForm
            responsable={props.item}
            fetchData={props.fetchData}
            feedbackModalOpen={feedbackModalOpen}
            setFeedbackModalOpen={setFeedbackModalOpen}
            idPosition={props?.position?.id}
            idPoste={props?.poste?.id}
            idService={props?.service?.id}

          />
          {/* Bio */}
          <div className="mt-2 mb-4">
            <div className="text-sm">
              {props.poste
                ? `${props?.poste?.libelle} au ${
                    props?.service?.libelle || "service inconnu"
                  } en tant que ${props?.position?.libelle || "position inconnue"}`
                : "Aucune information ou manquante."}
            </div>
          </div>

          <ul className="text-sm space-y-2 mb-2 dark:text-gray-300">
            <li className="flex items-center">
              <svg
                className="fill-current text-gray-400 dark:text-gray-500 shrink-0 mr-3"
                width="16"
                height="16"
                viewBox="0 0 16 16"
              >
                <path d="M7 11.674A1 1 0 0 1 7.739 10H8a1 1 0 0 1 1 1v1.699L14.034 8 9 3.302v1.699a1 1 0 0 1-1 1H2V8.27a1 1 0 1 1-2 0V6a2 2 0 0 1 2-2h5V2.153C7 .84 8.563.16 9.523 1.055l6.268 5.849a1.5 1.5 0 0 1 0 2.193l-6.267 5.849C8.565 15.84 7 15.16 7 13.849v-2.175Zm-1.278.878a.498.498 0 0 1 0 .896L4.2 14.2l-.752 1.521a.5.5 0 0 1-.896 0l-.752-1.52-1.521-.753a.498.498 0 0 1 0-.896l1.521-.752.752-1.52c.167-.342.728-.342.896 0L4.2 11.8l1.521.752ZM3.75 3a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5Z" />
              </svg>
              <div>{props?.poste?.libelle || "Aucun poste"}</div>
            </li>
            <li className="flex items-center">
              <svg
                className="fill-current text-gray-400 dark:text-gray-500 shrink-0 mr-3"
                width="16"
                height="16"
                viewBox="0 0 16 16"
              >
                <path d="M7 7a1 1 0 1 1 0 2H1a1 1 0 1 1 0-2h6Zm8-5a1 1 0 0 1 0 2H1a1 1 0 1 1 0-2h14ZM5 12a1 1 0 0 1 0 2H1a1 1 0 0 1 0-2h4Z" />
              </svg>
              <div>{props?.position?.libelle || "Aucune position"}</div>
            </li>
            <li className="flex items-center">
              <svg
                className="fill-current text-gray-400 dark:text-gray-500 shrink-0 mr-3"
                width="16"
                height="16"
                viewBox="0 0 16 16"
              >
                <path d="M4.17 14H3a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3h1.17A3.001 3.001 0 0 1 7 0h6a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3.001 3.001 0 0 1-2.83-2ZM4 4H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h1V4Zm10 9V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1Z" />
              </svg>
              <div>{props?.service?.libelle || "Dans Aucun service ou direction"}</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default UsersTilesCard;

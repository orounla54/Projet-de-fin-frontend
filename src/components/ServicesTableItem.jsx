import React, { useState } from "react";
import { Link } from "react-router-dom";
import LibelleFormat from "./LibelleFormat";
import DateRefactor from "./DateRefactor";
import DangerModal from "./DangerModal";
import UpdateAdminElement from "./UpdateAdminElement";

function ServicesTableItem(props) {
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);

  const totalColor = (status) => {
    switch (status) {
      case "Terminé":
        return "text-green-500";
      case "En-cours":
        return "text-yellow-500";
      default:
        return "text-gray-500";
    }
  };

  const statusColor = (status) => {
    switch (status) {
      case "Terminé":
        return "bg-green-500/20 text-green-700";
      case "En-cours":
        return "bg-yellow-500/20 text-yellow-700";
      default:
        return "bg-gray-400/20 text-gray-500 dark:text-gray-400";
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
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div className="font-medium text-sky-800 text-left">
          <Link>
            <LibelleFormat libelle={props.libelle} />
          </Link>
        </div>
      </td>
      {props.element !== "categories" ||
        props.element !== "roles tache" ||
        props.element !== "roles plan" ||
        (props.element !== "type priorite" && (
          <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
            <div className=" text-left text-xs">
              <Link>
                <LibelleFormat lenght={50} libelle={props.description} />
              </Link>
            </div>
          </td>
        ))}
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div className={`font-medium ${totalColor("")}`}>
          {props.dateInscription ? (
            <DateRefactor date={props.dateInscription} />
          ) : (
            "Aucune date"
          )}
        </div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-px">
        <div className="space-x-1 flex items-center justify-center">
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
          <UpdateAdminElement
            element={props.element}
            fetchData={props.refreshList}
            feedbackModalOpen={feedbackModalOpen}
            setFeedbackModalOpen={setFeedbackModalOpen}
            id={props.id}
          />
          <DangerModal
            refreshList={props.refreshList}
            endpoint={props.element}
            idObjet={props.id}
            libelleObjet={props.libelle}
          />
        </div>
      </td>
    </tr>
  );
}

export default ServicesTableItem;

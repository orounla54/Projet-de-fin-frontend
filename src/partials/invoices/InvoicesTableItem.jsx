import React from "react";
import LibelleFormat from "../../components/LibelleFormat";
import DateRefactor from "../../components/DateRefactor";
import DangerModal from "../../components/DangerModal";
import { Link } from "react-router-dom";

function  InvoicesTableItem(props) {
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
          <Link to={`/projets/${props.id}`}>
            <LibelleFormat libelle={props.libelle} />
          </Link>
        </div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div className={`font-medium ${totalColor("")}`}>
          <DateRefactor date={props.dateInscription} />
        </div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div className="font-medium text-gray-800 dark:text-gray-100">
        {props.datePriseDecision ? (
            <DateRefactor date={props.datePriseDecision} />
          ) : (
            <span className="text-xs">Aucune date</span>
          )}
        </div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div className="font-medium text-gray-800 dark:text-gray-100">
        {props.dateDebut  ? (
            <DateRefactor date={props.dateDebut} />
          ) : (
            <span className="text-xs">Aucune date</span>
          )}
        </div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div className="font-medium text-gray-800 dark:text-gray-100">
        {props.dateFin ? (
            <DateRefactor date={props.dateFin} />
          ) : (
            <span className="text-xs">Aucune date</span>
          )}
        </div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div className="font-medium text-gray-800 dark:text-gray-100">
        {props.deadline  ? (
            <DateRefactor date={props.deadline} />
          ) : (
            <span className="text-xs">Aucune date</span>
          )}
        </div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div className="flex items-center justify-center">
          <div
            className={`inline-flex text-xs rounded-full text-center px-2 ${statusColor(
              props.status
            )}`}
          >
            {props.status}
          </div>
        </div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-px">
        <div className="space-x-1 flex items-center justify-center">
          <Link
            to={`/modification/projets/${props.id}`}
            className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 rounded-full"
          >
            <span className="sr-only">Edit</span>
            <svg className="w-8 h-8 fill-current" viewBox="0 0 32 32">
              <path d="M19.7 8.3c-.4-.4-1-.4-1.4 0l-10 10c-.2.2-.3.4-.3.7v4c0 .6.4 1 1 1h4c.3 0 .5-.1.7-.3l10-10c.4-.4.4-1 0-1.4l-4-4zM12.6 22H10v-2.6l6-6 2.6 2.6-6 6zm7.4-7.4L17.4 12l1.6-1.6 2.6 2.6-1.6 1.6z" />
            </svg>
          </Link>
          <DangerModal
            refreshList={props.refreshList}
            endpoint="projets"
            idObjet={props.id}
            libelleObjet={props.libelle}
          />
        </div>
      </td>
    </tr>
  );
}

export default InvoicesTableItem;

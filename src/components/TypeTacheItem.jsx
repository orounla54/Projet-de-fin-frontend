import React from "react";
import LibelleFormat from "../components/LibelleFormat";
import DateRefactor from "../components/DateRefactor";
import DangerModal from "../components/DangerModal";
import { Link } from "react-router-dom";

function TypeTacheItem(props) {
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


  return (
    <tr>
      {/* <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-px">
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
      </td> */}
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div className="font-medium text-sky-800 text-left">
          <LibelleFormat libelle={props.libelle} />
        </div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div className={`font-medium ${totalColor("")} text-left`}>
          <DateRefactor date={props.dateInscription} />
        </div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-px">
        <div className="space-x-1 flex items-center justify-center">
          <DangerModal
            refreshList={props.refreshList}
            endpoint="typesTaches"
            idObjet={props.id}
            libelleObjet={props.libelle}
          />
        </div>
      </td>
    </tr>
  );
}

export default TypeTacheItem;

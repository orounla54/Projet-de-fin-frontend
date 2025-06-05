import React from "react";
import { Link } from "react-router-dom";
import CircleProgress from "../../charts/CircleProgress";
import LibelleFormat from "../../components/LibelleFormat";
import DateRefactor1 from "../../components/DateRefactor1";
import DescriptionFormat from "../../components/DescriptionFormat";

function PlanListItem(props) {
  const handleEndpoint = () => {
    if (props.page === "axesStrategiques") {
      return "plans/axesStrategiques";
    } else if (props.page === "objectifsStrategiques") {
      return "plans/objectifsStrategiques";
    } else if (props.page === "mesuresStrategiques") {
      return "plans/mesuresStrategiques";
    } else if (props.page === "objectifsOperationnels") {
      return "plans/objectifsOperationnels";
    } else if (props.page === "priorites") {
      return "/plans/priorites/";
    } else {
      return "plans";
    }
  };

  return (
    <div
      className={`bg-white dark:bg-gray-800 shadow-sm rounded-xl px-5 py-4 my-3`}
    >
      <div className="items-center justify-between space-x-2 space-y-4 md:flex md:space-y-0">
        {/* Left side */}
        <div className="flex items-start space-x-3 md:space-x-4">
          <div className="flex items-center justify-center mt-1 shrink-0">
            <CircleProgress width="50" height="50" value={props.progress} />
          </div>
          <div className="flex flex-col justify-center">
            {props.link && (
              <Link
                className="inline-flex font-semibold text-gray-800 dark:text-gray-100"
                to={`/${handleEndpoint()}/${props?.id}`}
              >
                <LibelleFormat lenght={50} libelle={props.libelle} />
              </Link>
            )}
            {!props.link && (
              <div className="inline-flex font-semibold text-gray-800 dark:text-gray-100">
                <LibelleFormat lenght={50} libelle={props.libelle} />
              </div>
            )}

            {props.description && (
              <div className="text-sm">
                <DescriptionFormat
                  justify={false}
                  length={70}
                  description={props.description}
                />
              </div>
            )}
            {props.parent && (
              <div className="mt-2 text-xs font-semibold text-violet-400">
                <LibelleFormat lenght={50} libelle={props.parent} />
              </div>
            )}
          </div>
        </div>
        {/* Right side */}
        <div className="flex flex-wrap items-center justify-center gap-1 pl-10 space-x-2 md:pl-0">
          <div className="text-xs italic text-gray-500 dark:text-gray-400 whitespace-nowrap">
            <DateRefactor1 date={props.dateInscription} />
          </div>
          {props.status && (
            <div
              className={`text-xs inline-flex rounded-full text-center px-2.5 py-1 ${
                props.status === "En-cours"
                  ? "bg-yellow-500/20 text-yellow-700"
                  : props.status === "Terminé"
                  ? "bg-green-500/20 text-green-700"
                  : "bg-gray-500/20 text-gray-500 dark:text-gray-400"
              }`}
            >
              {props.status}
            </div>
          )}
          {props.new === 1 && (
            <div
              className={`text-xs bg-green-500/20 text-green-700 inline-flex font-medium rounded-full text-center  px-2 py-1 `}
            >
              Nouveau
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PlanListItem;

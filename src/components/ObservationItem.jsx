import React, { useState } from "react";
import DangerModal from "./DangerModal";
import Avatar from "react-avatar";
import LibelleFormat from "./LibelleFormat";

function ObservationItem({ observation, refreshList }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <li
      className="flex items-center justify-between m-2 relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex">
        <div className="flex items-center mb-2 gap-4">
          <Avatar name={observation.creer_par} round={true} size="32" />
          <div>
            <div className="text-sm font-semibold text-gray-800 dark:text-gray-100">
              <LibelleFormat libelle={observation.creer_par} />
            </div>
            <div className="text-sm italic">“{observation.libelle}”</div>
          </div>
        </div>
      </div>
      {isHovered && (
        <div className="absolute -left-8 -top-4">
          <DangerModal
            endpoint="observations"
            idObjet={observation.id}
            libelleObjet={observation.libelle}
            refreshList={refreshList}
          />
        </div>
      )}
    </li>
  );
}

export default ObservationItem;

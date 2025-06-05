import React, { useEffect, useState } from "react";
import Avatar from "react-avatar";
import DangerModal from "../DangerModal";
import { useGetData } from "../../utils/Requests/RequestService";

function ResponsableTacheItem({
  responsable,
  tache,
  fetchTache,
  index,
  responsableLog,
}) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // console.log(responsable)

  return (
    <div
      className="relative flex justify-between p-2"
      onMouseEnter={() => setHoveredIndex(index)}
      onMouseLeave={() => setHoveredIndex(null)}
    >
      <div className="flex items-center grow">
        <div
          className={`relative mr-3 ${
            responsable.id ===  parseInt(tache.Responsable_Prin, 10) &&
            responsable.role === "Responsable"
              ? "border-3 border-violet-300 rounded-full"
              : responsable.role === "Contributeur"
              ? "border-3 border-green-300 rounded-full"
              : responsable.role === "Collaborateur"
              ? "border-3 border-orange-400 rounded-full"
              : ""
          }`}
        >
          {responsable && (
            <Avatar
              name={`${responsable.nom} ${responsable.prenom}`}
              round={true}
              size="32"
              src={responsable.photoProfileLien} // Le lien de l'image
            />
          )}
        </div>
        <div className="truncate">
          <span className="text-xs font-medium text-gray-800 dark:text-gray-100">
            {responsable.nom} {responsable.prenom} -{" "}
            <span
              className={
                responsable.id ===  parseInt(tache.Responsable_Prin, 10)
                  ? "font-bold text-violet-400"
                  : responsable.role === "Contributeur"
                  ? "font-bold text-green-300"
                  : responsable.role === "Collaborateur"
                  ? "font-bold text-orange-400"
                  : ""
              }
            >
              {responsable.role}
            </span>
          </span>
        </div>
      </div>
      <div className="absolute -top-1 -left-2">
        {hoveredIndex === index &&
          responsable.id !==  parseInt(tache.Responsable_Prin, 10) &&
          responsableLog?.id === parseInt( parseInt(tache.Responsable_Prin, 10)) && (
            <DangerModal
              endpoint="responsable_deleteTache"
              refreshList={fetchTache}
              idObjet={responsable.id}
              tache={tache}
              libelleObjet={responsable.nom + " " + responsable.prenom}
            />
          )}
      </div>
    </div>
  );
}

export default ResponsableTacheItem;

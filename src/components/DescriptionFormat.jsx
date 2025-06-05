import { useState } from "react";

function DescriptionFormat({ description = "", length = 100, justify = true }) {
  const [expanded, setExpanded] = useState(false);

  // Si la description est vide, on affiche un message par défaut
  if (!description) return <p className="text-gray-500">Aucune description</p>;

  const formattedDescription = description.split("\n").map((paragraph, index) => (
    <p key={index} className={`mb-2 ${justify ? "text-justify" : ""} `}>{paragraph.trim()}</p>
  ));

  return (
    <div className="">
      {expanded ? (
        formattedDescription
      ) : (
        <>
          {formattedDescription.slice(0, 1)}
          {description.length > length && <p className="inline">...</p>}
        </>
      )}

      {/* Bouton Voir plus / Voir moins */}
      {description.length > length && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-violet-500 dark:text-violet-400 hover:underline ml-1 italic"
        >
          {expanded ? "Voir moins" : "Voir plus"}
        </button>
      )}
    </div>
  );
}

export default DescriptionFormat;

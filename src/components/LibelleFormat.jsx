import React from "react";

function LibelleFormat({ libelle, lenght = 35 }) {
  return (
    <div>
      <span>
        {" "}
        {libelle && libelle.length > lenght
          ? `${libelle.slice(0, lenght)}...`
          : libelle}
      </span>
    </div>
  );
}

export default LibelleFormat;

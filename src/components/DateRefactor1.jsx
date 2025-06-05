import React from "react";

const formateDate = (date) => {
  const inscriptionDate = new Date(date);
  const today = new Date();

  // Vérification si la date correspond à aujourd'hui
  const isToday =
    inscriptionDate.getDate() === today.getDate() &&
    inscriptionDate.getMonth() === today.getMonth() &&
    inscriptionDate.getFullYear() === today.getFullYear();

  if (isToday) {
    return `Aujourd'hui, ${inscriptionDate.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    })}`; // Affiche "Aujourd'hui, HH:mm"
  }

  // Sinon, formater avec la date et l'heure
  return inscriptionDate.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

function DateRefactor1({ date }) {
  return formateDate(date);
}

export default DateRefactor1;

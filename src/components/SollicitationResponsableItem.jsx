import React, { useState } from "react";
import User07 from "../images/user-32-07.jpg";
import AddSollicitations from "./AddSollicitations";
import DangerModal from "./DangerModal";
import { baseURL } from "../utils/DataFront/eventTypes";
import AuthService from "../utils/Auth/AuthServices";
import axios from "axios";
import SpinnerLoading from "./SpinnerLoading";
import Avatar from "react-avatar";

function SollicitationResponsableItem({ sollicitation, fetchData }) {
  const baseUrl = baseURL;
  const [loading, setLoading] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  
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

  const onchangeSatisfaction = async () => {
    try {
      setLoading(true);
      const objetStatusSatisfaction = {
        satisfaire: !sollicitation?.satisfaire || false,
      };

      console.log(objetStatusSatisfaction);

      const accessToken = AuthService.getAccessToken();
      await axios.put(
        `${baseUrl}/sollicitations/${sollicitation?.id}`,
        objetStatusSatisfaction,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      await fetchData();
    } catch (error) {
      // Gère les erreurs et affiche le message approprié
      const errorMessage =
        error.response && error.response.data
          ? error.response.data.message // Message d'erreur spécifique renvoyé par le serveur
          : "Erreur inattendue lors de la modification de la sollicitation";
      console.log(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const onchangeImportant_Urgent = async (etat) => {
    let objetStatusSatisfaction;
    try {
      setLoading(true);
      if (etat === "important") {
        objetStatusSatisfaction = {
          important: !sollicitation?.important || false,
        };
      } else {
        objetStatusSatisfaction = {
          urgent: !sollicitation?.urgent || false,
        };
      }

      console.log(objetStatusSatisfaction);

      const accessToken = AuthService.getAccessToken();
      await axios.put(
        `${baseUrl}/sollicitations/${sollicitation?.id}`,
        objetStatusSatisfaction,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      await fetchData();
    } catch (error) {
      // Gère les erreurs et affiche le message approprié
      const errorMessage =
        error.response && error.response.data
          ? error.response.data.message // Message d'erreur spécifique renvoyé par le serveur
          : "Erreur inattendue lors de la modification de la sollicitation";
      console.log(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <article className="pt-6" key={sollicitation?.id}>
        <div className="xl:flex">
          <div className="w-32 shrink-0">
            <div className="text-xs font-semibold text-gray-400 uppercase xl:mr-2 xl:mt-2 dark:text-gray-500 ">
              {sollicitation.dateInscription
                ? formateDate(sollicitation.dateInscription)
                : "Aucune date"}
            </div>
          </div>
          <div className="pb-6 border-b border-gray-200 grow dark:border-gray-700/60">
            <header>
              <h2 className="mb-3 text-xl font-bold text-gray-800 dark:text-gray-100">
                {sollicitation?.libelle || "Aucun libelle entrer"}
              </h2>
              <div className="flex flex-wrap items-center mb-4 space-x-2">
                <div className="flex items-center">
                  <a className="block mr-2 shrink-0">
                    {loading ? (
                      <>
                        <SpinnerLoading />
                      </>
                    ) : (
                      <div className="relative">
                        <Avatar
                          name={`${sollicitation.libelle}`}
                          round={true}
                          size="32"
                        />
                        {sollicitation.new === 1 && (
                          <div className="absolute -top-1 -left-2">
                            <svg
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              className="size-4 fill-green-600"
                            >
                              <path d="M15.98 1.804a1 1 0 0 0-1.96 0l-.24 1.192a1 1 0 0 1-.784.785l-1.192.238a1 1 0 0 0 0 1.962l1.192.238a1 1 0 0 1 .785.785l.238 1.192a1 1 0 0 0 1.962 0l.238-1.192a1 1 0 0 1 .785-.785l1.192-.238a1 1 0 0 0 0-1.962l-1.192-.238a1 1 0 0 1-.785-.785l-.238-1.192ZM6.949 5.684a1 1 0 0 0-1.898 0l-.683 2.051a1 1 0 0 1-.633.633l-2.051.683a1 1 0 0 0 0 1.898l2.051.684a1 1 0 0 1 .633.632l.683 2.051a1 1 0 0 0 1.898 0l.683-2.051a1 1 0 0 1 .633-.633l2.051-.683a1 1 0 0 0 0-1.898l-2.051-.683a1 1 0 0 1-.633-.633L6.95 5.684ZM13.949 13.684a1 1 0 0 0-1.898 0l-.184.551a1 1 0 0 1-.632.633l-.551.183a1 1 0 0 0 0 1.898l.551.183a1 1 0 0 1 .633.633l.183.551a1 1 0 0 0 1.898 0l.184-.551a1 1 0 0 1 .632-.633l.551-.183a1 1 0 0 0 0-1.898l-.551-.184a1 1 0 0 1-.633-.632l-.183-.551Z" />
                            </svg>
                          </div>
                        )}
                      </div>
                    )}
                  </a>
                  <a
                    className="block text-sm font-semibold text-gray-800 dark:text-gray-100"
                    href="#0"
                  >
                    {sollicitation?.service || "Aucun service"}
                  </a>
                </div>
                <div className="text-gray-400 dark:text-gray-600">·</div>
                <div className="flex items-center gap-1">
                  <div
                    className={`text-xs inline-flex font-medium rounded-full text-center px-2.5 py-1 ${
                      sollicitation?.status === "Traitée"
                        ? "bg-green-500/20 text-green-700"
                        : sollicitation?.status === "En-cours de traitement"
                        ? "bg-yellow-500/20 text-yellow-700"
                        : "bg-violet-500/20 text-violet-700"
                    }  shrink-0`}
                  >
                    {sollicitation?.status}
                  </div>
                  <div className="text-gray-400 dark:text-gray-600">·</div>
                  <button
                    onClick={() => onchangeSatisfaction()}
                    className={`text-xs inline-flex font-medium rounded-full text-center px-2 py-0.5 ${
                      sollicitation?.satisfaire
                        ? "bg-green-500/20 text-green-700 leading-5 border border-green-200 dark:border-green-700/60 hover:border-green-300 dark:hover:border-green-600 shadow-sm dark:text-green-400 transition"
                        : "bg-violet-gray/20 text-gray-700 leading-5 border border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 shadow-sm bg-white dark:bg-gray-800 dark:text-gray-400 transition"
                    }  shrink-0`}
                  >
                    <>
                      {sollicitation?.satisfaire ? "Satisfait" : "Satisfaire"}
                    </>
                  </button>

                  <div className="text-gray-400 dark:text-gray-600">·</div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFeedbackModalOpen(true);
                    }}
                    className="inline-flex items-center justify-center text-xs leading-5 rounded-full px-2 py-0.5 border border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 shadow-sm bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 transition"
                  >
                    Modifier
                  </button>
                  <div className="text-gray-400 dark:text-gray-600">·</div>
                  <button className="inline-flex items-center justify-center text-xs leading-5 rounded-full px-2 py-0.5 border border-red-200 dark:border-red-700/60 hover:border-red-300 dark:hover:border-red-600 shadow-sm bg-white dark:bg-gray-800 text-red-500 dark:text-red-400 transition">
                    <DangerModal
                      endpoint="sollicitations"
                      idObjet={sollicitation.id}
                      libelleObjet={sollicitation.libelle}
                      refreshList={fetchData}
                    />
                  </button>
                </div>
              </div>
            </header>
            <AddSollicitations
              fetchData={fetchData}
              sollicitation={sollicitation}
              feedbackModalOpen={feedbackModalOpen}
              setFeedbackModalOpen={setFeedbackModalOpen}
            />
            {sollicitation?.description && (
              <div className="space-y-3">
                <p className="mb-2 text-sm text-justify text-gray-700 dark:text-gray-400">
                  {sollicitation?.description
                    .split("\n")
                    .map((paragraph, index) => (
                      <p key={index} className="mb-1">
                        {paragraph.trim()}
                      </p>
                    ))}
                </p>
              </div>
            )}
            <div className="flex items-center justify-end gap-0.5">
              {/* Like button */}
              <button
                onClick={() => onchangeImportant_Urgent("important")}
                className="flex items-center"
              >
                {sollicitation && sollicitation.important ? (
                  <>
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-5 fill-yellow-500"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </>
                ) : (
                  <>
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-5 fill-gray-400"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </>
                )}
              </button>

              <button
                onClick={() => onchangeImportant_Urgent("urgent")}
                className="flex items-center"
              >
                {sollicitation && sollicitation.urgent ? (
                  <>
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-6 h-6 fill-orange-500"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18Zm1 5a1 1 0 1 0-2 0v4a1 1 0 1 0 2 0V8Zm-1 8.25a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </>
                ) : (
                  <>
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-6 h-6 fill-gray-400"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18Zm1 5a1 1 0 1 0-2 0v4a1 1 0 1 0 2 0V8Zm-1 8.25a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}

export default SollicitationResponsableItem;

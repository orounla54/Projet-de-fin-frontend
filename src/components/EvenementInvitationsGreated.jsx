import React, { useEffect, useState } from "react";
import SpinnerLoading from "./SpinnerLoading";
import { baseURL, baseUrlInvitations } from "../utils/DataFront/eventTypes";
import axios from "axios";
import EvenementInvitationsGreatedItem from "./EvenementInvitationsGreatedItem";
import { useGetData } from "../utils/Requests/RequestService";
import AuthService from "../utils/Auth/AuthServices";
import PaginationClassic from "./PaginationClassic";

function EvenementInvitationsGreated({ event, slice, responsableLog }) {
  const baseUrl = baseUrlInvitations;
  const baseUrlBa = baseURL;

  const url = `evenementsInviter/${event?.id}`;
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingRepertoireAdd, setLoadingRepertoireAdd] = useState(false);

  const [invitationsGreated, setInvitationsGreated] = useState([]);
  const [repertoire, setRepertoire] = useState([]);
  // Récupérer l'enevenement
  const {
    data: dataRespertoire,
    loading: loadingRespertoire,
    error: errorRespertoire,
    fetchData: fetchDataRespertoire,
  } = useGetData(`repertoires`);

  // Récupérer l'enevenement
  const fetchData = async () => {
    try {
      if (url && event.id) {
        const response = await axios.get(`${baseUrl}/${url}`, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });
        setData(response.data);
        setError("");
      } else {
        console.log("Pas de url alors pas de requete");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [url]);

  const copieLien = () => {
    //papier press lien nom de domaine  + event?id + event?.libelle /evenements/:libelle/:id/confirmation/inviter
    const protocol = window.location.protocol;
    const host = window.location.host;
    const url = `${protocol}//${host}`;
    const lien = `${url}/evenements/${event?.eventName}/${event?.id}/confirmation/inviter`;
    console.log(lien);

    // Copier le lien dans le presse-papiers
    navigator.clipboard
      .writeText(lien)
      .then(() => {
        console.log("Lien copié dans le presse-papiers");
      })
      .catch((err) => {
        console.error("Erreur lors de la copie du lien : ", err);
      });
  };

  //effectue la mise à jour de la page quand on a la data
  useEffect(() => {
    if (data) {
      setInvitationsGreated(data);
      console.log(invitationsGreated);
    }

    if (dataRespertoire) {
      setRepertoire(dataRespertoire);
      console.log(repertoire);
    }
  }, [data, dataRespertoire]);

  const addInvitesToRepertoire = async () => {
    setLoadingRepertoireAdd(true);
    const données = invitationsGreated;
    const accessToken = AuthService.getAccessToken();

    try {
      if (données.length > 0) {
        for (const invite of données) {
          await axios.post(`${baseUrlBa}/repertoires`, invite, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          });
        }
      }
      await fetchData();
      await fetchDataRespertoire();
    } catch (error) {
      console.error("Erreur lors de l'ajout au répertoire :", error);
    } finally {
      setLoadingRepertoireAdd(false);
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const indexOfLastProject = currentPage * itemsPerPage;
  const indexOfFirstProject = indexOfLastProject - itemsPerPage;
  const currentsInvitationsGreated = invitationsGreated.slice(
    indexOfFirstProject,
    indexOfLastProject
  );

  // Fonction de changement de page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className={`mb-4 ${!slice ? "xl:w-4/5" : ""}`}>
      <div className="flex items-center justify-between my-2">
        <h2 className="mb-2 font-semibold text-gray-800 dark:text-gray-100">
          Invitations acceptées{" "}
          <span className="font-semibold text-violet-400">
            {invitationsGreated.length}
          </span>
        </h2>
        <div>
          {parseInt(responsableLog.id, 10) ===
            parseInt(event.idResponsable, 10) && (
            <div className="flex gap-1">
              <button
                onClick={(e) => {
                  copieLien();
                }}
                className="flex items-center justify-center transition bg-white border border-gray-200 rounded-full shadow-sm w-7 h-7 dark:bg-gray-800 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-violet-500"
              >
                <span className="sr-only">
                  Lien pour répondre à l'invitation
                </span>
                <svg
                  className="text-gray-400 fill-current shrink-0 dark:text-gray-500"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                >
                  <path d="M11 0c1.3 0 2.6.5 3.5 1.5 1 .9 1.5 2.2 1.5 3.5 0 1.3-.5 2.6-1.4 3.5l-1.2 1.2c-.2.2-.5.3-.7.3-.2 0-.5-.1-.7-.3-.4-.4-.4-1 0-1.4l1.1-1.2c.6-.5.9-1.3.9-2.1s-.3-1.6-.9-2.2C12 1.7 10 1.7 8.9 2.8L7.7 4c-.4.4-1 .4-1.4 0-.4-.4-.4-1 0-1.4l1.2-1.1C8.4.5 9.7 0 11 0ZM8.3 12c.4-.4 1-.5 1.4-.1.4.4.4 1 0 1.4l-1.2 1.2C7.6 15.5 6.3 16 5 16c-1.3 0-2.6-.5-3.5-1.5C.5 13.6 0 12.3 0 11c0-1.3.5-2.6 1.5-3.5l1.1-1.2c.4-.4 1-.4 1.4 0 .4.4.4 1 0 1.4L2.9 8.9c-.6.5-.9 1.3-.9 2.1s.3 1.6.9 2.2c1.1 1.1 3.1 1.1 4.2 0L8.3 12Zm1.1-6.8c.4-.4 1-.4 1.4 0 .4.4.4 1 0 1.4l-4.2 4.2c-.2.2-.5.3-.7.3-.2 0-.5-.1-.7-.3-.4-.4-.4-1 0-1.4l4.2-4.2Z" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  addInvitesToRepertoire();
                }}
                className="flex items-center justify-center transition bg-white border border-gray-200 rounded-full shadow-sm w-7 h-7 dark:bg-gray-800 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 "
              >
                <span className="sr-only">Ajouter au reportoire</span>
                <svg
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="size-4 text-gray-400 dark:text-gray-500"
                >
                  <path
                    fillRule="evenodd"
                    d="M2 8a.75.75 0 0 1 .75-.75h8.69L8.22 4.03a.75.75 0 0 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 0 1-1.06-1.06l3.22-3.22H2.75A.75.75 0 0 1 2 8Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-900 dark:border-gray-700/60">
        <ul className="space-y-3">
          {loading || loadingRepertoireAdd || loadingRespertoire ? (
            <>
              <SpinnerLoading />
            </>
          ) : (
            <>
              {currentsInvitationsGreated &&
              currentsInvitationsGreated.length > 0 ? (
                <>
                  {slice ? (
                    <>
                      {currentsInvitationsGreated
                        .slice(0, 8)
                        .map((invitation, index) => (
                          <EvenementInvitationsGreatedItem
                            invitation={invitation}
                            index={index}
                            fetchData={() => {
                              fetchData();
                              fetchDataRespertoire();
                            }}
                            event={event}
                            responsableLog={responsableLog}
                            repertoire={repertoire}
                          />
                        ))}
                    </>
                  ) : (
                    <>
                      {" "}
                      {currentsInvitationsGreated.map((invitation, index) => (
                        <EvenementInvitationsGreatedItem
                          invitation={invitation}
                          index={index}
                          fetchData={() => {
                            fetchData();
                            fetchDataRespertoire();
                          }}
                          event={event}
                          responsableLog={responsableLog}
                          repertoire={repertoire}
                        />
                      ))}
                    </>
                  )}
                </>
              ) : (
                <p className="text-xs text-center">
                 Acune invitations acceptée pour le moment.
                </p>
              )}
            </>
          )}
        </ul>
        {invitationsGreated.length > 0 && (
          <div className="mt-8">
            <PaginationClassic
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              totalItems={invitationsGreated.length}
              paginate={paginate}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default EvenementInvitationsGreated;

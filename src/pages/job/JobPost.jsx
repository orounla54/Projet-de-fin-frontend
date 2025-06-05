import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

import Sidebar from "../../partials/Sidebar";
import Header from "../../partials/Header";

import TachesItem from "../../components/TachesItem";
import { useGetData, usePostData } from "../../utils/Requests/RequestService";
import SpinnerLoading from "../../components/SpinnerLoading";
import NewBadge from "../../components/NewBadge";
import AlertBadge from "../../components/AlertBadge";
import StatusBadge from "../../components/StatusBadge";
import DateRefactor from "../../components/DateRefactor";
import LibelleFormat from "../../components/LibelleFormat";

import ModalBasic from "../../components/ModalBasic";
import { useForm } from "react-hook-form";
import { useSuccessMessage } from "../../utils/SuccessContext";
import Toast from "../../components/Toast";
import ObservationItem from "../../components/ObservationItem";
import NoObservation from "../../components/NoObservation";
import TaskProjetItems from "../../partials/tasks/TaskProjetItems";
import FilterTasksProjet from "../../components/FilterTasksProjet";

function JobPost() {
  const navigate = useNavigate();
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);

  const { id } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [projet, setProjet] = useState({});
  const [observationsPro, setObservationPro] = useState([]);
  const [tachesProjets, setTachesProjets] = useState([]);

  // État pour suivre le survol de chaque image individuellement
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const [viewtask, setViewTask] = useState(false);

  // Récupère les données via le hook personnalisé
  const { data, loading, error, fetchData } = useGetData(
    id ? `projets/${id}` : ""
  );

  // observations quand `observations`
  const {
    data: observations,
    loading: loadingObs,
    error: errorsObs,
    fetchData: observationsFetch,
  } = useGetData(id ? `projets/${id}/observations/` : "");

  //query url dynamique
  const [keyword, setKeyword] = useState("");

  const [filter, setFilter] = useState({
    all: true,
    important: false,
    urgent: false,
    enRetard: false,
    search: false,
  });

  const queryParams = new URLSearchParams({
    keyword: filter.search ? keyword : "",
  }).toString();

  //tache du projet
  const {
    data: tachesPro,
    loading: loadingTachesPro,
    error: errorTachesPro,
  } = useGetData(id ? `filter/taches?idProjet=${id}&${queryParams}` : "");

  // Met à jour l'état du projet quand `data` change
  useEffect(() => {
    if (data && observations) {
      setProjet(data);
      setObservationPro(observations);
    }
  }, [data, observations]);

  // Met à jour l'état du projet quand `data` change
  // useEffect(() => {
  //   if (observations) {
  //     setObservationPro(observations);
  //   }
  // }, [observations]);

  useEffect(() => {
    if (!tachesPro) return;

    setTachesProjets(
      tachesPro.filter((tache) => {
        if (filter.enRetard && tache.enRetard !== 1) return false;
        if (filter.important && !tache.important) return false;
        if (filter.urgent && !tache.urgent) return false;

        return true;
      })
    );
  }, [tachesPro, filter]);

  // Gestion du message de succès
  const { successMessage, setSuccessMessage } = useSuccessMessage();
  const [toastSuccessOpen, setToastSuccessOpen] = useState(true);

  useEffect(() => {
    if (successMessage) {
      setTimeout(() => setSuccessMessage(""), 3000); // Effacer le message après 3 secondes
    }
  }, [successMessage]);

  const currentTime = new Date().getTime() / 1000;
  const conditionAffAlert =
    projet.deadline && new Date(projet.deadline).getTime() / 1000 < currentTime;

  const methods = useForm({
    defaultValues: {
      idProjet: projet.id, // Valeur par défaut pour idProjet
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = methods;

  useEffect(() => {
    if (projet) {
      methods.setValue("idProjet", projet.id);
    }
  }, [projet]);

  //apprel de ma fonction post
  const {
    response: postResponse,
    error: postError,
    loading: postLoading,
    postData,
  } = usePostData(`observations`);

  const onSubmit = async (data) => {
    console.log("Observation soumise :", data);

    try {
      await postData(data); // Enregistrer l'observation

      // Mettre à jour l'état après l'ajout
      setObservationPro([...observationsPro, data]);

      // Rafraîchir les données
      await fetchData();
      await observationsFetch();

      // Fermer le modal et réinitialiser le formulaire
      setFeedbackModalOpen(false);
      reset();
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'observation :", error);
    }
  };

  const [sliceListe, setSliceListe] = useState(true);

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="relative flex flex-col flex-1 overflow-x-hidden overflow-y-auto">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="relative grow">
          {loading || loadingObs ? (
            <div className="absolute z-40 flex items-center justify-center w-full h-full bg-white dark:bg-gray-900">
              <SpinnerLoading />
            </div>
          ) : (
            <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
              <div className="flex flex-col mx-auto max-w-7xl lg:flex-row lg:space-x-4 xl:space-x-8">
                <div className="relative lg:w-4/5 xl:w-3/4">
                  {/* success message  */}
                  {successMessage && (
                    <div className="absolute left-0 -top-20 z-60 ">
                      <Toast
                        type="success"
                        open={toastSuccessOpen}
                        setOpen={setToastSuccessOpen}
                      >
                        {successMessage}
                      </Toast>
                    </div>
                  )}
                  <div className="flex items-center justify-between mb-6">
                    <Link
                      className="px-3 text-gray-800 bg-white border-gray-200 btn-sm dark:bg-gray-800 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 dark:text-gray-300"
                      onClick={() => navigate(-1)}
                    >
                      <svg
                        className="mr-2 text-gray-400 fill-current dark:text-gray-500"
                        width="7"
                        height="12"
                        viewBox="0 0 7 12"
                      >
                        <path d="M5.4.6 6.8 2l-4 4 4 4-1.4 1.4L0 6z" />
                      </svg>
                      <span>Retour</span>
                    </Link>
                    <Link
                      className="text-gray-800 bg-white border-gray-200 btn-sm dark:bg-gray-800 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 dark:text-gray-300"
                      to={`/modification/projets/${projet.id}`}
                    >
                      Modifier
                    </Link>
                  </div>
                  <div className="mb-2 text-sm italic text-gray-500 dark:text-gray-400">
                    Ajouter le <DateRefactor date={projet.dateInscription} />
                  </div>
                  <header className="mb-4">
                    <h1 className="text-xl font-bold text-gray-800 md:text-3xl dark:text-gray-100">
                      <LibelleFormat libelle={projet.libelle} />
                    </h1>
                    {projet.libelle}
                  </header>

                  <div className="mb-6">
                    <div className="flex flex-wrap items-center -m-1">
                      <StatusBadge status={projet.status} />
                      {projet.newProjet === 1 && <NewBadge />}
                      {conditionAffAlert && <AlertBadge />}
                      <a
                        className={`${
                          viewtask ? "" : ""
                        } text-gray-500 cursor-pointer ml-2 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 whitespace-nowrap font-bold flex items-center`}
                        onClick={() => {
                          setViewTask(!viewtask);
                        }}
                      >
                        <svg
                          className="mr-3 text-gray-400 fill-current shrink-0 dark:text-gray-500"
                          width="16"
                          height="16"
                          viewBox=" 0 0 16 16"
                        >
                          <path d="M5 9a1 1 0 1 1 0-2h6a1 1 0 0 1 0 2H5ZM1 4a1 1 0 1 1 0-2h14a1 1 0 0 1 0 2H1Zm0 10a1 1 0 0 1 0-2h14a1 1 0 0 1 0 2H1Z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                  {!viewtask && (
                    <hr className="my-6 border-t border-gray-100 dark:border-gray-700/60" />
                  )}
                  {viewtask ? (
                    <>
                      <div className="">
                        {/* Filters */}
                        <div className="my-8">
                          <FilterTasksProjet
                            setFilter={setFilter}
                            filter={filter}
                            setKeyword={setKeyword}
                          />
                        </div>

                        {/* Posts */}
                        <div>
                          {/* Post */}
                          {loadingTachesPro && (
                            <div className="text-center">
                              <SpinnerLoading />
                            </div>
                          )}
                          {tachesProjets && tachesProjets.length > 0 ? (
                            tachesProjets
                              .slice(0, sliceListe ? 10 : tachesProjets.length)
                              .map((task) => <TaskProjetItems tache={task} />)
                          ) : (
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Aucune tâche disponible pour ce projet...
                            </p>
                          )}
                        </div>
                        {/* Pagination */}
                        <div className="mt-6">
                          {tachesProjets.length > 10 && (
                            <div className="flex justify-end">
                              <a
                                className="text-gray-800 bg-white border-gray-200 cursor-pointer btn dark:bg-gray-800 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 dark:text-gray-300"
                                onClick={() => {
                                  // console.log("SLICE :" + sliceListe);
                                  setSliceListe(!sliceListe);
                                }}
                              >
                                {sliceListe
                                  ? "Etendre la liste"
                                  : "Voir les plus recents"}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <h1 className="text-lg font-bold text-gray-800 md:text-xl dark:text-gray-100">
                          {projet.description && projet.description.length > 60
                            ? `${projet.description.slice(0, 60)}...`
                            : projet.description}
                        </h1>
                        <div className="space-y-6">
                          {projet.description ? (
                            <p>{projet.description}</p>
                          ) : (
                            "Aucune description faite"
                          )}
                        </div>
                      </div>
                      <hr className="my-6 border-t border-gray-100 dark:border-gray-700/60" />

                      {/* Observation */}
                      {/* Reviews */}
                      <div className="relative ">
                        <div className="flex items-center justify-between w-full gap-2">
                          <h2 className="text-lg font-bold leading-snug text-gray-800 dark:text-gray-100">
                            Observations
                          </h2>
                          <button
                            className="text-xs text-gray-100 bg-gray-900 btn hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
                            aria-controls="feedback-modal"
                            onClick={(e) => {
                              e.stopPropagation();
                              setFeedbackModalOpen(true);
                            }}
                          >
                            Ajouter
                          </button>
                          {/* formulaire d'add observations */}
                          <ModalBasic
                            id="feedback-modal"
                            modalOpen={feedbackModalOpen}
                            setModalOpen={setFeedbackModalOpen}
                            title="Ajout d'une observation"
                          >
                            <form onSubmit={handleSubmit(onSubmit)}>
                              {/* Champ caché pour idProjet */}
                              <input type="hidden" {...register("idProjet")} />
                              <div className="px-5 py-4">
                                <div className="text-sm">
                                  <div className="mb-3 font-medium text-gray-800 dark:text-gray-100">
                                    Ajouter une observation sur{" "}
                                    <span className="underline">
                                      {projet.libelle}
                                    </span>{" "}
                                    🙌
                                  </div>
                                </div>
                                <div className="space-y-3">
                                  <div>
                                    <label
                                      className="block mb-1 text-sm font-medium"
                                      htmlFor="feedback"
                                    >
                                      Libellé{" "}
                                      <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                      id="feedback"
                                      className="w-full px-2 py-1 form-textarea"
                                      rows="4"
                                      {...register("libelle", {
                                        required: "Le libellé est requis",
                                        maxLength: {
                                          value: 255,
                                          message:
                                            "Nombre de caractere trop grand😒!",
                                        },
                                      })}
                                    ></textarea>
                                    {errors.libelle && (
                                      <span className="text-xs text-red-500">
                                        {errors.libelle.message}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="px-5 py-4 border-t border-gray-200 dark:border-gray-700/60">
                                <div className="flex flex-wrap justify-end space-x-2">
                                  <button
                                    type="button"
                                    className="text-gray-800 border-gray-200 btn-sm dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 dark:text-gray-300"
                                    onClick={() => {
                                      setFeedbackModalOpen(false);
                                      reset(); // Réinitialise le formulaire si l'utilisateur annule
                                    }}
                                  >
                                    Annuler
                                  </button>
                                  <button
                                    type="submit"
                                    className="text-gray-100 bg-gray-900 btn-sm hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
                                  >
                                    {postLoading ? (
                                      <>
                                        <SpinnerLoading />
                                      </>
                                    ) : (
                                      "Valider"
                                    )}
                                  </button>
                                </div>
                              </div>
                            </form>
                          </ModalBasic>
                        </div>

                        <ul className="inline-block my-6 space-y-5">
                          {/* Affichage du chargement */}
                          {loadingObs ? (
                            <SpinnerLoading />
                          ) : (
                            <>
                              {/* Affichage des observations */}
                              {Array.isArray(observationsPro) &&
                              observationsPro.length > 0 ? (
                                observationsPro.map((observation) => (
                                  <ObservationItem
                                    key={observation.id}
                                    observation={observation}
                                    refreshList={observationsFetch}
                                  />
                                ))
                              ) : (
                                <NoObservation />
                              )}
                            </>
                          )}
                        </ul>
                      </div>
                    </>
                  )}

                  {/* sidebar bottom */}
                  <div className="block p-5 my-5 bg-white shadow-sm dark:bg-gray-800 rounded-xl lg:hidden">
                    <ul className="mb-4 space-y-2 sm:flex justify-evenly sm:space-y-0 sm:space-x-2 lg:space-y-2 lg:space-x-0 lg:flex-col">
                      <li>
                        <button className="w-full h-full px-4 py-3 text-left transition bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600">
                          <div className="flex flex-wrap items-center justify-between mb-0.5">
                            <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                              Date prise de decision
                            </span>
                          </div>
                          <div className="text-sm">
                            {projet.datePriseDecision ? (
                              <DateRefactor date={projet.datePriseDecision} />
                            ) : (
                              "Aucune date inscrite"
                            )}
                          </div>
                        </button>
                      </li>
                      <li>
                        <button className="w-full h-full px-4 py-3 text-left transition bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600">
                          <div className="flex flex-wrap items-center justify-between mb-0.5">
                            <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                              Date debut
                            </span>
                          </div>
                          <div className="text-sm">
                            {projet.dateDebut ? (
                              <DateRefactor date={projet.dateDebut} />
                            ) : (
                              "Aucune date inscrite"
                            )}
                          </div>
                        </button>
                      </li>
                      <li>
                        <button className="w-full h-full px-4 py-3 text-left transition bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600">
                          <div className="flex flex-wrap items-center justify-between mb-0.5">
                            <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                              Date fin
                            </span>
                          </div>
                          <div className="text-sm">
                            {projet.dateFin ? (
                              <DateRefactor date={projet.dateFin} />
                            ) : (
                              "Aucune date inscrite"
                            )}
                          </div>
                        </button>
                      </li>
                      <li>
                        <button className="w-full h-full px-4 py-3 text-left transition bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600">
                          <div className="flex flex-wrap items-center justify-between mb-0.5">
                            <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                              Deadline projet
                            </span>
                          </div>
                          <div className="text-sm">
                            {projet.deadline ? (
                              <DateRefactor date={projet.deadline} />
                            ) : (
                              "Aucune date inscrite"
                            )}
                          </div>
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* sidebar right */}
                <div>
                  <div className="hidden p-5 bg-white shadow-sm dark:bg-gray-800 rounded-xl lg:block">
                    <ul className="mb-4 space-y-2 sm:flex sm:space-y-0 sm:space-x-2 lg:space-y-2 lg:space-x-0 lg:flex-col">
                      <li>
                        <button className="w-full h-full px-4 py-3 text-left transition bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600">
                          <div className="flex flex-wrap items-center justify-between mb-0.5">
                            <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                              Date prise de decision
                            </span>
                          </div>
                          <div className="text-sm">
                            {projet.datePriseDecision ? (
                              <DateRefactor date={projet.datePriseDecision} />
                            ) : (
                              "Aucune date inscrite"
                            )}
                          </div>
                        </button>
                      </li>
                      <li>
                        <button className="w-full h-full px-4 py-3 text-left transition bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600">
                          <div className="flex flex-wrap items-center justify-between mb-0.5">
                            <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                              Date debut
                            </span>
                          </div>
                          <div className="text-sm">
                            {projet.dateDebut ? (
                              <DateRefactor date={projet.dateDebut} />
                            ) : (
                              "Aucune date inscrite"
                            )}
                          </div>
                        </button>
                      </li>
                      <li>
                        <button className="w-full h-full px-4 py-3 text-left transition bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600">
                          <div className="flex flex-wrap items-center justify-between mb-0.5">
                            <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                              Date fin
                            </span>
                          </div>
                          <div className="text-sm">
                            {projet.dateFin ? (
                              <DateRefactor date={projet.dateFin} />
                            ) : (
                              "Aucune date inscrite"
                            )}
                          </div>
                        </button>
                      </li>
                      <li>
                        <button className="w-full h-full px-4 py-3 text-left transition bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600">
                          <div className="flex flex-wrap items-center justify-between mb-0.5">
                            <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                              Deadline projet
                            </span>
                          </div>
                          <div className="text-sm">
                            {projet.deadline ? (
                              <DateRefactor date={projet.deadline} />
                            ) : (
                              "Aucune date inscrite"
                            )}
                          </div>
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default JobPost;

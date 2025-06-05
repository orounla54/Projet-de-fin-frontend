import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

import Sidebar from "../../partials/Sidebar";
import Header from "../../partials/Header";

import {
  useDeleteData,
  useGetData,
  usePutData,
} from "../../utils/Requests/RequestService";
import LibelleFormat from "../../components/LibelleFormat";
import DateRefactor from "../../components/DateRefactor";
import Avatar from "react-avatar";
import NewBadge from "../../components/NewBadge";
import AlertBadge from "../../components/AlertBadge";
import SpinnerLoading from "../../components/SpinnerLoading";
import { useSuccessMessage } from "../../utils/SuccessContext";
import Toast from "../../components/Toast";
import ModalBasic from "../../components/ModalBasic";
import { useForm } from "react-hook-form";
import AuthService from "../../utils/Auth/AuthServices";
import axios from "axios";
import { baseURL } from "../../utils/DataFront/eventTypes";
import DashboardCard11 from "../../partials/dashboard/DashboardCard11";
import DangerModal from "../../components/DangerModal";
import PaginationNumeric from "../../components/PaginationNumeric";
import AddRespForTache from "../../components/formulaires/AddRespForTache";
import ResponsableTacheItem from "../../components/formulaires/ResponsableTacheItem";
import DiscussionsTache from "../../components/DiscussionsTache";
function MeetupsPost() {
  const baseUrl = baseURL;

  const navigate = useNavigate();

  const { id } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [feedbackModalOpen1, setFeedbackModalOpen1] = useState(false);
  const [feedbackModalOpen2, setFeedbackModalOpen2] = useState(false);

  const [tache, setTache] = useState({});
  const [sousTaches, setSousTaches] = useState([]);
  const [responsables, setResponsables] = useState([]);
  const [respFormSousT, setRespForlSousT] = useState([]);
  const [documentsTache, setDocumentsTache] = useState([]);
  const [imgsTache, setImgsTache] = useState([]);

  const [privates, setPrivate] = useState(null);
  const [urgent, setUrgent] = useState(null);
  const [important, setImportant] = useState(null);
  const [status, setStatus] = useState(null);

  // État pour suivre le survol de chaque image individuellement
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const [errorSaveFiles, setErrorSaveFiles] = useState("");
  const [loadingSaveFiles, setLoadingaveFiles] = useState(false);

  const [loadingAddSousTache, setLoadingAddSousTache] = useState(false);
  const [errorAddSousTache, setErrorAddSousTache] = useState(null);
  const [roleResponPrin, setRoleResponPrin] = useState(null);

  const [view, setView] = useState("tacheInfos");

  // condition mise à jour
  const currentTime = new Date().getTime() / 1000;
  const conditionAffAlert =
    new Date(tache.deadline).getTime() / 1000 < currentTime &&
    tache.idStatusTache !== 3;

  // Récupère les données via le hook personnalisé
  const {
    data,
    loading,
    error,
    fetchData: fetchTache,
  } = useGetData(id ? `taches/${id}` : "");

  // Récupère les données via le hook personnalisé (docs)
  const {
    data: docsTache,
    loading: docsTacheLoading,
    error: docsTacheError,
    fetchData,
  } = useGetData(id ? `documentsTache/${id}` : "");

  useEffect(() => {
    if (docsTache) {
      setDocumentsTache(docsTache.documents);
    }
    // console.log(documentsTache);
  }, [docsTache]);

  // Récupère les données via le hook personnalisé (docs) sous-taches
  const {
    data: sousTache,
    loading: sousTacheLoading,
    error: sousTacheError,
    fetchData: sousTachesFetch,
  } = useGetData(id ? `tache/${id}/sousTaches` : "");

  useEffect(() => {
    if (sousTache) {
      setSousTaches(sousTache);
    }
    // console.log(sousTaches);
  }, [sousTache]);

  //roles get for formulaire
  const [roles, setRoles] = useState([]);
  const {
    data: rolesData,
    loading: loadingRoles,
    error: errorRoles,
  } = useGetData(`/roles`);

  useEffect(() => {
    if (rolesData && Array.isArray(rolesData)) {
      // Filtrage des rôles
      const filteredRoles = rolesData.filter((role) => {
        return (
          role.libelle !== "Responsable" && role.libelle !== "Roles pas définie"
        ); // Utiliser Number si nécessaire
      });
      // Trouver le rôle "Responsable"
      const roleResponPrin = rolesData.find(
        (role) => role.libelle === "Responsable"
      );
      setRoles(filteredRoles); // Mise à jour de l'état des rôles
      setRoleResponPrin(roleResponPrin);
      // console.log(roleResponPrin);
    }
  }, [rolesData, tache.Responsable_Prin]);

  //appel de la methode update
  const {
    response: responseUpdate,
    error: errorUpdate,
    loading: loadingUpdate,
    putData,
  } = usePutData(`taches/${id}`);

  const {
    response: responseDeleteDocs,
    error: errorDeleteDocs,
    loading: loadingDeleteDocs,
    deleteData,
  } = useDeleteData(`documentsTache`);

  const handleDeleteDocs = async (id) => {
    await deleteData(id);
    setSuccessMessage("Fichier supprimer avec succes");
    fetchData();
    // console.log("tache" + id + "supprimer");
  };

  //get imgs tache
  const {
    data: imagesTache,
    loading: imagesTacheLoading,
    error: imagesTacheError,
    fetchData: fetchDataIMG,
  } = useGetData(id ? `ImgsTache/${id}` : "");

  useEffect(() => {
    if (imagesTache) {
      setImgsTache(imagesTache.documents);
    }
    console.log(imgsTache);
  }, [imagesTache]);

  // Met à jour l'état du tache quand `data` change
  useEffect(() => {
    if (data && data !== tache) {
      setTache(data);
    }
    console.log(tache);
  }, [data]);

  // Met à jour l'état des options taches
  useEffect(() => {
    if (tache) {
      try {
        setStatus(tache.status);
        setImportant(tache.important);
        setUrgent(tache.urgent);
        setPrivate(tache.private);
        // console.log("ok pour les recuperation");
      } catch (error) {
        console.log("erreur lors de la récupération des données");
      }
    }
  }, [tache]);

  //fonction update dynamique
  const handleUpdateState = async (contexte) => {
    if (contexte === "important") {
      setImportant(!important);
      await putData({ important: !important });
    } else if (contexte === "urgent") {
      setUrgent(!urgent);
      await putData({ urgent: !urgent });
    } else if (contexte === "private") {
      setPrivate(!privates);
      await putData({ private: !privates });
    } else if (contexte === "UpdateState") {
      if (status === "Non-démaré") {
        setStatus("En-cours");
        await putData({ idStatusTache: 2 });
      } else if (status === "En-cours") {
        setStatus("Terminé");
        await putData({ idStatusTache: 3 });
      } else if (status === "Terminé") {
        setStatus("Non-démaré");
        await putData({ idStatusTache: 1 });
      }
    } else {
      navigate(`/modification/taches/${tache.id}`);
    }
  };

  //responsable get
  useEffect(() => {
    if (tache.Responsables) {
      try {
        // Convertir en tableau d'objets
        // const responsablesParsed = JSON.parse(tache.Responsables);

        // Vérifier que le parsing a réussi
        // console.log("Liste des responsables:", responsablesParsed);

        // Mettre à jour l'état des responsables
        setResponsables(tache.Responsables);
      } catch (error) {
        console.error("Erreur lors du parsing de tache.Responsables:", error);
      }
    } else {
      // console.log("Aucun responsable trouvé pour cette tâche.");
    }
    // console.log(responsables);
  }, [tache.Responsables]);

  useEffect(() => {
    if (responsables) {
      setRespForlSousT(responsables);
      //#####au cas ou
      // setRespForlSousT(responsables.filter(
      //   (resp) => resp.id !== tache.Responsable_Prin
      // ))
    }
  }, [responsables]);

  // Gestion du message de succès
  const { successMessage, setSuccessMessage } = useSuccessMessage();
  const [toastSuccessOpen, setToastSuccessOpen] = useState(true);

  useEffect(() => {
    if (successMessage) {
      setTimeout(() => setSuccessMessage(""), 3000); // Effacer le message après 3 secondes
    }
  }, [successMessage]);

  //add docs for taches
  const methods = useForm({
    defaultValues: {
      fichiers: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = methods;

  const onSubmit = async (data) => {
    setLoadingaveFiles(true);
    setErrorSaveFiles("");
    // console.log(data);

    const formData = new FormData();
    Array.from(data.fichiers).forEach((file) => {
      formData.append("fichiers", file);
    });

    try {
      const accessToken = AuthService.getAccessToken();
      const response = await axios.post(
        `${baseUrl}/newDocsTaches/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setFeedbackModalOpen(false);
      await fetchData();
      reset();
    } catch (error) {
      const errorMessage =
        error.response && error.response.data
          ? error.response.data.message // Message d'erreur spécifique renvoyé par le serveur
          : "Erreur inattendue lors de l'ajout de fichier veillez reesayez. ";

      setErrorSaveFiles(errorMessage);
      console.log(error);
    } finally {
      setLoadingaveFiles(false);
    }
  };

  //add sous taches for tache
  const methodsSousTache = useForm({
    defaultValues: {
      libelle: "",
      status: "",
      idContributeur: "",
      idRole: "",
    },
  });

  const { handleSubmit: submitSousTache, reset: resetSousTache } =
    methodsSousTache;

  const clearForm = () => {
    setErrorAddSousTache(null);
    resetSousTache(); // Réinitialisation des valeurs
  };

  const onSubmitSousTache = async (data) => {
    setLoadingAddSousTache(false); // Active le chargement

    const dataVerif =
      parseInt(data.idContributeur) === parseInt(tache.Responsable_Prin) &&
      parseInt(data.idRole) !== parseInt(roleResponPrin.id);

    const dataVerifCB =
      parseInt(data.idContributeur) !== parseInt(tache.Responsable_Prin) &&
      parseInt(data.idRole) === parseInt(roleResponPrin.id);

    // Vérifier si le contributeur est le Responsable Principal mais le rôle ne correspond pas
    if (dataVerif || dataVerifCB) {
      setErrorAddSousTache("Erreur sur le choix du role!");
    } else {
      const dataObject = {
        ...data,
        idContributeur: data.idContributeur,
        idRole:
          data.idContributeur === tache.Responsable_Prin ? null : data.idRole,
        status: "Non-démaré",
        idTache: tache.id,
      };

      // console.log(dataObject);

      try {
        const accessToken = AuthService.getAccessToken();
        const response = await axios.post(`${baseUrl}/sousTaches`, dataObject, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });
        resetSousTache(); // Réinitialise le formulaire
        setFeedbackModalOpen2(false); // Ferme le modal après succès
        await fetchTache();
        await sousTachesFetch();
        setErrorAddSousTache("");
      } catch (error) {
        // Gère les erreurs et affiche le message approprié
        const errorMessage =
          error.response && error.response.data
            ? error.response.data.message // Message d'erreur spécifique renvoyé par le serveur
            : "Erreur inattendue lors de l'ajout. ";
        setErrorAddSousTache(errorMessage);
      } finally {
        setLoadingAddSousTache(false); // Désactive le chargement
      }
    }
  };

  //toggle imgs or docs
  const [toggleIMG, setToggleIMG] = useState(false);

  //add imaages for taches
  const methodsIMG = useForm({
    defaultValues: {
      fichiers: "",
    },
  });

  const {
    register: registerIMG,
    handleSubmit: handleSubmitIMG,
    formState: { errors: errorsIMG },
    reset: resetIMG,
  } = methodsIMG;

  const onSubmitIMG = async (data) => {
    setLoadingaveFiles(true);
    setErrorSaveFiles("");

    const formData = new FormData();
    Array.from(data.fichiers).forEach((file) => {
      formData.append("fichiers", file);
    });

    try {
      const accessToken = AuthService.getAccessToken();
      const response = await axios.post(
        `${baseUrl}/newImgsTaches/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setFeedbackModalOpen(false);
      await fetchData();
      await fetchTache();
      await fetchDataIMG();
      resetIMG();
    } catch (error) {
      const errorMessage =
        error.response && error.response.data
          ? error.response.data.message // Message d'erreur spécifique renvoyé par le serveur
          : "Erreur inattendue lors de l'ajout de fichier veillez reesayez. ";

      setErrorSaveFiles(errorMessage);
      console.log(error);
    } finally {
      setLoadingaveFiles(false);
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  const indexOfLastSousTache = currentPage * itemsPerPage;
  const indexOfFirstSousTache = indexOfLastSousTache - itemsPerPage;
  const currentSousTache = sousTaches.length > 0 && sousTaches.slice(
    indexOfFirstSousTache,
    indexOfLastSousTache
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const switchAffichage = () => {
    if (view === "tacheInfos") {
      setView("discussions");
    } else if (view === "discussions") {
      setView("tacheInfos");
    } else {
    }
  };

  const [responsableLog, setResponsableLog] = useState();
  //get responsable log
  const {
    data: responsableLogData,
    error: responsableError,
    loading: responsableLoading,
  } = useGetData("responsables/log");

  useEffect(() => {
    if (responsableLogData) {
      setResponsableLog(responsableLogData);
    }
    // console.log(responsableLog);
  }, [responsableLogData]);

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-x-hidden overflow-y-auto">
        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="relative grow">
          {loading ||
          docsTacheLoading ||
          sousTacheLoading ||
          loadingRoles ||
          imagesTacheLoading ||
          responsableLoading ? (
            <div className="absolute z-40 flex items-center justify-center w-full h-full bg-white dark:bg-gray-900">
              <SpinnerLoading />
            </div>
          ) : (
            <>
              {" "}
              <div className="w-full px-4 py-8 sm:px-6 lg:px-6">
                {/* Page content */}
                <div className="flex items-center justify-center ">
                  {loading && <SpinnerLoading />}
                </div>
                <div className="flex flex-col mx-auto max-w-7xl lg:flex-row lg:justify-between lg:space-x-8 xl:space-x-8">
                  {/* Content */}
                  <div className="relative lg:w-4/5">
                    {successMessage && (
                      <div className="absolute left-0 -top-10 z-60 ">
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

                      {/* formulaire d'ajoute de fichier et imgà la taches */}
                      <div className="m-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setFeedbackModalOpen(true);
                          }}
                          className="text-gray-100 bg-gray-900 btn-sm hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="size-4"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.5 17a4.5 4.5 0 0 1-1.44-8.765 4.5 4.5 0 0 1 8.302-3.046 3.5 3.5 0 0 1 4.504 4.272A4 4 0 0 1 15 17H5.5Zm5.25-9.25a.75.75 0 0 0-1.5 0v4.59l-1.95-2.1a.75.75 0 1 0-1.1 1.02l3.25 3.5a.75.75 0 0 0 1.1 0l3.25-3.5a.75.75 0 1 0-1.1-1.02l-1.95 2.1V7.75Z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                        {/* Start */}
                        <ModalBasic
                          id="feedback-modal"
                          modalOpen={feedbackModalOpen}
                          setModalOpen={setFeedbackModalOpen}
                          title="Télécharger un ou plusieurs fichiers"
                        >
                          {loadingSaveFiles && <SpinnerLoading />}
                          <div className="flex items-center justify-end m-2">
                            <button
                              onClick={() => {
                                setToggleIMG(!toggleIMG);
                              }}
                              className={`text-xs mt-3 font-bold text-white bg-violet-500 hover:bg-violet-400 
                                        hover:w-24 w-20 text-center transition-all duration-300 
                                        ease-in-out rounded-xl p-1`}
                            >
                              {toggleIMG ? "Fichiers" : "Images"}
                            </button>
                          </div>
                          {toggleIMG ? (
                            <>
                              <form
                                onSubmit={handleSubmitIMG(onSubmitIMG)}
                                className="px-5 py-2 space-y-4"
                              >
                                {errorSaveFiles && (
                                  <p className="text-xs text-center text-red-500">
                                    {errorSaveFiles}
                                  </p>
                                )}
                                <div className="flex justify-center px-6 py-10 mt-2 border border-dashed rounded-lg border-violet-500">
                                  <div className="text-center">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 24 24"
                                      fill="currentColor"
                                      className="mx-auto text-gray-300 size-12"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z"
                                        clipRule="evenodd"
                                      />
                                    </svg>

                                    <div className="flex mt-4 text-xs text-gray-600">
                                      <label
                                        htmlFor="file-upload" // L'élément <label> cible le <input> via son id
                                        className="relative font-semibold cursor-pointer text-violet-400 hover:text-violet-600"
                                      >
                                        <span>Charger des images</span>{" "}
                                        {/* Clique sur ce texte pour ouvrir la fenêtre de fichiers */}
                                        {/* L'élément input est caché avec la classe 'sr-only' mais il est toujours interactif */}
                                        <input
                                          id="file-upload"
                                          name="file-upload"
                                          type="file"
                                          className="sr-only" // Cache l'input
                                          {...registerIMG("fichiers", {
                                            required: "Un fichier est requis",
                                            validate: {
                                              fileCount: (files) =>
                                                files.length <= 10 ||
                                                "Vous ne pouvez télécharger que jusqu'à 10 fichiers",
                                              fileSize: (files) =>
                                                Array.from(files).every(
                                                  (file) =>
                                                    file.size <= 5 * 1024 * 1024
                                                ) ||
                                                "Chaque fichier doit être de 5 Mo maximum",
                                              fileType: (files) =>
                                                Array.from(files).every(
                                                  (file) =>
                                                    [
                                                      "image/jpeg",
                                                      "image/jpg",
                                                      "image/png",
                                                    ].includes(file.type)
                                                ) ||
                                                "Seuls les fichiers JPEG, JPG ou PNG sont autorisés",
                                            },
                                          })}
                                          multiple
                                          accept="image/jpeg, image/jpg, image/png"
                                        />
                                      </label>
                                      <p className="pl-1">
                                        Chaque images ne doit pas dépasser les
                                        5Mo
                                      </p>
                                    </div>
                                    <p className="text-gray-600 text-xs/5">
                                      PNG, JPG, Autres
                                    </p>
                                  </div>
                                </div>

                                <div>
                                  {methodsIMG.formState.errors.fichiers && (
                                    <p className="text-sm text-red-500">
                                      {
                                        methodsIMG.formState.errors.fichiers
                                          .message
                                      }
                                    </p>
                                  )}
                                </div>

                                <div className="flex justify-end pt-4 space-x-2 border-t border-gray-200 dark:border-gray-700/60">
                                  <button
                                    type="button"
                                    className="text-gray-800 border-gray-200 btn-sm dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 dark:text-gray-300"
                                    onClick={() => setFeedbackModalOpen(false)}
                                  >
                                    Annuler
                                  </button>
                                  <button
                                    type="submit"
                                    className="text-gray-100 bg-gray-900 btn-sm hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
                                  >
                                    {loadingSaveFiles ? (
                                      <>
                                        <SpinnerLoading />
                                      </>
                                    ) : (
                                      "Valider"
                                    )}
                                  </button>
                                </div>
                              </form>
                            </>
                          ) : (
                            <>
                              <form
                                onSubmit={handleSubmit(onSubmit)}
                                className="px-5 py-2 space-y-4"
                              >
                                {errorSaveFiles && (
                                  <p className="text-xs text-center text-red-500">
                                    {errorSaveFiles}
                                  </p>
                                )}

                                <div className="flex justify-center px-6 py-10 mt-2 border border-dashed rounded-lg border-violet-500">
                                  <div className="text-center">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 24 24"
                                      fill="currentColor"
                                      className="mx-auto text-gray-300 size-12"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M19.5 21a3 3 0 0 0 3-3V9a3 3 0 0 0-3-3h-5.379a.75.75 0 0 1-.53-.22L11.47 3.66A2.25 2.25 0 0 0 9.879 3H4.5a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h15Zm-6.75-10.5a.75.75 0 0 0-1.5 0v4.19l-1.72-1.72a.75.75 0 0 0-1.06 1.06l3 3a.75.75 0 0 0 1.06 0l3-3a.75.75 0 1 0-1.06-1.06l-1.72 1.72V10.5Z"
                                        clipRule="evenodd"
                                      />
                                    </svg>

                                    <div className="flex mt-4 text-xs text-gray-600">
                                      <label
                                        htmlFor="fichiers" // Associe le clic sur le texte avec l'élément <input>
                                        className="relative font-semibold cursor-pointer text-violet-400 hover:text-violet-600"
                                      >
                                        <span>Charger des fichiers</span>
                                        <input
                                          {...register("fichiers", {
                                            required: "Un fichier est requis",
                                            validate: {
                                              fileCount: (files) =>
                                                files.length <= 10 ||
                                                "Vous ne pouvez télécharger que jusqu'à 10 fichiers",
                                              fileSize: (files) =>
                                                Array.from(files).every(
                                                  (file) =>
                                                    file.size <= 5 * 1024 * 1024
                                                ) ||
                                                "Chaque fichier doit être de 5 Mo maximum", // Limite de 5 Mo
                                            },
                                          })}
                                          id="fichiers"
                                          type="file"
                                          name="fichiers"
                                          multiple
                                          className="sr-only" // Cache le champ de fichier
                                        />
                                      </label>
                                      <p className="pl-1">
                                        Chaque fichier ne doit pas dépasser les
                                        5 Mo
                                      </p>
                                    </div>
                                    <p className="text-gray-600 text-xs/5">
                                      Tout types de fichiers de bureau
                                    </p>
                                  </div>

                                  {methods.formState.errors.fichiers && (
                                    <p className="text-sm text-red-500">
                                      {
                                        methods.formState.errors.fichiers
                                          .message
                                      }
                                    </p>
                                  )}
                                </div>

                                <div className="flex justify-end pt-4 space-x-2 border-t border-gray-200 dark:border-gray-700/60">
                                  <button
                                    type="button"
                                    className="text-gray-800 border-gray-200 btn-sm dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 dark:text-gray-300"
                                    onClick={() => setFeedbackModalOpen(false)}
                                  >
                                    Annuler
                                  </button>
                                  <button
                                    type="submit"
                                    className="text-gray-100 bg-gray-900 btn-sm hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
                                  >
                                    {loadingSaveFiles ? (
                                      <>
                                        <SpinnerLoading />
                                        Chargement...
                                      </>
                                    ) : (
                                      "Valider"
                                    )}
                                  </button>
                                </div>
                              </form>
                            </>
                          )}
                        </ModalBasic>
                        {/* End */}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="mb-2 text-sm font-semibold text-violet-500">
                        Ajouter le -&gt;{" "}
                        <DateRefactor date={tache.dateInscription} />
                      </div>
                      <div className="m-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setFeedbackModalOpen1(true);
                          }}
                          className="text-gray-100 bg-gray-900 btn-sm hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="size-4"
                          >
                            <path
                              fillRule="evenodd"
                              d="M9 1.5H5.625c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5Zm6.61 10.936a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 14.47a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                              clipRule="evenodd"
                            />
                            <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
                          </svg>
                        </button>
                        {/* Start */}
                        <ModalBasic
                          id="feedback-modal"
                          modalOpen={feedbackModalOpen1}
                          setModalOpen={setFeedbackModalOpen1}
                          title={
                            <p className="p-1 px-2 text-xs">
                              📄 Fichier telecharger pour la tache{" "}
                              <span className="underline">
                                {tache.libelle && tache.libelle.length > 35
                                  ? `${tache.libelle.slice(0, 35)}...`
                                  : tache.libelle}
                              </span>
                            </p>
                          }
                        >
                          {docsTacheLoading && <SpinnerLoading />}
                          {/* List */}
                          <ul className="m-4 mx-6">
                            {/* List item */}
                            {documentsTache && documentsTache.length === 0 ? (
                              <li className="relative py-2 text-xs text-center">
                                Aucun documents charger...
                              </li>
                            ) : (
                              documentsTache.map((docs) => (
                                <li className="relative py-2" key={docs.id}>
                                  <div className="flex items-center gap-4 mb-1">
                                    {loadingDeleteDocs ? (
                                      <SpinnerLoading />
                                    ) : (
                                      <>
                                        {responsableLog?.id ===
                                          parseInt(tache.Responsable_Prin) && (
                                          <button
                                            className="absolute left-0 p-1 text-xs font-bold rounded-full top-6 bg-violet-500"
                                            aria-hidden="true"
                                            onClick={() =>
                                              handleDeleteDocs(docs.id)
                                            }
                                          >
                                            <svg
                                              width="16"
                                              height="16"
                                              viewBox="0 0 20 20"
                                              className="text-white fill-current "
                                            >
                                              <path
                                                fillRule="evenodd"
                                                d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z"
                                                clipRule="evenodd"
                                              />
                                            </svg>
                                          </button>
                                        )}
                                      </>
                                    )}

                                    <h5 className="font-bold text-gray-800 dark:text-gray-100 pl-9">
                                      {docs.libelle && docs.libelle.length > 35
                                        ? `${docs.libelle.slice(0, 35)}...`
                                        : docs.libelle}
                                    </h5>
                                  </div>
                                  <div className="pl-9">
                                    <Link
                                      to={`${docs.lien}`}
                                      className="flex flex-wrap gap-1 text-xs"
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        className="size-4 fill-violet-400"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M19.5 21a3 3 0 0 0 3-3V9a3 3 0 0 0-3-3h-5.379a.75.75 0 0 1-.53-.22L11.47 3.66A2.25 2.25 0 0 0 9.879 3H4.5a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h15Zm-6.75-10.5a.75.75 0 0 0-1.5 0v4.19l-1.72-1.72a.75.75 0 0 0-1.06 1.06l3 3a.75.75 0 0 0 1.06 0l3-3a.75.75 0 1 0-1.06-1.06l-1.72 1.72V10.5Z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                      <span className="font-bold underline">
                                        Cliquer pour telecharger{" "}
                                      </span>
                                    </Link>
                                  </div>
                                </li>
                              ))
                            )}
                          </ul>
                        </ModalBasic>
                        {/* End */}
                      </div>
                    </div>
                    <header className="relative mb-10">
                      {/* Title */}
                      <h1 className="mb-2 text-xl font-bold text-gray-800 truncate md:text-xl dark:text-gray-100">
                        <LibelleFormat lenght={200} libelle={tache.libelle} />
                      </h1>
                      <p>{tache.libelle}</p>
                    </header>

                    {view === "tacheInfos" ? (
                      <>
                        {/* Meta */}
                        <div className="mb-3 space-y-3 sm:flex sm:items-center sm:justify-between sm:space-y-0 ">
                          {/* Author */}
                          <div className="flex items-center sm:mr-4">
                            <span className="block mr-2 shrink-0">
                              <Avatar
                                name={tache.creer_par}
                                round={true}
                                size="26"
                              />
                            </span>
                            <div className="flex items-center gap-1 text-xs whitespace-nowrap">
                              Ajouter par{" "}
                              <a
                                className="font-semibold text-gray-800 dark:text-gray-100"
                                href="#0"
                              >
                                {tache.creer_par}
                              </a>
                            </div>
                          </div>
                          {imgsTache && imgsTache.length > 0 && (
                            <h2 className="mb-2 text-sm font-bold leading-snug text-gray-800 dark:text-gray-100">
                              Images{" "}
                              <span className="text-xs text-violet-400">
                                {imgsTache.length}
                              </span>
                            </h2>
                          )}
                        </div>

                        {/* Post description */}
                        {tache && tache.description ? (
                          <div>
                            <h2 className="mb-2 text-xl font-bold leading-snug text-gray-800 dark:text-gray-100">
                              <LibelleFormat
                                lenght={60}
                                libelle={tache.description}
                              />
                            </h2>
                            <div className="space-y-2 text-justify">
                              {tache.description ? (
                                tache.description
                                  .split("\n")
                                  .map((paragraph, index) => (
                                    <p key={index} className="mb-4">
                                      {paragraph.trim()}
                                    </p>
                                  ))
                              ) : (
                                <p>
                                  Aucune description faite sur cet événement...
                                </p>
                              )}
                            </div>
                          </div>
                        ) : (
                          <></>
                        )}
                        <hr className="my-6 border-t border-gray-100 dark:border-gray-700/60" />

                        {/* images */}
                        {imgsTache && imgsTache.length > 0 ? (
                          <>
                            <div>
                              <div className="grid grid-cols-3 gap-2 my-6">
                                {imgsTache.map((img, index) => (
                                  <a
                                    key={img.id}
                                    className="relative block group"
                                    onMouseEnter={() => setHoveredIndex(index)}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                  >
                                    {hoveredIndex === index &&
                                      responsableLog?.id ===
                                        parseInt(tache.Responsable_Prin, 10) && (
                                        <div className="absolute right-0 ">
                                          <DangerModal
                                            endpoint="imagesTache"
                                            refreshList={fetchDataIMG}
                                            idObjet={img.id}
                                            libelleObjet={img.libelle}
                                          />
                                        </div>
                                      )}
                                    <img
                                      className="w-full rounded-sm h-60"
                                      src={img.lien}
                                      width="203"
                                      height="152"
                                      alt={img.libelle}
                                    />
                                  </a>
                                ))}
                              </div>
                            </div>
                          </>
                        ) : (
                          <></>
                        )}

                        {/* sous tache */}
                        <article className="">
                          <div className="xl:flex">
                            <div className="pb-6 grow">
                              <header>
                                <div className="flex items-center mb-6 space-x-2 flex-nowrap">
                                  {/* Avatars */}
                                  <div>
                                    {/* Ajouter sous tache */}
                                    <div className="">
                                      {/* Start */}

                                      <ModalBasic
                                        id="feedback-modal"
                                        modalOpen={feedbackModalOpen2}
                                        setModalOpen={setFeedbackModalOpen2}
                                        title="Nouvelle sous tache"
                                      >
                                        {/* Modal content */}
                                        <form
                                          onSubmit={submitSousTache(
                                            onSubmitSousTache
                                          )}
                                        >
                                          <div className="px-5 py-4">
                                            <div className="text-sm">
                                              <div className="mb-3 font-medium text-gray-800 dark:text-gray-100">
                                                Ajout de sous tache
                                              </div>

                                              {errorAddSousTache && (
                                                <p className="text-xs text-center text-red-500">
                                                  {errorAddSousTache}
                                                </p>
                                              )}
                                            </div>

                                            <div className="space-y-3">
                                              {/* Nom de l'événement et type */}
                                              <div className="relative">
                                                <label
                                                  htmlFor="libelle"
                                                  className="block mb-1 text-sm font-medium"
                                                >
                                                  Libellé{" "}
                                                  <span className="text-red-500">
                                                    *
                                                  </span>
                                                </label>
                                                <textarea
                                                  {...methodsSousTache.register(
                                                    "libelle",
                                                    {
                                                      required:
                                                        "Ce champ est requis",
                                                      maxLength: {
                                                        value: 500,
                                                        message:
                                                          "Nombre de caractères trop grand",
                                                      },
                                                    }
                                                  )}
                                                  className={`form-input w-full ${
                                                    methodsSousTache.formState
                                                      .errors.libelle
                                                      ? "border border-red-500"
                                                      : ""
                                                  }`}
                                                  type="text"
                                                  placeholder="Libellé de la sous tache"
                                                />
                                                {methodsSousTache.formState
                                                  .errors.libelle && (
                                                  <p className="absolute left-0 text-xs text-red-500 -bottom-5">
                                                    {
                                                      methodsSousTache.formState
                                                        .errors.libelle.message
                                                    }
                                                  </p>
                                                )}
                                              </div>
                                            </div>
                                            <div className="flex gap-1 mt-6 ">
                                              <div className="relative w-1/2">
                                                <label
                                                  htmlFor="idContributeur"
                                                  className="block mb-1 text-sm font-medium"
                                                >
                                                  Attribuer à{" "}
                                                  <span className="text-red-500">
                                                    *
                                                  </span>
                                                </label>
                                                {loading && <SpinnerLoading />}
                                                <select
                                                  {...methodsSousTache.register(
                                                    "idContributeur",
                                                    {
                                                      required:
                                                        "Vous devez attribuer à quelqu'un",
                                                    }
                                                  )}
                                                  className={`form-input w-full ${
                                                    methodsSousTache.formState
                                                      .errors.idContributeur
                                                      ? "border border-red-500"
                                                      : ""
                                                  }`}
                                                >
                                                  {respFormSousT.map(
                                                    (responsable) => (
                                                      <option
                                                        key={responsable.id}
                                                        value={`${responsable.id}`}
                                                      >
                                                        {responsable.nom}{" "}
                                                        {responsable.prenom}
                                                      </option>
                                                    )
                                                  )}
                                                </select>
                                                {methodsSousTache.formState
                                                  .errors.idContributeur && (
                                                  <p className="absolute left-0 text-xs text-red-500 sm:-bottom-10 md:-bottom-5">
                                                    {
                                                      methodsSousTache.formState
                                                        .errors.idContributeur
                                                        .message
                                                    }
                                                  </p>
                                                )}
                                              </div>
                                              <div className="relative w-1/2">
                                                <label
                                                  htmlFor="idRole"
                                                  className="block mb-1 text-sm font-medium"
                                                >
                                                  Role{" "}
                                                  <span className="text-gray-500">
                                                    *
                                                  </span>
                                                </label>
                                                {loadingRoles && (
                                                  <SpinnerLoading />
                                                )}
                                                <select
                                                  {...methodsSousTache.register(
                                                    "idRole"
                                                  )}
                                                  className={`form-input w-full ${
                                                    methodsSousTache.formState
                                                      .errors.idRole
                                                      ? "border border-red-500"
                                                      : ""
                                                  }`}
                                                >
                                                  <option
                                                    value={
                                                      roleResponPrin &&
                                                      roleResponPrin.id
                                                    }
                                                  >
                                                    Responsable tache
                                                  </option>
                                                  {roles.map((role) => (
                                                    <option
                                                      key={role.id}
                                                      value={`${role.id}`}
                                                    >
                                                      {role.libelle}
                                                    </option>
                                                  ))}
                                                </select>
                                                {methodsSousTache.formState
                                                  .errors.idRole && (
                                                  <p className="absolute left-0 text-xs text-red-500 sm:-bottom-10 md:-bottom-5">
                                                    {
                                                      methodsSousTache.formState
                                                        .errors.idRole.message
                                                    }
                                                  </p>
                                                )}
                                              </div>
                                            </div>
                                          </div>

                                          {/* Footer du modal */}
                                          <div className="px-5 py-4">
                                            <div className="flex flex-wrap justify-end space-x-2">
                                              <ul className="flex items-center justify-between gap-2">
                                                <li>
                                                  <button
                                                    type="button"
                                                    className="text-red-500 bg-white border-gray-200 btn-xs dark:bg-gray-800 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600"
                                                    onClick={() => clearForm()}
                                                  >
                                                    Nettoyer
                                                  </button>
                                                </li>
                                                <li>
                                                  <button
                                                    type="submit"
                                                    className="bg-white border-gray-200 btn dark:bg-gray-800 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600"
                                                  >
                                                    {loadingAddSousTache ? (
                                                      <>
                                                        <svg
                                                          className="fill-current animate-spin shrink-0"
                                                          width="16"
                                                          height="16"
                                                          viewBox="0 0 16 16"
                                                        >
                                                          <path d="M8 16a7.928 7.928 0 01-3.428-.77l.857-1.807A6.006 6.006 0 0014 8c0-3.309-2.691-6-6-6a6.006 6.006 0 00-5.422 8.572l-1.806.859A7.929 7.929 0 010 8c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
                                                        </svg>
                                                      </>
                                                    ) : (
                                                      <svg
                                                        className="fill-current text-violet-500 shrink-0"
                                                        width="16"
                                                        height="16"
                                                        viewBox="0 0 16 16"
                                                      >
                                                        <path d="M14.3 2.3L5 11.6 1.7 8.3c-.4-.4-1-.4-1.4 0-.4.4-.4 1 0 1.4l4 4c.2.2.4.3.7.3.3 0 .5-.1.7-.3l10-10c.4-.4.4-1 0-1.4-.4-.4-1-.4-1.4 0z" />
                                                      </svg>
                                                    )}
                                                  </button>
                                                </li>
                                              </ul>
                                            </div>
                                          </div>
                                        </form>
                                      </ModalBasic>
                                      {/* End */}
                                    </div>
                                  </div>
                                </div>
                              </header>
                              {/* List */}

                              {/* Pagination */}
                              {sousTaches && sousTaches.length > 8 ? (
                                <>
                                  <div className="flex justify-start">
                                    <PaginationNumeric
                                      itemsPerPage={itemsPerPage}
                                      totalItems={sousTaches.length}
                                      paginate={paginate}
                                      currentPage={currentPage}
                                    />
                                  </div>
                                </>
                              ) : (
                                <></>
                              )}
                              {/* Card (Income/Expenses) */}
                              <div className="my-2">
                                <DashboardCard11
                                  sousTaches={currentSousTache}
                                  sousTacheLoading={sousTacheLoading}
                                  sousTacheError={sousTacheError}
                                  setFeedbackModalOpen2={setFeedbackModalOpen2}
                                  sousTachesFetch={sousTachesFetch}
                                />
                              </div>
                              {sousTaches && sousTaches.length > 8 ? (
                                <>
                                  <div className="flex justify-end">
                                    <PaginationNumeric
                                      itemsPerPage={itemsPerPage}
                                      totalItems={sousTaches.length}
                                      paginate={paginate}
                                      currentPage={currentPage}
                                    />
                                  </div>
                                </>
                              ) : (
                                <></>
                              )}
                            </div>
                          </div>
                        </article>
                      </>
                    ) : (
                      <>
                        <DiscussionsTache tache={tache} />
                      </>
                    )}
                  </div>

                  {/* Sidebar */}
                  <div className="space-y-4 ">
                    {/* 1st block */}
                    <div className="p-4 bg-white shadow-sm dark:bg-gray-800 rounded-xl xl:w-80">
                      <div className="relative flex flex-wrap items-center gap-1 justify-evenly">
                        <div className="absolute flex -top-9 -right-11">
                          {conditionAffAlert && tache.deadline ? (
                            <AlertBadge />
                          ) : (
                            ""
                          )}
                          {tache.newTaches === 1 && <NewBadge />}
                        </div>

                        {/* Statut de la tâche */}
                        <TaskStatusButton
                          status={status}
                          handleUpdateState={handleUpdateState}
                          tache={tache}
                          responsableLog={responsableLog}
                        />

                        {/* Confidentialité */}
                        {important ? (
                          <button
                            title="Important"
                            className="flex items-center justify-center text-xs"
                            onClick={() => {
                              handleUpdateState("important");
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="size-5 fill-yellow-500"
                            >
                              <path
                                fillRule="evenodd"
                                d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z"
                                clipRule="evenodd"
                              />
                            </svg>{" "}
                            Important
                          </button>
                        ) : (
                          <button
                            title="Pas important"
                            className="flex items-center justify-center text-xs"
                            onClick={() => {
                              handleUpdateState("important");
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="size-5 fill-yellow-500"
                            >
                              <path d="M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-18-18ZM20.25 5.507v11.561L5.853 2.671c.15-.043.306-.075.467-.094a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93ZM3.75 21V6.932l14.063 14.063L12 18.088l-7.165 3.583A.75.75 0 0 1 3.75 21Z" />
                            </svg>{" "}
                            Pas important
                          </button>
                        )}

                        {/* Urgence */}
                        {urgent ? (
                          <button
                            title="Urgent"
                            className="flex items-center justify-center text-xs"
                            onClick={() => {
                              handleUpdateState("urgent");
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="w-6 h-6 fill-orange-500"
                            >
                              <path
                                fillRule="evenodd"
                                d="M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18Zm1 5a1 1 0 1 0-2 0v4a1 1 0 1 0 2 0V8Zm-1 8.25a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5Z"
                                clipRule="evenodd"
                              />
                            </svg>{" "}
                            Urgent
                          </button>
                        ) : (
                          <button
                            title="Pas Urgent"
                            className="flex items-center justify-center text-xs"
                            onClick={() => {
                              handleUpdateState("urgent");
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="size-5 fill-violet-400"
                            >
                              <path d="M5.566 4.657A4.505 4.505 0 0 1 6.75 4.5h10.5c.41 0 .806.055 1.183.157A3 3 0 0 0 15.75 3h-7.5a3 3 0 0 0-2.684 1.657ZM2.25 12a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3v-6ZM5.25 7.5c-.41 0-.806.055-1.184.157A3 3 0 0 1 6.75 6h10.5a3 3 0 0 1 2.683 1.657A4.505 4.505 0 0 0 18.75 7.5H5.25Z" />
                            </svg>{" "}
                            Pas urgent
                          </button>
                        )}

                        {/* Importance */}
                        {privates ? (
                          <button
                            title="Privée"
                            className="flex items-center justify-center text-xs"
                            onClick={() => {
                              handleUpdateState("private");
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="size-5 fill-blue-400"
                            >
                              <path
                                fillRule="evenodd"
                                d="M15.75 1.5a6.75 6.75 0 0 0-6.651 7.906c.067.39-.032.717-.221.906l-6.5 6.499a3 3 0 0 0-.878 2.121v2.818c0 .414.336.75.75.75H6a.75.75 0 0 0 .75-.75v-1.5h1.5A.75.75 0 0 0 9 19.5V18h1.5a.75.75 0 0 0 .53-.22l2.658-2.658c.19-.189.517-.288.906-.22A6.75 6.75 0 1 0 15.75 1.5Zm0 3a.75.75 0 0 0 0 1.5A2.25 2.25 0 0 1 18 8.25a.75.75 0 0 0 1.5 0 3.75 3.75 0 0 0-3.75-3.75Z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        ) : (
                          <button
                            title="publique"
                            className="flex items-center justify-center text-xs"
                            onClick={() => {
                              handleUpdateState("private");
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="size-5 fill-blue-400"
                            >
                              <path d="M15.75 8.25a.75.75 0 0 1 .75.75c0 1.12-.492 2.126-1.27 2.812a.75.75 0 1 1-.992-1.124A2.243 2.243 0 0 0 15 9a.75.75 0 0 1 .75-.75Z" />
                              <path
                                fillRule="evenodd"
                                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM4.575 15.6a8.25 8.25 0 0 0 9.348 4.425 1.966 1.966 0 0 0-1.84-1.275.983.983 0 0 1-.97-.822l-.073-.437c-.094-.565.25-1.11.8-1.267l.99-.282c.427-.123.783-.418.982-.816l.036-.073a1.453 1.453 0 0 1 2.328-.377L16.5 15h.628a2.25 2.25 0 0 1 1.983 1.186 8.25 8.25 0 0 0-6.345-12.4c.044.262.18.503.389.676l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 0 1-1.161.886l-.143.048a1.107 1.107 0 0 0-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 0 1-1.652.928l-.679-.906a1.125 1.125 0 0 0-1.906.172L4.575 15.6Z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* 2nd block Responsables */}
                    <div className="relative p-5 bg-white shadow-sm dark:bg-gray-800 rounded-xl xl:w-80">
                      <div className="absolute flex gap-1 top-2 right-2">
                        <AddRespForTache
                          responsablesActu={responsables}
                          fetchTache={fetchTache}
                          tache={tache}
                        />
                        <button
                          onClick={() => {
                            switchAffichage();
                          }}
                          className="flex items-center justify-center transition bg-white border border-gray-200 rounded-full shadow-sm w-7 h-7 dark:bg-gray-800 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-violet-500"
                        >
                          <svg
                            className="fill-current"
                            width="14"
                            height="14"
                            viewBox="0 0 16 16"
                          >
                            <path d="M13.95.879a3 3 0 0 0-4.243 0L1.293 9.293a1 1 0 0 0-.274.51l-1 5a1 1 0 0 0 1.177 1.177l5-1a1 1 0 0 0 .511-.273l8.414-8.414a3 3 0 0 0 0-4.242L13.95.879ZM11.12 2.293a1 1 0 0 1 1.414 0l1.172 1.172a1 1 0 0 1 0 1.414l-8.2 8.2-3.232.646.646-3.232 8.2-8.2Z" />
                            <path d="M10 14a1 1 0 1 0 0 2h5a1 1 0 1 0 0-2h-5Z" />
                          </svg>
                        </button>
                      </div>
                      <div className="flex justify-between mb-5 space-x-1">
                        {/* <div className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                      Responsables liés a la tache
                    </div> */}
                        <a className="text-sm font-medium disabled text-violet-500 hover:text-violet-600 dark:hover:text-violet-400"></a>
                      </div>
                      <ul className="space-y-3 overflow-y-auto ">
                        {loading && <SpinnerLoading />}
                        {responsables.length > 0 ? (
                          [...responsables]
                            .sort((a, b) =>
                              a.id ===  parseInt(tache.Responsable_Prin, 10)
                                ? -1
                                : b.id ===  parseInt(tache.Responsable_Prin, 10)
                                ? 1
                                : 0
                            )
                            .map((responsable, index) => (
                              <li key={index}>
                                <ResponsableTacheItem
                                  responsable={responsable}
                                  tache={tache}
                                  fetchTache={fetchTache}
                                  index={index}
                                  responsableLog={responsableLog}
                                />
                              </li>
                            ))
                        ) : (
                          <div className="flex items-center justify-center">
                            <span className="text-xs text-center">
                              Aucun responsable lié à cette tâche...
                            </span>
                          </div>
                        )}
                      </ul>
                    </div>

                    {/* 3rd block */}
                    <div className="p-5 bg-white shadow-sm dark:bg-gray-800 rounded-xl xl:w-80">
                      <ul className="space-y-3">
                        <li>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center grow">
                              <div className="truncate">
                                <span className="text-sm font-medium text-gray-800 dark:text-gray-100">
                                  Projet
                                </span>
                              </div>
                            </div>
                            <Link
                              to={`/projets/${
                                tache.idProjet ? tache.idProjet : "null/null"
                              }`}
                              className="btn-xs disabled text-xs border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-gray-800 dark:text-gray-300 px-2.5 py-1 rounded-full shadow-none"
                            >
                              {tache.libelleProjet &&
                              tache.libelleProjet.length > 0 ? (
                                <div>
                                  {tache.libelleProjet.length > 10
                                    ? `${tache.libelleProjet.slice(0, 10)}...`
                                    : tache.libelleProjet}
                                </div>
                              ) : (
                                <div className="text-gray-400">
                                  Aucun projet lié
                                </div>
                              )}
                            </Link>
                          </div>
                        </li>
                        <li>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center grow">
                              <div className="truncate">
                                <span className="text-sm font-medium text-gray-800 dark:text-gray-100">
                                  Type de la tache
                                </span>
                              </div>
                            </div>
                            <button className="btn-xs text-xs border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-gray-800 dark:text-gray-300 px-2.5 py-1 rounded-full shadow-none">
                              {!tache.typeTache && "Aucun type ajouté"}
                              {tache.typeTache && tache.typeTache.length > 20
                                ? `${tache.typeTache.slice(0, 20)}...`
                                : tache.typeTache}
                            </button>
                          </div>
                        </li>
                        <li>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center grow">
                              <div className="truncate">
                                <span className="text-sm font-medium text-gray-800 dark:text-gray-100">
                                  Categorie
                                </span>
                              </div>
                            </div>
                            <button className="btn-xs text-xs border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-gray-800 dark:text-gray-300 px-2.5 py-1 rounded-full shadow-none">
                              {!tache.categorie && "Aucune categorie"}
                              {tache.categorie && tache.categorie.length > 20
                                ? `${tache.categorie.slice(0, 20)}...`
                                : tache.categorie}
                            </button>
                          </div>
                        </li>
                      </ul>
                    </div>

                    {/* Block date */}
                    <div>
                      <div className="hidden p-5 bg-white shadow-sm dark:bg-gray-800 rounded-xl lg:block">
                        <ul className="mb-4 space-y-2 sm:flex sm:space-y-0 sm:space-x-2 lg:space-y-2 lg:space-x-0 lg:flex-col">
                          <li>
                            <button className="w-full h-full px-4 py-3 text-left transition bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600">
                              <div className="flex flex-wrap items-center justify-between mb-0.5">
                                <span className="font-semibold text-gray-800 dark:text-gray-100">
                                  Date prise de decision
                                </span>
                              </div>
                              <div className="text-sm">
                                {tache.datePriseDecision ? (
                                  <DateRefactor
                                    date={tache.datePriseDecision}
                                  />
                                ) : (
                                  "Aucune date inscrite"
                                )}
                              </div>
                            </button>
                          </li>
                          <li>
                            <button className="w-full h-full px-4 py-3 text-left transition bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600">
                              <div className="flex flex-wrap items-center justify-between mb-0.5">
                                <span className="font-semibold text-gray-800 dark:text-gray-100">
                                  Date debut
                                </span>
                              </div>
                              <div className="text-sm">
                                {tache.dateDebut ? (
                                  <DateRefactor date={tache.dateDebut} />
                                ) : (
                                  "Aucune date inscrite"
                                )}
                              </div>
                            </button>
                          </li>
                          <li>
                            <button className="w-full h-full px-4 py-3 text-left transition bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600">
                              <div className="flex flex-wrap items-center justify-between mb-0.5">
                                <span className="font-semibold text-gray-800 dark:text-gray-100">
                                  Date fin
                                </span>
                              </div>
                              <div className="text-sm">
                                {tache.dateFin ? (
                                  <DateRefactor date={tache.dateFin} />
                                ) : (
                                  "Aucune date inscrite"
                                )}
                              </div>
                            </button>
                          </li>
                          <li>
                            <button className="w-full h-full px-4 py-3 text-left transition bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600">
                              <div className="flex flex-wrap items-center justify-between mb-0.5">
                                <span className="font-semibold text-gray-800 dark:text-gray-100">
                                  Deadline tache
                                </span>
                              </div>
                              <div className="text-sm">
                                {tache.deadline ? (
                                  <DateRefactor date={tache.deadline} />
                                ) : (
                                  "Aucune date inscrite"
                                )}
                              </div>
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>

                    {/* sidebar bottom */}
                    <div className="block p-5 my-5 bg-white shadow-sm dark:bg-gray-800 rounded-xl lg:hidden">
                      <ul className="mb-4 space-y-2 sm:flex justify-evenly sm:space-y-0 sm:space-x-2 lg:space-y-2 lg:space-x-0 lg:flex-col">
                        <li>
                          <button className="w-full h-full px-4 py-3 text-left transition bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600">
                            <div className="flex flex-wrap items-center justify-between mb-0.5">
                              <span className="font-semibold text-gray-800 dark:text-gray-100">
                                Date prise de decision
                              </span>
                            </div>
                            <div className="text-sm">
                              {tache.datePriseDecision ? (
                                <DateRefactor date={tache.datePriseDecision} />
                              ) : (
                                "Aucune date inscrite"
                              )}
                            </div>
                          </button>
                        </li>
                        <li>
                          <button className="w-full h-full px-4 py-3 text-left transition bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600">
                            <div className="flex flex-wrap items-center justify-between mb-0.5">
                              <span className="font-semibold text-gray-800 dark:text-gray-100">
                                Date debut
                              </span>
                            </div>
                            <div className="text-sm">
                              {tache.dateDebut ? (
                                <DateRefactor date={tache.dateDebut} />
                              ) : (
                                "Aucune date inscrite"
                              )}
                            </div>
                          </button>
                        </li>
                        <li>
                          <button className="w-full h-full px-4 py-3 text-left transition bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600">
                            <div className="flex flex-wrap items-center justify-between mb-0.5">
                              <span className="font-semibold text-gray-800 dark:text-gray-100">
                                Date fin
                              </span>
                            </div>
                            <div className="text-sm">
                              {tache.dateFin ? (
                                <DateRefactor date={tache.dateFin} />
                              ) : (
                                "Aucune date inscrite"
                              )}
                            </div>
                          </button>
                        </li>
                        <li>
                          <button className="w-full h-full px-4 py-3 text-left transition bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600">
                            <div className="flex flex-wrap items-center justify-between mb-0.5">
                              <span className="font-semibold text-gray-800 dark:text-gray-100">
                                Deadline tache
                              </span>
                            </div>
                            <div className="text-sm">
                              {tache.deadline ? (
                                <DateRefactor date={tache.deadline} />
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
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default MeetupsPost;

const TaskStatusButton = ({
  status,
  handleUpdateState,
  tache,
  responsableLog,
}) => {
  const getStatusProperties = () => {
    switch (status) {
      case "Terminé":
        return {
          title: "Statut : Terminé",
          className: "flex items-center justify-center text-xs",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6 fill-green-500"
            >
              <path
                fillRule="evenodd"
                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                clipRule="evenodd"
              />
            </svg>
          ),
        };
      case "En-cours":
        return {
          title: "Statut : En-cours",
          className: "flex items-center justify-center text-xs",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6 fill-yellow-500"
            >
              <path
                fillRule="evenodd"
                d="M15.312 11.424a5.5 5.5 0 0 1-9.201 2.466l-.312-.311h2.433a.75.75 0 0 0 0-1.5H3.989a.75.75 0 0 0-.75.75v4.242a.75.75 0 0 0 1.5 0v-2.43l.31.31a7 7 0 0 0 11.712-3.138.75.75 0 0 0-1.449-.39Zm1.23-3.723a.75.75 0 0 0 .219-.53V2.929a.75.75 0 0 0-1.5 0V5.36l-.31-.31A7 7 0 0 0 3.239 8.188a.75.75 0 1 0 1.448.389A5.5 5.5 0 0 1 13.89 6.11l.311.31h-2.432a.75.75 0 0 0 0 1.5h4.243a.75.75 0 0 0 .53-.219Z"
                clipRule="evenodd"
              />
            </svg>
          ),
        };
      default:
        return {
          title: "Statut : Non terminée",
          className:
            "btn text-xs bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white",
          icon: null,
        };
    }
  };

  const { title, className, icon } = getStatusProperties();

  return (
    <button
      title={title}
      className={className}
      onClick={() => handleUpdateState("UpdateState")}
      onDoubleClick={() => {
        if (responsableLog?.id === parseInt(tache?.Responsable_Prin)) {
          handleUpdateState("VersModification");
        }
      }}
    >
      {icon} {status}
    </button>
  );
};

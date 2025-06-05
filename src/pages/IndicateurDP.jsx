import React, { useEffect, useState } from "react";
import DatePickerIDP from "../components/DatePickerIDP";
import FilterDropdown from "../components/FilterDropdown";
import ChertIDP1 from "../partials/dashboard/ChertIDP1";
import FintechIntro from "../partials/fintech/FintechIntro";
import AnalyticsCard11 from "../partials/analytics/AnalyticsCard11";
import AnalyticsCard04 from "../partials/analytics/AnalyticsCard04";
import { tailwindConfig } from "../utils/Utils";
import { useGetData } from "../utils/Requests/RequestService";
import SpinnerLoading from "../components/SpinnerLoading";
import { Link } from "react-router-dom";

function calculeIDP(data, responsable) {
  // Tâches par catégorie
  const tachesProjets = data.filter((tache) => tache.idProjet !== null);
  const tachesNoProjets = data.filter((tache) => tache.idProjet === null);
  const tacheResponsableLog = data.filter(
    (tache) =>
      parseInt(tache.Responsable_Prin) === responsable.id &&
      tache.Responsables.length === 1
  );

  // Total des tâches
  const totalTache = data.length;

  // Points pour chaque catégorie (tâches avec projets)
  const pointTacheIUProjets =
    tachesProjets.filter(
      (tache) => tache.important && tache.urgent && tache.status === "Terminé"
    ).length * 4;
  const pointTacheIProjets =
    tachesProjets.filter(
      (tache) => tache.important && !tache.urgent && tache.status === "Terminé"
    ).length * 3;
  const pointTacheUProjets =
    tachesProjets.filter(
      (tache) => !tache.important && tache.urgent && tache.status === "Terminé"
    ).length * 2;
  const pointTacheProjets =
    tachesProjets.filter(
      (tache) => !tache.important && !tache.urgent && tache.status === "Terminé"
    ).length * 1;

  // Points pour chaque catégorie (tâches sans projet)
  const pointTacheIUNoProjets =
    tachesNoProjets.filter(
      (tache) => tache.important && tache.urgent && tache.status === "Terminé"
    ).length * 4;
  const pointTacheINoProjets =
    tachesNoProjets.filter(
      (tache) => tache.important && !tache.urgent && tache.status === "Terminé"
    ).length * 3;
  const pointTacheUNoProjets =
    tachesNoProjets.filter(
      (tache) => !tache.important && tache.urgent && tache.status === "Terminé"
    ).length * 2;
  const pointTacheNoProjets =
    tachesNoProjets.filter(
      (tache) => !tache.important && !tache.urgent && tache.status === "Terminé"
    ).length * 1;

  // Points pour chaque catégorie (tâches du responsable principal seul)
  const pointTacheIU =
    tacheResponsableLog.filter(
      (tache) => tache.important && tache.urgent && tache.status === "Terminé"
    ).length * 4;
  const pointTacheI =
    tacheResponsableLog.filter(
      (tache) => tache.important && !tache.urgent && tache.status === "Terminé"
    ).length * 3;
  const pointTacheU =
    tacheResponsableLog.filter(
      (tache) => !tache.important && tache.urgent && tache.status === "Terminé"
    ).length * 2;
  const pointTache =
    tacheResponsableLog.filter(
      (tache) => !tache.important && !tache.urgent && tache.status === "Terminé"
    ).length * 1;

  const allTacheEnd = data.filter((tache) => tache.status === "Terminé").length;

  // Calcul des points totaux
  const pointsTachesProjets =
    pointTacheIUProjets +
    pointTacheIProjets +
    pointTacheUProjets +
    pointTacheProjets; // 40%
  const pointsTachesNoProjets =
    pointTacheIUNoProjets +
    pointTacheINoProjets +
    pointTacheUNoProjets +
    pointTacheNoProjets; // 30%
  const pointsTachesResponsableLog =
    pointTacheIU + pointTacheI + pointTacheU + pointTache; // 20%
  const pointsBonus = totalTache / 10;

  const pointsTotaux =
    pointsTachesProjets * 0.4 +
    pointsTachesNoProjets * 0.3 +
    pointsTachesResponsableLog * 0.2 +
    pointsBonus;

  // Pourcentage d'achèvement
  const pourcentageAchèvement = ((allTacheEnd / totalTache) * 100).toFixed(2);

  return {
    pointsTotaux,
    pourcentageAchèvement,
    totalTache,
    allTacheEnd,
  };
}

function calculeTacheStatus(data, responsable) {
  const tacheTotal = data.length;
  let listeStatus = [];

  // Filtrer les tâches par responsable principal
  const tache = data.filter(
    (tache) => parseInt(tache.Responsable_Prin) === responsable.id
  );

  // Catégoriser les tâches par statut
  const tacheEnCours = tache.filter((tache) => tache.status === "En-cours");
  const tacheNondemare = tache.filter((tache) => tache.status === "Non-démaré");
  const tacheTermine = tache.filter((tache) => tache.status === "Terminé");

  // Calculer les pourcentages
  const tacheNDPourcentage =
    tacheTotal > 0 ? (tacheNondemare.length / tacheTotal) * 100 : 0;
  const tacheEnCoursPourcentage =
    tacheTotal > 0 ? (tacheEnCours.length / tacheTotal) * 100 : 0;
  const tacheTerminePourcentage =
    tacheTotal > 0 ? (tacheTermine.length / tacheTotal) * 100 : 0;

  // Ajouter les pourcentages à la liste des statuts
  listeStatus.push(
    tacheNDPourcentage,
    tacheEnCoursPourcentage,
    tacheTerminePourcentage
  );

  // Retourner les résultats
  return {
    listeStatus,
  };
}

function calculeTachesRespContri(data, responsable, periode) {
  // Convertir la période (format : "YYYY-MM-DD/YYYY-MM-DD")
  let start, end;
  if (typeof periode === "string") {
    // Si periode est une chaîne (format "YYYY-MM-DD/YYYY-MM-DD")
    [start, end] = periode.split("/").map((date) => new Date(date));
  } else if (periode.startDate && periode.endDate) {
    // Si periode est un objet avec startDate et endDate
    start = new Date(periode.startDate);
    end = new Date(periode.endDate);
  }

  if (!start || !end) {
    console.error("Période invalide :", periode);
    return { labels: [], datasets: [] };
  }

  // Initialiser les données agrégées
  const groupedData = {};

  // Fonction pour formater une date (DD-MM-YYYY)
  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0"); // Ajoute un 0 si nécessaire
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Les mois commencent à 0
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Parcourir les données et filtrer par période
  data.forEach((tache) => {
    const dateTache = new Date(tache.dateInscription);

    // Ignorer si hors période
    if (dateTache < start || dateTache > end) return;

    const dateStr = formatDate(dateTache);

    if (!groupedData[dateStr]) {
      groupedData[dateStr] = { tacheRespo: 0, tacheContri: 0 };
    }

    // Vérifier si la tâche appartient au responsable principal
    if (parseInt(tache.Responsable_Prin) === responsable.id) {
      groupedData[dateStr].tacheRespo += 1;
    }

    // Vérifier si la tâche appartient en tant que contributeur
    if (
      tache.sousTaches &&
      tache.sousTaches.some(
        (sousTache) => parseInt(sousTache.idContributeur) === responsable.id
      )
    ) {
      groupedData[dateStr].tacheContri += 1;
    }
  });

  // Construire les données pour le graphique
  const labels = Object.keys(groupedData).sort(); // Trier par date
  const tacheRespoData = labels.map((date) => groupedData[date].tacheRespo);
  const tacheContriData = labels.map((date) => groupedData[date].tacheContri);

  return {
    tacheRespoData,
    tacheContriData,
    labels,
  };
}

function getTopContributionTasks(data, responsable) {
  if (!data || !responsable || !responsable.id) {
    console.error("Données ou responsable invalide.");
    return [];
  }

  const contributionsCount = [];
  let maxContributions = 0;

  // Parcourir les tâches
  data.forEach((tache) => {
    if (tache.sousTaches && Array.isArray(tache.sousTaches)) {
      // Filtrer les sous-tâches où le responsable est contributeur
      const contributions = tache.sousTaches.filter(
        (sousTache) => parseInt(sousTache.idContributeur) === responsable.id && parseInt(tache.Responsable_Prin) !== responsable.id
      ).length;

      // Enregistrer les contributions et mise à jour du maximum
      if (contributions > 0) {
        contributionsCount.push({ tache, contributions });
        maxContributions = Math.max(maxContributions, contributions);
      }
    }
  });
  console.log(contributionsCount);

  // Filtrer les tâches avec le nombre maximum de contributions
  const topTasks = contributionsCount
    .filter((entry) => entry.contributions === maxContributions || entry.contributions === maxContributions - 1 )
    .map((entry) => entry.tache);

  console.log(topTasks);
  return { topTasks };
}

function IndicateurDP() {
  const [periode, setPeriode] = useState({
    // startDate: "",
    // endDate: "",
  });
  const [responsable, setResponsable] = useState({});

  const [pointsIDP, setPointsIDP] = useState(null);
  const [pourcentageIDP, setPourcenbtageIDP] = useState(null);
  const [totalTacheIDP, setTotalTacheIDP] = useState(null);
  const [totalTacheEnd, setTotalTacheEnd] = useState(null);
  const [dataStatus, setDataStatus] = useState([]);

  const [taskRespChart, setTaskRespChart] = useState([]);
  const [taskContriChart, setTaskContriChart] = useState([]);
  const [labelsChart, setLabelsChart] = useState([]);

  const [topConstributionTask, setTopConstributionTask] = useState([]);

  const [AllTaches, setAllTaches] = useState([]);

  //get responsable
  const {
    data: responsableLog,
    error: responsableError,
    loading: responsableLoading,
  } = useGetData("responsables/log");

  useEffect(() => {
    if (responsableLog) {
      setResponsable(responsableLog);
    }
  }, [responsableLog]);

  //query filter for periodde
  // Construire dynamiquement l'URL en fonction de l'existence de `filter`
  const queryParams = new URLSearchParams({
    periodeStart: (periode && periode.startDate ? periode.startDate : "") || "",
    periodeEnd: (periode && periode.endDate ? periode.endDate : "") || "",
  }).toString();

  //get Tache for IDP
  const {
    data: dataTask,
    error: taskError,
    loading: taskLoading,
  } = useGetData(`indicateurDP/responsable?${queryParams}`);

  //get Tache for IDP
  const {
    data: dataTaskContribution,
    error: taskContributionError,
    loading: taskContributionLoading,
  } = useGetData(`indicateurDP/contributeur?${queryParams}`);

  //get all taches
  useEffect(() => {
    if (dataTask && responsable.id) {
      console.log(dataTask);
      const transformTask = (task) => {
        // const sousTaches = task.SousTachesJson
        //   ? JSON.parse(task.SousTachesJson).map((tache) =>
        //       JSON.parse(tache.sousTache))
        //   : [];

        // const responsables = task.responsablesJson
        //   ? JSON.parse(task.responsablesJson).map((responsable) =>
        //       JSON.parse(responsable.responsable))
        //   : [];

        return {
          ...task,
          sousTaches: task.SousTachesJson,
          Responsables: task.responsablesJson,
        };
      };

      // Transformation des tâches
      const structuredData = dataTask.map(transformTask);

      // Appels des fonctions de calcul
      const { pointsTotaux, pourcentageAchèvement, totalTache, allTacheEnd } =
        calculeIDP(structuredData, responsable);
      const { listeStatus } = calculeTacheStatus(structuredData, responsable);
      const { tacheRespoData, tacheContriData, labels } =
        calculeTachesRespContri(structuredData, responsable, periode);
      // Vérification des types des données
      const tacheRespo = Array.isArray(tacheRespoData)
        ? [...tacheRespoData]
        : [];
      const tacheContri = Array.isArray(tacheContriData)
        ? [...tacheContriData]
        : [];
      const labelsChart = Array.isArray(labels) ? [...labels] : [];

      // Mise à jour des états principaux
      setDataStatus([...listeStatus]); // Utilisation de la déstructuration pour éviter `.push`
      setTaskRespChart(tacheRespo); // Utilisation du tableau brut
      setTaskContriChart(tacheContri); // Utilisation du tableau brut
      setLabelsChart(labelsChart); // Utilisation du tableau brut
      setPointsIDP(pointsTotaux);
      setPourcenbtageIDP(pourcentageAchèvement);
      setTotalTacheIDP(totalTache);
      setTotalTacheEnd(allTacheEnd);
      setAllTaches(structuredData);

      // Debugging
      // console.log("###### Taches ", structuredData);
      // console.log("###### Points totaux", pointsTotaux);
      // console.log("###### Pourcentage d'achèvements", pourcentageAchèvement);
      // console.log("###### Taches total", totalTache);
      // console.log("###### Taches status", dataStatus);
      // console.log("###### Labels Chart", labelsChart);
      // console.log("###### Top Contribution", topConstributionTask);
    }
  }, [dataTask, responsable.id]);

  useEffect(() => {
    if (dataTask && responsable.id) {
      const transformTask = (task) => {
        // const sousTaches = task.SousTachesJson
        //   ? JSON.parse(task.SousTachesJson).map((tache) =>
        //       JSON.parse(tache.sousTache)
        //     )
        //   : [];

        // const responsables = task.responsablesJson
        //   ? JSON.parse(task.responsablesJson).map((responsable) =>
        //       JSON.parse(responsable.responsable)
        //     )
        //   : [];

        return {
          ...task,
          sousTaches: task.SousTachesJson,
          Responsables: task.responsablesJson,
        };
      };

      // Transformation des tâches
      const structuredDataTaskContribution =
        dataTaskContribution.map(transformTask);

      // Appels des fonctions de calcul
      const { topTasks } = getTopContributionTasks(
        structuredDataTaskContribution,
        responsable
      );

      // Vérification des types des données
      const topTaskContri = Array.isArray(topTasks) ? [...topTasks] : [];

      // Mise à jour des états principaux
      setTopConstributionTask(topTaskContri);

      // Debugging
      // console.log("###### Top Contribution", topConstributionTask);
    }
  }, [dataTaskContribution, responsable.id]);

  const chartData = {
    labels: labelsChart,
    datasets: [
      // Blue bars
      {
        label: "Responsable",
        data: taskRespChart,
        backgroundColor: tailwindConfig().theme.colors.violet[500],
        hoverBackgroundColor: tailwindConfig().theme.colors.violet[600],
        categoryPercentage: 0.7,
        borderRadius: 4,
      },
      // Light blue bars
      {
        label: "Contributeur",
        data: taskContriChart,
        backgroundColor: tailwindConfig().theme.colors.sky[500],
        hoverBackgroundColor: tailwindConfig().theme.colors.sky[600],
        categoryPercentage: 0.7,
        borderRadius: 4,
      },
    ],
  };

  const chartData1 = {
    labels: ["Non demaré", "En cours", "Terminé"],
    datasets: [
      {
        label: `Etat des taches`,
        data: dataStatus.length > 0 ? dataStatus : [0, 0, 0], // Valeur par défaut
        backgroundColor: [
          tailwindConfig().theme.colors.violet[500],
          tailwindConfig().theme.colors.sky[500],
          tailwindConfig().theme.colors.violet[800],
        ],
        hoverBackgroundColor: [
          tailwindConfig().theme.colors.violet[600],
          tailwindConfig().theme.colors.sky[600],
          tailwindConfig().theme.colors.violet[900],
        ],
        borderWidth: 0,
      },
    ],
  };

  return (
    <main className="grow">
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        {/* Dashboard actions */}
        <div className="sm:flex sm:justify-between sm:items-center mb-8">
          {/* Left: Title */}
          <div className="mb-4 sm:mb-0">
            <h1 className="text-xl md:text-2xl text-gray-800 dark:text-gray-100 font-bold">
              Indicateur de performance
            </h1>
          </div>

          {/* Right: Actions */}
          <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
            {/* Filter button */}

            {/* Datepicker built with flatpickr */}
            <DatePickerIDP
              setPeriode={setPeriode}
              periode={periode}
              align="right"
            />
            {/* Add view button */}
            <Link to={`/nouvelle/taches`} className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white">
              <svg
                className="fill-current shrink-0 xs:hidden"
                width="16"
                height="16"
                viewBox="0 0 16 16"
              >
                <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
              </svg>
              <span className="max-xs:sr-only">Nouvelle Tache</span>
            </Link>
          </div>
        </div>

        {/* Cards */}
        {taskLoading && (
          <div className="text-center">
            <SpinnerLoading />
          </div>
        )}
        <div className="grid grid-cols-12 gap-6">
          <FintechIntro
            responsable={responsable}
            responsableError={responsableError}
            responsableLoading={responsableLoading}
            pointsIDP={pointsIDP}
            pourcentageIDP={pourcentageIDP}
            totalTacheIDP={totalTacheIDP}
            totalTacheEnd={totalTacheEnd}
          />
          {/* Line chart (Acme Plus) */}
          {taskError && (
            <>
              <p className="text-red-500 text-xs">
                error lors de la recuperation des données..
              </p>
            </>
          )}
          <ChertIDP1
            chartData={chartData1}
            width={595}
            height={248}
            title={`Etat des taches: ${responsable.nom} ${responsable.prenom}`}
          />
          {/* Horizontal bar chart (Audience Overview) */}
          <AnalyticsCard04
            chartData={chartData}
            width={595}
            height={248}
            title={`Responsabilité et contribution`}
          />
          {/* Table (Top Products) */}
          <AnalyticsCard11
            topConstributionTask={topConstributionTask}
            responsable={responsable}
            taskContributionError={taskContributionError}
            taskContributionLoading={taskContributionLoading}
          />
        </div>
      </div>
    </main>
  );
}

export default IndicateurDP;

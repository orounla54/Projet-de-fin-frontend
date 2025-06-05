import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import "./css/style.css";
import { useAuth } from "./utils/Auth/AuthContext";
import "./charts/ChartjsConfig";

// Import pages
import Forum from "./pages/community/Forum";
import MeetupsPost from "./pages/community/MeetupsPost";
import JobListing from "./pages/job/JobListing";
import JobPost from "./pages/job/JobPost";
import TasksList from "./pages/tasks/TasksList";
import PageNotFound from "./pages/utility/PageNotFound";
import Signin from "./pages/Signin";
import ProjetsFiltre from "./pages/ProjetsFiltre";
import TypesTachesFilter from "./pages/TypesTachesFilter";
import Taches from "./pages/Taches";
import TachesFiltres from "./pages/TachesFiltres";
import NouvelleTache from "./pages/formulaire/NouvelleTache";
import NouveauProjet from "./pages/formulaire/NouveauProjet";
import NouveauTypesTache from "./pages/formulaire/NouveauTypesTache";
import { SuccessMessageProvider } from "./utils/SuccessContext";
import ModifierTache from "./pages/formulaire/ModifierTache";
import ModifierProjets from "./pages/formulaire/ModifierProjets";
import Calendar from "./pages/Calendar";
import Campaigns from "./pages/Campaigns";
import Profile from "./pages/community/Profile";
import Validation from "./pages/Validation";
import NewResponsable_Profile from "./pages/NewResponsable_Profile";
import TitlePage from "./components/TitlePage";
import Messages from "./pages/Messages";
import DiscussionsPage from "./pages/DiscussionsPage";
import MotDePasseOublier from "./pages/formulaire/MotDePasseOublier";
import MotDePasseValidation from "./pages/formulaire/MotDePasseValidation";
import ResetMotDePasse from "./pages/formulaire/ResetMotDePasse";
import Apps from "./pages/settings/Apps";
import Account from "./partials/settings/Account";
import Services from "./pages/Services";
import UsersTiles from "./pages/community/UsersTiles";
import AdminPostes from "./pages/AdminPostes";
import Positions from "./pages/Positions";
import CalendarEntreprise from "./pages/CalendarEntreprise";
import EvenementsSociete from "./pages/EvenementsSociete";
import Transactions from "./pages/finance/Transactions";
import EmptyState from "./pages/utility/EmptyState";
import Customers from "./pages/ecommerce/Customers";
import FormulaireConfirmationInvites from "./components/formulaires/FormulaireConfirmationInvites";
import CategoriesEvenements from "./pages/CategoriesEvenements";
import RolesTaches from "./pages/RolesTaches";
import PlansPage from "./pages/job/PlansPage";
import PrioritesPage from "./pages/job/PrioritesPage";
import PrioritesResp_Servi from "./pages/job/PrioritesResp_Servi";
import PlanPage from "./pages/job/PlanPage";
import PrioritePage from "./pages/job/PrioritePage";
import KnowledgeBase from "./pages/utility/KnowledgeBase";

function App() {
  const location = useLocation();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    document.querySelector("html").style.scrollBehavior = "auto";
    window.scroll({ top: 0 });
    document.querySelector("html").style.scrollBehavior = "";
  }, [location.pathname]); // triggered on route change

  return (
    <>
      <SuccessMessageProvider>
        <Routes>
          <Route
            exact
            path="/"
            element={
              isAuthenticated ? (
                <TitlePage title="Accueil">
                  <Forum />
                </TitlePage>
              ) : (
                <TitlePage title="Connexion">
                  <Signin />
                </TitlePage>
              )
            }
          />

          <Route
            path="/projets"
            element={
              <TitlePage title="Projets">
                <JobListing />
              </TitlePage>
            }
          />

          <Route
            path="/filtres/projets"
            element={
              <TitlePage title="Filtre Projets">
                <ProjetsFiltre />
              </TitlePage>
            }
          />

          <Route
            path="/projets/:id"
            element={
              <TitlePage title="Projets">
                <JobPost />
              </TitlePage>
            }
          />

          <Route
            path="/typesTaches"
            element={
              <TitlePage title="Types de tache">
                <TypesTachesFilter />
              </TitlePage>
            }
          />

          <Route
            path="/taches"
            element={
              <TitlePage title="Taches">
                <Taches />
              </TitlePage>
            }
          />

          <Route
            path="/filtres/taches"
            element={
              <TitlePage title="Filtres Taches">
                <TachesFiltres />
              </TitlePage>
            }
          />

          <Route
            path="/private/taches"
            element={
              <TitlePage title="Taches responsables">
                <TasksList />
              </TitlePage>
            }
          />

          <Route
            path="/taches/:id"
            element={
              <TitlePage title="Taches">
                <MeetupsPost />
              </TitlePage>
            }
          />

          <Route
            path="/evenements"
            element={
              <TitlePage title="Evenements">
                <Campaigns />
              </TitlePage>
            }
          />

          <Route
            path="/societe/evenements"
            element={
              <TitlePage title="Evenements societe">
                <EvenementsSociete />
              </TitlePage>
            }
          />

          <Route
            path="/categories/evenements"
            element={
              <TitlePage title="Categories Evenements">
                <CategoriesEvenements />
              </TitlePage>
            }
          />

          <Route
            path="/profiles"
            element={
              <TitlePage title="Profiles">
                <Account />
              </TitlePage>
            }
          />

          <Route
            path="/evenements/calendrier"
            element={
              <TitlePage title="Calendrier">
                <Calendar />
              </TitlePage>
            }
          />

          <Route
            path="/evenements/calendrier/societe"
            element={
              <TitlePage title="Calendrier de la société">
                <CalendarEntreprise />
              </TitlePage>
            }
          />

          <Route
            path="/evenements/:id"
            element={
              <TitlePage title="Evenements">
                <Profile />
              </TitlePage>
            }
          />

          <Route
            path="/societe/evenements/:id"
            element={
              <TitlePage title="Evenements societe">
                <Profile />
              </TitlePage>
            }
          />

          <Route
            path="/discussions"
            element={
              <TitlePage title="Discussions">
                <DiscussionsPage />
              </TitlePage>
            }
          />

          <Route
            path="/discussions/:id"
            element={
              <TitlePage title="Discussions">
                <Messages />
              </TitlePage>
            }
          />

          <Route
            path="/sollicitations/responsable"
            element={
              <TitlePage title="Mes sollicitations">
                <EmptyState />
              </TitlePage>
            }
          />

          <Route
            path="/sollicitations/service"
            element={
              <TitlePage title="Sollicitation du service">
                <Customers />
              </TitlePage>
            }
          />

          <Route
            path="/plans/accueil"
            element={
              <TitlePage title="Liste Plans stratégique ">
                <PlansPage />
              </TitlePage>
            }
          />

          <Route
            path="/plans/:id"
            element={
              <TitlePage title="Plans stratégique ">
                <PlanPage page="plansStrategiques" />
              </TitlePage>
            }
          />

          <Route
            path="/plans/axesStrategiques/:id"
            element={
              <TitlePage title="Axes stratégique ">
                <PlanPage page="axesStrategiques" />
              </TitlePage>
            }
          />

          <Route
            path="/plans/objectifsStrategiques/:id"
            element={
              <TitlePage title="Objectifs stratégique ">
                <PlanPage page="objectifsStrategiques" />
              </TitlePage>
            }
          />

          <Route
            path="/plans/mesuresStrategiques/:id"
            element={
              <TitlePage title="Mesures stratégique ">
                <PlanPage page="mesuresStrategiques" />
              </TitlePage>
            }
          />

          <Route
            path="/plans/objectifsOperationnels/:id"
            element={
              <TitlePage title="Objectifs operationnel ">
                <PlanPage page="objectifsOperationnels" />
              </TitlePage>
            }
          />

          <Route
            path="/plans/priorites"
            element={
              <TitlePage title="Liste priorites">
                <PrioritesPage />
              </TitlePage>
            }
          />

          <Route
            path="/plans/priorites/responsable"
            element={
              <TitlePage title="Mes priorites">
                <PrioritesResp_Servi endpoint="priorites/responsable" />
              </TitlePage>
            }
          />

          <Route
            path="/plans/priorites/:id"
            element={
              <TitlePage title="Priorites">
                <PrioritePage page="responsable" />
              </TitlePage>
            }
          />

        <Route
            path="/plans/manage/priorites/:id"
            element={
              <TitlePage title="Priorites - Manage">
                <PrioritePage page="manage" />
              </TitlePage>
            }
          />

          <Route
            path="/plans/priorites/service"
            element={
              <TitlePage title="Priorites service">
                <PrioritesResp_Servi endpoint="priorites/service" />
              </TitlePage>
            }
          />

          <Route
            path="/administration/services"
            element={
              <TitlePage title="Services">
                <Services />
              </TitlePage>
            }
          />

          <Route
            path="/administration/responsables"
            element={
              <TitlePage title="Responsables">
                <UsersTiles />
              </TitlePage>
            }
          />

          <Route
            path="/administration/postes"
            element={
              <TitlePage title="Postes">
                <AdminPostes />
              </TitlePage>
            }
          />

          <Route
            path="/administration/positions"
            element={
              <TitlePage title="Positions">
                <Positions />
              </TitlePage>
            }
          />

          <Route
            path="/administration/EvenementsTaches/defaut"
            element={
              <TitlePage title="Taches Evenement par defaut">
                <Transactions />
              </TitlePage>
            }
          />

          <Route
            path="/rolesTaches"
            element={
              <TitlePage title="Roles taches">
                <RolesTaches endpoint="roles" element="roles tache" />
              </TitlePage>
            }
          />

          <Route
            path="/typesPriorites"
            element={
              <TitlePage title="Types priotités">
                <RolesTaches endpoint="typePriorites" element="type priorite" />
              </TitlePage>
            }
          />

          <Route
            path="/rolesPlans"
            element={
              <TitlePage title="Roles plans">
                <RolesTaches endpoint="rolesPlan" element="roles plan" />
              </TitlePage>
            }
          />

          {/* docs et autes  */}
          <Route
            path="/autres"
            element={
              <TitlePage title="..">
                <KnowledgeBase />
              </TitlePage>
            }
          />          
          
          {/* formulaire  */}
          <Route
            path="/nouveau/typetaches"
            element={
              <TitlePage title="Nouveau type de taches">
                <NouveauTypesTache />
              </TitlePage>
            }
          />

          <Route
            path="/nouvelle/taches"
            element={
              <TitlePage title="Nouvelle tache">
                <NouvelleTache />
              </TitlePage>
            }
          />

          <Route
            path="/nouveau/projets"
            element={
              <TitlePage title="Nouveau projet">
                <NouveauProjet />
              </TitlePage>
            }
          />

          <Route
            path="/modification/taches/:id"
            element={
              <TitlePage title="Modifier tache">
                <ModifierTache />
              </TitlePage>
            }
          />

          <Route
            path="/modification/projets/:id"
            element={
              <TitlePage title="Modifier projet">
                <ModifierProjets />
              </TitlePage>
            }
          />

          {/*## Routes Non proteger car on utilise pas le Request service qui s'occupe de la protection */}
          <Route
            path="*"
            element={
              <TitlePage title="Page non disponible">
                <PageNotFound />
              </TitlePage>
            }
          />

          <Route
            path="/profiles/validation"
            element={
              <TitlePage title="Validation de profil">
                <Validation />
              </TitlePage>
            }
          />

          <Route
            path="/responsables/nouveau"
            element={
              <TitlePage title="Nouveau responsable">
                <NewResponsable_Profile />
              </TitlePage>
            }
          />

          <Route
            path="/evenements/:libelle/:id/confirmation/inviter"
            element={
              <TitlePage title="Page inviter">
                <FormulaireConfirmationInvites />
              </TitlePage>
            }
          />

          <Route
            path="/profiles/mot-de-passe-oublier"
            element={
              <TitlePage title="Mot de passe oublier">
                <MotDePasseOublier titre="Réinitialiser votre mot de passe" />
              </TitlePage>
            }
          />

          <Route
            path="/profiles/connexion"
            element={
              <TitlePage title="Connexion par email">
                <MotDePasseOublier titre="Connexion via le mail ✅" />
              </TitlePage>
            }
          />

          <Route
            path="/profiles/mot-de-passe-oublier/validation/:token"
            element={
              <TitlePage title="Verification du token">
                <MotDePasseValidation />
              </TitlePage>
            }
          />

          <Route
            path="/profiles/:id/connexion/:token"
            element={
              <TitlePage title="Verification du token">
                <MotDePasseValidation />
              </TitlePage>
            }
          />

          <Route
            path="/profiles/reset-mot-de-passe/:token"
            element={
              <TitlePage title="Nouveau mot de passe">
                <ResetMotDePasse />
              </TitlePage>
            }
          />
        </Routes>
      </SuccessMessageProvider>
    </>
  );
}

export default App;

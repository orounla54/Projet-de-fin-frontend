import React, { useEffect, useState } from "react";
import Sidebar from "../../partials/Sidebar";
import Header from "../../partials/Header";
import FormulaireTaches from "../../components/formulaires/FormulaireTaches";
import { useParams } from "react-router-dom";
import { useGetData } from "../../utils/Requests/RequestService";
import SpinnerLoading from "../../components/SpinnerLoading";

function ModifierTache() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { id } = useParams();

  const [tache, setTache] = useState({});

  // Récupère les données via le hook personnalisé
  const { data, loading, error } = useGetData(id ? `/taches/${id}` : "");

  // Met à jour l'état du tache quand `data` change
  useEffect(() => {
    if (data && data !== tache) {
      setTache(data);
    }
  }, [data]);

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      {/* Sidebar */}

      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        variant="v2"
      />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-x-hidden overflow-y-auto bg-white dark:bg-gray-900">
        {/*  Site header */}
        <Header
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          variant="v3"
        />

        <main className="relative grow">
          {loading ? (
            <div className="absolute z-40 flex items-center justify-center w-full h-full bg-white dark:bg-gray-900">
              <SpinnerLoading />
            </div>
          ) : (
            <>
              {" "}
              <FormulaireTaches tache={tache} />
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default ModifierTache;

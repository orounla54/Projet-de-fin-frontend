import React, { useEffect, useState } from "react";

import Sidebar from "../../partials/Sidebar";
import Header from "../../partials/Header";
import SettingsSidebar from "../../partials/settings/SettingsSidebar";
import AccountPanel from "../../partials/settings/AccountPanel";
import { useGetData } from "../../utils/Requests/RequestService";
import AuthService from "../../utils/Auth/AuthServices";
import axios from "axios";
import { baseURL } from "../../utils/DataFront/eventTypes";
import SpinnerLoading from "../../components/SpinnerLoading";

// Fonction pour formater les données
const formatResponsableData = (data) => {
  return {
    ...data,
    positions: JSON.parse(data.positions || "[]"), // Convertir la chaîne JSON en tableau
    postes: JSON.parse(data.postes || "[]"),
    profiles: JSON.parse(data.profiles || "[]"),
    services: JSON.parse(data.services || "[]"),
  };
};

function Account() {
  const baseUrl = baseURL;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [responsableLog, setResponsableLog] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Récupération du responsable avec un hook personnalisé
  const {
    data: responsable,
    error: responsableError,
    loading: responsableLoading,
    fetchData
  } = useGetData("responsables/log");

  useEffect(() => {
    // Fonction pour gérer la requête
    const fetchResponsableDetails = async () => {
      setLoading(true);
      const accessToken = AuthService.getAccessToken();

      try {
        if (responsable) {
          const response = await axios.get(
            `${baseUrl}/responsables/${responsable?.id}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          // const formattedData = formatResponsableData(response.data);
          setResponsableLog(response.data);
        }
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Erreur inattendue lors de la récupération des données."
        );
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    // Lancer la requête seulement si `responsable` est défini
    if (responsable) {
      fetchResponsableDetails();
    }
  }, [responsable, baseUrl]);
  // console.log(responsableLog);

  useEffect(() => {
    if (loading) {
      // Désactiver le scroll
      document.body.classList.add("overflow-hidden");
    } else {
      // Réactiver le scroll
      document.body.classList.remove("overflow-hidden");
    }

    // Nettoyage au démontage
    return () => document.body.classList.remove("overflow-hidden");
  }, [loading]);

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-x-hidden overflow-y-auto">
        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="relative grow">
          {loading || responsableLoading ? (
            <div className="absolute z-40 flex items-center justify-center w-full h-full bg-white dark:bg-gray-900">
              <SpinnerLoading />
            </div>
          ) : (
            <>
              {" "}
              <div className="w-full px-4 py-8 mx-auto sm:px-6 lg:px-8 max-w-9xl">
                {/* Page header */}
                <div className="mb-8">
                  {/* Title */}
                  <h1 className="text-2xl font-bold text-gray-800 md:text-3xl dark:text-gray-100">
                    Parametres profiles
                  </h1>
                  {error && (
                    <p className="text-xs text-center text-red-500">{error}</p>
                  )}
                  {responsableError && (
                    <p className="text-xs text-center text-red-500">
                      {responsableError}
                    </p>
                  )}
                </div>

                {/* Content */}
                <div className="mb-8 bg-white shadow-sm dark:bg-gray-800 rounded-xl">
                  <div className="flex flex-col md:flex-row md:-mr-px">
                    <SettingsSidebar />
                    <AccountPanel
                      fetchData={fetchData}
                      responsableLog={responsableLog}
                    />
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

export default Account;

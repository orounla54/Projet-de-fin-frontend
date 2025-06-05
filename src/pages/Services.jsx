import React, { useEffect, useState } from "react";
import Header from "../partials/Header";
import Sidebar from "../partials/Sidebar";
import AdminLeftContent from "../partials/community/AdminLeftContent";
import AdminEntries from "../partials/community/AdminEntries";
import AdminRightContent from "../partials/community/AdminRightContent";
import { useGetData } from "../utils/Requests/RequestService";
import AddAdminElement from "../components/AddAdminElement";
import SpinnerLoading from "../components/SpinnerLoading";
import { baseURL } from "../utils/DataFront/eventTypes";
import AuthService from "../utils/Auth/AuthServices";
import axios from "axios";
import AdminServicesListing from "../components/AdminServicesListing";

// Fonction pour formater les données
const formatResponsableData = (data) => {
  return {
    ...data,
    responsables: JSON.parse(data.responsables || "[]"),
    taches: JSON.parse(data.taches || "[]"),
    postes: JSON.parse(data.postes || "[]"),
  };
};

function Services() {
  const baseUrl = baseURL;
  const element = "services";
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [page, setPage] = useState("Accueil");
  const [keyword, setKeyword] = useState("");
  const [services, setServices] = useState([]);
  const [servicesCurrentInfo, setServicesCurrentInfo] = useState([]);
  const [servicesCurrentIdInfo, setServicesCurrentIdInfo] = useState();
  const [loadingCurrent, setLoadingCurrent] = useState(false);
  const [errorCurrent, setErrorCurrent] = useState(null);

  // Construire dynamiquement l'URL en fonction de l'existence de `filter`
  const queryParams = new URLSearchParams({
    keyword: keyword,
  }).toString();

  // Récupérer les données avec les paramètres de filtre conditionnels
  const { data, loading, error, fetchData } = useGetData(
    `filter/services?${queryParams}`
  );

  useEffect(() => {
    if (data) {
      setServices(data);
      setServicesCurrentIdInfo(services[0]?.id);
    }
    // console.log(services);
    // console.log(servicesCurrentIdInfo);
  }, [data]);

  useEffect(() => {
    // Fonction pour gérer la requête
    const fetchDetails = async () => {
      setLoadingCurrent(true);
      const accessToken = AuthService.getAccessToken();

      try {
        if (servicesCurrentIdInfo) {
          const response = await axios.get(
            `${baseUrl}/services/${servicesCurrentIdInfo}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          // const formattedData = formatResponsableData(response.data);
          setServicesCurrentInfo(response.data);
        }
      } catch (err) {
        setErrorCurrent(
          err.response?.data?.message ||
            "Erreur inattendue lors de la récupération des données."
        );
        console.error(err);
      } finally {
        setLoadingCurrent(false);
      }
    };

    // Lancer la requête seulement si `responsable` est défini
    if (servicesCurrentIdInfo) {
      fetchDetails();
    }
  }, [servicesCurrentIdInfo, baseUrl, data]);
  // console.log(servicesCurrentInfo);

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-x-hidden overflow-y-auto">
        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="relative grow">
          {loading ? (
            <div className="absolute z-40 flex items-center justify-center w-full h-full bg-white dark:bg-gray-900">
              <SpinnerLoading />
            </div>
          ) : (
            <>
              {" "}
              <div className="w-full px-4 py-8 mx-auto sm:px-6 lg:px-8 md:py-0 max-w-9xl ">
                <div className="xl:flex ">
                  {/* Left + Middle content */}
                  <div className="flex-1 md:flex ">
                    {/* Left content */}
                    <AdminLeftContent
                      element={element}
                      page={page}
                      setPage={setPage}
                      setFeedbackModalOpen={setFeedbackModalOpen}
                    />

                    {/* Middle content */}
                    <div className="flex-1 md:ml-8 xl:mx-4 2xl:mx-8 ">
                      <div className="md:py-8">
                        {/* Forum Entries */}
                        <div className="space-y-2">
                          {page && page === "listing" ? (
                            <>
                              <AdminServicesListing
                                fetchData={fetchData}
                                element={element}
                                services={services}
                                setKeyword={setKeyword}
                                setFeedbackModalOpen={setFeedbackModalOpen}
                              />
                            </>
                          ) : page === "ServicesIDP" ? (
                            <></>
                          ) : (
                            <>
                              <AdminEntries
                                element={element}
                                fetchData={fetchData}
                                services={services}
                                setKeyword={setKeyword}
                                error={error}
                                servicesCurrentIdInfo={servicesCurrentIdInfo}
                                setServicesCurrentIdInfo={
                                  setServicesCurrentIdInfo
                                }
                              />
                            </>
                          )}
                        </div>

                        {/* Pagination */}
                        <div className="mt-6 text-right"></div>
                      </div>
                    </div>
                  </div>
                  {/* Right content */}
                  {page === "Accueil" ? (
                    <>
                      <AdminRightContent
                        element={element}
                        loadingCurrent={loadingCurrent}
                        errorCurrent={errorCurrent}
                        taches={servicesCurrentInfo?.taches || []}
                        setFeedbackModalOpen={setFeedbackModalOpen}
                        responsables={servicesCurrentInfo?.responsables || []}
                      />
                    </>
                  ) : (
                    <></>
                  )}

                  <AddAdminElement
                    element={element}
                    fetchData={fetchData}
                    feedbackModalOpen={feedbackModalOpen}
                    setFeedbackModalOpen={setFeedbackModalOpen}
                    responsables={servicesCurrentInfo.responsables}
                  />
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default Services;

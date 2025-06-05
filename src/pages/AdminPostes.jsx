import React, { useEffect, useState } from "react";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import { useGetData } from "../utils/Requests/RequestService";
import { baseURL } from "../utils/DataFront/eventTypes";
import AuthService from "../utils/Auth/AuthServices";
import axios from "axios";
import SpinnerLoading from "../components/SpinnerLoading";
import AddAdminElement from "../components/AddAdminElement";
import AdminLeftContent from "../partials/community/AdminLeftContent";
import AdminEntries from "../partials/community/AdminEntries";
import AdminRightContent from "../partials/community/AdminRightContent";
import AdminServicesListing from "../components/AdminServicesListing";

// Fonction pour formater les données
const formatData = (data) => {
  return {
    ...data,
    responsables: JSON.parse(data.responsables || "[]"),
    services: JSON.parse(data.services || "[]"),
  };
};

function AdminPostes() {
  const baseUrl = baseURL;
  const element = "postes";
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [postes, setPostes] = useState([]);
  const [postesCurrentInfo, setPostesCurrentInfo] = useState([]);
  const [posteCurrentIdInfo, setPosteCurrentIdInfo] = useState();
  const [loadingCurrent, setLoadingCurrent] = useState(false);
  const [errorCurrent, setErrorCurrent] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState("Accueil");

  // Construire dynamiquement l'URL en fonction de l'existence de `filter`
  const queryParams = new URLSearchParams({
    keyword: keyword,
  }).toString();

  // Récupérer les données avec les paramètres de filtre conditionnels
  const { data, loading, error, fetchData } = useGetData(
    `filter/postes?${queryParams}`
  );

  useEffect(() => {
    if (data) {
      setPostes(data);
      setPosteCurrentIdInfo(postes[0]?.id);
      console.log(postes);
      console.log(posteCurrentIdInfo);
    }
  }, [data]);

  useEffect(() => {
    // Fonction pour gérer la requête
    const fetchDetails = async () => {
      setLoadingCurrent(true);
      const accessToken = AuthService.getAccessToken();

      try {
        if (posteCurrentIdInfo) {
          const response = await axios.get(
            `${baseUrl}/postes/${posteCurrentIdInfo}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          // const formattedData = formatData(response.data);
          setPostesCurrentInfo(response.data);
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
    if (posteCurrentIdInfo) {
      fetchDetails();
    }
  }, [posteCurrentIdInfo, baseUrl, data]);
    console.log(postesCurrentInfo);

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
              <div className="w-full px-4 py-8 mx-auto sm:px-6 lg:px-8 md:py-0 max-w-9xl ">
                <div className="xl:flex ">
                  {/* Left + Middle content */}
                  <div className="flex-1 md:flex ">
                    {/* Left content */}
                    <AdminLeftContent
                      page={page}
                      element={element}
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
                                services={postes}
                                setKeyword={setKeyword}
                                setFeedbackModalOpen={setFeedbackModalOpen}
                              />
                            </>
                          ) : (
                            <>
                              <AdminEntries
                                fetchData={fetchData}
                                element={element}
                                services={postes}
                                setKeyword={setKeyword}
                                error={error}
                                servicesCurrentIdInfo={posteCurrentIdInfo}
                                setServicesCurrentIdInfo={setPosteCurrentIdInfo}
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
                        loadingCurrent={loadingCurrent}
                        errorCurrent={errorCurrent}
                        setFeedbackModalOpen={setFeedbackModalOpen}
                        element={element}
                        responsables={postesCurrentInfo.responsables}
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

export default AdminPostes;

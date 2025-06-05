import React, { useEffect, useState } from "react";
import { baseURL } from "../utils/DataFront/eventTypes";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import { useGetData } from "../utils/Requests/RequestService";
import AuthService from "../utils/Auth/AuthServices";
import SpinnerLoading from "../components/SpinnerLoading";
import AddAdminElement from "../components/AddAdminElement";
import AdminRightContent from "../partials/community/AdminRightContent";
import AdminEntries from "../partials/community/AdminEntries";
import AdminServicesListing from "../components/AdminServicesListing";
import AdminLeftContent from "../partials/community/AdminLeftContent";
import axios from "axios";

// Fonction pour formater les données
const formatData = (data) => {
  return {
    ...data,
    responsables: JSON.parse(data.responsables || "[]"),
    services: JSON.parse(data.services || "[]"),
    positions: JSON.parse(data.positions || "[]"),
    postes: JSON.parse(data.postes || "[]"),

  };
};

function Positions() {
  const element = "positions";
  const baseUrl = baseURL;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [positions, setPositions] = useState([]);
  const [positionsCurrentInfo, setPositionsCurrentInfo] = useState([]);
  const [positionCurrentIdInfo, setPositionCurrentIdInfo] = useState();
  const [loadingCurrent, setLoadingCurrent] = useState(false);
  const [errorCurrent, setErrorCurrent] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState("Accueil");

  const queryParams = new URLSearchParams({
    keyword: keyword,
  }).toString();

  // Récupérer les données avec les paramètres de filtre conditionnels
  const { data, loading, error, fetchData } = useGetData(
    `filter/positions?${queryParams}`
  );

  useEffect(() => {
    if (data) {
      setPositions(data);
      setPositionsCurrentInfo(data[0]?.id);
      // console.log(positions);
      // console.log(positionsCurrentInfo);
    }
  }, [data]);

  useEffect(() => {
    // Fonction pour gérer la requête
    const fetchDetails = async () => {
      setLoadingCurrent(true);
      const accessToken = AuthService.getAccessToken();

      try {
        if (positionCurrentIdInfo) {
          const response = await axios.get(
            `${baseUrl}/positions/${positionCurrentIdInfo}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          const formattedData = formatData(response.data);
          setPositionsCurrentInfo(formattedData);
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
    if (positionCurrentIdInfo) {
      fetchDetails();
    }
  }, [positionCurrentIdInfo, baseUrl, data]);
  console.log(positionsCurrentInfo);

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
                                services={positions}
                                setKeyword={setKeyword}
                                setFeedbackModalOpen={setFeedbackModalOpen}
                              />
                            </>
                          ) : (
                            <>
                              <AdminEntries
                                fetchData={fetchData}
                                element={element}
                                services={positions}
                                setKeyword={setKeyword}
                                error={error}
                                servicesCurrentIdInfo={positionCurrentIdInfo}
                                setServicesCurrentIdInfo={
                                  setPositionCurrentIdInfo
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
                        loadingCurrent={loadingCurrent}
                        errorCurrent={errorCurrent}
                        setFeedbackModalOpen={setFeedbackModalOpen}
                        element={element}
                        responsables={positionsCurrentInfo?.responsables}
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

export default Positions;

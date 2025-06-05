import React, { useEffect, useState } from "react";
import Header from "../partials/Header";
import Sidebar from "../partials/Sidebar";
import { useGetData } from "../utils/Requests/RequestService";
import AddAdminElement from "../components/AddAdminElement";
import SpinnerLoading from "../components/SpinnerLoading";
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

function CategoriesEvenements() {
  const element = "categories";
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [services, setServices] = useState([]);

  // Construire dynamiquement l'URL en fonction de l'existence de `filter`
  const queryParams = new URLSearchParams({
    keyword: keyword,
  }).toString();

  // Récupérer les données avec les paramètres de filtre conditionnels
  const { data, loading, error, fetchData } = useGetData(
    `categories/evenements?${queryParams}`
  );

  useEffect(() => {
    if (data) {
      setServices(data);
    }
    // console.log(services);
    // console.log(servicesCurrentIdInfo);
  }, [data]);

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
                    {/* Middle content */}
                    <div className="flex-1 md:ml-8 xl:mx-4 2xl:mx-8 ">
                      <div className="md:py-8">
                        {/* Forum Entries */}
                        <div className="space-y-2">
                          <AdminServicesListing
                            fetchData={fetchData}
                            element={element}
                            services={services}
                            setKeyword={setKeyword}
                            setFeedbackModalOpen={setFeedbackModalOpen}
                          />
                        </div>

                        {/* Pagination */}
                        <div className="mt-6 text-right"></div>
                      </div>
                    </div>
                  </div>

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

export default CategoriesEvenements;

import React, { useEffect, useState } from "react";
import Header from "../partials/Header";
import Sidebar from "../partials/Sidebar";
import { useGetData } from "../utils/Requests/RequestService";
import SpinnerLoading from "../components/SpinnerLoading";
import ManageRolesAndTypes from "../components/ManageRolesAndTypes";
import RolesAndTypesListing from "../components/RolesAndTypesListing";

function RolesTaches({endpoint, element}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [datasResult, setDatasResult] = useState([]);

  // Construire dynamiquement l'URL en fonction de l'existence de `filter`
  const queryParams = new URLSearchParams({
    keyword: keyword,
  }).toString();

  // Récupérer les données avec les paramètres de filtre conditionnels
  const { data, loading, error, fetchData } = useGetData(
    `${endpoint}/?${queryParams}`
  );

  useEffect(() => {
    if (data) {
      setDatasResult(data);
    }
    console.log(datasResult);
    // console.log(datasResultCurrentIdInfo);
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
                          <RolesAndTypesListing
                            fetchData={fetchData}
                            element={element}
                            datasResult={datasResult}
                            setKeyword={setKeyword}
                            setFeedbackModalOpen={setFeedbackModalOpen}
                          />
                        </div>

                        {/* Pagination */}
                        <div className="mt-6 text-right"></div>
                      </div>
                    </div>
                  </div>

                  <ManageRolesAndTypes
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

export default RolesTaches;

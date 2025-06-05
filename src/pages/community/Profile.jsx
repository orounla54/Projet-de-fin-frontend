import React, { useEffect, useState } from "react";

import Sidebar from "../../partials/Sidebar";
import Header from "../../partials/Header";
import ProfileSidebar from "../../partials/community/ProfileSidebar";
import ProfileBody from "../../partials/community/ProfileBody";
import { useParams } from "react-router-dom";
import { useGetData } from "../../utils/Requests/RequestService";
import SpinnerLoading from "../../components/SpinnerLoading";

const formatData = (data) => {
  return {
    ...data,
    responsablesAssocies: JSON.parse(data.responsablesAssocies || "[]"),
    responsableEvent: JSON.parse(data.responsableEvent || "{}"),
  };
};

function Profile() {
  const { pathname } = location;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileSidebarOpen, setProfileSidebarOpen] = useState(false);
  const [keyword, setKeyword] = useState("");

  const [event, setEvent] = useState({});
  const [responsableLog, setResponsableLog] = useState({});

  const { id } = useParams();

  // Récupérer l'enevenement
  const { data, loading, error, fetchData } = useGetData(
    id
      ? `${pathname.includes("/societe") ? "societe/" : ""}evenements/${id}`
      : ""
  );

  const {
    data: respo,
    loading: loadingRespo,
    error: errorRespo,
    fetchData: fetchReso,
  } = useGetData(`/responsables/log`);

  // Construire dynamiquement l'URL en fonction de l'existence de `filter`
  const queryParams = new URLSearchParams({
    keyword: keyword,
  }).toString();

  // Récupérer les données avec les paramètres de filtre conditionnels
  const {
    data: dataListe,
    loading: loadingListe,
    error: errorListe,
    fetchData: fetchDataListe,
  } = useGetData(`filter/evenements?${queryParams}`);

  //effectue la mise à jour de la page quand on a la data
  useEffect(() => {
    if (data) {
      // const formattedData = formatData(data);
      setEvent(data);
    }
    console.log(event);
  }, [data]);

  useEffect(() => {
    if (respo) {
      setResponsableLog(respo);
    }
    // console.log(responsableLog);
  }, [respo]);

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
          variant="v2"
        />

        <main className="relative grow">
          {loading || loadingListe || loadingRespo ? (
            <div className="absolute z-40 flex items-center justify-center w-full h-full bg-white dark:bg-gray-900">
              <SpinnerLoading />
            </div>
          ) : (
            <>
              <div
                className={`${!pathname.includes("/societe") ? "flex" : ""} `}
              >
                {/* Profile sidebar */}
                {!pathname.includes("/societe") && (
                  <>
                    <ProfileSidebar
                      setKeyword={setKeyword}
                      dataListe={dataListe}
                      loadingListe={loadingListe}
                      errorListe={errorListe}
                      event={event}
                      profileSidebarOpen={profileSidebarOpen}
                      setProfileSidebarOpen={setProfileSidebarOpen}
                    />
                  </>
                )}

                {/* Profile body */}
                <ProfileBody
                  profileSidebarOpen={profileSidebarOpen}
                  setProfileSidebarOpen={setProfileSidebarOpen}
                  event={event}
                  responsableEvent={event?.responsableEvent}
                  fetchData={fetchData}
                  fetchDataListe={fetchDataListe}
                  responsableLog={responsableLog}
                />
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default Profile;

import React, { useEffect, useState } from "react";

import Sidebar from "../../partials/Sidebar";
import Header from "../../partials/Header";
import SearchForm from "../../partials/actions/SearchForm";
import UsersTilesCard from "../../partials/community/UsersTilesCard";
import PaginationNumeric from "../../components/PaginationNumeric";

import { useGetData } from "../../utils/Requests/RequestService";
import SpinnerLoading from "../../components/SpinnerLoading";

// Fonction pour formater les données
const formatResponsableData = (data) => {
  return {
    ...data,
    positions: JSON.parse(data?.positions || "[]"),
    profiles: JSON.parse(data?.profiles || "[]"),
    postes: JSON.parse(data?.postes || "[]"),
    services: JSON.parse(data?.services || "[]"),
  };
};

function UsersTiles() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [responsables, setResponsables] = useState([]);
  const [keyword, setKeyword] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const [idService, setIdService] = useState();
  const [services, setServices] = useState([]);

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currents = responsables.slice(indexOfFirst, indexOfLast);

  // Construire dynamiquement l'URL en fonction de l'existence de `filter`
  const queryParams = new URLSearchParams({
    keyword: keyword,
    idService: idService ? idService : "",
  }).toString();

  // Récupérer les données avec les paramètres de filtre conditionnels
  const { data, loading, error, fetchData } = useGetData(
    `filter/responsables?${queryParams}`
  );

  useEffect(() => {
    if (data) {
      // const formattedData = data?.map((responsable) => {
      //   return formatResponsableData(responsable);
      // });
      setResponsables(data);
      console.log(data);
    }
  }, [data]);

  const {
    data: servicesData,
    loading: servicesLoading,
    error: servicesError,
  } = useGetData(`services/forUpdate`);
  useEffect(() => {
    if (servicesData) {
      setServices(servicesData);
    }
  }, [servicesData]);

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            {/* Page header */}
            <div className="sm:flex sm:justify-between sm:items-center mb-8">
              {/* Left: Title */}
              <div className="mb-4 sm:mb-0">
                <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
                  Responsables.
                </h1>
              </div>

              {/* Right: Actions */}
              <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                {/* Search form */}
                <SearchForm
                  fetchData={fetchData}
                  setKeyword={setKeyword}
                  placeholder="Recherche..."
                />
                <div className={``}>
                  <select
                    className={`form-input w-full`}
                    onChange={(e) => setIdService(e.target.value)}
                    value={idService} // Assurez-vous que `idService` est une variable d'état (useState)
                  >
                    <option value="">-- Sélectionnez un service --</option>
                    {services.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.libelle}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Cards */}
            {error ? (
              <p className="text-red-500 text-center text-xs">
                Error lors du chargement des données 😖:{error}
              </p>
            ) : loading ? (
              <div className="flex items-center justify-center">
                <SpinnerLoading />
              </div>
            ) : (
              <>
                {responsables && responsables.length > 0 ? (
                  <div className="grid grid-cols-12 gap-6">
                    {currents.map((item) => {
                      return (
                        <UsersTilesCard
                          item={item}
                          key={item.id}
                          id={item.id}
                          name={`${item.nom} ${item?.prenom || ""}`}
                          image={item.photoProfileLien}
                          service={item.services?.[0]}
                          position={item.positions?.[0]}
                          email={item.profiles?.[0]?.login}
                          poste={item.postes?.[0]}
                          fetchData={fetchData}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-center">
                    Aucun responsable trouvés🤷‍♂️...
                  </p>
                )}
              </>
            )}

            {/* Pagination */}
            {responsables && responsables.length > itemsPerPage ? (
              <>
                <div className="mt-6">
                  <PaginationNumeric
                    itemsPerPage={itemsPerPage}
                    totalItems={responsables.length}
                    paginate={paginate}
                    currentPage={currentPage}
                  />
                </div>
              </>
            ) : (
              ""
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default UsersTiles;

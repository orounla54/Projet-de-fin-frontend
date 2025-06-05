import React, { useEffect, useState } from "react";

import Sidebar from "../../partials/Sidebar";
import Header from "../../partials/Header";
import FilterButton from "../../components/DropdownFilter";
import CustomersTable from "../../partials/customers/CustomersTable";
import PaginationClassic from "../../components/PaginationClassic";
import { useGetData } from "../../utils/Requests/RequestService";
import SearchForm from "../../partials/actions/SearchForm";
import SpinnerLoading from "../../components/SpinnerLoading";
import DatePickerIDP from "../../components/DatePickerIDP";
import exportToExcel from "../../utils/DataFront/eventTypes";

function formatSollicitations(sollicitations) {
  const formateDate = (date) => {
    const inscriptionDate = new Date(date);
    const today = new Date();

    // Vérification si la date correspond à aujourd'hui
    const isToday =
      inscriptionDate.getDate() === today.getDate() &&
      inscriptionDate.getMonth() === today.getMonth() &&
      inscriptionDate.getFullYear() === today.getFullYear();

    if (isToday) {
      return `Aujourd'hui, ${inscriptionDate.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      })}`; // Affiche "Aujourd'hui, HH:mm"
    }

    // Sinon, formater avec la date et l'heure
    return inscriptionDate.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  return sollicitations.map((sollicitation) => ({
    ...sollicitation,
    dateInscription: formateDate(sollicitation.dateInscription),
    responsable: sollicitation.responsable,
  }));
}

function Customers() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sollicitations, setSollicitations] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [filter, setFilter] = useState(null);
  const [totalItems, setTotalItems] = useState(null);
  const [periode, setPeriode] = useState({
    // startDate: "",
    // endDate: "",
  });

  // Construire dynamiquement l'URL en fonction de l'existence de `filter`
  const queryParams = new URLSearchParams({
    keyword: keyword,
    ...(filter?.dateInscription && { dateInscription: filter.dateInscription }),
    ...(filter?.idStatus && { status: filter.idStatus }),
  }).toString();

  // Construire dynamiquement l'URL en fonction de l'existence de `filter`
  const queryParams1 = new URLSearchParams({
    keyword: keyword,
    periodeStart: (periode && periode.startDate ? periode.startDate : "") || "",
    periodeEnd: (periode && periode.endDate ? periode.endDate : "") || "",
  }).toString();

  // Récupérer les sollicitations
  const { data, loading, error, fetchData } = useGetData(
    filter
      ? `sollicitations/service?${queryParams}`
      : `sollicitations/service?${queryParams1}`
  );

  //effectue la mise à jour de la page quand on a la data
  useEffect(() => {
    if (data) {
      const dataFormated = formatSollicitations(data);
      setSollicitations(dataFormated);
    }
    console.log(sollicitations);
  }, [data]);

  useEffect(() => {
    setTotalItems(sollicitations.length);
  }, [sollicitations]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const current = sollicitations.slice(indexOfFirstItem, indexOfLastItem);

  //handleExport pour excel
  const handleExport = () => {
    exportToExcel(sollicitations, "Liste_de_Sollicitations.xlsx");
  };

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
              <div className="w-full py-8 mx-auto sm:px-6 lg:px-8 max-w-9xl">
                {/* Page header */}
                <div className="sm:flex sm:justify-between sm:items-center">
                  {/* Left: Title */}
                  <div className="mb-4 sm:mb-0">
                    <h1 className="text-2xl font-bold text-gray-800 md:text-3xl dark:text-gray-100">
                      Sollicitations de votre service
                    </h1>
                  </div>

                  {/* Right: Actions */}
                  <div className="grid justify-start grid-flow-col gap-2 sm:auto-cols-max sm:justify-end">
                    {/* Datepicker built with flatpickr */}
                    <DatePickerIDP
                      setPeriode={setPeriode}
                      periode={periode}
                      align="right"
                    />
                    {/* Filter button */}
                    <FilterButton
                      setFilter={setFilter}
                      filter={filter}
                      align="right"
                    />

                    <SearchForm
                      placeholder="Recherche..."
                      setKeyword={setKeyword}
                      fetchData={() => {}}
                    />
                  </div>
                </div>
                <div className="flex justify-end mb-4">
                  <button
                    onClick={(e) => {
                      handleExport();
                    }}
                    className="btn p-2.5 bg-white dark:bg-gray-800 border-gray-200 hover:border-gray-300 dark:border-gray-700/60 dark:hover:border-gray-600 text-gray-400 dark:text-gray-500"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-4"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.738 20.249a.75.75 0 0 1 .75-.75H14.99V5.56l-2.47 2.47a.75.75 0 0 1-1.06-1.061l3.75-3.75a.75.75 0 0 1 1.06 0l3.751 3.75a.75.75 0 0 1-1.06 1.06L16.49 5.56V20.25a.75.75 0 0 1-.75.75H4.487a.75.75 0 0 1-.75-.75Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>

                {/* Table */}
                <CustomersTable
                  fetchData={fetchData}
                  current={current}
                  sollicitations={sollicitations}
                />

                {/* Pagination */}
                <div className="mt-8">
                  {totalItems > 0 && (
                    <PaginationClassic
                      currentPage={currentPage}
                      itemsPerPage={itemsPerPage}
                      totalItems={totalItems}
                      paginate={handlePageChange}
                    />
                  )}
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default Customers;

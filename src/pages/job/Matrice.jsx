import React, { useEffect, useState } from "react";
import PaginationClassic from "../../components/PaginationClassic";
import SearchForm from "../../partials/actions/SearchForm";
import MatriceTable from "../../partials/finance/MatriceTable";
import { useGetData } from "../../utils/Requests/RequestService";
import DatePickerIDP from "../../components/DatePickerIDP";
import exportToExcel from "../../utils/DataFront/eventTypes";

const formatPriorites = (data) => {
  return data.map((priorite) => ({
    ...priorite,
    responsables: JSON.parse(priorite.responsables || "[]"), // Convertir en tableau d'objets
    services: JSON.parse(priorite.services || "[]"), // Convertir en tableau d'objets
  }));
};

function Matrice() {
  const [selectAll, setSelectAll] = useState(false);
  const [isCheck, setIsCheck] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [items, setItems] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [periode, setPeriode] = useState({
    // startDate: "",
    // endDate: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Construire dynamiquement l'URL en fonction de l'existence de `filter`
  const queryParams = new URLSearchParams({
    keyword: keyword,
    periodeStart: (periode && periode.startDate ? periode.startDate : "") || "",
    periodeEnd: (periode && periode.endDate ? periode.endDate : "") || "",
  }).toString();

  const { data, loading, error } = useGetData(
    `matrice/plansStrategiques?${queryParams}`
  );

  useEffect(() => {
    if (data) {
      setItems(formatPriorites(data));
      console.log(items);
    }
  }, [data]);

  // Calculer les indices pour la pagination
  const indexOfLastProject = currentPage * itemsPerPage;
  const indexOfFirstProject = indexOfLastProject - itemsPerPage;
  const currents = items.slice(indexOfFirstProject, indexOfLastProject);

  // Fonction de changement de page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSelectedItems = (selectedItems) => {
    setSelectedItems([...selectedItems]);
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    setIsCheck(!selectAll ? currents.map((item) => item.id) : []);
  };

  //handleExport pour excel
  const handleExport = () => {
    if (currents.length > 0) {
      exportToExcel(currents, "Matrice_Plan_Strategique.xlsx");
    }
  };

  return (
    <div className="w-full max-w-screen-lg px-1 py-8 mx-auto overflow-x-auto xl:max-w-screen-xl">
      {/* Page header */}
      <div className="mb-4 sm:flex sm:justify-between sm:items-center md:mb-2">
        {/* Left: Title */}
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl font-bold text-gray-800 md:text-3xl dark:text-gray-100">
            Matrice
          </h1>
        </div>

        {/* Right: Actions */}
        <div className="grid justify-start grid-flow-col gap-2 sm:auto-cols-max sm:justify-end">
          <div className="ml-2">
            <DatePickerIDP
              setPeriode={setPeriode}
              periode={periode}
              align="right"
            />
          </div>
          <div className="hidden sm:block">
            {/* Search form */}
            <SearchForm
              placeholder="Recherche..."
              setKeyword={setKeyword}
              fetchData={() => {}}
            />
          </div>

          {/* Export button */}
          <button
            onClick={() => handleExport()}
            className="text-gray-100 bg-gray-900 btn hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
          >
            Exporter
          </button>
        </div>
      </div>

      {/* Table */}
      <MatriceTable
        selectedItems={handleSelectedItems}
        handleSelectAll={handleSelectAll}
        selectAll={selectAll}
        isCheck={isCheck}
        setIsCheck={setIsCheck}
        setSelectAll={setSelectAll}
        items={currents}
        loading={loading}
        error={error}
      />

      {/* Pagination */}
      <div className="mt-8">
        {items.length > 0 && (
          <PaginationClassic
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalItems={items.length}
            paginate={paginate}
          />
        )}
      </div>
    </div>
  );
}

export default Matrice;

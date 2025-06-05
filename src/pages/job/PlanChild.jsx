import React, { useEffect, useState } from "react";
import { useGetData } from "../../utils/Requests/RequestService";
import DropdownSort from "../../components/DropdownSort";
import PaginationNumeric from "../../components/PaginationNumeric";
import NoDataResponse from "../../components/NoDataResponse";
import PlanListItem from "../../partials/job/PlanListItem";
import SpinnerLoading from "../../components/SpinnerLoading";
import ManageAxesStrategiqueToObjectifOpera from "../../components/ManageAxesStrategiqueToObjectifOpera";
import DangerModal from "../../components/DangerModal";
import ManagePriorite from "../../components/ManagePriorite";

function PlanChild({ element, page }) {
  const [child, setChild] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [croissant, seCroissant] = useState(false);
  const [itemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);

  const handleEndpoint = () => {
    if (page === "axesStrategiques") {
      return "objectifsStrategiques";
    } else if (page === "objectifsStrategiques") {
      return "mesuresStrategiques";
    } else if (page === "mesuresStrategiques") {
      return "objectifsOperationnels";
    } else if (page === "objectifsOperationnels") {
      return "priorites";
    } else {
      return "axesStrategiques";
    }
  };

  const handleIdEnpoint = () => {
    if (page === "axesStrategiques") {
      return "idAxe";
    } else if (page === "objectifsStrategiques") {
      return "idObjectifStrategique";
    } else if (page === "mesuresStrategiques") {
      return "idMesure";
    } else if (page === "objectifsOperationnels") {
      return "idObjectifOperationnel";
    } else {
      return "idPlanStrategique";
    }
  };

  const handleLabel = () => {
    if (page === "axesStrategiques") {
      return "Objectif strategique";
    } else if (page === "objectifsStrategiques") {
      return "Mesure Strategiques";
    } else if (page === "mesuresStrategiques") {
      return "Objectif operationnel";
    } else if (page === "objectifsOperationnels") {
      return "Prioritées";
    } else {
      return "Axe Strategique";
    }
  };

//   console.log(handleEndpoint());
  // Récupère les données via le hook personnalisé
  const { data, loading, error, fetchData } = useGetData(
    element
      ? `${handleEndpoint()}?${handleIdEnpoint()}=${
          element?.id
        }&keyword=${keyword}`
      : ""
  );

  useEffect(() => {
    if (data) {
      setChild(data);
    }
  }, [data]);

  useEffect(() => {
    console.log(child); // ✅ Maintenant, plans sera bien mis à jour avant d'être affiché
  }, [child]);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currents = child.slice(indexOfFirst, indexOfLast);

  return (
    <div className="w-full">
      <div className="flex justify-between gap-2 mb-5 xl:mt-6">
        <form className="relative w-4/5 ">
          <label htmlFor="job-search" className="sr-only">
            Search
          </label>
          <input
            id="job-search"
            className="w-full bg-white form-input pl-9 dark:bg-gray-800"
            type="search"
            onChange={(e) => setKeyword(e.target.value)}
            placeholder={`Rechercher le titre ou le mot-clé...`}
          />
          <button
            className="absolute inset-0 right-auto group"
            type="submit"
            aria-label="Search"
          >
            <svg
              className="ml-3 mr-2 text-gray-400 fill-current shrink-0 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400"
              width="16"
              height="16"
              viewBox="0 0 16 16"
            >
              <path d="M7 14c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zM7 2C4.243 2 2 4.243 2 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5z" />
              <path d="M15.707 14.293L13.314 11.9a8.019 8.019 0 01-1.414 1.414l2.393 2.393a.997.997 0 001.414 0 .999.999 0 000-1.414z" />
            </svg>
          </button>
        </form>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setFeedbackModalOpen(true);
          }}
          className="w-1/5 text-gray-100 bg-gray-900 btn hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
        >
          <svg
            className="fill-current shrink-0 xs:hidden"
            width="16"
            height="16"
            viewBox="0 0 16 16"
          >
            <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
          </svg>
          <span className="max-xs:sr-only">Ajouter</span>
        </button>
      </div>
      <div className="flex flex-wrap items-center justify-between mb-4">
        <div className="text-xs italic text-gray-500 dark:text-gray-400">
          {child.length} {handleLabel()} trouvé(e)s
        </div>
        {/* Sort */}
        <div className="text-xs">
          <span>Afficher par ordre </span>
          <DropdownSort
            croissant={croissant}
            seCroissant={seCroissant}
            fetchData={fetchData}
            align="right"
          />
        </div>
      </div>
      {/* Jobs list */}
      {loading ? (
        <SpinnerLoading />
      ) : (
        <>
          {error ? (
            <li className="p-2 text-red-500 dark:text-red-400">
              Une erreur s'est produite au niveau du serveur: {error.message}
            </li>
          ) : (
            <div className="">
              {Array.isArray(currents) && child.length > 0 ? (
                currents.map((item) => {
                  return (
                    <div className="relative group">
                      <div className="absolute transition-opacity duration-300 opacity-0 top-1 right-1 group-hover:opacity-100">
                        <DangerModal
                          refreshList={fetchData}
                          endpoint={handleEndpoint()}
                          idObjet={item?.id}
                          libelleObjet={item?.libelle}
                        />
                      </div>
                      <PlanListItem
                        link={false}
                        key={item.id}
                        id={item.id}
                        libelle={item.libelle}
                        description={item.description}
                        dateInscription={item.dateInscription}
                        type={item.type}
                        status={item.status}
                        new={item.new}
                        progress={item.progress}
                        page={page}
                        parent={
                          page === "axesStrategiques"
                            ? item.planStrategique
                            : page === "objectifsStrategiques"
                            ? item.axeStrategique
                            : page === "mesuresStrategiques"
                            ? item.objectifStrategique
                            : page === "objectifsOperationnels"
                            ? item.mesure
                            : ""
                        }
                      />
                    </div>
                  );
                })
              ) : (
                <>
                  {" "}
                  {/* Quand on a rien */}
                  <NoDataResponse keyword={keyword} />
                </>
              )}
            </div>
          )}
        </>
      )}
      {/* Pagination */}
      <div className="mt-6">
        {child.length > itemsPerPage && (
          <PaginationNumeric
            itemsPerPage={itemsPerPage}
            totalItems={child.length}
            paginate={paginate}
            currentPage={currentPage}
          />
        )}
      </div>
      {handleEndpoint() !== "priorites" ? (
        <ManageAxesStrategiqueToObjectifOpera
          fetchData={fetchData}
          feedbackModalOpen={feedbackModalOpen}
          setFeedbackModalOpen={setFeedbackModalOpen}
          element={handleEndpoint()}
          idParent={element?.id}
        />
      ) : (
        <ManagePriorite
          fetchData={fetchData}
          feedbackModalOpen={feedbackModalOpen}
          setFeedbackModalOpen={setFeedbackModalOpen}
          idObjectifOperationnel={element?.id}
        />
      )}
    </div>
  );
}

export default PlanChild;

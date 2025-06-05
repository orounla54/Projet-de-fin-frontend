import React, { useEffect, useState } from "react";
import { useGetData } from "../utils/Requests/RequestService";
import PreuvesImages from "./PreuvesImages";
import PreuvesDocuments from "./PreuvesDocuments";
import PreuvesAudios from "./PreuvesAudios";
import PreuvesVideos from "./PreuvesVideos";
import SpinnerLoading from "./SpinnerLoading";
import AddDocsToPreuves from "./formulaires/AddDocsToPreuves";

function PrioritesPreuvesDocuments({ preuve, page, priorite, responsableLog }) {
  const [docPreuves, setDocPreuves] = useState([]);
  const [videos, setVideos] = useState([]);
  const [images, setImages] = useState([]);
  const [audios, setAudios] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [affichage, setAffichage] = useState("");
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);

  const { data, loading, fetchData } = useGetData(
    preuve ? `preuves/${preuve?.id}/documents` : ""
  );

  useEffect(() => {
    if (data) {
      setDocPreuves(data);

      setVideos(data.filter((dat) => dat.typeFichier === "video"));
      setImages(data.filter((dat) => dat.typeFichier === "image"));
      setAudios(data.filter((dat) => dat.typeFichier === "audio"));
      setDocuments(data.filter((dat) => dat.typeFichier === "document"));
    }
  }, [data]);
  
  useEffect(() => {
console.log(docPreuves)
  }, [docPreuves]);

  const toggleView = () => {
    setAffichage((prev) => {
      switch (prev) {
        case "docs":
          return "image";
        case "image":
          return "audio";
        case "audio":
          return "video";
        case "video":
          return "";
        default:
          return "docs";
      }
    });
  };

  return (
    <div className="mt-6">
      {loading ? (
        <SpinnerLoading />
      ) : (
        <>
          {docPreuves.length > 0 && (
            <>
              {affichage === "docs" && (
                <PreuvesDocuments
                  page={page}
                  fetchData={fetchData}
                  documents={documents}
                  idResponsableLog={parseInt(responsableLog?.id)}
                />
              )}
              {affichage === "image" && (
                <PreuvesImages
                  page={page}
                  fetchData={fetchData}
                  images={images}
                  idResponsableLog={parseInt(responsableLog?.id)}
                />
              )}
              {affichage === "audio" && (
                <PreuvesAudios
                  page={page}
                  fetchData={fetchData}
                  audios={audios}
                  idResponsableLog={parseInt(responsableLog?.id)}
                />
              )}
              {affichage === "video" && (
                <PreuvesVideos
                  page={page}
                  fetchData={fetchData}
                  videos={videos}
                  idResponsableLog={parseInt(responsableLog?.id)}
                />
              )}

              <div className="flex justify-center mt-4">
                <button
                  onClick={toggleView}
                  className="inline-flex items-center justify-center text-xs font-medium leading-5 rounded-full px-2.5 py-0.5 border shadow-sm transition border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400"
                >
                  {affichage === ""
                    ? "Afficher les fichiers 📁"
                    : affichage === "docs"
                    ? "Afficher les images"
                    : affichage === "image"
                    ? "Afficher les audios"
                    : affichage === "audio"
                    ? "Afficher les vidéos"
                    : "Masquer les fichiers"}
                </button>{" "}
              </div>
            </>
          )}
        </>
      )}
      {priorite?.responsables.some(
        (responsable) =>
          parseInt(responsable.id) === parseInt(responsableLog?.id) &&
          page === "responsable"
      ) && (
        <div className="group">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setFeedbackModalOpen(true);
            }}
            className="flex items-center justify-center w-6 h-6 transition-opacity duration-300 bg-white border border-gray-200 rounded-full shadow-sm opacity-0 dark:bg-gray-800 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-violet-500 group-hover:opacity-100"
          >
            <span className="sr-only">Add Task</span>
            <svg
              className="fill-current"
              width="12"
              height="12"
              viewBox="0 0 16 16"
            >
              <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
            </svg>
          </button>
          <AddDocsToPreuves
            fetchData={fetchData}
            setFeedbackModalOpen={setFeedbackModalOpen}
            feedbackModalOpen={feedbackModalOpen}
            idPreuve={preuve.id}
          />
        </div>
      )}
    </div>
  );
}

export default PrioritesPreuvesDocuments;

import React, { useState } from "react";

import ModalImage from "../images/modal-image.jpg";
import ModalBlank from "./ModalBlank";
import DangerModal from "./DangerModal";

function ModalInfosDiscussion({
  newsModalOpen,
  discussion,
  setNewsModalOpen,
  medias,
  fetchData
}) {
  // État pour suivre le survol de chaque image individuellement
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className="relative">
      <div className="absolute z-60">
        <ModalBlank
          id="news-modal"
          modalOpen={newsModalOpen}
          setModalOpen={setNewsModalOpen}
        >
          <div className="relative">
            <img
              className="w-full"
              src={ModalImage}
              width="460"
              height="200"
              alt="New on Mosaic"
            />
            {/* Close button */}
            <button
              className="absolute top-0 right-0 mt-5 mr-5 text-gray-50 hover:text-white"
              onClick={(e) => {
                e.stopPropagation();
                setNewsModalOpen(false);
              }}
            >
              <div className="sr-only">Close</div>
              <svg
                className="fill-current"
                width="16"
                height="16"
                viewBox="0 0 16 16"
              >
                <path d="M7.95 6.536l4.242-4.243a1 1 0 111.415 1.414L9.364 7.95l4.243 4.242a1 1 0 11-1.415 1.415L7.95 9.364l-4.243 4.243a1 1 0 01-1.414-1.415L6.536 7.95 2.293 3.707a1 1 0 011.414-1.414L7.95 6.536z" />
              </svg>
            </button>
          </div>
          <div className="p-5">
            {/* Modal header */}
            <div className="mb-2">
              <div className="mb-3">
                <div className="btn-xs text-xs border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-gray-800 dark:text-gray-300 px-2.5 py-1 rounded-full shadow-none">
                  New on Mosaic
                </div>
              </div>
              <div className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                {discussion && discussion.libelle}💫.
              </div>
            </div>
            {/* Modal content */}
            <div className="mb-5 text-sm">
              <div className="space-y-2">
                <p className="">{discussion && discussion.description}.</p>
              </div>
            </div>
            {/* images */}
            {medias && medias.length > 0 ? (
              <>
                <div>
                  <div className="grid grid-cols-4 gap-2 my-6">
                    {medias.map((media, index) => (
                      <a
                        key={media.id}
                        className="relative block"
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                      >
                        {hoveredIndex === index && (
                          <div className="absolute right-0">
                            <DangerModal
                              endpoint="medias"
                              refreshList={fetchData}
                              idObjet={media.id}
                              libelleObjet={media.libelle}
                              discussionCurrent={discussion}
                            />
                          </div>
                        )}
                        {media.typeMedia === "image" ? (
                          <img
                            className="w-full rounded-sm"
                            src={media.lien}
                            width="203"
                            height="152"
                            alt={media.libelle}
                          />
                        ) : media.typeMedia === "video" ? (
                          <video
                            className="w-full rounded-sm"
                            src={media.lien}
                            width="203"
                            height="152"
                            alt={media.libelle}
                          />
                        ) : (
                          ""
                        )}
                      </a>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <></>
            )}
            {/* Modal footer */}
            <div className="flex flex-wrap justify-end space-x-2">
              <button
                className="text-gray-100 bg-gray-900 btn-sm hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
                onClick={(e) => {
                  e.stopPropagation();
                  setNewsModalOpen(false);
                }}
              >
                Cool
              </button>
            </div>
          </div>
        </ModalBlank>
      </div>
    </div>
  );
}

export default ModalInfosDiscussion;

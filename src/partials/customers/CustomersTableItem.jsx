import React, { useState } from "react";
import Avatar from "react-avatar";
import AddTacheToSollicitation from "../../components/AddTacheToSollicitation";

function CustomersTableItem(props, { fetchData }) {
  const [descriptionOpen, setDescriptionOpen] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);

  return (
    <>
      <tr>
        <td className="w-px py-3 first:pl-5 last:pr-5 whitespace-nowrap">
          <div className="relative flex items-center">
            <button className="flex items-center gap-0.5">
              {props?.new === 1 && (
                <>
                  <svg viewBox="0 0 20 20" fill="currentColor" className="size-4 fill-green-500">
                    <path d="M4.214 3.227a.75.75 0 0 0-1.156-.955 8.97 8.97 0 0 0-1.856 3.825.75.75 0 0 0 1.466.316 7.47 7.47 0 0 1 1.546-3.186ZM16.942 2.272a.75.75 0 0 0-1.157.955 7.47 7.47 0 0 1 1.547 3.186.75.75 0 0 0 1.466-.316 8.971 8.971 0 0 0-1.856-3.825Z" />
                    <path fillRule="evenodd" d="M10 2a6 6 0 0 0-6 6c0 1.887-.454 3.665-1.257 5.234a.75.75 0 0 0 .515 1.076 32.91 32.91 0 0 0 3.256.508 3.5 3.5 0 0 0 6.972 0 32.903 32.903 0 0 0 3.256-.508.75.75 0 0 0 .515-1.076A11.448 11.448 0 0 1 16 8a6 6 0 0 0-6-6Zm0 14.5a2 2 0 0 1-1.95-1.557 33.54 33.54 0 0 0 3.9 0A2 2 0 0 1 10 16.5Z" clipRule="evenodd" />
                  </svg>

                </>
              )}
              {props?.important === 1 && (
                <>
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-4 fill-yellow-500"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </>
              )}
              {props?.urgent === 1 && (
                <>
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-4 fill-orange-500"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18Zm1 5a1 1 0 1 0-2 0v4a1 1 0 1 0 2 0V8Zm-1 8.25a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </>
              )}
            </button>
          </div>
        </td>
        <td className="px-2 py-3 first:pl-5 last:pr-5 whitespace-nowrap">
          <div className="flex items-center">
            <div className="w-10 h-10 shrink-0 sm:mr-1 flex items-center">
              <Avatar
                src={props.image}
                name={`${props.name}`}
                round={true}
                size="28"
              />
            </div>
            <div className="text-sm font-medium text-gray-800 dark:text-gray-100 flex items-center">
              {props.name}
            </div>
          </div>
        </td>
        <td className="px-2 py-3 first:pl-5 last:pr-5 whitespace-nowrap">
          <div className="text-sm text-left">
            <a
              className="ml-1 text-sm font-medium whitespace-nowrap text-violet-500 dark:text-violet-300 hover:text-violet-600 dark:hover:text-violet-300"
              href={`mailto:${props.email || "#"}`}
            >
              {props.email}
            </a>
          </div>
        </td>
        <td className="px-2 py-3 first:pl-5 last:pr-5 whitespace-nowrap">
          <div className={`text-sm text-left `}>{props.libelle}</div>
        </td>
        <td className="px-2 py-3 first:pl-5 last:pr-5 whitespace-nowrap">
          <div className="text-center">
            {" "}
            <div
              className={`text-xs inline-flex font-medium rounded-full text-center px-2.5 py-1 ${props?.status === "Traitée"
                ? "bg-green-500/20 text-green-700"
                : props?.status === "En-cours de traitement"
                  ? "bg-yellow-500/20 text-yellow-700"
                  : "bg-violet-500/20 text-violet-700"
                }  shrink-0`}
            >
              {props?.status}
            </div>
          </div>
        </td>
        <td className="px-2 py-3 first:pl-5 last:pr-5 whitespace-nowrap">
          <div
            className={`font-medium text-xs text-left ${props.satisfaire ? "text-green-600" : "text-sky-600"
              } `}
          >
            {props.satisfaire ? "Satisfait" : "Pas encore satisfait"}
          </div>
        </td>
        <td className="px-2 py-3 first:pl-5 last:pr-5 whitespace-nowrap">
          <div className="text-xs font-medium text-left text-gray-400">
            {props.dateInscription ? props.dateInscription : "Aucune date"}
          </div>
        </td>
        <td className="w-px px-2 py-3 first:pl-5 last:pr-5 whitespace-nowrap">
          {/* Menu button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setFeedbackModalOpen(true);
            }}
            className="text-gray-400 rounded-full hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
          >
            <span className="sr-only">Menu</span>
            <svg className="w-8 h-8 fill-current" viewBox="0 0 32 32">
              <circle cx="16" cy="16" r="2" />
              <circle cx="10" cy="16" r="2" />
              <circle cx="22" cy="16" r="2" />
            </svg>
          </button>
        </td>
        <td className="w-px px-2 py-3 first:pl-5 last:pr-5 whitespace-nowrap">
          <div className="flex items-center">
            <button
              className={`text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 ${descriptionOpen && "rotate-180"
                }`}
              aria-expanded={descriptionOpen}
              onClick={() => setDescriptionOpen(!descriptionOpen)}
              aria-controls={`description-${props.id}`}
            >
              <span className="sr-only">Menu</span>
              <svg className="w-8 h-8 fill-current" viewBox="0 0 32 32">
                <path d="M16 20l-5.4-5.4 1.4-1.4 4 4 4-4 1.4 1.4z" />
              </svg>
            </button>
          </div>
        </td>
      </tr>
      <tr
        id={`description-${props.id}`}
        role="region"
        className={`${!descriptionOpen && "hidden"}`}
      >
        <td colSpan="11" className="px-2 py-3 first:pl-5 last:pr-5">
          <div className="flex items-center bg-gray-50 dark:bg-gray-950/[0.15] dark:text-gray-400 p-3 -mt-3">
            <div className="italic">
              {" "}
              {props?.description && (
                <div className="space-y-3">
                  <p className="mb-1 text-xs text-justify text-gray-700 dark:text-gray-400">
                    {props?.description.split("\n").map((paragraph, index) => (
                      <p key={index} className="mb-1">
                        {paragraph.trim()}
                      </p>
                    ))}
                  </p>
                </div>
              )}
            </div>
          </div>
        </td>
      </tr>
      <AddTacheToSollicitation
        feedbackModalOpen={feedbackModalOpen}
        setFeedbackModalOpen={setFeedbackModalOpen}
        sollicitation={props.sollicitation}
        fetchData={fetchData}
        tache={{}}
      />
    </>
  );
}

export default CustomersTableItem;

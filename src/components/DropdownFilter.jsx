import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form"; // Importation de useForm uniquement
import Transition from "../utils/Transition";

function DropdownFilter({ align, setFilter, filter, pageEvent }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { pathname } = location;


  const trigger = useRef(null);
  const dropdown = useRef(null);

  const idStatus = [
    { id: 1, name: "Non-démarré" },
    { id: 2, name: !pathname.includes("/sollicitations") ? "En-cours"  : "En-cours de traitement"},
    { id: 3, name: !pathname.includes("/sollicitations") ? "Terminé" :  "Traitée"},
  ];

  const methods = useForm({
    defaultValues: {
      dateInscription: "",
      datePriseDecision: "",
      dateDebut: "",
      dateFin: "",
      deadline: "",
      idStatus: "",
    },
  });

  const { handleSubmit, register, reset } = methods;

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  const clearFilters = () => {
    setFilter(null);
    reset(); // Réinitialisation des valeurs
  };

  const onSubmit = (data) => {
    console.log(data)
    setFilter(data);
  };

  return (
    <div className="relative inline-flex">
      <button
        ref={trigger}
        className="btn px-2.5 bg-white dark:bg-gray-800 border-gray-200 hover:border-gray-300 dark:border-gray-700/60 dark:hover:border-gray-600 text-gray-400 dark:text-gray-500"
        aria-haspopup="true"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-expanded={dropdownOpen}
      >
        <span className="sr-only">Filtres</span>
        <wbr />
        <svg
          className="fill-current"
          width="16"
          height="16"
          viewBox="0 0 16 16"
        >
          <path d="M0 3a1 1 0 0 1 1-1h14a1 1 0 1 1 0 2H1a1 1 0 0 1-1-1ZM3 8a1 1 0 0 1 1-1h8a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1ZM7 12a1 1 0 1 0 0 2h2a1 1 0 1 0 0-2H7Z" />
        </svg>
      </button>
      <Transition
        show={dropdownOpen}
        tag="div"
        className={`origin-top-right z-10 absolute top-full left-0 right-auto min-w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/60 pt-1.5 rounded-lg shadow-lg overflow-hidden mt-1 ${
          align === "right"
            ? "md:left-auto md:right-0"
            : "md:left-0 md:right-auto"
        }`}
        enter="transition ease-out duration-200 transform"
        enterStart="opacity-0 -translate-y-2"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-out duration-200"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
      >
        <div ref={dropdown}>
          <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase pt-1.5 pb-2 px-3">
            Filtres
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <ul className="mb-4">
              {!pathname.includes("/sollicitations") && (
                <>
                  <DateFilter
                    label="Date début"
                    name="dateDebut"
                    register={register}
                  />
                  <DateFilter
                    label="Date fin"
                    name="dateFin"
                    register={register}
                  />
                  <DateFilter
                    label="Date prise de décision"
                    name="datePriseDecision"
                    register={register}
                  />
                  <DateFilter
                    label="Deadline"
                    name="deadline"
                    register={register}
                  />
                </>
              )}
              <DateFilter
                label="Date d'ajout"
                name="dateInscription"
                register={register}
              />
              <li className="px-3 py-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Statut 
                </label>
                <select
                  className="w-full form-select dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600"
                  {...register("idStatus")}
                >
                  <option value="">Statuts</option>
                  {idStatus.map((status) => (
                    <option key={status.id} value={!pathname.includes("/sollicitations") ? status.id : status.name}>
                      {status.name}
                    </option>
                  ))}
                </select>
              </li>
            </ul>
            <div className="px-3 py-2 border-t dark:border-gray-600">
              <ul className="flex items-center justify-between">
                <li>
                  <button
                    type="button"
                    className="text-red-500 bg-white border-gray-200 btn-xs dark:bg-gray-800 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600"
                    onClick={() => clearFilters()}
                  >
                    Nettoyer
                  </button>
                </li>
                <li>
                  <button
                    type="submit"
                    onBlur={() => setDropdownOpen(false)}
                    className="text-gray-100 bg-gray-900 btn-xs hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
                  >
                    Appliquer
                  </button>
                </li>
              </ul>
            </div>
          </form>
        </div>
      </Transition>
    </div>
  );
}

export default DropdownFilter;

const DateFilter = ({ label, name, register }) => (
  <li className="px-3 py-1">
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
      {label}
    </label>
    <input
      name={name}
      type="date"
      className="w-full rounded-md form-input dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600"
      {...register(name)} // Utilisation de register passé par le parent
    />
  </li>
);

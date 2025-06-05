import React from "react";

function SectionProfiles({ poste, services, positions }) {
  return (
    <div>
      {" "}
      <section>
        <h2 className="mb-1 text-xl font-bold leading-snug text-gray-800 dark:text-gray-100">
          Poste actuel
        </h2>
        <div className="text-sm">
          Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
          officia deserunt mollit.
        </div>
        <div className="mt-5 space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-4">
          <div className="sm:w-1/3">
            <label className="block mb-1 text-sm font-medium" htmlFor="name">
              Poste
            </label>
            <input
              defaultValue={poste?.[0]?.libelle}
              id="name"
              className="w-full form-input"
              type="text"
              disabled
            />
          </div>          
          <div className="sm:w-1/3">
            <label className="block mb-1 text-sm font-medium" htmlFor="name">
              Service
            </label>
            <input
              defaultValue={services?.[0]?.libelle}
              id="name"
              className="w-full form-input"
              type="text"
              disabled
            />
          </div>          
          <div className="sm:w-1/3">
            <label className="block mb-1 text-sm font-medium" htmlFor="name">
              Position
            </label>
            <input
              defaultValue={positions?.[0]?.libelle}
              id="name"
              className="w-full form-input"
              type="text"
              disabled
            />
          </div>
        </div>
      </section>
    </div>
  );
}

export default SectionProfiles;

import React from 'react'

function SectionResponsable({infoResponsable}) {
    return (
        <div>
          {" "}
          <section>
            <h2 className="mb-1 text-xl font-bold leading-snug text-gray-800 dark:text-gray-100">
              Informations
            </h2>
            <div className="text-sm">
              Excepteur sint occaec at cupidatat non proident, sunt in culpa qui
              officia deserunt mollit.
            </div>
            <div className="mt-5 space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-4">
              <div className="sm:w-1/3">
                <label className="block mb-1 text-sm font-medium" htmlFor="name">
                  Nom
                </label>
                <input defaultValue={infoResponsable?.nom} id="name" className="w-full form-input" type="text" />
              </div>
              <div className="sm:w-1/3">
                <label
                  className="block mb-1 text-sm font-medium"
                  htmlFor="business-id"
                >
                 Prenom
                </label>
                <input defaultValue={infoResponsable?.prenom} id="business-id" className="w-full form-input" type="text" />
              </div>
              <div className="sm:w-1/3">
                <label
                  className="block mb-1 text-sm font-medium"
                  htmlFor="location"
                >
                  Poste inscrit
                </label>
                <input defaultValue={infoResponsable?.poste} id="location" className="w-full form-input" type="text" />
              </div>
            </div>
          </section>
        </div>
      );
}

export default SectionResponsable
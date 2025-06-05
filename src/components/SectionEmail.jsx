import React from "react";

function SectionEmail({profile}) {
  return (
    <>
      <section>
        <h2 className="mb-1 text-xl font-bold leading-snug text-gray-800 dark:text-gray-100">
          Email
        </h2>
        <div className="text-sm">
        Vous pouvez modifier votre adresse mail si vous le souhaitez.
        
        </div>
        <div className="flex flex-wrap mt-5">
          <div className="mr-2">
            <label className="sr-only" htmlFor="email">
              Email
            </label>
            <input disabled defaultValue={profile?.[0]?.login} id="email" className="form-input" type="email" />
          </div>
          <button className="text-gray-800 border-gray-200 btn dark:bg-gray-800 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 dark:text-gray-300">
            Changer
          </button>
        </div>
      </section>
    </>
  );
}

export default SectionEmail;

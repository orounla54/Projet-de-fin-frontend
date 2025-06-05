import React, { useEffect, useState } from "react";

import SectionProfiles from "../../components/SectionProfiles";
import Avatar from "react-avatar";
import SectionEmail from "../../components/SectionEmail";
import SectionResponsable from "../../components/SectionResponsable";
import PhotoProfileForms from "../../components/formulaires/PhotoProfileForms";

function AccountPanel({ responsableLog, fetchData }) {
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [profile, setProfile] = useState();
  const [services, setServices] = useState();
  const [postes, setPostes] = useState();
  const [positions, setPositions] = useState();
  const [infoResponsable, setInfoResponsable] = useState({});

  useEffect(() => {
    if (responsableLog) {
      setPostes(responsableLog.postes);
      setServices(responsableLog.services);
      setProfile(responsableLog.profiles);
      setPositions(responsableLog.positions);
      setInfoResponsable({
        id: responsableLog.id,
        nom: responsableLog.nom,
        prenom: responsableLog.prenom,
        poste: responsableLog.poste,
      });
    }
    // console.log(profile, services, postes, positions);
    // console.log(infoResponsable);
  }, [responsableLog]);

  return (
    <div className="grow">
      {/* Panel body */}
      <div className="p-6 space-y-6">
        <h2 className="mb-5 text-2xl font-bold text-gray-800 dark:text-gray-100">
          Mon profile
        </h2>
        {/* Picture */}

        <section>
          <div className="flex items-center">
            <div className="mr-4">
              {responsableLog && (
                <>
                  <Avatar
                    name={`${responsableLog.nom} ${responsableLog.prenom}`}
                    round={true}
                    src={responsableLog.photoProfileLien} // Le lien de l'image
                    size="80" // Taille de l'avatar
                  />
                </>
              )}
              <PhotoProfileForms
                id={responsableLog.id}
                setFeedbackModalOpen={setFeedbackModalOpen}
                feedbackModalOpen={feedbackModalOpen}
                fetchData={fetchData}
              />
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setFeedbackModalOpen(true);
              }}
              className="text-gray-800 border-gray-200 btn-sm dark:bg-gray-800 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 dark:text-gray-300"
            >
              Change
            </button>
          </div>
        </section>
        {/* Business Profile */}
        <SectionResponsable infoResponsable={infoResponsable} />

        <SectionProfiles
          poste={postes}
          services={services}
          positions={positions}
        />

        {/* Email */}
        <SectionEmail profile={profile} />
        {/* Password */}
        <section>
          <h2 className="mb-1 text-xl font-bold leading-snug text-gray-800 dark:text-gray-100">
            Mot de passe
          </h2>
          <div className="text-sm">
            Vous pouvez modifier votre mot de passe si vous le souhaitez.
          </div>
          <div className="mt-5">
            <button className="border-gray-200 shadow-sm btn dark:border-gray-700/60 text-violet-500">
              Faire un demande
            </button>
          </div>
        </section>
      </div>
      {/* Panel footer */}
      <footer>
        <div className="flex flex-col px-6 py-5 border-t border-gray-200 dark:border-gray-700/60">
          <div className="flex self-end">
            <button className="ml-3 text-gray-100 bg-gray-900 btn hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white">
              Enregister les modifications
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default AccountPanel;

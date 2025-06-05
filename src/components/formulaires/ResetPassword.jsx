import React, { useState } from "react";
import { baseURL } from "../../utils/DataFront/eventTypes";
import ModalBasic from "../ModalBasic";
import AuthService from "../../utils/Auth/AuthServices";
import axios from "axios";
import { useForm } from "react-hook-form";

function ResetPassword({ feedbackModalOpen, setFeedbackModalOpen }) {
  const baseUrl = baseURL;
  const [errorUpdatePassword, setErrorUpdatePassword] = useState("");
  const [responseUpdatePassword, setResponseUpdatePassword] = useState("");
  const [loading, setLoading] = useState(false);

  const methods = useForm({
    defaultValues: {
      oldPassword: "",
      password: "",
    },
  });
  const { handleSubmit, reset } = methods;

  // Fonction appelée lors de la soumission du formulaire
  const onSubmit = async (data) => {
    setLoading(true); // Active le chargement
    setErrorUpdatePassword(""); // Réinitialise les erreurs
    try {
      const accessToken = AuthService.getAccessToken();
      const response = await axios.post(
        `${baseUrl}/profiles/auth/updatePassword`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      reset(); // Réinitialise le formulaire
      setFeedbackModalOpen(false); // Ferme le modal après succès
      console.log("Mot de passe mis à jour avec succès.");
      fetchData();
    } catch (error) {
      // Gère les erreurs et affiche le message approprié
      const errorMessage =
        error.response && error.response.data
          ? error.response.data.message // Message d'erreur spécifique renvoyé par le serveur
          : "Erreur inattendue lors de la mise à jour du mot de passe. ";

      setErrorUpdatePassword(errorMessage);
    } finally {
      setLoading(false); // Désactive le chargement
    }
  };

  return (
    <div>
      <ModalBasic
        id="feedback-modal"
        modalOpen={feedbackModalOpen}
        setModalOpen={setFeedbackModalOpen}
        title="Modification du mot de passe"
      >
        {/* Formulaire de changement de mot de passe */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="px-5 py-4">
            <div className="text-sm">
              <div className="mb-3 font-medium text-gray-800 dark:text-gray-100">
                Changez votre mot de passe 🔐
              </div>

              <p className="text-xs text-center text-red-500">
                {errorUpdatePassword}
              </p>
              <p className="text-xs text-center text-red-500">
                {responseUpdatePassword}
              </p>
            </div>
            <div className="space-y-3">
              <div>
                <label
                  className="block mb-1 text-sm font-medium"
                  htmlFor="oldPassword"
                >
                  Ancien mot de passe <span className="text-red-500">*</span>
                </label>
                <input
                  id="oldPassword"
                  className="w-full px-2 py-1 form-input"
                  type="password"
                  {...methods.register("oldPassword", {
                    required: "L'ancien mot de passe est requis",
                    minLength: {
                      value: 8,
                      message: "Mot de passe trop court",
                    },
                  })}
                />
                {methods.formState.errors.oldPassword && (
                  <p className="mt-1 text-xs text-red-500">
                    {methods.formState.errors.oldPassword.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  className="block mb-1 text-sm font-medium"
                  htmlFor="password"
                >
                  Nouveau mot de passe <span className="text-red-500">*</span>
                </label>
                <input
                  id="password"
                  className="w-full px-2 py-1 form-input"
                  type="password"
                  {...methods.register("password", {
                    required: "Le nouveau mot de passe est requis",
                    minLength: {
                      value: 8,
                      message: "Mot de passe trop court",
                    },
                  })}
                />
                {methods.formState.errors.password && (
                  <p className="mt-1 text-xs text-red-500">
                    {methods.formState.errors.password.message}
                  </p>
                )}
              </div>
            </div>
          </div>
          {/* Footer du modal */}
          <div className="px-5 py-4 border-t border-gray-200 dark:border-gray-700/60">
            <div className="flex flex-wrap justify-end space-x-2">
              <button
                type="submit"
                className="text-gray-100 bg-gray-900 btn-sm hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
              >
                {loading ? (
                  <>
                    <SpinnerLoading />
                  </>
                ) : (
                  "Valider"
                )}
              </button>
            </div>
          </div>
        </form>
      </ModalBasic>
    </div>
  );
}

export default ResetPassword;

import React, { useState } from "react";
import { baseURL } from "../../utils/DataFront/eventTypes";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";

function ResetMotDePasse() {
  const { token } = useParams(); // Récupération du token depuis l'URL
  const navigate = useNavigate();

  const [msgErr, setMsgErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const { password, newPassword } = data;
    setMsg("");
    setMsgErr("");

    // Vérifications côté client
    if (password !== newPassword) {
      setMsgErr("Les deux mots de passe ne sont pas identiques.");
      return;
    }
    if (password.length < 8) {
      setMsgErr("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${baseURL}/profiles/reset-password/${token}`,
        { newPassword } // Envoi du token et du nouveau mot de passe
      );

      if (response.status === 200) {
        setMsg("Mot de passe réinitialisé avec succès !");
        setTimeout(() => navigate("/"), 2000); // Redirection après 2 secondes
      } else {
        setMsgErr("Échec de la réinitialisation du mot de passe.");
      }
    } catch (error) {
      setMsgErr(
        error.response?.data?.message || "Erreur lors de la réinitialisation."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-white dark:bg-gray-900">
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-full max-w-sm p-6 border-2 border-dashed rounded-lg border-violet-500">
          <h1 className="mb-6 text-2xl font-bold text-gray-800 dark:text-gray-100">
            Nouveau mot de passe
          </h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              {/* Mot de passe */}
              <div>
                <label
                  htmlFor="password"
                  className="block mb-1 text-sm font-medium"
                >
                  Nouveau mot de passe<span className="text-red-500"> *</span>
                </label>
                <input
                  id="password"
                  type="password"
                  className="w-full form-input"
                  placeholder="Entrez le nouveau mot de passe"
                  {...register("password", { required: "Ce champ est requis" })}
                />
                {errors.password && (
                  <span className="text-xs text-red-500">
                    {errors.password.message}
                  </span>
                )}
              </div>

              {/* Confirmation mot de passe */}
              <div>
                <label
                  htmlFor="newPassword"
                  className="block mb-1 text-sm font-medium"
                >
                  Confirmez le mot de passe
                  <span className="text-red-500"> *</span>
                </label>
                <input
                  id="newPassword"
                  type="password"
                  className="w-full form-input"
                  placeholder="Confirmez le mot de passe"
                  {...register("newPassword", {
                    required: "Ce champ est requis",
                  })}
                />
                {errors.newPassword && (
                  <span className="text-xs text-red-500">
                    {errors.newPassword.message}
                  </span>
                )}
              </div>
            </div>

            {/* Message d'erreur */}
            {msgErr && (
              <div className="my-4 text-xs text-center text-red-500">
                {msgErr}
              </div>
            )}

            {/* Bouton de validation */}
            <div className="flex items-center justify-start mt-6">
              {loading ? (
                <button
                  className="text-gray-100 bg-gray-900 btn hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white disabled:border-gray-200 dark:disabled:border-gray-700 disabled:bg-white dark:disabled:bg-gray-800 disabled:text-gray-300 dark:disabled:text-gray-600 disabled:cursor-not-allowed"
                  disabled
                >
                  <svg
                    className="fill-current animate-spin shrink-0"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 16a7.928 7.928 0 01-3.428-.77l.857-1.807A6.006 6.006 0 0014 8c0-3.309-2.691-6-6-6a6.006 6.006 0 00-5.422 8.572l-1.806.859A7.929 7.929 0 010 8c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
                  </svg>
                  <span className="ml-2">Chargement</span>
                </button>
              ) : (
                <button
                  type="submit"
                  className="text-gray-100 bg-gray-900 btn hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white "
                >
                  Valider{" "}
                </button>
              )}
            </div>

            {/* Message de succès */}
            {msg && (
              <div className="mt-4 text-xs text-center text-green-500">
                {msg}
              </div>
            )}
          </form>
        </div>
      </div>
    </main>
  );
}

export default ResetMotDePasse;

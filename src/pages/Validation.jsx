import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosConfig";
import { useAuth } from "../utils/Auth/AuthContext";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useLocation } from "react-router-dom";

function Validation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [msgErr, setMsgErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [userId, setUserId] = useState(null);

  // Récupérer l'ID de l'utilisateur depuis l'état de location
  useEffect(() => {
    if (location.state?.userId) {
      setUserId(location.state.userId);
    } else {
      // Si pas d'ID, rediriger vers la page d'inscription
      navigate("/profiles/nouveau");
    }
  }, [location, navigate]);

  // Redirection si déjà authentifié
  if (isAuthenticated) {
    navigate("/");
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    if (!userId) {
      setMsgErr("Erreur: ID utilisateur manquant. Veuillez recommencer l'inscription.");
      return;
    }

    try {
      setLoading(true);
      setMsgErr("");
      const response = await axiosInstance.post('/profiles/validation', {
        userId,
        code: data.code
      });
      if (response.status === 200) {
        setSuccess(true);
        // Attendre 2 secondes avant la redirection pour que l'utilisateur voie le message de succès
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (error) {
      console.error('Erreur lors de la validation:', error);
      setMsgErr(
        error?.response?.data?.message || "Erreur lors de la validation du compte."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-white dark:bg-gray-900">
      <div className="relative md:flex items-center justify-center">
        <div className="md:w-1/2">
          <div className="min-h-[100dvh] h-full flex flex-col after:flex-1">
            {/* Header */}
            <div className="flex-1">
              <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
                <Link className="block" to="/">
                  <svg className="fill-violet-500" width={32} height={32}>
                    <path d="M31.956 14.8C31.372 6.92 25.08.628 17.2.044V5.76a9.04 9.04 0 0 0 9.04 9.04h5.716ZM14.8 26.24v5.716C6.92 31.372.63 25.08.044 17.2H5.76a9.04 9.04 0 0 1 9.04 9.04Zm11.44-9.04h5.716c-.584 7.88-6.876 14.172-14.756 14.756V26.24a9.04 9.04 0 0 1 9.04-9.04ZM.044 14.8C.63 6.92 6.92.628 14.8.044V5.76a9.04 9.04 0 0 1-9.04 9.04H.044Z" />
                  </svg>
                </Link>
              </div>
            </div>

            <div className="max-w-sm mx-auto w-full px-4 py-8 border-violet-500 rounded-lg p-10 border-dashed border-2 outline-4">
              <h1 className="text-xl text-gray-800 dark:text-gray-100 font-bold mb-6 text-center">
                Code de validation 🔑!
              </h1>
              {success ? (
                <div className="text-center text-green-600 dark:text-green-400 mb-4">
                  Compte validé avec succès ! Redirection...
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="flex flex-col justify-center items-center"
                >
                  <div className="space-y-4 w-full">
                    <div>
                      <label
                        className="block text-xs font-medium mb-1"
                        htmlFor="code"
                      >
                        Veuillez entrer votre code de validation
                        <span className="text-red-500"> *</span>
                      </label>
                      <input
                        id="code"
                        className={`form-input w-full ${
                          errors.code ? "border border-red-500" : ""
                        }`}
                        placeholder="Entrez le code reçu"
                        {...register("code", { required: true })}
                      />
                      {errors.code && (
                        <span className="text-xs text-red-500">
                          Le code est requis
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-center my-2">
                    {msgErr && (
                      <span className="text-xs text-red-500">{msgErr}</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-6 w-full">
                    {loading ? (
                      <button
                        className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white disabled:border-gray-200 dark:disabled:border-gray-700 disabled:bg-white dark:disabled:bg-gray-800 disabled:text-gray-300 dark:disabled:text-gray-600 disabled:cursor-not-allowed w-full"
                        disabled
                      >
                        <svg
                          className="animate-spin fill-current shrink-0"
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                        >
                          <path d="M8 16a7.928 7.928 0 01-3.428-.77l.857-1.807A6.006 6.006 0 0014 8c0-3.309-2.691-6-6-6a6.006 6.006 0 00-5.422 8.572l-1.806.859A7.929 7.929 0 010 8c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
                        </svg>
                        <span className="ml-2">Validation en cours...</span>
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white w-full"
                      >
                        Valider
                      </button>
                    )}
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Validation;

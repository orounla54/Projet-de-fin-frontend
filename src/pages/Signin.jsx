import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../utils/Auth/AuthContext";
import { useSuccessMessage } from "../utils/SuccessContext";
import AuthService from "../utils/Auth/AuthServices";
import ModalBlank from "../components/ModalBlank";
import AuthImage from "../images/pexels-tima-miroshnichenko-5452188.jpg";

function Signin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showSuccessMessage } = useSuccessMessage();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setError("");
      const success = await login(data.email, data.password);
      if (success) {
        showSuccessMessage("Connexion réussie !");
        navigate("/");
      } else {
        setError("Email ou mot de passe incorrect");
      }
    } catch (err) {
      console.error("Erreur de connexion:", err);
      setError(
        err.response?.data?.message ||
        "Une erreur est survenue lors de la connexion. Veuillez réessayer."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="bg-white dark:bg-gray-900">
      <div className="relative md:flex">
        {/* Content */}
        <div className="md:w-1/2">
          <div className="min-h-[100dvh] h-full flex flex-col after:flex-1">
            {/* Header */}
            <div className="flex-1">
              <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <Link className="block" to="/">
                  <svg
                    className="fill-violet-500"
                    xmlns="http://www.w3.org/2000/svg"
                    width={32}
                    height={32}
                  >
                    <path d="M31.956 14.8C31.372 6.92 25.08.628 17.2.044V5.76a9.04 9.04 0 0 0 9.04 9.04h5.716ZM14.8 26.24v5.716C6.92 31.372.63 25.08.044 17.2H5.76a9.04 9.04 0 0 1 9.04 9.04Zm11.44-9.04h5.716c-.584 7.88-6.876 14.172-14.756 14.756V26.24a9.04 9.04 0 0 1 9.04-9.04ZM.044 14.8C.63 6.92 6.92.628 14.8.044V5.76a9.04 9.04 0 0 1-9.04 9.04H.044Z" />
                  </svg>
                </Link>
              </div>
            </div>

            <div className="w-full max-w-sm p-10 px-4 py-8 m-8 mx-auto ">
              <h1 className="mb-6 text-2xl font-bold text-gray-800 dark:text-gray-100">
                Connexion
              </h1>
              <p className="mb-4">
                Bienvenue sur{" "}
                <span className="font-semibold text-violet-500">
                  la page de connexion
                </span>
                , veillez remplie le formulaire pour vous connectez.
              </p>
              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="">
                <div className="my-2 space-y-3">
                  <div>
                    <label
                      className="block mb-1 text-sm font-medium "
                      htmlFor="email"
                    >
                      Email<span className="text-red-500"> *</span>
                    </label>
                    <input
                      id="email"
                      className={`w-full form-input ${errors.email ? "is-invalid" : ""}`}
                      placeholder="Entrez votre email"
                      type="email"
                      {...register("email", {
                        required: "L'email est requis",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Adresse email invalide",
                        },
                      })}
                    />
                    {errors.email && (
                      <div className="invalid-feedback">{errors.email.message}</div>
                    )}
                  </div>
                  <div>
                    <label
                      className="block mb-1 text-sm font-medium"
                      htmlFor="password"
                    >
                      Mot de passe<span className="text-red-500"> *</span>
                    </label>
                    <input
                      id="password"
                      className={`w-full form-input ${errors.password ? "is-invalid" : ""}`}
                      type="password"
                      autoComplete="on"
                      placeholder="Entrez votre mot de passe"
                      {...register("password", {
                        required: "Le mot de passe est requis",
                        minLength: {
                          value: 6,
                          message: "Le mot de passe doit contenir au moins 6 caractères",
                        },
                      })}
                    />
                    {errors.password && (
                      <div className="invalid-feedback">{errors.password.message}</div>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-center mb-2">
                  {error && (
                    <div className="text-xs text-red-500">{error}</div>
                  )}
                </div>
                <div className="mt-2">
                  <p className="text-sm sm:text-start">
                    Mot de passe oublier ?{" "}
                    <Link
                      to="/profiles/mot-de-passe-oublier"
                      className="text-violet-500 hover:underline"
                    >
                      Renitialiser le
                    </Link>
                  </p>
                </div>
                <div className="mt-2">
                  <p className="mt-2 text-sm sm:text-start">
                    Connecter vous par mail{" "}
                    <Link
                      to="/profiles/connexion"
                      className="text-violet-500 hover:underline"
                    >
                      Cliquez ici
                    </Link>
                  </p>
                </div>
                <div className="flex items-center mt-6 sm:justify-start">
                  <button
                    type="submit"
                    className="bg-white border-gray-200 btn dark:bg-gray-800 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <svg
                          className="fill-current animate-spin shrink-0"
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                        >
                          <path d="M8 16a7.928 7.928 0 01-3.428-.77l.857-1.807A6.006 6.006 0 0014 8c0-3.309-2.691-6-6-6a6.006 6.006 0 00-5.422 8.572l-1.806.859A7.929 7.929 0 010 8c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
                        </svg>
                      </>
                    ) : (
                      <div className="flex items-center gap-1">
                        Connexion
                        <svg
                          className="fill-current text-violet-500 shrink-0"
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                        >
                          <path d="M14.3 2.3L5 11.6 1.7 8.3c-.4-.4-1-.4-1.4 0-.4.4-.4 1 0 1.4l4 4c.2.2.4.3.7.3.3 0 .5-.1.7-.3l10-10c.4-.4.4-1 0-1.4-.4-.4-1-.4-1.4 0z" />
                        </svg>
                      </div>
                    )}
                  </button>
                </div>
              </form>
              <div className="pt-5 mt-6 border-t border-gray-100 dark:border-gray-700/60">
                <div className="text-sm">
                  Vous n'avez pas de compte ?
                  <Link
                    className="font-medium text-violet-500 hover:text-violet-600 dark:hover:text-violet-400"
                    to="/responsables/nouveau"
                  >
                    {" "}
                    Enregistrer vous
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Image */}
        <div
          className="absolute top-0 bottom-0 right-0 hidden md:block md:w-1/2"
          aria-hidden="true"
        >
          <img
            className="object-cover object-center w-full h-full"
            src={AuthImage}
            width="760"
            height="1024"
            alt="Authentication"
          />
        </div>
      </div>

      <ModalBlank
        id="info-modal"
        modalOpen={false}
        setModalOpen={() => {}}
      >
        <div className="flex p-5 space-x-4">
          {/* Icon */}
          <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full shrink-0 dark:bg-gray-700">
            <svg
              className="fill-current shrink-0 text-violet-500"
              width="16"
              height="16"
              viewBox="0 0 16 16"
            >
              <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm1 12H7V7h2v5zM8 6c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1z" />
            </svg>
          </div>
          {/* Content */}
          <div>
            {/* Modal header */}
            <div className="mb-2">
              <div className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                Votre profile n'a pas encore été valider 😖!!
              </div>
            </div>
            {/* Modal content */}
            <div className="text-center text-gray-600 dark:text-gray-400">
              <div className="mb-10 text-sm">
                <div className="space-y-1">
                  <p>
                    Votre connexion a échoué. Veuillez réessayer plus tard.
                  </p>
                </div>
              </div>
            </div>
            {/* Modal footer */}
            <div className="flex flex-wrap justify-end space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="text-gray-100 bg-gray-900 btn-sm hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      </ModalBlank>
    </main>
  );
}

export default Signin;

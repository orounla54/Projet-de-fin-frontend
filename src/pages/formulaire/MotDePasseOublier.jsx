import React, { useState } from "react";
import { baseURL } from "../../utils/DataFront/eventTypes";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";

function MotDePasseOublier({titre}) {
  const baseUrl = baseURL;
  const [msgErr, setMsgErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const { pathname } = location;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setMsg("");
    try {
      setLoading(true);
      if (pathname.includes("/profiles/connexion")) {
        const response = await axios.post(
          `${baseUrl}/profiles/connexion`,
          data
        );
        if (response.status === 200) {
          setMsg("Verifier votre boites mail vous connecter.");
        }
      } else {
        const response = await axios.post(
          `${baseUrl}/profiles/request-reset`,
          data
        );
        if (response.status === 200) {
          setMsg(
            "Verifier votre boites mail vous valider et ajouter un nouveau mot de passe."
          );
        }
      }
    } catch (error) {
      if (error.response) {
        setMsgErr(
          error?.response?.data?.message || "Erreur lors de la connexion."
        );
      } else {
        setMsgErr("Problème de connexion au serveur.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-white dark:bg-gray-900">
      <div className="relative items-center justify-center md:flex">
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

            <div className="w-full max-w-sm p-10 px-4 py-8 mx-auto border-2 border-dashed rounded-lg border-violet-500 outline-4">
              <h1 className="mb-6 text-2xl font-bold text-gray-800 dark:text-gray-100">
                {titre}
              </h1>
              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="">
                <div className="space-y-4">
                  <div>
                    <label
                      className="block mb-1 text-sm font-medium "
                      htmlFor="email"
                    >
                      Email<span className="text-red-500"> *</span>
                    </label>
                    <input
                      id="login"
                      className="w-full form-input"
                      placeholder="Veillez entrer votre adresse email"
                      {...register("email", { required: true })}
                    />
                    {errors.email && (
                      <span className="text-xs text-red-500">
                        Ce champ est requis
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-center my-2">
                  {msgErr ? (
                    <span className="text-xs text-red-500">{msgErr}</span>
                  ) : null}
                </div>
                <div className="flex items-center justify-end mt-6">
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
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default MotDePasseOublier;

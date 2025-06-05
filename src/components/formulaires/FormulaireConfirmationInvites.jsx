import React, { useEffect, useState } from "react";
import { useForm, FormProvider, set } from "react-hook-form";
import { Link, useParams } from "react-router-dom";
import AuthImage from "../../images/pexels-anthonyshkraba-production-8837549.jpg";
import { baseUrlInvitations } from "../../utils/DataFront/eventTypes";
import axios from "axios";

function FormulaireConfirmationInvites() {
  const baseUrl = baseUrlInvitations;
  const { id, libelle } = useParams();

  const methods = useForm({
    defaultValues: {
      nom: "",
      prenom: "",
      email: "",
      email_secondaire: "",
      numero: "",
      numero_secondaire: "",
      societe: "",
      fonction: "",
      mailAutorisation: false,
      idEvenement: id || "",
      evenement: libelle || "",
    },
  });

  const { handleSubmit, register } = methods;

  const [msgError, setMsgError] = useState("");
  const [msgSuccess, setMsgSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [invitationGreat, setInvitationGreat] = useState(false);

  // const { register, handleSubmit, formState: { methods.formState.errors }, reset } = useForm();
  const [toggleMailAutorisation, setToggleMailAutorisation] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Créer une copie de data avec les champs formatés
      const baseDataObject = {
        ...data,
        idEvenement: parseInt(id, 10),
        mailAutorisation: toggleMailAutorisation,
      };
      console.log("Données soumises :", baseDataObject);

      // Ajoute ici l'appel API si nécessaire
      const response = await axios.post(
        `${baseUrl}/evenementsInviter`,
        baseDataObject
      );
      if (response.status === 201) {
        const { message } = response.data;
        setInvitationGreat(true);
        setMsgError("");
        setMsgSuccess(message);
      }
    } catch (error) {
      // Gère les erreurs et affiche le message approprié
      const errorMessage =
        error.response && error.response.data
          ? error.response.data.message // Message d'erreur spécifique renvoyé par le serveur
          : "Erreur inattendue lors de l'ajout ou la modification de la sollicitation";
      setMsgError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-white dark:bg-gray-900">
      <div className="relative md:flex">
        {/* Content */}
        <div className="md:w-2/3">
          <div className="min-h-[100dvh] h-full flex flex-col after:flex-1">
            {/* Header */}
            <div className="flex-1">
              <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <Link className="block" to="/">
                  <svg className="fill-violet-500" width={32} height={32}>
                    <path d="M31.956 14.8C31.372 6.92 25.08.628 17.2.044V5.76a9.04 9.04 0 0 0 9.04 9.04h5.716ZM14.8 26.24v5.716C6.92 31.372.63 25.08.044 17.2H5.76a9.04 9.04 0 0 1 9.04 9.04Zm11.44-9.04h5.716c-.584 7.88-6.876 14.172-14.756 14.756V26.24a9.04 9.04 0 0 1 9.04-9.04ZM.044 14.8C.63 6.92 6.92.628 14.8.044V5.76a9.04 9.04 0 0 1-9.04 9.04H.044Z" />
                  </svg>
                </Link>
              </div>
            </div>

            <div className="w-full max-w-2xl px-4 py-8 mx-auto">
              <h1 className="mb-6 text-3xl font-bold text-gray-800 dark:text-gray-100">
                {invitationGreat ? (
                  <span className="flex gap-1">
                    Presence déjà confirmer à cet evenement{" "}
                    <svg
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="size-5 fill-green-400"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.403 12.652a3 3 0 0 0 0-5.304 3 3 0 0 0-3.75-3.751 3 3 0 0 0-5.305 0 3 3 0 0 0-3.751 3.75 3 3 0 0 0 0 5.305 3 3 0 0 0 3.75 3.751 3 3 0 0 0 5.305 0 3 3 0 0 0 3.751-3.75Zm-2.546-4.46a.75.75 0 0 0-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                ) : (
                  "Formulaire de confirmation"
                )}
              </h1>
              {!invitationGreat && (
                <p className="mb-4">
                  Vous etes convier à l'évènement{" "}
                  <span className="font-semibold text-violet-500">
                    {libelle}
                  </span>
                  , veillez remplie le formulaire ci pour confirmer votre
                  presence. Merci
                </p>
              )}
              {!invitationGreat ? (
                <>
                  {/* Form */}
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-3">
                      {/* Nom & Prénom */}
                      <div className="flex gap-2">
                        <div className="relative w-1/3">
                          <label className="block mb-1 text-sm font-medium">
                            Nom <span className="text-red-500">*</span>
                          </label>
                          <input
                            {...register("nom", {
                              required: "Ce champ est requis",
                            })}
                            className={`form-input w-full ${
                              methods.formState.errors.nom
                                ? "border border-red-500"
                                : ""
                            }`}
                            type="text"
                            placeholder="Nom"
                          />
                          {methods.formState.errors.nom && (
                            <p className="text-xs text-red-500">
                              {methods.formState.errors.nom.message}
                            </p>
                          )}
                        </div>

                        <div className="relative w-2/3">
                          <label className="block mb-1 text-sm font-medium">
                            Prénom <span className="text-red-500">*</span>
                          </label>
                          <input
                            {...register("prenom", {
                              required: "Ce champ est requis",
                            })}
                            className={`form-input w-full ${
                              methods.formState.errors.prenom
                                ? "border border-red-500"
                                : ""
                            }`}
                            type="text"
                            placeholder="Prénom"
                          />
                          {methods.formState.errors.prenom && (
                            <p className="text-xs text-red-500">
                              {methods.formState.errors.prenom.message}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Email & Email secondaire */}
                      <div className="flex gap-2">
                        <div className="relative w-1/2">
                          <label className="block mb-1 text-sm font-medium">
                            Email <span className="text-red-500">*</span>
                          </label>
                          <input
                            {...register("email", {
                              required: "Ce champ est requis",
                              pattern: {
                                value: /^\S+@\S+$/,
                                message: "Email invalide",
                              },
                            })}
                            className={`form-input w-full ${
                              methods.formState.errors.email
                                ? "border border-red-500"
                                : ""
                            }`}
                            type="email"
                            placeholder="Email"
                          />
                          {methods.formState.errors.email && (
                            <p className="text-xs text-red-500">
                              {methods.formState.errors.email.message}
                            </p>
                          )}
                        </div>

                        <div className="relative w-1/2">
                          <label className="block mb-1 text-sm font-medium">
                            Email secondaire
                          </label>
                          <input
                            {...register("email_secondaire")}
                            className="w-full form-input"
                            type="email"
                            placeholder="Email secondaire"
                          />
                        </div>
                      </div>

                      {/* Numéro & Numéro secondaire */}
                      <div className="flex gap-2">
                        <div className="relative w-1/2">
                          <label className="block mb-1 text-sm font-medium">
                            Numéro <span className="text-red-500">*</span>
                          </label>
                          <input
                            {...register("numero", {
                              required: "Ce champ est requis",
                            })}
                            className={`form-input w-full ${
                              methods.formState.errors.numero
                                ? "border border-red-500"
                                : ""
                            }`}
                            type="text"
                            placeholder="Numéro de téléphone"
                          />
                          {methods.formState.errors.numero && (
                            <p className="text-xs text-red-500">
                              {methods.formState.errors.numero.message}
                            </p>
                          )}
                        </div>

                        <div className="relative w-1/2">
                          <label className="block mb-1 text-sm font-medium">
                            Numéro secondaire
                          </label>
                          <input
                            {...register("numero_secondaire")}
                            className="w-full form-input"
                            type="text"
                            placeholder="Numéro secondaire"
                          />
                        </div>
                      </div>

                      {/* Société & Fonction */}
                      <div className="flex gap-2">
                        <div className="relative w-1/2">
                          <label className="block mb-1 text-sm font-medium">
                            Société <span className="text-red-500">*</span>
                          </label>
                          <input
                            {...register("societe", {
                              required: "Ce champ est requis",
                            })}
                            className={`form-input w-full ${
                              methods.formState.errors.societe
                                ? "border border-red-500"
                                : ""
                            }`}
                            type="text"
                            placeholder="Nom de la société"
                          />
                          {methods.formState.errors.societe && (
                            <p className="text-xs text-red-500">
                              {methods.formState.errors.societe.message}
                            </p>
                          )}
                        </div>

                        <div className="relative w-1/2">
                          <label className="block mb-1 text-sm font-medium">
                            Fonction <span className="text-red-500">*</span>
                          </label>
                          <input
                            {...register("fonction", {
                              required: "Ce champ est requis",
                            })}
                            className={`form-input w-full ${
                              methods.formState.errors.fonction
                                ? "border border-red-500"
                                : ""
                            }`}
                            type="text"
                            placeholder="Fonction dans la societe"
                          />
                          {methods.formState.errors.fonction && (
                            <p className="text-xs text-red-500">
                              {methods.formState.errors.fonction.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="my-3 text-xs text-center text-red-500">
                      {!msgError && <span>{msgError}</span>}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="mr-1">
                        {/* Mail d'autorisation */}
                        <label className="flex items-center gap-1 justify-evenly">
                          <div className="form-switch">
                            <input
                              type="checkbox"
                              id="switch-mail"
                              className="sr-only"
                              checked={toggleMailAutorisation}
                              {...register("mailAutorisation")}
                              onChange={() =>
                                setToggleMailAutorisation(
                                  !toggleMailAutorisation
                                )
                              }
                            />
                            <label
                              className="bg-gray-400 dark:bg-gray-700"
                              htmlFor="switch-mail"
                            >
                              <span
                                className="bg-white shadow-sm"
                                aria-hidden="true"
                              ></span>
                            </label>
                          </div>
                          <span className="text-xs -2">
                            Autorisez-vous à recevoir des emails pour un futur
                            événement similaire ?
                          </span>
                        </label>
                      </div>
                      <button
                        type="submit"
                        className="bg-white border-gray-200 btn dark:bg-gray-800 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600"
                      >
                        {loading ? (
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
                            Soumettre
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
                </>
              ) : (
                <>
                  <div className="w-full px-4 py-8 mx-auto sm:px-6 lg:px-8 max-w-9xl">
                    <div className="max-w-2xl m-auto mt-16">
                      <div className="px-4 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-gradient-to-t from-gray-200 to-gray-100 dark:from-gray-700 dark:to-gray-800">
                          <svg
                            className="w-5 h-6 fill-current"
                            viewBox="0 0 20 24"
                          >
                            <path
                              className="text-violet-500 dark:text-violet-600"
                              d="M10 10.562l9-5-8.514-4.73a1 1 0 00-.972 0L1 5.562l9 5z"
                            />
                            <path
                              className="text-violet-300 dark:text-violet-400"
                              d="M9 12.294l-9-5v10.412a1 1 0 00.514.874L9 23.294v-11z"
                            />
                            <path
                              className="text-violet-400 dark:text-violet-500"
                              d="M11 12.294v11l8.486-4.714a1 1 0 00.514-.874V7.295l-9 4.999z"
                            />
                          </svg>
                        </div>
                        <>
                          <h2 className="mb-2 text-xl font-bold text-gray-800 dark:text-gray-100">
                            Presence confirmer à l'evenement
                          </h2>
                          <p className="text-center text-gray-600 dark:text-gray-400">
                            {msgSuccess}
                          </p>
                        </>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Image */}
        <div
          className="absolute top-0 bottom-0 right-0 hidden md:block md:w-1/3"
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
    </main>
  );
}

export default FormulaireConfirmationInvites;

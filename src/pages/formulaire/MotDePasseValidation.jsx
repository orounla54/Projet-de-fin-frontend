import React, { useEffect, useState } from "react";
import { baseURL } from "../../utils/DataFront/eventTypes";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import SpinnerLoading from "../../components/SpinnerLoading";
import { useAuth } from "../../utils/Auth/AuthContext";

function MotDePasseValidation() {
  const baseUrl = baseURL;
  const [msgErr, setMsgErr] = useState("");
  const [loading, setLoading] = useState(false);

  const { id, token } = useParams();
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuth();

  useEffect(() => {
    const validateToken = async () => {
      setLoading(true);
      try {
        if (id && !token) {
          const response = await axios.get(
            `${baseUrl}/profiles/validate-reset/${token}`
          );
          if (response.status === 200) {
            setMsgErr("Le token est valide. Redirection...");
            setTimeout(
              () => navigate(`/profiles/reset-mot-de-passe/${token}`),
              2000
            ); // Redirection différée
          }
        } else {
          const response = await axios.get(
            `${baseUrl}/profiles/${id}/connexion/${token}`
          );
          if (response.status === 200) {
            const { accessToken } = response.data;
            localStorage.setItem("accessToken", accessToken); // Stockage du token d'accès
            setIsAuthenticated(true);
            setMsgErr("Le token est valide. Redirection...");
            setTimeout(() => navigate(`/`), 2000); // Redirection différée
          }
        }
      } catch (error) {
        setMsgErr(
          error.response?.data?.message ||
            "Erreur lors de la validation du token."
        );
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, [token, navigate, baseUrl]);

  return (
    <main className="bg-white dark:bg-gray-900">
      <div className="relative items-center justify-center md:flex">
        <div className="md:w-1/2">
          <div className="flex flex-col h-full min-h-screen">
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

            <div className="w-full max-w-sm p-10 px-4 py-8 mx-auto border-2 border-dashed rounded-lg mb-96 border-violet-500 outline-4">
              <h1 className="mb-6 text-3xl font-bold text-center text-gray-800 dark:text-gray-100">
                Vérification
              </h1>
              <div className="relative">
                {loading ? (
                  <div className="absolute z-40 flex items-center justify-center w-full h-full bg-white dark:bg-gray-800">
                    <SpinnerLoading />
                  </div>
                ) : (
                  <p
                    className={`text-lg text-center ${
                      msgErr.includes("invalide")
                        ? "text-red-500"
                        : "text-green-500"
                    }`}
                  >
                    {msgErr}
                    {msgErr.includes("invalide") ? " 😣" : " 💫"}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default MotDePasseValidation;

import React from "react";

import UserImage from "../../images/user-64-14.jpg";
import FintechIcon01 from "../../images/company-icon-06.svg";
import FintechIcon02 from "../../images/company-icon-02.svg";
import FintechIcon03 from "../../images/company-icon-03.svg";
import Avatar from "react-avatar";
import SpinnerLoading from "../../components/SpinnerLoading";

function FintechIntro({
  responsable,
  responsableError,
  responsableLoading,
  pointsIDP,
  pourcentageIDP,
  totalTacheIDP,
  totalTacheEnd,
}) {
  return (
    <div className="flex flex-col bg-white shadow-sm col-span-full dark:bg-gray-800 rounded-xl">
      <div className="px-5 py-6">
        <div className="md:flex md:justify-between md:items-center">
          {/* Left side */}
          <div className="flex items-center mb-4 md:mb-0">
            {/* Avatar */}
            {responsableError && (
              <p className="text-xs text-red-400">
                Erreur lors de la recuperation du responsable
              </p>
            )}
            <div className="relative z-10 mr-2">
              {responsableLoading && (
                <div className="absolute top-2 right-2 left-2 bottom-2">
                  <SpinnerLoading />
                </div>
              )}
              {responsable && (
                <Avatar
                  name={`${responsable.nom} ${responsable.prenom}`}
                  round={true}
                  size="47"
                  src={responsable.photoProfileLien}
                />
              )}
            </div>
            {/* User info */}
            <div>
              <div className="mb-2 text-sm">
                Salut{" "}
                <strong className="font-medium text-gray-800 dark:text-gray-100">
                  {" "}
                  {responsable && (
                    <>
                      {responsable.nom} {responsable.prenom}
                    </>
                  )}{" "}
                </strong>{" "}
                👋, Bienvenue sur votre dashboard responsable:
              </div>
              <div>
                <div className="text-xl font-bold">
                  <span>{totalTacheEnd}</span>/<span>{totalTacheIDP}</span>
                </div>
                <div className="w-1/3">
                  <input
                    className={`w-full h-2 rounded-lg appearance-none focus:outline-none focus:ring-2 ${
                      pourcentageIDP >= 55
                        ? "focus:ring-green-400"
                        : pourcentageIDP >= 45
                        ? "focus:ring-yellow-200"
                        : pourcentageIDP >= 25
                        ? "focus:ring-orange-500"
                        : "focus:ring-red-500"
                    } `}
                    type="range"
                    value={pourcentageIDP > 0 ? pourcentageIDP : 0}
                    min="0"
                    max="100"
                    style={{
                      background: `linear-gradient(to right,${
                        pourcentageIDP >= 55
                          ? "#00CC00"
                          : pourcentageIDP >= 45
                          ? "#FAE418"
                          : pourcentageIDP >= 25
                          ? "#FF8000"
                          : "#FF6012"
                      } ${
                        pourcentageIDP > 0 ? pourcentageIDP : "0"
                      }%, #e5e7eb ${
                        pourcentageIDP > 0 ? pourcentageIDP : "0"
                      }%)`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          {/* Right side */}
          <ul className="relative flex flex-wrap justify-end -ml-px -space-x-3 shrink-0 md:justify-start">
            {pointsIDP && pointsIDP > 35 ? (
              <>
                <li>
                  <a className="block" href="#0">
                    <img
                      className="rounded-full w-9 h-9"
                      src={FintechIcon01}
                      width="36"
                      height="36"
                      alt="Account 01"
                    />
                  </a>
                </li>
              </>
            ) : pointsIDP > 45 ? (
              <>
                <li>
                  <a className="block" href="#0">
                    <img
                      className="rounded-full w-9 h-9"
                      src={FintechIcon01}
                      width="36"
                      height="36"
                      alt="Account 01"
                    />
                  </a>
                </li>
                <li>
                  <a className="block" href="#0">
                    <img
                      className="rounded-full w-9 h-9"
                      src={FintechIcon02}
                      width="36"
                      height="36"
                      alt="Account 02"
                    />
                  </a>
                </li>
              </>
            ) : pointsIDP > 75 ? (
              <>
                <li>
                  <a className="block" href="#0">
                    <img
                      className="rounded-full w-9 h-9"
                      src={FintechIcon01}
                      width="36"
                      height="36"
                      alt="Account 01"
                    />
                  </a>
                </li>
                <li>
                  <a className="block" href="#0">
                    <img
                      className="rounded-full w-9 h-9"
                      src={FintechIcon02}
                      width="36"
                      height="36"
                      alt="Account 02"
                    />
                  </a>
                </li>
                <li>
                  <a className="block" href="#0">
                    <img
                      className="rounded-full w-9 h-9"
                      src={FintechIcon03}
                      width="36"
                      height="36"
                      alt="Account 03"
                    />
                  </a>
                </li>

                <li className="absolute -top-4 -right-1">✨</li>
              </>
            ) : (
              <></>
            )}
          </ul>
          <div>
            <span className="text-xl font-bold text-violet-400">
              {pointsIDP ? pointsIDP.toFixed(2) : "0.00"}
            </span>
            <span className="font-bold "> pts</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FintechIntro;

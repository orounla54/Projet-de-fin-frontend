import React, { useState } from "react";
import { Link } from "react-router-dom";

import Sidebar from "../../partials/Sidebar";
import Header from "../../partials/Header";

import NotFoundImage from "../../images/404-illustration.svg";
import NotFoundImageDark from "../../images/404-illustration-dark.svg";
import { useAuth } from "../../utils/Auth/AuthContext";

function PageNotFound() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      {/* Sidebar */}
      {isAuthenticated ? (
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          variant="v2"
        />
      ) : (
        ""
      )}

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden bg-white dark:bg-gray-900">
        {/*  Site header */}
        {isAuthenticated ? (
          <Header
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          variant="v3"
        />
        ) : (
          ""
        )}

        <main className="grow flex items-center justify-center">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <div className="max-w-2xl m-auto mt-16">
              <div className="text-center px-4">
                <div className="inline-flex mb-8">
                  <img
                    className="dark:hidden"
                    src={NotFoundImage}
                    width="176"
                    height="176"
                    alt="404 illustration"
                  />
                  <img
                    className="hidden dark:block"
                    src={NotFoundImageDark}
                    width="176"
                    height="176"
                    alt="404 illustration dark"
                  />
                </div>
                <div className="mb-6">
                  Hmm... La page à la quelle vous voulez acceder n'existe pas <br />
                  Dirigez vous vers la page d'accueil
                </div>
                <Link
                  to="/"
                  className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
                >
                  Page d'accueil
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default PageNotFound;

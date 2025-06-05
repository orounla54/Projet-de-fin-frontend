import React, { useState } from "react";
import DiscussionsTache from "../components/DiscussionsTache";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";

function DiscussionsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex h-[100dvh] overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-x-hidden overflow-y-auto">
        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="w-full px-4 py-8 mx-auto sm:px-6 lg:px-8 max-w-9xl">
            <DiscussionsTache sizeTitle />
          </div>
        </main>
      </div>
    </div>
  );
}

export default DiscussionsPage;

import React from "react";
import { Outlet } from "react-router-dom";
import { SidebarLayout } from "./layout/SidebarLayout";

const AuthenticatedLayout: React.FC = () => {
  const subscriptions = [
    { name: "Abonnement Basic", storageLimit: 100 },
    { name: "Abonnement Pro", storageLimit: 500 },
  ];
  const totalStorage = 600;
  const usedStorage = 150;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SidebarLayout
        subscriptions={subscriptions}
        totalStorage={totalStorage}
        usedStorage={usedStorage}
      />
      <main className="flex-1 w-full p-8">
        <div className="max-w-4xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AuthenticatedLayout;

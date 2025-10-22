import AppSideBar from "@/components/AppSideBar";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";
import { Outlet } from "react-router";

const Root = () => {
  return (
    <SidebarProvider>
      <Navbar />
      <AppSideBar />
      <main className=" w-full">
        <div className="w-full h-[calc(100vh-67px)]">
          <Outlet />
        </div>
        <Footer />
      </main>
    </SidebarProvider>
  );
};

export default Root;

import { SidebarProvider } from "@/components/ui/sidebar";
import { UserButton } from "@clerk/nextjs";
import React from "react";
import { AppSidebar } from "./app-sidebar";

interface Props {
  children: React.ReactNode;
}

const SidebarLayout = ({ children }: Props) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex h-screen w-full flex-col">
        <div className="flex items-center gap-2 border-b p-4">
          {/* <SearchBar /> */}
          <div className="ml-auto"></div>
          <UserButton />
        </div>
        {/* main content */}
        <div className="flex-grow overflow-y-scroll p-4">{children}</div>
      </main>
    </SidebarProvider>
  );
};

export default SidebarLayout;

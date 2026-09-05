import NavBar from "@/components/NavBar";
import { NAVBAR_HEIGHT } from "@/lib/constants";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full w-full">
      <NavBar />
      <main
        className={`flex h-full w-full flex-col`}
        style={{ paddingTop: `${NAVBAR_HEIGHT}` }}
      >
        {children}
      </main>
    </div>
  );
};

export default layout;

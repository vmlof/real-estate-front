"use client";

import StoreProvider from "@/state/redux";
import SessionSync from "@/components/session-sync";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <StoreProvider>
      <SessionSync />
      {children}
    </StoreProvider>
  );
};

export default Providers;

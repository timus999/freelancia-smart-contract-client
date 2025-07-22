// src/layout/BaseLayout.tsx
import { ReactNode } from "react";
import { useAuth } from "@/context/AuthContext.tsx";
import Footer from "./Footer.tsx";
import Navbar from "./Navbar.tsx";
import NavbarMax from "./NavbarMax.tsx";
import Spinner from "../ui/spinner.tsx";

const BaseLayout = ({ children }: { children: ReactNode }) => {
  const { isLoading, isAuthenticated } = useAuth();

  if ( isLoading ) return <Spinner />;
  return (
    <div className="flex flex-col min-h-screen">
      {/* Conditional Navbar */}
      {isAuthenticated ? <NavbarMax /> : <Navbar />}

      {/* Page Content */}
      <main className="flex-grow">{children}</main>

      {/* Shared Footer */}
      <Footer />
    </div>
  );
};

export default BaseLayout;

import { AuthProvider } from "./auth/AuthContext";

import { SiteLayout } from "./components/layout/SiteLayout";

import { AboutSection } from "./components/sections/AboutSection";
import { ClinicSection } from "./components/sections/ClinicSection";
import { CredentialsSection } from "./components/sections/CredentialsSection";
import { CtaSection } from "./components/sections/CtaSection";
import { FaqSection } from "./components/sections/FaqSection";
import { HeroSection } from "./components/sections/HeroSection";
import { ProcessSection } from "./components/sections/ProcessSection";
import { SpecialtiesSection } from "./components/sections/SpecialtiesSection";

import { TriagePage } from "./components/pages/TriagePage";
import { AdminLoginPage } from "./components/pages/AdminLoginPage";
import { AdminTriagePage } from "./components/pages/AdminTriagePage";
import { AdminTriageDetailPage } from "./components/pages/AdminTriageDetailPage";

import { ProtectedRoute } from "./auth/ProtectedRoute";
import { RoleRoute } from "./auth/RoleRoute";
import { AdminUsersPage } from "./components/pages/AdminUsersPage";

function AppContent() {
  const path = window.location.pathname.replace(/\/$/, "") || "/";

  if (path === "/admin/usuarios") {
    return (
      <RoleRoute roles={["ADMIN"]}>
        <AdminUsersPage />
      </RoleRoute>
    );
  }

  if (path === "/triagem") {
    return <TriagePage />;
  }

  if (path === "/admin/login") {
    return <AdminLoginPage />;
  }

  const adminDetailMatch = /^\/admin\/triagens\/(.+)$/.exec(path);
  if (adminDetailMatch) {
    return (
      <ProtectedRoute>
        <AdminTriageDetailPage id={adminDetailMatch[1]} />
      </ProtectedRoute>
    );
  }

  if (path === "/admin/triagens") {
    return (
      <ProtectedRoute>
        <AdminTriagePage />
      </ProtectedRoute>
    );
  }

  return (
    <SiteLayout>
      <HeroSection />
      <AboutSection />
      <ProcessSection />
      <SpecialtiesSection />
      <CredentialsSection />
      <ClinicSection />
      <FaqSection />
      <CtaSection />
    </SiteLayout>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

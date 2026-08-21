import { Navigate, Route, Routes } from "react-router-dom";

import { SiteLayout } from "../components/layout/SiteLayout";
import { AboutSection } from "../components/sections/AboutSection";
import { ClinicSection } from "../components/sections/ClinicSection";
import { CredentialsSection } from "../components/sections/CredentialsSection";
import { CtaSection } from "../components/sections/CtaSection";
import { FaqSection } from "../components/sections/FaqSection";
import { HeroSection } from "../components/sections/HeroSection";
import { ProcessSection } from "../components/sections/ProcessSection";
import { SpecialtiesSection } from "../components/sections/SpecialtiesSection";
import { TestimonialsSection } from "../components/sections/TestimonialsSection";

import { TriagePage } from "../components/pages/TriagePage";
import { AdminLoginPage } from "../components/pages/AdminLoginPage";
import { AdminTriagePage } from "../components/pages/AdminTriagePage";
import { AdminTriageDetailPage } from "../components/pages/AdminTriageDetailPage";
import { AdminUsersPage } from "../components/pages/AdminUsersPage";
import { AdminArchivePage } from "../components/pages/AdminArchivePage";

import { ProtectedRoute } from "../auth/ProtectedRoute";
import { RoleRoute } from "../auth/RoleRoute";

function HomePage() {
  return (
    <SiteLayout>
      <HeroSection />
      <AboutSection />
      <ProcessSection />
      <SpecialtiesSection />
      <CredentialsSection />
      <ClinicSection />
      <TestimonialsSection />
      <FaqSection />
      <CtaSection />
    </SiteLayout>
  );
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/triagem" element={<TriagePage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />

      <Route
        path="/admin/triagens"
        element={
          <ProtectedRoute>
            <AdminTriagePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/arquivo"
        element={
          <ProtectedRoute>
            <AdminArchivePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/triagens/:id"
        element={
          <ProtectedRoute>
            <AdminTriageDetailPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/usuarios"
        element={
          <RoleRoute roles={["ADMIN"]}>
            <AdminUsersPage />
          </RoleRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

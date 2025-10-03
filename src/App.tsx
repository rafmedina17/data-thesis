import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { queryClient } from "@/lib/api";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";

// Pages
import LandingPage from "@/features/landing/pages/LandingPage";
import CollegeDashboard from "@/features/thesis/pages/CollegeDashboard";
import SeniorHighDashboard from "@/features/thesis/pages/SeniorHighDashboard";
import LoginPage from "@/features/auth/pages/LoginPage";
import AdminDashboard from "@/features/admin/pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-right" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/college" element={<CollegeDashboard />} />
          <Route path="/senior-high" element={<SeniorHighDashboard />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

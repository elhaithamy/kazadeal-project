
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ChecklistPage from "./pages/ChecklistPage";
import AdminPage from "./pages/AdminPage";
import RetailerLeaflets from "./pages/RetailerLeaflets";
import BestDealsPage from "./pages/BestDealsPage";
import NearbyStoresPage from "./pages/NearbyStoresPage";
import AccountPage from "./pages/AccountPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/checklist" element={<ChecklistPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/leaflets" element={<RetailerLeaflets />} />
          <Route path="/best-deals" element={<BestDealsPage />} />
          <Route path="/nearby-stores" element={<NearbyStoresPage />} />
          <Route path="/account" element={<AccountPage />} />
          
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

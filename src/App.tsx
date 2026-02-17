import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/useTheme";
import { SoundProvider } from "@/hooks/useSound";
import { OrdersProvider } from "@/contexts/OrdersContext";
import Index from "./pages/Index";
import MenuPage from "./pages/Menu";
import AnalyticsPage from "./pages/Analytics";
import OrderHistoryPage from "./pages/OrderHistory";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <SoundProvider>
        <OrdersProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/menu" element={<MenuPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/history" element={<OrderHistoryPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </OrdersProvider>
      </SoundProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

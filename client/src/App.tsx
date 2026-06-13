import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import { useEffect } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import ExchangePolicy from "./pages/ExchangePolicy";
import SecureShopping from "./pages/SecureShopping";
import PaymentSuccess from "./pages/PaymentSuccess";
import SocialProofPopup from "./components/SocialProofPopup";
import WhatsAppButton from "./components/WhatsAppButton";

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location]);
  return null;
}

function Router() {
  return (
    <>
      <ScrollToTop />
      <Switch>
        <Route path={"/"} component={Home} />
        <Route path={"/catalog"} component={Catalog} />
        <Route path={"/product/:slug"} component={ProductDetail} />
        <Route path={"/cart"} component={Cart} />
        <Route path={"/admin"} component={Admin} />
        <Route path={"/admin-login"} component={AdminLogin} />
        <Route path={"/exchange-policy"} component={ExchangePolicy} />
        <Route path={"/secure-shopping"} component={SecureShopping} />
        <Route path={"/payment-success/:transactionId"} component={PaymentSuccess} />
        <Route path={"/404"} component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
          <SocialProofPopup />
          <WhatsAppButton />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
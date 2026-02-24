import { useEffect } from "react";
import { Switch, Route, Redirect, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";
import AuthPage from "@/pages/auth";
import DashboardPage from "@/pages/dashboard";
import CreateBotPage from "@/pages/create-bot";
import BotDetailPage from "@/pages/bot-detail";
import ProfilePage from "@/pages/profile";
import { DocsOverview, DocsAI, DocsTrading, DocsSecurity, DocsArchitecture } from "@/pages/docs";
import TermsPage from "@/pages/terms";
import PrivacyPage from "@/pages/privacy";
import NotFound from "@/pages/not-found";
import { Loader2 } from "lucide-react";

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return null;
}

function ProtectedRoute({ component: Component }: { component: () => JSX.Element }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Redirect to="/" />;
  }

  return <Component />;
}

function AuthRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  return <AuthPage />;
}

function Router() {
  return (
    <>
      <ScrollToTop />
      <Switch>
        <Route path="/" component={AuthRoute} />
        <Route path="/dashboard">{() => <ProtectedRoute component={DashboardPage} />}</Route>
        <Route path="/create-bot">{() => <ProtectedRoute component={CreateBotPage} />}</Route>
        <Route path="/bot/:id">{() => <ProtectedRoute component={BotDetailPage} />}</Route>
        <Route path="/profile">{() => <ProtectedRoute component={ProfilePage} />}</Route>
        <Route path="/docs/overview" component={DocsOverview} />
        <Route path="/docs/ai" component={DocsAI} />
        <Route path="/docs/trading" component={DocsTrading} />
        <Route path="/docs/security" component={DocsSecurity} />
        <Route path="/docs/architecture" component={DocsArchitecture} />
        <Route path="/terms" component={TermsPage} />
        <Route path="/privacy" component={PrivacyPage} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

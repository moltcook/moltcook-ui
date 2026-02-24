import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/auth";
import { Link, useLocation } from "wouter";
import { User, LogOut, BookOpen, Bot, Users, Activity } from "lucide-react";
import logoImg from "@assets/2026197150737252352_1771918964832.jpg";

export function QuickNav() {
  const { logout } = useAuth();
  return (
    <div className="flex items-center gap-0.5">
      <Link href="/profile">
        <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors" data-testid="quick-link-profile">
          <User className="w-4 h-4" />
        </button>
      </Link>
      <Link href="/docs/overview">
        <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors" data-testid="quick-link-docs">
          <BookOpen className="w-4 h-4" />
        </button>
      </Link>
      <button onClick={logout} className="p-2 rounded-lg text-muted-foreground hover:text-destructive transition-colors" data-testid="quick-button-logout">
        <LogOut className="w-4 h-4" />
      </button>
    </div>
  );
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const [location] = useLocation();

  const { data: myBots } = useQuery<any[]>({
    queryKey: ["/api/bots"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/bots");
      const data = await res.json();
      return data.bots || [];
    },
  });

  const myAgentHref = myBots && myBots.length > 0 ? `/bot/${myBots[0].id}` : "/dashboard";

  const currentTab = (() => {
    if (location.startsWith("/bot/") || location === "/create-bot") return "my-agent";
    if (location === "/profile") return "";
    const params = new URLSearchParams(window.location.search || "");
    const tab = params.get("tab");
    if (tab === "sub-agents") return "sub-agents";
    if (tab === "activity") return "activity";
    return "my-agent";
  })();

  const sidebarItems = [
    { href: myAgentHref, label: "My Agent", icon: Bot, id: "my-agent" },
    { href: "/dashboard?tab=sub-agents", label: "Sub Agent", icon: Users, id: "sub-agents" },
    { href: "/dashboard?tab=activity", label: "Activity", icon: Activity, id: "activity" },
  ];

  return (
    <div className="min-h-screen flex bg-background">
      <aside className="hidden md:flex flex-col w-16 lg:w-56 shrink-0 border-r border-border/20 sticky top-0 h-screen bg-background/50 z-40">
        <Link href="/dashboard" data-testid="link-logo">
          <div className="flex items-center gap-2.5 px-3 lg:px-5 h-16 cursor-pointer border-b border-border/10">
            <img src={logoImg} alt="moltcook" className="w-8 h-8 rounded-lg object-cover shrink-0" />
            <span className="hidden lg:block text-lg font-bold bg-gradient-to-r from-orange-500 to-orange-400 bg-clip-text text-transparent">
              moltcook
            </span>
          </div>
        </Link>

        <nav className="flex-1 py-4 px-2 lg:px-3 space-y-1">
          {sidebarItems.map((item) => (
            <Link key={item.id} href={item.href}>
              <button
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 cursor-pointer w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50 ${
                  currentTab === item.id
                    ? "bg-orange-500/10 text-orange-400 font-medium border border-orange-500/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                }`}
                data-testid={`sidebar-${item.label.toLowerCase().replace(" ", "-")}`}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                <span className="hidden lg:block">{item.label}</span>
              </button>
            </Link>
          ))}
        </nav>

        <div className="border-t border-border/10 px-2 lg:px-3 py-3 space-y-2">
          <div className="hidden lg:flex items-center gap-2.5 px-3 py-1.5">
            <div className="w-6 h-6 rounded-full bg-orange-500/10 flex items-center justify-center shrink-0">
              <User className="w-3.5 h-3.5 text-orange-400" />
            </div>
            <span className="text-xs text-muted-foreground font-mono truncate" data-testid="text-username">{user?.username}</span>
          </div>
          <Link href="/profile">
            <button
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 cursor-pointer w-full ${
                location === "/profile"
                  ? "bg-orange-500/10 text-orange-400 font-medium border border-orange-500/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
              }`}
              data-testid="sidebar-profile"
            >
              <User className="w-5 h-5 shrink-0" />
              <span className="hidden lg:block">Profile</span>
            </button>
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all duration-200 cursor-pointer w-full"
            data-testid="button-logout"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <span className="hidden lg:block">Logout</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 pb-20 md:pb-0">
          {children}
        </main>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-orange-500/20 md:hidden" style={{ backgroundColor: "#0B0B0F" }}>
        <div className="max-w-lg mx-auto flex items-center justify-around h-16">
          {sidebarItems.map((item) => (
            <Link key={item.id} href={item.href}>
              <button
                className={`flex flex-col items-center gap-1 px-3 py-1.5 transition-all duration-200 relative ${
                  currentTab === item.id ? "text-orange-500" : "text-muted-foreground"
                }`}
                data-testid={`nav-${item.id}`}
              >
                {currentTab === item.id && (
                  <div className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-orange-500" />
                )}
                <item.icon className={`w-5 h-5 ${currentTab === item.id ? "drop-shadow-[0_0_6px_rgba(255,106,0,0.5)]" : ""}`} />
                <span className="text-[10px]">{item.label}</span>
              </button>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}

import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function Navigation() {
  const { user } = useAuth();
  const [location, setLocation] = useLocation();

  const navItems = [
    { href: "/", label: "Dashboard", icon: "fas fa-home" },
    { href: "/workouts", label: "Training", icon: "fas fa-dumbbell" },
    { href: "/nutrition", label: "Voeding", icon: "fas fa-utensils" },
    { href: "/progress", label: "Voortgang", icon: "fas fa-chart-line" },
    { href: "/subscription", label: "Abonnement", icon: "fas fa-crown" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-accent to-accent/80 rounded-lg flex items-center justify-center">
              <i className="fas fa-dumbbell text-accent-foreground text-sm"></i>
            </div>
            <span className="text-xl font-bold text-gradient" data-testid="logo-text">Marco Donato</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => setLocation(item.href)}
                className={`flex items-center space-x-2 text-sm transition-colors ${
                  location === item.href 
                    ? "text-accent" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
                data-testid={`nav-${item.label.toLowerCase()}`}
              >
                <i className={item.icon}></i>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2">
              {user?.profileImageUrl && (
                <img 
                  src={user.profileImageUrl} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full object-cover"
                  data-testid="profile-image"
                />
              )}
              <span className="text-sm text-foreground" data-testid="user-name">
                {user?.firstName || user?.email}
              </span>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.location.href = '/api/logout'}
              data-testid="button-logout"
            >
              <i className="fas fa-sign-out-alt mr-2"></i>
              Uitloggen
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-border bg-background/95">
        <div className="grid grid-cols-5 gap-1 p-2">
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={() => setLocation(item.href)}
              className={`flex flex-col items-center space-y-1 p-2 rounded-lg text-xs transition-colors ${
                location === item.href 
                  ? "text-accent bg-accent/10" 
                  : "text-muted-foreground"
              }`}
              data-testid={`mobile-nav-${item.label.toLowerCase()}`}
            >
              <i className={item.icon}></i>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

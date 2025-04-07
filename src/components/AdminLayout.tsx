
import React from "react";
import { Link, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ShoppingCart, 
  LogOut, 
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { isAdmin, isLoading, signOut } = useAuth();
  const location = useLocation();
  const [open, setOpen] = React.useState(false);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/auth" replace />;
  }

  const routes = [
    {
      href: "/admin",
      label: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      exact: true
    },
    {
      href: "/admin/products",
      label: "Products",
      icon: <Package className="h-5 w-5" />
    },
    {
      href: "/admin/users",
      label: "Users",
      icon: <Users className="h-5 w-5" />
    },
    {
      href: "/admin/orders",
      label: "Orders",
      icon: <ShoppingCart className="h-5 w-5" />
    }
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile sidebar trigger */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild className="lg:hidden fixed left-4 top-4 z-50">
          <Button variant="outline" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <SidebarContent 
            routes={routes} 
            currentPath={location.pathname} 
            signOut={signOut}
            onNavigate={() => setOpen(false)}
          />
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex w-72 flex-col border-r">
        <SidebarContent 
          routes={routes} 
          currentPath={location.pathname} 
          signOut={signOut}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
};

interface SidebarContentProps {
  routes: { href: string; label: string; icon: React.ReactNode; exact?: boolean }[];
  currentPath: string;
  signOut: () => Promise<void>;
  onNavigate?: () => void;
}

const SidebarContent: React.FC<SidebarContentProps> = ({ 
  routes, 
  currentPath, 
  signOut,
  onNavigate
}) => {
  return (
    <>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-primary">FlexFitness Admin</h1>
      </div>
      <div className="flex-1 space-y-1 px-4">
        {routes.map((route) => {
          const isActive = route.exact 
            ? currentPath === route.href
            : currentPath.startsWith(route.href);
          
          return (
            <Link
              key={route.href}
              to={route.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "hover:bg-muted"
              )}
            >
              {route.icon}
              {route.label}
            </Link>
          );
        })}
      </div>
      <div className="p-4 border-t">
        <Button 
          variant="outline" 
          className="w-full justify-start" 
          onClick={signOut}
        >
          <LogOut className="h-5 w-5 mr-2" />
          Sign out
        </Button>
      </div>
    </>
  );
};

export default AdminLayout;

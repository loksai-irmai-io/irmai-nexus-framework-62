
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useSidebarContext } from './SidebarProvider';
import { 
  LineChart, 
  AlertTriangle, 
  Gauge, 
  Network, 
  Settings, 
  LogOut, 
  Home, 
  Globe, 
  Shield,
  FileStack,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const SidebarLink = ({ 
  to, 
  icon: Icon, 
  label, 
  active, 
  onClick,
  isExpanded
}: { 
  to: string; 
  icon: React.ElementType; 
  label: string; 
  active: boolean;
  onClick?: (e: React.MouseEvent) => void | Promise<void>; 
  isExpanded: boolean;
}) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={cn(
      "flex items-center px-3 py-2 rounded-md mb-1 transition-colors",
      "hover:bg-primary/10",
      active ? "bg-primary/10 text-primary" : "text-muted-foreground"
    )}
  >
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <span className={cn(
            "flex items-center",
            isExpanded ? "justify-start" : "justify-center w-full"
          )}>
            <Icon className={cn(
              "h-5 w-5",
              isExpanded ? "mr-2" : ""
            )} />
            {isExpanded && <span>{label}</span>}
          </span>
        </TooltipTrigger>
        {!isExpanded && <TooltipContent side="right" className="ml-1">{label}</TooltipContent>}
      </Tooltip>
    </TooltipProvider>
  </NavLink>
);

const Sidebar = () => {
  const { isOpen, setIsOpen } = useSidebarContext();
  const location = useLocation();
  const { signOut, user, isAdmin } = useAuth();

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    await signOut();
  };

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  const userInitials = () => {
    if (!user?.email) return "?";
    const parts = user.email.split('@')[0].split('.');
    if (parts.length > 1) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  };

  return (
    <aside 
      id="main-sidebar"
      className={cn(
        "h-screen fixed top-0 left-0 z-30 bg-background border-r transition-all duration-300",
        "flex flex-col shadow-sm pt-16",
        isOpen ? "w-64" : "w-16"
      )}
    >
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <nav className="space-y-2">
          {/* Dashboard */}
          <SidebarLink to="/dashboard" icon={Home} label="Dashboard" active={isActive("/dashboard")} isExpanded={isOpen} />
          
          {/* Process Discovery */}
          <SidebarLink to="/process-discovery" icon={Network} label="Process Discovery" active={isActive("/process-discovery")} isExpanded={isOpen} />
          
          {/* Outlier Analysis */}
          <SidebarLink to="/outlier-analysis" icon={AlertTriangle} label="Outlier Analysis" active={isActive("/outlier-analysis")} isExpanded={isOpen} />
          
          {/* Compliance Monitoring */}
          <SidebarLink to="/compliance-monitoring" icon={Shield} label="Compliance Monitoring" active={isActive("/compliance-monitoring")} isExpanded={isOpen} />
          
          {/* FMEA Analysis */}
          <SidebarLink to="/fmea-analysis" icon={Gauge} label="FMEA Analysis" active={isActive("/fmea-analysis")} isExpanded={isOpen} />

          {/* Gap Analysis */}
          <SidebarLink to="/gap-analysis" icon={FileStack} label="Gap Analysis" active={isActive("/gap-analysis")} isExpanded={isOpen} />

          {/* Incident Management */}
          <SidebarLink to="/incident-management" icon={AlertCircle} label="Incident Management" active={isActive("/incident-management")} isExpanded={isOpen} />

          {/* API Integrations */}
          <SidebarLink to="/api-integrations" icon={Globe} label="API Integrations" active={isActive("/api-integrations")} isExpanded={isOpen} />
          
          {/* Admin (only visible for admin users) */}
          {isAdmin && <SidebarLink to="/admin" icon={Settings} label="Admin" active={isActive("/admin")} isExpanded={isOpen} />}

          {/* Logout */}
          <SidebarLink to="#" icon={LogOut} label="Logout" active={false} onClick={handleLogout} isExpanded={isOpen} />
        </nav>
      </div>
      
      {/* User profile at bottom */}
      <div className={cn(
        "p-3 border-t flex",
        isOpen ? "items-center" : "justify-center",
        "transition-all duration-300"
      )}>
        <Avatar className="h-8 w-8 bg-primary text-primary-foreground">
          <span className="text-xs font-medium">{userInitials()}</span>
        </Avatar>
        {isOpen && (
          <div className="ml-2 overflow-hidden">
            <p className="text-sm font-medium truncate">{user?.email || "User"}</p>
            <p className="text-xs text-muted-foreground">
              {isAdmin ? "Administrator" : "User"}
            </p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;

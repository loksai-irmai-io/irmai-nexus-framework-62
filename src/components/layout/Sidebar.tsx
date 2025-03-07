
import React from 'react';
import { useSidebarContext } from './SidebarProvider';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  GitBranch, 
  SearchX, 
  Shield, 
  Share2, 
  CheckCheck, 
  Siren, 
  Settings, 
  TestTube, 
  Presentation, 
  BookText
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from '@/components/ui/badge';

type MenuItem = {
  id: string;
  label: string;
  icon: React.ElementType;
  active?: boolean;
  comingSoon?: boolean;
  href: string;
};

const mainMenuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard (Summary)',
    icon: LayoutDashboard,
    active: true,
    href: '/'
  },
  {
    id: 'process-discovery',
    label: 'Process Discovery',
    icon: GitBranch,
    href: '/process-discovery'
  },
  {
    id: 'outlier-analysis',
    label: 'Outlier Analysis',
    icon: SearchX,
    href: '/outlier-analysis'
  },
  {
    id: 'fmea-analysis',
    label: 'Predictive Risk Analytics',
    icon: Shield,
    href: '/fmea-analysis'
  },
  {
    id: 'gap-analysis',
    label: 'Gap Analysis',
    icon: Share2,
    href: '/gap-analysis'
  },
  {
    id: 'compliance-monitoring',
    label: 'Compliance & Monitoring',
    icon: CheckCheck,
    href: '/compliance-monitoring'
  },
  {
    id: 'incident-management',
    label: 'Incident Management',
    icon: Siren,
    href: '/incident-management'
  },
  {
    id: 'admin',
    label: 'Admin & Dependencies',
    icon: Settings,
    href: '/admin'
  },
  {
    id: 'controls-testing',
    label: 'Controls Testing',
    icon: TestTube,
    comingSoon: true,
    href: '/controls-testing'
  },
  {
    id: 'scenario-analysis',
    label: 'Scenario Analysis',
    icon: Presentation,
    comingSoon: true,
    href: '/scenario-analysis'
  },
  {
    id: 'risk-catalog',
    label: 'Risk Catalog',
    icon: BookText,
    comingSoon: true,
    href: '/risk-catalog'
  }
];

const Sidebar: React.FC = () => {
  const { isOpen } = useSidebarContext();

  return (
    <aside 
      className={cn(
        "fixed inset-y-0 left-0 z-30 flex flex-col border-r shadow-lg transition-all duration-300 ease-in-out animate-fade-in bg-sidebar",
        isOpen ? "w-64" : "w-0 -translate-x-full sm:translate-x-0 sm:w-16"
      )}
    >
      <div className="flex flex-col h-full overflow-y-auto">
        <div className="h-16 flex items-center justify-center px-4 border-b bg-sidebar">
          {isOpen && (
            <div className="text-lg font-semibold text-primary">
              IRMAI
            </div>
          )}
        </div>
        <nav className="flex-1 p-3 space-y-2 overflow-y-auto">
          {mainMenuItems.map((item) => (
            <TooltipProvider key={item.id}>
              <Tooltip delayDuration={isOpen ? 1000 : 0}>
                <TooltipTrigger asChild>
                  <a
                    href={item.href}
                    className={cn(
                      "flex items-center px-3 py-2.5 rounded-lg text-sm group transition-all hover:bg-sidebar-accent/50",
                      item.active 
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" 
                        : "text-sidebar-foreground",
                      item.comingSoon && "opacity-60"
                    )}
                  >
                    <item.icon className={cn(
                      "h-5 w-5 flex-shrink-0",
                      isOpen ? "mr-3" : "mx-auto"
                    )} />
                    {isOpen && (
                      <div className="flex items-center justify-between w-full min-w-0">
                        <span className="truncate mr-2">{item.label}</span>
                        {item.comingSoon && (
                          <Badge 
                            variant="outline" 
                            className="text-[10px] py-0.5 px-1.5 whitespace-nowrap bg-secondary/10"
                          >
                            Coming Soon
                          </Badge>
                        )}
                      </div>
                    )}
                  </a>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={10} className={cn(isOpen && "hidden")}>
                  <div className="flex flex-col">
                    <span>{item.label}</span>
                    {item.comingSoon && (
                      <Badge 
                        variant="outline" 
                        className="text-[10px] py-0 px-1.5 mt-1"
                      >
                        Coming Soon
                      </Badge>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </nav>
        <div className="p-3 border-t">
          <div className="text-xs text-center text-muted-foreground py-2">
            {isOpen ? 'IRMAI v1.0.0' : 'v1'}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

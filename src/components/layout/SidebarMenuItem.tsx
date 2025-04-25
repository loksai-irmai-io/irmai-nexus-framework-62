
import React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { MenuItem } from './types/sidebar';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";

interface SidebarMenuItemProps {
  item: MenuItem;
  isOpen: boolean;
  isActive: boolean;
}

const SidebarMenuItem: React.FC<SidebarMenuItemProps> = ({ 
  item, 
  isOpen, 
  isActive 
}) => {
  return (
    <TooltipProvider key={item.id}>
      <Tooltip delayDuration={isOpen ? 1000 : 0}>
        <TooltipTrigger asChild>
          <a
            href={item.href}
            className={cn(
              "flex items-center px-3 py-2.5 rounded-lg text-sm group transition-all hover:bg-sidebar-accent/50",
              isActive 
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
  );
};

export default SidebarMenuItem;


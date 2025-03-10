import React, { useState, useRef } from 'react';
import { 
  Bell, 
  Menu, 
  Search, 
  Upload, 
  AlertTriangle, 
  PlusCircle, 
  ChevronDown, 
  X,
  Settings,
  HelpCircle,
  LogOut,
  FileUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { useSidebarContext } from './SidebarProvider';
import { toast } from "sonner";
import { processService } from '@/services/processService';
import { ApiResponse } from '@/components/process-discovery/types';

type Notification = {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'risk' | 'incident' | 'compliance' | 'system';
};

export const handleFileUpload = async (file: File): Promise<ApiResponse | undefined> => {
  if (!file) return;
  
  const validFileTypes = ['text/csv', 'text/xml', 'application/xml', 'text/plain'];
  const fileType = file.type;
  
  if (!validFileTypes.includes(fileType) && !file.name.endsWith('.xes')) {
    toast.error("Invalid file type. Please upload a CSV, XES, or XML file.");
    return;
  }
  
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    toast.error("File is too large. Maximum size is 10MB.");
    return;
  }
  
  try {
    toast.loading("Uploading event log...");
    
    const response = await processService.uploadEventLog(file);
    
    toast.dismiss();
    
    if (response.status === 'success') {
      toast.success(response.message || `Event log "${file.name}" uploaded successfully!`);
    } else {
      toast.error(response.message || "Failed to upload event log");
    }
    
    return response;
  } catch (error) {
    toast.dismiss();
    toast.error("Error uploading file. Please try again.");
    console.error("File upload error:", error);
    return {
      status: 'failure',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

const Header: React.FC = () => {
  const { isOpen, setIsOpen } = useSidebarContext();
  const [searchValue, setSearchValue] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'High Risk Alert',
      message: 'New high severity risk identified in Payment Processing',
      time: '10 min ago',
      read: false,
      type: 'risk'
    },
    {
      id: '2',
      title: 'Compliance Update',
      message: 'Regulatory deadline approaching for quarterly reporting',
      time: '2 hours ago',
      read: false,
      type: 'compliance'
    },
    {
      id: '3',
      title: 'Incident Reported',
      message: 'New incident logged for Customer Data Access',
      time: '5 hours ago',
      read: true,
      type: 'incident'
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const getNotificationIcon = (type: string) => {
    switch(type) {
      case 'risk': return <AlertTriangle className="w-4 h-4 text-risk-high" />;
      case 'incident': return <Bell className="w-4 h-4 text-risk-medium" />;
      case 'compliance': return <Upload className="w-4 h-4 text-risk-low" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const response = await handleFileUpload(file);
      console.log("API Response:", response);
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm animate-fade-in">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setIsOpen(!isOpen)}
                  className="hover:bg-accent hover:text-accent-foreground transition-all"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                {isOpen ? 'Hide sidebar' : 'Show sidebar'}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <div className="flex items-center">
            <div className="h-11 flex items-center justify-center bg-white/5 rounded-md overflow-hidden px-2">
              <img 
                src="/lovable-uploads/f6af323e-8e1e-41cb-a223-30dc2436352c.png" 
                alt="IRMAI Logo" 
                className="h-11 object-contain" 
              />
            </div>
          </div>
        </div>

        <div className="flex-1 max-w-md mx-4 hidden md:flex">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search risks, processes, controls..."
              className="w-full pl-8 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden lg:flex gap-2">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".csv,.xes,.xml,text/csv,application/xml,text/xml,text/plain"
              onChange={onFileChange}
            />
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 transition-all" onClick={triggerFileUpload}>
                    <FileUp className="h-4 w-4" />
                    <span>Upload Event Log</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Upload event logs for process mining</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 transition-all">
                    <PlusCircle className="h-4 w-4" />
                    <span>Add Risk</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Create new risk record</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 transition-all">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Report Incident</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Log a new incident</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="relative">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="hover:bg-accent hover:text-accent-foreground transition-all relative"
                  >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-risk-high text-[10px] font-medium text-white">
                        {unreadCount}
                      </span>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Notifications</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 rounded-lg border bg-card p-1 shadow-md animate-scale-in z-50">
                <div className="flex items-center justify-between px-4 py-2 border-b">
                  <h3 className="font-semibold">Notifications</h3>
                  <div className="flex items-center gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={markAllAsRead}
                      className="text-xs h-7 px-2"
                    >
                      Mark all as read
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => setShowNotifications(false)}
                      className="h-6 w-6"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="max-h-[280px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center text-muted-foreground">
                      No notifications
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div 
                        key={notification.id}
                        className={cn(
                          "px-4 py-2 hover:bg-accent/50 transition-all cursor-pointer",
                          !notification.read && "bg-accent/20"
                        )}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex gap-3">
                          <div className="mt-0.5">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-medium">{notification.title}</h4>
                              <span className="text-xs text-muted-foreground">{notification.time}</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <DropdownMenu>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          JD
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent side="bottom">User profile</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">Jane Doe</p>
                  <p className="text-xs text-muted-foreground">jane.doe@irmai.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>Help</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;

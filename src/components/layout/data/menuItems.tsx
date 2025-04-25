
import { 
  LayoutDashboard, 
  GitBranch, 
  SearchX, 
  Shield, 
  CheckCheck, 
  Settings, 
  TestTube, 
  Presentation, 
  BookText,
  Plug,
  Siren
} from 'lucide-react';
import { MenuItem } from '../types/sidebar';

export const mainMenuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard (Summary)',
    icon: LayoutDashboard,
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
    id: 'compliance-monitoring',
    label: 'Compliance & Monitoring',
    icon: CheckCheck,
    href: '/compliance-monitoring'
  },
  {
    id: 'api-integrations',
    label: 'API Integrations',
    icon: Plug,
    href: '/api-integrations'
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
  },
  {
    id: 'incident-management',
    label: 'Incident Management',
    icon: Siren,
    comingSoon: true,
    href: '/incident-management'
  }
];



export interface Risk {
  id: string;
  name: string;
  description: string;
  category: 'operational' | 'financial' | 'compliance' | 'strategic' | 'process';
  severity: 'critical' | 'high' | 'medium' | 'low';
  likelihood: 'high' | 'medium' | 'low';
  severityScore: number; // 1-10
  likelihoodScore: number; // 1-10
  detectabilityScore: number; // 1-10, added to fix type errors
  impactScore: number; // 1-10
  controlEffectiveness: number; // 0-100 percentage
  trendDirection: 'increasing' | 'decreasing' | 'stable';
  trendPercentage: number;
  lastUpdated: string;
  owner: string;
  status: 'active' | 'mitigated' | 'accepted' | 'transferred';
  mitigation: string;
  controlCount: number;
  relatedIncidents: number;
}

export const mockRiskData: Risk[] = [
  {
    id: 'R001',
    name: 'Data Privacy Breach',
    description: 'Unauthorized access to customer personal data resulting in privacy violations',
    category: 'compliance',
    severity: 'critical',
    likelihood: 'medium',
    severityScore: 9,
    likelihoodScore: 6,
    detectabilityScore: 4, // Adding missing property
    impactScore: 9,
    controlEffectiveness: 72,
    trendDirection: 'increasing',
    trendPercentage: 12,
    lastUpdated: '2023-04-15',
    owner: 'Information Security',
    status: 'active',
    mitigation: 'Encryption, access controls, and regular security assessments',
    controlCount: 8,
    relatedIncidents: 2
  },
  {
    id: 'R002',
    name: 'System Downtime',
    description: 'Critical systems unavailable, impacting business operations',
    category: 'operational',
    severity: 'high',
    likelihood: 'medium',
    severityScore: 8,
    likelihoodScore: 5,
    detectabilityScore: 3, // Adding missing property
    impactScore: 8,
    controlEffectiveness: 80,
    trendDirection: 'stable',
    trendPercentage: 0,
    lastUpdated: '2023-05-20',
    owner: 'IT Operations',
    status: 'active',
    mitigation: 'Redundant systems, backup procedures, and disaster recovery planning',
    controlCount: 6,
    relatedIncidents: 3
  },
  {
    id: 'R003',
    name: 'Regulatory Non-Compliance',
    description: 'Failure to meet regulatory requirements leading to penalties',
    category: 'compliance',
    severity: 'high',
    likelihood: 'low',
    severityScore: 7,
    likelihoodScore: 3,
    detectabilityScore: 2, // Adding missing property
    impactScore: 8,
    controlEffectiveness: 85,
    trendDirection: 'decreasing',
    trendPercentage: 8,
    lastUpdated: '2023-06-10',
    owner: 'Compliance',
    status: 'active',
    mitigation: 'Compliance monitoring, regulatory updates, and staff training',
    controlCount: 9,
    relatedIncidents: 1
  },
  {
    id: 'R004',
    name: 'Financial Reporting Error',
    description: 'Inaccurate financial reporting affecting decision-making',
    category: 'financial',
    severity: 'medium',
    likelihood: 'low',
    severityScore: 6,
    likelihoodScore: 3,
    detectabilityScore: 2, // Adding missing property
    impactScore: 7,
    controlEffectiveness: 90,
    trendDirection: 'stable',
    trendPercentage: 0,
    lastUpdated: '2023-04-25',
    owner: 'Finance',
    status: 'active',
    mitigation: 'Multiple review layers, reconciliation processes, and audit procedures',
    controlCount: 7,
    relatedIncidents: 0
  },
  {
    id: 'R005',
    name: 'Market Disruption',
    description: 'Industry changes impacting business model viability',
    category: 'strategic',
    severity: 'high',
    likelihood: 'medium',
    severityScore: 8,
    likelihoodScore: 5,
    detectabilityScore: 4, // Adding missing property
    impactScore: 9,
    controlEffectiveness: 60,
    trendDirection: 'increasing',
    trendPercentage: 15,
    lastUpdated: '2023-05-05',
    owner: 'Strategy',
    status: 'active',
    mitigation: 'Market monitoring, scenario planning, and strategic reviews',
    controlCount: 4,
    relatedIncidents: 0
  },
  {
    id: 'R006',
    name: 'Supplier Failure',
    description: 'Critical supplier unable to deliver required goods or services',
    category: 'operational',
    severity: 'medium',
    likelihood: 'medium',
    severityScore: 6,
    likelihoodScore: 5,
    detectabilityScore: 3, // Adding missing property
    impactScore: 7,
    controlEffectiveness: 75,
    trendDirection: 'stable',
    trendPercentage: 0,
    lastUpdated: '2023-06-15',
    owner: 'Procurement',
    status: 'active',
    mitigation: 'Multiple suppliers, contract management, and supplier assessments',
    controlCount: 5,
    relatedIncidents: 1
  },
  {
    id: 'R007',
    name: 'Process Inefficiency',
    description: 'Inefficient processes resulting in increased costs and delays',
    category: 'process',
    severity: 'medium',
    likelihood: 'high',
    severityScore: 5,
    likelihoodScore: 8,
    detectabilityScore: 6, // Adding missing property
    impactScore: 6,
    controlEffectiveness: 50,
    trendDirection: 'decreasing',
    trendPercentage: 5,
    lastUpdated: '2023-04-10',
    owner: 'Operations',
    status: 'active',
    mitigation: 'Process optimization, automation, and regular reviews',
    controlCount: 3,
    relatedIncidents: 4
  },
  {
    id: 'R008',
    name: 'Data Quality Issues',
    description: 'Poor data quality affecting decision-making and operations',
    category: 'process',
    severity: 'medium',
    likelihood: 'high',
    severityScore: 6,
    likelihoodScore: 7,
    detectabilityScore: 5, // Adding missing property
    impactScore: 7,
    controlEffectiveness: 65,
    trendDirection: 'stable',
    trendPercentage: 0,
    lastUpdated: '2023-05-25',
    owner: 'Data Management',
    status: 'active',
    mitigation: 'Data governance, quality controls, and validation procedures',
    controlCount: 6,
    relatedIncidents: 3
  },
  {
    id: 'R009',
    name: 'Talent Shortage',
    description: 'Inability to attract or retain key talent',
    category: 'operational',
    severity: 'high',
    likelihood: 'high',
    severityScore: 7,
    likelihoodScore: 8,
    detectabilityScore: 4, // Adding missing property
    impactScore: 8,
    controlEffectiveness: 45,
    trendDirection: 'increasing',
    trendPercentage: 18,
    lastUpdated: '2023-06-05',
    owner: 'Human Resources',
    status: 'active',
    mitigation: 'Competitive compensation, talent development, and succession planning',
    controlCount: 4,
    relatedIncidents: 2
  },
  {
    id: 'R010',
    name: 'Cybersecurity Threat',
    description: 'Evolving cyber threats targeting company systems and data',
    category: 'operational',
    severity: 'critical',
    likelihood: 'high',
    severityScore: 10,
    likelihoodScore: 8,
    detectabilityScore: 7, // Adding missing property
    impactScore: 10,
    controlEffectiveness: 70,
    trendDirection: 'increasing',
    trendPercentage: 22,
    lastUpdated: '2023-04-30',
    owner: 'Information Security',
    status: 'active',
    mitigation: 'Security monitoring, vulnerability management, and incident response',
    controlCount: 12,
    relatedIncidents: 5
  }
];

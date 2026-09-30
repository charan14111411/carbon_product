export interface NavItem {
  label: string;
  path: string;
  icon: string;
  perms: string[]; // any of
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

const READ = 'data.read';

export const NAV: NavGroup[] = [
  {
    label: '',
    items: [{ label: 'Overview', path: '/app/overview', icon: 'dashboard', perms: [READ] }],
  },
  {
    label: 'Programmes',
    items: [
      { label: 'Programmes & projects', path: '/app/programmes', icon: 'briefcase', perms: [READ] },
      { label: 'Farmers', path: '/app/farmers', icon: 'users', perms: [READ, 'farmers.manage'] },
      { label: 'Agreements & consent', path: '/app/agreements', icon: 'handshake', perms: ['farmers.manage'] },
    ],
  },
  {
    label: 'Land',
    items: [
      { label: 'Fields & map', path: '/app/fields', icon: 'map', perms: [READ, 'land.manage'] },
      { label: 'Practices', path: '/app/practices', icon: 'sprout', perms: [READ, 'practice.record'] },
      { label: 'Crops & practices catalogue', path: '/app/catalogue', icon: 'book', perms: [READ, 'catalogue.manage'] },
    ],
  },
  {
    label: 'Measurement',
    items: [
      { label: 'Methodology rules', path: '/app/methodology', icon: 'scale', perms: [READ, 'rules.edit'] },
      { label: 'Sampling', path: '/app/sampling', icon: 'target', perms: [READ, 'sampling.plan'] },
      { label: 'Laboratory', path: '/app/lab', icon: 'flask', perms: [READ, 'lab.submit', 'lab.review'] },
      { label: 'Quality checks', path: '/app/quality', icon: 'shield-check', perms: [READ, 'qa.resolve'] },
    ],
  },
  {
    label: 'Carbon',
    items: [
      { label: 'Calculations', path: '/app/calculations', icon: 'calculator', perms: [READ, 'calc.run'] },
      { label: 'Verification', path: '/app/verification', icon: 'file-check', perms: [READ, 'package.issue'] },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { label: 'Supporting data', path: '/app/supporting', icon: 'rain', perms: [READ, 'data.sync'] },
      { label: 'Satellite & practices', path: '/app/satellite', icon: 'satellite', perms: [READ] },
      { label: 'Soil-carbon models', path: '/app/models', icon: 'layers', perms: [READ, 'models.manage'] },
    ],
  },
  {
    label: 'Market',
    items: [
      { label: 'Credits', path: '/app/credits', icon: 'coins', perms: [READ, 'credits.manage'] },
      { label: 'Buyers & sales', path: '/app/sales', icon: 'receipt', perms: [READ, 'sales.manage'] },
      { label: 'Farmer benefits', path: '/app/benefits', icon: 'hand-coins', perms: [READ, 'payout.prepare', 'payout.approve'] },
    ],
  },
  {
    label: 'Care',
    items: [
      { label: 'Risk & permanence', path: '/app/risk', icon: 'radar', perms: [READ, 'risk.manage'] },
      { label: 'Grievances', path: '/app/grievances', icon: 'message', perms: [READ, 'grievance.handle'] },
    ],
  },
  {
    label: 'Administration',
    items: [
      { label: 'Users & roles', path: '/app/users', icon: 'user-plus', perms: ['users.manage'] },
      { label: 'Partners & API', path: '/app/partners', icon: 'webhook', perms: ['partners.manage'] },
      { label: 'Audit log', path: '/app/audit', icon: 'history', perms: [READ] },
    ],
  },
];

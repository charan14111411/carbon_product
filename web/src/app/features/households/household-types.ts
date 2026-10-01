import { FarmerPublic } from './lookups';

export interface HouseholdMember {
  id: string; relation: string; farmer_id: string | null; farmer: FarmerPublic | null; name: string;
}
export interface Household {
  id: string; code: string; name: string; status: 'active' | 'inactive'; head_farmer_id: string; head: FarmerPublic | null;
  village: string | null; district: string | null; state: string | null; notes: string;
  members: HouseholdMember[]; member_count: number; created_at: string;
}

export const RELATIONS: { key: string; label: string; kn: string }[] = [
  { key: 'spouse', label: 'Spouse', kn: 'ಪತಿ / ಪತ್ನಿ' },
  { key: 'son', label: 'Son', kn: 'ಮಗ' },
  { key: 'daughter', label: 'Daughter', kn: 'ಮಗಳು' },
  { key: 'parent', label: 'Parent', kn: 'ತಂದೆ / ತಾಯಿ' },
  { key: 'sibling', label: 'Brother or sister', kn: 'ಸಹೋದರ / ಸಹೋದರಿ' },
  { key: 'grandparent', label: 'Grandparent', kn: 'ಅಜ್ಜ / ಅಜ್ಜಿ' },
  { key: 'grandchild', label: 'Grandchild', kn: 'ಮೊಮ್ಮಗು' },
  { key: 'in_law', label: 'In-law', kn: 'ಅತ್ತೆ / ಮಾವ' },
  { key: 'other', label: 'Other relative', kn: 'ಇತರ' },
];

export function relationLabel(k: string): string {
  if (k === 'head') return 'Head of household';
  return RELATIONS.find(r => r.key === k)?.label ?? k;
}
export function relationKn(k: string): string {
  if (k === 'head') return 'ಕುಟುಂಬದ ಮುಖ್ಯಸ್ಥ';
  return RELATIONS.find(r => r.key === k)?.kn ?? '';
}

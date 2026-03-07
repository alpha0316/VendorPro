// locations.ts

export interface KNUSTLocation {
  id: string;
  names: string[]; // Aliases for OCR matching
  lat: number;
  lng: number;
  category: 'hostel' | 'hall' | 'landmark';
  address: string;
}

export const KNUST_DATABASE: KNUSTLocation[] = [
  // --- MAIN CAMPUS HALLS ---
  { id: 'unity', names: ['unity', 'conti', 'unity hall'], lat: 6.6835, lng: -1.5721, category: 'hall', address: 'Unity Hall, KNUST' },
  { id: 'university', names: ['university hall', 'katanga', 'kat'], lat: 6.6738, lng: -1.5712, category: 'hall', address: 'University Hall, KNUST' },
  { id: 'republic', names: ['republic', 'rep'], lat: 6.6756, lng: -1.5658, category: 'hall', address: 'Republic Hall, KNUST' },
  { id: 'queens', names: ['queens', 'queen elizabeth'], lat: 6.6769, lng: -1.5665, category: 'hall', address: 'Queen Elizabeth II Hall, KNUST' },
  { id: 'independence', names: ['independence', 'indeco'], lat: 6.6782, lng: -1.5639, category: 'hall', address: 'Independence Hall, KNUST' },
  { id: 'africa', names: ['africa', 'africa hall'], lat: 6.6712, lng: -1.5645, category: 'hall', address: 'Africa Hall, KNUST' },

  // --- AYEDUASE CLUSTER (THE "BIG 30") ---
  { id: 'brunei', names: ['brunei', 'bruni', 'brunei complex'], lat: 6.6718, lng: -1.5694, category: 'hostel', address: 'Brunei Complex, Ayeduase' },
  { id: 'gaza', names: ['gaza', 'wilkado', 'gaza hostel'], lat: 6.6645, lng: -1.5521, category: 'hostel', address: 'Gaza Hostel, Ayeduase' },
  { id: 'providence', names: ['providence', 'providence hostel'], lat: 6.6662, lng: -1.5543, category: 'hostel', address: 'Providence Hostel, Ayeduase' },
  { id: 'westend', names: ['westend', 'west end'], lat: 6.6681, lng: -1.5555, category: 'hostel', address: 'Westend Hostel, Ayeduase' },
  { id: 'frontline', names: ['frontline', 'front line'], lat: 6.6695, lng: -1.5568, category: 'hostel', address: 'Frontline Court, Ayeduase' },
  { id: 'adom_bi', names: ['adom bi', 'adombi'], lat: 6.6632, lng: -1.5510, category: 'hostel', address: 'Adom-Bi Hostel, Ayeduase' },
  { id: 'crystal_rose', names: ['crystal rose', 'crystalrose'], lat: 6.6615, lng: -1.5498, category: 'hostel', address: 'Crystal Rose Hostel, Ayeduase' },
  { id: 'sunshine', names: ['sunshine', 'sun shine'], lat: 6.6640, lng: -1.5530, category: 'hostel', address: 'Sunshine Hostel, Ayeduase' },
  { id: 'wagyingo', names: ['wagyingo', 'wagyengo'], lat: 6.6672, lng: -1.5540, category: 'hostel', address: 'Wagyingo Hostel, Ayeduase' },
  { id: 'millenium', names: ['millenium', 'millennium'], lat: 6.6650, lng: -1.5535, category: 'hostel', address: 'Millennium Hostel, Ayeduase' },
  { id: 'standard', names: ['standard', 'standard hostel'], lat: 6.6638, lng: -1.5525, category: 'hostel', address: 'Standard Hostel, Ayeduase' },
  { id: 'de_vac', names: ['de vac', 'devac'], lat: 6.6628, lng: -1.5515, category: 'hostel', address: 'De-Vac Hostel, Ayeduase' },
  { id: 'shepherd', names: ['shepherd', 'shepard'], lat: 6.6612, lng: -1.5505, category: 'hostel', address: 'Shepherd Hostel, Ayeduase' },

  // --- KOTEI CLUSTER ---
  { id: 'findgrace', names: ['findgrace', 'find grace'], lat: 6.6580, lng: -1.5450, category: 'hostel', address: 'Findgrace Hostel, Kotei' },
  { id: 'p_and_g', names: ['p&g', 'p and g'], lat: 6.6572, lng: -1.5435, category: 'hostel', address: 'P&G Hostel, Kotei' },
  { id: 'peace', names: ['peace', 'peace hostel'], lat: 6.6595, lng: -1.5465, category: 'hostel', address: 'Peace Hostel, Kotei' },
  { id: 'victory', names: ['victory', 'victory towers'], lat: 6.6565, lng: -1.5420, category: 'hostel', address: 'Victory Towers, Kotei' },
  { id: 'faith', names: ['faith', 'faith hostel'], lat: 6.6585, lng: -1.5458, category: 'hostel', address: 'Faith Hostel, Kotei' },

  // --- BOMSO / AYIGYA CLUSTER ---
  { id: 'evandy', names: ['evandy', 'evandi', 'evandy annex'], lat: 6.6811, lng: -1.5583, category: 'hostel', address: 'Evandy Annex, Bomso' },
  { id: 'ultimate', names: ['ultimate', 'ultimate hostel'], lat: 6.6805, lng: -1.5575, category: 'hostel', address: 'Ultimate Hostel, Bomso' },
  { id: 'shines', names: ['shines', 'shines hostel'], lat: 6.6825, lng: -1.5605, category: 'hostel', address: 'Shines Hostel, Ayigya' },
  { id: 'besco', names: ['besco', 'besco hostel'], lat: 6.6830, lng: -1.5615, category: 'hostel', address: 'Besco Hostel, Ayigya' },
  { id: 'canam', names: ['canam', 'can am'], lat: 6.6845, lng: -1.5625, category: 'hostel', address: 'Canam Hall, Ayigya' },

  // --- LANDMARKS ---
  { id: 'ayeduase_gate', names: ['ayeduase gate', 'gate'], lat: 6.6702, lng: -1.5595, category: 'landmark', address: 'Ayeduase Gate, KNUST' },
  { id: 'knust_pool', names: ['swimming pool', 'pool side'], lat: 6.6740, lng: -1.5620, category: 'landmark', address: 'KNUST Swimming Pool' },
  { id: 'commercial_area', names: ['commercial area', 'banks'], lat: 6.6795, lng: -1.5645, category: 'landmark', address: 'Commercial Area, KNUST' }
];
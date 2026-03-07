export interface NormalizedHostel {
  canonical: string;
  aliases: string[];
}

export const HOSTELS: NormalizedHostel[] = [
  {
    canonical: 'Brunei Complex',
    aliases: [
      'brunei',
      'brunei complex',
      'brunei cmpx',
      'bruni',
      'brunei hostel'
    ]
  },
  {
    canonical: 'Unity Hall',
    aliases: ['unity', 'unity hall', 'uhall']
  },
  {
    canonical: 'Kotei Hostel',
    aliases: ['kotei', 'kotei hostel']
  }
];

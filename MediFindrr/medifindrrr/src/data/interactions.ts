export interface Interaction {
  medicines: string[];
  summary: string;
  details: string;
  recommendation: string;
}

export const interactions: Interaction[] = [
  {
    medicines: ['warfarin', 'ibuprofen'],
    summary: 'These medicines may significantly increase the risk of bleeding when taken together.',
    details: 'Ibuprofen can enhance the blood-thinning effect of Warfarin and may also irritate the stomach lining, increasing the chance of internal bleeding.',
    recommendation: 'Consult a doctor immediately before using these medicines together.'
  },
  {
    medicines: ['sildenafil', 'nitroglycerin'],
    summary: 'This combination may cause a dangerous drop in blood pressure.',
    details: 'Taking Sildenafil with Nitroglycerin can lead to sudden low blood pressure, dizziness, fainting, or more serious cardiovascular complications.',
    recommendation: 'Do not combine these medicines unless explicitly directed by a doctor.'
  },
  {
    medicines: ['warfarin', 'aspirin'],
    summary: 'This combination may raise the risk of serious bleeding.',
    details: 'Both medicines can affect clotting, and using them together may increase the chance of bruising, gastrointestinal bleeding, or other bleeding events.',
    recommendation: 'Speak to a doctor or pharmacist immediately before combining them.'
  }
];

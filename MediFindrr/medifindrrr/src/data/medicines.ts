export interface Medicine {
  id: string;
  slug: string;
  name: string;
  genericName: string;
  category: string;
  description: string;
  uses: string;
  dosage: string;
  sideEffects: {
    common: string[];
    severe: string[];
  };
  warnings: string[];
  interactions: string[];
  manufacturer?: string;
  prescriptionRequired?: boolean;
  price: number;
}

export const medicines: Medicine[] = [
  {
    id: '1',
    slug: 'augmentin-625mg',
    name: 'Augmentin 625mg',
    genericName: 'Amoxicillin + Clavulanic Acid',
    category: 'Antibiotics',
    description: 'A commonly prescribed antibiotic used for selected bacterial infections.',
    uses: 'Augmentin is an antibiotic used to treat certain bacterial infections. It combines amoxicillin with clavulanic acid to help the medicine work against a broader range of bacteria.',
    dosage: 'Take exactly as prescribed by your doctor. It is often taken with food to reduce stomach upset. Complete the full course unless a doctor tells you otherwise.',
    sideEffects: {
      common: [
        'Nausea or mild stomach upset',
        'Loose stools or mild diarrhea',
        'Headache',
        'Temporary change in taste'
      ],
      severe: [
        'Signs of a serious allergic reaction',
        'Severe skin rash or peeling',
        'Persistent vomiting or dehydration',
        'Breathing difficulty or facial swelling'
      ]
    },
    warnings: [
      'Do not use if you have a known penicillin allergy.',
      'Use with caution in kidney disease and only under medical advice.',
      'Pregnancy and breastfeeding use should be discussed with a doctor.',
      'Tell your doctor about all medicines you take before starting treatment.'
    ],
    interactions: ['Warfarin', 'Methotrexate', 'Oral contraceptives'],
    manufacturer: 'GlaxoSmithKline (GSK)',
    prescriptionRequired: true,
    price: 1450
  },
  {
    id: '2',
    slug: 'panadol',
    name: 'Panadol',
    genericName: 'Paracetamol 500mg',
    category: 'Pain Relief',
    description: 'Effective relief of fever and aches, such as headaches, sore throats, and toothaches.',
    uses: 'Used to treat mild to moderate pain (from headaches, menstrual periods, toothaches, backaches, osteoarthritis, or cold/flu aches) and to reduce fever.',
    dosage: 'Adults: 1-2 tablets every 4 to 6 hours as needed. Do not exceed 8 tablets in 24 hours.',
    sideEffects: {
      common: [
        'Rarely causes side effects when taken at recommended doses.',
        'Mild nausea'
      ],
      severe: [
        'Signs of a serious allergic reaction (rash, swelling, severe dizziness)',
        'Liver damage (if taken in extremely high doses)'
      ]
    },
    warnings: [
      'Do not exceed the recommended dose; severe liver damage may occur.',
      'Avoid regular alcohol consumption when taking this medication.',
      'Do not take with other medicines containing paracetamol/acetaminophen.'
    ],
    interactions: ['Warfarin', 'Alcohol', 'Other paracetamol products'],
    manufacturer: 'Haleon',
    prescriptionRequired: false,
    price: 320
  },
  {
    id: '3',
    slug: 'zyrtec',
    name: 'Zyrtec',
    genericName: 'Cetirizine Hydrochloride 10mg',
    category: 'Allergy Care',
    description: 'Fast-acting, 24-hour relief from indoor and outdoor allergy symptoms.',
    uses: 'Relieves runny nose, sneezing, itchy, watery eyes, and itching of the nose or throat caused by hay fever or other respiratory allergies.',
    dosage: 'Adults and children 6 years and over: One 10mg tablet once daily; do not take more than one 10mg tablet in 24 hours.',
    sideEffects: {
      common: [
        'Drowsiness',
        'Dry mouth',
        'Fatigue',
        'Headache'
      ],
      severe: [
        'Difficulty breathing or swallowing',
        'Severe dizziness',
        'Irregular heartbeat'
      ]
    },
    warnings: [
      'Use caution when driving or operating machinery as it may cause drowsiness.',
      'Avoid alcoholic beverages while taking this medicine.',
      'Consult a doctor before use if you have liver or kidney disease.'
    ],
    interactions: ['Alcohol', 'Sedatives', 'Other antihistamines'],
    manufacturer: 'UCB Pharma',
    prescriptionRequired: false,
    price: 690
  },
  {
    id: '4',
    slug: 'glucophage',
    name: 'Glucophage',
    genericName: 'Metformin Hydrochloride 500mg',
    category: 'Diabetes',
    description: 'An oral medication used to control blood sugar levels in type 2 diabetes.',
    uses: 'Used together with diet and exercise to improve blood sugar control in adults with type 2 diabetes mellitus.',
    dosage: 'Take with meals as directed by your doctor, usually 1-2 times daily.',
    sideEffects: {
      common: [
        'Diarrhea',
        'Nausea',
        'Gas',
        'Stomach pain'
      ],
      severe: [
        'Lactic acidosis (a rare but serious metabolic complication)',
        'Severe allergic reaction'
      ]
    },
    warnings: [
      'Not for treating type 1 diabetes.',
      'Avoid excessive alcohol consumption to reduce the risk of lactic acidosis.',
      'Monitor kidney function regularly while taking this medication.'
    ],
    interactions: ['Cimetidine', 'Diuretics', 'Iodinated contrast materials'],
    manufacturer: 'Merck',
    prescriptionRequired: true,
    price: 980
  },
  {
    id: '5',
    slug: 'nexium',
    name: 'Nexium',
    genericName: 'Esomeprazole Magnesium 40mg',
    category: 'Stomach Care',
    description: 'Reduces the amount of acid produced in the stomach.',
    uses: 'Treats gastroesophageal reflux disease (GERD), stomach ulcers, and conditions involving excessive stomach acid.',
    dosage: 'Usually taken once daily, at least one hour before a meal, for 4 to 8 weeks.',
    sideEffects: {
      common: [
        'Headache',
        'Diarrhea',
        'Nausea',
        'Abdominal pain'
      ],
      severe: [
        'Severe stomach pain',
        'Signs of low magnesium (dizziness, fast heart rate, muscle spasms)',
        'Kidney problems'
      ]
    },
    warnings: [
      'Long-term use may increase the risk of bone fractures.',
      'May reduce the absorption of certain nutrients like Vitamin B12.',
      'Not intended for immediate relief of heartburn symptoms.'
    ],
    interactions: ['Clopidogrel', 'Diazepam', 'Ketoconazole'],
    manufacturer: 'AstraZeneca',
    prescriptionRequired: true,
    price: 1180
  }
];

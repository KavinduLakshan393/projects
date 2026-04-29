export interface Medicine {
  id: string
  slug: string
  name: string
  genericName: string
  category: string
  description: string
  uses: string[]
  dosage: string
  sideEffects: {
    common: string[]
    severe: string[]
  }
  warnings: string[]
  interactions: string[]
  manufacturer: string
  prescriptionRequired: boolean
  price: number
}

export const medicines: Medicine[] = [
  {
    id: '1',
    slug: 'augmentin-625mg',
    name: 'Augmentin 625mg',
    genericName: 'Amoxicillin + Clavulanic Acid',
    category: 'Antibiotics',
    description: 'An antibiotic used for selected bacterial infections when prescribed by a qualified healthcare professional.',
    uses: [
      'Selected respiratory tract infections',
      'Selected ear, nose, and throat infections',
      'Selected skin and soft tissue infections',
      'Selected urinary tract infections',
    ],
    dosage: 'Take only as prescribed. It is often taken with food to reduce stomach upset. Complete the prescribed course unless your doctor advises otherwise.',
    sideEffects: {
      common: [
        'Nausea',
        'Mild stomach upset',
        'Loose stools',
        'Headache',
      ],
      severe: [
        'Serious allergic reaction',
        'Severe skin rash',
        'Breathing difficulty',
        'Persistent vomiting or dehydration',
      ],
    },
    warnings: [
      'Do not use if you have a known penicillin allergy.',
      'Use with caution in kidney disease and only under medical advice.',
      'Tell your doctor about all medicines you take before starting treatment.',
      'This information is educational and does not replace medical advice.',
    ],
    interactions: ['Warfarin', 'Methotrexate', 'Oral contraceptives'],
    manufacturer: 'GlaxoSmithKline',
    prescriptionRequired: true,
    price: 1450,
  },
  {
    id: '2',
    slug: 'panadol',
    name: 'Panadol',
    genericName: 'Paracetamol 500mg',
    category: 'Pain Relief',
    description: 'A common medicine used for mild to moderate pain and fever relief when taken at recommended doses.',
    uses: [
      'Headache',
      'Fever',
      'Toothache',
      'Body aches',
      'Cold and flu-related aches',
    ],
    dosage: 'Adults commonly take 1 to 2 tablets every 4 to 6 hours as needed. Do not exceed the recommended daily dose shown on the product label or advised by a healthcare professional.',
    sideEffects: {
      common: [
        'Usually well tolerated at recommended doses',
        'Mild nausea',
      ],
      severe: [
        'Serious allergic reaction',
        'Liver damage if taken above the recommended dose',
      ],
    },
    warnings: [
      'Do not take with other products containing paracetamol or acetaminophen.',
      'Avoid exceeding the recommended dose.',
      'Ask a healthcare professional before use if you have liver disease.',
      'This information is educational and does not replace medical advice.',
    ],
    interactions: ['Warfarin', 'Alcohol', 'Other paracetamol products'],
    manufacturer: 'Haleon',
    prescriptionRequired: false,
    price: 320,
  },
  {
    id: '3',
    slug: 'zyrtec',
    name: 'Zyrtec',
    genericName: 'Cetirizine Hydrochloride 10mg',
    category: 'Allergy Care',
    description: 'An antihistamine used for allergy symptoms such as sneezing, runny nose, and itchy or watery eyes.',
    uses: [
      'Seasonal allergies',
      'Indoor allergies',
      'Sneezing',
      'Runny nose',
      'Itchy or watery eyes',
    ],
    dosage: 'Adults and children over 6 years commonly take one 10mg tablet once daily. Follow the product label or medical advice.',
    sideEffects: {
      common: [
        'Drowsiness',
        'Dry mouth',
        'Fatigue',
        'Headache',
      ],
      severe: [
        'Difficulty breathing',
        'Severe dizziness',
        'Irregular heartbeat',
      ],
    },
    warnings: [
      'May cause drowsiness. Be careful when driving or operating machinery.',
      'Avoid alcohol while taking this medicine.',
      'Ask a doctor before use if you have liver or kidney disease.',
      'This information is educational and does not replace medical advice.',
    ],
    interactions: ['Alcohol', 'Sedatives', 'Other antihistamines'],
    manufacturer: 'UCB Pharma',
    prescriptionRequired: false,
    price: 690,
  },
  {
    id: '4',
    slug: 'glucophage',
    name: 'Glucophage',
    genericName: 'Metformin Hydrochloride 500mg',
    category: 'Diabetes',
    description: 'An oral medicine used to help control blood sugar levels in people with type 2 diabetes.',
    uses: [
      'Type 2 diabetes management',
      'Blood sugar control',
      'Used with diet and exercise as advised by a doctor',
    ],
    dosage: 'Take with meals as directed by your doctor. Dose depends on individual medical condition and response.',
    sideEffects: {
      common: [
        'Nausea',
        'Diarrhea',
        'Gas',
        'Stomach discomfort',
      ],
      severe: [
        'Lactic acidosis',
        'Severe allergic reaction',
      ],
    },
    warnings: [
      'Not for treating type 1 diabetes unless specifically directed by a doctor.',
      'Kidney function may need monitoring.',
      'Avoid excessive alcohol consumption.',
      'This information is educational and does not replace medical advice.',
    ],
    interactions: ['Cimetidine', 'Diuretics', 'Iodinated contrast materials'],
    manufacturer: 'Merck',
    prescriptionRequired: true,
    price: 980,
  },
  {
    id: '5',
    slug: 'nexium',
    name: 'Nexium',
    genericName: 'Esomeprazole Magnesium 40mg',
    category: 'Stomach Care',
    description: 'A proton pump inhibitor used to reduce stomach acid production.',
    uses: [
      'Gastroesophageal reflux disease',
      'Stomach ulcers',
      'Excess stomach acid conditions',
    ],
    dosage: 'Usually taken once daily before food, but the exact dose and duration should follow medical advice.',
    sideEffects: {
      common: [
        'Headache',
        'Nausea',
        'Diarrhea',
        'Abdominal pain',
      ],
      severe: [
        'Severe stomach pain',
        'Signs of low magnesium',
        'Kidney problems',
      ],
    },
    warnings: [
      'Long-term use should be discussed with a doctor.',
      'May affect absorption of some nutrients.',
      'Not intended for immediate relief of sudden heartburn.',
      'This information is educational and does not replace medical advice.',
    ],
    interactions: ['Clopidogrel', 'Diazepam', 'Ketoconazole'],
    manufacturer: 'AstraZeneca',
    prescriptionRequired: true,
    price: 1180,
  },
  {
    id: '6',
    slug: 'aspirin-protect',
    name: 'Aspirin Protect',
    genericName: 'Aspirin 100mg',
    category: 'Heart Health',
    description: 'A low-dose aspirin product sometimes used under medical supervision for cardiovascular protection.',
    uses: [
      'Cardiovascular risk reduction when prescribed',
      'Blood clot prevention under medical advice',
    ],
    dosage: 'Use only as directed by a healthcare professional. Do not start daily aspirin without medical advice.',
    sideEffects: {
      common: [
        'Stomach irritation',
        'Mild nausea',
        'Heartburn',
      ],
      severe: [
        'Bleeding',
        'Severe allergic reaction',
        'Black stools or vomiting blood',
      ],
    },
    warnings: [
      'May increase bleeding risk.',
      'Do not use with blood thinners unless advised by a doctor.',
      'Avoid use in children or teenagers unless specifically directed by a healthcare professional.',
      'This information is educational and does not replace medical advice.',
    ],
    interactions: ['Warfarin', 'Ibuprofen', 'Other blood thinners'],
    manufacturer: 'Bayer',
    prescriptionRequired: true,
    price: 760,
  },
]

export const medicineCategories = Array.from(
  new Set(medicines.map((medicine) => medicine.category)),
)

export function findMedicineBySlug(slug?: string): Medicine | undefined {
  if (!slug) return undefined
  return medicines.find((medicine) => medicine.slug === slug)
}

export function searchMedicines(query: string, category?: string): Medicine[] {
  const normalizedQuery = query.trim().toLowerCase()
  const normalizedCategory = category?.trim().toLowerCase()

  return medicines.filter((medicine) => {
    const matchesCategory =
      !normalizedCategory || medicine.category.toLowerCase() === normalizedCategory

    const searchableText = [
      medicine.name,
      medicine.genericName,
      medicine.category,
      medicine.description,
      ...medicine.uses,
      ...medicine.interactions,
    ]
      .join(' ')
      .toLowerCase()

    const matchesQuery = !normalizedQuery || searchableText.includes(normalizedQuery)

    return matchesCategory && matchesQuery
  })
}
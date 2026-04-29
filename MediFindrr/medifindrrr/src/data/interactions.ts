export type InteractionSeverity = 'High' | 'Moderate' | 'Low'

export interface DrugInteraction {
  id: string
  medicines: [string, string]
  severity: InteractionSeverity
  title: string
  description: string
  recommendation: string
}

export const demoInteractions: DrugInteraction[] = [
  {
    id: 'warfarin-ibuprofen',
    medicines: ['Warfarin', 'Ibuprofen'],
    severity: 'High',
    title: 'Increased bleeding risk',
    description:
      'Using warfarin together with ibuprofen may increase the risk of bleeding. This combination requires professional medical guidance.',
    recommendation:
      'Do not combine these medicines unless a qualified healthcare professional has specifically advised it.',
  },
  {
    id: 'sildenafil-nitroglycerin',
    medicines: ['Sildenafil', 'Nitroglycerin'],
    severity: 'High',
    title: 'Dangerous blood pressure drop risk',
    description:
      'Using sildenafil together with nitroglycerin may cause a serious drop in blood pressure.',
    recommendation:
      'This combination should be avoided unless a specialist gives clear medical direction.',
  },
  {
    id: 'warfarin-aspirin',
    medicines: ['Warfarin', 'Aspirin'],
    severity: 'High',
    title: 'Increased bleeding risk',
    description:
      'Using warfarin together with aspirin may increase bleeding risk, especially without medical supervision.',
    recommendation:
      'Ask a qualified healthcare professional before using these medicines together.',
  },
]

export const noInteractionFoundMessage =
  'No interaction was found in this demo database. This does not confirm medical safety. Please consult a qualified healthcare professional.'

export function normalizeMedicineName(value: string): string {
  return value
    .toLowerCase()
    .replace(/\b(tablet|capsule|mg|mcg|ml|g|sirup|syrup)\b/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function matchesMedicineInput(input: string, medicineName: string): boolean {
  const normalizedInput = normalizeMedicineName(input)
  const normalizedMedicine = normalizeMedicineName(medicineName)

  if (!normalizedInput || !normalizedMedicine) return false

  return (
    normalizedInput === normalizedMedicine ||
    normalizedInput.includes(normalizedMedicine) ||
    normalizedMedicine.includes(normalizedInput)
  )
}

export function findInteraction(
  firstMedicine: string,
  secondMedicine: string,
): DrugInteraction | undefined {
  return demoInteractions.find((interaction) => {
    const [medicineA, medicineB] = interaction.medicines

    const directMatch =
      matchesMedicineInput(firstMedicine, medicineA) &&
      matchesMedicineInput(secondMedicine, medicineB)

    const reverseMatch =
      matchesMedicineInput(firstMedicine, medicineB) &&
      matchesMedicineInput(secondMedicine, medicineA)

    return directMatch || reverseMatch
  })
}
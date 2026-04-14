import type { PatientCase, CaseStatusFilter, CaseStepFilter } from '../types/case'

export function useCaseFilters(
  cases: PatientCase[],
  searchQuery: string,
  statusFilter: CaseStatusFilter,
  stepFilter: CaseStepFilter,
) {
  return cases.filter((caseItem) => {
    // Search filter - checks patient name, doctor name, and website name
    const searchLower = searchQuery.toLowerCase()
    const matchesSearch =
      caseItem.patientName.toLowerCase().includes(searchLower) ||
      caseItem.doctorName.toLowerCase().includes(searchLower) ||
      caseItem.websiteName.toLowerCase().includes(searchLower)

    if (!matchesSearch) return false

    // Status filter
    if (statusFilter !== 'all' && caseItem.status !== statusFilter) {
      return false
    }

    // Step filter
    if (stepFilter !== 'all') {
      if (stepFilter === 'empty') {
        // Show cases with no steps completed
        const hasAnyStep = Object.values(caseItem.steps).some((step) => step.completed === true)
        return !hasAnyStep
      } else {
        // Show cases with specific step completed
        return caseItem.steps[stepFilter]?.completed === true
      }
    }

    return true
  })
}

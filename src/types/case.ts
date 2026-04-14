export type WebsiteName = 'softSmile' | 'orthero' | 'DSmile'
export type CaseStatus = 'open' | 'closed'
export type CaseStatusFilter = 'all' | CaseStatus
export type CaseStep = 'stl' | 'printing' | 'stacking' | 'finishing' | 'delivered'
export type CaseStepFilter = 'all' | 'empty' | CaseStep

export interface CaseStepDetail { 
  completed: boolean
  notes?: string
}

export interface CaseSteps {
  stl: CaseStepDetail
  printing: CaseStepDetail
  stacking: CaseStepDetail
  finishing: CaseStepDetail
  delivered: CaseStepDetail
}

export interface PatientCase {
  id: string
  patientName: string
  doctorName: string
  websiteName: WebsiteName
  status: CaseStatus
  steps: CaseSteps
  createdAt: Date
  updatedAt: Date
}

export interface NewPatientCaseInput {
  patientName: string
  doctorName: string
  websiteName: WebsiteName
  status: CaseStatus
}

export const CASE_STEP_OPTIONS: Array<{
  value: CaseStepFilter
  label: string
}> = [
  { value: 'all', label: 'All Steps' },
  { value: 'empty', label: 'No Steps Completed' },
  { value: 'stl', label: 'STL Design' },
  { value: 'printing', label: 'Printing' },
  { value: 'stacking', label: 'Stacking' },
  { value: 'finishing', label: 'Finishing' },
  { value: 'delivered', label: 'Delivered' },
]

export const PRODUCTION_STEP_OPTIONS: Array<{
  value: CaseStep
  label: string
}> = [
  { value: 'stl', label: 'STL Design' },
  { value: 'printing', label: 'Printing' },
  { value: 'stacking', label: 'Stacking' },
  { value: 'finishing', label: 'Finishing' },
  { value: 'delivered', label: 'Delivered' },
]

export const CASE_STATUS_OPTIONS: Array<{
  value: CaseStatusFilter
  label: string
}> = [
  { value: 'all', label: 'All' },
  { value: 'open', label: 'Open' },
  { value: 'closed', label: 'Closed' },
]
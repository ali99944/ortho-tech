import { create } from 'zustand'
import type { CaseStatusFilter, CaseStepFilter } from '../types/case'

interface CaseFilterState {
  searchQuery: string
  statusFilter: CaseStatusFilter
  stepFilter: CaseStepFilter
  setSearchQuery: (query: string) => void
  setStatusFilter: (status: CaseStatusFilter) => void
  setStepFilter: (step: CaseStepFilter) => void
  reset: () => void
}

const initialState = {
  searchQuery: '',
  statusFilter: 'all' as const,
  stepFilter: 'all' as const,
}

export const useCaseFilterStore = create<CaseFilterState>((set) => ({
  ...initialState,
  setSearchQuery: (query: string) => set({ searchQuery: query }),
  setStatusFilter: (status: CaseStatusFilter) => set({ statusFilter: status }),
  setStepFilter: (step: CaseStepFilter) => set({ stepFilter: step }),
  reset: () => set(initialState),
}))

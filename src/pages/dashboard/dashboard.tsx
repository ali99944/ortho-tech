import React, { useEffect, useState } from 'react'
import Toolbar from './components/toolbar'
import { CaseItem } from './components/case-item'
import { CreateCaseModal } from './components/create-case-modal'
import { subscribeToCases, updateCase, deleteCase } from '../../services/cases'
import { useCaseFilters } from '../../hooks/useCaseFilters'
import { useCaseFilterStore } from '../../stores/caseFilterStore'
import type { PatientCase } from '../../types/case'
import { Pagination } from './components/pagination'
import { CaseListHeader } from './components/case-list-header'

function Dashboard() {
  const [allCases, setAllCases] = useState<PatientCase[]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const searchQuery = useCaseFilterStore((state) => state.searchQuery)
  const statusFilter = useCaseFilterStore((state) => state.statusFilter)
  const stepFilter = useCaseFilterStore((state) => state.stepFilter)

  const PER_PAGE = 6
  const [page, setPage] = useState(1)
  
  // Reset page when filters change
  useEffect(() => setPage(1), [searchQuery, statusFilter, stepFilter])

  // Subscribe to cases from Firebase/preview
  useEffect(() => {
    const unsubscribe = subscribeToCases({
      onData: (cases) => setAllCases(cases),
      onError: (error) => console.error('Failed to fetch cases:', error),
    })

    return () => unsubscribe()
  }, [])
  
  // Apply filters
  const filteredCases = useCaseFilters(allCases, searchQuery, statusFilter, stepFilter)
  const paginated = filteredCases.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const handleDeleteCase = async (id: string) => {
    try {
      await deleteCase(id)
      setAllCases((prev) => prev.filter((c) => c.id !== id))
    } catch (error) {
      console.error('Failed to delete case:', error)
    }
  }

  const handleUpdateCase = async (updatedCase: PatientCase) => {
    try {
      await updateCase(updatedCase.id, {
        ...updatedCase,
        updatedAt: new Date(),
      })
      setAllCases((prev) =>
        prev.map((c) => (c.id === updatedCase.id ? updatedCase : c))
      )
    } catch (error) {
      console.error('Failed to update case:', error)
    }
  }

  return (
    <div className="p-3 max-w-7xl mx-auto">
      <Toolbar onAddNewPatient={() => setIsCreateModalOpen(true)} />
      {/* Cases section */}
      
      <div className="mt-6">
        {paginated.length === 0 ? (
          <div className="text-center py-12 text-text-muted">
            <p>No cases found</p>
          </div>
        ) : (
          <div className="grid gap-2">
            <CaseListHeader />
            {paginated.map((caseItem) => (
              <CaseItem
                key={caseItem.id}
                caseItem={caseItem}
                onDelete={handleDeleteCase}
                onUpdate={handleUpdateCase}
              />
            ))}
          </div>
        )}
      </div>
      <Pagination
        currentPage={page}
        totalPages={Math.ceil(filteredCases.length / PER_PAGE)}
        totalItems={filteredCases.length}
        perPage={PER_PAGE}
        onPageChange={setPage}
      />
      <CreateCaseModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  )
}

export default Dashboard
import React, { useMemo } from 'react'
import { Input } from '../../../components/input'
import { Button } from '../../../components/button'
import { DropdownMenu, DropdownMenuCheckItem, DropdownMenuLabel, DropdownMenuSeparator } from '../../../components/dropdown-menu'
import { PlusIcon, Filter } from 'lucide-react'
import { useCaseFilterStore } from '../../../stores/caseFilterStore'
import { CASE_STATUS_OPTIONS, CASE_STEP_OPTIONS } from '../../../types/case'
import { cn } from '../../../lib/cn'

interface ToolbarProps {
  onAddNewPatient: () => void
}

function Toolbar({ onAddNewPatient }: ToolbarProps) {
  const searchQuery = useCaseFilterStore((state) => state.searchQuery)
  const statusFilter = useCaseFilterStore((state) => state.statusFilter)
  const stepFilter = useCaseFilterStore((state) => state.stepFilter)
  const setSearchQuery = useCaseFilterStore((state) => state.setSearchQuery)
  const setStatusFilter = useCaseFilterStore((state) => state.setStatusFilter)
  const setStepFilter = useCaseFilterStore((state) => state.setStepFilter)

  // Get display labels for selected filters
  const statusLabel = useMemo(
    () => CASE_STATUS_OPTIONS.find((opt) => opt.value === statusFilter)?.label || 'All',
    [statusFilter]
  )

  const stepLabel = useMemo(
    () =>
      stepFilter === 'all'
        ? 'All'
        : stepFilter === 'empty'
          ? 'No Steps'
          : CASE_STEP_OPTIONS.find((opt) => opt.value === stepFilter)?.label || 'All',
    [stepFilter]
  )

  return (
    <div className="flex items-center gap-2 w-full">
      <Input
        wrapperClassName="flex-1 bg-white"
        placeholder="search patient name, doctor"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Status Filter Dropdown */}
      <DropdownMenu
        trigger={
          <div className={cn(
            "px-3 h-7 rounded text-sm font-medium cursor-pointer",
            "hover:bg-secondary-tint transition-colors",
            "bg-secondary-tint hover:bg-secondary-tint/80 text-secondary"
          )}>
            <div className="flex items-center gap-2 h-full">
              <Filter className='w-4 h-4' />
              <span className='text-xs'>status - {statusLabel}</span>
            </div>
          </div>
        }
      >
        <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {CASE_STATUS_OPTIONS.map((option) => (
          <DropdownMenuCheckItem
            key={option.value}
            checked={statusFilter === option.value}
            onCheckedChange={() => setStatusFilter(option.value)}
            group="status"
          >
            {option.label}
          </DropdownMenuCheckItem>
        ))}
      </DropdownMenu>

      {/* Step Filter Dropdown */}
      <DropdownMenu
        trigger={
          <div className={cn(
            "px-3 h-7 rounded text-sm font-medium cursor-pointer",
            "bg-secondary-tint transition-colors",
            stepFilter !== 'all' && "bg-secondary-tint text-secondary hover:bg-secondary-tint/80"
          )}>
            <div className="flex items-center gap-2 h-full">
              <Filter className='w-4 h-4' />
              <span className='text-xs'>step - {stepLabel}</span>
            </div>
          </div>
        }
      >
        <DropdownMenuLabel>Filter by Step</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {CASE_STEP_OPTIONS.map((option) => (
          <DropdownMenuCheckItem
            key={option.value}
            checked={stepFilter === option.value}
            onCheckedChange={() => setStepFilter(option.value)}
            group="step"
          >
            {option.label}
          </DropdownMenuCheckItem>
        ))}
      </DropdownMenu>

      <Button size="sm" leftIcon={<PlusIcon />} onClick={onAddNewPatient}>
        Add New Patient
      </Button>
    </div>
  )
}

export default Toolbar
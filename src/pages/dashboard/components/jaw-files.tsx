import React, { useState } from 'react'
import { PatientCase } from '../../../types/case'
import { Modal } from '../../../components/modal'
import { StlViewer } from '../../../components/stl-viewer'
import { Edit2, Trash2, Plus, X, Check, DownloadIcon, Eye, FileIcon } from 'lucide-react'
import { Button } from '../../../components/button'
import { Input } from '../../../components/input'
import { cn } from '../../../lib/cn'

interface StlFilesProps {
    caseItem: PatientCase
    onUpdate?: (updatedCase: PatientCase) => void
}

export default function StlFiles({ caseItem, onUpdate }: StlFilesProps) {
    const [editingIndex, setEditingIndex] = useState<number | null>(null)
    const [isAddingNew, setIsAddingNew] = useState(false)
    const [viewFile, setViewFile] = useState<string | null>(null)
    const [tempName, setTempName] = useState('')
    const [tempFile, setTempFile] = useState('')

    const startEdit = (index: number) => {
        setEditingIndex(index)
        setTempName(caseItem.jawFiles[index]?.jaw_name ?? '')
        setTempFile(caseItem.jawFiles[index]?.jaw_stl_file ?? '')
    }

    const startAdd = () => {
        setIsAddingNew(true)
        setTempName('')
        setTempFile('')
    }

    const save = () => {
        const newJawFiles = [...caseItem.jawFiles]
        if (isAddingNew) {
            newJawFiles.push({ jaw_name: tempName, jaw_stl_file: tempFile })
        } else if (editingIndex !== null) {
            newJawFiles[editingIndex] = { jaw_name: tempName, jaw_stl_file: tempFile }
        }
        onUpdate?.({ ...caseItem, jawFiles: newJawFiles })
        cancelEdit()
    }

    const cancelEdit = () => {
        setEditingIndex(null)
        setIsAddingNew(false)
        setTempName('')
        setTempFile('')
    }

    const deleteJawFile = (index: number) => {
        const newJawFiles = caseItem.jawFiles.filter((_, i) => i !== index)
        onUpdate?.({ ...caseItem, jawFiles: newJawFiles })
    }

    const viewInViewer = (stlFile: string) => {
        setViewFile(stlFile)
    }

    const downloadFile = (stlFile: string) => {
        if (!stlFile) return
        if (!stlFile.startsWith('http://') && !stlFile.startsWith('https://')) {
            console.error('Invalid download URL:', stlFile)
            return
        }

        try {
            const url = new URL(stlFile)
            
            if (url.protocol !== 'http:' && url.protocol !== 'https:') {
                console.error('Invalid download protocol:', stlFile)
                return
            }

            const link = document.createElement('a')
            link.href = stlFile
            link.setAttribute('target', '_blank')
            link.download = 'jaw.stl'
            link.click()
        } catch (error) {
            console.error('Error downloading file:', error)
        }
    }

    const hasFiles = caseItem.jawFiles.length > 0

    return (
        <>
            <div className="space-y-6">
                {/* Section Header */}
                <div className="space-y-1">
                    <div className="flex items-baseline justify-between">
                        <div className="space-y-1">
                            <h3 className="text-base font-semibold text-gray-900">Jaw STL Files</h3>
                            <p className="text-sm text-gray-600">
                                Detailed 3D jaw model files for visualization and analysis
                            </p>
                        </div>
                        {hasFiles && (
                            <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 border border-blue-200">
                                {caseItem.jawFiles.length} file{caseItem.jawFiles.length !== 1 ? 's' : ''}
                            </span>
                        )}
                    </div>
                </div>

                {/* Add Section Hint */}
                {!hasFiles && !isAddingNew && (
                    <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 space-y-3">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-0.5">
                                <FileIcon className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="space-y-2 flex-1">
                                <h4 className="font-medium text-sm text-blue-900">
                                    What are Jaw STL Files?
                                </h4>
                                <p className="text-sm text-blue-800">
                                    Use this section to upload additional or detailed STL files related to your jaw models. Examples include upper jaw, lower jaw, or specific anatomical variants.
                                </p>
                                <div className="flex flex-wrap gap-2 pt-2">
                                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Upper Jaw</span>
                                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Lower Jaw</span>
                                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Full Jaw Assembly</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Add New File Form */}
                {isAddingNew && (
                    <div className="rounded-lg border border-gray-200 p-4 space-y-3 bg-gray-50">
                        <h4 className="text-sm font-medium text-gray-900">Add New Jaw File</h4>
                        <div className="space-y-3">
                            <div className="flex flex-col gap-3">
                                <Input
                                    placeholder="Jaw Name (e.g., Upper Jaw, Lower Jaw)"
                                    value={tempName}
                                    wrapperClassName='flex-1'
                                    onChange={(e) => setTempName(e.target.value)}
                                />
                                <Input
                                    placeholder="STL File URL or Path"
                                    value={tempFile}
                                    wrapperClassName='flex-1'
                                    onChange={(e) => setTempFile(e.target.value)}
                                />
                            </div>
                            <div className="flex items-center gap-2 justify-end">
                                <Button
                                    onClick={cancelEdit}
                                    size="sm"
                                    variant="outline"
                                    leftIcon={<X size={16} />}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={save}
                                    size="sm"
                                    leftIcon={<Check size={16} />}
                                >
                                    Save File
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Files Grid */}
                {hasFiles && (
                    <div className="space-y-3">
                        <div className="grid max-sm:grid-cols-1 grid-cols-2 gap-3">
                            {caseItem.jawFiles.map((jaw, index) => (
                                <div
                                    key={index}
                                    className={cn(
                                        'rounded-lg border transition-all duration-200',
                                        editingIndex === index
                                            ? 'border-blue-300 bg-blue-50'
                                            : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                                    )}
                                >
                                    {editingIndex === index ? (
                                        // Edit Mode
                                        <div className="p-4 space-y-3">
                                            <h4 className="text-sm font-medium text-gray-900">Edit Jaw File</h4>
                                            <Input
                                                placeholder="Jaw Name"
                                                value={tempName}
                                                onChange={(e) => setTempName(e.target.value)}
                                            />
                                            <Input
                                                placeholder="STL File URL/Path"
                                                value={tempFile}
                                                onChange={(e) => setTempFile(e.target.value)}
                                            />
                                            <div className="flex items-center gap-2 justify-end pt-2">
                                                <Button
                                                    onClick={cancelEdit}
                                                    size="sm"
                                                    variant="outline"
                                                    leftIcon={<X size={16} />}
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    onClick={save}
                                                    size="sm"
                                                    leftIcon={<Check size={16} />}
                                                >
                                                    Save
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        // View Mode
                                        <div className="p-4 space-y-3">
                                            <div className="flex items-start justify-between">
                                                <div className="space-y-1 flex-1 min-w-0">
                                                    <h4 className="text-sm font-medium text-gray-900 truncate">
                                                        {jaw.jaw_name}
                                                    </h4>
                                                    <p className="text-xs text-gray-500 truncate">
                                                        {jaw.jaw_stl_file.split('/').pop() || 'STL File'}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Action Buttons - View, Download, Edit, Delete */}
                                            <div className="grid grid-cols-2 gap-2 pt-1">
                                                <ActionBtn
                                                    title="View in 3D Viewer"
                                                    onClick={() => viewInViewer(jaw.jaw_stl_file)}
                                                    disabled={editingIndex !== null || isAddingNew}
                                                    variant="primary"
                                                    icon={<Eye size={14} />}
                                                    label="View"
                                                />
                                                <ActionBtn
                                                    title="Download File"
                                                    onClick={() => downloadFile(jaw.jaw_stl_file)}
                                                    disabled={editingIndex !== null || isAddingNew}
                                                    variant="secondary"
                                                    icon={<DownloadIcon size={14} />}
                                                    label="Download"
                                                />
                                            </div>

                                            {/* Edit and Delete Buttons */}
                                            <div className="grid grid-cols-2 gap-2">
                                                <ActionBtn
                                                    title="Edit"
                                                    onClick={() => startEdit(index)}
                                                    disabled={editingIndex !== null || isAddingNew}
                                                    variant="edit"
                                                    icon={<Edit2 size={14} />}
                                                    label="Edit"
                                                />
                                                <ActionBtn
                                                    title="Delete"
                                                    onClick={() => deleteJawFile(index)}
                                                    disabled={editingIndex !== null || isAddingNew}
                                                    variant="danger"
                                                    icon={<Trash2 size={14} />}
                                                    label="Delete"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Add File Button - Below files or in empty state */}
                {!isAddingNew && (
                    <Button
                        onClick={startAdd}
                        size="sm"
                        className="flex items-center gap-2"
                        disabled={editingIndex !== null || isAddingNew}
                        leftIcon={<Plus size={16} />}
                    >
                        Add Jaw File
                    </Button>
                )}
            </div>

            {/* STL Viewer Modal */}
            {viewFile && (
                <Modal
                    open={!!viewFile}
                    onClose={() => setViewFile(null)}
                    title="STL Viewer"
                >
                    <div className="h-96">
                        <StlViewer filePath={viewFile} />
                    </div>
                </Modal>
            )}
        </>
    )
}

function ActionBtn({
    children,
    title,
    onClick,
    disabled,
    variant = 'secondary',
    icon,
    label,
}: {
    children?: React.ReactNode
    title: string
    onClick: (e: React.MouseEvent) => void
    disabled?: boolean
    variant?: 'primary' | 'secondary' | 'edit' | 'danger'
    icon?: React.ReactNode
    label?: string
}) {
    const variantClasses = {
        primary: 'bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 hover:border-blue-300',
        secondary: 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 hover:border-gray-300',
        edit: 'bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 hover:border-amber-300',
        danger: 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 hover:border-red-300',
    }

    return (
        <button
            title={title}
            onClick={onClick}
            disabled={disabled}
            className={cn(
                'flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium transition-colors duration-150',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                variantClasses[variant]
            )}
        >
            {icon}
            {label && <span>{label}</span>}
            {children}
        </button>
    )
}

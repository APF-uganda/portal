import React, { useState, useRef, useEffect } from 'react'
import { Filter, ChevronDown, Check } from 'lucide-react'
import { Button } from '../ui/button'

interface FilterOption {
  key: string
  label: string
  count?: number
}

interface NotificationFilterProps {
  activeFilter: string
  onFilterChange: (filter: string) => void
  options: FilterOption[]
  loading?: boolean
}

const NotificationFilter: React.FC<NotificationFilterProps> = ({
  activeFilter,
  onFilterChange,
  options,
  loading = false
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleFilterSelect = (filterKey: string) => {
    onFilterChange(filterKey)
    setIsOpen(false)
  }

  const activeOption = options.find(option => option.key === activeFilter)

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        disabled={loading}
        className="flex items-center gap-2 min-w-[120px] justify-between"
      >
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4" />
          <span>{activeOption?.label || 'Filter'}</span>
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="py-2">
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100">
              Filter Notifications
            </div>
            {options.map((option) => (
              <button
                key={option.key}
                onClick={() => handleFilterSelect(option.key)}
                className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 transition-colors flex items-center justify-between ${
                  activeFilter === option.key ? 'bg-purple-50 text-purple-600' : 'text-gray-700'
                }`}
              >
                <span>{option.label}</span>
                <div className="flex items-center gap-2">
                  {typeof option.count === 'number' && (
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      activeFilter === option.key 
                        ? 'bg-purple-100 text-purple-600' 
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {option.count}
                    </span>
                  )}
                  {activeFilter === option.key && (
                    <Check className="w-4 h-4 text-purple-600" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationFilter
"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export interface CalendarProps {
  mode?: "single" | "range"
  selected?: Date | { from: Date; to?: Date }
  onSelect?: (date: Date | { from: Date; to?: Date } | undefined) => void
  captionLayout?: "dropdown" | "dropdown-buttons" | "buttons"
  className?: string
}

function Calendar({
  mode = "single",
  selected,
  onSelect,
  captionLayout = "dropdown",
  className,
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(new Date())
  const [currentYear, setCurrentYear] = React.useState(new Date().getFullYear())

  const today = new Date()
  const firstDayOfMonth = new Date(currentYear, currentMonth.getMonth(), 1)
  const lastDayOfMonth = new Date(currentYear, currentMonth.getMonth() + 1, 0)
  const firstDayOfWeek = firstDayOfMonth.getDay()
  const daysInMonth = lastDayOfMonth.getDate()

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const getDaysInMonth = () => {
    const days = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(currentYear, currentMonth.getMonth(), day))
    }
    
    return days
  }

  const isSelected = (date: Date) => {
    if (!selected) return false
    if (mode === "single" && selected instanceof Date) {
      return date.toDateString() === selected.toDateString()
    }
    return false
  }

  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString()
  }

  const handleDateClick = (date: Date) => {
    if (onSelect) {
      onSelect(date)
    }
  }

  const handlePrevMonth = () => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev)
      newMonth.setMonth(prev.getMonth() - 1)
      setCurrentYear(newMonth.getFullYear())
      return newMonth
    })
  }

  const handleNextMonth = () => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev)
      newMonth.setMonth(prev.getMonth() + 1)
      setCurrentYear(newMonth.getFullYear())
      return newMonth
    })
  }

  const handleMonthChange = (month: number) => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev)
      newMonth.setMonth(month)
      return newMonth
    })
  }

  const handleYearChange = (year: number) => {
    setCurrentYear(year)
    setCurrentMonth(prev => {
      const newMonth = new Date(prev)
      newMonth.setFullYear(year)
      return newMonth
    })
  }

  const days = getDaysInMonth()

  return (
    <div className={cn("p-3", className)}>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handlePrevMonth}
          className="h-7 w-7 p-0 hover:bg-accent hover:text-accent-foreground rounded-md"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        
        {captionLayout === "dropdown" ? (
          <div className="flex gap-2">
            <select
              value={currentMonth.getMonth()}
              onChange={(e) => handleMonthChange(parseInt(e.target.value))}
              className="text-sm font-medium bg-transparent border-none outline-none"
            >
              {monthNames.map((month, index) => (
                <option key={month} value={index}>
                  {month}
                </option>
              ))}
            </select>
            <select
              value={currentYear}
              onChange={(e) => handleYearChange(parseInt(e.target.value))}
              className="text-sm font-medium bg-transparent border-none outline-none"
            >
              {Array.from({ length: 10 }, (_, i) => currentYear - 5 + i).map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="text-sm font-medium">
            {monthNames[currentMonth.getMonth()]} {currentYear}
          </div>
        )}
        
        <button
          onClick={handleNextMonth}
          className="h-7 w-7 p-0 hover:bg-accent hover:text-accent-foreground rounded-md"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="text-muted-foreground text-xs font-medium text-center p-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => (
          <div key={index} className="relative">
            {date ? (
              <button
                onClick={() => handleDateClick(date)}
                className={cn(
                  "h-9 w-9 p-0 font-normal text-sm rounded-md hover:bg-accent hover:text-accent-foreground",
                  isSelected(date) && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                  isToday(date) && !isSelected(date) && "bg-accent text-accent-foreground"
                )}
              >
                {date.getDate()}
              </button>
            ) : (
              <div className="h-9 w-9" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

Calendar.displayName = "Calendar"

export { Calendar }

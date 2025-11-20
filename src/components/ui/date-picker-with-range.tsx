import { XIcon } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';

// A simple utility to join class names
const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

// Simplified versions of date-fns functions
const format = (date: Date, fmt: string) => {
  if (!date) return '';
  const day = String(date.getDate()).padStart(2, '0');
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  const hour = date.getHours();
  const minute = String(date.getMinutes()).padStart(2, '0');
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = hour % 12 === 0 ? 12 : hour % 12;

  if (fmt === "LLL dd, y") return `${month} ${day}, ${year}`;
  if (fmt === "LLL dd, y hh:mm a") return `${month} ${day}, ${year} ${formattedHour}:${minute} ${ampm}`;
  return `${year}-${String(date.getMonth() + 1).padStart(2, '0')}-${day}`;
};

const addDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const setTimeOnDate = (date: Date, hours: number, minutes: number) => {
  const newDate = new Date(date);
  newDate.setHours(hours, minutes, 0, 0);
  return newDate;
};

interface DateRange {
  from: Date;
  to?: Date;
}

// Simplified Popover component with smart positioning
const Popover = ({ children }: { children: React.ReactNode }) => {
  const [trigger, content] = React.Children.toArray(children);
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<'left' | 'right'>('left');
  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const toggleOpen = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsOpen(prev => !prev);
  };

  // Calculate position based on available space
  const calculatePosition = () => {
    if (!triggerRef.current) return;
    
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const popoverWidth = 800; // Fixed width of our popover
    
    // Check if there's enough space on the right
    const spaceOnRight = viewportWidth - triggerRect.left;
    const spaceOnLeft = triggerRect.right;
    
    // If there's not enough space on the right, position on the left
    if (spaceOnRight < popoverWidth && spaceOnLeft > popoverWidth) {
      setPosition('right');
    } else {
      setPosition('left');
    }
  };

  useEffect(() => {
    if (isOpen) {
      calculatePosition();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popoverRef]);

  return (
    <div className="relative" ref={popoverRef}>
      <div ref={triggerRef}>
        {React.cloneElement(trigger as React.ReactElement<{ onClick?: () => void }>, {
          onClick: toggleOpen,
        })}
      </div>
      {isOpen && (
        <div 
          className={`absolute z-50 mt-2 rounded-lg border bg-white p-2 shadow-lg w-[800px] max-w-[90vw] ${
            position === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          {React.cloneElement(content as React.ReactElement<{ onClose?: () => void }>, { onClose: () => setIsOpen(false) })}
        </div>
      )}
    </div>
  );
};

// Simplified Calendar component
const Calendar = ({ selected, onSelect }: { 
  selected: DateRange | undefined; 
  onSelect: (date: DateRange) => void; 
}) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(selected?.from || today);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

  const startOfWeek = (date: Date) => {
    const d = new Date(date);
    d.setDate(d.getDate() - d.getDay());
    return d;
  };

  const getDaysInMonth = (date: Date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const days = [];
    const currentDay = startOfWeek(firstDay);
    const tempDate = new Date(currentDay);
    
    while (tempDate <= lastDay || days.length < 42) {
      if (tempDate > lastDay && tempDate.getDay() === 0) break;
      days.push(new Date(tempDate));
      tempDate.setDate(tempDate.getDate() + 1);
    }
    return days;
  };

  const isSelected = (date: Date) => {
    if (!selected?.from) return false;
    if (selected.from && date.toDateString() === selected.from.toDateString()) return true;
    if (selected.to && date.toDateString() === selected.to.toDateString()) return true;
    if (selected.from && selected.to && date >= selected.from && date <= selected.to) return true;
    return false;
  };

  const isHovered = (date: Date) => {
    if (!selected?.from || selected?.to || !hoveredDate) return false;
    const [start, end] = [selected.from, hoveredDate].sort((a, b) => a.getTime() - b.getTime());
    return date >= start && date <= end;
  };

  const handleDayClick = (date: Date) => {
    if (!selected?.from || selected?.to) {
      onSelect({ from: date, to: undefined });
    } else {
      if (date < selected.from) {
        onSelect({ from: date, to: selected.from });
      } else {
        onSelect({ from: selected.from, to: date });
      }
    }
  };

  const renderMonth = (month: Date) => {
    const days = getDaysInMonth(month);
    return (
      <div className="bg-white p-4">
        <div className="flex justify-between items-center mb-4">
          <button className="text-gray-500 hover:text-gray-900" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div className="text-lg font-semibold">{format(month, 'MMMM yyyy')}</div>
          <button className="text-gray-500 hover:text-gray-900" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-sm font-medium text-gray-500">{day}</div>
          ))}
          {days.map((date, index) => (
            <div
              key={index}
              className={cn(
                'h-8 w-8 rounded-full flex items-center justify-center cursor-pointer text-sm',
                date.getMonth() !== month.getMonth() && 'text-gray-400',
                isSelected(date) && 'bg-blue-500 text-white',
                isHovered(date) && 'bg-blue-200',
                !isSelected(date) && 'hover:bg-gray-100',
                date.toDateString() === today.toDateString() && 'font-bold'
              )}
              onClick={() => handleDayClick(date)}
              onMouseEnter={() => setHoveredDate(date)}
              onMouseLeave={() => setHoveredDate(null)}
            >
              {date.getDate()}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);

  return (
    <div className="flex justify-center gap-8">
      {renderMonth(currentMonth)}
      {renderMonth(nextMonth)}
    </div>
  );
};

interface DatePickerWithRangeProps {
  value?: DateRange | undefined;
  onChange?: (date: DateRange | undefined) => void;
  placeholder?: string;
  className?: string;
}

const DatePickerWithRange = ({ value, onChange, placeholder = "Pick a date", className = "" }: DatePickerWithRangeProps) => {
  const [date, setDate] = useState<DateRange | undefined>(undefined);

  const handlePresetClick = (type: string) => {
    const today = new Date();
    let newFrom = today;
    let newTo = today;

    switch (type) {
      case "yesterday":
        newFrom = addDays(today, -1);
        newTo = addDays(today, -1);
        break;
      case "last-7-days":
        newFrom = addDays(today, -6);
        newTo = today;
        break;
      case "last-30-days":
        newFrom = addDays(today, -29);
        newTo = today;
        break;
      case "this-month":
        newFrom = new Date(today.getFullYear(), today.getMonth(), 1);
        newTo = today;
        break;
      case "all-time":
        newFrom = new Date(1970, 0, 1);
        newTo = today;
        break;
      case "today":
      default:
        newFrom = today;
        newTo = today;
        break;
    }

    const currentHour = new Date().getHours();
    const currentMinute = new Date().getMinutes();
    const newDateRange = {
      from: setTimeOnDate(newFrom, currentHour, currentMinute),
      to: setTimeOnDate(newTo, currentHour, currentMinute)
    };
    
    setDate(newDateRange);
    onChange?.(newDateRange);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'from' | 'to') => {
    const [hours, minutes] = e.target.value.split(':').map(Number);
    
    // If no date is set, create a new one with current date
    if (!date) {
      const now = new Date();
      const newDateRange = {
        from: type === 'from' ? setTimeOnDate(now, hours, minutes) : now,
        to: type === 'to' ? setTimeOnDate(now, hours, minutes) : now
      };
      setDate(newDateRange);
      onChange?.(newDateRange);
      return;
    }
    
    const newDateRange = {
      ...date,
      [type]: (() => {
        const currentDate = date[type];
        if (!currentDate) return new Date();
        const newDate = new Date(currentDate);
        newDate.setHours(hours, minutes);
        return newDate;
      })()
    };
    
    setDate(newDateRange);
    onChange?.(newDateRange);
  };

  const handleDateSelect = (newDate: DateRange) => {
    setDate(newDate);
    onChange?.(newDate);
  };

  // Use controlled value if provided, otherwise use internal state
  const displayDate = value || date || undefined;

  return (
    <Popover>
      <div
        className={cn(
          "w-full justify-start text-left font-normal rounded-lg px-4 py-2 border border-[#CCCCCC80] cursor-pointer hover:bg-gray-50 transition-colors",
          !displayDate?.from && "text-gray-500",
          className
        )}
        onClick={() => {
          // This will be handled by the Popover component
        }}
      >
        <svg style={{display:"inline"}} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar mr-2 h-4 w-4">
            <path d="M8 2v4" />
            <path d="M16 2v4" />
            <rect width="18" height="18" x="3" y="4" rx="2" />
            <path d="M3 10h18" />
        </svg>
        <span className="flex-1 text-left">
          {displayDate?.from ? (
            displayDate.to ? (
              <>
                {format(displayDate.from, "LLL dd, y hh:mm a")} -{" "}
                {format(displayDate.to, "LLL dd, y hh:mm a")}
              </>
            ) : (
              format(displayDate.from, "LLL dd, y hh:mm a")
            )
          ) : (
            <span className="text-gray-500">{placeholder}</span>
          )}
        </span>
        {displayDate?.from && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDate(undefined);
              onChange?.(undefined);
            }}
            className="ml-2 p-1 text-white bg-[#6B7280] hover:bg-[#4B5563] rounded-full transition-colors"
            title="Clear date range"
          >
                <XIcon size={12} />
          </button>
        )}
      </div>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex flex-col gap-3 p-3 border-r border-gray-200">
          <button onClick={() => handlePresetClick("today")} className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100">Today</button>
          <button onClick={() => handlePresetClick("yesterday")} className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100">Yesterday</button>
          <button onClick={() => handlePresetClick("last-7-days")} className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100">Last 7 Days</button>
          <button onClick={() => handlePresetClick("last-30-days")} className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100">Last 30 Days</button>
          <button onClick={() => handlePresetClick("this-month")} className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100">This Month</button>
          <button onClick={() => handlePresetClick("all-time")} className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100">All Time</button>
        </div>
        <div className="flex flex-col">
          <Calendar selected={displayDate} onSelect={handleDateSelect} />
          <div className="flex justify-between items-center mt-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">From:</label>
              <input
                type="time"
                value={displayDate?.from ? `${String(displayDate.from.getHours()).padStart(2, '0')}:${String(displayDate.from.getMinutes()).padStart(2, '0')}` : ''}
                onChange={(e) => handleTimeChange(e, 'from')}
                className="rounded-lg border border-gray-300 p-2"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">To:</label>
              <input
                type="time"
                value={displayDate?.to ? `${String(displayDate.to.getHours()).padStart(2, '0')}:${String(displayDate.to.getMinutes()).padStart(2, '0')}` : ''}
                onChange={(e) => handleTimeChange(e, 'to')}
                className="rounded-lg border border-gray-300 p-2"
              />
            </div>
          </div>
        </div>
      </div>
    </Popover>
  );
};

export default DatePickerWithRange;

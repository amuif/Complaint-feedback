'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import * as ethiopianDate from 'ethiopian-date';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

export const ETHIOPIAN_MONTHS = [
  { value: 1, name: 'መስከረም', enName: 'Meskerem' },
  { value: 2, name: 'ጥቅምት', enName: 'Tikimt' },
  { value: 3, name: 'ኅዳር', enName: 'Hidar' },
  { value: 4, name: 'ታኅሣሥ', enName: 'Tahsas' },
  { value: 5, name: 'ጥር', enName: 'Tir' },
  { value: 6, name: 'የካቲት', enName: 'Yekatit' },
  { value: 7, name: 'መጋቢት', enName: 'Megabit' },
  { value: 8, name: 'ሚያዝያ', enName: 'Miazia' },
  { value: 9, name: 'ግንቦት', enName: 'Ginbot' },
  { value: 10, name: 'ሰኔ', enName: 'Sene' },
  { value: 11, name: 'ሐምሌ', enName: 'Hamle' },
  { value: 12, name: 'ነሐሴ', enName: 'Nehasse' },
  { value: 13, name: 'ጳጉሜን', enName: 'Pagumen' },
];

export const ETHIOPIAN_DAYS_SHORT = ['እሑ', 'ሰኞ', 'ማክ', 'ረቡ', 'ሐሙ', 'ዓር', 'ቅዳ'];

export interface EthiopianCalendarProps {
  selectedDate?: string; // in dd/mm/yyyy format
  onSelectDate: (dateString: string) => void;
  className?: string;
  lang?: 'am' | 'en' | 'af';
}

export function EthiopianCalendar({
  selectedDate,
  onSelectDate,
  className,
  lang = 'am',
}: EthiopianCalendarProps) {
  // Determine initial Ethiopian year, month, day
  const todayEth = React.useMemo(() => {
    const now = new Date();
    try {
      const [y, m, d] = (ethiopianDate as any).toEthiopian(
        now.getFullYear(),
        now.getMonth() + 1,
        now.getDate()
      );
      return { year: y, month: m, day: d };
    } catch {
      return { year: 2018, month: 1, day: 1 };
    }
  }, []);

  const parsedSelected = React.useMemo(() => {
    if (!selectedDate) return null;
    const parts = selectedDate.split('/').map(Number);
    if (parts.length === 3 && parts.every((n) => !isNaN(n))) {
      return { day: parts[0], month: parts[1], year: parts[2] };
    }
    return null;
  }, [selectedDate]);

  const [viewYear, setViewYear] = React.useState<number>(
    parsedSelected?.year ?? todayEth.year
  );
  const [viewMonth, setViewMonth] = React.useState<number>(
    parsedSelected?.month ?? todayEth.month
  );

  // Sync view if parsedSelected changes
  React.useEffect(() => {
    if (parsedSelected) {
      setViewYear(parsedSelected.year);
      setViewMonth(parsedSelected.month);
    }
  }, [parsedSelected?.year, parsedSelected?.month]);

  // Days in current Ethiopian month
  const daysInMonth = React.useMemo(() => {
    if (viewMonth === 13) {
      // Leap year check: year % 4 === 3 in Ethiopian calendar
      return viewYear % 4 === 3 ? 6 : 5;
    }
    return 30;
  }, [viewYear, viewMonth]);

  // Determine starting weekday of the current month
  const startDayOfWeek = React.useMemo(() => {
    try {
      const gDateParts = (ethiopianDate as any).toGregorian(viewYear, viewMonth, 1);
      const [gYear, gMonth, gDay] = Array.isArray(gDateParts)
        ? gDateParts
        : [gDateParts.year, gDateParts.month, gDateParts.day];
      return new Date(gYear, gMonth - 1, gDay).getDay(); // 0 = Sunday
    } catch {
      return 0;
    }
  }, [viewYear, viewMonth]);

  const handlePrevMonth = () => {
    if (viewMonth === 1) {
      setViewMonth(13);
      setViewYear((prev) => prev - 1);
    } else {
      setViewMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 13) {
      setViewMonth(1);
      setViewYear((prev) => prev + 1);
    } else {
      setViewMonth((prev) => prev + 1);
    }
  };

  const handleSelectDay = (day: number) => {
    const formatted = `${String(day).padStart(2, '0')}/${String(viewMonth).padStart(2, '0')}/${viewYear}`;
    onSelectDate(formatted);
  };

  return (
    <div className={cn('p-3 bg-popover text-popover-foreground rounded-lg shadow-md border border-border w-[280px]', className)}>
      {/* Header with Month/Year and navigation */}
      <div className="flex items-center justify-between mb-3 px-1">
        <button
          type="button"
          onClick={handlePrevMonth}
          className={cn(
            buttonVariants({ variant: 'outline', size: 'icon' }),
            'h-7 w-7 bg-transparent p-0 opacity-70 hover:opacity-100 text-foreground'
          )}
          aria-label="Previous month"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-1">
          <select
            value={viewMonth}
            onChange={(e) => setViewMonth(Number(e.target.value))}
            className="text-sm font-medium bg-transparent text-foreground cursor-pointer rounded px-1.5 py-0.5 border border-transparent hover:border-border hover:bg-accent focus:outline-none focus:ring-1 focus:ring-ring transition-colors"
          >
            {ETHIOPIAN_MONTHS.map((m) => (
              <option key={m.value} value={m.value} className="bg-popover text-popover-foreground">
                {lang === 'am' ? m.name : m.enName}
              </option>
            ))}
          </select>

          <select
            value={viewYear}
            onChange={(e) => setViewYear(Number(e.target.value))}
            className="text-sm font-medium bg-transparent text-foreground cursor-pointer rounded px-1.5 py-0.5 border border-transparent hover:border-border hover:bg-accent focus:outline-none focus:ring-1 focus:ring-ring transition-colors"
          >
            {Array.from({ length: 40 }, (_, i) => todayEth.year - 30 + i).map((y) => (
              <option key={y} value={y} className="bg-popover text-popover-foreground">
                {y}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={handleNextMonth}
          className={cn(
            buttonVariants({ variant: 'outline', size: 'icon' }),
            'h-7 w-7 bg-transparent p-0 opacity-70 hover:opacity-100 text-foreground'
          )}
          aria-label="Next month"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-1 text-center">
        {ETHIOPIAN_DAYS_SHORT.map((dayName, idx) => (
          <div
            key={idx}
            className="text-muted-foreground text-[0.75rem] font-medium h-7 flex items-center justify-center"
          >
            {dayName}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {/* Leading empty cells */}
        {Array.from({ length: startDayOfWeek }).map((_, idx) => (
          <div key={`empty-${idx}`} className="h-8 w-8" />
        ))}

        {/* Month days */}
        {Array.from({ length: daysInMonth }, (_, idx) => idx + 1).map((day) => {
          const isSelected =
            parsedSelected?.day === day &&
            parsedSelected?.month === viewMonth &&
            parsedSelected?.year === viewYear;

          const isToday =
            todayEth.day === day &&
            todayEth.month === viewMonth &&
            todayEth.year === viewYear;

          return (
            <button
              key={day}
              type="button"
              onClick={() => handleSelectDay(day)}
              className={cn(
                'h-8 w-8 rounded-md text-sm flex items-center justify-center transition-colors font-normal',
                isSelected
                  ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                  : isToday
                  ? 'border border-primary text-primary font-medium hover:bg-accent hover:text-accent-foreground'
                  : 'hover:bg-accent hover:text-accent-foreground text-foreground'
              )}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

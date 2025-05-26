"use client"

import * as React from "react"
import { DayPicker } from "react-day-picker"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import "react-day-picker/dist/style.css"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        // Improved container: shadow, border, padding, rounded, bg
        "p-4 sm:p-6 bg-background rounded-xl border border-gray-200 shadow-lg max-w-md mx-auto",
        className
      )}
      classNames={{
        months: "flex flex-col sm:flex-row gap-6 sm:gap-8",
        month: "space-y-6",
        caption: "flex justify-center pt-1 relative items-center mb-2",
        caption_label: "text-base font-semibold",
        nav: "space-x-2 flex items-center",
        nav_button: cn(
          "h-8 w-8 bg-muted text-foreground p-0 opacity-70 hover:opacity-100 rounded-full transition-colors border border-transparent hover:border-primary"
        ),
        nav_button_previous: "absolute left-2",
        nav_button_next: "absolute right-2",
        table: "w-full border-collapse",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-10 font-medium text-xs uppercase tracking-wide py-1",
        row: "flex w-full mt-1",
        cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-lg last:[&:has([aria-selected])]:rounded-r-lg focus-within:relative focus-within:z-20",
        day: cn(
          // Improved day button: bigger, bolder, rounded, smooth transitions
          "h-10 w-10 p-0 font-medium aria-selected:opacity-100 rounded-lg transition-colors flex items-center justify-center cursor-pointer",
          "hover:bg-primary/10 hover:text-primary focus:bg-primary/20 focus:text-primary"
        ),
        day_selected:
          // More prominent selected day
          "bg-primary text-primary-foreground font-bold shadow-md hover:bg-primary focus:bg-primary rounded-lg border-2 border-primary",
        day_today: "border-2 border-primary bg-primary/10 text-primary font-semibold",
        day_outside: "text-muted-foreground opacity-40",
        day_disabled: "text-muted-foreground opacity-30 cursor-not-allowed",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-5 w-5" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-5 w-5" />,
      }}
      {...props}
    />
  )
}

Calendar.displayName = "Calendar"
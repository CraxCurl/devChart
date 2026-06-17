"use client"

import * as React from "react"

import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function CalendarWithTimePickerInline({ 
  value, 
  onChange 
}: { 
  value?: Date | undefined, 
  onChange?: (date: Date | undefined) => void 
}) {
  const [date, setDate] = React.useState<Date | undefined>(value)
  const [time, setTime] = React.useState<string>("12:00:00")

  // Sync internal state if prop value changes
  React.useEffect(() => {
    if (value) {
      setDate(value)
      const hours = value.getHours().toString().padStart(2, '0')
      const minutes = value.getMinutes().toString().padStart(2, '0')
      const seconds = value.getSeconds().toString().padStart(2, '0')
      setTime(`${hours}:${minutes}:${seconds}`)
    }
  }, [value])

  const handleDateChange = (newDate: Date | undefined) => {
    if (newDate) {
      // Maintain the currently selected time
      const [hours, minutes, seconds] = time.split(':').map(Number);
      newDate.setHours(hours || 0, minutes || 0, seconds || 0);
    }
    setDate(newDate)
    onChange?.(newDate)
  }

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value
    setTime(newTime)
    
    if (date) {
      const newDate = new Date(date)
      const [hours, minutes, seconds] = newTime.split(':').map(Number)
      newDate.setHours(hours || 0, minutes || 0, seconds || 0)
      setDate(newDate)
      onChange?.(newDate)
    }
  }

  return (
    <Card className="w-fit py-4 bg-[#111] border-white/10 text-white">
      <CardContent className="px-4">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateChange}
          className="bg-transparent p-0 [--cell-size:--spacing(10.5)]"
        />
      </CardContent>
      <CardFooter className="flex gap-2 border-t border-white/10 px-4 pt-4">
        <div className="w-full">
          <Label htmlFor="time" className="sr-only">
            Time
          </Label>
          <Input
            id="time"
            type="time"
            step="1"
            value={time}
            onChange={handleTimeChange}
            className="w-full bg-[#1a1a1a] border-white/10 text-white appearance-none [&::-webkit-calendar-picker-indicator]:invert"
          />
        </div>
      </CardFooter>
    </Card>
  )
}

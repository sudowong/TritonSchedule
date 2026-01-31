import { useState, useMemo } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday,
} from "date-fns";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EventModal } from "@/components/EventModal";
import { useCalendar } from "@/context/CalendarContext";
import { CalendarEvent } from "@/types/calendar";
import { cn } from "@/lib/utils";

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const { events, addEvent, updateEvent, deleteEvent } = useCalendar();

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const days: Date[] = [];
    let day = startDate;
    while (day <= endDate) {
      days.push(day);
      day = addDays(day, 1);
    }
    return days;
  }, [currentMonth]);

  const getEventsForDay = (day: Date) => {
    return events.filter((event) => isSameDay(new Date(event.date), day));
  };

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const handleToday = () => setCurrentMonth(new Date());

  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
    setEditingEvent(null);
    setModalOpen(true);
  };

  const handleEventClick = (event: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingEvent(event);
    setSelectedDate(new Date(event.date));
    setModalOpen(true);
  };

  const handleAddEvent = () => {
    setSelectedDate(new Date());
    setEditingEvent(null);
    setModalOpen(true);
  };

  const handleSaveEvent = (eventData: Omit<CalendarEvent, "id"> & { id?: string }) => {
    if (eventData.id) {
      updateEvent(eventData.id, eventData);
    } else {
      addEvent({
        ...eventData,
        id: crypto.randomUUID(),
      });
    }
  };

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {format(currentMonth, "MMMM yyyy")}
          </h1>
          <p className="text-muted-foreground">Manage your schedule</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleToday}>
            Today
          </Button>
          <Button variant="outline" size="icon" onClick={handlePrevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button onClick={handleAddEvent} className="ml-2">
            <Plus className="h-4 w-4 mr-2" />
            Add Event
          </Button>
        </div>
      </div>

      <div className="flex-1 border border-border rounded-lg overflow-hidden bg-card">
        {/* Week day headers */}
        <div className="grid grid-cols-7 border-b border-border bg-muted/50">
          {weekDays.map((day) => (
            <div
              key={day}
              className="px-2 py-3 text-center text-sm font-medium text-muted-foreground"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 flex-1">
          {calendarDays.map((day, index) => {
            const dayEvents = getEventsForDay(day);
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isCurrentDay = isToday(day);

            return (
              <div
                key={index}
                onClick={() => handleDayClick(day)}
                className={cn(
                  "min-h-[100px] border-b border-r border-border p-1 cursor-pointer transition-colors hover:bg-accent/50",
                  !isCurrentMonth && "bg-muted/30",
                  index % 7 === 6 && "border-r-0"
                )}
              >
                <div className="flex items-center justify-center mb-1">
                  <span
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-full text-sm",
                      isCurrentDay && "bg-primary text-primary-foreground font-semibold",
                      !isCurrentMonth && "text-muted-foreground"
                    )}
                  >
                    {format(day, "d")}
                  </span>
                </div>
                <div className="space-y-0.5 overflow-hidden">
                  {dayEvents.slice(0, 3).map((event) => (
                    <div
                      key={event.id}
                      onClick={(e) => handleEventClick(event, e)}
                      className="px-1.5 py-0.5 text-xs rounded truncate text-white cursor-pointer hover:opacity-80 transition-opacity"
                      style={{ backgroundColor: event.color }}
                    >
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-muted-foreground px-1.5">
                      +{dayEvents.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <EventModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        event={editingEvent}
        selectedDate={selectedDate || undefined}
        onSave={handleSaveEvent}
        onDelete={deleteEvent}
      />
    </div>
  );
}

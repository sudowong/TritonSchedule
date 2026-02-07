import { useState, useMemo, useEffect } from "react";
import { BookOpen, Command, Search, UserRound } from "lucide-react";
import { Input } from "@/components/ui/input";
import { sampleCourses, Course, DiscussionSection } from "@/data/sampleCourses";
import { useCalendar } from "@/context/CalendarContext";
import { Weekday } from "@/types/calendar";
import { toast } from "sonner";

export default function SearchCourses() {
  const [searchQuery, setSearchQuery] = useState(() =>
    sessionStorage.getItem("searchCoursesQuery") ?? ""
  );
  const { events, addEvent } = useCalendar();

  useEffect(() => {
    sessionStorage.setItem("searchCoursesQuery", searchQuery);
  }, [searchQuery]);

  const filteredCourses = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return [];
    
    return sampleCourses.filter(
      (course) =>
        course.name.toLowerCase().includes(query) ||
        course.instructor.toLowerCase().includes(query) ||
        course.description.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const addedCourseIds = useMemo(() => {
    return new Set(
      events
        .filter((e) => e.isCourse)
        .map((e) => e.courseId || e.id)
    );
  }, [events]);

  const recentCourses = useMemo(() => sampleCourses.slice(0, 3), []);

  const commonActions = useMemo(
    () => [
      {
        label: "Find introductory courses",
        hotkey: "I",
        icon: BookOpen,
        onSelect: () => setSearchQuery("Introduction"),
      },
      {
        label: "Search by instructor",
        hotkey: "P",
        icon: UserRound,
        onSelect: () => setSearchQuery("Prof."),
      },
    ],
    []
  );

  const handleAddToCalendar = (course: Course, selectedDiscussion?: DiscussionSection) => {
    const timeMatch = course.schedule.match(/(\d{1,2}:\d{2}\s*(?:AM|PM))\s*-\s*(\d{1,2}:\d{2}\s*(?:AM|PM))/i);
    let startTime = "09:00";
    let endTime = "10:30";
    
    if (timeMatch) {
      startTime = convertTo24Hour(timeMatch[1]);
      endTime = convertTo24Hour(timeMatch[2]);
    }

    const dayMatches = course.schedule.match(/Mon|Tue|Wed|Thu|Fri/g) || [];
    const weekdayMap: Record<string, Weekday> = {
      Mon: "Mon",
      Tue: "Tue",
      Wed: "Wed",
      Thu: "Thu",
      Fri: "Fri",
    };
    const uniqueDays = Array.from(new Set(dayMatches))
      .map((day) => weekdayMap[day])
      .filter((day): day is Weekday => Boolean(day));

    uniqueDays.forEach((day) => {
      addEvent({
        id: `${course.id}-${day}`,
        title: course.name,
        dayOfWeek: day,
        startTime,
        endTime,
        color: course.color,
        isCourse: true,
        courseId: course.id,
        eventType: "Lecture",
      });
    });

    if (selectedDiscussion) {
      const discussionMatch = selectedDiscussion.time.match(
        /(Mon|Tue|Wed|Thu|Fri)\s+(\d{1,2}:\d{2}\s*(?:AM|PM))\s*-\s*(\d{1,2}:\d{2}\s*(?:AM|PM))/i
      );
      if (discussionMatch) {
        const discussionDay = weekdayMap[discussionMatch[1]];
        if (discussionDay) {
          addEvent({
            id: `${course.id}-${selectedDiscussion.id}-${discussionDay}`,
            title: `${course.name} (${selectedDiscussion.name})`,
            dayOfWeek: discussionDay,
            startTime: convertTo24Hour(discussionMatch[2]),
            endTime: convertTo24Hour(discussionMatch[3]),
            color: course.color,
            isCourse: true,
            courseId: course.id,
            eventType: "Discussion",
          });
        }
      }
    }

    const discussionInfo = selectedDiscussion ? ` with ${selectedDiscussion.name}` : "";
    toast.success(`${course.name}${discussionInfo} added to your calendar!`);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-4xl">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary/80">
            Course Explorer
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Search Courses
          </h1>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Find and add courses to your calendar
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-3xl">
          <div className="overflow-hidden rounded-[1.4rem] border border-border/80 bg-[linear-gradient(160deg,hsl(224_21%_13%_/_0.92),hsl(226_18%_10%_/_0.94))] shadow-[0_26px_58px_hsl(223_45%_2%_/_0.58)] backdrop-blur-xl">
            <div className="flex items-center gap-3 border-b border-border/70 px-4 py-4 transition-all focus-within:border-primary/70 focus-within:bg-background/20 focus-within:shadow-[inset_0_-1px_0_hsl(var(--primary)/0.55),0_0_0_2px_hsl(var(--primary)/0.16)] sm:px-6">
              <Search className="h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search courses or type a command..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-auto min-h-[2.2rem] border-0 bg-transparent p-0 text-[1.05rem] leading-9 text-foreground caret-cyan-300 placeholder:text-muted-foreground/85 shadow-none outline-none ring-0 focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 sm:text-[1.12rem]"
              />
              <kbd className="inline-flex shrink-0 items-center gap-1 rounded-md border border-border/70 bg-background/45 px-2 py-1 text-xs text-muted-foreground">
                <Command className="h-3.5 w-3.5" />
                K
              </kbd>
            </div>

            <div className="p-4 sm:p-5">
              {searchQuery.trim().length === 0 ? (
                <div>
                  <div className="mb-3">
                    <p className="text-[1.03rem] font-medium text-foreground">Recent</p>
                  </div>
                  <div className="space-y-1.5 pb-3">
                    {recentCourses.map((course) => (
                      <button
                        key={course.id}
                        type="button"
                        onClick={() => setSearchQuery(course.name)}
                        className="flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-accent/40"
                      >
                        <div className="mt-0.5 rounded-md border border-border/65 bg-background/45 p-1.5">
                          <BookOpen className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[1.02rem] font-medium text-foreground">{course.name}</p>
                          <p className="truncate text-sm text-muted-foreground">{course.instructor}</p>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="border-t border-border/70 pt-4">
                    <p className="mb-3 text-[1.03rem] font-medium text-foreground">Actions</p>
                    <div className="space-y-1.5">
                      {commonActions.map((action) => (
                        <button
                          key={action.label}
                          type="button"
                          onClick={action.onSelect}
                          className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-accent/40"
                        >
                          <span className="inline-flex min-w-0 items-center gap-3">
                            <span className="rounded-md border border-border/65 bg-background/45 p-1.5">
                              <action.icon className="h-4 w-4 text-muted-foreground" />
                            </span>
                            <span className="truncate text-[1.02rem] text-foreground">{action.label}</span>
                          </span>
                          <kbd className="shrink-0 rounded-md border border-border/70 bg-background/45 px-2 py-1 text-xs text-muted-foreground">
                            {action.hotkey}
                          </kbd>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : filteredCourses.length === 0 ? (
                <div className="py-8 text-center sm:py-10">
                  <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-border/70 bg-background/40">
                    <BookOpen className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-xl font-semibold text-foreground">No courses found</p>
                  <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                    "{searchQuery}" did not match any course names, instructors, or descriptions.
                  </p>
                  <button
                    type="button"
                    className="mt-5 rounded-lg border border-border/80 bg-background/55 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                    onClick={() => setSearchQuery("")}
                  >
                    Clear search
                  </button>
                </div>
              ) : (
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground">Course matches</p>
                    <p className="text-xs text-muted-foreground">{filteredCourses.length} result{filteredCourses.length === 1 ? "" : "s"}</p>
                  </div>
                  <div className="max-h-[min(58vh,520px)] space-y-1.5 overflow-y-auto pr-1">
                    {filteredCourses.map((course) => (
                      <div
                        key={course.id}
                        className="flex items-center justify-between gap-3 rounded-xl border border-transparent px-3 py-2.5 transition-colors hover:border-border/60 hover:bg-accent/35"
                      >
                        <div className="min-w-0 flex items-center gap-3">
                          <span className="rounded-md border border-border/65 bg-background/45 p-1.5">
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-[1.02rem] text-foreground">{course.name}</p>
                            <p className="truncate text-sm text-muted-foreground">
                              {course.instructor} - {course.schedule}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          disabled={addedCourseIds.has(course.id)}
                          onClick={() => handleAddToCalendar(course, course.discussionSections?.[0])}
                          className="shrink-0 rounded-md border border-border/70 bg-background/45 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-55"
                        >
                          {addedCourseIds.has(course.id) ? "Added" : "Add"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function convertTo24Hour(time: string): string {
  const [timePart, period] = time.trim().split(/\s+/);
  let [hours, minutes] = timePart.split(":").map(Number);
  
  if (period?.toUpperCase() === "PM" && hours !== 12) {
    hours += 12;
  } else if (period?.toUpperCase() === "AM" && hours === 12) {
    hours = 0;
  }
  
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
}

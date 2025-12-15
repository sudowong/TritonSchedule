import { useState } from 'react'
import React from 'react'
import './style.css'

type ClassEntry = {
  id: string
  course: string
  section: string
  type: string
  days: string
  time: string
  building: string
  room: string
  instructor: string
  available: string
}

type ScheduledClass = ClassEntry & {
  startHour: number
  endHour: number
  dayIndices: number[]
}

const initialClasses: ClassEntry[] = [
  {
    id: '1',
    course: 'CSE 8A',
    section: 'A00',
    type: 'LE',
    days: 'TuTh',
    time: '8:00a-9:20a',
    building: 'PETER',
    room: '110',
    instructor: 'Smith, John',
    available: '15/50',
  },
  {
    id: '2',
    course: 'CSE 8A',
    section: 'A01',
    type: 'DI',
    days: 'M',
    time: '10:00a-10:50a',
    building: 'SOLIS',
    room: '107',
    instructor: 'Smith, John',
    available: '8/20',
  },
  {
    id: '3',
    course: 'MATH 20A',
    section: 'A00',
    type: 'LE',
    days: 'MWF',
    time: '9:00a-9:50a',
    building: 'PETER',
    room: '105',
    instructor: 'Johnson, Mary',
    available: '22/100',
  },
  {
    id: '4',
    course: 'MATH 20A',
    section: 'A01',
    type: 'DI',
    days: 'W',
    time: '2:00p-2:50p',
    building: 'PETER',
    room: '105',
    instructor: 'Johnson, Mary',
    available: '5/30',
  },
  {
    id: '5',
    course: 'CSE 11',
    section: 'A00',
    type: 'LE',
    days: 'TuTh',
    time: '11:00a-12:20p',
    building: 'PETER',
    room: '120',
    instructor: 'Williams, David',
    available: '30/60',
  },
  {
    id: '6',
    course: 'CSE 11',
    section: 'A01',
    type: 'DI',
    days: 'F',
    time: '1:00p-1:50p',
    building: 'PETER',
    room: '120',
    instructor: 'Williams, David',
    available: '10/25',
  },
]

// Parse time string like "8:00a-9:20a" to start and end hours
function parseTime(timeStr: string): { startHour: number; endHour: number } {
  const [start, end] = timeStr.split('-')
  
  const parseTimePart = (time: string): number => {
    const isPM = time.toLowerCase().includes('p')
    const timeOnly = time.replace(/[ap]/gi, '').trim()
    const [hours, minutes = '0'] = timeOnly.split(':')
    let hour = parseInt(hours, 10)
    const min = parseInt(minutes, 10)
    
    if (isPM && hour !== 12) hour += 12
    if (!isPM && hour === 12) hour = 0
    
    return hour + min / 60
  }
  
  return {
    startHour: parseTimePart(start),
    endHour: parseTimePart(end),
  }
}

// Parse days string like "TuTh", "MWF", "M" to day indices (0=Mon, 1=Tue, etc.)
function parseDays(daysStr: string): number[] {
  const dayMap: Record<string, number> = {
    M: 0,
    Tu: 1,
    T: 1, // Sometimes just T
    W: 2,
    Th: 3,
    F: 4,
  }
  
  const days: number[] = []
  let i = 0
  
  while (i < daysStr.length) {
    if (daysStr[i] === 'T') {
      if (i + 1 < daysStr.length && daysStr[i + 1] === 'h') {
        days.push(dayMap['Th'])
        i += 2
      } else if (i + 1 < daysStr.length && daysStr[i + 1] === 'u') {
        days.push(dayMap['Tu'])
        i += 2
      } else {
        days.push(dayMap['T'])
        i += 1
      }
    } else {
      const day = daysStr[i]
      if (dayMap[day] !== undefined) {
        days.push(dayMap[day])
      }
      i += 1
    }
  }
  
  return days.sort()
}

// Calculate grid position and span for a class block
function calculateClassPosition(
  startHour: number,
  endHour: number,
  dayIndex: number,
): { gridRow: number; gridRowSpan: number; gridColumn: number } {
  const startRow = Math.floor((startHour - 8) * 2) + 2 // +2 for header row
  const endRow = Math.ceil((endHour - 8) * 2) + 2
  const rowSpan = endRow - startRow
  
  return {
    gridRow: startRow,
    gridRowSpan: rowSpan,
    gridColumn: dayIndex + 2, // +2 for time column
  }
}

const timeSlots = [
  '8:00 AM',
  '9:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '1:00 PM',
  '2:00 PM',
  '3:00 PM',
  '4:00 PM',
  '5:00 PM',
  '6:00 PM',
  '7:00 PM',
  '8:00 PM',
]

const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

// Generate colors for different courses
const courseColors: Record<string, string> = {}
const colorPalette = [
  '#4A90E2', // Blue
  '#50C878', // Green
  '#FF6B6B', // Red
  '#FFA500', // Orange
  '#9B59B6', // Purple
  '#1ABC9C', // Teal
  '#E74C3C', // Dark Red
  '#3498DB', // Light Blue
]

let colorIndex = 0
function getCourseColor(course: string): string {
  if (!courseColors[course]) {
    courseColors[course] = colorPalette[colorIndex % colorPalette.length]
    colorIndex++
  }
  return courseColors[course]
}

function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [availableClasses, setAvailableClasses] = useState<ClassEntry[]>(initialClasses)
  const [scheduledClasses, setScheduledClasses] = useState<ScheduledClass[]>([])

  const handleSearch = () => {
    // Filter classes based on search query
    if (!searchQuery.trim()) {
      setAvailableClasses(initialClasses)
      return
    }
    
    const query = searchQuery.toLowerCase()
    const filtered = initialClasses.filter(
      (cls) =>
        cls.course.toLowerCase().includes(query) ||
        cls.instructor.toLowerCase().includes(query) ||
        cls.building.toLowerCase().includes(query)
    )
    setAvailableClasses(filtered)
  }

  const handleAddClass = (classEntry: ClassEntry) => {
    const { startHour, endHour } = parseTime(classEntry.time)
    const dayIndices = parseDays(classEntry.days)
    
    // Check for conflicts
    const hasConflict = scheduledClasses.some((scheduled) => {
      const sameDay = scheduled.dayIndices.some((day) => dayIndices.includes(day))
      if (!sameDay) return false
      
      return (
        (startHour >= scheduled.startHour && startHour < scheduled.endHour) ||
        (endHour > scheduled.startHour && endHour <= scheduled.endHour) ||
        (startHour <= scheduled.startHour && endHour >= scheduled.endHour)
      )
    })
    
    if (hasConflict) {
      alert(`Conflict detected! This class overlaps with an existing class.`)
      return
    }
    
    const scheduledClass: ScheduledClass = {
      ...classEntry,
      startHour,
      endHour,
      dayIndices,
    }
    
    setScheduledClasses([...scheduledClasses, scheduledClass])
  }

  const handleRemoveClass = (id: string) => {
    setScheduledClasses(scheduledClasses.filter((cls) => cls.id !== id))
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">TritonSchedule</h1>
      </header>

      <main className="main-content">
        {/* Search Section */}
        <section className="search-section">
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Search for classes (e.g., CSE 8A, MATH 20A)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button className="search-button" onClick={handleSearch}>
              Search
            </button>
          </div>
        </section>

        {/* Class Results Section */}
        <section className="results-section">
          <div className="results-container">
            <h2 className="results-title">Search Results</h2>
            <div className="results-table-wrapper">
              <table className="classes-table">
                <thead>
                  <tr>
                    <th>Course</th>
                    <th>Section</th>
                    <th>Type</th>
                    <th>Days</th>
                    <th>Time</th>
                    <th>Building</th>
                    <th>Room</th>
                    <th>Instructor</th>
                    <th>Available</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {availableClasses.map((classEntry) => {
                    const isScheduled = scheduledClasses.some((sc) => sc.id === classEntry.id)
                    return (
                      <tr key={classEntry.id}>
                        <td>{classEntry.course}</td>
                        <td>{classEntry.section}</td>
                        <td>{classEntry.type}</td>
                        <td>{classEntry.days}</td>
                        <td>{classEntry.time}</td>
                        <td>{classEntry.building}</td>
                        <td>{classEntry.room}</td>
                        <td>{classEntry.instructor}</td>
                        <td>{classEntry.available}</td>
                        <td>
                          {isScheduled ? (
                            <button
                              className="action-btn remove-btn"
                              onClick={() => handleRemoveClass(classEntry.id)}
                            >
                              Remove
                            </button>
                          ) : (
                            <button
                              className="action-btn"
                              onClick={() => handleAddClass(classEntry)}
                            >
                              Add
                            </button>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Calendar Section */}
        <section className="calendar-section">
          <div className="calendar-container">
            <h2 className="calendar-title">Weekly Schedule</h2>
            <div className="calendar-wrapper">
              <div className="calendar-grid">
                {/* Time header (empty top-left cell) */}
                <div className="time-header"></div>
                
                {/* Day headers */}
                {weekdays.map((day) => (
                  <div key={day} className="day-header">
                    {day}
                  </div>
                ))}

                {/* Time slots and day cells */}
                {timeSlots.map((time) => (
                  <React.Fragment key={time}>
                    {/* Time slot */}
                    <div className="time-slot">{time}</div>
                    
                    {/* Day cells for this time slot */}
                    {weekdays.map((day) => (
                      <div key={`${day}-${time}`} className="day-cell"></div>
                    ))}
                  </React.Fragment>
                ))}

                {/* Class blocks - rendered as direct children of calendar-grid */}
                {scheduledClasses.map((cls) => {
                  return cls.dayIndices.map((dayIndex) => {
                    const pos = calculateClassPosition(
                      cls.startHour,
                      cls.endHour,
                      dayIndex
                    )
                    return (
                      <div
                        key={`${cls.id}-${dayIndex}`}
                        className="class-block"
                        style={{
                          gridRow: `${pos.gridRow} / span ${pos.gridRowSpan}`,
                          gridColumn: pos.gridColumn,
                          backgroundColor: getCourseColor(cls.course),
                        }}
                        title={`${cls.course} ${cls.section} - ${cls.time} - ${cls.building} ${cls.room}`}
                      >
                        <div className="class-block-content">
                          <div className="class-block-title">
                            {cls.course} {cls.section}
                          </div>
                          <div className="class-block-details">
                            {cls.time} • {cls.building} {cls.room}
                          </div>
                          <div className="class-block-type">{cls.type}</div>
                        </div>
                      </div>
                    )
                  })
                })}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App

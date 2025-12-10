import './style.css'

type Section = {
  sectionId: string
  section: string
  type: string
  days: string
  time: string
  building: string
  room: string
  availSeats: number
  totalSeats: number
  waitlist: number
  instructor: string
  action: 'PlanEnroll' | 'Waitlist'
}

const sections: Section[] = [
  {
    sectionId: '028898',
    section: 'A00',
    type: 'LE',
    days: 'TuTh',
    time: '8:00a-9:20a',
    building: 'PETER',
    room: '110',
    availSeats: 0,
    totalSeats: 50,
    waitlist: 0,
    instructor: 'Cao, Yingjun',
    action: 'Waitlist',
  },
  {
    sectionId: '028899',
    section: 'A50',
    type: 'LA',
    days: 'Tu',
    time: '10:00a-10:50a',
    building: 'EBU3B',
    room: 'B250',
    availSeats: 0,
    totalSeats: 50,
    waitlist: 0,
    instructor: 'Cao, Yingjun',
    action: 'Waitlist',
  },
  {
    sectionId: '028901',
    section: 'A52',
    type: 'LA',
    days: 'Tu',
    time: '12:00p-12:50p',
    building: 'EBU3B',
    room: 'B250',
    availSeats: 11,
    totalSeats: 50,
    waitlist: 0,
    instructor: 'Cao, Yingjun',
    action: 'PlanEnroll',
  },
  {
    sectionId: '028892',
    section: 'A00',
    type: 'LE',
    days: 'TuTh',
    time: '8:00a-9:20a',
    building: 'PETER',
    room: '110',
    availSeats: 7,
    totalSeats: 50,
    waitlist: 0,
    instructor: 'Cao, Yingjun',
    action: 'PlanEnroll',
  },
  {
    sectionId: '028894',
    section: 'A52',
    type: 'LA',
    days: 'Tu',
    time: '12:00p-12:50p',
    building: 'EBU3B',
    room: 'B250',
    availSeats: 7,
    totalSeats: 50,
    waitlist: 0,
    instructor: 'Cao, Yingjun',
    action: 'PlanEnroll',
  },
  {
    sectionId: '028896',
    section: 'A55',
    type: 'LA',
    days: 'Tu',
    time: '3:00p-3:50p',
    building: 'EBU3B',
    room: 'B250',
    availSeats: 21,
    totalSeats: 45,
    waitlist: 0,
    instructor: 'Cao, Yingjun',
    action: 'PlanEnroll',
  },
]

const discussionSections = [
  {
    sectionId: 'A01',
    section: 'DI',
    days: 'M',
    time: '8:00a-8:50a',
    building: 'SOLIS',
    room: '107',
    instructor: 'Cao, Yingjun',
  },
  {
    sectionId: 'B00',
    section: 'DI',
    days: 'Th',
    time: '8:00a-10:59a',
    building: 'PETER',
    room: '110',
    instructor: '',
  },
]

const otherCourses = [
  'CSE 11  Accel. Intro to Programming (4 units)',
  'CSE 12  Basic Data Struct & OO Design (4 units)',
  'CSE 20  Discrete Mathematics (4 units)',
  'CSE 21  Math/Algorithm&Systems Analy (4 units)',
  'CSE 25  Introduction to AI (4 units)',
  'CSE 29  Sys Prog and Software Tools (4 units)',
  'CSE 30  Computer Organization (4 units)',
  'CSE 88  LearnSustainableWell-Being/CSE (1 unit)',
  'CSE 89  Intro to CSE Seminar (2 units)',
]

const CourseNote = () => (
  <div className="course-note">
    <span className="note-label">Course Note:</span>
    <span className="note-body">
      Students who have credit for CSE 8B or CSE 11 may not receive credit for CSE 8A.
      For more information about enrollment and waitlist see:
      <a href="https://go.ucsd.edu/48sDB53" aria-label="waitlist information">
        https://go.ucsd.edu/48sDB53
      </a>
    </span>
  </div>
)

const SectionRow = ({ entry }: { entry: Section }) => (
  <tr>
    <td>{entry.sectionId}</td>
    <td>{entry.section}</td>
    <td>{entry.type}</td>
    <td>{entry.days}</td>
    <td>{entry.time}</td>
    <td>{entry.building}</td>
    <td>{entry.room}</td>
    <td className="numeric">{entry.availSeats}</td>
    <td className="numeric">{entry.totalSeats}</td>
    <td className="numeric">{entry.waitlist}</td>
    <td className="book-col">
      <span className="book-icon" aria-hidden />
    </td>
    <td className="instructor">
      <span className="instructor-name">{entry.instructor}</span>
      <span className="email-link" aria-hidden />
    </td>
    <td className="actions">
      {entry.action === 'PlanEnroll' ? (
        <>
          <button className="pill-button secondary">Plan</button>
          <button className="pill-button primary">Enroll</button>
        </>
      ) : (
        <button className="pill-button primary">Waitlist</button>
      )}
    </td>
  </tr>
)

function App() {
  return (
    <div className="app-shell">
      <header className="banner">
        <div className="banner-title">TritionSchedule</div>
      </header>

      <main className="page">
        <section className="results-card">
          <div className="card-header">
            <div className="title-block">
              <div className="title">Search results and action</div>
              <div className="breadcrumbs">
                <span className="crumb">CSE</span>
                <span className="crumb active">8A</span>
                <span className="crumb text">Intro to Programming I (4 units)</span>
              </div>
            </div>
            <div className="header-controls">
              <button className="thin-button">Clear Filters</button>
              <button className="thin-button emphasis">Add to Cart</button>
            </div>
          </div>

          <div className="filters">
            <div className="filter">
              <label>Group</label>
              <select>
                <option>All</option>
                <option>Lower Division</option>
                <option>Upper Division</option>
              </select>
            </div>
            <div className="filter">
              <label>Subject</label>
              <select>
                <option>CSE</option>
                <option>ECE</option>
                <option>MATH</option>
              </select>
            </div>
            <div className="filter">
              <label>Course</label>
              <input defaultValue="8A" />
            </div>
            <div className="filter">
              <label>Meeting Type</label>
              <select>
                <option>Any</option>
                <option>LE</option>
                <option>LA</option>
                <option>DI</option>
              </select>
            </div>
            <div className="filter">
              <label>Days</label>
              <select>
                <option>Any</option>
                <option>MWF</option>
                <option>TuTh</option>
              </select>
            </div>
            <div className="filter">
              <label>Time</label>
              <select>
                <option>Any</option>
                <option>Morning</option>
                <option>Afternoon</option>
                <option>Evening</option>
              </select>
            </div>
            <div className="filter">
              <label>Building</label>
              <input placeholder="e.g. PETER" />
            </div>
            <div className="filter">
              <label>Room</label>
              <input placeholder="110" />
            </div>
          </div>

          <div className="info-row">
            <CourseNote />
            <div className="links">
              <a href="#">Restricted by Class Level</a>
              <a href="#">Catalog</a>
              <a href="#">Resources</a>
              <a href="#">Evaluations</a>
            </div>
          </div>

          <div className="table-wrapper">
            <table className="sections-table">
              <thead>
                <tr>
                  <th>Section ID</th>
                  <th>Section</th>
                  <th>Meeting Type</th>
                  <th>Days</th>
                  <th>Time</th>
                  <th>Building</th>
                  <th>Room</th>
                  <th>Avail Seats</th>
                  <th>Total Seats</th>
                  <th>Waitlist Count</th>
                  <th>Book</th>
                  <th>Instructor</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {sections.map((section) => (
                  <SectionRow entry={section} key={section.sectionId + section.section} />
                ))}
              </tbody>
            </table>
          </div>

          <div className="footnote">
            Note: The following is an additional required meeting type for the above courses.
          </div>

          <div className="table-wrapper compact">
            <table className="sections-table">
              <thead>
                <tr>
                  <th>Section</th>
                  <th>Meeting Type</th>
                  <th>Days</th>
                  <th>Time</th>
                  <th>Building</th>
                  <th>Room</th>
                  <th>Instructor</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {discussionSections.map((entry) => (
                  <tr key={entry.sectionId + entry.time}>
                    <td>{entry.sectionId}</td>
                    <td>{entry.section}</td>
                    <td>{entry.days}</td>
                    <td>{entry.time}</td>
                    <td>{entry.building}</td>
                    <td>{entry.room}</td>
                    <td className="instructor">{entry.instructor}</td>
                    <td className="actions">
                      <button className="pill-button secondary">Plan</button>
                      <button className="pill-button primary">Enroll</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="accordion">
            <div className="accordion-header">Other CSE courses</div>
            {otherCourses.map((course, index) => (
              <div className="accordion-row" key={course}>
                <span className="chevron" aria-hidden>
                  {index === 2 ? '▸' : '▾'}
                </span>
                <span className={index === 2 ? 'highlighted-course' : ''}>{course}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default App

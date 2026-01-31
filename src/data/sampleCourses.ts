export interface Course {
  id: string;
  name: string;
  instructor: string;
  schedule: string;
  description: string;
  color: string;
}

export const sampleCourses: Course[] = [
  {
    id: "1",
    name: "Introduction to Computer Science",
    instructor: "Dr. Sarah Johnson",
    schedule: "Mon, Wed, Fri 9:00 AM - 10:30 AM",
    description: "Fundamentals of programming and computational thinking using Python.",
    color: "hsl(221, 83%, 53%)",
  },
  {
    id: "2",
    name: "Calculus I",
    instructor: "Prof. Michael Chen",
    schedule: "Tue, Thu 11:00 AM - 12:30 PM",
    description: "Introduction to differential and integral calculus, limits, and derivatives.",
    color: "hsl(142, 71%, 45%)",
  },
  {
    id: "3",
    name: "English Literature",
    instructor: "Dr. Emily Rodriguez",
    schedule: "Mon, Wed 2:00 PM - 3:30 PM",
    description: "Survey of British and American literature from the Renaissance to modern day.",
    color: "hsl(262, 83%, 58%)",
  },
  {
    id: "4",
    name: "Physics 101",
    instructor: "Prof. James Williams",
    schedule: "Tue, Thu 9:00 AM - 10:30 AM",
    description: "Introduction to mechanics, thermodynamics, and wave phenomena.",
    color: "hsl(25, 95%, 53%)",
  },
  {
    id: "5",
    name: "Art History",
    instructor: "Dr. Lisa Thompson",
    schedule: "Fri 1:00 PM - 4:00 PM",
    description: "Exploration of visual arts from ancient civilizations to contemporary movements.",
    color: "hsl(340, 82%, 52%)",
  },
  {
    id: "6",
    name: "Introduction to Psychology",
    instructor: "Dr. Robert Kim",
    schedule: "Mon, Wed, Fri 11:00 AM - 12:00 PM",
    description: "Overview of human behavior, cognition, and mental processes.",
    color: "hsl(180, 70%, 45%)",
  },
];

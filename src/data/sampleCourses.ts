export interface Course {
  id: string;
  name: string;
  instructor: string;
  schedule: string;
  description: string;
  color: string;
  discussionTimes?: string;
  midterm?: string;
  final?: string;
}

export const sampleCourses: Course[] = [
  {
    id: "1",
    name: "Introduction to Computer Science",
    instructor: "Dr. Sarah Johnson",
    schedule: "Mon, Wed, Fri 9:00 AM - 10:30 AM",
    description: "Fundamentals of programming and computational thinking using Python.",
    color: "hsl(221, 83%, 53%)",
    discussionTimes: "Thu 3:00 PM - 4:00 PM, Fri 1:00 PM - 2:00 PM",
    midterm: "Wed, Feb 12 @ 9:00 AM - 10:30 AM",
    final: "Mon, Mar 17 @ 8:00 AM - 11:00 AM",
  },
  {
    id: "2",
    name: "Calculus I",
    instructor: "Prof. Michael Chen",
    schedule: "Tue, Thu 11:00 AM - 12:30 PM",
    description: "Introduction to differential and integral calculus, limits, and derivatives.",
    color: "hsl(142, 71%, 45%)",
    discussionTimes: "Wed 2:00 PM - 3:00 PM",
    midterm: "Thu, Feb 13 @ 11:00 AM - 12:30 PM",
    final: "Tue, Mar 18 @ 11:30 AM - 2:30 PM",
  },
  {
    id: "3",
    name: "English Literature",
    instructor: "Dr. Emily Rodriguez",
    schedule: "Mon, Wed 2:00 PM - 3:30 PM",
    description: "Survey of British and American literature from the Renaissance to modern day.",
    color: "hsl(262, 83%, 58%)",
    discussionTimes: "Fri 10:00 AM - 11:00 AM",
    midterm: "Wed, Feb 19 @ 2:00 PM - 3:30 PM",
    final: "Wed, Mar 19 @ 3:00 PM - 6:00 PM",
  },
  {
    id: "4",
    name: "Physics 101",
    instructor: "Prof. James Williams",
    schedule: "Tue, Thu 9:00 AM - 10:30 AM",
    description: "Introduction to mechanics, thermodynamics, and wave phenomena.",
    color: "hsl(25, 95%, 53%)",
    discussionTimes: "Mon 4:00 PM - 5:00 PM, Wed 4:00 PM - 5:00 PM",
    midterm: "Tue, Feb 18 @ 9:00 AM - 10:30 AM",
    final: "Thu, Mar 20 @ 8:00 AM - 11:00 AM",
  },
  {
    id: "5",
    name: "Art History",
    instructor: "Dr. Lisa Thompson",
    schedule: "Fri 1:00 PM - 4:00 PM",
    description: "Exploration of visual arts from ancient civilizations to contemporary movements.",
    color: "hsl(340, 82%, 52%)",
    discussionTimes: "None",
    midterm: "Fri, Feb 21 @ 1:00 PM - 2:30 PM",
    final: "Fri, Mar 21 @ 3:00 PM - 6:00 PM",
  },
  {
    id: "6",
    name: "Introduction to Psychology",
    instructor: "Dr. Robert Kim",
    schedule: "Mon, Wed, Fri 11:00 AM - 12:00 PM",
    description: "Overview of human behavior, cognition, and mental processes.",
    color: "hsl(180, 70%, 45%)",
    discussionTimes: "Tue 1:00 PM - 2:00 PM",
    midterm: "Mon, Feb 24 @ 11:00 AM - 12:00 PM",
    final: "Mon, Mar 17 @ 11:30 AM - 2:30 PM",
  },
];

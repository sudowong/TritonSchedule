import { Clock, User, Plus, Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Course } from "@/data/sampleCourses";

interface CourseCardProps {
  course: Course;
  isAdded: boolean;
  onAddToCalendar: (course: Course) => void;
}

export function CourseCard({ course, isAdded, onAddToCalendar }: CourseCardProps) {
  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <div className="h-1.5" style={{ backgroundColor: course.color }} />
      <CardHeader className="pb-3">
        <CardTitle className="text-lg leading-tight">{course.name}</CardTitle>
        <CardDescription className="flex items-center gap-1.5 text-sm">
          <User className="h-3.5 w-3.5" />
          {course.instructor}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {course.description}
        </p>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          {course.schedule}
        </div>
        <Button
          onClick={() => onAddToCalendar(course)}
          disabled={isAdded}
          className="w-full mt-2"
          variant={isAdded ? "secondary" : "default"}
        >
          {isAdded ? (
            <>
              <Check className="h-4 w-4" />
              Added to Calendar
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              Add to Calendar
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

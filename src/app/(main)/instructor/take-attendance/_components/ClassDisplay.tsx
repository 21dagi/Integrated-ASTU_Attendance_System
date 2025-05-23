import { InstructorClassesResponse } from "@/types/api";

interface ClassDisplayProps {
  class_: InstructorClassesResponse;
}

export function ClassDisplay({ class_ }: ClassDisplayProps) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2">
        <span className="font-medium">{class_.course.code}</span>
        <span className="text-muted-foreground">•</span>
        <span className="font-medium">{class_.course.title}</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Year {class_.section.year_level}</span>
        <span>•</span>
        <span>Section {class_.section.label}</span>
        <span>•</span>
        <span>{class_.semester.name}</span>
        <span>•</span>
        <span>{class_.semester.academic_year}</span>
      </div>
    </div>
  );
}

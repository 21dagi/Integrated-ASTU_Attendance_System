import { ClassCard, ClassCardProps } from "./ClassCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

interface ClassListProps {
  classes: ClassCardProps[];
  className?: string;
}

export const ClassList = ({ classes, className }: ClassListProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredClasses = classes.filter((classItem) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      classItem.course.code.toLowerCase().includes(searchLower) ||
      classItem.course.title.toLowerCase().includes(searchLower) ||
      classItem.instructor.name.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className={className}>
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search classes..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredClasses.length === 0 && (
          <div className="col-span-full text-center text-muted-foreground">
            No classes found
          </div>
        )}
        {filteredClasses.map((classItem) => (
          <ClassCard key={classItem.offering_id} {...classItem} />
        ))}
      </div>
    </div>
  );
};

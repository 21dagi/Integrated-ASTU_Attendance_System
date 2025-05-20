import AllStudentsContent from "@/app/admin/dashboard/students/page"
import  AdmissionContent from "@/app/admin/dashboard/students/admission/page"
import { DashboardContent } from "@/app/admin/dashboard/page"
import { AllTeachersContent } from "@/app/admin/dashboard/teachers/allteachers/page"
import { CoursesPage } from "@/app/admin/dashboard/teachers/courses/page"
interface ContentRendererProps {
  selectedItem: string
}

export function ContentRenderer({ selectedItem }: ContentRendererProps) {
  // Render different content based on the selected menu item
  switch (selectedItem) {
    case "dashboard":
      return <DashboardContent />
    case "all-students":
      return <AllStudentsContent />
    case "student-attendance":
      return <AllStudentsContent/>
    case "admission":
      return <AdmissionContent />
    case "all-teachers":
      return <AllTeachersContent />
    case "attendance":
      return <AllTeachersContent />
    case "courses":
      return <CoursesPage />
    default:
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">{selectedItem}</h2>
            {/* <p className="text-muted-foreground">This content is not implemented yet.</p> */}
          </div>
        </div>
      )
  }
}

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"




const page = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Student Admission</h1>
      <Card>
        <CardHeader>
          <CardTitle>New Student Registration</CardTitle>
          <CardDescription>Add a new student to the system</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="firstName" className="text-sm font-medium">
                First Name
              </label>
              <Input id="firstName" placeholder="Enter first name" />
            </div>
            <div className="space-y-2">
              <label htmlFor="lastName" className="text-sm font-medium">
                Last Name
              </label>
              <Input id="lastName" placeholder="Enter last name" />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input id="email" type="email" placeholder="Enter email address" />
            </div>
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">
                Phone Number
              </label>
              <Input id="phone" placeholder="Enter phone number" />
            </div>
            <div className="space-y-2">
              <label htmlFor="department" className="text-sm font-medium">
                Department
              </label>
              <Input id="department" placeholder="Select department" />
            </div>
            <div className="space-y-2">
              <label htmlFor="year" className="text-sm font-medium">
                Year
              </label>
              <Input id="year" placeholder="Select year" />
            </div>
          </div>
          <Button className="w-full md:w-auto">Register Student</Button>
        </CardContent>
      </Card>
    </div>
  )
}


export default page
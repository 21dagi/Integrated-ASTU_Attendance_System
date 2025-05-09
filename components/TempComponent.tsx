import React from 'react'

export const AdminHome = () => {
  return (
    <div>admin stats</div>
  )
}
export const StudentHome = () => {
    return (
      <div>student home page </div>
    )
  }
  export const InstructorHome = () => {
    return (
      <div>instructor homepage</div>
    )
  }


export const Home= ()=>{
    let role = useSession().user.role

    return (
        <>
            {role === "student" ? <StudentHome /> :
            role === "instructor" ? <InstructorHome /> :
            <AdminHome />}
        </>
    )
}

"use client";
import { useGetStudentClasses } from "@/api/student";
import React from "react";

const StudentClasses = () => {
  const { data, isLoading } = useGetStudentClasses();
  return <div>{JSON.stringify(data)}</div>;
};

export default StudentClasses;

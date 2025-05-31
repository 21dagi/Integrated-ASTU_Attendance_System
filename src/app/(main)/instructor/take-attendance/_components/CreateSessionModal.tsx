"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateSessionForm } from "./CreateSessionForm";
import { InstructorClassesResponse } from "@/types/api";
import { Plus } from "lucide-react";

interface CreateSessionModalProps {
  classes: InstructorClassesResponse[];
  selectedClassId: number;
  onSessionCreated?: () => void;
}

export function CreateSessionModal({
  classes,
  selectedClassId,
  onSessionCreated,
}: CreateSessionModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Session
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Attendance Session</DialogTitle>
          <DialogDescription>
            Create a new attendance session for the selected class.
          </DialogDescription>
        </DialogHeader>
        <CreateSessionForm
          classes={classes}
          onSuccess={() => {
            onSessionCreated?.();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

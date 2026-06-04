"use client";

import React from "react";
import { Assignment } from "../types";
import { AssignmentCard } from "./assignment-card";
import { TaskList } from "@/features/tasks/components/task-list";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Plus } from "lucide-react";

interface AssignmentListProps {
  assignments: Assignment[];
  assignmentsLoading: boolean;
  taskStatus: string;
  setTaskStatus: (status: string) => void;
  isAdmin: boolean;
  onAddAssignmentClick: () => void;
  onEditAssignment: (assignment: Assignment) => void;
  onDeleteAssignmentClick: (assignment: Assignment) => void;
}

export function AssignmentList({
  assignments,
  assignmentsLoading,
  taskStatus,
  setTaskStatus,
  isAdmin,
  onAddAssignmentClick,
  onEditAssignment,
  onDeleteAssignmentClick,
}: AssignmentListProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center  gap-4 border-b border-border pb-2">
        <h3 className="text-lg font-bold text-foreground">
          Assignments ({assignments.length})
        </h3>
        <Select value={taskStatus || "ALL"} onValueChange={setTaskStatus}>
          <SelectTrigger className="w-[180px] rounded-3xl bg-input/50 border-border/80 text-xs h-9 cursor-pointer">
            <SelectValue placeholder="Filter by Task Status" />
          </SelectTrigger>
          <SelectContent className="rounded-3xl border border-border bg-popover text-popover-foreground animate-none">
            <SelectItem
              value="ALL"
              className="rounded-2xl cursor-pointer text-xs"
            >
              All Task Status
            </SelectItem>
            <SelectItem
              value="TODO"
              className="rounded-2xl cursor-pointer text-xs"
            >
              Todo
            </SelectItem>
            <SelectItem
              value="IN_PROGRESS"
              className="rounded-2xl cursor-pointer text-xs"
            >
              In Progress
            </SelectItem>
            <SelectItem
              value="DONE"
              className="rounded-2xl cursor-pointer text-xs"
            >
              Completed
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {assignmentsLoading && assignments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Loader2 className="w-6 h-6 text-primary animate-spin mb-2" />
          <p className="text-sm text-muted-foreground">
            Loading assignments...
          </p>
        </div>
      ) : assignments.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-border rounded-lg bg-muted/20">
          <p className="text-sm text-muted-foreground">
            No assignments found for this project.
          </p>
          {isAdmin && (
            <Button
              onClick={onAddAssignmentClick}
              className="mt-3 flex items-center gap-1 mx-auto"
            >
              <Plus className="w-4 h-4" /> Create First Assignment
            </Button>
          )}
        </div>
      ) : (
        <Accordion
          multiple
          className="w-full space-y-4 border-none bg-transparent"
        >
          {assignments.map((assignment) => (
            <AccordionItem
              key={assignment.id}
              value={assignment.id}
              className="border-none"
            >
              <AccordionTrigger className="p-0 hover:no-underline w-full text-left font-normal border-none flex items-center relative [&>svg]:absolute [&>svg]:right-4 [&>svg]:top-1/2 [&>svg]:-translate-y-1/2 [&>svg]:size-5 [&>svg]:text-muted-foreground [&>svg]:pointer-events-none [&>svg]:transition-transform [&>svg]:duration-200">
                <AssignmentCard
                  assignment={assignment}
                  isAdmin={isAdmin}
                  onEdit={() => onEditAssignment(assignment)}
                  onDelete={() => onDeleteAssignmentClick(assignment)}
                />
              </AccordionTrigger>
              <AccordionContent className="p-0 mt-2">
                <TaskList assignmentId={assignment.id} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
}
